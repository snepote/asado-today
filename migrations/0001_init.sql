CREATE TABLE events (
  id TEXT PRIMARY KEY,
  host_name TEXT NOT NULL,
  host_token TEXT NOT NULL,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  location_lat REAL NOT NULL,
  location_lng REAL NOT NULL,
  location_label TEXT,
  verdict TEXT NOT NULL DEFAULT 'MAYBE' CHECK (verdict IN ('SI', 'MAYBE', 'NO')),
  verdict_score REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  locked_at TEXT,
  reproposed_to TEXT
);

CREATE TABLE guests (
  id TEXT PRIMARY KEY,
  event_id TEXT NOT NULL REFERENCES events(id),
  guest_token TEXT NOT NULL,
  name TEXT NOT NULL,
  rsvp TEXT NOT NULL DEFAULT 'PENDING' CHECK (rsvp IN ('YES', 'MAYBE', 'NO', 'PENDING')),
  plus_ones INTEGER NOT NULL DEFAULT 0,
  location_lat REAL,
  location_lng REAL,
  verdict TEXT CHECK (verdict IN ('SI', 'MAYBE', 'NO')),
  verdict_score REAL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE forecast_snapshots (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id TEXT NOT NULL REFERENCES events(id),
  location_lat REAL NOT NULL,
  location_lng REAL NOT NULL,
  captured_at TEXT NOT NULL DEFAULT (datetime('now')),
  score REAL NOT NULL,
  verdict TEXT NOT NULL CHECK (verdict IN ('SI', 'MAYBE', 'NO')),
  raw_data TEXT NOT NULL
);

CREATE INDEX idx_guests_event ON guests(event_id);
CREATE INDEX idx_snapshots_event ON forecast_snapshots(event_id, captured_at);
