'use client';

import { Calendar } from '@/components/ui/calendar';
import { useBookingStore } from '@/hooks/useBookingStore';
import type { DateRange } from 'react-day-picker';
import { it } from 'date-fns/locale';

export function BookingDatePicker() {
  const { dateRange, setDateRange } = useBookingStore();

  const selected: DateRange | undefined = dateRange?.from
    ? { from: dateRange.from, to: dateRange.to ?? undefined }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range?.from, range?.to);
  };

  return (
    <div className="spelo-calendar bg-stone-900/80 border border-stone-800 rounded-3xl p-4 flex justify-center shadow-lg">
      <Calendar
        mode="range"
        selected={selected}
        onSelect={handleSelect}
        disabled={{ before: new Date() }}
        locale={it}
        numberOfMonths={1}
      />
    </div>
  );
}
