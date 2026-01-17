# ai/ai_service.py

"""
This service module acts as the single entry point for the backend
to interact with the various AI components. It abstracts the underlying
AI logic and provides simple functions for the main application to call.
"""

# Import the core AI functions from the new 'components' sub-directory
from .components.vibe_to_category import get_categories_for_vibe
from .components.explanation_generator import generate_explanation

def get_place_categories(vibe: str) -> list[str]:
    """
    High-level service function to get place category suggestions for a given vibe.

    Args:
        vibe: The user's input vibe.

    Returns:
        A list of relevant Google Places API category strings.
    """
    print(f"AI Service: Getting categories for vibe '{vibe}'...")
    # This directly calls the function from vibe_to_category.py
    return get_categories_for_vibe(vibe)

def get_place_explanation(place_details: dict, vibe: str) -> str:
    """
    High-level service function to generate an AI explanation for a recommended place.

    Args:
        place_details: A dictionary of place details from a Places API (e.g., name, rating, reviews).
        vibe: The user's input vibe.

    Returns:
        An AI-generated explanation string.
    """
    print(f"AI Service: Generating explanation for '{place_details.get('name')}' (vibe: '{vibe}')...")
    # This directly calls the function from explanation_generator.py
    return generate_explanation(place_details, vibe)

# --- Example Usage ---
# This demonstrates how the backend would use this service.

if __name__ == "__main__":
    print("--- Testing AI Service Integration ---")

    # --- Step 1: Simulate backend getting a vibe from the user ---
    user_vibe = "trendy"
    print(f"\nBackend Request: Get Categories for vibe '{user_vibe}'")
    
    # --- Step 2: Backend calls the AI service to get categories ---
    suggested_categories = get_place_categories(user_vibe)
    print(f"Suggested categories received: {suggested_categories}")
    print("-" * 20)

    # --- Step 3: Simulate backend finding a place (using the categories) ---
    # (In a real app, the backend would query Google Maps API with these categories
    # and then provide the place details here.)
    print("\nSimulating Backend: Found a place and now requests an explanation.")
    found_place = {
        "name": "Haji Lane",
        "types": ["shopping_mall", "point_of_interest", "art_gallery"],
        "rating": 4.7,
        "user_ratings_total": 8200,
        "reviews": ["Such a vibrant area with unique shops and amazing street art. A must-visit!"]
    }

    # --- Step 4: Backend calls the AI service to get an explanation for the place ---
    explanation = get_place_explanation(found_place, user_vibe)
    
    print("\n--- AI Explanation Received by Backend ---")
    print(explanation)
    print("-" * 20)
