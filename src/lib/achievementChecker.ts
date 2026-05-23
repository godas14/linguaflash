import { supabase } from "./supabase";

interface SessionData {
  cardsStudied: number;
  correctAnswers: number;
  durationSeconds: number;
  streak: number;
}

interface Achievement {
  id: string;
  key: string;
  title: string;
  description: string;
  icon: string;
  xp_reward: number;
}

/**
 * Check and unlock achievements after a study session
 * @param userId - User ID
 * @param sessionData - Session statistics
 * @returns Array of newly unlocked achievements
 */
export async function checkAndUnlockAchievements(
  userId: string,
  sessionData: SessionData
): Promise<Achievement[]> {
  try {
    // Get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*");

    if (achievementsError) throw achievementsError;

    // Get user's unlocked achievements
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from("user_achievements")
      .select("achievement_id")
      .eq("user_id", userId);

    if (unlockedError) throw unlockedError;

    const unlockedIds = new Set(
      unlockedAchievements?.map((ua) => ua.achievement_id) || []
    );

    // Get user's total stats
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("*")
      .eq("user_id", userId)
      .not("completed_at", "is", null);

    const totalCardsStudied =
      sessions?.reduce((sum, s) => sum + (s.cards_studied || 0), 0) || 0;

    // Check each achievement
    const newlyUnlocked: Achievement[] = [];

    for (const achievement of allAchievements || []) {
      // Skip if already unlocked
      if (unlockedIds.has(achievement.id)) continue;

      let shouldUnlock = false;

      switch (achievement.key) {
        case "first_steps":
          // Study first card
          shouldUnlock = totalCardsStudied >= 1;
          break;

        case "quick_learner":
          // Study 50 cards
          shouldUnlock = totalCardsStudied >= 50;
          break;

        case "vocabulary_master":
          // Study 500 cards
          shouldUnlock = totalCardsStudied >= 500;
          break;

        case "week_warrior":
          // 7-day streak
          shouldUnlock = (profile?.streak || 0) >= 7;
          break;

        case "month_master":
          // 30-day streak
          shouldUnlock = (profile?.streak || 0) >= 30;
          break;

        case "perfectionist":
          // 100% accuracy in 20-card session
          shouldUnlock =
            sessionData.cardsStudied >= 20 &&
            sessionData.correctAnswers === sessionData.cardsStudied;
          break;

        case "speed_demon":
          // Complete session in under 5 minutes
          shouldUnlock =
            sessionData.cardsStudied >= 20 &&
            sessionData.durationSeconds < 300;
          break;

        case "early_bird":
          // Study before 9 AM
          const hour = new Date().getHours();
          shouldUnlock = hour < 9;
          break;

        case "night_owl":
          // Study after 10 PM
          const nightHour = new Date().getHours();
          shouldUnlock = nightHour >= 22;
          break;

        case "consistent":
          // Study 7 days in a row (same as week_warrior for now)
          shouldUnlock = sessionData.streak >= 7;
          break;
      }

      if (shouldUnlock) {
        // Unlock achievement
        const { error: unlockError } = await supabase
          .from("user_achievements")
          .insert({
            user_id: userId,
            achievement_id: achievement.id,
          });

        if (!unlockError) {
          newlyUnlocked.push(achievement);

          // Award bonus XP
          if (achievement.xp_reward > 0) {
            const newXp = (profile?.xp || 0) + achievement.xp_reward;
            await supabase
              .from("profiles")
              .update({ xp: newXp })
              .eq("id", userId);
          }
        }
      }
    }

    return newlyUnlocked;
  } catch (error) {
    console.error("Error checking achievements:", error);
    return [];
  }
}

/**
 * Get user's achievements with unlock status
 */
export async function getUserAchievements(userId: string) {
  try {
    // Get all achievements
    const { data: allAchievements, error: achievementsError } = await supabase
      .from("achievements")
      .select("*")
      .order("xp_reward", { ascending: true });

    if (achievementsError) throw achievementsError;

    // Get user's unlocked achievements
    const { data: unlockedAchievements, error: unlockedError } = await supabase
      .from("user_achievements")
      .select("achievement_id, unlocked_at")
      .eq("user_id", userId);

    if (unlockedError) throw unlockedError;

    const unlockedMap = new Map(
      unlockedAchievements?.map((ua) => [ua.achievement_id, ua.unlocked_at]) ||
        []
    );

    // Combine data
    return allAchievements?.map((achievement) => ({
      ...achievement,
      unlocked: unlockedMap.has(achievement.id),
      unlocked_at: unlockedMap.get(achievement.id) || null,
    }));
  } catch (error) {
    console.error("Error getting achievements:", error);
    return [];
  }
}

/**
 * Get progress towards achievements
 */
export async function getAchievementProgress(userId: string) {
  try {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: sessions } = await supabase
      .from("study_sessions")
      .select("cards_studied")
      .eq("user_id", userId)
      .not("completed_at", "is", null);

    const totalCardsStudied =
      sessions?.reduce((sum, s) => sum + (s.cards_studied || 0), 0) || 0;

    return {
      first_steps: { current: totalCardsStudied, target: 1 },
      quick_learner: { current: totalCardsStudied, target: 50 },
      vocabulary_master: { current: totalCardsStudied, target: 500 },
      week_warrior: { current: profile?.streak || 0, target: 7 },
      month_master: { current: profile?.streak || 0, target: 30 },
      consistent: { current: profile?.streak || 0, target: 7 },
    };
  } catch (error) {
    console.error("Error getting achievement progress:", error);
    return {};
  }
}
