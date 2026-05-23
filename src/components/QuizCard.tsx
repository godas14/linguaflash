import { useState, useEffect } from "react";
import { generateQuizOptions } from "../lib/distractorGenerator";

interface QuizCardProps {
  card: {
    id: string;
    spanish: string;
    russian: string;
  };
  deckId: string;
  onAnswer: (isCorrect: boolean) => void;
}

export default function QuizCard({ card, deckId, onAnswer }: QuizCardProps) {
  const [options, setOptions] = useState<string[]>([]);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadOptions();
  }, [card.id]);

  async function loadOptions() {
    setLoading(true);
    setSelectedOption(null);
    setIsAnswered(false);

    const quizOptions = await generateQuizOptions(card, deckId);
    setOptions(quizOptions);
    setLoading(false);
  }

  function handleOptionClick(option: string) {
    if (isAnswered) return;

    setSelectedOption(option);
    setIsAnswered(true);

    const isCorrect = option === card.russian;

    // Delay callback to show feedback
    setTimeout(() => {
      onAnswer(isCorrect);
    }, 1000);
  }

  function getOptionClassName(option: string): string {
    const baseClass = "w-full p-4 text-left rounded-lg border-2 transition-all font-medium";

    if (!isAnswered) {
      return `${baseClass} border-gray-200 bg-white hover:border-blue-400 hover:bg-blue-50 cursor-pointer`;
    }

    if (option === card.russian) {
      // Correct answer - always show green
      return `${baseClass} border-green-500 bg-green-50 text-green-900`;
    }

    if (option === selectedOption) {
      // User selected wrong answer - show red
      return `${baseClass} border-red-500 bg-red-50 text-red-900`;
    }

    // Other options - dim
    return `${baseClass} border-gray-200 bg-gray-50 text-gray-400`;
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
        <div className="text-center text-gray-600">Загрузка вариантов...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      {/* Question */}
      <div className="text-center mb-8">
        <div className="text-sm text-gray-500 mb-2">Выберите перевод:</div>
        <div className="text-4xl font-bold text-gray-900">{card.spanish}</div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => handleOptionClick(option)}
            disabled={isAnswered}
            className={getOptionClassName(option)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-600">
                {String.fromCharCode(65 + index)}
              </div>
              <div className="flex-1">{option}</div>
              {isAnswered && option === card.russian && (
                <div className="text-green-600 text-xl">✓</div>
              )}
              {isAnswered && option === selectedOption && option !== card.russian && (
                <div className="text-red-600 text-xl">✗</div>
              )}
            </div>
          </button>
        ))}
      </div>

      {/* Feedback */}
      {isAnswered && (
        <div className={`mt-6 p-4 rounded-lg text-center font-semibold ${
          selectedOption === card.russian
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}>
          {selectedOption === card.russian ? (
            <div>
              <div className="text-2xl mb-1">🎉</div>
              <div>Правильно! +10 XP</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl mb-1">😔</div>
              <div>Неправильно. Правильный ответ: {card.russian}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
