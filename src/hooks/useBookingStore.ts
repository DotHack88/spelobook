import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BookingState, Zona, Grotta, FasciaOraria } from '@/types';

interface BookingStore extends BookingState {
  step: number;
  setZona:         (zona: Zona) => void;
  setGrotta:       (grotta: Grotta) => void;
  setDateRange:    (from: Date | undefined, to: Date | undefined) => void;
  setFasciaOraria: (fascia: FasciaOraria) => void;
  setGruppo:       (gruppo: BookingState['gruppo']) => void;
  nextStep:        () => void;
  prevStep:        () => void;
  reset:           () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      step: 1,
      setZona:         (zona)    => set({ zona, step: 2 }),
      setGrotta:       (grotta)  => set({ grotta, step: 3 }),
      setDateRange:    (from, to) => set({ dateRange: from ? { from: from!, to: to! } : undefined }),
      setFasciaOraria: (fascia_oraria) => set({ fascia_oraria }),
      setGruppo:       (gruppo)  => set({ gruppo, step: 4 }),
      nextStep:        ()        => set((s) => ({ step: s.step + 1 })),
      prevStep:        ()        => set((s) => ({ step: Math.max(1, s.step - 1) })),
      reset:           ()        => set({ step: 1, zona: undefined, grotta: undefined,
                                         dateRange: undefined, fascia_oraria: undefined, gruppo: undefined }),
    }),
    {
      name: 'booking-storage',
    }
  )
);
