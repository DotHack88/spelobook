import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupSchema } from '@/lib/validations/booking';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useBookingStore } from '@/hooks/useBookingStore';
import { useEffect } from 'react';

import { z } from 'zod';

type GroupFormData = z.infer<typeof groupSchema>;

export function GroupForm({ onSubmit }: { onSubmit: (data: GroupFormData) => void }) {
  const { gruppo } = useBookingStore();
  
  const form = useForm<GroupFormData>({ 
    resolver: zodResolver(groupSchema),
    defaultValues: (gruppo as GroupFormData) || {
      nome_gruppo: '',
      num_persone: 1,
      referente: { nome: '', cognome: '', telefono: '', email: '' },
      referente2: { nome: '', cognome: '', telefono: '', email: '' },
      note: ''
    }
  });

  // Aggiorna il form se il gruppo nello store cambia (es. dalla barra di ricerca)
  useEffect(() => {
    if (gruppo) {
      form.reset(gruppo);
    }
  }, [gruppo, form]);

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Sezione: Dati Gruppo */}
      <section>
        <h3 className="text-xl font-bold mb-6 text-white flex items-center gap-3">
           <span className="text-2xl">⛰️</span> Dati del Gruppo
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome del gruppo</label>
            <Input {...form.register('nome_gruppo')} placeholder="es. CAI Sezione Milano" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Numero partecipanti</label>
            <Input type="number" {...form.register('num_persone', { valueAsNumber: true })} />
          </div>
        </div>
      </section>

      {/* Sezione: Referente Principale */}
      <section>
        <h3 className="text-lg font-semibold mb-4">👤 Referente Principale</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input {...form.register('referente.nome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cognome</label>
            <Input {...form.register('referente.cognome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cellulare</label>
            <Input type="tel" {...form.register('referente.telefono')} placeholder="+39 333 1234567" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...form.register('referente.email')} placeholder="nome@email.it" />
          </div>
        </div>
      </section>

      {/* Sezione: Referente Secondario (opzionale) */}
      <section>
        <h3 className="text-lg font-semibold mb-2">👤 Referente Secondario
          <span className="text-sm font-normal text-stone-400 ml-2">(opzionale)</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome</label>
            <Input {...form.register('referente2.nome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cognome</label>
            <Input {...form.register('referente2.cognome')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Cellulare</label>
            <Input type="tel" {...form.register('referente2.telefono')} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input type="email" {...form.register('referente2.email')} />
          </div>
        </div>
      </section>

      {/* Note */}
      <section className="space-y-2">
        <label className="text-sm font-medium">Note aggiuntive</label>
        <Textarea {...form.register('note')} placeholder="Esigenze speciali, attrezzatura disponibile, domande..." />
      </section>

      <Button type="submit" className="w-full">
        Continua → Riepilogo
      </Button>
    </form>
  );
}
