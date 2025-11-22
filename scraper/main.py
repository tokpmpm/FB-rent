import os
import json
import asyncio
import re
from datetime import datetime, timedelta
from playwright.async_api import async_playwright
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
FACEBOOK_COOKIES = os.getenv("FACEBOOK_COOKIES")
GROUP_URL = "https://www.facebook.com/groups/464870710346711/search?q=%E6%B1%82%E7%A7%9F&filters=eyJycF9jaHJvbm9fc29ydDowIjoie1wibmFtZVwiOlwiY2hyb25vc29ydFwiLFwiYXJnc1wiOlwiXCJ9In0%3D"

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def setup_browser(p):
    browser = await p.chromium.launch(headless=True)
    context = await browser.new_context()
    
    if FACEBOOK_COOKIES:
        try:
            cookies = json.loads(FACEBOOK_COOKIES)
            # Sanitize cookies for Playwright
            for cookie in cookies:
                if "sameSite" in cookie:
                    val = cookie["sameSite"]
                    if val == "no_restriction":
                        cookie["sameSite"] = "None"
                    elif val == "unspecified":
                        cookie["sameSite"] = "Lax"
                    elif val.lower() == "lax":
                        cookie["sameSite"] = "Lax"
                    elif val.lower() == "strict":
                        cookie["sameSite"] = "Strict"
                    elif val.lower() == "none":
                        cookie["sameSite"] = "None"
            await context.add_cookies(cookies)
            print("Cookies loaded successfully.")
        except json.JSONDecodeError:
            print("Error: Invalid JSON in FACEBOOK_COOKIES.")
    else:
        print("Warning: No FACEBOOK_COOKIES provided. Login wall likely.")
        
    return browser, context

async def parse_post(card_text, post_link, poster_name, post_date):
    """
    Use OpenRouter LLM to parse rental post data from raw text.
    Falls back to defaults if LLM fails or API key not set.
    """
    from openai import OpenAI
    
    # Defaults
    data = {
        "post_link": post_link,
        "poster_name": poster_name,
        "post_date": post_date,
        "people_count": "1人",
        "gender": "不明",
        "budget": "未指定預算",
        "type": "未指定房型",
        "job": "",
        "location": "未指定地點",
        "rental_period": "",
        "move_in_date": "隨時",
        "pet": "無",
        "utilities": "",
        "requirements": "",
        "exclusions": "",
        "contact": "",
        "raw_text": card_text
    }
    
    openrouter_api_key = os.getenv("OPENROUTER_API_KEY")
    if not openrouter_api_key:
        print("Warning: OPENROUTER_API_KEY not set. Using default values.")
        return data
    
    try:
        client = OpenAI(
            base_url="https://openrouter.ai/api/v1",
            api_key=openrouter_api_key,
        )
        
        prompt = f"""分析以下租屋貼文，提取所有相關資訊。請以 JSON 格式回應。

貼文內容：
{card_text[:1500]}

請提取以下欄位（如果無法確定，請使用預設值）：

1. people_count: 租客人數（格式：數字+"人"，例如"1人"、"2人"。如果看到"1男1女"請加總為"2人"）

2. gender: 性別要求（"男"/"女"/"男女皆可"/"不明"）

3. budget: 租金預算（僅數字，例如"15000"。**如果是範圍請取最高值**，例如10000~15000取15000。如果有"萬"請轉換成實際數字，例如2萬=20000，3.5萬=35000，3-4萬取40000）

4. type: 房型（例如：套房、雅房、整層住家、電梯大樓等，可以用逗號分隔多個）

5. location: 地點（捷運站、區域名稱，用逗號分隔多個地點）

6. move_in_date: 入住時間
   - 如果看到具體時間如「2025/12」「12月」「1月中」「明年1月」等，請保持原樣
   - 如果看到「隨時」「即可」「立即」「盡快」「當天」，請填「隨時」
   - 如果完全沒提到或不明確，請填「未指定」

7. pet: 寵物狀態（非常重要！請仔細判斷）
   - 如果看到「可寵」「能養貓」「可養貓」「有貓」「養狗」「可接受養狗」「黃金獵犬」等，請填「可」
   - 如果明確說「禁止寵物」「不可養寵物」，請填「禁止」
   - 如果完全沒提到寵物，請填「無」
   - 注意：「可寵」「能養貓」都表示允許寵物，應該要填「可」！

請只回傳純JSON，不要有任何markdown標記，格式如下：
{{"people_count": "2人", "gender": "男女皆可", "budget": "15000", "type": "套房", "location": "中山區, 古亭捷運站", "move_in_date": "12月", "pet": "可"}}"""

        completion = client.chat.completions.create(
            model="x-ai/grok-4.1-fast:free",  # Free Grok 4.1 Fast model on OpenRouter
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1,
            max_tokens=500,
        )
        
        response_text = completion.choices[0].message.content.strip()
        
        # Extract JSON from response (handle markdown code blocks)
        if "```json" in response_text:
            response_text = response_text.split("```json")[1].split("```")[0].strip()
        elif "```" in response_text:
            response_text = response_text.split("```")[1].split("```")[0].strip()
        
        # Parse JSON response
        import json
        llm_data = json.loads(response_text)
        
        # Update data with LLM results
        if llm_data.get("people_count"): 
            data["people_count"] = llm_data["people_count"]
        if llm_data.get("gender"): 
            data["gender"] = llm_data["gender"]
        if llm_data.get("budget") and llm_data["budget"] != "未指定預算": 
            data["budget"] = str(llm_data["budget"]).replace(",", "")
        if llm_data.get("type"): 
            data["type"] = llm_data["type"]
        if llm_data.get("location"): 
            data["location"] = llm_data["location"]
        if llm_data.get("move_in_date"): 
            data["move_in_date"] = llm_data["move_in_date"]
        if llm_data.get("pet"): 
            data["pet"] = llm_data["pet"]
            
        print(f"✓ LLM parsed: {poster_name} - {data['budget']} - {data['type']}")
        
    except Exception as e:
        print(f"LLM parsing failed: {e}. Using defaults.")
    
    return data

