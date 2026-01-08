import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatPoints(points: number): string {
  return new Intl.NumberFormat('en-US').format(points);
}

export function calculatePointsValue(points: number, cashValue: number, taxesFees: number): number {
  const netCashValue = cashValue - taxesFees;
  return netCashValue / points;
}

export function formatPointsValue(valueInCents: number): string {
  return `${valueInCents.toFixed(1)}¢/point`;
}

export function getValueRating(valueInCents: number): 'high' | 'medium' | 'low' {
  if (valueInCents >= 2.0) return 'high';
  if (valueInCents >= 1.5) return 'medium';
  return 'low';
}

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function formatFlightDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}
