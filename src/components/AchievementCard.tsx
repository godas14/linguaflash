interface AchievementCardProps {
  icon: string;
  title: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string | null;
  progress?: { current: number; target: number };
}

export default function AchievementCard({
  icon,
  title,
  description,
  xpReward,
  unlocked,
  unlockedAt,
  progress,
}: AchievementCardProps) {
  const progressPercent = progress
    ? Math.min((progress.current / progress.target) * 100, 100)
    : 0;

  return (
    <div
      className={`relative p-6 rounded-xl border-2 transition-all ${
        unlocked
          ? "bg-gradient-to-br from-blue-50 to-purple-50 border-blue-300 shadow-md"
          : "bg-gray-50 border-gray-200"
      }`}
    >
      {/* Unlocked badge */}
      {unlocked && (
        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
          ✓ Получено
        </div>
      )}

      {/* Icon */}
      <div
        className={`text-5xl mb-3 ${unlocked ? "grayscale-0" : "grayscale opacity-40"}`}
      >
        {icon}
      </div>

      {/* Title */}
      <h3
        className={`text-lg font-bold mb-2 ${unlocked ? "text-gray-900" : "text-gray-500"}`}
      >
        {title}
      </h3>

      {/* Description */}
      <p
        className={`text-sm mb-3 ${unlocked ? "text-gray-700" : "text-gray-400"}`}
      >
        {description}
      </p>

      {/* XP Reward */}
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${
          unlocked
            ? "bg-blue-100 text-blue-700"
            : "bg-gray-200 text-gray-500"
        }`}
      >
        <span>⭐</span>
        <span>+{xpReward} XP</span>
      </div>

      {/* Progress bar (for locked achievements) */}
      {!unlocked && progress && (
        <div className="mt-4">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Прогресс</span>
            <span>
              {progress.current} / {progress.target}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}

      {/* Unlocked date */}
      {unlocked && unlockedAt && (
        <div className="mt-3 text-xs text-gray-500">
          Получено: {new Date(unlockedAt).toLocaleDateString("ru-RU")}
        </div>
      )}
    </div>
  );
}
