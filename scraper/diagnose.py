import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from main import parse_post

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def diagnose():
    print("Fetching posts with missing budget or people_count...")
    response = supabase.table("rental_posts").select("*").execute()
    posts = response.data
    
    for post in posts:
        # Re-parse
        new_data = await parse_post(
            post["raw_text"], 
            post["post_link"], 
            post["poster_name"], 
            post["post_date"]
        )
        
        # Show issues
        if post["budget"] == "未指定預算" or post["people_count"] == "1人":
            print(f"\n{'='*80}")
            print(f"Name: {post['poster_name']}")
            print(f"Current Budget: {post['budget']} → New: {new_data['budget']}")
            print(f"Current People: {post['people_count']} → New: {new_data['people_count']}")
            print(f"\nRaw Text (first 500 chars):")
            print(post['raw_text'][:500])
            print("...")

if __name__ == "__main__":
    asyncio.run(diagnose())
