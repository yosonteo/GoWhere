import { scorePlace } from "./scoreService.js";

/**
 * Mock places dataset (Singapore-based)
 * Coordinates roughly within Singapore bounds
 */
const MOCK_PLACES = [
  { id: 1, name: "Kurasu Cafe", type: "cafe", rating: 4.6, reviews: 1200, lat: 1.3009, lng: 103.8390 },
  { id: 2, name: "Botanist Cafe", type: "cafe", rating: 4.5, reviews: 900, lat: 1.3138, lng: 103.8159 },
  { id: 3, name: "Haji Lane Gelato", type: "dessert", rating: 4.4, reviews: 700, lat: 1.3006, lng: 103.8590 },
  { id: 4, name: "PS.Cafe Ann Siang", type: "restaurant", rating: 4.3, reviews: 1500, lat: 1.2803, lng: 103.8466 },
  { id: 5, name: "Tiong Bahru Bakery", type: "restaurant", rating: 4.6, reviews: 3000, lat: 1.2841, lng: 103.8323 },
  { id: 6, name: "Singapore Botanic Gardens", type: "park", rating: 4.8, reviews: 18000, lat: 1.3138, lng: 103.8159 },
  { id: 7, name: "Fort Canning Park", type: "park", rating: 4.6, reviews: 9000, lat: 1.2920, lng: 103.8467 },
  { id: 8, name: "National Gallery Singapore", type: "museum", rating: 4.7, reviews: 12000, lat: 1.2905, lng: 103.8515 },
  { id: 9, name: "ArtScience Museum", type: "museum", rating: 4.6, reviews: 10000, lat: 1.2863, lng: 103.8593 },
  { id: 10, name: "Marina Bay Sands SkyPark", type: "viewpoint", rating: 4.7, reviews: 20000, lat: 1.2834, lng: 103.8607 },
  { id: 11, name: "Mount Faber Peak", type: "viewpoint", rating: 4.5, reviews: 8000, lat: 1.2720, lng: 103.8186 },
  { id: 12, name: "Gardens by the Bay", type: "attraction", rating: 4.8, reviews: 25000, lat: 1.2816, lng: 103.8636 },
];

/**
 * Returns up to 3 suggested stops for MVP
 */
export async function getSuggestedStops({ vibe = "chill", lat, lng, time }) {
  console.log(`Getting suggestions for vibe: ${vibe}`);

  // Step 1: Call the AI service to get categories for the vibe
  let allowedTypes = [];
  try {
    const aiServiceUrl = "http://localhost:8008/categories";
    const response = await fetch(aiServiceUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vibe }),
    });

    if (!response.ok) {
      throw new Error(`AI service returned status: ${response.status}`);
    }

    const data = await response.json();
    allowedTypes = data.categories || [];
    console.log(`AI suggested categories: ${allowedTypes.join(", ")}`);

  } catch (error) {
    console.error("Error fetching categories from AI service:", error);
    // Fallback to a default set of categories if AI service fails
    allowedTypes = ["cafe", "park", "restaurant"];
  }

  // Filter places by allowed types
  const filtered = MOCK_PLACES.filter(p => allowedTypes.includes(p.type));

  // Score places
  const scored = filtered.map(p => ({
    ...p,
    score: scorePlace(p),
  }));

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Ensure diversity: max 1 per type if possible
  const result = [];
  const usedTypes = new Set();

  for (const place of scored) {
    if (result.length >= 3) break;

    if (!usedTypes.has(place.type)) {
      result.push(place);
      usedTypes.add(place.type);
    }
  }

  // Fallback: fill remaining slots if diversity not possible
  for (const place of scored) {
    if (result.length >= 3) break;
    if (!result.includes(place)) {
      result.push(place);
    }
  }

  // Step 3: Get AI explanations for each of the top 3 places
  const explanationPromises = result.map(async (place) => {
    try {
      console.log(`Getting AI explanation for ${place.name}...`);
      const aiServiceUrl = "http://localhost:8008/explanation";
      const response = await fetch(aiServiceUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe,
          place_details: {
            name: place.name,
            types: [place.type],
            rating: place.rating,
            user_ratings_total: place.reviews,
            reviews: [] // Sending empty reviews for now, as per mock data
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`AI explanation service returned status: ${response.status}`);
      }

      const data = await response.json();
      return {
        ...place,
        explanation: data.explanation || "No explanation available.",
      };
    } catch (error) {
      console.error(`Error fetching explanation for ${place.name}:`, error);
      return {
        ...place,
        explanation: "Could not generate an explanation at this time.",
      };
    }
  });

  const stopsWithExplanations = await Promise.all(explanationPromises);

  return stopsWithExplanations;
}
