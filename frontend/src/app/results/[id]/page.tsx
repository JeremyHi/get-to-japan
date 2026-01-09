'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Plane, ArrowLeft, Clock, ArrowRight, Star, Info,
  Filter, ChevronDown, Sparkles, AlertCircle
} from 'lucide-react';
import Header from '@/components/Header';
import { getSearch, SearchParams } from '@/lib/searchStore';
import { formatCurrency, formatPoints, formatDate, formatFlightDuration, cn } from '@/lib/utils';

// Dummy flight data for Tokyo routes
const DUMMY_FLIGHTS = [
  {
    id: 'ua-nrt-1',
    airline: 'United',
    flightNumber: 'UA 79',
    departure: { airport: 'JFK', time: '11:30', city: 'New York' },
    arrival: { airport: 'NRT', time: '14:55+1', city: 'Tokyo Narita' },
    duration: 835,
    stops: 0,
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'business',
    cashPrice: 4250,
    pointsOptions: [
      { program: 'chase_ur', points: 70000, taxes: 52, transferPartner: 'United MileagePlus', valuePerPoint: 6.0 },
      { program: 'amex_mr', points: 88000, taxes: 52, transferPartner: 'ANA Mileage Club', valuePerPoint: 4.8 },
    ],
    recommended: true,
    seatsLeft: 4,
  },
  {
    id: 'ana-hnd-1',
    airline: 'ANA',
    flightNumber: 'NH 10',
    departure: { airport: 'JFK', time: '12:45', city: 'New York' },
    arrival: { airport: 'HND', time: '16:30+1', city: 'Tokyo Haneda' },
    duration: 825,
    stops: 0,
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'business',
    cashPrice: 5100,
    pointsOptions: [
      { program: 'amex_mr', points: 85000, taxes: 150, transferPartner: 'ANA Mileage Club', valuePerPoint: 5.8 },
      { program: 'chase_ur', points: 88000, taxes: 150, transferPartner: 'United MileagePlus', valuePerPoint: 5.6 },
    ],
    recommended: false,
    seatsLeft: 2,
  },
  {
    id: 'jal-hnd-1',
    airline: 'JAL',
    flightNumber: 'JL 5',
    departure: { airport: 'JFK', time: '13:15', city: 'New York' },
    arrival: { airport: 'HND', time: '17:00+1', city: 'Tokyo Haneda' },
    duration: 825,
    stops: 0,
    aircraft: 'Boeing 777-300ER',
    cabinClass: 'business',
    cashPrice: 4800,
    pointsOptions: [
      { program: 'chase_ur', points: 60000, taxes: 85, transferPartner: 'British Airways Avios', valuePerPoint: 7.9 },
      { program: 'amex_mr', points: 75000, taxes: 280, transferPartner: 'JAL Mileage Bank', valuePerPoint: 6.0 },
    ],
    recommended: false,
    seatsLeft: 6,
  },
  {
    id: 'aa-nrt-1',
    airline: 'American',
    flightNumber: 'AA 139',
    departure: { airport: 'JFK', time: '14:00', city: 'New York' },
    arrival: { airport: 'NRT', time: '17:15+1', city: 'Tokyo Narita' },
    duration: 855,
    stops: 0,
    aircraft: 'Boeing 777-200',
    cabinClass: 'business',
    cashPrice: 3900,
    pointsOptions: [
      { program: 'chase_ur', points: 75000, taxes: 45, transferPartner: 'British Airways Avios', valuePerPoint: 5.1 },
      { program: 'citi_ty', points: 70000, taxes: 45, transferPartner: 'American AAdvantage', valuePerPoint: 5.5 },
    ],
    recommended: false,
    seatsLeft: 8,
  },
  {
    id: 'ua-nrt-2',
    airline: 'United',
    flightNumber: 'UA 881',
    departure: { airport: 'EWR', time: '10:30', city: 'Newark' },
    arrival: { airport: 'NRT', time: '13:55+1', city: 'Tokyo Narita' },
    duration: 845,
    stops: 0,
    aircraft: 'Boeing 787-10',
    cabinClass: 'business',
    cashPrice: 4000,
    pointsOptions: [
      { program: 'chase_ur', points: 70000, taxes: 52, transferPartner: 'United MileagePlus', valuePerPoint: 5.6 },
    ],
    recommended: false,
    seatsLeft: 3,
  },
  {
    id: 'dl-hnd-1',
    airline: 'Delta',
    flightNumber: 'DL 7',
    departure: { airport: 'JFK', time: '17:00', city: 'New York' },
    arrival: { airport: 'HND', time: '20:30+1', city: 'Tokyo Haneda' },
    duration: 810,
    stops: 0,
    aircraft: 'Airbus A350-900',
    cabinClass: 'business',
    cashPrice: 4500,
    pointsOptions: [
      { program: 'amex_mr', points: 95000, taxes: 55, transferPartner: 'Delta SkyMiles', valuePerPoint: 4.7 },
    ],
    recommended: false,
    seatsLeft: 5,
  },
];

