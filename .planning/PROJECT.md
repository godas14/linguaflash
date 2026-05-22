# LinguaFlash — Spanish Learning Flashcard App

## Vision
Mobile-first flashcard application for learning Spanish with Russian translations. Gamified learning experience with multiple study modes, spaced repetition, and progress tracking. Better quality than Duolingo with focus on effective vocabulary acquisition.

## Target Audience
- **Primary:** Russian speakers learning Spanish (all levels: A1-C2)
- **Age:** 16-45 years old
- **Motivation:** Self-improvement, travel, career, education
- **Tech savvy:** Comfortable with mobile apps

## Core Value Proposition
Quality gamified flashcard learning that actually works:
- Multiple study modes (not just one-way translation)
- Spaced repetition algorithm (cards return at optimal intervals)
- Real progress tracking with streaks and achievements
- Clean, modern UI (not cluttered like competitors)
- Works offline after initial download

## Key Features

### Study Modes
1. **Classic Flashcards** — flip card to see translation
2. **Multiple Choice Quiz** — choose correct translation from 4 options
3. **Type Answer** — write the word (spelling practice)
4. **Listening** — hear Spanish word, type what you heard
5. **Matching** — connect Spanish words with Russian translations

### Content
- **Pre-made Decks:** Organized by topics (food, travel, work, daily life) and CEFR levels (A1-C2)
- **AI-Generated:** Smart content generation based on user level
- **User Decks:** Users can create custom flashcard sets
- **Total Words:** Start with 1000 words (A1-A2), expand to 5000+ (A1-C2)

### Gamification
- **Daily Streak:** Consecutive days of practice
- **XP System:** Earn points for correct answers
- **Levels:** Progress from Beginner to Master
- **Achievements:** Unlock badges for milestones
- **Leaderboards:** Weekly/monthly rankings (optional social feature)

### Learning Science
- **Spaced Repetition:** Anki-style algorithm (cards reappear based on your performance)
- **Adaptive Difficulty:** System adjusts based on your success rate
- **Progress Analytics:** Track words learned, accuracy, time spent

## Technical Stack

### Frontend
- **Framework:** React + TypeScript + Vite
- **UI Library:** Tailwind CSS + shadcn/ui
- **State:** Zustand (lightweight state management)
- **Routing:** React Router
- **PWA:** Installable web app (works like native)

### Backend
- **Platform:** Supabase
- **Database:** PostgreSQL (user progress, decks, cards)
- **Auth:** Supabase Auth (email/password, Google OAuth)
- **Storage:** Supabase Storage (audio files)
- **Real-time:** Live leaderboards

### Content & AI
- **Card Generation:** OpenAI GPT-4 API (generate contextual examples)
- **Audio:** Web Speech API (Spanish pronunciation)
- **Translations:** Pre-validated Spanish-Russian pairs

### Deployment
- **Hosting:** Vercel (free tier, auto-deploy from GitHub)
- **Domain:** linguaflash.app (or .ru for Russian audience)
- **CDN:** Vercel Edge Network (global fast loading)

## Platform Strategy

### Phase 1: Web App (MVP)
- Responsive web app (works on all devices)
- PWA (installable on iOS/Android home screen)
- **Why:** Fastest to build, no app store approval, easy updates

### Phase 2: Native iOS (Post-MVP)
- React Native wrapper
- App Store submission
- **Why:** Better UX, offline-first, push notifications

### Phase 3: Android (Future)
- Same React Native codebase
- Google Play submission

## Monetization (Future)
- **Free Tier:** 500 words, basic modes, ads
- **Premium:** $4.99/month — all words, all modes, no ads, advanced analytics
- **Lifetime:** $49.99 one-time

## Success Metrics
- **Engagement:** 70%+ users return next day (D1 retention)
- **Learning:** Users learn 20+ new words per week
- **Streak:** 30%+ users maintain 7-day streak
- **Quality:** 4.5+ rating (when launched)

## Constraints & Assumptions
- **Developer:** Solo developer (AI-assisted), no prior mobile dev experience
- **Timeline:** MVP in 7-10 days of focused work
- **Budget:** $0 for MVP (free tiers: Vercel, Supabase, limited OpenAI API)
- **Content:** Start with curated 1000-word dataset (A1-A2 Spanish)
- **Offline:** Phase 2 feature (requires native app)

## Out of Scope (MVP)
- Social features (friends, challenges)
- Voice recording (user pronunciation practice)
- Video lessons
- Grammar explanations
- Native mobile apps (web-first)
- Multiple languages (Spanish-Russian only)

## Risks
1. **Content Quality:** AI-generated cards need validation → Mitigation: Manual review of first 1000 cards
2. **User Retention:** Gamification might not be enough → Mitigation: A/B test streak reminders, rewards
3. **Performance:** Large card decks slow on mobile → Mitigation: Lazy loading, pagination
4. **Audio Quality:** Web Speech API accent issues → Mitigation: Pre-record critical words

## Next Steps
1. Create detailed requirements (REQUIREMENTS.md)
2. Design database schema
3. Build authentication flow
4. Implement first study mode (classic flashcards)
5. Add spaced repetition algorithm
6. Deploy MVP to Vercel
