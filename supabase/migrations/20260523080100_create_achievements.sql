-- Create achievements table
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  xp_reward INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  achievement_id UUID REFERENCES achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY(user_id, achievement_id)
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);

-- Seed achievements
INSERT INTO achievements (key, title, description, icon, xp_reward) VALUES
  ('first_steps', 'Первые шаги', 'Изучите свою первую карточку', '🎯', 50),
  ('quick_learner', 'Быстрый ученик', 'Изучите 50 карточек', '📚', 100),
  ('vocabulary_master', 'Мастер словаря', 'Изучите 500 карточек', '🏆', 500),
  ('week_warrior', 'Воин недели', 'Поддерживайте серию 7 дней', '🔥', 200),
  ('month_master', 'Мастер месяца', 'Поддерживайте серию 30 дней', '💪', 1000),
  ('perfectionist', 'Перфекционист', '100% точность в сессии из 20 карточек', '✨', 150),
  ('speed_demon', 'Скоростной демон', 'Завершите сессию менее чем за 5 минут', '⚡', 100),
  ('early_bird', 'Ранняя птичка', 'Занимайтесь до 9 утра', '🌅', 75),
  ('night_owl', 'Ночная сова', 'Занимайтесь после 10 вечера', '🌙', 75),
  ('consistent', 'Последовательный', 'Занимайтесь 7 дней подряд', '🎓', 250)
ON CONFLICT (key) DO NOTHING;
