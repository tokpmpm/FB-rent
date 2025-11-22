import asyncio
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def check_amber():
    response = supabase.table("rental_posts").select("*").eq("poster_name", "Amber Hyun").execute()
    if response.data:
        post = response.data[0]
        print(f"Name: {post['poster_name']}")
        print(f"Budget: {post['budget']}")
        print(f"People Count: {post['people_count']}")
        print(f"Type: {post['type']}")
        print(f"Location: {post['location']}")
        print(f"Gender: {post['gender']}")

if __name__ == "__main__":
    asyncio.run(check_amber())
