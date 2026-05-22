# LinguaFlash — Development Roadmap

## Overview
7 phases from zero to production-ready MVP. Each phase is independently deployable and testable.

---

## Phase 1: Project Setup & Infrastructure
**Duration:** 1 day  
**Goal:** Working development environment with deployment pipeline

### Deliverables
- React + TypeScript + Vite project initialized
- Tailwind CSS + shadcn/ui configured
- Supabase project created (database + auth)
- GitHub repository with CI/CD
- Vercel deployment (auto-deploy from main branch)
- Environment variables configured
- Basic routing structure (/, /login, /register, /dashboard)

### Success Criteria
- `npm run dev` starts local server
- Vercel deployment shows "Hello LinguaFlash" page
- Supabase connection works (test query)

---

## Phase 2: Authentication System
**Duration:** 1 day  
**Goal:** Users can register, login, and manage their profile

### Deliverables
- Registration page (email + password + username)
- Login page (email + password)
- Password reset flow
- Protected routes (redirect to /login if not authenticated)
- Profile page (display name, avatar, basic stats)
- Logout functionality
- Auth state management (Zustand store)

### Database Schema
```sql
-- Supabase Auth handles users table
-- Add custom fields via profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  streak INTEGER DEFAULT 0,
  last_study_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Success Criteria
- User can register with email/password
- User can login and see their profile
- Protected routes work (redirect if not logged in)
- Profile displays username and default stats

---

## Phase 3: Content Foundation (Decks & Cards)
**Duration:** 1 day  
**Goal:** Database populated with 500 Spanish-Russian flashcards across 5 decks

### Deliverables
- Database schema for decks and cards
- Seed script to populate initial content
- 5 pre-made decks:
  1. Food & Drinks (100 cards)
  2. Travel & Transportation (100 cards)
  3. Daily Life & Home (100 cards)
  4. Common Verbs (100 cards)
  5. Common Adjectives (100 cards)
- Deck library page (grid view, filter by topic)
- Deck detail page (show cards count, description, start button)

### Database Schema
```sql
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_es TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')),
  topic TEXT,
  icon TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE,
  spanish TEXT NOT NULL,
  russian TEXT NOT NULL,
  part_of_speech TEXT,
  example_es TEXT,
  example_ru TEXT,
  audio_url TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_cards_deck ON cards(deck_id);
```

### Content Generation
- Use GPT-4 to generate 500 cards (Spanish-Russian pairs with examples)
- Manual review and validation
- Store in JSON, then seed to Supabase

### Success Criteria
- Deck library shows 5 decks
- Each deck shows correct card count
- Clicking deck opens detail page with card preview

---

## Phase 4: Study Mode — Classic Flashcards
**Duration:** 1.5 days  
**Goal:** Users can study flashcards with flip interaction

### Deliverables
- Study session page (/study/:deckId)
- Card component (Spanish front, Russian back, flip animation)
- Session flow: load 20 cards → study → show summary
- Self-assessment buttons (Again, Hard, Good, Easy)
- Progress bar (X / 20 cards)
- Session summary (cards studied, time spent, XP earned)
- XP calculation and update to user profile

### Database Schema
```sql
CREATE TABLE user_card_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE,
  state TEXT CHECK (state IN ('new', 'learning', 'review', 'relearning')) DEFAULT 'new',
  ease_factor FLOAT DEFAULT 2.5,
  interval INTEGER DEFAULT 0,
  next_review TIMESTAMP,
  times_seen INTEGER DEFAULT 0,
  times_correct INTEGER DEFAULT 0,
  last_reviewed TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, card_id)
);

CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  deck_id UUID REFERENCES decks(id),
  mode TEXT NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

