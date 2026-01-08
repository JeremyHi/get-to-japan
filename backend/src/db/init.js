import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || './data/data.db';

export function initDatabase() {
  const db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent access
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Read and execute schema
  const schema = readFileSync(join(__dirname, 'schema.sql'), 'utf-8');
  db.exec(schema);

  // Seed transfer partners data
  seedTransferPartners(db);

  // Seed points valuations
  seedPointsValuations(db);

  console.log('Database initialized successfully');

  return db;
}

function seedTransferPartners(db) {
  const partners = [
    // Chase Ultimate Rewards
    { source: 'chase_ur', dest: 'united_mileageplus', ratio: 1.0, time: 0 },
    { source: 'chase_ur', dest: 'virgin_atlantic', ratio: 1.0, time: 0 },
    { source: 'chase_ur', dest: 'air_canada_aeroplan', ratio: 1.0, time: 24 },
    { source: 'chase_ur', dest: 'british_airways_avios', ratio: 1.0, time: 24 },
    { source: 'chase_ur', dest: 'singapore_krisflyer', ratio: 1.0, time: 48 },

    // Amex Membership Rewards
    { source: 'amex_mr', dest: 'ana_mileage_club', ratio: 1.0, time: 48 },
    { source: 'amex_mr', dest: 'delta_skymiles', ratio: 1.0, time: 0 },
    { source: 'amex_mr', dest: 'british_airways_avios', ratio: 1.0, time: 24 },
    { source: 'amex_mr', dest: 'air_france_flying_blue', ratio: 1.0, time: 24 },
    { source: 'amex_mr', dest: 'singapore_krisflyer', ratio: 1.0, time: 24 },

    // Capital One Miles
    { source: 'capital_one', dest: 'air_canada_aeroplan', ratio: 1.0, time: 24 },
    { source: 'capital_one', dest: 'air_france_flying_blue', ratio: 1.0, time: 24 },

    // Citi ThankYou
    { source: 'citi_ty', dest: 'singapore_krisflyer', ratio: 1.0, time: 24 },
    { source: 'citi_ty', dest: 'virgin_atlantic', ratio: 1.0, time: 24 },
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO transfer_partners (id, source_program, destination_program, transfer_ratio, transfer_time_hours)
    VALUES (?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((partners) => {
    for (const p of partners) {
      insert.run(`${p.source}_${p.dest}`, p.source, p.dest, p.ratio, p.time);
    }
  });

  insertMany(partners);
}

function seedPointsValuations(db) {
  const valuations = [
    // United MileagePlus
    { program: 'united_mileageplus', cabin: 'economy', value: 1.2 },
    { program: 'united_mileageplus', cabin: 'premium_economy', value: 1.5 },
    { program: 'united_mileageplus', cabin: 'business', value: 1.8 },
    { program: 'united_mileageplus', cabin: 'first', value: 2.2 },

    // ANA Mileage Club
    { program: 'ana_mileage_club', cabin: 'economy', value: 1.4 },
    { program: 'ana_mileage_club', cabin: 'premium_economy', value: 1.7 },
    { program: 'ana_mileage_club', cabin: 'business', value: 2.0 },
    { program: 'ana_mileage_club', cabin: 'first', value: 2.5 },

    // Delta SkyMiles
    { program: 'delta_skymiles', cabin: 'economy', value: 1.1 },
    { program: 'delta_skymiles', cabin: 'premium_economy', value: 1.3 },
    { program: 'delta_skymiles', cabin: 'business', value: 1.5 },
    { program: 'delta_skymiles', cabin: 'first', value: 1.8 },

    // American AAdvantage
    { program: 'american_aadvantage', cabin: 'economy', value: 1.3 },
    { program: 'american_aadvantage', cabin: 'premium_economy', value: 1.5 },
    { program: 'american_aadvantage', cabin: 'business', value: 1.7 },
    { program: 'american_aadvantage', cabin: 'first', value: 2.0 },

    // British Airways Avios
    { program: 'british_airways_avios', cabin: 'economy', value: 1.2 },
    { program: 'british_airways_avios', cabin: 'premium_economy', value: 1.4 },
    { program: 'british_airways_avios', cabin: 'business', value: 1.6 },
    { program: 'british_airways_avios', cabin: 'first', value: 1.8 },
  ];

  const insert = db.prepare(`
    INSERT OR REPLACE INTO points_valuations (id, program, cabin_class, value_cents)
    VALUES (?, ?, ?, ?)
  `);

  const insertMany = db.transaction((valuations) => {
    for (const v of valuations) {
      insert.run(`${v.program}_${v.cabin}`, v.program, v.cabin, v.value);
    }
  });

  insertMany(valuations);
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  initDatabase();
}

export default initDatabase;
