import os
import json
from openai import OpenAI # Import the OpenAI client
from dotenv import load_dotenv # Import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# To run this, you need an OpenAI API Key.
# 1. Get your key from: https://platform.openai.com/account/api-keys
# 2. Store it in a .env file in your 'ai/' directory: OPENAI_API_KEY="YOUR_API_KEY"
try:
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )
    if not client.api_key:
        raise ValueError("OPENAI_API_KEY environment variable not set.")
except ValueError as e:
    print("--------------------------------------------------------------------------------")
    print(f"--- PLEASE SET YOUR OPENAI_API_KEY IN YOUR .env FILE OR ENVIRONMENT ---")
    print("--- e.g., in ai/.env: OPENAI_API_KEY='your_api_key_here' ---")
    print("--- Get a key from: https://platform.openai.com/account/api-keys ---")
    print("--------------------------------------------------------------------------------")
    exit()
except Exception as e:
    print(f"An unexpected error occurred during OpenAI client initialization: {e}")
    exit()


# --- Constants ---

# A curated list of place types from the Google Places API.
# We've selected a subset most relevant for planning hangouts.
# Full list: https://developers.google.com/maps/documentation/places/web-service/place-types
POSSIBLE_CATEGORIES = [
    'amusement_park', 'art_gallery', 'bakery', 'bar', 'book_store',
    'bowling_alley', 'cafe', 'clothing_store', 'department_store',
    'movie_theater', 'museum', 'night_club', 'park', 'restaurant',
    'shopping_mall', 'spa', 'stadium', 'tourist_attraction', 'zoo'
]

# --- Core Function ---

def get_categories_for_vibe(vibe: str) -> list[str]:
    """
    Uses an OpenAI generative AI model to map a user's vibe to a list of relevant
    Google Maps Place API categories.

    Args:
        vibe: The user's desired vibe (e.g., "chill", "food", "active").

    Returns:
        A list of category strings (e.g., ['cafe', 'park', 'book_store']).
        Returns an empty list if the mapping fails.
    """
    model_name = "gpt-4o-mini"
    prompt_messages = [
        {
            "role": "system",
            "content": f"""You are an expert hangout planner. Your task is to map a user's "vibe" to a list of relevant Google Places API categories from the provided list.
You must return a valid JSON object with a single key "categories" that contains a list of strings.
Example: {{"categories": ["art_gallery", "book_store", "museum"]}}
Do not include any categories that are not in this list: {POSSIBLE_CATEGORIES}
If no categories fit, return an empty list: {{"categories": []}}"""
        },
        {
            "role": "user",
            "content": f"The user's vibe is: \"{vibe}\"."
        }
    ]

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=prompt_messages,
            response_format={"type": "json_object"}, # Instruct the model to respond with JSON
            temperature=0.7,
            max_tokens=250, # Increased max_tokens to prevent truncation
        )

        response_content = response.choices[0].message.content.strip()
        
        # Attempt to parse the response content as JSON.
        categories_data = json.loads(response_content)
        
        # Expect a dictionary with a "categories" key
        return categories_data.get("categories", [])

    except json.JSONDecodeError as e:
        print(f"Error decoding the model's response for vibe '{vibe}': {e}")
        print(f"Model's raw response was (if available): {response_content if 'response_content' in locals() else 'N/A'}")
        return []
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return []

# --- Example Usage ---

if __name__ == "__main__":
    # For the MVP, we are focusing on these core vibes.
    mvp_vibes = ["chill", "food", "active", "tourist", "trendy"]

    print("--- Testing Vibe to Category Mapping ---")
    for vibe in mvp_vibes:
        categories = get_categories_for_vibe(vibe)
        print(f"Vibe: '{vibe}' -> Categories: {categories}")
    print("----------------------------------------")
