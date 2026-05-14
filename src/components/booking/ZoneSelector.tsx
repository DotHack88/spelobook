'use client';

import { Zona } from '@/types';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { MapPin, Search, List as ListIcon, Grid as GridIcon } from 'lucide-react';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export function ZoneSelector({ zones }: { zones: Zona[] }) {
  const setZona = useBookingStore((state) => state.setZona);
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filteredZones = zones.filter(z => 
    z.nome.toLowerCase().includes(search.toLowerCase()) || 
    z.regione.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (zona: Zona) => {
    setZona(zona);
    router.push(`/prenota/${zona.slug}`);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Search & Toggle Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-12 items-center justify-between bg-stone-900/40 p-6 rounded-3xl border border-stone-800 backdrop-blur-xl">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-5 h-5" />
          <Input 
            placeholder="Cerca per regione o zona..." 
            className="pl-12 bg-stone-950/50 border-stone-800 h-12 rounded-2xl focus:ring-emerald-500/50 focus:border-emerald-500 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 bg-stone-950/50 p-1 rounded-2xl border border-stone-800">
          <Button 
            variant={view === 'grid' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setView('grid')}
            className={`rounded-xl px-4 ${view === 'grid' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'text-stone-400'}`}
          >
            <GridIcon className="w-4 h-4 mr-2" /> Griglia
          </Button>
          <Button 
            variant={view === 'list' ? 'secondary' : 'ghost'} 
            size="sm"
            onClick={() => setView('list')}
            className={`rounded-xl px-4 ${view === 'list' ? 'bg-emerald-600 hover:bg-emerald-500 text-white' : 'text-stone-400'}`}
          >
            <ListIcon className="w-4 h-4 mr-2" /> Elenco
          </Button>
        </div>
      </div>

      {view === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredZones.map((zona) => (
            <Card 
              key={zona.id}
              className="group relative overflow-hidden cursor-pointer rounded-3xl border border-stone-800 shadow-2xl transition-all duration-500 hover:shadow-emerald-900/20 hover:border-emerald-500/50 hover:-translate-y-2 bg-stone-900/40 backdrop-blur-md"
              onClick={() => handleSelect(zona)}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent z-10 transition-opacity duration-500 group-hover:opacity-90" />
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                style={{ backgroundImage: `url(${zona.immagine_url || 'https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'})` }}
              />
              <CardContent className="relative z-20 flex flex-col justify-end h-[400px] p-8">
                <div className="transform transition-transform duration-500 group-hover:-translate-y-4">
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="text-emerald-400 w-5 h-5" />
                    <span className="text-emerald-400 text-sm font-bold tracking-[0.2em] uppercase">{zona.regione}</span>
                  </div>
                  <h3 className="text-4xl font-extrabold text-white mb-3 tracking-tight">{zona.nome}</h3>
                  <p className="text-stone-300 text-sm leading-relaxed line-clamp-2 opacity-0 transform translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
                    {zona.descrizione}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-stone-900/40 rounded-3xl border border-stone-800 overflow-hidden divide-y divide-stone-800/50">
          {filteredZones.map((zona) => (
            <div 
              key={zona.id} 
              className="p-6 hover:bg-emerald-950/10 cursor-pointer transition-colors flex items-center justify-between group"
              onClick={() => handleSelect(zona)}
            >
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl overflow-hidden border border-stone-700 shrink-0">
                  <img src={zona.immagine_url} alt={zona.nome} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white group-hover:text-emerald-400 transition-colors">{zona.nome}</h4>
                  <p className="text-stone-500 text-sm uppercase tracking-wider">{zona.regione}</p>
                </div>
              </div>
              <Button variant="ghost" className="text-emerald-400 hover:text-emerald-300">Seleziona →</Button>
            </div>
          ))}
        </div>
      )}

      {filteredZones.length === 0 && (
        <div className="text-center py-24">
          <p className="text-stone-500 text-xl font-medium">Nessun risultato trovato per &quot;{search}&quot;</p>
          <Button variant="link" className="text-emerald-500 mt-2" onClick={() => setSearch('')}>Mostra tutto</Button>
        </div>
      )}
    </div>
  );
}
