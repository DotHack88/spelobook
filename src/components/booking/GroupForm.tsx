import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupSchema } from '@/lib/validations/booking';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useUserStore } from '@/hooks/useUserStore';
import { useEffect } from 'react';

import { z } from 'zod';

type GroupFormData = z.infer<typeof groupSchema>;

export function GroupForm({ onSubmit }: { onSubmit: (data: GroupFormData) => void }) {
  const { gruppo } = useBookingStore();
  
  const form = useForm<GroupFormData>({ 
    resolver: zodResolver(groupSchema),
    mode: 'onChange',
    defaultValues: (gruppo as GroupFormData) || {
      nome_gruppo: '',
      num_persone: 1,
      referente: { nome: '', cognome: '', telefono: '', email: '' },
      note: ''
    }
  });

  const { isValid } = form.formState;
  const { user } = useUserStore.getState();

  // Aggiorna il form se il gruppo nello store cambia (es. dalla barra di ricerca)
  useEffect(() => {
    if (gruppo) {
      form.reset(gruppo);
    } else if (user) {
      // Precompila con i dati dell'utente loggato
      form.reset({
        nome_gruppo: '',
        num_persone: 1,
        referente: { nome: user.name, cognome: '', telefono: '', email: user.email },
        note: ''
      });
    }
  }, [gruppo, form, user]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Sezione: Dati Gruppo */}
      <section>
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
           <span className="text-2xl">⛰️</span> Dati del Gruppo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome del gruppo <span className="text-red-500">*</span></label>
            <Input {...form.register('nome_gruppo')} placeholder="es. CAI Sezione Milano" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Numero partecipanti <span className="text-red-500">*</span></label>
            <Input type="number" {...form.register('num_persone', { valueAsNumber: true })} />
          </div>
        </div>
      </section>

      {/* Sezione: Referente Principale */}
      <section>
        <h3 className="text-lg font-semibold mb-4">👤 Referente Principale</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome <span className="text-red-500">*</span></label>
            <Input {...form.register('referente.nome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cognome <span className="text-red-500">*</span></label>
            <Input {...form.register('referente.cognome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cellulare <span className="text-red-500">*</span></label>
            <Input type="tel" {...form.register('referente.telefono')} placeholder="+39 333 1234567" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email <span className="text-red-500">*</span></label>
            <Input type="email" {...form.register('referente.email')} placeholder="nome@email.it" />
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="space-y-2">
        <label className="text-sm font-medium">Note aggiuntive</label>
        <Textarea {...form.register('note')} placeholder="Esigenze speciali, attrezzatura disponibile, domande..." />
      </section>

      <Button 
        type="submit" 
        disabled={!isValid}
        className={`w-full py-6 text-lg font-bold rounded-2xl transition-all shadow-lg active:scale-[0.98] ${
          isValid 
            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/20' 
            : 'bg-stone-800 text-stone-500 cursor-not-allowed border-stone-700 shadow-none'
        }`}
      >
        Continua → Riepilogo
      </Button>
    </form>
  );
}
