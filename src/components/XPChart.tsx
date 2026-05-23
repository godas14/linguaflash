import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'

interface DayXP {
  date: string
  xp: number
}

export default function XPChart() {
  const [data, setData] = useState<DayXP[]>([])
  const [loading, setLoading] = useState(true)
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    if (user) {
      fetchXPData()
    }
  }, [user])

  const fetchXPData = async () => {
    try {
      // Get last 7 days
      const today = new Date()
      const sevenDaysAgo = new Date(today)
      sevenDaysAgo.setDate(today.getDate() - 6)

      // Fetch study sessions from last 7 days
      const { data: sessions, error } = await supabase
        .from('study_sessions')
        .select('completed_at, xp_earned')
        .eq('user_id', user!.id)
        .gte('completed_at', sevenDaysAgo.toISOString())
        .order('completed_at', { ascending: true })

      if (error) throw error

      // Group by date
      const xpByDate: Record<string, number> = {}

      // Initialize all 7 days with 0
      for (let i = 0; i < 7; i++) {
        const date = new Date(sevenDaysAgo)
        date.setDate(sevenDaysAgo.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        xpByDate[dateStr] = 0
      }

      // Sum XP by date
      sessions?.forEach(session => {
        if (session.completed_at) {
          const dateStr = session.completed_at.split('T')[0]
          xpByDate[dateStr] = (xpByDate[dateStr] || 0) + (session.xp_earned || 0)
        }
      })

      // Convert to array
      const chartData = Object.entries(xpByDate).map(([date, xp]) => ({
        date,
        xp
      }))

      setData(chartData)
    } catch (error) {
      console.error('Error fetching XP data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-40 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const maxXP = Math.max(...data.map(d => d.xp), 100)
  const totalXP = data.reduce((sum, d) => sum + d.xp, 0)

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold">Прогресс за неделю</h3>
        <div className="text-sm text-gray-600">
          Всего: <span className="font-bold text-blue-600">{totalXP} XP</span>
        </div>
      </div>

      <div className="flex items-end justify-between gap-2 h-40">
        {data.map((day) => {
          const height = maxXP > 0 ? (day.xp / maxXP) * 100 : 0
          const date = new Date(day.date)
          const dayName = date.toLocaleDateString('ru-RU', { weekday: 'short' })

          return (
            <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex flex-col items-center justify-end h-32">
                {day.xp > 0 && (
                  <div className="text-xs font-semibold text-blue-600 mb-1">
                    {day.xp}
                  </div>
                )}
                <div
                  className={`w-full rounded-t-lg transition-all ${
                    day.xp > 0
                      ? 'bg-gradient-to-t from-blue-500 to-blue-400'
                      : 'bg-gray-200'
                  }`}
                  style={{ height: `${Math.max(height, 5)}%` }}
                />
              </div>
              <div className="text-xs text-gray-600 font-medium">
                {dayName}
              </div>
            </div>
          )
        })}
      </div>

      {totalXP === 0 && (
        <div className="mt-4 text-center text-gray-500 text-sm">
          Начните изучать карточки, чтобы увидеть свой прогресс!
        </div>
      )}
    </div>
  )
}
