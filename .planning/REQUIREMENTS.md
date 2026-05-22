# LinguaFlash — Requirements Specification

## 1. User Authentication

### 1.1 Registration
- Email + password registration
- Email verification required
- Password requirements: min 8 chars, 1 uppercase, 1 number
- Google OAuth as alternative
- Username (3-20 chars, alphanumeric + underscore)

### 1.2 Login
- Email/password login
- Google OAuth login
- "Remember me" option (30-day session)
- Password reset via email

### 1.3 Profile
- Display name (editable)
- Avatar (upload or default)
- Current level (auto-calculated)
- Total XP
- Current streak
- Join date

## 2. Flashcard Decks

### 2.1 Pre-made Decks
**By Topic:**
- Food & Drinks (100 words)
- Travel & Transportation (100 words)
- Work & Business (100 words)
- Daily Life & Home (100 words)
- Health & Body (100 words)
- Emotions & Feelings (80 words)
- Nature & Weather (80 words)
- Time & Numbers (60 words)
- Common Verbs (180 words)
- Common Adjectives (100 words)

**By CEFR Level:**
- A1 (Beginner): 400 words
- A2 (Elementary): 600 words
- B1 (Intermediate): 1000 words (Phase 2)
- B2 (Upper-Intermediate): 1500 words (Phase 2)
- C1 (Advanced): 1500 words (Phase 3)

### 2.2 Deck Structure
Each deck contains:
- Title (Spanish + Russian)
- Description
- Difficulty level (A1-C2)
- Card count
- Estimated time to complete
- Icon/emoji

### 2.3 Card Structure
Each card contains:
- Spanish word/phrase
- Russian translation
- Part of speech (noun, verb, adjective, etc.)
- Example sentence (Spanish)
- Example translation (Russian)
- Audio URL (Spanish pronunciation)
- Difficulty score (1-5, auto-calculated)

### 2.4 User Custom Decks
- Create new deck (title, description, level)
- Add cards manually (Spanish, Russian, example)
- Edit/delete own cards
- Share deck (public URL, view-only)
- Import from CSV

## 3. Study Modes

### 3.1 Classic Flashcards
- Show Spanish word
- User thinks of translation
- Flip card to reveal Russian
- Self-assess: Easy / Good / Hard / Again
- Assessment affects spaced repetition schedule

### 3.2 Multiple Choice Quiz
- Show Spanish word
- 4 Russian translation options (1 correct, 3 distractors)
- Distractors: similar words from same deck
- 10-second timer per question (optional)
- Instant feedback (green/red)
- +10 XP for correct, +0 for wrong

### 3.3 Type Answer
- Show Spanish word
- User types Russian translation
- Fuzzy matching (ignore case, extra spaces, typos within 1 char)
- Show correct answer if wrong
- +15 XP for correct (harder than multiple choice)

### 3.4 Listening Mode
- Play Spanish audio
- User types what they heard (Spanish)
- Fuzzy matching
- Replay button (max 3 times)
- +20 XP for correct (hardest mode)

### 3.5 Matching Game
- Grid of 8 cards (4 Spanish, 4 Russian)
- Click two cards to match
- Timer: complete in under 2 minutes
- +50 XP for completing under 2 min
- +30 XP for completing under 3 min

## 4. Spaced Repetition Algorithm

### 4.1 SM-2 Algorithm (Simplified Anki)
- New cards: shown immediately
- Learning cards: 1min → 10min → 1day intervals
- Review cards: interval multiplies by ease factor
- Ease factor: starts at 2.5, adjusts based on performance

### 4.2 Card States
- **New:** Never studied
- **Learning:** Currently being learned (short intervals)
- **Review:** Learned, scheduled for review (long intervals)
- **Relearning:** Failed review, back to learning

### 4.3 Daily Limits
- New cards per day: 20 (configurable 10-50)
- Review cards per day: 100 (configurable 50-200)
- Study session: 10-30 minutes recommended

