import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabase";

interface Deck {
  id: string;
  name: string;
  description: string;
  card_count: number;
  level: string;
}

interface Card {
  id: string;
  spanish: string;
  russian: string;
  part_of_speech: string;
  difficulty: string;
}

type StudyMode = "flashcard" | "quiz" | "type";

export default function DeckDetailPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<StudyMode>("flashcard");

  useEffect(() => {
    loadDeckAndCards();
  }, [deckId]);

  async function loadDeckAndCards() {
    try {
      // Load deck info
      const { data: deckData, error: deckError } = await supabase
        .from("decks")
        .select("*")
        .eq("id", deckId)
        .single();

      if (deckError) throw deckError;
      setDeck(deckData);

      // Load cards
      const { data: cardsData, error: cardsError } = await supabase
        .from("cards")
        .select("id, spanish, russian, part_of_speech, difficulty")
        .eq("deck_id", deckId)
        .order("spanish");

      if (cardsError) throw cardsError;
      setCards(cardsData || []);
    } catch (error) {
      console.error("Error loading deck:", error);
    } finally {
      setLoading(false);
    }
  }

  function startStudy() {
    navigate(`/study/${deckId}?mode=${selectedMode}`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка...</div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Колода не найдена</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <button
            onClick={() => navigate("/decks")}
            className="text-blue-600 hover:text-blue-700 mb-4"
          >
            ← Назад к колодам
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{deck.name}</h1>
          <p className="text-gray-600 mt-2">{deck.description}</p>
          <div className="flex gap-4 mt-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              {deck.card_count} карточек
            </span>
            <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
              Уровень: {deck.level}
            </span>
          </div>

          {/* Mode Selector */}
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Выберите режим обучения:
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setSelectedMode("flashcard")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMode === "flashcard"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">🃏</div>
                <div className="font-semibold text-gray-900">Карточки</div>
                <div className="text-xs text-gray-600 mt-1">
                  Классический режим
                </div>
              </button>

              <button
                onClick={() => setSelectedMode("quiz")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMode === "quiz"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">❓</div>
                <div className="font-semibold text-gray-900">Квиз</div>
                <div className="text-xs text-gray-600 mt-1">
                  Выбор из 4 вариантов
                </div>
              </button>

              <button
                onClick={() => setSelectedMode("type")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedMode === "type"
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="text-2xl mb-2">⌨️</div>
                <div className="font-semibold text-gray-900">Ввод</div>
                <div className="text-xs text-gray-600 mt-1">
                  Напишите перевод
                </div>
              </button>
            </div>
          </div>

          <button
            onClick={startStudy}
            className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold w-full"
          >
            🎯 Начать изучение
          </button>
        </div>
      </div>

      {/* Cards List */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Все карточки ({cards.length})
        </h2>
        <div className="space-y-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900">
                    {card.spanish}
                  </div>
                  <div className="text-gray-600 mt-1">{card.russian}</div>
                </div>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {card.part_of_speech}
                  </span>
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      card.difficulty === "easy"
                        ? "bg-green-100 text-green-800"
                        : card.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {card.difficulty}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
