-- Create user_card_progress table for spaced repetition tracking
CREATE TABLE user_card_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  card_id UUID REFERENCES cards(id) ON DELETE CASCADE NOT NULL,
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

-- Create study_sessions table for tracking study history
CREATE TABLE study_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  deck_id UUID REFERENCES decks(id) ON DELETE SET NULL,
  mode TEXT NOT NULL,
  cards_studied INTEGER DEFAULT 0,
  correct_answers INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  started_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_progress_user ON user_card_progress(user_id);
CREATE INDEX idx_progress_card ON user_card_progress(card_id);
CREATE INDEX idx_progress_next_review ON user_card_progress(next_review);
CREATE INDEX idx_sessions_user ON study_sessions(user_id);
CREATE INDEX idx_sessions_deck ON study_sessions(deck_id);

-- Enable RLS
ALTER TABLE user_card_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_card_progress
CREATE POLICY "Users can view own progress"
  ON user_card_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress"
  ON user_card_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress"
  ON user_card_progress FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for study_sessions
CREATE POLICY "Users can view own sessions"
  ON study_sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON study_sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own sessions"
  ON study_sessions FOR UPDATE
  USING (auth.uid() = user_id);
