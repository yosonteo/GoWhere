/**
 * Generates a short, engaging explanation for why a place is recommended.
 */
export async function getExplanation(openai, placeDetails, vibe) {
  const {
    name = 'This place',
    types = ['interesting spot'],
    rating = 'N/A',
    reviews: review_count = 'many', // 'reviews' from the input is the review count
  } = placeDetails;

  const category = types[0] ? types[0].replace(/_/g, ' ') : 'interesting spot';
  
  // We don't get actual review text from the Google Places API in this flow,
  // so we use a placeholder consistent with the original Python code's fallback.
  const top_review_placeholder = "It's a popular spot.";

  const model = "gpt-4o-mini";
  const messages = [
    {
      role: "system",
      content: "You are a witty and friendly Singaporean guide for the 'GoWhere' app. Your goal is to write a short, snappy, and enticing explanation (2-3 sentences) for why a place is a great stop on a user's hangout route. Use a conversational and slightly informal tone."
    },
    {
      role: "user",
      content: `
        Generate an explanation based on these details:
        - User's Vibe: "${vibe}"
        - Place Name: "${name}"
        - Place Category: "${category}"
        - Rating: ${rating} out of 5 stars
        - Review Count: ${review_count} reviews
        - A top review says: "${top_review_placeholder}"

        Your task: Explain why this is a fantastic recommendation for someone looking for a "${vibe}" experience. Weave in its popularity (based on rating/reviews) naturally.
      `
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model,
      messages,
      temperature: 0.8,
      max_tokens: 150,
    });
    return response.choices[0].message.content.trim() || `Check out ${name}, it's a great spot!`;
  } catch (error) {
    console.error(`Error generating explanation for ${name}:`, error);
    return `Couldn't generate an explanation for ${name}, but it seems like a great spot!`;
  }
}