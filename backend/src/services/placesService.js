import { Client } from "@googlemaps/google-maps-services-js";
import { vibeToTypes } from "../utils/vibeMap.js";
import { scorePlace } from "./scoreService.js";

const client = new Client({});

/**
 * Returns up to 3 suggested stops for MVP
 */
export async function getSuggestedStops({ vibe, lat, lng, time }) {
  // Default to chill if unknown vibe
  const selectedVibe = vibeToTypes[vibe] ? vibe : "chill";
  const allowedTypes = vibeToTypes[selectedVibe];

  // Search for places using Google Places API
  const searchRequests = allowedTypes.map(type => {
    return client.placesNearby({
      params: {
        location: { lat, lng },
        radius: 5000, // 5km radius
        type,
        key: process.env.GOOGLE_MAPS_API_KEY,
      },
      timeout: 1000, // ms
    });
  });

  const searchResults = await Promise.all(searchRequests.map(p => p.catch(e => e)));

  const places = searchResults
    .filter(result => result.data && result.data.results)
    .flatMap(result =>
      result.data.results.map(p => ({
        id: p.place_id,
        name: p.name,
        type: result.request.config.params.type, // Use the type from the original request
        rating: p.rating,
        reviews: p.user_ratings_total,
        lat: p.geometry.location.lat,
        lng: p.geometry.location.lng,
      }))
    );

  // Score places
  const scored = places.map(p => ({
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

  return result;
}
