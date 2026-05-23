import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

interface Deck {
  id: string
  title_es: string
  title_ru: string
  description: string
  level: string
  topic: string
  icon: string
  card_count?: number
}

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const signOut = useAuthStore(state => state.signOut)
  const profile = useAuthStore(state => state.profile)

  useEffect(() => {
    fetchDecks()
  }, [])

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('decks')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      // Get card counts for each deck
      const decksWithCounts = await Promise.all(
        (data || []).map(async (deck) => {
          const { count } = await supabase
            .from('cards')
            .select('*', { count: 'exact', head: true })
            .eq('deck_id', deck.id)
          
          return { ...deck, card_count: count || 0 }
        })
      )

      setDecks(decksWithCounts)
    } catch (error) {
      console.error('Error fetching decks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Загрузка колод...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">LinguaFlash</h1>
          <div className="flex gap-4 items-center">
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Назад
            </button>
            <button 
              onClick={() => navigate('/profile')}
              className="text-gray-600 hover:text-gray-800"
            >
              👤 {profile?.username}
            </button>
            <button 
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
            >
              Выход
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Библиотека колод</h2>
        
        {decks.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">Колоды не найдены</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {decks.map((deck) => (
              <div 
                key={deck.id}
                onClick={() => navigate(`/deck/${deck.id}`)}
                className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer p-6"
              >
                <div className="text-5xl mb-4">{deck.icon}</div>
                <h3 className="text-xl font-bold mb-2">{deck.title_ru}</h3>
                <p className="text-gray-600 text-sm mb-2">{deck.title_es}</p>
                <p className="text-gray-500 text-sm mb-4">{deck.description}</p>
                <div className="flex justify-between items-center">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {deck.level}
                  </span>
                  <span className="text-gray-600 text-sm">
                    {deck.card_count} карточек
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
