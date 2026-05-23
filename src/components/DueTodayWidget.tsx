import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getDueCardsCountByDeck } from '../lib/cardSelection'
import { useAuthStore } from '../stores/authStore'

interface Deck {
  id: string
  title_ru: string
  title_es: string
  icon: string
}

export default function DueTodayWidget() {
  const [decksWithDue, setDecksWithDue] = useState<Array<Deck & { dueCount: number }>>([])
  const [loading, setLoading] = useState(true)
  const [totalDue, setTotalDue] = useState(0)
  const user = useAuthStore(state => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (user) {
      fetchDueCards()
    }
  }, [user])

  const fetchDueCards = async () => {
    try {
      // Get due cards count by deck
      const dueCountByDeck = await getDueCardsCountByDeck(user!.id)

      if (Object.keys(dueCountByDeck).length === 0) {
        setLoading(false)
        return
      }

      // Get deck details
      const deckIds = Object.keys(dueCountByDeck)
      const { data: decks, error } = await supabase
        .from('decks')
        .select('id, title_ru, title_es, icon')
        .in('id', deckIds)

      if (error) throw error

      // Combine deck info with due counts
      const decksWithCounts = (decks || []).map(deck => ({
        ...deck,
        dueCount: dueCountByDeck[deck.id] || 0
      }))

      // Sort by due count (highest first)
      decksWithCounts.sort((a, b) => b.dueCount - a.dueCount)

      setDecksWithDue(decksWithCounts)
      setTotalDue(Object.values(dueCountByDeck).reduce((sum, count) => sum + count, 0))
    } catch (error) {
      console.error('Error fetching due cards:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStartStudy = (deckId: string) => {
    navigate(`/study/${deckId}`)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="space-y-3">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (totalDue === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">✅</span>
          <h3 className="text-xl font-bold">Карточки на сегодня</h3>
        </div>
        <p className="text-gray-600">
          Отличная работа! У вас нет карточек для повторения сегодня.
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Возвращайтесь завтра для новых повторений!
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🔥</span>
          <h3 className="text-xl font-bold">Карточки на сегодня</h3>
        </div>
        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-bold text-lg">
          {totalDue}
        </div>
      </div>

      <div className="space-y-3">
        {decksWithDue.map(deck => (
          <div
            key={deck.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer"
            onClick={() => handleStartStudy(deck.id)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{deck.icon}</span>
              <div>
                <div className="font-semibold">{deck.title_ru}</div>
                <div className="text-sm text-gray-600">{deck.title_es}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                {deck.dueCount}
              </span>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
                Изучить
              </button>
            </div>
          </div>
        ))}
      </div>

      {totalDue > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            💡 <strong>Совет:</strong> Регулярное повторение помогает лучше запоминать слова!
          </p>
        </div>
      )}
    </div>
  )
}
