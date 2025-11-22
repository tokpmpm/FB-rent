import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Fetch all posts
response = supabase.table("rental_posts").select("poster_name, move_in_date, pet, raw_text").execute()
posts = response.data

print("Currently parsed data:\n")
for post in posts[:5]:  # Show first 5 posts
    print(f"Name: {post['poster_name']}")
    print(f"Move-in Date: {post['move_in_date']}")
    print(f"Pet: {post['pet']}")
    print(f"\nRaw text snippet (first 500 chars):")
    print(post['raw_text'][:500])
    print("=" * 80)
    print()
