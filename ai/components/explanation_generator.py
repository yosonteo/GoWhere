import os
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# --- Configuration ---
# Your OpenAI API Key should be in a .env file in this directory.
# Example: OPENAI_API_KEY="YOUR_API_KEY"
try:
    client = OpenAI(
        api_key=os.environ.get("OPENAI_API_KEY"),
    )
    if not client.api_key:
        raise ValueError("OPENAI_API_KEY not found in .env file or environment variables.")
except ValueError as e:
    print(f"--- Configuration Error ---")
    print(e)
    print("Please ensure your OPENAI_API_KEY is set correctly.")
    print("-----------------------------")
    exit()

# --- Core Function ---

def generate_explanation(place_details: dict, vibe: str) -> str:
    """
    Generates a short, engaging explanation for why a place is recommended.

    Args:
        place_details: A dictionary containing details about the place, such as
                       'name', 'types', 'rating', 'user_ratings_total', and
                       'reviews' (a list of review text snippets).
        vibe: The user's original vibe (e.g., "chill", "food").

    Returns:
        A string containing the AI-generated explanation.
    """
    # Gracefully handle missing data from the input dictionary
    name = place_details.get('name', 'This place')
    # Take the first category from the list of types, if available
    types = place_details.get('types')
    if types:
        category = types[0].replace('_', ' ')
    else:
        category = 'interesting spot'
    rating = place_details.get('rating', 'N/A')
    review_count = place_details.get('user_ratings_total', 'many')
    # Take the first review snippet, if available, otherwise use a default.
    reviews = place_details.get('reviews')
    if reviews:
        top_review = reviews[0]
    else:
        top_review = "It's a popular spot."

    model_name = "gpt-4o-mini"

    prompt_messages = [
        {
            "role": "system",
            "content": "You are a witty and friendly Singaporean guide for the 'GoWhere' app. Your goal is to write a short, snappy, and enticing explanation (2-3 sentences) for why a place is a great stop on a user's hangout route. Use a conversational and slightly informal tone."
        },
        {
            "role": "user",
            "content": f"""
            Generate an explanation based on these details:
            - User's Vibe: "{vibe}"
            - Place Name: "{name}"
            - Place Category: "{category}"
            - Rating: {rating} out of 5 stars
            - Review Count: {review_count} reviews
            - A top review says: "{top_review}"

            Your task: Explain why this is a fantastic recommendation for someone looking for a "{vibe}" experience. Weave in its popularity (based on rating/reviews) naturally.
            """
        }
    ]

    try:
        response = client.chat.completions.create(
            model=model_name,
            messages=prompt_messages,
            temperature=0.8, # Slightly more creative
            max_tokens=150,
        )
        explanation = response.choices[0].message.content.strip()
        return explanation
    except Exception as e:
        print(f"An unexpected error occurred while generating explanation for {name}: {e}")
        return f"Couldn't generate an explanation for {name}, but it seems like a great spot!"


# --- Example Usage ---

if __name__ == "__main__":
    # This is mock data, simulating what the backend might pass to this function.
    # The 'types' and 'reviews' would typically come from a Places API call.
    example_place_1 = {
        "name": "Haji Lane",
        "types": ["shopping_mall", "point_of_interest", "establishment"],
        "rating": 4.7,
        "user_ratings_total": 8200,
        "reviews": ["Such a vibrant area with unique shops and amazing street art. A must-visit!"]
    }
    example_vibe_1 = "trendy"

    print(f"--- Generating explanation for: {example_place_1['name']} ---")
    explanation_1 = generate_explanation(example_place_1, example_vibe_1)
    print("\n--- AI Explanation ---")
    print(explanation_1)
    print("------------------------\n")

    # Another example to test flexibility
    example_place_2 = {
        "name": "MacRitchie Reservoir Park",
        "types": ["park", "tourist_attraction"],
        "rating": 4.8,
        "user_ratings_total": 12000,
        "reviews": ["The Treetop Walk is breathtaking. So peaceful and a great escape from the city."]
    }
    example_vibe_2 = "active"

    print(f"--- Generating explanation for: {example_place_2['name']} ---")
    explanation_2 = generate_explanation(example_place_2, example_vibe_2)
    print("\n--- AI Explanation ---")
    print(explanation_2)
    print("------------------------")