### 4.4 Performance Tracking
- Per card: times seen, times correct, current interval, next review date
- Per deck: mastery % (cards in Review state / total cards)
- Per user: overall accuracy %, average session time

## 5. Gamification

### 5.1 XP System
**Earning XP:**
- Complete a card: 10-20 XP (depends on mode)
- Daily goal (20 cards): +50 XP bonus
- Perfect session (100% accuracy): +100 XP
- First study of the day: +25 XP

**Levels:**
- Level 1: 0 XP
- Level 2: 100 XP
- Level 3: 250 XP
- Level 4: 500 XP
- Level 5: 1000 XP
- Level N: XP = 100 * N^1.5 (exponential curve)

### 5.2 Streak System
- Streak = consecutive days with at least 1 study session
- Streak freezes: 3 per month (skip a day without breaking streak)
- Streak milestones: 7, 30, 100, 365 days
- Streak reminder notification (if enabled)

### 5.3 Achievements
**Learning Milestones:**
- First Card (study 1 card)
- Quick Learner (study 50 cards)
- Vocabulary Master (study 500 cards)
- Polyglot (study 2000 cards)

**Streak Milestones:**
- Week Warrior (7-day streak)
- Month Master (30-day streak)
- Century Club (100-day streak)
- Year Legend (365-day streak)

**Accuracy:**
- Perfectionist (100% accuracy in 10-card session)
- Sharp Shooter (90%+ accuracy over 100 cards)
- Consistent (80%+ accuracy over 500 cards)

**Speed:**
- Speed Demon (complete matching game under 1 min)
- Lightning Fingers (type 10 correct answers under 5 sec each)

### 5.4 Leaderboards (Optional, Phase 2)
- Weekly XP leaderboard (top 100)
- Monthly XP leaderboard
- All-time XP leaderboard
- Friends-only leaderboard

## 6. User Interface

### 6.1 Home Screen
- Welcome message + username
- Current streak (with flame icon)
- Daily progress bar (cards studied / daily goal)
- Quick start button (resume last deck)
- Deck library button

### 6.2 Deck Library
- Grid/list view toggle
- Filter by level (A1, A2, etc.)
- Filter by topic
- Search by name
- Sort by: name, difficulty, progress

### 6.3 Deck Detail
- Deck title + description
- Progress: X / Y cards mastered
- Start study button (opens mode selector)
- Deck settings (daily limits, card order)

### 6.4 Study Session
- Progress bar (current card / total cards in session)
- Card display (large, centered)
- Action buttons (flip, submit, skip)
- Exit button (saves progress)

### 6.5 Session Summary
- Cards studied: X
- Accuracy: Y%
- XP earned: Z
- New level reached (if applicable)
- Streak status
- Continue / Finish buttons

### 6.6 Profile Screen
- Avatar + username
- Level + XP progress bar
- Streak counter
- Total cards studied
- Achievements grid (locked/unlocked)
- Settings button

### 6.7 Settings
- Account: change email, password, delete account
- Study: daily goals, card limits, auto-play audio
- Notifications: streak reminders, daily goal reminders
- Appearance: light/dark mode
- Language: interface language (Russian/English)

## 7. Data Model

### 7.1 Users Table
```sql
users (
  id: uuid PRIMARY KEY,
  email: string UNIQUE,
  username: string UNIQUE,
  display_name: string,
  avatar_url: string,
  xp: integer DEFAULT 0,
  level: integer DEFAULT 1,
  streak: integer DEFAULT 0,
  last_study_date: date,
  created_at: timestamp,
  settings: jsonb
)
```

### 7.2 Decks Table
```sql
decks (
  id: uuid PRIMARY KEY,
  title_es: string,
  title_ru: string,
  description: string,
  level: string (A1/A2/B1/B2/C1/C2),
  topic: string,
  is_public: boolean,
  created_by: uuid REFERENCES users(id),
  created_at: timestamp
)
```

