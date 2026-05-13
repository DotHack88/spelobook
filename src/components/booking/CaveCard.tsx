import { Grotta } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Ruler, Activity, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const diffColors = {
  facile:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  media:     'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  difficile: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  esperta:   'bg-red-500/10 text-red-400 border-red-500/20',
};

const tipoConfig: Record<string, { emoji: string; label: string; className: string }> = {
  carsica:    { emoji: '🪨', label: 'Carsica',    className: 'bg-amber-500/10 text-amber-300 border-amber-500/20' },
  lavica:     { emoji: '🌋', label: 'Lavica',     className: 'bg-red-600/10 text-red-400 border-red-500/20' },
  marina:     { emoji: '🌊', label: 'Marina',     className: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20' },
  glaciale:   { emoji: '🧊', label: 'Glaciale',   className: 'bg-sky-500/10 text-sky-300 border-sky-500/20' },
  tettonica:  { emoji: '⛰️', label: 'Tettonica',  className: 'bg-stone-500/10 text-stone-300 border-stone-500/20' },
  eolica:     { emoji: '💨', label: 'Eolica',     className: 'bg-violet-500/10 text-violet-300 border-violet-500/20' },
  crollo:     { emoji: '🪨', label: 'Di Crollo',  className: 'bg-orange-500/10 text-orange-300 border-orange-500/20' },
  artificiale:{ emoji: '🏛️', label: 'Artificiale',className: 'bg-purple-500/10 text-purple-300 border-purple-500/20' },
};

export function CaveCard({ grotta, onSelect }: { grotta: Grotta; onSelect: (g: Grotta) => void }) {
  const tipo = grotta.tipologia ? tipoConfig[grotta.tipologia] : null;

  return (
    <Card
      className="group cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/40 backdrop-blur-sm shadow-xl hover:border-emerald-500/30 hover:shadow-emerald-900/10 transition-all duration-300 overflow-hidden"
      onClick={() => onSelect(grotta)}
    >
      <div className="relative h-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-stone-900 to-transparent z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
          style={{ backgroundImage: `url(${grotta.immagini?.[0] || 'https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=600'})` }}
        />
        {/* Badges: tipologia (sinistra) + difficoltà (destra) */}
        <div className="absolute top-4 left-4 z-20 flex gap-2">
          {tipo && (
            <Badge className={`${tipo.className} flex items-center gap-1 text-xs font-semibold`}>
              <span>{tipo.emoji}</span> {tipo.label}
            </Badge>
          )}
        </div>
        <div className="absolute top-4 right-4 z-20">
          <Badge className={diffColors[grotta.difficolta]}>
            {grotta.difficolta.toUpperCase()}
          </Badge>
        </div>
      </div>

      <CardContent className="p-6 relative z-20 bg-stone-900/80">
        <h3 className="text-2xl font-bold text-white mb-2">{grotta.nome}</h3>
        <p className="text-stone-400 text-sm line-clamp-2 mb-6">{grotta.descrizione}</p>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="flex flex-col items-center p-3 rounded-xl bg-stone-950/50 border border-stone-800">
            <Activity className="w-5 h-5 text-emerald-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Profondità</span>
            <span className="font-bold text-white text-sm">{grotta.profondita_mt ? `${grotta.profondita_mt}m` : '-'}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-stone-950/50 border border-stone-800">
            <Ruler className="w-5 h-5 text-cyan-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Lunghezza</span>
            <span className="font-bold text-white text-sm">{grotta.lunghezza_mt ? `${grotta.lunghezza_mt}m` : '-'}</span>
          </div>
          <div className="flex flex-col items-center p-3 rounded-xl bg-stone-950/50 border border-stone-800">
            <Users className="w-5 h-5 text-purple-400 mb-1" />
            <span className="text-[10px] text-stone-400 uppercase tracking-wider mt-1">Capienza</span>
            <span className="font-bold text-white text-sm">{grotta.max_persone} max</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-emerald-400 font-medium group-hover:text-emerald-300 transition-colors">
          <span>Seleziona grotta</span>
          <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </CardContent>
    </Card>
  );
}
