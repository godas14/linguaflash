-- Create decks table
CREATE TABLE decks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title_es TEXT NOT NULL,
  title_ru TEXT NOT NULL,
  description TEXT,
  level TEXT CHECK (level IN ('A1', 'A2', 'B1', 'B2', 'C1', 'C2')) DEFAULT 'A1',
  topic TEXT NOT NULL,
  icon TEXT DEFAULT '📚',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cards table
CREATE TABLE cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  deck_id UUID REFERENCES decks(id) ON DELETE CASCADE NOT NULL,
  spanish TEXT NOT NULL,
  russian TEXT NOT NULL,
  part_of_speech TEXT,
  example_es TEXT,
  example_ru TEXT,
  audio_url TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_cards_deck_id ON cards(deck_id);
CREATE INDEX idx_decks_level ON decks(level);
CREATE INDEX idx_decks_topic ON decks(topic);

-- Enable RLS
ALTER TABLE decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE cards ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone can read public decks and cards
CREATE POLICY "Public decks are viewable by everyone"
  ON decks FOR SELECT
  USING (is_public = true);

CREATE POLICY "Public cards are viewable by everyone"
  ON cards FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM decks 
    WHERE decks.id = cards.deck_id 
    AND decks.is_public = true
  ));
