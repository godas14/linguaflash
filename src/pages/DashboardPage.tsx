import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import DueTodayWidget from "../components/DueTodayWidget";
import XPChart from "../components/XPChart";

export default function DashboardPage() {
  const profile = useAuthStore((state) => state.profile);
  const signOut = useAuthStore((state) => state.signOut);
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">LinguaFlash</h1>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => navigate("/achievements")}
              className="text-gray-600 hover:text-gray-800 flex items-center gap-2"
            >
              🏆 Достижения
            </button>
            <button
              onClick={() => navigate("/profile")}
              className="text-gray-600 hover:text-gray-800"
            >
              👤 {profile?.username || "Usuario"}
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
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">
            Добро пожаловать, {profile?.display_name || profile?.username}! 👋
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-lg border-2 border-orange-200">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-3xl">🔥</span>
                <span className="text-sm font-semibold text-orange-700">
                  STREAK
                </span>
              </div>
              <div className="text-3xl font-bold text-orange-600">
                {profile?.streak || 0}
              </div>
              <div className="text-gray-600 text-sm mt-1">
                {profile?.streak === 1
                  ? "день подряд"
                  : profile?.streak && profile.streak < 5
                    ? "дня подряд"
                    : "дней подряд"}
              </div>
              {profile?.streak && profile.streak >= 7 && (
                <div className="mt-2 text-xs text-orange-600 font-semibold">
                  🎉 Отличная серия!
                </div>
              )}
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-bold">
                Level {profile?.level || 1}
              </div>
              <div className="text-gray-600">{profile?.xp || 0} XP</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-3xl mb-2">📚</div>
              <div className="text-2xl font-bold">0</div>
              <div className="text-gray-600">Слов изучено</div>
            </div>
          </div>
        </div>

        {/* Due Today Widget */}
        <div className="mb-6">
          <DueTodayWidget />
        </div>

        {/* XP Chart */}
        <div className="mb-6">
          <XPChart />
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold">Доступные колоды</h3>
            <button
              onClick={() => navigate("/decks")}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Смотреть все колоды →
            </button>
          </div>
          <p className="text-gray-600">
            5 колод • 500 карточек • Испанский ↔ Русский
          </p>
          <div className="mt-4 flex gap-4">
            <div className="text-4xl">🍕</div>
            <div className="text-4xl">✈️</div>
            <div className="text-4xl">🏠</div>
            <div className="text-4xl">🎯</div>
            <div className="text-4xl">⭐</div>
          </div>
        </div>
      </div>
    </div>
  );
}
