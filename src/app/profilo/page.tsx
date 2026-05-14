'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/hooks/useUserStore';
import Link from 'next/link';
import { Calendar, LogOut, MapPin, Edit2, Trash2, X, Check } from 'lucide-react';

export default function ProfiloUtente() {
  const router = useRouter();
  const { user, logout, updateUser } = useUserStore();
  const [prenotazioni, setPrenotazioni] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [editModal, setEditModal] = useState<any>(null);
  const [profileModal, setProfileModal] = useState(false);
  const [editName, setEditName] = useState('');
  const [editPassword, setEditPassword] = useState('');

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    if (!user) {
      router.push('/login');
      return;
    }

    fetchBookings();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, mounted]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/prenotazioni?email=${encodeURIComponent(user!.email)}`);
      const data = await res.json();
      setPrenotazioni(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Sei sicuro di voler cancellare questa prenotazione?')) return;
    try {
      await fetch(`/api/prenotazioni/${id}`, { method: 'DELETE' });
      setPrenotazioni(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Errore durante la cancellazione');
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/prenotazioni/${editModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data_checkin: editModal.data_checkin,
          data_checkout: editModal.data_checkout,
          grotta_id: editModal.grotta_id,
          fascia_oraria: editModal.fascia_oraria
        })
      });
      if (res.ok) {
        setEditModal(null);
        fetchBookings();
      } else {
        alert("Errore durante l'aggiornamento");
      }
    } catch (err) {
      console.error(err);
      alert("Errore durante l'aggiornamento");
    }
  };

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (editName.length > 2) {
      updateUser(editName);
    }
    alert("Profilo aggiornato con successo!");
    setProfileModal(false);
  };

  if (!mounted || !user) return null;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black pb-20">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/70 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Speleo</span>
            <span className="text-emerald-400">Book</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/prenota" className="text-sm font-semibold text-white bg-emerald-600 px-4 py-2 rounded-full hover:bg-emerald-500 transition-colors">
              Nuova Prenotazione
            </Link>
            <button 
              onClick={() => { logout(); router.push('/login'); }} 
              className="text-stone-400 hover:text-red-400 text-sm flex items-center gap-2 transition-colors"
            >
              <LogOut size={16} /> Esci
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Ciao, {user.name}</h1>
            <p className="text-stone-400 text-lg">Questa è la tua area personale. Qui puoi gestire le tue esplorazioni.</p>
          </div>
          <button 
            onClick={() => { setEditName(user.name); setEditPassword(''); setProfileModal(true); }}
            className="flex items-center gap-2 bg-stone-800 hover:bg-stone-700 text-white px-5 py-2.5 rounded-xl font-semibold transition-colors shrink-0"
          >
            <Edit2 size={16} /> Modifica Profilo
          </button>
        </div>

        <div className="bg-stone-900/60 border border-stone-800 rounded-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Calendar className="text-emerald-400" /> Le mie Prenotazioni
          </h2>

          {loading ? (
            <p className="text-stone-400 animate-pulse">Caricamento in corso...</p>
          ) : prenotazioni.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-stone-800 rounded-2xl">
              <MapPin size={48} className="mx-auto text-stone-600 mb-4" />
              <p className="text-stone-400 mb-4">Non hai ancora nessuna prenotazione attiva.</p>
              <Link href="/prenota" className="text-emerald-400 font-semibold hover:underline">
                Esplora le grotte disponibili →
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {prenotazioni.map((p) => (
                <div key={p.id} className="bg-stone-950/50 border border-stone-800 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-stone-700 transition-colors">
                  <div>
                    <span className="text-[10px] font-mono text-emerald-500 mb-1 block">Codice: {p.codice_prenotazione}</span>
                    <h3 className="text-xl font-bold text-white">{p.grotta_id.replace(/-/g, ' ').toUpperCase()}</h3>
                    <div className="flex items-center gap-4 text-sm text-stone-400 mt-2">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {p.data_checkin} {p.data_checkout && p.data_checkout !== p.data_checkin ? ` → ${p.data_checkout}` : ''}</span>
                      <span>Orario: {p.fascia_oraria?.replace('_', ' ') || 'Non specificato'}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${p.stato === 'confermata' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : p.stato === 'rifiutata' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'}`}>
                        {p.stato.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-stone-500 mt-3">
                      <span>Gruppo: <strong>{p.nome_gruppo}</strong> ({p.num_persone} pax)</span>
                      <span>Referente: {p.referente_nome} {p.referente_cognome}</span>
                      <span>Tel: {p.referente_telefono}</span>
                    </div>
                    {p.note && (
                      <div className="mt-3 text-xs text-stone-400 bg-stone-900/50 p-3 rounded-xl border border-stone-800">
                        <strong>Note:</strong> {p.note}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setEditModal(p)}
                      className="p-3 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white rounded-xl transition-colors"
                      title="Modifica Date o Grotta"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)}
                      className="p-3 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-xl transition-colors"
                      title="Cancella Prenotazione"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Modifica Prenotazione</h3>
              <button onClick={() => setEditModal(null)} className="text-stone-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Data Check-in</label>
                <input 
                  type="date" 
                  value={editModal.data_checkin}
                  onChange={e => setEditModal({...editModal, data_checkin: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Data Check-out</label>
                <input 
                  type="date" 
                  value={editModal.data_checkout}
                  onChange={e => setEditModal({...editModal, data_checkout: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">ID Grotta (Slug)</label>
                <input 
                  type="text" 
                  value={editModal.grotta_id}
                  onChange={e => setEditModal({...editModal, grotta_id: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Fascia Oraria</label>
                <select 
                  value={editModal.fascia_oraria || 'intera_giornata'}
                  onChange={e => setEditModal({...editModal, fascia_oraria: e.target.value})}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="mattina">Mattina (08:00 - 13:00)</option>
                  <option value="pomeriggio">Pomeriggio (14:00 - 19:00)</option>
                  <option value="intera_giornata">Intera Giornata (08:00 - 19:00)</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-3 bg-transparent border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-800 transition-colors">Annulla</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                  <Check size={18} /> Salva Modifiche
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {profileModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Modifica Profilo</h3>
              <button onClick={() => setProfileModal(false)} className="text-stone-500 hover:text-white"><X size={20} /></button>
            </div>
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Nome Completo</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Email (Non modificabile)</label>
                <input 
                  type="email" 
                  value={user.email}
                  disabled
                  className="w-full bg-stone-950/50 border border-stone-800 rounded-xl px-4 py-3 text-stone-500 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="text-xs text-stone-400 font-bold uppercase mb-1 block">Nuova Password</label>
                <input 
                  type="password" 
                  value={editPassword}
                  onChange={e => setEditPassword(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Lascia vuoto per non modificare"
                  minLength={6}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setProfileModal(false)} className="flex-1 py-3 bg-transparent border border-stone-700 text-stone-300 rounded-xl hover:bg-stone-800 transition-colors">Annulla</button>
                <button type="submit" className="flex-1 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2">
                  <Check size={18} /> Salva Dati
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
