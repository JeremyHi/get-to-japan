# Get to Japan - MVP Planning Document

> A flight search service helping travelers find the best ways to get from the USA to Japan using cash, points, or a combination of both.

## Executive Summary

Get to Japan is a specialized flight search platform focused on one thing: helping users find optimal flights from major US airports (SFO, LAX, JFK, EWR) to Tokyo's airports (NRT, HND). Unlike generic flight search engines, we specialize in the points-and-miles ecosystem, helping users leverage their credit card rewards for maximum value.

---

## Table of Contents

1. [MVP Scope](#mvp-scope)
2. [Target Users](#target-users)
3. [Core Features](#core-features)
4. [User Flows](#user-flows)
5. [Data Sources & APIs](#data-sources--apis)
6. [Technical Architecture](#technical-architecture)
7. [Business Model](#business-model)
8. [Frontend Design Direction](#frontend-design-direction)
9. [Implementation Phases](#implementation-phases)

---

## MVP Scope

### Supported Routes

| Origin | Origin Code | Destination | Destination Code |
|--------|-------------|-------------|------------------|
| San Francisco International | SFO | Tokyo Narita | NRT |
| Los Angeles International | LAX | Tokyo Haneda | HND |
| John F. Kennedy International | JFK | | |
| Newark Liberty International | EWR | | |

### Airlines Serving These Routes (Direct)

- **ANA (All Nippon Airways)** - Star Alliance
- **Japan Airlines (JAL)** - Oneworld
- **United Airlines** - Star Alliance
- **American Airlines** - Oneworld
- **Delta Air Lines** - SkyTeam
- **Zipair** - Low-cost carrier (JAL subsidiary)

### Supported Payment Methods

1. **Cash** - Traditional flight purchases
2. **Points/Miles** - Award bookings through loyalty programs
3. **Hybrid** - Cash + points combinations

### Supported Points Programs (MVP)

| Program | Issuer | Key Transfer Partners for Japan |
|---------|--------|--------------------------------|
| Chase Ultimate Rewards | Chase | United, Virgin Atlantic (for ANA), Hyatt |
| Amex Membership Rewards | American Express | ANA, Delta, JAL (via British Airways) |
| Capital One Miles | Capital One | Air Canada, Air France-KLM |
| Citi ThankYou | Citi | JetBlue, Singapore Airlines |

---

## Target Users

### Primary Persona: "The Points Optimizer"

- Has multiple credit cards with transferable points
- Wants to maximize value per point
- Willing to be flexible on dates/airports for better deals
- Comfortable with moderately complex booking strategies

### Secondary Persona: "The Japan Enthusiast"

- Travels to Japan 1-3 times per year
- May use cash or points depending on availability
- Values simplicity but appreciates savings
- Wants quick comparison across options

### Tertiary Persona: "The First-Timer"

- Planning first trip to Japan
- Has points but doesn't know how to use them
- Needs guidance on best value and booking process
- Values education and clear explanations

---

## Core Features

### 1. Unified Search Engine

Search across cash fares and award availability simultaneously:

- Multi-airport origin search (e.g., "NYC" searches JFK + EWR)
- Multi-airport destination (NRT + HND combined)
- Flexible date search (+/- 3 days)
- Cabin class selection (Economy, Premium Economy, Business, First)
- Passenger count

### 2. Points Wallet

User profile feature to track their points balances:

- Connect/manually enter points balances
- Automatic calculation of "purchasing power" per program
- Recommendations based on available points

### 3. Smart Recommendations

AI-powered suggestions for optimal booking strategies:

- "Book cash via Amex Travel for 5x points"
- "Transfer Chase to United for 70K miles in Business"
- "Split payment: $200 cash + 25K points via portal"

### 4. Price Alerts

Monitor routes for price drops:

- Cash fare alerts
- Award availability alerts
- Points transfer bonus alerts

### 5. Booking Guidance

Step-by-step instructions for complex bookings:

- Which portal to book through
- Transfer partner instructions
- Timeline for transfers (instant vs 24-48 hours)

---

## User Flows

### Flow 1: Basic Search

```
┌─────────────────────────────────────────────────────────────────┐
│                         LANDING PAGE                             │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Where are you flying from?                                  │ │
│  │  [ NYC (JFK + EWR)          ▼ ]                             │ │
│  │                                                               │ │
│  │  When do you want to travel?                                 │ │
│  │  [ Dec 15, 2026  ] → [ Dec 29, 2026  ]  ☑ Flexible dates    │ │
│  │                                                               │ │
│  │  How do you want to pay?                                     │ │
│  │  ○ Cash only   ○ Points only   ● Cash + Points               │ │
│  │                                                               │ │
│  │  What points do you have?                                    │ │
│  │  ☑ Chase UR (150K)  ☑ Amex MR (80K)  ☐ Capital One          │ │
│  │                                                               │ │
│  │              [ 🔍 Find My Flights ]                          │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 2: Search Results

```
┌─────────────────────────────────────────────────────────────────┐
│  RESULTS: NYC → Tokyo  |  Dec 15-29  |  Sort: Best Value ▼      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ⭐ RECOMMENDED                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  United Business Class                    JFK → NRT        │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  70,000 Chase UR points + $50 taxes                       │  │
│  │  Value: 2.8¢/point ($2,000 cash price)                    │  │
│  │                                                            │  │
│  │  HOW TO BOOK:                                             │  │
│  │  1. Transfer Chase UR → United MileagePlus (instant)      │  │
│  │  2. Book on United.com                                    │  │
│  │                                                            │  │
│  │  [ View Details ]              [ Start Booking Guide → ]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  ANA Business Class                       JFK → HND        │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  95,000 Amex MR points + $150 taxes                       │  │
│  │  Value: 2.2¢/point ($2,200 cash price)                    │  │
│  │                                                            │  │
│  │  HOW TO BOOK:                                             │  │
│  │  1. Transfer Amex MR → ANA Mileage Club (1-2 days)        │  │
│  │  2. Book on ANA website                                   │  │
│  │                                                            │  │
│  │  [ View Details ]              [ Start Booking Guide → ]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  JAL Economy Class                        JFK → NRT        │  │
│  │  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │  │
│  │  $847 via Amex Travel (5x points back = 4,235 MR)         │  │
│  │  Effective cost: $762 after points value                  │  │
│  │                                                            │  │
│  │  [ View Details ]              [ Book on Amex Travel → ]   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 3: Booking Guide (Award Booking)

```
┌─────────────────────────────────────────────────────────────────┐
│  BOOKING GUIDE: United Business JFK → NRT                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  STEP 1 of 3: Transfer Points                        ○ ○ ○      │
│  ──────────────────────────────────────────────────────────────  │
│                                                                  │
│  Transfer 70,000 Chase Ultimate Rewards → United MileagePlus     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  📋 Instructions:                                        │    │
│  │                                                          │    │
│  │  1. Log in to chase.com/ultimaterewards                 │    │
│  │  2. Click "Transfer to Travel Partners"                 │    │
│  │  3. Select "United MileagePlus"                         │    │
│  │  4. Enter 70,000 points                                 │    │
│  │  5. Confirm transfer                                    │    │
│  │                                                          │    │
│  │  ⏱ Transfer time: Instant (usually under 5 minutes)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                  │
│  ⚠️  Important: Do NOT transfer points until you confirm         │
│      award availability on United.com. Transfers are             │
│      non-reversible.                                             │
│                                                                  │
│  [ ← Back ]                           [ I've Transferred → ]     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Flow 4: Subscription Prompt (Pro Upsell)

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     🗾 Go Pro                              │  │
│  │                                                            │  │
│  │  You've used your 3 free searches this month.             │  │
│  │                                                            │  │
│  │  Upgrade to Pro for unlimited searches:                   │  │
│  │                                                            │  │
│  │  ✓ Unlimited searches                                     │  │
│  │  ✓ Search up to 12 months ahead                          │  │
│  │  ✓ Unlimited price alerts                                │  │
│  │  ✓ Advanced filters (airline, alliance, stops)           │  │
│  │  ✓ Points transfer bonus notifications                   │  │
│  │  ✓ Calendar view of availability                         │  │
│  │                                                            │  │
│  │  ┌─────────────────┐    ┌─────────────────┐              │  │
│  │  │   $9.99/mo      │    │   $99/year      │              │  │
│  │  │   Monthly       │    │   Save 17%      │              │  │
│  │  └─────────────────┘    └─────────────────┘              │  │
│  │                                                            │  │
│  │  [ Start 7-Day Free Trial ]                               │  │
│  │                                                            │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Sources & APIs

### Cash Fare Data

| Provider | Use Case | Pricing Model | Notes |
|----------|----------|---------------|-------|
| **Amadeus Flight Offers API** | Real-time cash pricing | $0.35-$2.40/search | Best for booking capability |
| **Skyscanner API** | Price comparison | Free for partners | Redirect model, no booking |
| **Kiwi Tequila API** | Multi-city combinations | Free tier available | Good for complex routes |
| **Google Flights (scraping)** | Price validation | N/A | Legal gray area |

**Recommended Primary:** Skyscanner API for search, with Amadeus for booking validation.

### Award Availability Data

**Challenge:** No airline offers public APIs for award availability. The industry relies on scraping.

| Approach | Pros | Cons |
|----------|------|------|
| **Build own scraper** | Full control, real-time data | High maintenance, anti-bot measures |
| **Partner with Seats.aero** | Proven data, fast | Dependency, cost, no API available |
| **Aggregate from Point.me** | Real-time, user-friendly | No public API |
| **Manual data entry** | Accurate | Doesn't scale |

**Recommended Approach:**
1. **Phase 1:** Build scrapers for United, ANA, and JAL award calendars
2. **Phase 2:** Add American, Delta award searches
3. **Phase 3:** Explore partnerships with existing providers

### Points Program Data (Static Knowledge Base)

Since credit card programs don't offer APIs, we maintain a curated database:

```yaml
transfer_partners:
  chase_ultimate_rewards:
    transfer_ratio: 1:1
    partners:
      - united_mileageplus
      - virgin_atlantic_flying_club
      - air_canada_aeroplan
      - british_airways_avios
      - singapore_krisflyer
      - hyatt
    transfer_time:
      united_mileageplus: instant
      virgin_atlantic_flying_club: instant
      singapore_krisflyer: 24-48_hours

  amex_membership_rewards:
    transfer_ratio: 1:1
    partners:
      - ana_mileage_club
      - delta_skymiles
      - british_airways_avios
      - air_france_klm_flying_blue
      - singapore_krisflyer
    transfer_time:
      ana_mileage_club: 24-48_hours
      delta_skymiles: instant
```

### Points Valuation Database

Maintain current valuations (updated monthly):

| Program | Economy | Business | First |
|---------|---------|----------|-------|
| United MileagePlus | 1.2¢ | 1.8¢ | 2.2¢ |
| ANA Mileage Club | 1.4¢ | 2.0¢ | 2.5¢ |
| American AAdvantage | 1.3¢ | 1.7¢ | 2.0¢ |

---

## Technical Architecture

### System Overview (3-Service Docker Architecture)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DOCKER COMPOSE NETWORK                             │
│                              (get-to-japan)                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     SERVICE 1: FRONTEND                              │    │
│  │                      (Next.js 16 + React 19)                         │    │
│  │                          Port: 3001                                  │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│  │  │  Search  │  │ Results  │  │ Profile  │  │  Guide   │            │    │
│  │  │   Page   │  │   Page   │  │   Page   │  │   Page   │            │    │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │    │
│  │                                                                      │    │
│  │  API Proxy: /api/* → backend:3000                                   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                     SERVICE 2: BACKEND                               │    │
│  │                    (Express.js + Node.js 22)                         │    │
│  │                          Port: 3000                                  │    │
│  │                                                                      │    │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                 │    │
│  │  │   Search    │  │    User     │  │   Alerts    │                 │    │
│  │  │   Routes    │  │   Routes    │  │   Routes    │                 │    │
│  │  │  /v1/search │  │  /v1/users  │  │  /v1/alerts │                 │    │
│  │  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘                 │    │
│  │         │                │                │                         │    │
│  │         └────────────────┼────────────────┘                         │    │
│  │                          ▼                                          │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │  SQLite (/data/data.db)  │  Redis (cache reads)             │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                    │                                         │
│                                    ▼                                         │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │                SERVICE 3: SCRAPER + REDIS                            │    │
│  │               (Node.js 22 + Playwright + Redis)                      │    │
│  │                        Port: 6379 (Redis)                            │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                      REDIS SERVER                            │   │    │
│  │  │  • Award availability cache (TTL: 4 hours)                  │   │    │
│  │  │  • Cash fare cache (TTL: 15 minutes)                        │   │    │
│  │  │  • Points program data (TTL: 24 hours)                      │   │    │
│  │  │  • Job queue for scraping tasks                             │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  │                                                                      │    │
│  │  ┌─────────────────────────────────────────────────────────────┐   │    │
│  │  │                   SCRAPER WORKERS                            │   │    │
│  │  │  • United Award Scraper      (every 4 hours)                │   │    │
│  │  │  • ANA Award Scraper         (every 4 hours)                │   │    │
│  │  │  • JAL Award Scraper         (every 4 hours)                │   │    │
│  │  │  • Cash Fare Fetcher         (on-demand + cache)            │   │    │
│  │  │  • Transfer Bonus Monitor    (daily)                        │   │    │
│  │  └─────────────────────────────────────────────────────────────┘   │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                    │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │  Skyscanner │  │   Amadeus   │  │   Stripe    │  │   Resend    │        │
│  │     API     │  │     API     │  │  (Payments) │  │   (Email)   │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐                         │
│  │   United    │  │     ANA     │  │     JAL     │                         │
│  │   Website   │  │   Website   │  │   Website   │                         │
│  │  (scrape)   │  │  (scrape)   │  │  (scrape)   │                         │
│  └─────────────┘  └─────────────┘  └─────────────┘                         │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack (Matching predictions-aggregator)

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| **Frontend Framework** | Next.js | 16.x | SSR, API proxy, standalone output |
| **Frontend Library** | React | 19.x | Latest React features |
| **Styling** | Tailwind CSS | 4.x | Design system, dark theme |
| **Animations** | Framer Motion | 12.x | Smooth transitions |
| **Icons** | Lucide React | Latest | Consistent icon set |
| **Backend Framework** | Express.js | 4.x | REST API, middleware ecosystem |
| **Runtime** | Node.js | 22 | Latest LTS, ES modules |
| **Database** | SQLite | better-sqlite3 | Simple, file-based, WAL mode |
| **Cache/Queue** | Redis | 7.x | Award cache, job queue |
| **Scraping** | Playwright | Latest | Headless browser automation |
| **Auth** | JWT + bcryptjs | Latest | Stateless authentication |
| **Payments** | Stripe | 20.x | Subscriptions, webhooks |
| **Email** | Resend | 6.x | Transactional emails |
| **Language** | TypeScript | 5.x | Type safety throughout |

### Docker Services Configuration

```yaml
# docker-compose.yml
services:
  frontend:
    build: ./docker/frontend
    ports:
      - "127.0.0.1:3001:3001"
    environment:
      - INTERNAL_API_URL=http://backend:3000
    depends_on:
      backend:
        condition: service_healthy
    deploy:
      resources:
        limits:
          memory: 384M
        reservations:
          memory: 192M

  backend:
    build: ./docker/backend
    ports:
      - "127.0.0.1:3000:3000"
    environment:
      - DATABASE_PATH=/data/data.db
      - REDIS_URL=redis://scraper:6379
      - JWT_SECRET=${JWT_SECRET}
      - STRIPE_SECRET_KEY=${STRIPE_SECRET_KEY}
    volumes:
      - ./data:/data
    depends_on:
      scraper:
        condition: service_healthy
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 512M
        reservations:
          memory: 256M

  scraper:
    build: ./docker/scraper
    ports:
      - "127.0.0.1:6379:6379"
    environment:
      - REDIS_PORT=6379
      - SCRAPE_INTERVAL_HOURS=4
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3
    deploy:
      resources:
        limits:
          memory: 1G
        reservations:
          memory: 512M

volumes:
  redis-data:

networks:
  default:
    name: get-to-japan
```

### Project Directory Structure

```
get-to-japan/
├── frontend/
│   ├── src/
│   │   ├── app/                    # Next.js App Router pages
│   │   │   ├── page.tsx            # Landing/search page
│   │   │   ├── results/
│   │   │   ├── guide/
│   │   │   ├── profile/
│   │   │   ├── pricing/
│   │   │   └── layout.tsx
│   │   ├── components/
│   │   │   ├── SearchForm.tsx
│   │   │   ├── ResultCard.tsx
│   │   │   ├── BookingGuide.tsx
│   │   │   ├── PointsWallet.tsx
│   │   │   └── ...
│   │   ├── hooks/
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   └── styles/
│   │       └── globals.css         # Tailwind + design system
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── postcss.config.mjs
│
├── backend/
│   ├── src/
│   │   ├── index.js                # Express app entry
│   │   ├── routes/
│   │   │   ├── search.js           # /v1/search/*
│   │   │   ├── users.js            # /v1/users/*
│   │   │   ├── alerts.js           # /v1/alerts/*
│   │   │   └── webhooks.js         # /webhooks/stripe
│   │   ├── services/
│   │   │   ├── searchService.js
│   │   │   ├── cacheService.js     # Redis client
│   │   │   └── stripeService.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   └── db/
│   │       ├── schema.sql
│   │       └── queries.js
│   ├── package.json
│   └── .env.example
│
├── scraper/
│   ├── src/
│   │   ├── index.js                # Redis server + job runner
│   │   ├── scrapers/
│   │   │   ├── united.js           # United award scraper
│   │   │   ├── ana.js              # ANA award scraper
│   │   │   ├── jal.js              # JAL award scraper
│   │   │   └── cashFares.js        # Skyscanner/Amadeus client
│   │   ├── jobs/
│   │   │   ├── awardScrapeJob.js
│   │   │   └── transferBonusJob.js
│   │   └── data/
│   │       ├── transferPartners.json
│   │       └── pointsValuations.json
│   ├── package.json
│   └── redis.conf
│
├── docker/
│   ├── frontend/
│   │   └── Dockerfile
│   ├── backend/
│   │   └── Dockerfile
│   └── scraper/
│       └── Dockerfile
│
├── .github/
│   └── workflows/
│       ├── deploy-frontend.yml
│       ├── deploy-backend.yml
│       └── deploy-scraper.yml
│
├── data/                           # SQLite database (gitignored)
├── docker-compose.yml
├── docker-compose.dev.yml
├── docs/
│   └── MVP-PLANNING.md
└── README.md
```

### Database Schema (Core Tables)

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscription_tier VARCHAR(20) DEFAULT 'free', -- free, pro
  subscription_expires_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Points Wallets
CREATE TABLE points_wallets (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  program VARCHAR(50) NOT NULL, -- chase_ur, amex_mr, etc.
  balance INTEGER DEFAULT 0,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Award Availability Cache
CREATE TABLE award_availability (
  id UUID PRIMARY KEY,
  origin CHAR(3) NOT NULL,
  destination CHAR(3) NOT NULL,
  departure_date DATE NOT NULL,
  airline VARCHAR(50) NOT NULL,
  program VARCHAR(50) NOT NULL,
  cabin_class VARCHAR(20) NOT NULL,
  miles_required INTEGER,
  taxes_fees DECIMAL(10,2),
  seats_available INTEGER,
  scraped_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(origin, destination, departure_date, airline, program, cabin_class)
);

-- Search History
CREATE TABLE searches (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  origin VARCHAR(10) NOT NULL,
  destination VARCHAR(10) NOT NULL,
  departure_date DATE,
  return_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Price Alerts
CREATE TABLE price_alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  origin VARCHAR(10) NOT NULL,
  destination VARCHAR(10) NOT NULL,
  departure_date DATE,
  cabin_class VARCHAR(20),
  alert_type VARCHAR(20), -- cash, award, both
  target_price DECIMAL(10,2),
  target_miles INTEGER,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Business Model

### Freemium Tiers (Similar to Seats.aero)

| Feature | Free | Pro ($9.99/mo) |
|---------|------|----------------|
| Searches per month | 10 | Unlimited |
| Search range | 60 days | 365 days |
| Price alerts | 1 | Unlimited |
| Advanced filters | Basic | Full |
| Calendar view | - | ✓ |
| Transfer bonus alerts | - | ✓ |
| Points optimizer | Basic | Full |
| API access | - | Coming soon |

### Revenue Projections (Conservative)

| Month | Free Users | Pro Users | MRR |
|-------|------------|-----------|-----|
| 1 | 500 | 10 | $100 |
| 3 | 2,000 | 50 | $500 |
| 6 | 5,000 | 200 | $2,000 |
| 12 | 15,000 | 750 | $7,500 |

### Additional Revenue Streams (Future)

1. **Affiliate links** to booking portals
2. **Credit card referrals** (high value)
3. **Premium API access** for developers
4. **White-label licensing** to travel agencies

---

## Frontend Design Direction

### Aesthetic Vision: "Japanese Precision Meets Modern Minimalism"

Drawing from the frontend-design skill, our design should be:

- **Tone:** Refined minimalism with Japanese-inspired precision
- **Color:** Deep indigo (#1e3a5f) with sakura pink (#f8b4c8) accents
- **Typography:** Clean geometric sans-serif (Outfit or DM Sans) with Japanese-inspired display font
- **Motion:** Subtle, purposeful animations - gentle fades, smooth transitions
- **Spatial:** Generous whitespace, clear hierarchy, card-based results

### Key Design Principles

1. **One-Task Focus:** Each screen does one thing well
2. **Progressive Disclosure:** Complex features revealed as needed
3. **Trust Through Clarity:** Transparent pricing, clear value explanations
4. **Japan-Forward:** Subtle cultural touches without cliches

### Component Library Priorities

1. Search form with smart defaults
2. Result cards with expandable details
3. Comparison table for side-by-side analysis
4. Step-by-step booking guide with progress indicator
5. Calendar heatmap for availability overview
6. Points wallet dashboard

### Mobile-First Responsive Design

- Primary breakpoints: 320px, 768px, 1024px, 1440px
- Touch-optimized inputs on mobile
- Bottom sheet patterns for filters on mobile

---

## Implementation Phases

### Phase 1: Project Infrastructure

**Goal:** Set up the three-service Docker architecture with basic functionality

**Frontend Service:**
- [ ] Initialize Next.js 16 project with TypeScript
- [ ] Set up Tailwind CSS 4 with design system (globals.css)
- [ ] Configure standalone output mode for Docker
- [ ] Create landing page with search form component
- [ ] Basic results page skeleton
- [ ] Dockerfile with multi-stage build (Node 22)

**Backend Service:**
- [ ] Initialize Express.js project with ES modules
- [ ] Set up SQLite database with better-sqlite3
- [ ] Create schema (users, searches, alerts)
- [ ] JWT authentication middleware
- [ ] Health check endpoint
- [ ] Dockerfile with Node 22

**Scraper Service:**
- [ ] Set up Redis server in container
- [ ] Initialize Node.js job runner
- [ ] Create Skyscanner/Amadeus API client for cash fares
- [ ] Basic caching layer with TTL
- [ ] Dockerfile with Redis + Node 22 + Playwright

**DevOps:**
- [ ] docker-compose.yml for production
- [ ] docker-compose.dev.yml for local development
- [ ] GitHub Actions workflows for each service
- [ ] Environment variable templates

### Phase 2: Core Search Functionality

**Goal:** Working search for cash fares and award availability

**Search Features:**
- [ ] Cash fare search via Skyscanner API
- [ ] United award scraper (Playwright)
- [ ] Results aggregation service
- [ ] Search results caching in Redis

**Frontend:**
- [ ] Search form with all inputs (origin, destination, dates, payment type)
- [ ] Results page with ResultCard components
- [ ] Sorting and basic filtering
- [ ] Loading states and error handling

**Backend:**
- [ ] /v1/search/flights endpoint
- [ ] /v1/search/awards endpoint
- [ ] Combined results merger with value calculation
- [ ] Search history tracking

**Data:**
- [ ] Transfer partners knowledge base (JSON)
- [ ] Points valuations database
- [ ] Route/airline metadata

### Phase 3: User Features & Monetization

**Goal:** Launch subscription model with Pro features

**User System:**
- [ ] User registration and login
- [ ] Email verification via Resend
- [ ] Points wallet (manual balance entry)
- [ ] Search history per user

**Pro Features:**
- [ ] Stripe subscription integration
- [ ] Free vs Pro tier gating
- [ ] Price alerts system
- [ ] Calendar availability view
- [ ] Advanced filters (airline, alliance, stops)

**Booking Guide:**
- [ ] Step-by-step booking instructions component
- [ ] Transfer partner recommendations
- [ ] Direct links to booking portals

### Phase 4: Scale & Polish

**Goal:** Production-ready service with full airline coverage

**Additional Scrapers:**
- [ ] ANA award scraper
- [ ] JAL award scraper
- [ ] American award scraper
- [ ] Transfer bonus monitoring job

**Polish:**
- [ ] Mobile responsive refinement
- [ ] Performance optimization (caching, lazy loading)
- [ ] SEO optimization (meta tags, sitemap)
- [ ] Error tracking (Sentry integration)
- [ ] Analytics dashboard

**Production Hardening:**
- [ ] Rate limiting
- [ ] Scraper proxy rotation
- [ ] Database backups automation
- [ ] Monitoring and alerting

---

## Success Metrics

### North Star Metric
**Successful bookings attributed** (tracked via guide completions)

### Supporting Metrics

| Metric | Target (Month 3) | Target (Month 6) |
|--------|------------------|------------------|
| Monthly Active Users | 2,000 | 5,000 |
| Pro Conversion Rate | 2.5% | 4% |
| Search-to-Guide Rate | 15% | 20% |
| Guide Completion Rate | 40% | 50% |
| Churn Rate (Pro) | <10% | <8% |

---

## Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Airline blocks scrapers | High | Medium | Rotate proxies, respect rate limits, backup data sources |
| Low conversion to Pro | High | Medium | A/B test pricing, add more Pro features |
| Skyscanner API changes | Medium | Low | Abstract API layer, have Amadeus backup |
| Competition (seats.aero) | Medium | High | Differentiate with Japan focus and UX |
| Legal (scraping) | Medium | Low | Consult lawyer, use public data only |

---

## Open Questions

1. **Data freshness:** How often should we scrape award availability? (hourly vs daily)
2. **Scope expansion:** Should MVP include routes from other US cities?
3. **Booking integration:** Partner with OTA for actual booking, or guide-only?
4. **Mobile app:** PWA sufficient, or native app needed?

---

## Appendix

### A. Transfer Partner Reference

**Chase Ultimate Rewards → Japan Routes:**
- United MileagePlus (direct flights SFO/LAX/EWR/JFK → NRT/HND)
- Virgin Atlantic (transfer to ANA for great value)
- Air Canada Aeroplan (Star Alliance awards)

**Amex Membership Rewards → Japan Routes:**
- ANA Mileage Club (excellent for business/first)
- Delta SkyMiles (partner flights via Korean/China Eastern)
- British Airways Avios (book JAL awards)

### B. Competitive Analysis

| Feature | Get to Japan | Seats.aero | Point.me | Google Flights |
|---------|--------------|------------|----------|----------------|
| Japan focus | ✓ | - | - | - |
| Cash fares | ✓ | - | - | ✓ |
| Award search | ✓ | ✓ | ✓ | - |
| Points recommendations | ✓ | - | ✓ | - |
| Booking guidance | ✓ | - | ✓ | - |
| Price | $9.99/mo | $9.99/mo | $15/mo | Free |

### C. Research Sources

- [Amadeus Flight Offers API](https://developers.amadeus.com/self-service/category/flights/api-doc/flight-offers-search)
- [Skyscanner API Integration Guide](https://www.oneclickitsolution.com/blog/skyscanner-flight-api)
- [Top Flight APIs for 2025](https://nordicapis.com/10-apis-for-flights-prices-and-booking/)
- [Seats.aero Pricing Model](https://seats.aero/)
- [Chase Transfer Partners Guide](https://thepointsguy.com/loyalty-programs/chase-ultimate-rewards-transfer-partners/)
- [Amex Transfer Partners Guide](https://thepointsguy.com/credit-cards/membership-rewards-partner-guide/)
- [Direct Flights to Tokyo](https://tokyo-airports.com/2025/08/17/direct-flights-to-tokyo-your-comprehensive-guide-from-major-us-airports/)

---

*Document Version: 1.0*
*Last Updated: January 2026*
