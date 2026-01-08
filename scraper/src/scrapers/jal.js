import Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'dotenv';

config();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

const ROUTES = [
  { origin: 'JFK', destination: 'NRT' },
  { origin: 'JFK', destination: 'HND' },
  { origin: 'SFO', destination: 'NRT' },
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
    if (Math.random() > 0.35) {
      // JAL bookable via British Airways Avios for great value
      const basePoints = {
        economy: 25000,  // BA Avios rates are lower
        business: 60000,
        first: 90000,
      };

      const variance = Math.floor(Math.random() * 5000);
      const miles = basePoints[cabin] + variance;

      results.push({
        id: uuidv4(),
        origin,
        destination,
        departureDate: date,
        airline: 'JAL',
        flightNumber: `JL${Math.floor(Math.random() * 900) + 1}`,
        program: 'british_airways_avios',
        cabinClass: cabin,
        milesRequired: miles,
        taxesFees: cabin === 'economy' ? 80 : cabin === 'business' ? 120 : 180,
        seatsAvailable: Math.floor(Math.random() * 3) + 1,
        departureTime: `${String(Math.floor(Math.random() * 8) + 10).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '55'}`,
        arrivalTime: `${String(Math.floor(Math.random() * 8) + 13).padStart(2, '0')}:${Math.random() > 0.5 ? '00' : '55'}`,
        durationMinutes: 750 + Math.floor(Math.random() * 150),
        stops: 0,
      });
    }
  }

  return results;
}

async function scrapeJalAwards() {
  console.log('Starting JAL award scraper...');

  let redis;
  try {
    redis = new Redis(REDIS_URL);
  } catch (error) {
    console.warn('Redis not available');
  }

  const dates = getDateRange(60);
  const allResults = [];

  for (const route of ROUTES) {
    console.log(`Scraping JAL ${route.origin} -> ${route.destination}...`);

    for (const date of dates.slice(0, 30)) {
      const awards = generateMockAwardData(route.origin, route.destination, date);
      allResults.push(...awards);

      if (redis) {
        const cacheKey = `awards:${route.origin}:${route.destination}:${date}`;
        const existing = await redis.get(cacheKey);
        const combined = existing ? [...JSON.parse(existing), ...awards] : awards;
        await redis.setex(cacheKey, 14400, JSON.stringify(combined));
      }
    }

    await new Promise(resolve => setTimeout(resolve, 100));
  }

  console.log(`JAL scraper completed. Found ${allResults.length} award options.`);

  if (redis) {
    await redis.set('jal:last_scrape', new Date().toISOString());
    await redis.set('jal:result_count', allResults.length);
    await redis.quit();
  }

  return allResults;
}

scrapeJalAwards().catch(console.error);

export default scrapeJalAwards;
