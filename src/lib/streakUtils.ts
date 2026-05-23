/**
 * Calculate days between two dates
 * @param date1 - First date (YYYY-MM-DD format)
 * @param date2 - Second date (YYYY-MM-DD format)
 * @returns Number of days between dates
 */
export function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1)
  const d2 = new Date(date2)
  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays
}

/**
 * Calculate new streak based on last study date
 * @param lastStudyDate - Last study date (YYYY-MM-DD format or null)
 * @param currentStreak - Current streak count
 * @returns New streak count
 */
export function calculateStreak(
  lastStudyDate: string | null,
  currentStreak: number
): number {
  const today = new Date().toISOString().split('T')[0]

  if (!lastStudyDate) {
    // First time studying
    return 1
  }

  if (lastStudyDate === today) {
    // Already studied today, keep current streak
    return currentStreak
  }

  const daysDiff = daysBetween(lastStudyDate, today)

  if (daysDiff === 1) {
    // Consecutive day - increment streak
    return currentStreak + 1
  } else {
    // Streak broken - reset to 1
    return 1
  }
}

/**
 * Get today's date in YYYY-MM-DD format
 * @returns Today's date string
 */
export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

/**
 * Check if user has already studied today
 * @param lastStudyDate - Last study date (YYYY-MM-DD format or null)
 * @returns True if already studied today
 */
export function hasStudiedToday(lastStudyDate: string | null): boolean {
  if (!lastStudyDate) return false
  const today = getTodayDate()
  return lastStudyDate === today
}
