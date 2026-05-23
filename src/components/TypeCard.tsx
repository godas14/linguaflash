import { useState, type FormEvent } from "react";
import { fuzzyMatch, isAlmostCorrect } from "../lib/fuzzyMatch";

interface TypeCardProps {
  card: {
    id: string;
    spanish: string;
    russian: string;
  };
  onAnswer: (isCorrect: boolean) => void;
}

export default function TypeCard({ card, onAnswer }: TypeCardProps) {
  const [userAnswer, setUserAnswer] = useState("");
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isAlmost, setIsAlmost] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (isAnswered || !userAnswer.trim()) return;

    const correct = fuzzyMatch(userAnswer, card.russian);
    const almost = !correct && isAlmostCorrect(userAnswer, card.russian);

    setIsCorrect(correct);
    setIsAlmost(almost);
    setIsAnswered(true);

    // Delay callback to show feedback
    setTimeout(() => {
      onAnswer(correct);
    }, 1500);
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      {/* Question */}
      <div className="text-center mb-8">
        <div className="text-sm text-gray-500 mb-2">Напишите перевод:</div>
        <div className="text-4xl font-bold text-gray-900">{card.spanish}</div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            disabled={isAnswered}
            placeholder="Введите перевод на русском..."
            className={`w-full px-4 py-3 text-lg border-2 rounded-lg focus:outline-none focus:ring-2 transition-all ${
              isAnswered
                ? isCorrect
                  ? "border-green-500 bg-green-50"
                  : "border-red-500 bg-red-50"
                : "border-gray-300 focus:border-blue-500 focus:ring-blue-200"
            }`}
            autoFocus
          />
        </div>

        {!isAnswered && (
          <button
            type="submit"
            disabled={!userAnswer.trim()}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Проверить
          </button>
        )}
      </form>

      {/* Feedback */}
      {isAnswered && (
        <div className="mt-6 space-y-3">
          {isCorrect ? (
            <div className="p-4 rounded-lg bg-green-100 text-green-800 text-center font-semibold">
              <div className="text-2xl mb-1">🎉</div>
              <div>Правильно! +15 XP</div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-lg bg-red-100 text-red-800 text-center font-semibold">
                <div className="text-2xl mb-1">😔</div>
                <div>Неправильно</div>
              </div>
              {isAlmost && (
                <div className="p-3 rounded-lg bg-yellow-100 text-yellow-800 text-center text-sm">
                  Почти правильно! Проверьте написание.
                </div>
              )}
              <div className="p-4 rounded-lg bg-gray-100 text-gray-900 text-center">
                <div className="text-sm text-gray-600 mb-1">Правильный ответ:</div>
                <div className="text-xl font-semibold">{card.russian}</div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hint */}
      {!isAnswered && (
        <div className="mt-6 text-center text-sm text-gray-500">
          💡 Допускается 1 опечатка
        </div>
      )}
    </div>
  );
}
