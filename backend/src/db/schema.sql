-- Get to Japan Database Schema
-- SQLite with WAL mode for better concurrent access

PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
  subscription_expires_at TEXT,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  email_verified INTEGER DEFAULT 0,
  email_verification_token TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Points Wallets - store user's points balances
CREATE TABLE IF NOT EXISTS points_wallets (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  program TEXT NOT NULL CHECK (program IN ('chase_ur', 'amex_mr', 'capital_one', 'citi_ty')),
  balance INTEGER DEFAULT 0,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(user_id, program)
);

-- Search History
CREATE TABLE IF NOT EXISTS searches (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE SET NULL,
  origin TEXT NOT NULL,
  destination TEXT DEFAULT 'TYO',
  departure_date TEXT NOT NULL,
  return_date TEXT,
  cabin_class TEXT DEFAULT 'economy',
  passengers INTEGER DEFAULT 1,
  payment_type TEXT DEFAULT 'both' CHECK (payment_type IN ('cash', 'points', 'both')),
  selected_programs TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Price Alerts
CREATE TABLE IF NOT EXISTS price_alerts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  origin TEXT NOT NULL,
  destination TEXT DEFAULT 'TYO',
  departure_date TEXT,
  return_date TEXT,
  cabin_class TEXT,
  alert_type TEXT DEFAULT 'both' CHECK (alert_type IN ('cash', 'award', 'both')),
  target_cash_price INTEGER,
  target_miles INTEGER,
  is_active INTEGER DEFAULT 1,
  last_checked_at TEXT,
  last_notified_at TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Award Availability Cache (populated by scraper)
CREATE TABLE IF NOT EXISTS award_availability (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT,
  program TEXT NOT NULL,
  cabin_class TEXT NOT NULL,
  miles_required INTEGER NOT NULL,
  taxes_fees INTEGER DEFAULT 0,
  seats_available INTEGER,
  departure_time TEXT,
  arrival_time TEXT,
  duration_minutes INTEGER,
  stops INTEGER DEFAULT 0,
  scraped_at TEXT DEFAULT (datetime('now')),
  UNIQUE(origin, destination, departure_date, airline, flight_number, program, cabin_class)
);

-- Cash Fare Cache (populated by API calls)
CREATE TABLE IF NOT EXISTS cash_fares (
  id TEXT PRIMARY KEY,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  departure_date TEXT NOT NULL,
  airline TEXT NOT NULL,
  flight_number TEXT,
  cabin_class TEXT NOT NULL,
  price_usd INTEGER NOT NULL,
  departure_time TEXT,
  arrival_time TEXT,
  duration_minutes INTEGER,
  stops INTEGER DEFAULT 0,
  booking_url TEXT,
  fetched_at TEXT DEFAULT (datetime('now')),
  UNIQUE(origin, destination, departure_date, airline, flight_number, cabin_class)
);

-- Transfer Partners Reference Data
CREATE TABLE IF NOT EXISTS transfer_partners (
  id TEXT PRIMARY KEY,
  source_program TEXT NOT NULL,
  destination_program TEXT NOT NULL,
  transfer_ratio REAL DEFAULT 1.0,
  transfer_time_hours INTEGER DEFAULT 0,
  notes TEXT
);

-- Points Valuations
CREATE TABLE IF NOT EXISTS points_valuations (
  id TEXT PRIMARY KEY,
  program TEXT NOT NULL,
  cabin_class TEXT NOT NULL,
  value_cents REAL NOT NULL,
  updated_at TEXT DEFAULT (datetime('now')),
  UNIQUE(program, cabin_class)
);

-- Session tokens for rate limiting searches
CREATE TABLE IF NOT EXISTS search_usage (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
  ip_address TEXT,
  month TEXT NOT NULL,
  search_count INTEGER DEFAULT 0,
  UNIQUE(user_id, month),
  UNIQUE(ip_address, month)
);

-- Create indexes for common queries
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_searches_user ON searches(user_id);
CREATE INDEX IF NOT EXISTS idx_searches_date ON searches(created_at);
CREATE INDEX IF NOT EXISTS idx_alerts_user ON price_alerts(user_id);
CREATE INDEX IF NOT EXISTS idx_alerts_active ON price_alerts(is_active);
CREATE INDEX IF NOT EXISTS idx_award_route ON award_availability(origin, destination, departure_date);
CREATE INDEX IF NOT EXISTS idx_award_scraped ON award_availability(scraped_at);
CREATE INDEX IF NOT EXISTS idx_cash_route ON cash_fares(origin, destination, departure_date);
CREATE INDEX IF NOT EXISTS idx_cash_fetched ON cash_fares(fetched_at);
