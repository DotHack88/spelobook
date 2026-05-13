import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { groupSchema } from '@/lib/validations/booking';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function GroupForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const form = useForm({ resolver: zodResolver(groupSchema) });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      {/* Sezione: Dati Gruppo */}
      <section>
        <h3 className="text-lg font-semibold mb-4">🏔️ Dati del Gruppo</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Nome del gruppo</label>
            <Input {...form.register('nome_gruppo')} placeholder="es. CAI Sezione Milano" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Numero partecipanti</label>
            <Input type="number" {...form.register('num_persone', { valueAsNumber: true })} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Livello esperienza</label>
            <select className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...form.register('esperienza_dichiarata')}>
              <option value="">Seleziona...</option>
              <option value="principianti">Principianti (0-2 uscite)</option>
              <option value="intermedi">Intermedi (2-10 uscite)</option>
              <option value="esperti">Esperti (10+ uscite)</option>
              <option value="professionisti">Professionisti/Guide</option>
            </select>
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
