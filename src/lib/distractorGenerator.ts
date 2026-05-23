import { supabase } from "./supabase";

interface Card {
  id: string;
  spanish: string;
  russian: string;
}

/**
 * Generate 3 distractor options for quiz mode
 * @param correctCard - The correct card
 * @param deckId - Deck to pull distractors from
 * @returns Array of 4 options (1 correct + 3 distractors), shuffled
 */
export async function generateQuizOptions(
  correctCard: Card,
  deckId: string
): Promise<string[]> {
  try {
    // Fetch random cards from same deck (excluding correct answer)
    const { data: cards, error } = await supabase
      .from("cards")
      .select("russian")
      .eq("deck_id", deckId)
      .neq("id", correctCard.id)
      .limit(50); // Get more than needed for better randomness

    if (error) throw error;

    if (!cards || cards.length < 3) {
      // Fallback: not enough cards in deck
      console.warn("Not enough cards for distractors, using fallback");
      return [correctCard.russian];
    }

    // Randomly select 3 distractors
    const shuffled = cards.sort(() => Math.random() - 0.5);
    const distractors = shuffled.slice(0, 3).map((c) => c.russian);

    // Combine correct answer + distractors and shuffle
    const options = [correctCard.russian, ...distractors];
    return options.sort(() => Math.random() - 0.5);
  } catch (error) {
    console.error("Error generating distractors:", error);
    // Fallback: return only correct answer
    return [correctCard.russian];
  }
}
