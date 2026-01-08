'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DatePickerProps {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: Date;
  label?: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  minDate,
  label
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (value) {
      return new Date(value);
    }
    return new Date();
  });
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Get calendar grid data
  const getCalendarDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: (number | null)[] = [];

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startPadding; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    return days;
  };

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDate = (day: number) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const date = new Date(year, month, day);

    // Format as YYYY-MM-DD
    const formatted = date.toISOString().split('T')[0];
    onChange(formatted);
    setIsOpen(false);
  };

  const isDateDisabled = (day: number) => {
    if (!minDate) return false;
    const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
    return date < minDate;
  };

  const isSelectedDate = (day: number) => {
    if (!value) return false;
    const selectedDate = new Date(value);
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === viewDate.getMonth() &&
      selectedDate.getFullYear() === viewDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return placeholder;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calendarDays = getCalendarDays();

  return (
    <div ref={containerRef} className="relative">
      {/* Input Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center gap-3 bg-[var(--color-indigo-950)] border border-[var(--color-indigo-700)] rounded-lg",
          "px-4 py-3 text-left transition-all duration-200",
          "hover:border-[var(--color-indigo-600)]",
          isOpen && "border-[var(--color-sakura-500)] ring-[3px] ring-[rgba(244,114,182,0.1)]",
          !value && "text-[var(--color-indigo-500)]"
        )}
      >
        <Calendar className="w-5 h-5 text-[var(--color-indigo-500)] flex-shrink-0" />
        <span className={cn(
          "flex-1 text-base",
          value ? "text-[var(--color-indigo-100)]" : "text-[var(--color-indigo-500)]"
        )}>
          {formatDisplayDate(value)}
        </span>
        <ChevronRight className={cn(
          "w-4 h-4 text-[var(--color-indigo-500)] transition-transform duration-200",
          isOpen && "rotate-90"
        )} />
      </button>

      {/* Calendar Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              "absolute z-50 top-full left-0 mt-2 w-[320px]",
              "bg-[var(--color-indigo-900)] border border-[var(--color-indigo-700)]",
              "rounded-xl shadow-2xl overflow-hidden"
            )}
          >
            {/* Calendar Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-indigo-800)]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-[var(--color-indigo-800)] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--color-indigo-400)]" />
              </button>

              <div className="text-center">
                <span className="font-display font-semibold text-[var(--color-indigo-100)]">
                  {MONTHS[viewDate.getMonth()]}
                </span>
                <span className="text-[var(--color-indigo-400)] ml-2">
                  {viewDate.getFullYear()}
                </span>
              </div>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-[var(--color-indigo-800)] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[var(--color-indigo-400)]" />
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 px-3 py-2 border-b border-[var(--color-indigo-800)]">
              {DAYS.map(day => (
                <div
                  key={day}
                  className="text-center text-xs font-medium text-[var(--color-indigo-500)] py-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1 p-3">
              {calendarDays.map((day, index) => (
                <div key={index} className="aspect-square">
                  {day !== null && (
                    <button
                      type="button"
                      onClick={() => !isDateDisabled(day) && handleSelectDate(day)}
                      disabled={isDateDisabled(day)}
                      className={cn(
                        "w-full h-full rounded-lg text-sm font-medium transition-all duration-150",
                        "flex items-center justify-center",
                        isDateDisabled(day) && "text-[var(--color-indigo-700)] cursor-not-allowed",
                        !isDateDisabled(day) && !isSelectedDate(day) && "hover:bg-[var(--color-indigo-800)] text-[var(--color-indigo-300)]",
                        isToday(day) && !isSelectedDate(day) && "ring-1 ring-[var(--color-sakura-500)] ring-inset text-[var(--color-sakura-400)]",
                        isSelectedDate(day) && "bg-gradient-to-br from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] text-[var(--color-indigo-950)] font-semibold shadow-lg"
                      )}
                    >
                      {day}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 px-3 pb-3">
              <button
                type="button"
                onClick={() => {
                  const today = new Date();
                  onChange(today.toISOString().split('T')[0]);
                  setIsOpen(false);
                }}
                className="flex-1 py-2 text-sm font-medium text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)] hover:bg-[var(--color-indigo-800)] rounded-lg transition-colors"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  onChange(tomorrow.toISOString().split('T')[0]);
                  setIsOpen(false);
                }}
                className="flex-1 py-2 text-sm font-medium text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)] hover:bg-[var(--color-indigo-800)] rounded-lg transition-colors"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  onChange(nextWeek.toISOString().split('T')[0]);
                  setIsOpen(false);
                }}
                className="flex-1 py-2 text-sm font-medium text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)] hover:bg-[var(--color-indigo-800)] rounded-lg transition-colors"
              >
                +1 Week
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