### 7.3 Cards Table
```sql
cards (
  id: uuid PRIMARY KEY,
  deck_id: uuid REFERENCES decks(id),
  spanish: string,
  russian: string,
  part_of_speech: string,
  example_es: string,
  example_ru: string,
  audio_url: string,
  difficulty: integer (1-5),
  created_at: timestamp
)
```

### 7.4 User Progress Table
```sql
user_card_progress (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  card_id: uuid REFERENCES cards(id),
  state: string (new/learning/review/relearning),
  ease_factor: float DEFAULT 2.5,
  interval: integer (days),
  next_review: timestamp,
  times_seen: integer DEFAULT 0,
  times_correct: integer DEFAULT 0,
  last_reviewed: timestamp,
  UNIQUE(user_id, card_id)
)
```

### 7.5 Study Sessions Table
```sql
study_sessions (
  id: uuid PRIMARY KEY,
  user_id: uuid REFERENCES users(id),
  deck_id: uuid REFERENCES decks(id),
  mode: string (flashcard/quiz/type/listen/match),
  cards_studied: integer,
  correct_answers: integer,
  xp_earned: integer,
  duration_seconds: integer,
  started_at: timestamp,
  completed_at: timestamp
)
```

### 7.6 Achievements Table
```sql
achievements (
  id: uuid PRIMARY KEY,
  key: string UNIQUE,
  title: string,
  description: string,
  icon: string,
  xp_reward: integer
)

user_achievements (
  user_id: uuid REFERENCES users(id),
  achievement_id: uuid REFERENCES achievements(id),
  unlocked_at: timestamp,
  PRIMARY KEY(user_id, achievement_id)
)
```

## 8. API Endpoints

### 8.1 Authentication
- POST /auth/register
- POST /auth/login
- POST /auth/logout
- POST /auth/reset-password
- GET /auth/me

### 8.2 Decks
- GET /decks (list all public decks)
- GET /decks/:id (deck details + cards)
- POST /decks (create custom deck)
- PUT /decks/:id (update own deck)
- DELETE /decks/:id (delete own deck)

### 8.3 Study
- GET /study/:deckId/next (get next cards for study session)
- POST /study/submit (submit card answer, update progress)
- GET /study/due (count of cards due for review)

### 8.4 Progress
- GET /progress/stats (overall user stats)
- GET /progress/deck/:deckId (progress for specific deck)
- GET /progress/history (study sessions history)

### 8.5 Gamification
- GET /achievements (list all achievements)
- GET /achievements/user (user's unlocked achievements)
- GET /leaderboard/weekly (top 100 users by XP this week)

## 9. Performance Requirements
- Page load: < 2 seconds on 4G
- Study session start: < 1 second
- Card flip/submit: < 200ms
- Audio playback: < 500ms to start
- Offline support: cache last studied deck (Phase 2)

## 10. Security Requirements
- HTTPS only
- JWT tokens (1-hour expiry, refresh tokens)
- Rate limiting: 100 req/min per user
- SQL injection prevention (parameterized queries)
- XSS prevention (sanitize user input)
- CORS: whitelist frontend domain only

## 11. Accessibility
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- High contrast mode
- Font size adjustable
- Color-blind friendly (not relying on color alone)

## 12. Browser Support
- Chrome 90+
- Safari 14+ (iOS 14+)
- Firefox 88+
- Edge 90+

## 13. MVP Scope (Phase 1)
**Must Have:**
- Auth (email/password only, no OAuth)
- 5 pre-made decks (500 cards total, A1-A2)
- 3 study modes (flashcard, quiz, type)
- Spaced repetition (SM-2)
- XP + levels
- Streak tracking
- Basic profile
- Responsive web UI

**Nice to Have (Phase 2):**
- Google OAuth
- Listening mode
- Matching game
- Custom decks
- Achievements
- Leaderboards
- Dark mode
- More decks (B1-C1)

**Future (Phase 3):**
- Native iOS app
- Offline mode
- Social features
- Voice recording
- Grammar lessons
