'use client';

import { useState } from 'react';
import { 
  Settings, 
  Bell, 
  Shield, 
  Globe, 
  Save, 
  Database,
  Mail,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminSettings() {
  const [isSaving, setIsSaving] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Impostazioni salvate con successo!');
    }, 1000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Settings className="text-emerald-500" size={32} />
            Impostazioni Sistema
          </h1>
          <p className="text-stone-400 mt-1">Configura i parametri globali della piattaforma SpeleoBook.</p>
        </div>
        <Button 
          onClick={handleSave} 
          disabled={isSaving}
          className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-6 rounded-2xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95 font-bold"
        >
          <Save size={20} className="mr-2" />
          {isSaving ? 'Salvataggio...' : 'Salva Modifiche'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="space-y-2">
          {[
            { id: 'generali', label: 'Generali', icon: Globe, active: true },
            { id: 'notifiche', label: 'Notifiche', icon: Bell, active: false },
            { id: 'sicurezza', label: 'Sicurezza', icon: Shield, active: false },
            { id: 'database', label: 'Database & API', icon: Database, active: false },
          ].map((item) => (
            <button
              key={item.id}
              className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-semibold ${
                item.active 
                  ? 'bg-emerald-600/10 text-emerald-400 border border-emerald-500/20 shadow-lg' 
                  : 'text-stone-500 hover:bg-stone-900 hover:text-stone-300'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="md:col-span-2 space-y-8">
          {/* General Section */}
          <div className="bg-stone-900/40 border border-stone-800 rounded-[2.5rem] p-8 shadow-2xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Globe className="text-emerald-500" size={20} /> Impostazioni Generali
              </h2>
              
              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest px-1">Nome Piattaforma</label>
                  <input 
                    type="text" 
                    defaultValue="SpeleoBook — Esplorazioni Certificate"
                    className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl px-5 py-4 text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none shadow-inner"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest px-1">Email di Contatto</label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                    <input 
                      type="email" 
                      defaultValue="info@spelobook.it"
                      className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl pl-14 pr-5 py-4 text-white focus:border-emerald-500 outline-none transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-800/50">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <Database className="text-emerald-500" size={20} /> Database & Connettività
              </h2>
              
              <div className="space-y-6">
                <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                      <Database size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white leading-none">Supabase Connection</p>
                      <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1 tracking-widest">Attiva & Sincronizzata</p>
                    </div>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-500 uppercase tracking-widest px-1">Anon Key (Public)</label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600" size={18} />
                    <input 
                      type={showKey ? 'text' : 'password'} 
                      defaultValue="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI..."
                      readOnly
                      className="w-full bg-stone-950/50 border border-stone-800 rounded-2xl pl-14 pr-14 py-4 text-white font-mono text-xs outline-none shadow-inner"
                    />
                    <button 
                      onClick={() => setShowKey(!showKey)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-stone-600 hover:text-emerald-400 transition-colors"
                    >
                      {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-stone-800/50">
               <div className="flex items-center justify-between p-6 rounded-2xl bg-stone-950 border border-stone-800">
                  <div className="space-y-1">
                    <p className="font-bold text-white">Modalità Manutenzione</p>
                    <p className="text-xs text-stone-500">Metti il sito in sola lettura per gli utenti durante gli aggiornamenti.</p>
                  </div>
                  <button className="w-12 h-6 bg-stone-800 rounded-full relative transition-colors">
                    <div className="absolute left-1 top-1 w-4 h-4 bg-stone-600 rounded-full" />
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
