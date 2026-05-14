'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Grotta, TipologiaGrotta } from '@/types';
import { useBookingStore } from '@/hooks/useBookingStore';
import { CaveCard } from './CaveCard';
import { GroupForm } from './GroupForm';
import { StepIndicator } from './StepIndicator';
import { BookingDatePicker } from './BookingDatePicker';
import { BookingSummary } from './BookingSummary';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const FILTRI: { label: string; value: TipologiaGrotta | 'tutte'; emoji: string; className: string }[] = [
  { label: 'Tutte',       value: 'tutte',       emoji: '🗺️', className: 'bg-stone-800 text-white border-stone-600' },
  { label: 'Carsica',     value: 'carsica',     emoji: '🪨', className: 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20' },
  { label: 'Marina',      value: 'marina',      emoji: '🌊', className: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20' },
  { label: 'Lavica',      value: 'lavica',      emoji: '🌋', className: 'bg-red-600/10 text-red-400 border-red-500/30 hover:bg-red-600/20' },
  { label: 'Glaciale',    value: 'glaciale',    emoji: '🧊', className: 'bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20' },
  { label: 'Tettonica',   value: 'tettonica',   emoji: '⛰️', className: 'bg-stone-500/10 text-stone-300 border-stone-500/30 hover:bg-stone-500/20' },
  { label: 'Di Crollo',   value: 'crollo',      emoji: '🪨', className: 'bg-orange-500/10 text-orange-300 border-orange-500/30 hover:bg-orange-500/20' },
  { label: 'Artificiale', value: 'artificiale', emoji: '🏛️', className: 'bg-purple-500/10 text-purple-300 border-purple-500/30 hover:bg-purple-500/20' },
];

const ACTIVE_FILTRI: Record<string, string> = {
  tutte:       'bg-stone-700 text-white border-stone-500',
  carsica:     'bg-amber-500/30 text-amber-200 border-amber-400/50',
  marina:      'bg-cyan-500/30 text-cyan-200 border-cyan-400/50',
  lavica:      'bg-red-600/30 text-red-300 border-red-400/50',
  glaciale:    'bg-sky-500/30 text-sky-200 border-sky-400/50',
  tettonica:   'bg-stone-600/60 text-stone-200 border-stone-400/50',
  crollo:      'bg-orange-500/30 text-orange-200 border-orange-400/50',
  artificiale: 'bg-purple-500/30 text-purple-200 border-purple-400/50',
};

export function BookingFlow({ caves }: { caves: Grotta[] }) {
  const { step, setGrotta, grotta, dateRange, nextStep } = useBookingStore();
  const searchParams = useSearchParams();
  const [filtro, setFiltro] = useState<TipologiaGrotta | 'tutte'>('tutte');
  const [hasHydrated, setHasHydrated] = useState(false);

  // Forza l'idratazione dello store persistito
  useEffect(() => {
    setHasHydrated(true);
  }, []);

  // Sincronizza lo step dall'URL se presente (usato dalla nuova barra di ricerca)
  useEffect(() => {
    if (!hasHydrated) return;
    const urlStep = searchParams.get('step');
    if (urlStep === '3' && step < 3) {
      useBookingStore.setState({ step: 3 });
    }
  }, [searchParams, step, hasHydrated]);

  if (!hasHydrated) return null; // O un componente di loading

  const caveFiltrate = filtro === 'tutte'
    ? caves
    : caves.filter((c) => c.tipologia === filtro);

  // Conta per tipologia
  const counts = caves.reduce<Record<string, number>>((acc, c) => {
    if (c.tipologia) acc[c.tipologia] = (acc[c.tipologia] || 0) + 1;
    return acc;
  }, {});

  const renderStep = () => {
    // Step 2: Scegli Grotta
    if (step <= 2) {
      return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-4">Scegli la tua grotta</h2>
            <p className="text-stone-400">Seleziona una delle meravigliose grotte disponibili in questa regione.</p>
          </div>

          {/* Filtri per tipologia */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {FILTRI.map((f) => {
              const count = f.value === 'tutte' ? caves.length : (counts[f.value] || 0);
              if (count === 0 && f.value !== 'tutte') return null;
              const isActive = filtro === f.value;
              return (
                <button
                  key={f.value}
                  onClick={() => setFiltro(f.value)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold transition-all duration-200 ${isActive ? ACTIVE_FILTRI[f.value] : f.className}`}
                >
                  <span>{f.emoji}</span>
                  {f.label}
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20' : 'bg-black/20'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {caveFiltrate.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="text-5xl mb-4">🔍</p>
              <p className="text-lg">Nessuna grotta di tipo <strong className="text-stone-400">{filtro}</strong> disponibile in questa zona.</p>
              <button onClick={() => setFiltro('tutte')} className="mt-4 text-emerald-400 hover:underline text-sm">
                Mostra tutte le grotte
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {caveFiltrate.map((c) => (
                <CaveCard key={c.id} grotta={c} onSelect={(g) => {
                  setGrotta(g);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }} />
              ))}
            </div>
          )}
        </div>
      );
    }

    // Step 3: Dati Gruppo e Date
    if (step === 3) {
      return (
        <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Dettagli Prenotazione</h2>
            <p className="text-stone-400">Stai prenotando la visita per <span className="text-emerald-400 font-bold">{grotta?.nome}</span></p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left side: Calendar */}
            <div className="lg:col-span-4 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-white">📅 Seleziona Date</h3>
                <BookingDatePicker />
              </div>
              {dateRange?.from && dateRange?.to && (
                <div className="bg-emerald-950/30 border border-emerald-900/50 p-6 rounded-3xl text-emerald-200 text-sm shadow-inner">
                  <p className="mb-2"><span className="uppercase tracking-widest text-emerald-500/70 text-xs font-bold mr-2">Check-in</span> <span className="font-medium text-base">{format(dateRange.from, 'dd MMM yyyy', { locale: it })}</span></p>
                  <p><span className="uppercase tracking-widest text-emerald-500/70 text-xs font-bold mr-2">Check-out</span> <span className="font-medium text-base">{format(dateRange.to, 'dd MMM yyyy', { locale: it })}</span></p>
                </div>
              )}
            </div>

            {/* Right side: Form */}
            <div className="lg:col-span-8 bg-stone-900/60 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl">
              <GroupForm onSubmit={(data) => {
                const state = useBookingStore.getState();
                if (!state.dateRange?.from || !state.dateRange?.to) {
                  alert('Per favore, seleziona le date dal calendario.');
                  return;
                }
                if (!state.fascia_oraria) {
                  alert('Per favore, seleziona una fascia oraria (indicativa).');
                  return;
                }
                state.setGruppo(data);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} />
            </div>
          </div>
        </div>
      );
    }

    // Step 4: Riepilogo e Conferma
    if (step >= 4) {
      return <BookingSummary />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-12">
        <StepIndicator currentStep={Math.max(2, step)} />
      </div>
      {renderStep()}
    </div>
  );
}
