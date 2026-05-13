'use client';

import { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Check, 
  X, 
  ExternalLink,
  ChevronDown,
  Mail,
  Phone,
  Clock,
  Calendar
} from 'lucide-react';

// Mock data per le prenotazioni
const MOCK_PRENOTAZIONI = [
  { 
    id: '1', 
    codice: 'SPELO-7F8D2A', 
    gruppo: 'Speleo Club Roma', 
    grotta: 'Abisso del Bifurto', 
    regione: 'Calabria',
    checkin: '2025-08-15', 
    checkout: '2025-08-17',
    persone: 4, 
    referente: 'Marco Bianchi',
    email: 'marco.b@gmail.com',
    telefono: '+39 333 1234567',
    stato: 'in_attesa',
    data_creazione: '2025-05-12'
  },
  { 
    id: '2', 
    codice: 'SPELO-B3E4C1', 
    gruppo: 'Famiglia Esposito', 
    grotta: 'Grotte di Castellana', 
    regione: 'Puglia',
    checkin: '2025-08-20', 
    checkout: '2025-08-20',
    persone: 2, 
    referente: 'Luigi Esposito',
    email: 'luigi.e@outlook.it',
    telefono: '+39 347 9876543',
    stato: 'confermata',
    data_creazione: '2025-05-13'
  },
  { 
    id: '3', 
    codice: 'SPELO-A1D2F3', 
    gruppo: 'Associazione Grotte Alpi', 
    grotta: 'Grotta Gigante', 
    regione: 'Friuli-VG',
    checkin: '2025-08-25', 
    checkout: '2025-08-26',
    persone: 12, 
    referente: 'Elena Verdi',
    email: 'elena.v@libero.it',
    telefono: '+39 328 1122334',
    stato: 'rifiutata',
    data_creazione: '2025-05-10'
  },
  { 
    id: '4', 
    codice: 'SPELO-K9M2L5', 
    gruppo: 'Amici della Montagna', 
    grotta: 'Grotta dei Lamponi', 
    regione: 'Sicilia',
    checkin: '2025-09-02', 
    checkout: '2025-09-02',
    persone: 5, 
    referente: 'Alessio Neri',
    email: 'alessio.n@gmail.com',
    telefono: '+39 335 4455667',
    stato: 'in_attesa',
    data_creazione: '2025-05-14'
  }
];

export default function AdminPrenotazioni() {
  const [prenotazioni, setPrenotazioni] = useState(MOCK_PRENOTAZIONI);
  const [filter, setFilter] = useState('tutte');

  const updateStato = (id: string, nuovoStato: string) => {
    setPrenotazioni(prev => prev.map(p => p.id === id ? { ...p, stato: nuovoStato } : p));
  };

  const filtered = filter === 'tutte' 
    ? prenotazioni 
    : prenotazioni.filter(p => p.stato === filter);

  const getStatusBadge = (stato: string) => {
    switch (stato) {
      case 'confermata':
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">CONFERMATA</span>;
      case 'rifiutata':
        return <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">RIFIUTATA</span>;
      case 'cancellata':
        return <span className="bg-stone-500/10 text-stone-400 border border-stone-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">CANCELLATA</span>;
      default:
        return <span className="bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 px-2.5 py-1 rounded-full text-[10px] font-bold">IN ATTESA</span>;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestione Prenotazioni</h1>
          <p className="text-stone-400">Visualizza, conferma o rifiuta le richieste degli utenti.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-stone-900/60 border border-stone-800 rounded-xl px-4 py-2 flex items-center gap-2">
            <Filter size={16} className="text-stone-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-transparent border-none text-sm text-stone-300 focus:outline-none cursor-pointer"
            >
              <option value="tutte" className="bg-stone-900">Tutte le richieste</option>
              <option value="in_attesa" className="bg-stone-900">Solo in attesa</option>
              <option value="confermata" className="bg-stone-900">Confermate</option>
              <option value="rifiutata" className="bg-stone-900">Rifiutate</option>
            </select>
            <ChevronDown size={14} className="text-stone-500" />
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-stone-900/40 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-950/50 border-b border-stone-800">
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Codice & Gruppo</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Grotta & Zona</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Date</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Referente</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-center">Persone</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Stato</th>
                <th className="px-6 py-5 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-right">Azioni</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-800/20 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-mono text-emerald-500 mb-1">{p.codice}</span>
                      <span className="font-bold text-white text-sm">{p.gruppo}</span>
                      <span className="text-[10px] text-stone-500 mt-1 flex items-center gap-1">
                        <Clock size={10} /> Creato il {p.data_creazione}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-white">{p.grotta}</span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider">{p.regione}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs">
                      <span className="text-stone-300 flex items-center gap-1.5"><Calendar size={12} className="text-stone-500" /> {p.checkin}</span>
                      <span className="text-stone-500 text-[10px] mt-0.5 ml-4.5">al {p.checkout}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-xs space-y-1">
                      <span className="text-stone-200 font-medium">{p.referente}</span>
                      <span className="text-stone-500 flex items-center gap-1.5"><Mail size={12} /> {p.email}</span>
                      <span className="text-stone-500 flex items-center gap-1.5"><Phone size={12} /> {p.telefono}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-white bg-stone-950/50 border border-stone-800 rounded-lg px-2 py-1">{p.persone}</span>
                  </td>
                  <td className="px-6 py-4">
                    {getStatusBadge(p.stato)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.stato === 'in_attesa' && (
                        <>
                          <button 
                            onClick={() => updateStato(p.id, 'confermata')}
                            className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/20"
                            title="Conferma"
                          >
                            <Check size={16} />
                          </button>
                          <button 
                            onClick={() => updateStato(p.id, 'rifiutata')}
                            className="p-2 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                            title="Rifiuta"
                          >
                            <X size={16} />
                          </button>
                        </>
                      )}
                      <button className="p-2 text-stone-500 hover:text-white hover:bg-stone-800 rounded-xl transition-all">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="p-20 text-center text-stone-500">
              <p className="text-4xl mb-4">🔍</p>
              <p>Nessuna prenotazione trovata per questa categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
