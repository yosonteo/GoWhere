import { Client } from "@googlemaps/google-maps-services-js";
import { scorePlace } from "./scoreService.js";

const client = new Client({});
const SEARCH_RADIUS = 5000; // 5km

// Construct the AI Service URL from the host provided by Render, with a fallback for local development
const AI_SERVICE_HOST = process.env.AI_SERVICE_HOST;
const AI_SERVICE_URL = AI_SERVICE_HOST ? `https://${AI_SERVICE_HOST}` : "http://localhost:8008";


/**
 * Geocodes a location string to latitude and longitude.
 */
async function geocodeLocation(location) {
  console.log(`Geocoding location: "${location}"...`);
  try {
    const response = await client.geocode({
      params: {
        address: location,
        componentRestrictions: { country: "SG" }, // Bias to Singapore
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 2000,
    });

    if (response.data.status !== 'OK' || response.data.results.length === 0) {
      throw new Error(`Geocoding failed: ${response.data.status} - ${response.data.error_message || 'No results found.'}`);
    }

    const { lat, lng } = response.data.results[0].geometry.location;
    console.log(`Geocoded to: { lat: ${lat}, lng: ${lng} }`);
    return { lat, lng };

  } catch (error) {
    console.error("Error geocoding location:", error.response?.data?.error_message || error.message);
    throw new Error(`Could not find coordinates for location: "${location}"`);
  }
}

/**
 * Fetches place categories from the AI service.
 */
async function getCategoriesFromAI(vibe) {
  console.log(`Getting categories for vibe: '${vibe}'...`);
  try {
    const response = await fetch(`${AI_SERVICE_URL}/categories`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vibe }),
    });
    if (!response.ok) throw new Error(`AI service returned status: ${response.status}`);
    const data = await response.json();
    console.log(`AI suggested categories: ${data.categories?.join(", ")}`);
    return data.categories || [];
  } catch (error) {
    console.error("Error fetching categories from AI service, using fallback.", error.message);
    return ["cafe", "park", "restaurant"]; // Fallback categories
  }
}

/**
 * Fetches places from Google Places API based on a list of types.
 */
async function fetchPlacesFromGoogle(lat, lng, types) {
  console.log(`Searching for places near (${lat}, ${lng}) with types: ${types.join(", ")}`);
  
  const searchRequests = types.map(type => {
    return client.placesNearby({
      params: {
        location: { lat, lng },
        radius: SEARCH_RADIUS,
        type,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 2000, // ms for each request
    }).catch(e => {
      console.error(`Google Places API error for type '${type}':`, e.response?.data?.error_message || e.message);
      return null; // Return null on error to avoid breaking Promise.all
    });
  });

  const searchResults = await Promise.all(searchRequests);

  const places = searchResults
    .map((result, index) => {
      if (result && result.data && result.data.results) {
        const type = types[index];
        return result.data.results.map(p => ({
          id: p.place_id,
          name: p.name,
          type: type,
          rating: p.rating || 0,
          reviews: p.user_ratings_total || 0,
          lat: p.geometry?.location.lat,
          lng: p.geometry?.location.lng,
        }));
      }
      return [];
    })
    .flat();
    
  const uniquePlaces = Array.from(new Map(places.map(p => [p.id, p])).values());
  console.log(`Found ${uniquePlaces.length} unique places from Google.`);
  return uniquePlaces;
}

/**
 * Gets a list of suggested stops by orchestrating AI and Google Places API calls.
 */
export async function getSuggestedStops({ vibe = "chill", location, stops = 10 }) {
  // 0. Geocode the location string to get coordinates
  const { lat, lng } = await geocodeLocation(location);

  // 1. Get categories from our AI service
  const allowedTypes = await getCategoriesFromAI(vibe);
  if (!allowedTypes || allowedTypes.length === 0) {
    console.log("No categories returned from AI, returning empty list.");
    return [];
  }

  // 2. Fetch a list of unique places from Google based on these categories
  const places = await fetchPlacesFromGoogle(lat, lng, allowedTypes);

  // 3. Score all the fetched places
  const scored = places.map(p => ({
    ...p,
    score: scorePlace(p),
  }));

  // 4. Sort by score and get the top N results
  scored.sort((a, b) => b.score - a.score);
  const topPlaces = scored.slice(0, stops);

  // 5. Get AI explanations for each of the top places in parallel
  const explanationPromises = topPlaces.map(async (place) => {
    try {
      console.log(`Getting AI explanation for ${place.name}...`);
      const response = await fetch(`${AI_SERVICE_URL}/explanation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vibe,
          place_details: {
            name: place.name,
            types: [place.type],
            rating: place.rating,
            user_ratings_total: place.reviews,
            reviews: []
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

  const placesWithExplanations = await Promise.all(explanationPromises);

  return placesWithExplanations;
}
