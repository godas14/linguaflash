import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'

export default function ProfilePage() {
  const user = useAuthStore(state => state.user)
  const profile = useAuthStore(state => state.profile)
  const signOut = useAuthStore(state => state.signOut)
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Сегодня'
    return new Date(dateString).toLocaleDateString('ru-RU')
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
              onClick={handleSignOut}
              className="text-gray-600 hover:text-gray-800"
            >
              Выход
            </button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-4xl">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="Avatar" className="w-full h-full rounded-full" />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-3xl font-bold">{profile?.display_name || profile?.username}</h2>
              <p className="text-gray-600">{user?.email}</p>
              <div className="mt-2">
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                  Level {profile?.level || 1}
                </span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="border rounded-lg p-4">
              <div className="text-gray-600 mb-1">Общий XP</div>
              <div className="text-2xl font-bold">{profile?.xp || 0}</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-600 mb-1">Текущий streak</div>
              <div className="text-2xl font-bold">{profile?.streak || 0} 🔥</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-600 mb-1">Слов изучено</div>
              <div className="text-2xl font-bold">0</div>
            </div>
            <div className="border rounded-lg p-4">
              <div className="text-gray-600 mb-1">Дата регистрации</div>
              <div className="text-lg font-semibold">{formatDate(profile?.created_at || null)}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-4">Достижения</h3>
            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <p className="text-gray-600">Начни учиться, чтобы разблокировать достижения!</p>
              <p className="text-sm text-gray-500 mt-2">Достижения появятся в Phase 7</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
