import { Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Redis from 'ioredis';
import { searchQueries, awardQueries, fareQueries, referenceQueries } from '../db/queries.js';
import { authMiddleware, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Redis client for cache
let redis = null;
try {
  redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
} catch (error) {
  console.warn('Redis not available, caching disabled');
}

// Search limits
const FREE_MONTHLY_SEARCHES = 10;
const FREE_SEARCH_DAYS = 60;
const PRO_SEARCH_DAYS = 365;

// Main search endpoint
router.post('/flights', optionalAuth, async (req, res, next) => {
  try {
    const {
      origin,
      departureDate,
      returnDate,
      cabinClass = 'economy',
      passengers = 1,
      paymentType = 'both',
      selectedPrograms = [],
    } = req.body;

    // Validate required fields
    if (!origin || !departureDate) {
      return res.status(400).json({
        error: { message: 'Origin and departure date are required', code: 'VALIDATION_ERROR' },
      });
    }

    // Check search limits for non-Pro users
    const userId = req.user?.id;
    const ipAddress = req.ip;
    const isPro = req.user?.subscription_tier === 'pro';

    if (!isPro) {
      const usage = searchQueries.getUsageThisMonth(userId, ipAddress);
      if (usage && usage.search_count >= FREE_MONTHLY_SEARCHES) {
        return res.status(429).json({
          error: {
            message: `Free tier limited to ${FREE_MONTHLY_SEARCHES} searches per month. Upgrade to Pro for unlimited searches.`,
            code: 'SEARCH_LIMIT_EXCEEDED',
            upgradeUrl: '/pricing',
          },
        });
      }

      // Check date range for free users
      const searchDate = new Date(departureDate);
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + FREE_SEARCH_DAYS);
      if (searchDate > maxDate) {
        return res.status(400).json({
          error: {
            message: `Free tier limited to searching ${FREE_SEARCH_DAYS} days ahead. Upgrade to Pro for 12 months.`,
            code: 'DATE_RANGE_EXCEEDED',
            upgradeUrl: '/pricing',
          },
        });
      }
    }

    // Increment search usage
    searchQueries.incrementUsage(userId, ipAddress);

    // Log the search
    searchQueries.create({
      id: uuidv4(),
      userId,
      origin,
      destination: 'TYO',
      departureDate,
      returnDate,
      cabinClass,
      passengers,
      paymentType,
      selectedPrograms: JSON.stringify(selectedPrograms),
    });

    // Build results
    const results = {
      searchId: uuidv4(),
      origin,
      destination: 'TYO',
      departureDate,
      returnDate,
      cabinClass,
      passengers,
      outbound: [],
      return: [],
    };

    // Fetch cash fares if requested
    if (paymentType === 'cash' || paymentType === 'both') {
      // First try cache
      const cacheKey = `fares:${origin}:TYO:${departureDate}:${cabinClass}`;
      let cashFares = null;

      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          cashFares = JSON.parse(cached);
        }
      }

      if (!cashFares) {
        // Fetch from database (populated by scraper)
        cashFares = fareQueries.search(origin, 'TYO', departureDate, cabinClass);

        // Cache for 15 minutes
        if (redis && cashFares.length > 0) {
          await redis.setex(cacheKey, 900, JSON.stringify(cashFares));
        }
      }

      // Add cash fares to results
      results.outbound.push(...cashFares.map(fare => ({
        type: 'cash',
        airline: fare.airline,
        flightNumber: fare.flight_number,
        origin: fare.origin,
        destination: fare.destination,
        departureTime: fare.departure_time,
        arrivalTime: fare.arrival_time,
        durationMinutes: fare.duration_minutes,
        stops: fare.stops,
        cabinClass: fare.cabin_class,
        price: {
          amount: fare.price_usd,
          currency: 'USD',
        },
        bookingUrl: fare.booking_url,
      })));
    }

    // Fetch award availability if requested
    if (paymentType === 'points' || paymentType === 'both') {
      // Get award availability from cache/database
      const cacheKey = `awards:${origin}:TYO:${departureDate}:${cabinClass}`;
      let awards = null;

      if (redis) {
        const cached = await redis.get(cacheKey);
        if (cached) {
          awards = JSON.parse(cached);
        }
      }

      if (!awards) {
        awards = awardQueries.search(origin, 'TYO', departureDate, cabinClass);

        if (redis && awards.length > 0) {
          await redis.setex(cacheKey, 14400, JSON.stringify(awards)); // 4 hour cache
        }
      }

      // Get valuations for calculating value
      const valuations = referenceQueries.getAllValuations();
      const valuationMap = {};
      valuations.forEach(v => {
        valuationMap[`${v.program}_${v.cabin_class}`] = v.value_cents;
      });

      // Filter by selected programs and add to results
      const filteredAwards = awards.filter(award => {
        // Check if user has access to this program via transfer partners
        if (selectedPrograms.length === 0) return true;

        // Get all programs user can access
        const accessiblePrograms = new Set();
        selectedPrograms.forEach(program => {
          const partners = referenceQueries.getTransferPartners(program);
          partners.forEach(p => accessiblePrograms.add(p.destination_program));
        });

        return accessiblePrograms.has(award.program);
      });

      // Add awards to results with value calculation
      results.outbound.push(...filteredAwards.map(award => {
        const valuation = valuationMap[`${award.program}_${award.cabin_class}`] || 1.5;
        const estimatedCashValue = (award.miles_required * valuation) / 100;

        // Find best transfer path
        let bestTransfer = null;
        selectedPrograms.forEach(program => {
          const partners = referenceQueries.getTransferPartners(program);
          const partner = partners.find(p => p.destination_program === award.program);
          if (partner && (!bestTransfer || partner.transfer_time_hours < bestTransfer.transferTimeHours)) {
            bestTransfer = {
              sourceProgram: program,
              destinationProgram: award.program,
              transferRatio: partner.transfer_ratio,
              transferTimeHours: partner.transfer_time_hours,
            };
          }
        });

        return {
          type: 'award',
          airline: award.airline,
          flightNumber: award.flight_number,
          origin: award.origin,
          destination: award.destination,
          departureTime: award.departure_time,
          arrivalTime: award.arrival_time,
          durationMinutes: award.duration_minutes,
          stops: award.stops,
          cabinClass: award.cabin_class,
          program: award.program,
          award: {
            milesRequired: award.miles_required,
            taxesAndFees: award.taxes_fees,
            seatsAvailable: award.seats_available,
          },
          value: {
            centsPerPoint: valuation,
            estimatedCashValue: Math.round(estimatedCashValue),
          },
          transfer: bestTransfer,
        };
      }));
    }

    // Sort results by value (awards by cents per point desc, cash by price asc)
    results.outbound.sort((a, b) => {
      if (a.type === 'award' && b.type === 'award') {
        return (b.value?.centsPerPoint || 0) - (a.value?.centsPerPoint || 0);
      }
      if (a.type === 'cash' && b.type === 'cash') {
        return a.price.amount - b.price.amount;
      }
      // Awards with high value first
      if (a.type === 'award' && a.value?.centsPerPoint >= 2.0) return -1;
      if (b.type === 'award' && b.value?.centsPerPoint >= 2.0) return 1;
      return 0;
    });

    // Handle return flights similarly if returnDate provided
    if (returnDate) {
      // Similar logic for return flights...
      // For MVP, just note that return search would go here
    }

    res.json(results);
  } catch (error) {
    next(error);
  }
});

// Get transfer partners for a program
router.get('/transfer-partners/:program', (req, res) => {
  const { program } = req.params;
  const partners = referenceQueries.getTransferPartners(program);
  res.json({ program, partners });
});

// Get all valuations
router.get('/valuations', (req, res) => {
  const valuations = referenceQueries.getAllValuations();
  res.json({ valuations });
});

export default router;
