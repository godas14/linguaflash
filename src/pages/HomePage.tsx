import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-6xl font-bold mb-6">
          🇪🇸 LinguaFlash
        </h1>
        <p className="text-2xl mb-4">
          Учи испанский с умными карточками
        </p>
        <p className="text-lg mb-8 opacity-90">
          Геймификация • Spaced Repetition • 5 режимов обучения
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            to="/register"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition"
          >
            Начать бесплатно
          </Link>
          <Link 
            to="/login"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition"
          >
            Войти
          </Link>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-4xl mb-3">🃏</div>
            <h3 className="text-xl font-semibold mb-2">Умные карточки</h3>
            <p className="opacity-90">Spaced repetition алгоритм запоминает, когда показать карточку снова</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-4xl mb-3">🎮</div>
            <h3 className="text-xl font-semibold mb-2">Геймификация</h3>
            <p className="opacity-90">XP, уровни, streak, достижения — учись играя</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
            <div className="text-4xl mb-3">📱</div>
            <h3 className="text-xl font-semibold mb-2">Везде с тобой</h3>
            <p className="opacity-90">Работает на любом устройстве — телефон, планшет, компьютер</p>
          </div>
        </div>

        <div className="mt-12 text-sm opacity-75">
          MVP • 500 слов • A1-A2 уровень • Испанский ↔ Русский
        </div>
      </div>
    </div>
  )
}
