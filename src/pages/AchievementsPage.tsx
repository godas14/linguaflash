import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import {
  getUserAchievements,
  getAchievementProgress,
} from "../lib/achievementChecker";
import AchievementCard from "../components/AchievementCard";

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export default function AchievementsPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [progress, setProgress] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user]);

  async function loadAchievements() {
    try {
      const [achievementsData, progressData] = await Promise.all([
        getUserAchievements(user!.id),
        getAchievementProgress(user!.id),
      ]);

      setAchievements(achievementsData || []);
      setProgress(progressData || {});
    } catch (error) {
      console.error("Error loading achievements:", error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка достижений...</div>
      </div>
    );
  }

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercent =
    totalCount > 0 ? Math.round((unlockedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Назад к дашборду
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Достижения</h1>
          <p className="text-gray-600">
            Открыто {unlockedCount} из {totalCount} достижений
          </p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Общий прогресс</span>
              <span>{completionPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Achievements Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {achievements.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Нет достижений
            </h2>
            <p className="text-gray-600">
              Начните изучать карточки, чтобы получить достижения!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                icon={achievement.icon}
                title={achievement.title}
                description={achievement.description}
                xpReward={achievement.xp_reward}
                unlocked={achievement.unlocked}
                unlockedAt={achievement.unlocked_at}
                progress={progress[achievement.key]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