async def main():
    async with async_playwright() as p:
        browser, context = await setup_browser(p)
        page = await context.new_page()
        
        print(f"Navigating to {GROUP_URL}...")
        await page.goto(GROUP_URL)
        await page.wait_for_timeout(5000)
        
        # Check login
        if "login" in page.url or await page.locator("text=Log In").count() > 0:
            print("Blocked by Login Wall. Please check cookies.")
            await browser.close()
            return

        # Scroll and load more posts
        for _ in range(5):
            await page.mouse.wheel(0, 1000)
            await page.wait_for_timeout(2000)
        
        # Extract Posts
        # Facebook structure is complex. We look for feed articles.
        posts = await page.locator("div[role='article']").all()
        print(f"Found {len(posts)} posts.")
        
        processed_count = 0
        for post in posts:
            if processed_count >= 40: break
            
            try:
                # IMPORTANT: Expand "See more" within THIS specific post first
                see_more = post.locator("div[role='button']:has-text('顯示更多'), div[role='button']:has-text('See more')").first
                try:
                    if await see_more.is_visible(timeout=1000):
                        await see_more.click()
                        await page.wait_for_timeout(800)  # Wait for expansion
                except:
                    pass  # No "See more" in this post
                
                # Now extract the full text
                text = await post.inner_text()
                
                # Extract Link (Permalink)
                # Usually in the timestamp or date link
                link_el = post.locator("a[href*='/groups/']").first
                link = await link_el.get_attribute("href")
                if link:
                    # Clean link
                    link = link.split('?')[0]
                else:
                    link = "unknown"

                # Extract Poster Name
                name_el = post.locator("h2, h3, strong").first
                name = await name_el.inner_text()
                
                # Extract Date - Parse relative time like "1d", "6h", "2d"
                date_text = ""
                try:
                    # Look for time element in post
                    time_el = post.locator("span, a[href*='/groups/']").filter(has_text=re.compile(r'\d+[hdw]|now|分鐘|小時|天|週')).first
                    if await time_el.count() > 0:
                        date_text = await time_el.inner_text()
                except:
                    pass
                
                # Parse relative time to actual datetime
                now = datetime.now()
                if 'h' in date_text or '小時' in date_text:
                    # Hours ago
                    hours = int(re.search(r'(\d+)', date_text).group(1)) if re.search(r'(\d+)', date_text) else 0
                    actual_date = now - timedelta(hours=hours)
                elif 'd' in date_text or '天' in date_text:
                    # Days ago
                    days = int(re.search(r'(\d+)', date_text).group(1)) if re.search(r'(\d+)', date_text) else 0
                    actual_date = now - timedelta(days=days)
                elif 'w' in date_text or '週' in date_text:
                    # Weeks ago
                    weeks = int(re.search(r'(\d+)', date_text).group(1)) if re.search(r'(\d+)', date_text) else 0
                    actual_date = now - timedelta(weeks=weeks)
                elif '分鐘' in date_text or 'min' in date_text:
                    # Minutes ago
                    mins = int(re.search(r'(\d+)', date_text).group(1)) if re.search(r'(\d+)', date_text) else 0
                    actual_date = now - timedelta(minutes=mins)
                else:
                    # Default to now
                    actual_date = now
                
                date = actual_date.strftime("%Y-%m-%d %H:%M:%S")
                
                post_data = await parse_post(text, link, name, date)
                
                # Manual Upsert for older Supabase lib
                try:
                    # Check if exists
                    existing = supabase.table("rental_posts").select("id").eq("post_link", link).execute()
                    if existing.data and len(existing.data) > 0:
                        # Update
                        record_id = existing.data[0]['id']
                        supabase.table("rental_posts").update(post_data).eq("id", record_id).execute()
                        print(f"Updated: {link}")
                    else:
                        # Insert
                        supabase.table("rental_posts").insert(post_data).execute()
                        print(f"Inserted: {link}")
                except Exception as e:
                    print(f"DB Error: {e}")
                
                processed_count += 1
                
            except Exception as e:
                print(f"Error parsing post: {e}")
                
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
