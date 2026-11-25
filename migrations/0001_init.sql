-- Overwatch Female Hero World Cup (MVP) D1 Schema

CREATE TABLE IF NOT EXISTS heroes (
  id TEXT PRIMARY KEY,
  name_ko TEXT NOT NULL,
  name_en TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('tank', 'damage', 'support')),
  image_url TEXT NOT NULL,
  tagline TEXT NOT NULL,
  accent_color TEXT NOT NULL,
  is_omnic INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1,
  championship_count INTEGER NOT NULL DEFAULT 0,
  match_wins INTEGER NOT NULL DEFAULT 0,
  match_losses INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS tournament_runs (
  id TEXT PRIMARY KEY,
  round_size INTEGER NOT NULL,
  winner_hero_id TEXT NOT NULL REFERENCES heroes(id),
  runner_up_hero_id TEXT NOT NULL REFERENCES heroes(id),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_heroes_ranking
  ON heroes (championship_count DESC, match_wins DESC);

CREATE INDEX IF NOT EXISTS idx_tournament_runs_created
  ON tournament_runs (created_at DESC);
