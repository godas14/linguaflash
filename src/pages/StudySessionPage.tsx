import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { getDueCards } from "../lib/cardSelection";
import { calculateStreak, getTodayDate } from "../lib/streakUtils";
import { checkAndUnlockAchievements } from "../lib/achievementChecker";
import { useAuthStore } from "../stores/authStore";
import Flashcard from "../components/Flashcard";
import QuizCard from "../components/QuizCard";
import TypeCard from "../components/TypeCard";
import LevelUpModal from "../components/LevelUpModal";

interface Card {
  id: string;
  spanish: string;
  russian: string;
  examples: string[];
}

interface SessionStats {
  cardsStudied: number;
  correctAnswers: number;
  xpEarned: number;
  startTime: Date;
}

type StudyMode = "flashcard" | "quiz" | "type";

export default function StudySessionPage() {
  const { deckId } = useParams<{ deckId: string }>();
  const [searchParams] = useSearchParams();
  const mode = (searchParams.get("mode") as StudyMode) || "flashcard";

  const [cards, setCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [stats, setStats] = useState<SessionStats>({
    cardsStudied: 0,
    correctAnswers: 0,
    xpEarned: 0,
    startTime: new Date(),
  });
  const [showSummary, setShowSummary] = useState(false);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const [unlockedAchievements, setUnlockedAchievements] = useState<any[]>([]);
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (deckId && user) {
      loadCardsAndStartSession();
    }
  }, [deckId, user]);

  async function loadCardsAndStartSession() {
    try {
      // Use smart card selection (prioritizes due cards)
      const selectedCards = await getDueCards(deckId!, user!.id, 20);
      setCards(selectedCards);

      // Create study session
      const { data: session, error: sessionError } = await supabase
        .from("study_sessions")
        .insert({
          user_id: user!.id,
          deck_id: deckId,
          mode: mode,
          started_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (sessionError) throw sessionError;
      setSessionId(session.id);
    } catch (error) {
      console.error("Error loading cards:", error);
    } finally {
      setLoading(false);
    }
  }

  // Flashcard mode handler
  async function handleFlashcardAnswer(
    difficulty: "again" | "hard" | "good" | "easy",
  ) {
    if (!isFlipped) {
      alert("Сначала переверните карточку!");
      return;
    }

    const currentCard = cards[currentIndex];
    const xpMap = { again: 0, hard: 5, good: 10, easy: 15 };
    const xp = xpMap[difficulty];
    const isCorrect = difficulty === "good" || difficulty === "easy";

    await processAnswer(currentCard, isCorrect, xp);
  }

  // Quiz/Type mode handler
  async function handleQuizTypeAnswer(isCorrect: boolean) {
    const currentCard = cards[currentIndex];
    const xp = isCorrect ? (mode === "quiz" ? 10 : 15) : 0;

    await processAnswer(currentCard, isCorrect, xp);
  }

  async function processAnswer(card: Card, isCorrect: boolean, xp: number) {
    // Update stats
    const newStats = {
      ...stats,
      cardsStudied: stats.cardsStudied + 1,
      correctAnswers: stats.correctAnswers + (isCorrect ? 1 : 0),
      xpEarned: stats.xpEarned + xp,
    };
    setStats(newStats);

    // Save progress to database
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Upsert user_card_progress
        await supabase.from("user_card_progress").upsert({
          user_id: user.id,
          card_id: card.id,
          times_seen: 1, // Will be incremented if exists
          times_correct: isCorrect ? 1 : 0,
          last_reviewed: new Date().toISOString(),
        });
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    }

    // Move to next card or show summary
    if (currentIndex < cards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsFlipped(false);
    } else {
      await finishSession(newStats);
    }
  }

  async function finishSession(finalStats: SessionStats) {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user && sessionId) {
        const duration = Math.floor(
          (Date.now() - finalStats.startTime.getTime()) / 1000,
        );

        // Update session
        await supabase
          .from("study_sessions")
          .update({
            cards_studied: finalStats.cardsStudied,
            correct_answers: finalStats.correctAnswers,
            xp_earned: finalStats.xpEarned,
            duration_seconds: duration,
            completed_at: new Date().toISOString(),
          })
          .eq("id", sessionId);

        // Get current profile data
        const { data: profile } = await supabase
          .from("profiles")
          .select("xp, level, streak, last_study_date")
          .eq("id", user.id)
          .single();

        if (profile) {
          const oldLevel = profile.level || 1;

          // Calculate new XP and level
          const newXp = (profile.xp || 0) + finalStats.xpEarned;
          const calculatedNewLevel = calculateLevel(newXp);

          // Calculate new streak
          const newStreak = calculateStreak(
            profile.last_study_date,
            profile.streak || 0,
          );

          // Update profile with XP, level, streak, and last_study_date
          await supabase
            .from("profiles")
            .update({
              xp: newXp,
              level: calculatedNewLevel,
              streak: newStreak,
              last_study_date: getTodayDate(),
            })
            .eq("id", user.id);

          // Update local auth store
          const updateProfile = useAuthStore.getState().updateProfile;
          updateProfile({
            xp: newXp,
            level: calculatedNewLevel,
            streak: newStreak,
          });

          // Check for level up
          if (calculatedNewLevel > oldLevel) {
            setNewLevel(calculatedNewLevel);
            setShowLevelUp(true);
          }

          // Check and unlock achievements
          const achievements = await checkAndUnlockAchievements(user.id, {
            cardsStudied: finalStats.cardsStudied,
            correctAnswers: finalStats.correctAnswers,
            durationSeconds: duration,
            streak: newStreak,
          });

          setUnlockedAchievements(achievements);
        }
      }
    } catch (error) {
      console.error("Error finishing session:", error);
    }

    setShowSummary(true);
  }

  function calculateLevel(xp: number): number {
    // Level N requires 100 * N^1.5 XP
    let level = 1;
    while (xp >= 100 * Math.pow(level, 1.5)) {
      level++;
    }
    return level;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Загрузка карточек...</div>
      </div>
    );
  }

  if (showSummary) {
    const accuracy =
      stats.cardsStudied > 0
        ? Math.round((stats.correctAnswers / stats.cardsStudied) * 100)
        : 0;
    const duration = Math.floor(
      (Date.now() - stats.startTime.getTime()) / 1000,
    );
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;

    const modeNames = {
      flashcard: "Карточки",
      quiz: "Квиз",
      type: "Ввод",
    };

    return (
      <>
        {/* Level Up Modal */}
        {showLevelUp && (
          <LevelUpModal
            newLevel={newLevel}
            onClose={() => setShowLevelUp(false)}
          />
        )}

        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Сессия завершена!
              </h1>
              <p className="text-gray-600 mb-2">Отличная работа!</p>
              <p className="text-sm text-gray-500 mb-8">
                Режим: {modeNames[mode]}
              </p>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Карточек изучено</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {stats.cardsStudied}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Точность</span>
                  <span className="text-2xl font-bold text-green-600">
                    {accuracy}%
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Заработано XP</span>
                  <span className="text-2xl font-bold text-blue-600">
                    +{stats.xpEarned}
                  </span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Время</span>
                  <span className="text-2xl font-bold text-gray-900">
                    {minutes}:{seconds.toString().padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Unlocked Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className="mb-8 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border-2 border-yellow-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    🏆 Новые достижения!
                  </h3>
                  <div className="space-y-2">
                    {unlockedAchievements.map((achievement) => (
                      <div
                        key={achievement.id}
                        className="flex items-center gap-3 p-2 bg-white rounded-lg"
                      >
                        <span className="text-2xl">{achievement.icon}</span>
                        <div className="flex-1 text-left">
                          <div className="font-semibold text-gray-900">
                            {achievement.title}
                          </div>
                          <div className="text-xs text-gray-600">
                            +{achievement.xp_reward} XP
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <button
                  onClick={() => window.location.reload()}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
                >
                  🔄 Повторить сессию
                </button>
                <button
                  onClick={() => navigate("/decks")}
                  className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  ← Вернуться к колодам
                </button>
                {unlockedAchievements.length > 0 && (
                  <button
                    onClick={() => navigate("/achievements")}
                    className="w-full px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-lg hover:from-yellow-500 hover:to-orange-500 font-semibold"
                  >
                    🏆 Посмотреть достижения
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  const currentCard = cards[currentIndex];
  const progress = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header with progress */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-2">
            <button
              onClick={() => navigate(`/deck/${deckId}`)}
              className="text-gray-600 hover:text-gray-900"
            >
              ✕ Выйти
            </button>
            <div className="text-sm text-gray-600">
              {currentIndex + 1} / {cards.length}
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Content - Different component per mode */}
      <div className="flex-1 flex items-center justify-center p-4">
        {mode === "flashcard" && (
          <div className="w-full max-w-md">
            <Flashcard
              spanish={currentCard.spanish}
              russian={currentCard.russian}
              example={currentCard.examples?.[0]}
              onFlip={setIsFlipped}
            />
          </div>
        )}

        {mode === "quiz" && (
          <QuizCard
            card={currentCard}
            deckId={deckId!}
            onAnswer={handleQuizTypeAnswer}
          />
        )}

        {mode === "type" && (
          <TypeCard card={currentCard} onAnswer={handleQuizTypeAnswer} />
        )}
      </div>

      {/* Answer buttons - Only for flashcard mode */}
      {mode === "flashcard" && isFlipped && (
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center text-sm text-gray-600 mb-4">
              Насколько хорошо вы знаете это слово?
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => handleFlashcardAnswer("again")}
                className="px-4 py-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-semibold text-sm"
              >
                Снова
                <br />
                <span className="text-xs">0 XP</span>
              </button>
              <button
                onClick={() => handleFlashcardAnswer("hard")}
                className="px-4 py-3 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 font-semibold text-sm"
              >
                Сложно
                <br />
                <span className="text-xs">+5 XP</span>
              </button>
              <button
                onClick={() => handleFlashcardAnswer("good")}
                className="px-4 py-3 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-semibold text-sm"
              >
                Хорошо
                <br />
                <span className="text-xs">+10 XP</span>
              </button>
              <button
                onClick={() => handleFlashcardAnswer("easy")}
                className="px-4 py-3 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-semibold text-sm"
              >
                Легко
                <br />
                <span className="text-xs">+15 XP</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
