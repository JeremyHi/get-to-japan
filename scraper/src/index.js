import { config } from 'dotenv';
import Redis from 'ioredis';
import cron from 'node-cron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REDIS_PORT = process.env.REDIS_PORT || 6379;
const SCRAPE_INTERVAL_HOURS = parseInt(process.env.SCRAPE_INTERVAL_HOURS) || 4;

// Routes to scrape
const ROUTES = [
  { origin: 'JFK', destination: 'NRT' },
  { origin: 'JFK', destination: 'HND' },
  { origin: 'EWR', destination: 'NRT' },
  { origin: 'EWR', destination: 'HND' },
  { origin: 'SFO', destination: 'NRT' },
  { origin: 'SFO', destination: 'HND' },
  { origin: 'LAX', destination: 'NRT' },
  { origin: 'LAX', destination: 'HND' },
];

// Airlines to scrape
const AIRLINES = ['united', 'ana', 'jal'];

let redis = null;

async function initRedis() {
  return new Promise((resolve, reject) => {
    redis = new Redis({
      port: REDIS_PORT,
      host: 'localhost',
      maxRetriesPerRequest: 3,
    });

    redis.on('connect', () => {
      console.log(`Redis connected on port ${REDIS_PORT}`);
      resolve(redis);
    });

    redis.on('error', (err) => {
      console.error('Redis error:', err);
    });

    setTimeout(() => {
      if (!redis.status === 'ready') {
        reject(new Error('Redis connection timeout'));
      }
    }, 5000);
  });
}

async function runScraper(airline) {
  return new Promise((resolve, reject) => {
    console.log(`Starting ${airline} scraper...`);

    const scraperPath = join(__dirname, 'scrapers', `${airline}.js`);
    const child = spawn('node', [scraperPath], {
      stdio: 'inherit',
      env: {
        ...process.env,
        REDIS_URL: `redis://localhost:${REDIS_PORT}`,
      },
    });

    child.on('close', (code) => {
      if (code === 0) {
        console.log(`${airline} scraper completed successfully`);
        resolve();
      } else {
        console.error(`${airline} scraper exited with code ${code}`);
        reject(new Error(`Scraper exited with code ${code}`));
      }
    });

    child.on('error', (err) => {
      console.error(`Error running ${airline} scraper:`, err);
      reject(err);
    });
  });
}

async function runAllScrapers() {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`Starting scrape cycle at ${new Date().toISOString()}`);
  console.log(`${'='.repeat(50)}\n`);

  for (const airline of AIRLINES) {
    try {
      await runScraper(airline);
    } catch (error) {
      console.error(`Failed to run ${airline} scraper:`, error.message);
    }

    // Wait a bit between scrapers to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 30000));
  }

  // Store last scrape time
  if (redis) {
    await redis.set('last_scrape_time', new Date().toISOString());
  }

  console.log(`\nScrape cycle completed at ${new Date().toISOString()}`);
}

async function main() {
  console.log('Starting Get to Japan Scraper Service');
  console.log(`Redis port: ${REDIS_PORT}`);
  console.log(`Scrape interval: ${SCRAPE_INTERVAL_HOURS} hours`);

  try {
    await initRedis();
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    // Continue without Redis - scrapers can still write to backend DB
  }

  // Run initial scrape
  console.log('Running initial scrape...');
  await runAllScrapers();

  // Schedule regular scrapes
  const cronExpression = `0 */${SCRAPE_INTERVAL_HOURS} * * *`; // Every N hours
  console.log(`Scheduling scrapes with cron: ${cronExpression}`);

  cron.schedule(cronExpression, async () => {
    await runAllScrapers();
  });

  // Health check endpoint info
  console.log('\nScraper service running. Scrapers will run every', SCRAPE_INTERVAL_HOURS, 'hours.');

  // Keep the process alive
  process.on('SIGINT', () => {
    console.log('\nShutting down scraper service...');
    if (redis) {
      redis.quit();
    }
    process.exit(0);
  });
}

main().catch(console.error);
