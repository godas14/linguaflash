import { useEffect, useState } from "react";

interface LevelUpModalProps {
  newLevel: number;
  onClose: () => void;
}

export default function LevelUpModal({ newLevel, onClose }: LevelUpModalProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Trigger animation
    setShow(true);

    // Auto-dismiss after 3 seconds
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // Wait for fade-out animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className={`bg-white rounded-2xl p-8 max-w-md w-full mx-4 text-center transform transition-all duration-500 ${
          show ? "scale-100 rotate-0" : "scale-50 rotate-12"
        }`}
      >
        {/* Confetti effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                top: "-10px",
                backgroundColor: [
                  "#3B82F6",
                  "#10B981",
                  "#F59E0B",
                  "#EF4444",
                  "#8B5CF6",
                ][Math.floor(Math.random() * 5)],
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random()}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="text-6xl mb-4 animate-bounce">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Новый уровень!
          </h2>
          <div className="text-6xl font-bold text-blue-600 mb-4">
            {newLevel}
          </div>
          <p className="text-gray-600">
            Поздравляем! Вы достигли нового уровня!
          </p>
        </div>
      </div>

      {/* Add confetti animation to global styles */}
      <style>{`
        @keyframes confetti {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
