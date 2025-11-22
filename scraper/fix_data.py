import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from main import parse_post  # Import the improved parsing logic

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set.")
    exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def fix_data():
    print("Fetching all posts from Supabase...")
    # Fetch all posts that have raw_text
    response = supabase.table("rental_posts").select("*").execute()
    posts = response.data
    
    print(f"Found {len(posts)} posts. Starting re-parse...")
    
    updated_count = 0
    for post in posts:
        if not post.get("raw_text"):
            continue
            
        # Re-parse the data
        # Note: parse_post expects (card_text, post_link, poster_name, post_date)
        # We use existing values for link, name, date if we don't want to change them, 
        # but parse_post might extract better ones if we passed them. 
        # However, parse_post logic for name/date is simple/passed-in.
        # The regex logic is inside parse_post for budget, type, location, gender.
        
        new_data = await parse_post(
            post["raw_text"], 
            post["post_link"], 
            post["poster_name"], 
            post["post_date"]
        )
        
        # We only want to update specific fields that might be missing or improved
        update_payload = {
            "budget": new_data["budget"],
            "type": new_data["type"],
            "location": new_data["location"],
            "gender": new_data["gender"],
            "people_count": new_data["people_count"],
            "move_in_date": new_data["move_in_date"],
            "pet": new_data["pet"]
        }
        
        # Only update if changed (optional optimization, but Supabase handles it)
        try:
            supabase.table("rental_posts").update(update_payload).eq("id", post["id"]).execute()
            print(f"Updated: {post['poster_name']} - {new_data['budget']} - {new_data['type']}")
            updated_count += 1
        except Exception as e:
            print(f"Error updating post {post['id']}: {e}")
        
        # Add delay to avoid rate limiting (4 seconds between requests)
        await asyncio.sleep(1)
            
    print(f"Finished updating {updated_count} posts.")

if __name__ == "__main__":
    asyncio.run(fix_data())