CREATE INDEX idx_progress_user ON user_card_progress(user_id);
CREATE INDEX idx_progress_next_review ON user_card_progress(next_review);
```

### Study Logic
- Load 20 cards (prioritize: due for review > new cards)
- Show Spanish word
- User clicks "Flip" to see Russian
- User self-assesses: Again (0) / Hard (0.5) / Good (1) / Easy (1.5)
- Update card progress (interval, next_review, ease_factor)
- Award XP: +10 per card

### Success Criteria
- User can start study session from deck detail
- Cards flip smoothly (CSS animation)
- Self-assessment updates card progress
- Session summary shows correct stats
- XP updates in user profile

---

## Phase 5: Spaced Repetition Algorithm
**Duration:** 1 day  
**Goal:** Cards intelligently scheduled based on SM-2 algorithm

### Deliverables
- SM-2 algorithm implementation (TypeScript utility)
- Card scheduler (fetch due cards for today)
- Progress tracking (new → learning → review states)
- Dashboard widget: "X cards due today"
- Study session respects due dates (prioritize overdue cards)

### SM-2 Algorithm (Simplified)
```typescript
function calculateNextReview(
  currentInterval: number,
  easeFactor: number,
  quality: number // 0 = Again, 0.5 = Hard, 1 = Good, 1.5 = Easy
): { newInterval: number, newEaseFactor: number, nextReview: Date } {
  // Update ease factor
  let newEaseFactor = easeFactor + (0.1 - (1.5 - quality) * (0.08 + (1.5 - quality) * 0.02));
  newEaseFactor = Math.max(1.3, newEaseFactor); // Min ease factor

  // Calculate new interval
  let newInterval: number;
  if (quality < 0.5) {
    // Again: reset to 1 day
    newInterval = 1;
  } else if (currentInterval === 0) {
    // First review: 1 day
    newInterval = 1;
  } else if (currentInterval === 1) {
    // Second review: 6 days
    newInterval = 6;
  } else {
    // Subsequent reviews: multiply by ease factor
    newInterval = Math.round(currentInterval * newEaseFactor);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + newInterval);

  return { newInterval, newEaseFactor, nextReview };
}
```

### Success Criteria
- Cards due today show on dashboard
- Studying a card updates next_review correctly
- Easy cards scheduled further out than Hard cards
- Failed cards (Again) reset to 1-day interval

---

## Phase 6: Additional Study Modes
**Duration:** 1.5 days  
**Goal:** Multiple Choice Quiz and Type Answer modes

### Deliverables
- Mode selector on deck detail page (Flashcard / Quiz / Type)
- **Multiple Choice Quiz:**
  - Show Spanish word + 4 Russian options
  - Generate 3 distractors (similar words from same deck)
  - Instant feedback (green = correct, red = wrong)
  - +10 XP for correct answer
- **Type Answer:**
  - Show Spanish word
  - Text input for Russian translation
  - Fuzzy matching (ignore case, trim spaces, allow 1-char typo)
  - Show correct answer if wrong
  - +15 XP for correct answer

### Fuzzy Matching Logic
```typescript
function fuzzyMatch(userAnswer: string, correctAnswer: string): boolean {
  const normalize = (s: string) => s.toLowerCase().trim();
  const user = normalize(userAnswer);
  const correct = normalize(correctAnswer);

  // Exact match
  if (user === correct) return true;

  // Levenshtein distance <= 1
  return levenshteinDistance(user, correct) <= 1;
}
```

### Success Criteria
- User can select study mode before starting session
- Quiz mode shows 4 options, only 1 correct
- Type mode accepts correct answer with minor typos
- Both modes award appropriate XP

---

## Phase 7: Gamification & Polish
**Duration:** 1.5 days  
**Goal:** Streak tracking, levels, achievements, and UI polish

### Deliverables
- **Streak System:**
  - Track consecutive days of study
  - Update streak on first study session of the day
  - Display streak on home screen (flame icon + number)
  - Streak freeze (3 per month, not in MVP)
- **Level System:**
  - Calculate level from XP (Level N = 100 * N^1.5 XP)
  - Show level + progress bar on profile
  - Level-up animation when threshold reached
- **Achievements:**
  - Seed 10 achievements (First Card, Week Warrior, etc.)
  - Check and unlock achievements after each session
  - Display achievements grid on profile (locked/unlocked)
- **UI Polish:**
  - Loading states (skeletons)
  - Error handling (toast notifications)
  - Empty states (no decks, no progress)
  - Responsive design (mobile-first)
  - Animations (card flip, level-up, achievement unlock)

### Database Schema
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0
);

CREATE TABLE user_achievements (
  user_id UUID REFERENCES auth.users,
  achievement_id UUID REFERENCES achievements(id),
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(user_id, achievement_id)
);
```

### Achievements (MVP)
1. **First Card** — Study your first card
2. **Quick Learner** — Study 50 cards
3. **Vocabulary Master** — Study 500 cards
4. **Week Warrior** — Maintain 7-day streak
5. **Month Master** — Maintain 30-day streak
6. **Perfectionist** — 100% accuracy in 10-card session
7. **Speed Demon** — Complete session in under 5 minutes
8. **Early Bird** — Study before 9 AM
9. **Night Owl** — Study after 10 PM
10. **Consistent** — Study 7 days in a row

### Success Criteria
- Streak increments daily on first study
- Level-up triggers when XP threshold reached
- Achievements unlock automatically
- UI is polished and responsive on mobile

---

## Post-MVP (Phase 8+)

### Phase 8: Listening Mode & Audio
- Web Speech API integration
- Audio playback for Spanish words
- Listening study mode (hear → type)

### Phase 9: Custom Decks
- User can create custom decks
- Add/edit/delete cards
- Share deck via public URL

### Phase 10: Social Features
- Leaderboards (weekly/monthly)
- Friends system
- Challenge friends

### Phase 11: Native iOS App
- React Native wrapper
- Offline mode
- Push notifications
- App Store submission

---

## Timeline Summary
- **Phase 1:** 1 day (Setup)
- **Phase 2:** 1 day (Auth)
- **Phase 3:** 1 day (Content)
- **Phase 4:** 1.5 days (Flashcards)
- **Phase 5:** 1 day (Spaced Repetition)
- **Phase 6:** 1.5 days (Quiz + Type modes)
- **Phase 7:** 1.5 days (Gamification)

**Total MVP:** 8.5 days of focused work

---

## Success Metrics (Post-Launch)
- **D1 Retention:** 70%+ users return next day
- **D7 Retention:** 40%+ users return after 7 days
- **Engagement:** Average 15 minutes per session
- **Learning:** Users learn 20+ new words per week
- **Streak:** 30%+ users maintain 7-day streak
