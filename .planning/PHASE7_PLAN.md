# Phase 7: Gamification & Polish — Implementation Plan

**Start:** 2026-05-23 08:00 UTC  
**Estimated Duration:** 1.5 days  
**Status:** 🚧 In Progress

---

## Goals
1. Achievements system (10 achievements)
2. Level-up animation
3. UI polish (loading states, error handling, empty states)
4. Responsive design improvements
5. Animations and transitions

---

## Implementation Steps

### Step 1: Achievements Database Schema
**File:** Supabase migration
- Create `achievements` table
- Create `user_achievements` table
- Seed 10 achievements

### Step 2: Achievement Checker Utility
**File:** `src/lib/achievementChecker.ts`
- Check conditions after each session
- Unlock achievements
- Award bonus XP

### Step 3: Achievements Page
**File:** `src/pages/AchievementsPage.tsx`
- Grid of achievements (locked/unlocked)
- Progress bars for incremental achievements
- Achievement details modal

### Step 4: Level-up Animation Component
**File:** `src/components/LevelUpModal.tsx`
- Celebration animation
- Show new level
- Confetti effect
- Auto-dismiss after 3 seconds

### Step 5: UI Polish
**Files:** Various components
- Loading skeletons
- Error boundaries
- Empty states
- Toast notifications

### Step 6: Responsive Design
**Files:** All pages
- Mobile-first improvements
- Touch-friendly buttons
- Better spacing on small screens

### Step 7: Animations
**Files:** Various components
- Smooth transitions
- Achievement unlock animation
- Card entrance animations

---

## Achievements (MVP)

1. **🎯 First Steps** — Study your first card
2. **📚 Quick Learner** — Study 50 cards
3. **🏆 Vocabulary Master** — Study 500 cards
4. **🔥 Week Warrior** — Maintain 7-day streak
5. **💪 Month Master** — Maintain 30-day streak
6. **✨ Perfectionist** — 100% accuracy in 20-card session
7. **⚡ Speed Demon** — Complete session in under 5 minutes
8. **🌅 Early Bird** — Study before 9 AM
9. **🌙 Night Owl** — Study after 10 PM
10. **🎓 Consistent** — Study 7 days in a row

---

## Database Schema

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES auth.users,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
```

---

## Files to Create
1. `src/lib/achievementChecker.ts` (~150 lines)
2. `src/components/LevelUpModal.tsx` (~80 lines)
3. `src/pages/AchievementsPage.tsx` (~200 lines)
4. `src/components/AchievementCard.tsx` (~60 lines)
5. `supabase/migrations/007_achievements.sql` (~50 lines)

## Files to Modify
1. `src/pages/StudySessionPage.tsx` (check achievements after session)
2. `src/App.tsx` (add achievements route)
3. Various components (add loading states, error handling)

---

## Testing Checklist
- [ ] Achievements table created
- [ ] 10 achievements seeded
- [ ] Achievement checker works
- [ ] Achievements unlock correctly
- [ ] Level-up modal shows on level up
- [ ] Achievements page displays all achievements
- [ ] Locked achievements show progress
- [ ] Loading states work
- [ ] Error handling works
- [ ] Empty states work
- [ ] Mobile responsive

---

**Next:** Create achievements database schema
