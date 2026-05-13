'use client';

import { useState } from 'react';
import { 
  Search, 
  Plus, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Mountain,
  Activity,
  Ruler,
  Users,
  MapPin
} from 'lucide-react';

const MOCK_GROTTE = [
  { id: '1', nome: 'Abisso del Bifurto', zona: 'Calabria', tipologia: 'carsica', difficolta: 'esperta', profondita: 683, lunghezza: 1200, attiva: true },
  { id: '2', nome: 'Grotta delle Ninfe', zona: 'Calabria', tipologia: 'carsica', difficolta: 'facile', profondita: 45, lunghezza: 300, attiva: true },
  { id: '3', nome: 'Grotte di Castellana', zona: 'Puglia', tipologia: 'carsica', difficolta: 'facile', profondita: 122, lunghezza: 3348, attiva: true },
  { id: '4', nome: 'Grotta della Zinzulusa', zona: 'Puglia', tipologia: 'marina', difficolta: 'facile', profondita: 30, lunghezza: 170, attiva: true },
  { id: '5', nome: 'Grotta di Nettuno', zona: 'Sardegna', tipologia: 'marina', difficolta: 'facile', profondita: 10, lunghezza: 2500, attiva: false },
  { id: '6', nome: 'Grotta del Gelo', zona: 'Sicilia', tipologia: 'lavica', difficolta: 'difficile', profondita: 40, lunghezza: 200, attiva: true },
];

export default function AdminGrotte() {
  const [grotte, setGrotte] = useState(MOCK_GROTTE);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleAttiva = (id: string) => {
    setGrotte(prev => prev.map(g => g.id === id ? { ...g, attiva: !g.attiva } : g));
  };

  const filtered = grotte.filter(g => 
    g.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
    g.zona.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestione Grotte</h1>
          <p className="text-stone-400">Configura il catalogo delle grotte e la loro disponibilità.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95">
          <Plus size={20} />
          <span>Nuova Grotta</span>
        </button>
      </div>

      <div className="flex items-center gap-4 bg-stone-900/40 border border-stone-800 p-4 rounded-3xl">
        <Search className="text-stone-500" size={20} />
        <input 
          type="text" 
          placeholder="Cerca per nome o regione..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none focus:outline-none text-stone-200 w-full"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filtered.map((g) => (
          <div key={g.id} className={`bg-stone-900/40 border rounded-3xl p-6 transition-all group ${g.attiva ? 'border-stone-800' : 'border-red-900/20 opacity-70'}`}>
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${g.attiva ? 'bg-emerald-500/10 text-emerald-400' : 'bg-stone-800 text-stone-500'}`}>
                  <Mountain size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{g.nome}</h3>
                  <div className="flex items-center gap-2 text-stone-500 text-xs">
                    <MapPin size={12} /> {g.zona} 
                    <span className="w-1 h-1 rounded-full bg-stone-700"></span>
                    <span className="capitalize">{g.tipologia}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toggleAttiva(g.id)}
                  className={`p-2 rounded-xl border transition-all ${g.attiva ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white' : 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white'}`}
                  title={g.attiva ? "Disattiva" : "Attiva"}
                >
                  {g.attiva ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button className="p-2 bg-stone-800 border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-700 transition-all">
                  <Edit2 size={18} />
                </button>
                <button className="p-2 bg-stone-800 border border-stone-700 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-stone-950/50 border border-stone-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <Activity size={16} className="text-emerald-400 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Profondità</span>
                <span className="text-sm font-bold text-white">{g.profondita}m</span>
              </div>
              <div className="bg-stone-950/50 border border-stone-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <Ruler size={16} className="text-cyan-400 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Lunghezza</span>
                <span className="text-sm font-bold text-white">{g.lunghezza}m</span>
              </div>
              <div className="bg-stone-950/50 border border-stone-800 rounded-2xl p-3 flex flex-col items-center justify-center text-center">
                <Users size={16} className="text-purple-400 mb-1" />
                <span className="text-[10px] text-stone-500 uppercase tracking-widest">Difficoltà</span>
                <span className="text-[10px] font-bold text-white uppercase">{g.difficolta}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
