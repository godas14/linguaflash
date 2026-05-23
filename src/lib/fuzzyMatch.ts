/**
 * Fuzzy matching utility for Type mode
 * Allows 1-character typo using Levenshtein distance
 */

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

/**
 * Normalize string for comparison
 */
function normalize(str: string): string {
  return str.toLowerCase().trim();
}

/**
 * Check if user answer matches correct answer with fuzzy matching
 * @param userAnswer - User's input
 * @param correctAnswer - Correct translation
 * @returns true if match (exact or 1-char typo allowed)
 */
export function fuzzyMatch(userAnswer: string, correctAnswer: string): boolean {
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  // Exact match
  if (user === correct) return true;

  // Allow 1-character typo (Levenshtein distance <= 1)
  return levenshteinDistance(user, correct) <= 1;
}

/**
 * Check if answer is close but not quite right
 * Used for "almost correct" feedback
 */
export function isAlmostCorrect(userAnswer: string, correctAnswer: string): boolean {
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  const distance = levenshteinDistance(user, correct);
  return distance === 2; // 2 chars off
}
