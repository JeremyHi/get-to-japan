'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DateRangePickerProps {
  departureDate: string;
  returnDate: string;
  onDepartureDateChange: (date: string) => void;
  onReturnDateChange: (date: string) => void;
  minDate?: Date;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export default function DateRangePicker({
  departureDate,
  returnDate,
  onDepartureDateChange,
  onReturnDateChange,
  minDate = new Date()
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    if (departureDate) {
      return new Date(departureDate);
    }
    return new Date();
  });
  const [selectionMode, setSelectionMode] = useState<'departure' | 'return'>('departure');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
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

  // Get calendar grid data for two months
  const getCalendarDays = (monthOffset: number = 0) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth() + monthOffset;

    const adjustedDate = new Date(year, month, 1);
    const adjustedYear = adjustedDate.getFullYear();
    const adjustedMonth = adjustedDate.getMonth();

    const firstDay = new Date(adjustedYear, adjustedMonth, 1);
    const lastDay = new Date(adjustedYear, adjustedMonth + 1, 0);
    const startPadding = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const days: { day: number | null; date: Date | null }[] = [];

    for (let i = 0; i < startPadding; i++) {
      days.push({ day: null, date: null });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, date: new Date(adjustedYear, adjustedMonth, i) });
    }

    return { days, month: adjustedMonth, year: adjustedYear };
  };

  const handlePrevMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleSelectDate = (date: Date) => {
    const formatted = date.toISOString().split('T')[0];

    if (selectionMode === 'departure') {
      onDepartureDateChange(formatted);
      // If return date exists and is before the new departure, clear it
      if (returnDate && new Date(returnDate) <= date) {
        onReturnDateChange('');
      }
      setSelectionMode('return');
    } else {
      onReturnDateChange(formatted);
      setIsOpen(false);
      setSelectionMode('departure');
    }
  };

  const isDateDisabled = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < (minDate || today)) return true;

    // If selecting return date, must be after departure
    if (selectionMode === 'return' && departureDate) {
      const departure = new Date(departureDate);
      return date <= departure;
    }

    return false;
  };

  const isSelectedDeparture = (date: Date) => {
    if (!departureDate) return false;
    const selected = new Date(departureDate);
    return date.toDateString() === selected.toDateString();
  };

  const isSelectedReturn = (date: Date) => {
    if (!returnDate) return false;
    const selected = new Date(returnDate);
    return date.toDateString() === selected.toDateString();
  };

  const isInRange = (date: Date) => {
    if (!departureDate) return false;

    const departure = new Date(departureDate);
    const endDate = returnDate ? new Date(returnDate) : (hoverDate && selectionMode === 'return' ? hoverDate : null);

    if (!endDate) return false;

    return date > departure && date < endDate;
  };

  const isHoverEnd = (date: Date) => {
    if (!hoverDate || selectionMode !== 'return') return false;
    return date.toDateString() === hoverDate.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const formatDisplayDate = (dateStr: string, placeholder: string) => {
    if (!dateStr) return placeholder;
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  const leftMonth = getCalendarDays(0);
  const rightMonth = getCalendarDays(1);

  const renderMonth = (monthData: ReturnType<typeof getCalendarDays>) => (
    <div className="flex-1 min-w-0">
      <div className="text-center mb-3">
        <span className="font-display font-semibold text-[var(--color-indigo-100)]">
          {MONTHS[monthData.month]}
        </span>
        <span className="text-[var(--color-indigo-400)] ml-2">
          {monthData.year}
        </span>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map(day => (
          <div
            key={day}
            className="text-center text-xs font-medium text-[var(--color-indigo-500)] py-1"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {monthData.days.map((dayData, index) => (
          <div key={index} className="aspect-square p-0.5">
            {dayData.day !== null && dayData.date && (
              <button
                type="button"
                onClick={() => !isDateDisabled(dayData.date!) && handleSelectDate(dayData.date!)}
                onMouseEnter={() => setHoverDate(dayData.date)}
                onMouseLeave={() => setHoverDate(null)}
                disabled={isDateDisabled(dayData.date)}
                className={cn(
                  "w-full h-full rounded-lg text-sm font-medium transition-all duration-150",
                  "flex items-center justify-center relative",
                  isDateDisabled(dayData.date) && "text-[var(--color-indigo-700)] cursor-not-allowed",
                  !isDateDisabled(dayData.date) && !isSelectedDeparture(dayData.date) && !isSelectedReturn(dayData.date) && !isInRange(dayData.date) && "hover:bg-[var(--color-indigo-800)] text-[var(--color-indigo-300)]",
                  isToday(dayData.date) && !isSelectedDeparture(dayData.date) && !isSelectedReturn(dayData.date) && "ring-1 ring-[var(--color-sakura-500)] ring-inset text-[var(--color-sakura-400)]",
                  isSelectedDeparture(dayData.date) && "bg-gradient-to-br from-[var(--color-sakura-500)] to-[var(--color-sakura-400)] text-[var(--color-indigo-950)] font-semibold shadow-lg rounded-l-lg rounded-r-lg",
                  isSelectedReturn(dayData.date) && "bg-gradient-to-br from-[var(--color-ocean-500)] to-[var(--color-ocean-400)] text-[var(--color-indigo-950)] font-semibold shadow-lg rounded-l-lg rounded-r-lg",
                  isInRange(dayData.date) && "bg-[var(--color-indigo-800)] text-[var(--color-indigo-200)]",
                  isHoverEnd(dayData.date) && !isDateDisabled(dayData.date) && selectionMode === 'return' && "bg-[var(--color-ocean-600)]/50 text-[var(--color-indigo-100)]"
                )}
              >
                {dayData.day}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="relative">
      {/* Input Button - shows both dates */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSelectionMode('departure');
        }}
        className={cn(
          "w-full flex items-center gap-3 bg-[var(--color-indigo-950)] border border-[var(--color-indigo-700)] rounded-lg",
          "px-4 py-3 text-left transition-all duration-200",
          "hover:border-[var(--color-indigo-600)]",
          isOpen && "border-[var(--color-sakura-500)] ring-[3px] ring-[rgba(244,114,182,0.1)]"
        )}
      >
        <Calendar className="w-5 h-5 text-[var(--color-indigo-500)] flex-shrink-0" />
        <div className="flex-1 flex items-center gap-2">
          <span className={cn(
            "text-base",
            departureDate ? "text-[var(--color-sakura-400)]" : "text-[var(--color-indigo-500)]"
          )}>
            {formatDisplayDate(departureDate, 'Departure')}
          </span>
          <span className="text-[var(--color-indigo-600)]">—</span>
          <span className={cn(
            "text-base",
            returnDate ? "text-[var(--color-ocean-400)]" : "text-[var(--color-indigo-500)]"
          )}>
            {formatDisplayDate(returnDate, 'Return')}
          </span>
        </div>
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
              "absolute z-50 top-full left-0 mt-2",
              "bg-[var(--color-indigo-900)] border border-[var(--color-indigo-700)]",
              "rounded-xl shadow-2xl overflow-hidden"
            )}
          >
            {/* Selection Mode Indicator */}
            <div className="flex border-b border-[var(--color-indigo-800)]">
              <button
                type="button"
                onClick={() => setSelectionMode('departure')}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                  selectionMode === 'departure'
                    ? "bg-[var(--color-sakura-500)]/10 text-[var(--color-sakura-400)] border-b-2 border-[var(--color-sakura-500)]"
                    : "text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)]"
                )}
              >
                Departure
                {departureDate && (
                  <span className="ml-2 text-xs opacity-75">
                    {formatDisplayDate(departureDate, '')}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => departureDate && setSelectionMode('return')}
                className={cn(
                  "flex-1 py-3 px-4 text-sm font-medium transition-colors",
                  selectionMode === 'return'
                    ? "bg-[var(--color-ocean-500)]/10 text-[var(--color-ocean-400)] border-b-2 border-[var(--color-ocean-500)]"
                    : "text-[var(--color-indigo-400)] hover:text-[var(--color-indigo-200)]",
                  !departureDate && "opacity-50 cursor-not-allowed"
                )}
              >
                Return
                {returnDate && (
                  <span className="ml-2 text-xs opacity-75">
                    {formatDisplayDate(returnDate, '')}
                  </span>
                )}
              </button>
            </div>

            {/* Calendar Navigation */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-indigo-800)]">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-2 rounded-lg hover:bg-[var(--color-indigo-800)] transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-[var(--color-indigo-400)]" />
              </button>

              <span className="text-sm text-[var(--color-indigo-400)]">
                {selectionMode === 'departure' ? 'Select departure date' : 'Select return date'}
              </span>

              <button
                type="button"
                onClick={handleNextMonth}
                className="p-2 rounded-lg hover:bg-[var(--color-indigo-800)] transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-[var(--color-indigo-400)]" />
              </button>
            </div>

            {/* Two Month Calendar Grid */}
            <div className="flex gap-4 p-4">
              {renderMonth(leftMonth)}
              <div className="w-px bg-[var(--color-indigo-800)]" />
              {renderMonth(rightMonth)}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-6 px-4 pb-4 text-xs text-[var(--color-indigo-500)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-[var(--color-sakura-500)] to-[var(--color-sakura-400)]" />
                <span>Departure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-[var(--color-ocean-500)] to-[var(--color-ocean-400)]" />
                <span>Return</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded bg-[var(--color-indigo-800)]" />
                <span>Trip duration</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