const PROGRAM_NAMES: Record<string, string> = {
  chase_ur: 'Chase Ultimate Rewards',
  amex_mr: 'Amex Membership Rewards',
  capital_one: 'Capital One Miles',
  citi_ty: 'Citi ThankYou',
};

const PROGRAM_COLORS: Record<string, string> = {
  chase_ur: '#0066b2',
  amex_mr: '#006fcf',
  capital_one: '#d03027',
  citi_ty: '#003b70',
};

export default function ResultsPage() {
  const params = useParams();
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'recommended' | 'price' | 'points' | 'duration'>('recommended');
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

  useEffect(() => {
    const id = params.id as string;
    if (id) {
      const search = getSearch(id);
      if (search) {
        setSearchParams(search);
      }
      // Simulate loading
      setTimeout(() => setLoading(false), 800);
    }
  }, [params.id]);

  // Filter flights based on search params
  const filteredFlights = DUMMY_FLIGHTS.filter(flight => {
    if (!searchParams) return true;

    // Filter by selected programs
    if (searchParams.paymentType !== 'cash') {
      const hasMatchingProgram = flight.pointsOptions.some(
        opt => searchParams.selectedPrograms.includes(opt.program)
      );
      if (!hasMatchingProgram) return false;
    }

    return true;
  });

  // Sort flights
  const sortedFlights = [...filteredFlights].sort((a, b) => {
    switch (sortBy) {
      case 'recommended':
        if (a.recommended && !b.recommended) return -1;
        if (!a.recommended && b.recommended) return 1;
        return a.cashPrice - b.cashPrice;
      case 'price':
        return a.cashPrice - b.cashPrice;
      case 'points':
        const aPoints = Math.min(...a.pointsOptions.map(o => o.points));
        const bPoints = Math.min(...b.pointsOptions.map(o => o.points));
        return aPoints - bPoints;
      case 'duration':
        return a.duration - b.duration;
      default:
        return 0;
    }
  });

  const getValueClass = (valuePerPoint: number) => {
    if (valuePerPoint >= 5) return 'text-[var(--color-success)]';
    if (valuePerPoint >= 3) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-indigo-400)]';
  };

  if (loading) {
    return (
      <>
        <Header />
        <main className="container-main py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px]">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="w-12 h-12 mb-4"
            >
              <Plane className="w-12 h-12 text-[var(--color-sakura-400)]" />
            </motion.div>
            <p className="text-[var(--color-indigo-400)]">Searching for the best flights...</p>
          </div>
        </main>
      </>
    );
  }

  if (!searchParams) {
    return (
      <>
        <Header />
        <main className="container-main py-12">
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <AlertCircle className="w-12 h-12 text-[var(--color-warning)] mb-4" />
            <h1 className="text-heading-2 mb-2">Search Not Found</h1>
            <p className="text-[var(--color-indigo-400)] mb-6">
              This search has expired or doesn't exist.
            </p>
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary"
            >
              Start New Search
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="container-main py-8">
        {/* Back Button & Search Summary */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            New Search
          </button>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="card-elevated"
          >
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-display font-bold text-[var(--color-indigo-100)]">
                      {searchParams.origin}
                    </div>
                    <div className="text-xs text-[var(--color-indigo-500)]">
                      {searchParams.origin === 'NYC' ? 'New York' : searchParams.origin === 'SFO' ? 'San Francisco' : 'Los Angeles'}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[var(--color-sakura-500)]" />
                    <ArrowRight className="w-5 h-5 text-[var(--color-indigo-500)]" />
                    <div className="w-2 h-2 rounded-full bg-[var(--color-ocean-500)]" />
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-display font-bold text-[var(--color-indigo-100)]">
                      TYO
                    </div>
                    <div className="text-xs text-[var(--color-indigo-500)]">Tokyo</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-[var(--color-indigo-700)]" />

                <div>
                  <div className="text-sm text-[var(--color-indigo-400)]">Dates</div>
                  <div className="text-[var(--color-indigo-200)]">
                    {searchParams.departureDate ? formatDate(searchParams.departureDate) : 'Any'}
                    {' — '}
                    {searchParams.returnDate ? formatDate(searchParams.returnDate) : 'Any'}
                  </div>
                </div>

                <div className="h-8 w-px bg-[var(--color-indigo-700)]" />

                <div>
                  <div className="text-sm text-[var(--color-indigo-400)]">Class</div>
                  <div className="text-[var(--color-indigo-200)] capitalize">{searchParams.cabinClass}</div>
                </div>

                <div className="h-8 w-px bg-[var(--color-indigo-700)]" />

                <div>
                  <div className="text-sm text-[var(--color-indigo-400)]">Points</div>
                  <div className="flex gap-1">
                    {searchParams.selectedPrograms.map(prog => (
                      <div
                        key={prog}
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PROGRAM_COLORS[prog] || '#666' }}
                        title={PROGRAM_NAMES[prog]}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {searchParams.flexibleDates && (
                <span className="badge badge-sakura">
                  Flexible +/- 3 days
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-heading-2 mb-1">{sortedFlights.length} flights found</h1>
            <p className="text-[var(--color-indigo-400)]">
              Outbound flights from {searchParams.origin === 'NYC' ? 'New York' : searchParams.origin} to Tokyo
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm text-[var(--color-indigo-400)]">Sort by</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="select w-auto"
            >
              <option value="recommended">Recommended</option>
              <option value="price">Lowest Cash Price</option>
              <option value="points">Lowest Points</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>

        {/* Flight Results */}
        <div className="space-y-4">
          {sortedFlights.map((flight, index) => (
            <motion.div
              key={flight.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                "card-result",
                flight.recommended && "recommended"
              )}
            >
              {/* Recommended Badge */}
              {flight.recommended && (
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge badge-sakura">
                    <Star className="w-3 h-3" />
                    Best Value
                  </span>
                  <span className="text-xs text-[var(--color-indigo-500)]">
                    Highest points value for your selection
                  </span>
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-4">
                {/* Airline & Flight Info */}
                <div className="flex items-center gap-4 min-w-[200px]">
                  <div className="w-12 h-12 rounded-lg bg-[var(--color-indigo-800)] flex items-center justify-center">
                    <span className="text-sm font-bold text-[var(--color-indigo-300)]">
                      {flight.airline.slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <div className="font-display font-semibold text-[var(--color-indigo-100)]">
                      {flight.airline}
                    </div>
                    <div className="text-sm text-[var(--color-indigo-500)]">
                      {flight.flightNumber} • {flight.aircraft}
                    </div>
                  </div>
                </div>

                {/* Route & Times */}
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-xl font-display font-bold text-[var(--color-indigo-100)]">
                      {flight.departure.time}
                    </div>
                    <div className="text-sm text-[var(--color-indigo-400)]">
                      {flight.departure.airport}
                    </div>
                  </div>

                  <div className="flex flex-col items-center min-w-[120px]">
                    <div className="text-xs text-[var(--color-indigo-500)] mb-1">
                      {formatFlightDuration(flight.duration)}
                    </div>
                    <div className="w-full flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full border-2 border-[var(--color-indigo-600)]" />
                      <div className="flex-1 h-px bg-[var(--color-indigo-600)]" />
                      <Plane className="w-4 h-4 text-[var(--color-indigo-500)] -rotate-45" />
                      <div className="flex-1 h-px bg-[var(--color-indigo-600)]" />
                      <div className="w-2 h-2 rounded-full bg-[var(--color-indigo-600)]" />
                    </div>
                    <div className="text-xs text-[var(--color-sakura-400)] mt-1">
                      {flight.stops === 0 ? 'Nonstop' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </div>
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-display font-bold text-[var(--color-indigo-100)]">
                      {flight.arrival.time}
                    </div>
                    <div className="text-sm text-[var(--color-indigo-400)]">
                      {flight.arrival.airport}
                    </div>
                  </div>
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-6">
                  {/* Cash Price */}
                  {(searchParams.paymentType === 'cash' || searchParams.paymentType === 'both') && (
                    <div className="text-right">
                      <div className="text-xs text-[var(--color-indigo-500)] mb-1">Cash</div>
                      <div className="text-xl font-display font-bold text-[var(--color-indigo-100)]">
                        {formatCurrency(flight.cashPrice)}
                      </div>
                    </div>
                  )}

                  {/* Points Prices */}
                  {(searchParams.paymentType === 'points' || searchParams.paymentType === 'both') && (
                    <div className="text-right">
                      <div className="text-xs text-[var(--color-indigo-500)] mb-1">Points</div>
                      {flight.pointsOptions
                        .filter(opt => searchParams.selectedPrograms.includes(opt.program))
                        .slice(0, 1)
                        .map(opt => (
                          <div key={opt.program}>
                            <div className="text-xl font-display font-bold text-[var(--color-sakura-400)]">
                              {formatPoints(opt.points)}
                            </div>
                            <div className="text-xs text-[var(--color-indigo-500)]">
                              + {formatCurrency(opt.taxes)} taxes
                            </div>
                          </div>
                        ))}
                    </div>
                  )}

                  {/* Select Button */}
                  <button
                    onClick={() => setExpandedFlight(expandedFlight === flight.id ? null : flight.id)}
                    className="btn btn-primary"
                  >
                    {expandedFlight === flight.id ? 'Hide Details' : 'View Details'}
                  </button>
                </div>
              </div>

              {/* Seats Left Warning */}
              {flight.seatsLeft <= 4 && (
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-warning)]">
                  <AlertCircle className="w-4 h-4" />
                  Only {flight.seatsLeft} seats left at this price
                </div>
              )}

              {/* Expanded Details */}
              {expandedFlight === flight.id && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t border-[var(--color-indigo-800)]"
                >
                  <h4 className="text-eyebrow mb-3">Booking Options</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {/* Cash Option */}
                    {(searchParams.paymentType === 'cash' || searchParams.paymentType === 'both') && (
                      <div className="p-4 rounded-lg bg-[var(--color-indigo-800)]/50 border border-[var(--color-indigo-700)]">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-[var(--color-indigo-400)]">Cash</span>
                          <span className="text-lg font-bold text-[var(--color-indigo-100)]">
                            {formatCurrency(flight.cashPrice)}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--color-indigo-500)] mb-3">
                          Book directly on {flight.airline}.com
                        </p>
                        <button className="btn btn-secondary btn-sm w-full">
                          Book with Cash
                        </button>
                      </div>
                    )}

                    {/* Points Options */}
                    {(searchParams.paymentType === 'points' || searchParams.paymentType === 'both') &&
                      flight.pointsOptions
                        .filter(opt => searchParams.selectedPrograms.includes(opt.program))
                        .map(opt => (
                          <div
                            key={opt.program}
                            className="p-4 rounded-lg bg-[var(--color-indigo-800)]/50 border border-[var(--color-indigo-700)]"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: PROGRAM_COLORS[opt.program] }}
                                />
                                <span className="text-sm text-[var(--color-indigo-400)]">
                                  {PROGRAM_NAMES[opt.program]}
                                </span>
                              </div>
                            </div>
                            <div className="flex items-baseline gap-2 mb-1">
                              <span className="text-lg font-bold text-[var(--color-sakura-400)]">
                                {formatPoints(opt.points)} pts
                              </span>
                              <span className="text-sm text-[var(--color-indigo-500)]">
                                + {formatCurrency(opt.taxes)}
                              </span>
                            </div>
                            <div className={cn("text-sm font-medium mb-2", getValueClass(opt.valuePerPoint))}>
                              {opt.valuePerPoint.toFixed(1)}¢ per point value
                            </div>
                            <p className="text-xs text-[var(--color-indigo-500)] mb-3">
                              Transfer to {opt.transferPartner}
                            </p>
                            <button className="btn btn-primary btn-sm w-full">
                              <Sparkles className="w-4 h-4" />
                              Book with Points
                            </button>
                          </div>
                        ))}
                  </div>

                  {/* How to Book Guide */}
                  <div className="mt-4 p-4 rounded-lg bg-[var(--color-ocean-600)]/10 border border-[var(--color-ocean-600)]/30">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-[var(--color-ocean-400)] flex-shrink-0 mt-0.5" />
                      <div>
                        <h5 className="font-display font-semibold text-[var(--color-ocean-400)] mb-1">
                          How to Book
                        </h5>
                        <ol className="text-sm text-[var(--color-indigo-300)] space-y-1 list-decimal list-inside">
                          <li>Transfer points from your credit card to the airline program</li>
                          <li>Allow 1-2 days for points to transfer</li>
                          <li>Book directly on the airline website using transferred points</li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {sortedFlights.length === 0 && (
          <div className="text-center py-12">
            <Plane className="w-12 h-12 text-[var(--color-indigo-600)] mx-auto mb-4" />
            <h3 className="text-heading-3 mb-2">No flights found</h3>
            <p className="text-[var(--color-indigo-400)] mb-6">
              Try adjusting your search criteria or selecting different points programs.
            </p>
            <button onClick={() => router.push('/')} className="btn btn-primary">
              Modify Search
            </button>
          </div>
        )}
      </main>
    </>
  );
}
