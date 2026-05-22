export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">LinguaFlash</h1>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">👤 Usuario</span>
            <button className="text-gray-600 hover:text-gray-800">Выход</button>
          </div>
        </div>
      </nav>
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Добро пожаловать! 👋</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">🔥</div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-600">Дней подряд</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold">Level 1</div>
              <div className="text-gray-600">0 XP</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-600">Слов изучено</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-bold mb-4">Доступные колоды</h3>
          <p className="text-gray-600">Колоды появятся после настройки Supabase...</p>
        </div>
      </div>
    </div>
  )
}
