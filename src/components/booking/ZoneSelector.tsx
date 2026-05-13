'use client';

import { Zona } from '@/types';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin } from 'lucide-react';

export function ZoneSelector({ zones }: { zones: Zona[] }) {
  const setZona = useBookingStore((state) => state.setZona);
  const router = useRouter();

  const handleSelect = (zona: Zona) => {
    setZona(zona);
    router.push(`/prenota/${zona.slug}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mx-auto px-4">
      {zones.map((zona) => (
        <Card 
          key={zona.id}
          className="group relative overflow-hidden cursor-pointer rounded-3xl border border-stone-800 shadow-2xl transition-all duration-500 hover:shadow-emerald-900/20 hover:border-emerald-500/50 hover:-translate-y-2 bg-stone-900/40 backdrop-blur-md"
          onClick={() => handleSelect(zona)}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
          
          {/* Sfondo */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
            style={{ backgroundImage: `url(${zona.immagine_url || 'https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'})` }}
          />

          <CardContent className="relative z-20 flex flex-col justify-end h-[400px] p-8">
            <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="text-emerald-400 w-5 h-5 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-emerald-400 text-sm font-bold tracking-[0.2em] uppercase">
                  {zona.regione}
                </span>
              </div>
              <h3 className="text-4xl font-extrabold text-white mb-3 tracking-tight">
                {zona.nome}
              </h3>
              <p className="text-stone-300 text-sm md:text-base leading-relaxed line-clamp-3 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0 mb-8 md:pr-32">
                {zona.descrizione}
              </p>
            </div>
            
            {/* Indicatore "esplora" */}
            <div className="absolute bottom-8 right-8 opacity-0 transform translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
              <div className="bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 text-emerald-300 px-6 py-2.5 rounded-full text-sm font-bold shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:bg-emerald-500 hover:text-stone-950 transition-colors">
                Seleziona →
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
