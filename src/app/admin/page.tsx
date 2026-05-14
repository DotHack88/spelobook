"use client";

import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Mountain
} from 'lucide-react';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const stats = [
    { label: 'Totale Prenotazioni', value: '128', icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'In Attesa', value: '12', icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { label: 'Confermate', value: '104', icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Visitatori Totali', value: '432', icon: Users, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const [recentBookings, setRecentBookings] = useState<any[]>([
    { id: 'mock1', gruppo: 'Esploratori del Pollino', grotta: 'Abisso del Bifurto', data: '15 Ago 2025', stato: 'Confermata', persone: 4 },
    { id: 'mock2', gruppo: 'Team Speleo Roma', grotta: 'Grotte di Castellana', data: '22 Ago 2025', stato: 'In Attesa', persone: 6 },
  ]);

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function fetchRecentBookings() {
      try {
        const res = await fetch('/api/prenotazioni');
        const data = await res.json();
        if (data && data.length > 0) {
          const mappedData = data.slice(0, 5).map((p: any) => ({
            id: p.id,
            gruppo: p.nome_gruppo || 'Gruppo Senza Nome',
            grotta: p.grotta_id,
            data: p.data_checkin,
            stato: p.stato === 'in_attesa' ? 'In Attesa' : p.stato === 'confermata' ? 'Confermata' : 'Rifiutata',
            persone: p.num_persone
          }));
          // Append mock data to show something if few actual bookings
          setRecentBookings([...mappedData, ...recentBookings].slice(0, 5));
        }
      } catch (err) {
        console.error('Errore fetch prenotazioni recenti:', err);
      }
    }
    
    async function fetchUsers() {
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        console.error('Errore fetch utenti:', err);
      }
    }

    fetchRecentBookings();
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateUserStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        setUsers(users.map(u => u.id === id ? { ...u, status } : u));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleExport = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Codice,Gruppo,Grotta,Data,Persone,Stato\n"
      + recentBookings.map(b => `${b.id},${b.gruppo},${b.grotta},${b.data},${b.persone},${b.stato}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `report_spelobook_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Benvenuto, Admin</h1>
        <p className="text-stone-400">Ecco cosa sta succedendo nel tuo sistema di prenotazione.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-stone-900/40 border border-stone-800 p-6 rounded-3xl hover:border-stone-700 transition-all group">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">+12%</span>
            </div>
            <p className="text-stone-500 text-sm font-medium mb-1">{stat.label}</p>
            <p className="text-2xl font-bold text-white tracking-tight">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        <div className="xl:col-span-2 space-y-8">
          {/* Recent Bookings Table */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Prenotazioni Recenti</h2>
            <Link href="/admin/prenotazioni" className="text-emerald-400 text-sm font-medium hover:underline flex items-center gap-1">
              Vedi tutte <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-950/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Gruppo</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Grotta</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Persone</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Stato</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50 text-sm">
                {recentBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-stone-800/20 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white">{booking.gruppo}</td>
                    <td className="px-6 py-4 text-stone-400">{booking.grotta}</td>
                    <td className="px-6 py-4 text-stone-400">{booking.data}</td>
                    <td className="px-6 py-4 text-stone-400">{booking.persone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        booking.stato === 'Confermata' 
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                          : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {booking.stato.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-stone-900/40 border border-stone-800 rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Gestione Utenti Registrati</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-stone-950/50">
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Nome</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Email</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest">Stato</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-stone-500 uppercase tracking-widest text-right">Azioni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/50 text-sm">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-stone-500">Nessun utente registrato.</td>
                  </tr>
                ) : users.map((user) => (
                  <tr key={user.id} className="hover:bg-stone-800/20 transition-colors group">
                    <td className="px-6 py-4 font-semibold text-white">{user.name}</td>
                    <td className="px-6 py-4 text-stone-400">{user.email}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                        user.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                        user.status === 'rejected' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                        'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      }`}>
                        {user.status === 'approved' ? 'APPROVATO' : user.status === 'rejected' ? 'RIFIUTATO' : 'IN ATTESA'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {user.status !== 'approved' && (
                          <button 
                            onClick={() => handleUpdateUserStatus(user.id, 'approved')} 
                            className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition-colors"
                            title="Approva Utente"
                          >
                            Accetta
                          </button>
                        )}
                        {user.status !== 'rejected' && (
                          <button 
                            onClick={() => handleUpdateUserStatus(user.id, 'rejected')} 
                            className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-bold transition-colors"
                            title="Rifiuta o Blocca Utente"
                          >
                            Rifiuta
                          </button>
                        )}
                        {user.status !== 'pending' && (
                          <button 
                            onClick={() => handleUpdateUserStatus(user.id, 'pending')} 
                            className="px-3 py-1 bg-stone-700 hover:bg-stone-600 text-white rounded-lg text-xs font-bold transition-colors"
                            title="Rimetti in attesa"
                          >
                            In Attesa
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        </div>

        {/* Quick Actions / Activity */}
        <div className="space-y-8">
          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Azioni Rapide</h2>
            <div className="grid grid-cols-1 gap-4">
              <button 
                onClick={() => alert('Funzione di inserimento grotta in fase di attivazione. Sarà disponibile nella versione finale.')}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition-all"
              >
                <Mountain size={18} />
                <span>Aggiungi Nuova Grotta</span>
              </button>
              <button 
                onClick={handleExport}
                className="flex items-center gap-3 w-full p-4 rounded-2xl bg-stone-800 hover:bg-stone-700 text-white font-semibold transition-all border border-stone-700"
              >
                <Calendar size={18} />
                <span>Esporta Report Mensile</span>
              </button>
            </div>
          </div>

          <div className="bg-stone-900/40 border border-stone-800 rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Disponibilità Odierna</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Castellana</span>
                  <span className="text-[10px] text-stone-500">Puglia</span>
                </div>
                <span className="text-[10px] font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-full">OCCUPATA</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-950/50 border border-stone-800">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">Grotte di Stiffe</span>
                  <span className="text-[10px] text-stone-500">Abruzzo</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">LIBERA</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
