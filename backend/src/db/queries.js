import Database from 'better-sqlite3';

const DB_PATH = process.env.DATABASE_PATH || './data/data.db';
let db = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
  }
  return db;
}

// User queries
export const userQueries = {
  findByEmail: (email) => {
    return getDb().prepare('SELECT * FROM users WHERE email = ?').get(email);
  },

  findById: (id) => {
    return getDb().prepare('SELECT * FROM users WHERE id = ?').get(id);
  },

  create: (user) => {
    return getDb().prepare(`
      INSERT INTO users (id, email, password_hash, email_verification_token)
      VALUES (?, ?, ?, ?)
    `).run(user.id, user.email, user.passwordHash, user.verificationToken);
  },

  updateSubscription: (userId, tier, expiresAt, stripeSubscriptionId) => {
    return getDb().prepare(`
      UPDATE users
      SET subscription_tier = ?, subscription_expires_at = ?, stripe_subscription_id = ?, updated_at = datetime('now')
      WHERE id = ?
    `).run(tier, expiresAt, stripeSubscriptionId, userId);
  },

  setStripeCustomerId: (userId, customerId) => {
    return getDb().prepare(`
      UPDATE users SET stripe_customer_id = ?, updated_at = datetime('now') WHERE id = ?
    `).run(customerId, userId);
  },

  verifyEmail: (token) => {
    return getDb().prepare(`
      UPDATE users
      SET email_verified = 1, email_verification_token = NULL, updated_at = datetime('now')
      WHERE email_verification_token = ?
    `).run(token);
  },
};

// Points wallet queries
export const walletQueries = {
  getByUser: (userId) => {
    return getDb().prepare('SELECT * FROM points_wallets WHERE user_id = ?').all(userId);
  },

  upsert: (userId, program, balance) => {
    return getDb().prepare(`
      INSERT INTO points_wallets (id, user_id, program, balance)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id, program) DO UPDATE SET balance = ?, updated_at = datetime('now')
    `).run(`${userId}_${program}`, userId, program, balance, balance);
  },
};

