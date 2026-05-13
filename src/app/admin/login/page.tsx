'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulazione login: in produzione userebbe Supabase Auth
    if (email === 'admin@spelobook.it' && password === 'admin123') {
      router.push('/admin');
    } else {
      setError('Credenziali non valide. Riprova.');
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 font-extrabold text-3xl mb-8">
            <span className="text-4xl">🪨</span>
            <span className="text-white">Spelo</span><span className="text-emerald-500">Book</span>
          </Link>
          <h1 className="text-2xl font-bold text-white tracking-tight">Accesso Admin</h1>
          <p className="text-stone-400 mt-2 text-sm">Inserisci le tue credenziali per gestire il portale.</p>
        </div>

        <div className="bg-stone-900/40 backdrop-blur-xl border border-stone-800 p-8 rounded-3xl shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Email</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500 group-focus-within:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-stone-950/50 border border-stone-800 rounded-2xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                  placeholder="admin@spelobook.it"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-500 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-stone-500 group-focus-within:text-emerald-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-11 pr-4 py-4 bg-stone-950/50 border border-stone-800 rounded-2xl text-white placeholder-stone-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-emerald-600/20 active:scale-95 group"
            >
              Accedi <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-stone-800 text-center">
            <p className="text-stone-500 text-xs">
              Hai dimenticato la password? <button className="text-emerald-500 hover:underline">Contatta il supporto</button>
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-stone-500 text-sm hover:text-white transition-colors">
            ← Torna al sito principale
          </Link>
        </div>
      </div>
    </div>
  );
}
