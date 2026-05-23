# Phase 4 Architecture Overview

## Component Hierarchy

```
App.tsx
├── /decks → DecksPage
│   └── Click deck → /deck/:deckId
│       └── DeckDetailPage
│           ├── Deck Info (title, description, icon)
│           ├── Progress Stats (4 cards)
│           └── "Start Study" button
│               └── /study/:deckId
│                   └── StudySessionPage
│                       ├── Progress Bar (X/20)
│                       ├── Flashcard Component
│                       │   ├── Front (Spanish)
│                       │   └── Back (Russian)
│                       ├── Assessment Buttons (4)
│                       └── Session Summary
```

## Data Flow

```
User Action → Component → Supabase → Database → Response → UI Update

Example: Self-Assessment Flow
1. User clicks "Good" button
2. StudySessionPage.handleAssessment(1)
3. Calculate next review (SM-2 algorithm)
4. UPDATE user_card_progress (interval, ease_factor, next_review)
5. Update local stats (cardsStudied++, xpEarned += 10)
6. Move to next card OR show summary
7. On session end:
   - UPDATE study_sessions (completed_at, stats)
   - UPDATE profiles (xp, level)
   - authStore.updateProfile({ xp, level })
```

## Database Schema

```
┌─────────────────┐
│   auth.users    │
└────────┬────────┘
         │
         ├──────────────────────────────┐
         │                              │
┌────────▼────────┐            ┌───────▼──────────┐
│    profiles     │            │  study_sessions  │
├─────────────────┤            ├──────────────────┤
│ id (FK)         │            │ id               │
│ username        │            │ user_id (FK)     │
│ xp              │◄───────────│ deck_id (FK)     │
│ level           │  updates   │ mode             │
│ streak          │            │ cards_studied    │
│ last_study_date │            │ correct_answers  │
└─────────────────┘            │ xp_earned        │
                               │ duration_seconds │
                               └──────────────────┘
         │
         │
┌────────▼──────────────┐
│ user_card_progress    │
├───────────────────────┤
│ id                    │
│ user_id (FK)          │
│ card_id (FK)          │
│ state                 │
│ ease_factor           │
│ interval              │
│ next_review           │
│ times_seen            │
│ times_correct         │
│ last_reviewed         │
└───────────────────────┘
         │
         │
┌────────▼────────┐
│     cards       │
├─────────────────┤
│ id              │
│ deck_id (FK)    │
│ spanish         │
│ russian         │
│ part_of_speech  │
│ example_es      │
│ example_ru      │
│ difficulty      │
└─────────────────┘
         │
         │
┌────────▼────────┐
│     decks       │
├─────────────────┤
│ id              │
│ title_es        │
│ title_ru        │
│ description     │
│ level           │
│ topic           │
│ icon            │
└─────────────────┘
```

## SM-2 Algorithm Flow

```
Input: currentInterval, easeFactor, quality (0, 0.5, 1, 1.5)
  ↓
Calculate new ease factor:
  newEF = EF + (0.1 - (1.5 - q) * (0.08 + (1.5 - q) * 0.02))
  newEF = max(1.3, newEF)
  ↓
Calculate new interval:
  if quality < 0.5:     newInterval = 1 day (Again)
  elif interval == 0:   newInterval = 1 day (First time)
  elif interval == 1:   newInterval = 6 days (Second time)
  else:                 newInterval = round(interval * newEF)
  ↓
Calculate next review date:
  nextReview = today + newInterval days
  ↓
Output: { newInterval, newEaseFactor, nextReview }
```

## State Management

```
┌──────────────────────────────────────┐
│         authStore (Zustand)          │
├──────────────────────────────────────┤
│ user: User | null                    │
│ profile: Profile | null              │
│ loading: boolean                     │
├──────────────────────────────────────┤
│ initialize()                         │
│ signUp(email, password, username)    │
│ signIn(email, password)              │
│ signOut()                            │
│ fetchProfile()                       │
│ updateProfile(updates) ← NEW         │
└──────────────────────────────────────┘
         ↓
Used by: DeckDetailPage, StudySessionPage
Purpose: Access user data, update XP/level
```

## File Structure

```
linguaflash/
├── src/
│   ├── components/
│   │   └── Flashcard.tsx ← NEW (88 lines)
│   ├── pages/
│   │   ├── DeckDetailPage.tsx ← NEW (200 lines)
│   │   ├── StudySessionPage.tsx ← NEW (409 lines)
│   │   ├── DecksPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── ProfilePage.tsx
│   │   ├── HomePage.tsx
│   │   ├── LoginPage.tsx
│   │   └── RegisterPage.tsx
│   ├── stores/
│   │   └── authStore.ts (modified: +updateProfile)
│   ├── lib/
│   │   └── supabase.ts
│   ├── App.tsx (modified: +2 routes)
│   └── main.tsx
├── supabase/
│   └── migrations/
│       └── 20260523070814_create_study_tables.sql
└── .planning/
    ├── STATE.md (updated)
    ├── PHASE4_DONE.md ← NEW
    ├── PHASE4_SUMMARY.md ← NEW
    └── PHASE4_COMPLETE.md ← NEW
```

## Key Features Implemented

### 1. 3D Flip Animation
- CSS `transform: rotateY(180deg)`
- `perspective: 1000px`
- `backface-visibility: hidden`
- Smooth 500ms transition

### 2. Self-Assessment System
```
😰 Again (0)   → interval = 1 day,  XP = +10
😕 Hard (0.5)  → interval = 3 days, XP = +10
😊 Good (1)    → interval = 6 days, XP = +10
😎 Easy (1.5)  → interval = 10+ days, XP = +10
```

### 3. Progress Tracking
- Per-card: times_seen, times_correct, last_reviewed
- Per-session: cards_studied, correct_answers, xp_earned
- Per-user: total XP, level, last_study_date

### 4. XP & Level System
- +10 XP per card (regardless of assessment)
- Level formula: `Level N requires 100 * N^1.5 XP`
- Auto-level-up when threshold reached

## Performance Optimizations

1. **Database Queries:**
   - Indexed on user_id, card_id, next_review
   - Single query per card assessment
   - Batch update at session end

2. **UI Rendering:**
   - CSS transforms (GPU-accelerated)
   - No re-renders during flip animation
   - Optimistic UI updates

3. **State Management:**
   - Local state for session data
   - Zustand for global auth state
   - Minimal re-renders

## Testing Checklist

- [x] Navigation: /decks → /deck/:id → /study/:id
- [x] Deck stats display correctly
- [x] 20 cards load and shuffle
- [x] Flip animation smooth
- [x] All 4 assessment buttons work
- [x] Progress bar updates
- [x] Database updates per card
- [x] Session summary accurate
- [x] XP awarded correctly
- [x] Level calculation works
- [x] "Study Again" reloads
- [x] "Back to Deck" navigates

## Known Issues & Future Work

### Phase 5 (Next)
- [ ] Smart card selection (prioritize due cards)
- [ ] Dashboard widget "X cards due today"
- [ ] Streak tracking
- [ ] Progress charts

### Phase 6
- [ ] Quiz mode (multiple choice)
- [ ] Type mode (text input)

### Phase 7
- [ ] Achievements system
- [ ] Leaderboards
- [ ] Streak freeze mechanic

### Future Enhancements
- [ ] Keyboard shortcuts (Space, 1-4)
- [ ] Audio pronunciation
- [ ] Offline mode
- [ ] Dark theme
- [ ] Custom decks

---

**Phase 4 Status:** ✅ Complete & Production-Ready
**Next Phase:** Phase 5 — Spaced Repetition Optimization
**Estimated Time:** 1 day
