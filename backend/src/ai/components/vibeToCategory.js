const POSSIBLE_CATEGORIES = [
  'amusement_park', 'art_gallery', 'bakery', 'bar', 'book_store',
  'bowling_alley', 'cafe', 'clothing_store', 'department_store',
  'movie_theater', 'museum', 'night_club', 'park', 'restaurant',
  'shopping_mall', 'spa', 'stadium', 'tourist_attraction', 'zoo'
];

/**
 * Uses OpenAI to map a user's vibe to a list of relevant Google Maps Place API categories.
 */
export async function getCategories(openai, vibe) {
  const model = "gpt-4o-mini";
  const messages = [
    {
      role: "system",
      content: `You are an expert hangout planner. Your task is to map a user's "vibe" to a list of relevant Google Places API categories from the provided list. You must return a valid JSON object with a single key "categories" that contains a list of strings. Example: {"categories": ["art_gallery", "book_store", "museum"]} Do not include any categories that are not in this list: ${POSSIBLE_CATEGORIES.join(", ")}. If no categories fit, return an empty list: {"categories": []}`,
    },
    {
      role: "user",
      content: `The user's vibe is: "${vibe}".`
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
      max_tokens: 250,
    });

    const responseContent = response.choices[0].message.content;
    const categoriesData = JSON.parse(responseContent);
    return categoriesData.categories || [];
  } catch (error) {
    console.error(`Error getting categories from OpenAI for vibe '${vibe}':`, error);
    return []; // Return empty list on failure
  }
}