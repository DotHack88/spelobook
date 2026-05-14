'use client';

import { Calendar } from '@/components/ui/calendar';
import { useBookingStore } from '@/hooks/useBookingStore';
import type { DateRange } from 'react-day-picker';
import { it } from 'date-fns/locale';
import { FasciaOraria } from '@/types';
import { Clock, Sun, Sunset, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';

// Mock di date già prenotate per mostrare la funzionalità
const MOCK_BOOKED_DATES = [
  new Date(2025, 7, 15),
  new Date(2025, 7, 16),
  new Date(2025, 8, 20),
];

export function BookingDatePicker() {
  const { dateRange, setDateRange, fascia_oraria, setFasciaOraria, grotta } = useBookingStore();
  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    // In un'app reale caricheresti le date dal DB per la grotta selezionata
    setBookedDates(MOCK_BOOKED_DATES);
  }, [grotta]);

  const selected: DateRange | undefined = dateRange?.from
    ? { from: dateRange.from, to: dateRange.to ?? undefined }
    : undefined;

  const handleSelect = (range: DateRange | undefined) => {
    setDateRange(range?.from, range?.to);
  };

  const slots: { id: FasciaOraria; label: string; icon: any; time: string }[] = [
    { id: 'mattina', label: 'Mattina', icon: <Sun size={18} />, time: '08:00 - 13:00' },
    { id: 'pomeriggio', label: 'Pomeriggio', icon: <Sunset size={18} />, time: '14:00 - 19:00' },
    { id: 'intera_giornata', label: 'Intera Giornata', icon: <CalendarDays size={18} />, time: '08:00 - 19:00' },
  ];

  return (
    <div className="space-y-6">
      <div className="dark bg-stone-950 border border-stone-800 rounded-3xl p-4 flex flex-col items-center shadow-lg backdrop-blur-2xl">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={handleSelect}
          disabled={[
            { before: new Date() },
            // Se la grotta è verticale, disabilitiamo le date già occupate completamente
            ...(grotta?.orientamento === 'verticale' ? bookedDates : [])
          ]}
          modifiers={{
            booked: bookedDates
          }}
          modifiersStyles={{
            booked: { color: '#f87171', fontWeight: 'bold', textDecoration: 'line-through' }
          }}
          locale={it}
          numberOfMonths={1}
          className="rounded-md border-none text-white"
          classNames={{
            selected: "bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white",
            today: "bg-stone-800 text-emerald-400",
            outside: "text-stone-600 opacity-50",
            range_middle: "bg-emerald-900/30 text-emerald-200",
          }}
        />
        
        <div className="mt-4 flex items-center gap-4 text-[10px] uppercase tracking-widest text-stone-500 font-bold border-t border-stone-800 w-full pt-4 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <span>Disponibile</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <span>Occupato</span>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-sm font-bold text-stone-300 flex items-center gap-2 px-1">
          <Clock size={16} className="text-emerald-400" /> Fascia Oraria <span className="text-[10px] font-normal text-stone-500 uppercase tracking-tight">(Indicativa)</span>
        </h4>
        <div className="grid grid-cols-1 gap-2">
          {slots.map((slot) => (
            <button
              key={slot.id}
              onClick={() => setFasciaOraria(slot.id)}
              className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${
                fascia_oraria === slot.id
                  ? 'bg-emerald-600/20 border-emerald-500 text-emerald-100 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : 'bg-stone-900/40 border-stone-800 text-stone-400 hover:border-stone-700 hover:bg-stone-900/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${fascia_oraria === slot.id ? 'bg-emerald-500 text-white' : 'bg-stone-800 text-stone-500'}`}>
                  {slot.icon}
                </div>
                <div className="text-left">
                  <p className="font-bold text-sm">{slot.label}</p>
                  <p className="text-[10px] opacity-60 uppercase tracking-wider">{slot.time}</p>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                fascia_oraria === slot.id ? 'border-emerald-500 bg-emerald-500' : 'border-stone-700'
              }`}>
                {fascia_oraria === slot.id && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>
            </button>
          ))}
        </div>
        <p className="text-[10px] text-stone-500 italic px-1 leading-tight">
          * Nelle grotte orizzontali è consentito l&apos;accesso a più gruppi contemporaneamente. 
          Nelle verticali, l&apos;esclusività è garantita per slot.
        </p>
      </div>
    </div>
  );
}
