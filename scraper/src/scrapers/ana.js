import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const ROUTES = [
  { origin: 'JFK', destination: 'HND' },
  { origin: 'SFO', destination: 'NRT' },
  { origin: 'SFO', destination: 'HND' },
  { origin: 'LAX', destination: 'NRT' },
  { origin: 'LAX', destination: 'HND' },
];

function getDateRange(days = 60) {
  const dates = [];
  const today = new Date();

  for (let i = 1; i <= days; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    dates.push(date.toISOString().split('T')[0]);
  }

  return dates;
}

function generateMockAwardData(origin, destination, date) {
  const cabinClasses = ['economy', 'business', 'first'];
  const results = [];

  for (const cabin of cabinClasses) {
    if (Math.random() > 0.4) { // ANA awards slightly less available
      // ANA has different award charts - generally better value
      const basePoints = {
        economy: 40000,
        business: 85000,
        first: 110000,
      };

      const variance = Math.floor(Math.random() * 5000);
      const miles = basePoints[cabin] + variance;

      results.push({
        id: uuidv4(),
        origin,
        destination,
        departureDate: date,
        airline: 'ANA',
        flightNumber: `NH${Math.floor(Math.random() * 900) + 100}`,
        program: 'ana_mileage_club',
        cabinClass: cabin,
        milesRequired: miles,
        taxesFees: cabin === 'economy' ? 100 : cabin === 'business' ? 150 : 200,
        seatsAvailable: Math.floor(Math.random() * 2) + 1, // ANA releases fewer seats
        departureTime: `${String(Math.floor(Math.random() * 6) + 10).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`,
        arrivalTime: `${String(Math.floor(Math.random() * 6) + 14).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '30'}`,
        durationMinutes: 720 + Math.floor(Math.random() * 180), // 12-15 hours
        stops: 0,
      });
    }
  }

  return results;
}

async function scrapeAnaAwards() {
  console.log('Starting ANA award scraper...');

  let redis;
  try {
    redis = new Redis(REDIS_URL);
  } catch (error) {
    console.warn('Redis not available');
  }

  const dates = getDateRange(60);
  const allResults = [];

  for (const route of ROUTES) {
    console.log(`Scraping ANA ${route.origin} -> ${route.destination}...`);

    for (const date of dates.slice(0, 30)) {
      const awards = generateMockAwardData(route.origin, route.destination, date);
      allResults.push(...awards);

      if (redis) {
        // Append to existing cache key (multiple programs per route)
        const cacheKey = `awards:${route.origin}:${route.destination}:${date}`;
        const existing = await redis.get(cacheKey);
        const combined = existing ? [...JSON.parse(existing), ...awards] : awards;
        await redis.setex(cacheKey, 14400, JSON.stringify(combined));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`ANA scraper completed. Found ${allResults.length} award options.`);

  if (redis) {
    await redis.set('ana:last_scrape', new Date().toISOString());
    await redis.set('ana:result_count', allResults.length);
    await redis.quit();
  }

  return allResults;
}

scrapeAnaAwards().catch(console.error);

export default scrapeAnaAwards;
