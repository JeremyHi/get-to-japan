'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Calendar, CreditCard, Search, ChevronDown, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

const ORIGIN_OPTIONS = [
  { value: 'NYC', label: 'New York (JFK + EWR)', airports: ['JFK', 'EWR'] },
  { value: 'SFO', label: 'San Francisco (SFO)', airports: ['SFO'] },
  { value: 'LAX', label: 'Los Angeles (LAX)', airports: ['LAX'] },
];

const POINTS_PROGRAMS = [
  { id: 'chase_ur', name: 'Chase Ultimate Rewards', color: '#0066b2' },
  { id: 'amex_mr', name: 'Amex Membership Rewards', color: '#006fcf' },
  { id: 'capital_one', name: 'Capital One Miles', color: '#d03027' },
  { id: 'citi_ty', name: 'Citi ThankYou', color: '#003b70' },
];

const CABIN_CLASSES = [
  { value: 'economy', label: 'Economy' },
  { value: 'premium_economy', label: 'Premium Economy' },
  { value: 'business', label: 'Business' },
  { value: 'first', label: 'First' },
];

type PaymentType = 'cash' | 'points' | 'both';

interface SearchFormData {
  origin: string;
  departureDate: string;
  returnDate: string;
  paymentType: PaymentType;
  selectedPrograms: string[];
  cabinClass: string;
  passengers: number;
  flexibleDates: boolean;
}

interface SearchFormProps {
  onSearch: (data: SearchFormData) => void;
}

export default function SearchForm({ onSearch }: SearchFormProps) {
  const [formData, setFormData] = useState<SearchFormData>({
    origin: 'NYC',
    departureDate: '',
    returnDate: '',
    paymentType: 'both',
    selectedPrograms: ['chase_ur', 'amex_mr'],
    cabinClass: 'economy',
    passengers: 1,
    flexibleDates: true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(formData);
  };

  const toggleProgram = (programId: string) => {
    setFormData(prev => ({
      ...prev,
      selectedPrograms: prev.selectedPrograms.includes(programId)
        ? prev.selectedPrograms.filter(id => id !== programId)
        : [...prev.selectedPrograms, programId],
    }));
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="card-elevated max-w-3xl mx-auto"
    >
      {/* Origin Selection */}
      <div className="mb-6">
        <label className="block text-eyebrow mb-2">Where are you flying from?</label>
        <div className="relative">
          <Plane className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
          <select
            value={formData.origin}
            onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
            className="select pl-12"
          >
            {ORIGIN_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <p className="text-muted text-sm mt-2">
          Destination: Tokyo (NRT + HND)
        </p>
      </div>

      {/* Date Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-eyebrow mb-2">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
            <input
              type="date"
              value={formData.departureDate}
              onChange={(e) => setFormData(prev => ({ ...prev, departureDate: e.target.value }))}
              className="input pl-12"
              required
            />
          </div>
        </div>
        <div>
          <label className="block text-eyebrow mb-2">Return</label>
          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
            <input
              type="date"
              value={formData.returnDate}
              onChange={(e) => setFormData(prev => ({ ...prev, returnDate: e.target.value }))}
              className="input pl-12"
              required
            />
          </div>
        </div>
      </div>

      {/* Flexible Dates Toggle */}
      <div className="mb-6">
        <label className="checkbox-item inline-flex">
          <input
            type="checkbox"
            checked={formData.flexibleDates}
            onChange={(e) => setFormData(prev => ({ ...prev, flexibleDates: e.target.checked }))}
            className="sr-only"
          />
          <div className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
            formData.flexibleDates
              ? "bg-[var(--color-sakura-500)] border-[var(--color-sakura-500)]"
              : "border-[var(--color-indigo-600)]"
          )}>
            {formData.flexibleDates && (
              <svg className="w-3 h-3 text-[var(--color-indigo-950)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          <span className="text-[var(--color-indigo-300)]">Flexible dates (+/- 3 days)</span>
        </label>
      </div>

      <div className="divider" />

      {/* Payment Type */}
      <div className="mb-6">
        <label className="block text-eyebrow mb-3">How do you want to pay?</label>
        <div className="radio-group">
          {[
            { value: 'cash', label: 'Cash only' },
            { value: 'points', label: 'Points only' },
            { value: 'both', label: 'Cash + Points' },
          ].map(option => (
            <button
              key={option.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, paymentType: option.value as PaymentType }))}
              className={cn('radio-item', formData.paymentType === option.value && 'selected')}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Points Programs - Show if points or both selected */}
      {(formData.paymentType === 'points' || formData.paymentType === 'both') && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-6"
        >
          <label className="block text-eyebrow mb-3">What points do you have?</label>
          <div className="checkbox-group">
            {POINTS_PROGRAMS.map(program => (
              <button
                key={program.id}
                type="button"
                onClick={() => toggleProgram(program.id)}
                className={cn(
                  'checkbox-item',
                  formData.selectedPrograms.includes(program.id) && 'selected'
                )}
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: program.color }}
                />
                <span>{program.name}</span>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="divider" />

      {/* Cabin Class & Passengers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div>
          <label className="block text-eyebrow mb-2">Cabin Class</label>
          <select
            value={formData.cabinClass}
            onChange={(e) => setFormData(prev => ({ ...prev, cabinClass: e.target.value }))}
            className="select"
          >
            {CABIN_CLASSES.map(cabin => (
              <option key={cabin.value} value={cabin.value}>
                {cabin.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-eyebrow mb-2">Passengers</label>
          <div className="relative">
            <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-indigo-500)]" />
            <select
              value={formData.passengers}
              onChange={(e) => setFormData(prev => ({ ...prev, passengers: parseInt(e.target.value) }))}
              className="select pl-12"
            >
              {[1, 2, 3, 4, 5, 6].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'passenger' : 'passengers'}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn btn-primary btn-lg w-full"
      >
        <Search className="w-5 h-5" />
        Find My Flights
      </motion.button>
    </motion.form>
  );
}
