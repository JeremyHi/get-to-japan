// Simple client-side search store using localStorage
// In production, this would be replaced with a proper backend/database

export interface SearchParams {
  origin: string;
  departureDate: string;
  returnDate: string;
  paymentType: 'cash' | 'points' | 'both';
  selectedPrograms: string[];
  cabinClass: string;
  passengers: number;
  flexibleDates: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'flight_searches';
const MAX_SEARCHES = 50; // Limit stored searches

export function saveSearch(id: string, params: Omit<SearchParams, 'createdAt'>): void {
  if (typeof window === 'undefined') return;

  const searches = getSearches();
  searches[id] = {
    ...params,
    createdAt: Date.now(),
  };

  // Clean up old searches if we exceed the limit
  const searchIds = Object.keys(searches);
  if (searchIds.length > MAX_SEARCHES) {
    const sortedIds = searchIds.sort((a, b) => searches[a].createdAt - searches[b].createdAt);
    const idsToRemove = sortedIds.slice(0, searchIds.length - MAX_SEARCHES);
    idsToRemove.forEach(id => delete searches[id]);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(searches));
}

export function getSearch(id: string): SearchParams | null {
  if (typeof window === 'undefined') return null;

  const searches = getSearches();
  return searches[id] || null;
}

function getSearches(): Record<string, SearchParams> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}
