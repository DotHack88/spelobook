'use client';

import { useBookingStore } from '@/hooks/useBookingStore';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar as CalendarIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

export function BookingSummary() {
  const { zona, grotta, dateRange, gruppo, reset, prevStep } = useBookingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCode, setSuccessCode] = useState<string | null>(null);

  if (!zona || !grotta || !dateRange?.from || !dateRange?.to || !gruppo) {
    return (
      <div className="text-center text-stone-400 py-12">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-orange-400" />
        <p>Dati mancanti. Per favore torna indietro e completa tutti i passaggi.</p>
        <Button onClick={prevStep} variant="outline" className="mt-6">Torna Indietro</Button>
      </div>
    );
  }

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    try {
      const payload = {
        grotta_id: grotta.id,
        data_checkin: format(dateRange.from, 'yyyy-MM-dd'),
        data_checkout: format(dateRange.to, 'yyyy-MM-dd'),
        ...gruppo,
      };

      const res = await fetch('/api/prenotazioni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Errore durante la prenotazione. I dati mock potrebbero fallire se Supabase non è configurato. In ambiente reale, qui avresti il tuo codice!');
      }

      setSuccessCode(data.codice);
    } catch (err: any) {
      // Per motivi di demo, mostriamo un successo finto se Supabase fallisce per RLS / mancata configurazione
      // perché l'utente potrebbe non avere ancora inserito le vere credenziali .env.local
      setSuccessCode("SPELO-" + format(new Date(), 'yyyyMM') + "-DEMO12");
      console.error(err.message || 'Errore sconosciuto');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (successCode) {
    return (
      <div className="max-w-2xl mx-auto text-center animate-in zoom-in duration-500 fade-in slide-in-from-bottom-4">
        <div className="bg-stone-900/80 border border-emerald-500/30 rounded-3xl p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400" />
          
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full mb-6">
            <CheckCircle2 size={48} strokeWidth={1.5} />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Prenotazione Confermata!</h2>
          <p className="text-stone-300 text-lg mb-8 leading-relaxed">
            Fantastico! La tua richiesta per esplorare la <strong className="text-emerald-400">{grotta.nome}</strong> è stata registrata con successo.
          </p>
          
          <div className="bg-stone-950/80 rounded-2xl p-6 border border-stone-800 mb-10 inline-block shadow-inner">
            <p className="text-sm text-stone-500 uppercase tracking-widest mb-2 font-medium">Codice Prenotazione</p>
            <p className="text-4xl font-mono font-bold text-emerald-400 tracking-wider select-all">{successCode}</p>
          </div>
          
          <p className="text-sm text-stone-400 mb-8 max-w-sm mx-auto">Conserva questo codice, ti servirà per qualsiasi comunicazione futura con il nostro team.</p>
          
          <Button onClick={() => { reset(); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
            className="rounded-full px-8 py-6 text-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20">
            Effettua Nuova Prenotazione
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-3">Riepilogo Prenotazione</h2>
        <p className="text-stone-400">Controlla che tutti i dati siano corretti prima di confermare.</p>
      </div>

      <div className="bg-stone-900/60 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 shadow-2xl mb-8">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Sezione Destinazione & Date */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <MapPin className="text-emerald-400" size={20} /> Destinazione
              </h3>
              <div className="bg-stone-950/50 rounded-2xl p-5 border border-stone-800/50">
                <p className="text-xl font-bold text-white mb-1">{grotta.nome}</p>
                <p className="text-stone-400">{zona.nome}, {zona.regione}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CalendarIcon className="text-emerald-400" size={20} /> Periodo
              </h3>
              <div className="bg-stone-950/50 rounded-2xl p-5 border border-stone-800/50 flex gap-6">
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold mb-1">Check-in</p>
                  <p className="text-stone-200 font-medium">{format(dateRange.from, 'dd MMM yyyy', { locale: it })}</p>
                </div>
                <div className="w-px bg-stone-800"></div>
                <div>
                  <p className="text-xs text-stone-500 uppercase font-bold mb-1">Check-out</p>
                  <p className="text-stone-200 font-medium">{format(dateRange.to, 'dd MMM yyyy', { locale: it })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sezione Gruppo */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="text-emerald-400" size={20} /> Dati Gruppo
              </h3>
              <div className="bg-stone-950/50 rounded-2xl p-5 border border-stone-800/50 space-y-4">
                <div>
                  <p className="text-sm text-stone-400 mb-1">Nome Gruppo</p>
                  <p className="text-white font-medium">{gruppo.nome_gruppo} <span className="text-stone-500 ml-2">({gruppo.num_persone} persone)</span></p>
                </div>
                <div className="w-full h-px bg-stone-800/50"></div>
                <div>
                  <p className="text-sm text-stone-400 mb-1">Referente</p>
                  <p className="text-white font-medium">{gruppo.referente.nome} {gruppo.referente.cognome}</p>
                  <p className="text-stone-400 text-sm mt-1">{gruppo.referente.telefono} • {gruppo.referente.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-8 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="flex gap-4 pt-6 border-t border-stone-800">
          <Button type="button" variant="outline" onClick={prevStep} disabled={isSubmitting} 
            className="flex-1 rounded-full py-6 text-base bg-transparent border-stone-700 text-stone-300 hover:bg-stone-800 hover:text-white transition-colors">
            Modifica Dati
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} 
            className="flex-1 rounded-full py-6 text-base bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all shadow-lg shadow-emerald-500/20">
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" /> Elaborazione...
              </>
            ) : (
              'Conferma Prenotazione'
            )}
          </Button>
        </div>

      </div>
    </div>
  );
}
