# Phase 6: Quiz & Type Modes — Implementation Plan

**Start:** 2026-05-23 07:57 UTC  
**Estimated Duration:** 1.5 days  
**Status:** 🚧 In Progress

---

## Goals
1. Add mode selector to DeckDetailPage
2. Implement Quiz Mode (multiple choice)
3. Implement Type Mode (text input with fuzzy matching)
4. Different XP rewards per mode
5. Update session tracking to include mode

---

## Implementation Steps

### Step 1: Mode Selector UI ✅
**File:** `src/pages/DeckDetailPage.tsx`
- Add state for selected mode (flashcard/quiz/type)
- Add mode selector buttons with icons
- Pass mode to StudySessionPage via URL param

### Step 2: Quiz Mode Component
**File:** `src/components/QuizCard.tsx`
- Show Spanish word
- Display 4 Russian options (1 correct + 3 distractors)
- Instant feedback (green/red)
- Disable after answer
- Award +10 XP for correct

### Step 3: Type Mode Component
**File:** `src/components/TypeCard.tsx`
- Show Spanish word
- Text input for Russian answer
- Submit button
- Fuzzy matching logic
- Show correct answer if wrong
- Award +15 XP for correct

### Step 4: Distractor Generator
**File:** `src/lib/distractorGenerator.ts`
- Fetch 3 random cards from same deck
- Exclude correct answer
- Shuffle options

### Step 5: Fuzzy Matching Utility
**File:** `src/lib/fuzzyMatch.ts`
- Normalize strings (lowercase, trim)
- Levenshtein distance algorithm
- Allow 1-char typo

### Step 6: Update StudySessionPage
**File:** `src/pages/StudySessionPage.tsx`
- Read mode from URL params
- Render appropriate card component
- Update XP calculation per mode
- Save mode to study_sessions table

---

## Database Changes
No schema changes needed — `study_sessions.mode` already exists.

---

## XP Rewards
- **Flashcard:** 0/5/10/15 (again/hard/good/easy)
- **Quiz:** +10 (correct), +0 (wrong)
- **Type:** +15 (correct), +0 (wrong)

---

## Testing Checklist
- [ ] Mode selector shows 3 options
- [ ] Quiz shows 4 options, only 1 correct
- [ ] Quiz feedback is instant
- [ ] Type accepts exact match
- [ ] Type accepts 1-char typo
- [ ] Type rejects wrong answers
- [ ] XP awarded correctly per mode
- [ ] Session summary shows correct stats

---

## Files to Create
1. `src/components/QuizCard.tsx` (~150 lines)
2. `src/components/TypeCard.tsx` (~120 lines)
3. `src/lib/distractorGenerator.ts` (~40 lines)
4. `src/lib/fuzzyMatch.ts` (~30 lines)

## Files to Modify
1. `src/pages/DeckDetailPage.tsx` (add mode selector)
2. `src/pages/StudySessionPage.tsx` (support multiple modes)

---

**Next:** Start with mode selector UI
