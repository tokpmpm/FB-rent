import asyncio
import os
import re
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

async def debug_amber():
    response = supabase.table("rental_posts").select("*").eq("poster_name", "Amber Hyun").execute()
    if response.data:
        post = response.data[0]
        card_text = post['raw_text']
        
        print("Testing regex patterns on Amber Hyun's post:")
        print("=" * 80)
        
        # Test composite pattern
        composite_match = re.search(r'[【\[](?:租客|人數)[】\]][：:]\s*(\d+)男(\d+)女', card_text)
        print(f"\nComposite pattern (1男1女): {composite_match}")
        if composite_match:
            print(f"  Match found! Groups: {composite_match.groups()}")
            total = int(composite_match.group(1)) + int(composite_match.group(2))
            print(f"  Total people: {total}")
        
        # Test standard pattern
        people_match = re.search(r'[【\[](?:人數|求租人數|租客)[】\]][：:]\s*([一二兩三四五六七八九十\d]+)\s*[人位]?[男女]?', card_text)
        print(f"\nStandard pattern: {people_match}")
        if people_match:
            print(f"  Match found! Group 1: '{people_match.group(1)}'")
        
        # Show relevant part of raw text
        if '[租客]' in card_text:
            idx = card_text.index('[租客]')
            print(f"\nRaw text around [租客]:")
            print(repr(card_text[idx:idx+30]))

if __name__ == "__main__":
    asyncio.run(debug_amber())
