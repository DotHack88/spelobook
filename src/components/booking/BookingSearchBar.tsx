'use client';

import { useState, useRef, useEffect } from 'react';
import { useBookingStore } from '@/hooks/useBookingStore';
import { Zona, Grotta, FasciaOraria } from '@/types';
import { Calendar as CalendarIcon, Mountain, Users, Search, ChevronDown, X, MapPin, Clock, Sun, Sunset, Check, CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useRouter } from 'next/navigation';

interface GroupedCaves {
  [region: string]: {
    zona: Zona;
    grotte: Grotta[];
  };
}

export function BookingSearchBar({ zones, allCaves }: { zones: Zona[], allCaves: Record<string, Grotta[]> }) {
  const router = useRouter();
  const { dateRange, setDateRange, setZona, grotta, setGrotta, gruppo, setGruppo, fascia_oraria, setFasciaOraria } = useBookingStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showFascia, setShowFascia] = useState(false);
  
  const [selectedCave, setSelectedCaveState] = useState<Grotta | null>(null);
  const [selectedRegionName, setSelectedRegionName] = useState<string | null>(null);
  const [groupName, setGroupName] = useState(gruppo?.nome_gruppo || '');
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const fasciaRef = useRef<HTMLDivElement>(null);

  // Raggruppa e filtra le grotte per regione e per ricerca testuale
  const groupedCaves: GroupedCaves = {};
  zones.forEach(z => {
    const regionKey = z.slug;
    if (allCaves[regionKey]) {
      const filteredGrotte = allCaves[regionKey].filter(g => 
        g.nome.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredGrotte.length > 0) {
        groupedCaves[z.regione] = {
          zona: z,
          grotte: filteredGrotte
        };
      }
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setShowDropdown(false);
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) setShowCalendar(false);
      if (fasciaRef.current && !fasciaRef.current.contains(event.target as Node)) setShowFascia(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset local states when store is reset
  useEffect(() => {
    if (!gruppo) setGroupName('');
    if (!grotta) {
      setSelectedCaveState(null);
      setSelectedRegionName(null);
    }
  }, [gruppo, grotta]);

  const handleSearch = () => {
    if (!selectedCave || !selectedRegionName) {
      alert('Per favore, seleziona una grotta dall\'elenco.');
      return;
    }
    
    const regionData = groupedCaves[selectedRegionName] || zones.find(z => z.regione === selectedRegionName);
    if (!regionData) return;

    setZona(regionData.zona);
    setGrotta(selectedCave);
    
    // Impostiamo il nome del gruppo e i dati parziali senza avanzare allo step 4
    useBookingStore.setState((state) => ({
      gruppo: {
        ...state.gruppo,
        nome_gruppo: groupName,
        num_persone: state.gruppo?.num_persone || 1,
      } as any,
      step: 3 // Forza lo step 3
    }));
    
    // Naviga alla pagina di prenotazione
    router.push(`/prenota/${regionData.zona.slug}?step=3`);
  };

  const slots: { id: FasciaOraria; label: string; icon: any; time: string }[] = [
    { id: 'mattina', label: 'Mattina', icon: <Sun size={18} />, time: '08:00 - 13:00' },
    { id: 'pomeriggio', label: 'Pomeriggio', icon: <Sunset size={18} />, time: '14:00 - 19:00' },
    { id: 'intera_giornata', label: 'Intera Giornata', icon: <CalendarDays size={18} />, time: '08:00 - 19:00' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-stone-900/60 backdrop-blur-2xl rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] p-2 flex flex-col lg:flex-row items-stretch gap-2 border border-emerald-500/20">
        
        {/* Destinazione */}
        <div className="flex-[1.2] relative" ref={dropdownRef}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full h-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all rounded-xl text-left group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <Mountain className="text-emerald-400" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-0.5">Dove vuoi andare?</p>
              <p className="text-white font-bold text-lg truncate">
                {selectedCave ? selectedCave.nome : 'Scegli una grotta...'}
              </p>
              {selectedRegionName && (
                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-tighter">{selectedRegionName}</p>
              )}
            </div>
            <ChevronDown className={`text-stone-600 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-stone-900 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-stone-800 p-2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl">
              <div className="px-4 py-3 border-b border-stone-800/50 mb-2 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">Catalogo Grotte</p>
                  <X size={16} className="text-stone-600 cursor-pointer hover:text-white transition-colors" onClick={() => setShowDropdown(false)} />
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-500" size={14} />
                  <input 
                    type="text" 
                    placeholder="Cerca grotta per nome..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white focus:border-emerald-500 outline-none transition-all"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </div>
              <div className="max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
                {Object.entries(groupedCaves).length > 0 ? (
                  Object.entries(groupedCaves).map(([region, data]) => (
                    <div key={region} className="mb-4 last:mb-0">
                      <div className="px-4 py-2 flex items-center gap-2">
                         <MapPin size={12} className="text-emerald-500/50" />
                         <p className="text-[11px] font-black text-stone-300 uppercase tracking-widest">{region}</p>
                      </div>
                      <div className="space-y-1 mt-1">
                        {data.grotte.map((g) => (
                          <button
                            key={g.id}
                            onClick={() => { 
                              setSelectedCaveState(g); 
                              setSelectedRegionName(region);
                              setShowDropdown(false); 
                            }}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left group/item ${
                              selectedCave?.id === g.id ? 'bg-emerald-600 text-white shadow-[0_10px_20px_rgba(16,185,129,0.2)]' : 'hover:bg-white/5 text-stone-400 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-lg opacity-80 group-hover/item:scale-110 transition-transform">🪨</span>
                              <p className="font-bold text-sm leading-tight">{g.nome}</p>
                            </div>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              selectedCave?.id === g.id ? 'bg-white/20 border-transparent' : 'bg-stone-800 border-stone-700 text-stone-500'
                            }`}>
                              {g.orientamento.toUpperCase()}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-stone-500 text-sm">
                    Nessuna grotta trovata per &quot;{searchQuery}&quot;
                  </div>
                )}
              </div>
            </div>
          )}
          <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-px bg-stone-800" />
        </div>

        {/* Date Picker */}
        <div className="flex-[1.2] relative" ref={calendarRef}>
          <button 
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full h-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all rounded-xl text-left group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <CalendarIcon className="text-emerald-400" size={24} />
            </div>
            <div className="flex-1">
              <div className="flex gap-6">
                <div>
                  <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-0.5">Periodo</p>
                  <p className="text-white font-bold text-sm">
                    {dateRange?.from ? format(dateRange.from, 'dd MMM', { locale: it }) : 'Inizio'}
                    {dateRange?.to && ` - ${format(dateRange.to, 'dd MMM', { locale: it })}`}
                  </p>
                </div>
              </div>
            </div>
            <ChevronDown className={`text-stone-600 transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showCalendar && (
            <div className="dark absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-stone-950 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.9)] border border-stone-800 p-4 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-2xl">
              <Calendar
                mode="range"
                selected={{ from: dateRange?.from, to: dateRange?.to }}
                onSelect={(range) => setDateRange(range?.from, range?.to)}
                locale={it}
                numberOfMonths={2}
                disabled={{ before: new Date() }}
                className="rounded-md border-none text-white"
                classNames={{
                  selected: "bg-emerald-600 text-white hover:bg-emerald-500 hover:text-white focus:bg-emerald-500 focus:text-white",
                  today: "bg-stone-800 text-emerald-400",
                  outside: "text-stone-600 opacity-50",
                  range_middle: "bg-emerald-900/30 text-emerald-200",
                }}
              />
              <div className="mt-4 flex justify-end border-t border-stone-800 pt-4">
                <Button variant="ghost" size="sm" onClick={() => setShowCalendar(false)} className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 font-bold uppercase tracking-widest text-[10px]">Conferma Date</Button>
              </div>
            </div>
          )}
          <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-px bg-stone-800" />
        </div>

        {/* Fascia Oraria */}
        <div className="flex-[0.8] relative" ref={fasciaRef}>
          <button 
            onClick={() => setShowFascia(!showFascia)}
            className="w-full h-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all rounded-xl text-left group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
              <Clock className="text-emerald-400" size={24} />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-0.5">Orario</p>
              <p className="text-white font-bold text-sm capitalize">
                {fascia_oraria?.replace('_', ' ') || 'Scegli...'}
              </p>
            </div>
            <ChevronDown className={`text-stone-600 transition-transform duration-300 ${showFascia ? 'rotate-180' : ''}`} size={20} />
          </button>

          {showFascia && (
            <div className="absolute top-full left-0 right-0 mt-3 bg-stone-900 rounded-2xl shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-stone-800 p-2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300 backdrop-blur-xl">
              <div className="space-y-1">
                {slots.map((slot) => (
                  <button
                    key={slot.id}
                    onClick={() => { setFasciaOraria(slot.id); setShowFascia(false); }}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all text-left ${
                      fascia_oraria === slot.id ? 'bg-emerald-600 text-white' : 'hover:bg-white/5 text-stone-400'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {slot.icon}
                      <div>
                        <p className="font-bold text-xs">{slot.label}</p>
                        <p className="text-[10px] opacity-60">{slot.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="hidden lg:block absolute right-0 top-1/4 bottom-1/4 w-px bg-stone-800" />
        </div>

        {/* Nome Gruppo */}
        <div className="flex-[1.2] relative group">
          <div className="w-full h-full flex items-center gap-4 px-5 py-4 hover:bg-white/5 transition-all rounded-xl">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 group-focus-within:bg-emerald-500/20 transition-colors">
              <Users className="text-emerald-400" size={24} />
            </div>
            <div className="flex-1">
              <label htmlFor="groupName" className="text-[10px] font-black text-emerald-500/60 uppercase tracking-widest mb-0.5 cursor-pointer block">Nome del gruppo</label>
              <input
                id="groupName"
                type="text"
                placeholder="Inserisci nome..."
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full bg-transparent border-none p-0 text-white font-bold text-lg placeholder:text-stone-700 focus:ring-0"
              />
            </div>
          </div>
        </div>

        {/* Pulsante Prenota */}
        <div className="p-1">
          <button 
            onClick={handleSearch}
            className="w-full lg:w-auto h-full px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-xl transition-all shadow-[0_10px_30px_rgba(16,185,129,0.3)] active:scale-95 flex items-center justify-center gap-3 text-xl uppercase tracking-widest"
          >
            <CalendarDays size={24} strokeWidth={3} />
            Prenota
          </button>
        </div>
      </div>
    </div>
  );
}
