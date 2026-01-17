import uvicorn
from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import List, Optional

# Import the core functions from our AI service layer using a relative import
from .ai_service import get_place_categories, get_place_explanation

# Initialize the FastAPI app
app = FastAPI(
    title="GoWhere AI Service",
    description="Provides AI-powered features for the GoWhere application.",
    version="1.0.0",
)

# --- Pydantic Models for Request Bodies ---
# These models ensure that the data sent to the API has the correct structure and types.

class CategoryRequest(BaseModel):
    vibe: str = Field(..., description="The user's vibe, e.g., 'chill' or 'foodie'.", example="trendy")

class PlaceDetails(BaseModel):
    name: str
    types: Optional[List[str]] = []
    rating: Optional[float] = None
    user_ratings_total: Optional[int] = None
    reviews: Optional[List[str]] = []

class ExplanationRequest(BaseModel):
    vibe: str
    place_details: PlaceDetails

# --- API Endpoints ---

@app.get("/", tags=["Health Check"])
async def read_root():
    """A simple endpoint to check if the API is running."""
    return {"status": "GoWhere AI Service is running!"}

@app.post("/categories", tags=["AI Functions"])
async def get_categories_endpoint(request: CategoryRequest):
    """
    Takes a user's vibe and returns a list of relevant place categories.
    """
    categories = get_place_categories(request.vibe)
    return {"vibe": request.vibe, "categories": categories}

@app.post("/explanation", tags=["AI Functions"])
async def get_explanation_endpoint(request: ExplanationRequest):
    """
    Takes place details and a vibe, and returns an AI-generated explanation.
    """
    # Use model_dump() to convert the Pydantic model to a dictionary
    place_details_dict = request.place_details.model_dump()
    explanation = get_place_explanation(place_details_dict, request.vibe)
    return {"explanation": explanation}

# --- Main block to run the API ---
if __name__ == "__main__":
    # This allows you to run the API directly for testing using `python ai/api.py`,
    # but for development, it's better to use the uvicorn command directly.
    # The command `uvicorn ai.api:app --host 0.0.0.0 --port 8008 --reload`
    # will start the server and automatically reload it when you make changes.
    uvicorn.run("api:app", host="0.0.0.0", port=8008, reload=True)