// Search queries
export const searchQueries = {
  create: (search) => {
    return getDb().prepare(`
      INSERT INTO searches (id, user_id, origin, destination, departure_date, return_date, cabin_class, passengers, payment_type, selected_programs)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      search.id,
      search.userId,
      search.origin,
      search.destination,
      search.departureDate,
      search.returnDate,
      search.cabinClass,
      search.passengers,
      search.paymentType,
      search.selectedPrograms
    );
  },

  getByUser: (userId, limit = 10) => {
    return getDb().prepare(`
      SELECT * FROM searches WHERE user_id = ? ORDER BY created_at DESC LIMIT ?
    `).all(userId, limit);
  },

  getUsageThisMonth: (userId, ipAddress) => {
    const month = new Date().toISOString().slice(0, 7);
    if (userId) {
      return getDb().prepare(`
        SELECT search_count FROM search_usage WHERE user_id = ? AND month = ?
      `).get(userId, month);
    }
    return getDb().prepare(`
      SELECT search_count FROM search_usage WHERE ip_address = ? AND month = ?
    `).get(ipAddress, month);
  },

  incrementUsage: (userId, ipAddress) => {
    const month = new Date().toISOString().slice(0, 7);
    const id = userId || ipAddress;
    return getDb().prepare(`
      INSERT INTO search_usage (id, user_id, ip_address, month, search_count)
      VALUES (?, ?, ?, ?, 1)
      ON CONFLICT(${userId ? 'user_id' : 'ip_address'}, month) DO UPDATE SET search_count = search_count + 1
    `).run(`${id}_${month}`, userId, ipAddress, month);
  },
};

// Award availability queries
export const awardQueries = {
  search: (origin, destination, departureDate, cabinClass) => {
    // Expand NYC to JFK and EWR
    const origins = origin === 'NYC' ? ['JFK', 'EWR'] : [origin];
    // Expand TYO to NRT and HND
    const destinations = destination === 'TYO' ? ['NRT', 'HND'] : [destination];

    const placeholders = origins.map(() => '?').join(',');
    const destPlaceholders = destinations.map(() => '?').join(',');

    return getDb().prepare(`
      SELECT * FROM award_availability
      WHERE origin IN (${placeholders})
        AND destination IN (${destPlaceholders})
        AND departure_date = ?
        AND cabin_class = ?
        AND scraped_at > datetime('now', '-4 hours')
      ORDER BY miles_required ASC
    `).all(...origins, ...destinations, departureDate, cabinClass);
  },

  upsert: (award) => {
    return getDb().prepare(`
      INSERT INTO award_availability (
        id, origin, destination, departure_date, airline, flight_number, program, cabin_class,
        miles_required, taxes_fees, seats_available, departure_time, arrival_time, duration_minutes, stops
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(origin, destination, departure_date, airline, flight_number, program, cabin_class)
      DO UPDATE SET
        miles_required = ?, taxes_fees = ?, seats_available = ?, departure_time = ?,
        arrival_time = ?, duration_minutes = ?, stops = ?, scraped_at = datetime('now')
    `).run(
      award.id, award.origin, award.destination, award.departureDate, award.airline,
      award.flightNumber, award.program, award.cabinClass, award.milesRequired,
      award.taxesFees, award.seatsAvailable, award.departureTime, award.arrivalTime,
      award.durationMinutes, award.stops,
      // Update values
      award.milesRequired, award.taxesFees, award.seatsAvailable, award.departureTime,
      award.arrivalTime, award.durationMinutes, award.stops
    );
  },

  cleanOld: () => {
    return getDb().prepare(`
      DELETE FROM award_availability WHERE scraped_at < datetime('now', '-24 hours')
    `).run();
  },
};

// Cash fare queries
export const fareQueries = {
  search: (origin, destination, departureDate, cabinClass) => {
    const origins = origin === 'NYC' ? ['JFK', 'EWR'] : [origin];
    const destinations = destination === 'TYO' ? ['NRT', 'HND'] : [destination];

    const placeholders = origins.map(() => '?').join(',');
    const destPlaceholders = destinations.map(() => '?').join(',');

    return getDb().prepare(`
      SELECT * FROM cash_fares
      WHERE origin IN (${placeholders})
        AND destination IN (${destPlaceholders})
        AND departure_date = ?
        AND cabin_class = ?
        AND fetched_at > datetime('now', '-15 minutes')
      ORDER BY price_usd ASC
    `).all(...origins, ...destinations, departureDate, cabinClass);
  },

  upsert: (fare) => {
    return getDb().prepare(`
      INSERT INTO cash_fares (
        id, origin, destination, departure_date, airline, flight_number, cabin_class,
        price_usd, departure_time, arrival_time, duration_minutes, stops, booking_url
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(origin, destination, departure_date, airline, flight_number, cabin_class)
      DO UPDATE SET
        price_usd = ?, departure_time = ?, arrival_time = ?, duration_minutes = ?,
        stops = ?, booking_url = ?, fetched_at = datetime('now')
    `).run(
      fare.id, fare.origin, fare.destination, fare.departureDate, fare.airline,
      fare.flightNumber, fare.cabinClass, fare.priceUsd, fare.departureTime,
      fare.arrivalTime, fare.durationMinutes, fare.stops, fare.bookingUrl,
      // Update values
      fare.priceUsd, fare.departureTime, fare.arrivalTime, fare.durationMinutes,
      fare.stops, fare.bookingUrl
    );
  },
};

// Transfer partners and valuations
export const referenceQueries = {
  getTransferPartners: (sourceProgram) => {
    return getDb().prepare(`
      SELECT * FROM transfer_partners WHERE source_program = ?
    `).all(sourceProgram);
  },

  getValuation: (program, cabinClass) => {
    return getDb().prepare(`
      SELECT value_cents FROM points_valuations WHERE program = ? AND cabin_class = ?
    `).get(program, cabinClass);
  },

  getAllValuations: () => {
    return getDb().prepare('SELECT * FROM points_valuations').all();
  },
};

// Price alerts
export const alertQueries = {
  getByUser: (userId) => {
    return getDb().prepare('SELECT * FROM price_alerts WHERE user_id = ?').all(userId);
  },

  create: (alert) => {
    return getDb().prepare(`
      INSERT INTO price_alerts (id, user_id, origin, destination, departure_date, return_date, cabin_class, alert_type, target_cash_price, target_miles)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      alert.id, alert.userId, alert.origin, alert.destination, alert.departureDate,
      alert.returnDate, alert.cabinClass, alert.alertType, alert.targetCashPrice, alert.targetMiles
    );
  },

  delete: (id, userId) => {
    return getDb().prepare('DELETE FROM price_alerts WHERE id = ? AND user_id = ?').run(id, userId);
  },

  getActiveAlerts: () => {
    return getDb().prepare(`
      SELECT pa.*, u.email, u.subscription_tier
      FROM price_alerts pa
      JOIN users u ON pa.user_id = u.id
      WHERE pa.is_active = 1
    `).all();
  },
};
