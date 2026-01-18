import OpenAI from "openai";
import { getCategories } from "./components/vibeToCategory.js";
import { getExplanation } from "./components/explanationGenerator.js";

// Initialize the OpenAI client once and share it
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * High-level service function to get place category suggestions for a given vibe.
 * This acts as a single entry point for the rest of the application.
 */
export async function getCategoriesForVibe(vibe) {
  return getCategories(openai, vibe);
}

/**
 * High-level service function to generate an AI explanation for a recommended place.
 * This acts as a single entry point for the rest of the application.
 */
export async function generateExplanation(placeDetails, vibe) {
  return getExplanation(openai, placeDetails, vibe);
}
