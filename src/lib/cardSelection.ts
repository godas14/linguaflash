import { supabase } from './supabase'

interface Card {
  id: string
  deck_id: string
  spanish: string
  russian: string
  examples: string[]
  example_es?: string
  example_ru?: string
  part_of_speech?: string
  difficulty: number
}

interface CardWithProgress extends Card {
  next_review?: string
  times_seen?: number
  state?: string
}

/**
 * Get cards for study session with smart prioritization
 * Priority: overdue cards > new cards
 * @param deckId - Deck to study from
 * @param userId - Current user ID
 * @param limit - Number of cards to return (default 20)
 * @returns Array of cards sorted by priority
 */
export async function getDueCards(
  deckId: string,
  _userId: string,
  limit: number = 20
): Promise<Card[]> {
  try {
    // Get all cards from deck with user progress
    const { data: cardsWithProgress, error } = await supabase
      .from('cards')
      .select(`
        *,
        user_card_progress!left (
          next_review,
          times_seen,
          state
        )
      `)
      .eq('deck_id', deckId)
      .limit(100) // Get more than needed for filtering

    if (error) throw error

    const now = new Date()
    const cards = cardsWithProgress || []

    // Separate cards into categories
    const dueCards: CardWithProgress[] = []
    const newCards: CardWithProgress[] = []

    cards.forEach((card: any) => {
      const progress = card.user_card_progress?.[0]

      if (!progress || !progress.next_review) {
        // New card (never studied)
        newCards.push(card)
      } else {
        const nextReview = new Date(progress.next_review)
        if (nextReview <= now) {
          // Due for review
          dueCards.push({
            ...card,
            next_review: progress.next_review,
            times_seen: progress.times_seen,
            state: progress.state
          })
        }
      }
    })

    // Sort due cards by urgency (oldest first)
    dueCards.sort((a, b) => {
      const dateA = new Date(a.next_review!).getTime()
      const dateB = new Date(b.next_review!).getTime()
      return dateA - dateB
    })

    // Shuffle new cards
    newCards.sort(() => Math.random() - 0.5)

    // Combine: 80% due cards, 20% new cards
    const dueCount = Math.min(dueCards.length, Math.ceil(limit * 0.8))
    const newCount = Math.min(newCards.length, limit - dueCount)

    const selectedCards = [
      ...dueCards.slice(0, dueCount),
      ...newCards.slice(0, newCount)
    ]

    // If we don't have enough cards, fill with remaining
    if (selectedCards.length < limit) {
      const remaining = limit - selectedCards.length
      const allRemaining = [...dueCards.slice(dueCount), ...newCards.slice(newCount)]
      selectedCards.push(...allRemaining.slice(0, remaining))
    }

    // Shuffle the final selection to mix due and new cards
    return selectedCards.sort(() => Math.random() - 0.5)
  } catch (error) {
    console.error('Error getting due cards:', error)
    // Fallback to random cards
    const { data: fallbackCards } = await supabase
      .from('cards')
      .select('*')
      .eq('deck_id', deckId)
      .limit(limit)

    return (fallbackCards || []).sort(() => Math.random() - 0.5)
  }
}

/**
 * Get count of cards due for review today
 * @param deckId - Deck to check (optional, if omitted returns total across all decks)
 * @param userId - Current user ID
 * @returns Number of cards due today
 */
export async function getDueCardsCount(
  _userId: string,
  deckId?: string
): Promise<number> {
  try {
    let query = supabase
      .from('user_card_progress')
      .select('card_id', { count: 'exact', head: true })
      .eq('user_id', _userId)
      .lte('next_review', new Date().toISOString())

    if (deckId) {
      // Filter by deck
      const { data: cardIds } = await supabase
        .from('cards')
        .select('id')
        .eq('deck_id', deckId)

      if (cardIds && cardIds.length > 0) {
        query = query.in('card_id', cardIds.map(c => c.id))
      }
    }

    const { count, error } = await query

    if (error) throw error
    return count || 0
  } catch (error) {
    console.error('Error getting due cards count:', error)
    return 0
  }
}

/**
 * Get due cards count per deck
 * @param userId - Current user ID
 * @returns Map of deck_id to due count
 */
export async function getDueCardsCountByDeck(
  _userId: string
): Promise<Record<string, number>> {
  try {
    // Get all user progress with due cards
    const { data: dueProgress, error } = await supabase
      .from('user_card_progress')
      .select('card_id')
      .eq('user_id', _userId)
      .lte('next_review', new Date().toISOString())

    if (error) throw error
    if (!dueProgress || dueProgress.length === 0) return {}

    // Get deck_id for each card
    const cardIds = dueProgress.map(p => p.card_id)
    const { data: cards } = await supabase
      .from('cards')
      .select('id, deck_id')
      .in('id', cardIds)

    if (!cards) return {}

    // Count by deck
    const countByDeck: Record<string, number> = {}
    cards.forEach(card => {
      countByDeck[card.deck_id] = (countByDeck[card.deck_id] || 0) + 1
    })

    return countByDeck
  } catch (error) {
    console.error('Error getting due cards count by deck:', error)
    return {}
  }
}
