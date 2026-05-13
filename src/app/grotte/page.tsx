'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

const TIPOLOGIE = [
  { tipo: 'carsica',     emoji: '🪨', label: 'Carsica',     colore: 'amber',  diffusione: 'Molto diffusa', origine: 'Dissoluzione di rocce calcaree, gesso o dolomia ad opera dell\'acqua', caratteristiche: ['Stalattiti e stalagmiti', 'Fiumi sotterranei', 'Pozzi verticali', 'Sale enormi'], zone: ['Appennini', 'Alpi', 'Sardegna', 'Carso triestino'] },
  { tipo: 'lavica',      emoji: '🌋', label: 'Lavica',      colore: 'red',    diffusione: 'Localizzata',   origine: 'La lava esterna si solidifica mentre l\'interna continua a scorrere, creando tunnel vuoti', caratteristiche: ['Tunnel cilindrici', 'Lava solidificata', 'Temperature alte', 'Stalattiti di lava'], zone: ['Sicilia (Etna)', 'Lazio', 'Campania'] },
  { tipo: 'marina',      emoji: '🌊', label: 'Marina',      colore: 'cyan',   diffusione: 'Diffusa',       origine: 'Erosione delle onde del mare sulle coste rocciose', caratteristiche: ['Accessibili via barca', 'Pareti lisce', 'Colori azzurri', 'Riflessi luminosi'], zone: ['Campania (Capri)', 'Sardegna', 'Puglia', 'Liguria'] },
  { tipo: 'glaciale',    emoji: '🧊', label: 'Glaciale',    colore: 'sky',    diffusione: 'Rara',          origine: 'Formazione o scioglimento di ghiacciai nelle zone alpine', caratteristiche: ['Ghiaccio blu', 'Temperature molto basse', 'Struttura instabile', 'Cambia stagionalmente'], zone: ['Alpi', 'Dolomiti'] },
  { tipo: 'tettonica',   emoji: '⛰️', label: 'Tettonica',   colore: 'stone',  diffusione: 'Moderata',      origine: 'Movimenti della crosta terrestre e spaccature nella roccia', caratteristiche: ['Gallerie strette', 'Fenditure profonde', 'Poco decorate', 'Pareti taglienti'], zone: ['Zone montuose', 'Appennini', 'Alpi'] },
  { tipo: 'eolica',      emoji: '💨', label: 'Eolica',      colore: 'violet', diffusione: 'Molto rara',    origine: 'Erosione del vento nel tempo su superfici rocciose esposte', caratteristiche: ['Pareti scolpite', 'Forme arrotondate', 'Poco profonde', 'Esposizione costiera'], zone: ['Coste', 'Zone desertiche'] },
  { tipo: 'crollo',      emoji: '🏔️', label: 'Di Crollo',   colore: 'orange', diffusione: 'Moderata',      origine: 'Collasso di grandi masse rocciose per gravità o sismi', caratteristiche: ['Ambienti irregolari', 'Blocchi enormi', 'Formazione rapida', 'Struttura caotica'], zone: ['Zone sismiche', 'Aree montuose'] },
  { tipo: 'artificiale', emoji: '🏛️', label: 'Artificiale', colore: 'purple', diffusione: 'Diffusa',       origine: 'Cavità create dall\'uomo nel corso dei secoli per vari scopi', caratteristiche: ['Gallerie regolari', 'Pareti lavorate', 'Strutture storiche', 'Varia profondità'], zone: ['Roma', 'Napoli', 'Tutta Italia'] },
];

const REGIONI: { regione: string; emoji: string; slug: string; grotte: { nome: string; tipo: string; emoji: string; nota: string }[] }[] = [
  { regione: 'Sicilia', emoji: '🌋', slug: 'sicilia', grotte: [
    { nome: 'Grotta del Gelo', tipo: 'lavica', emoji: '🧊', nota: 'Ghiacciaio perenne sull\'Etna a 2.040m' },
    { nome: 'Grotta dei Tre Livelli', tipo: 'lavica', emoji: '🌋', nota: 'Tubo di lava su 3 livelli sovrapposti' },
    { nome: 'Grotta dei Lamponi', tipo: 'lavica', emoji: '🌋', nota: 'Classico tubo di lava etneo' },
    { nome: 'Grotta Azzurra (Capri)', tipo: 'marina', emoji: '🌊', nota: 'Celebre per il blu intenso dell\'acqua' },
  ]},
  { regione: 'Sardegna', emoji: '🪸', slug: 'sardegna', grotte: [
    { nome: 'Grotta di Nettuno', tipo: 'marina', emoji: '🌊', nota: 'Accessibile via mare o dalla "Escala del Cabirol"' },
    { nome: 'Grotta del Bue Marino', tipo: 'marina', emoji: '🌊', nota: 'Ex rifugio della foca monaca a Cala Gonone' },
    { nome: 'Grotta di Su Mannau', tipo: 'carsica', emoji: '🪨', nota: '8,5 km di gallerie con laghi sotterranei' },
    { nome: 'Grotta di Su Marmuri', tipo: 'carsica', emoji: '🪨', nota: '"La cattedrale del Supramonte" — sale fino a 50m' },
  ]},
  { regione: 'Puglia', emoji: '🫒', slug: 'puglia', grotte: [
    { nome: 'Grotte di Castellana', tipo: 'carsica', emoji: '🪨', nota: 'La "Grotta Bianca" è la più splendente al mondo' },
    { nome: 'Grotta della Zinzulusa', tipo: 'marina', emoji: '🌊', nota: 'Fauna endemica rarissima a Castro' },
    { nome: 'Grotta della Poesia', tipo: 'marina', emoji: '🌊', nota: 'Iscrizioni micenee — tra i siti epigrafici più importanti' },
  ]},
  { regione: 'Marche', emoji: '🏔️', slug: 'marche', grotte: [
    { nome: 'Grotte di Frasassi', tipo: 'carsica', emoji: '🪨', nota: '"Abisso Ancona" — tra le più grandi d\'Europa' },
  ]},
  { regione: 'Friuli-VG', emoji: '❄️', slug: 'friuli', grotte: [
    { nome: 'Grotta Gigante', tipo: 'carsica', emoji: '🪨', nota: 'La sala unica più grande al mondo per turisti' },
    { nome: 'Abisso di Trebiciano', tipo: 'carsica', emoji: '🪨', nota: 'Scorre il fiume Timavo sotterraneo' },
  ]},
  { regione: 'Campania', emoji: '🌋', slug: 'campania', grotte: [
    { nome: 'Grotta Azzurra (Capri)', tipo: 'marina', emoji: '🌊', nota: 'Luce blu per rifrazione solare' },
    { nome: 'Grotte di Pertosa', tipo: 'carsica', emoji: '🪨', nota: 'Navigabile in barca su fiume sotterraneo' },
    { nome: 'Napoli Sotterranea', tipo: 'artificiale', emoji: '🏛️', nota: 'Cunicoli greco-romani sotto il centro storico' },
  ]},
  { regione: 'Calabria', emoji: '🏔️', slug: 'calabria', grotte: [
    { nome: 'Abisso del Bifurto', tipo: 'carsica', emoji: '🪨', nota: '683m di profondità nel Pollino' },
    { nome: 'Grotta delle Ninfe', tipo: 'carsica', emoji: '🪨', nota: 'Acque sulfuree e percorso facile' },
    { nome: 'Grotta del Romito', tipo: 'carsica', emoji: '🪨', nota: 'Incisioni paleolitiche del bos primigenius' },
  ]},
  { regione: 'Lazio', emoji: '🏛️', slug: 'lazio', grotte: [
    { nome: 'Grotte di Pastena', tipo: 'carsica', emoji: '🪨', nota: 'Cascate e laghetti sotterranei' },
    { nome: 'Catacombe di Roma', tipo: 'artificiale', emoji: '🏛️', nota: 'Oltre 60 km di gallerie funerarie paleocristiane' },
  ]},
  { regione: 'Liguria', emoji: '🌊', slug: 'liguria', grotte: [
    { nome: 'Grotte di Toirano', tipo: 'carsica', emoji: '🪨', nota: 'Famosa per il "Cimitero degli Orsi" e impronte preistoriche' },
    { nome: 'Grotte di Borgio Verezzi', tipo: 'carsica', emoji: '🪨', nota: 'Le grotte più colorate d\'Italia per i minerali rari' },
  ]},
  { regione: 'Lombardia', emoji: '🏔️', slug: 'lombardia', grotte: [
    { nome: 'Buco del Frate', tipo: 'carsica', emoji: '🪨', nota: 'Suggestivo sistema carsico nelle Prealpi Bresciane' },
    { nome: 'Grotte di Rescia', tipo: 'carsica', emoji: '🪨', nota: 'Cascate di travertino sul Lago di Lugano' },
  ]},
];

const coloriTipo: Record<string, string> = {
  carsica: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  lavica: 'bg-red-600/20 text-red-300 border-red-500/30',
  marina: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  glaciale: 'bg-sky-500/20 text-sky-300 border-sky-500/30',
  tettonica: 'bg-stone-500/20 text-stone-300 border-stone-500/30',
  eolica: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
  crollo: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  artificiale: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const cardBorder: Record<string, string> = {
  amber: 'border-amber-800/40 hover:border-amber-500/50',
  red: 'border-red-800/40 hover:border-red-500/50',
  cyan: 'border-cyan-800/40 hover:border-cyan-500/50',
  sky: 'border-sky-800/40 hover:border-sky-500/50',
  stone: 'border-stone-700/40 hover:border-stone-500/50',
  violet: 'border-violet-800/40 hover:border-violet-500/50',
  orange: 'border-orange-800/40 hover:border-orange-500/50',
  purple: 'border-purple-800/40 hover:border-purple-500/50',
};

export default function GrottePage() {
  const [regioneAttiva, setRegioneAttiva] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Spelo</span><span className="text-emerald-400">Book</span>
          </Link>
          <Link href="/prenota" className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105">
            Prenota ora
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Catalogo{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">Grotte d'Italia</span>
          </h1>
          <p className="text-stone-400 text-lg max-w-2xl mx-auto">
            8 tipologie geologiche, 55+ grotte famose, 10 regioni. 
            L'Italia è uno dei paesi europei con la maggiore densità di cavità naturali.
          </p>
        </div>

        {/* ─── TABELLA TIPOLOGIE ─── */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-10 text-white">🗂️ Tipologie Geologiche</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {TIPOLOGIE.map((t) => (
              <div key={t.tipo} className={`group bg-stone-900/50 border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardBorder[t.colore]}`}>
                <div className="text-4xl mb-4">{t.emoji}</div>
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-bold text-white">{t.label}</h3>
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase tracking-wider ${coloriTipo[t.tipo]}`}>
                    {t.diffusione}
                  </span>
                </div>
                <p className="text-stone-400 text-xs leading-relaxed mb-4">{t.origine}</p>
                <div className="space-y-1.5 mb-4">
                  {t.caratteristiche.map((c) => (
                    <div key={c} className="flex items-center gap-2 text-xs text-stone-300">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                      {c}
                    </div>
                  ))}
                </div>
                <div className="pt-3 border-t border-stone-800">
                  <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-1">Zone principali</p>
                  <p className="text-xs text-stone-400">{t.zone.join(' · ')}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CLASSIFICAZIONE PRIMARIA/SECONDARIA ─── */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-8 text-white">📊 Classificazione Speleologica</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-8">
              <div className="text-3xl mb-4">🌱</div>
              <h3 className="text-xl font-bold text-white mb-3">Grotte Primarie</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Formate <strong className="text-stone-200">insieme alla roccia</strong> che le contiene. Nascono durante la formazione stessa del materiale geologico.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Lavica 🌋', 'Glaciale 🧊'].map(t => (
                  <span key={t} className="bg-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <div className="bg-stone-900/50 border border-stone-800 rounded-3xl p-8">
              <div className="text-3xl mb-4">💧</div>
              <h3 className="text-xl font-bold text-white mb-3">Grotte Secondarie</h3>
              <p className="text-stone-400 text-sm leading-relaxed mb-4">
                Scavate <strong className="text-stone-200">dopo la formazione della roccia</strong>, da agenti esterni come acqua, vento, mare o attività tettonica.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Carsica 🪨', 'Marina 🌊', 'Tettonica ⛰️', 'Eolica 💨', 'Di Crollo 🏔️'].map(t => (
                  <span key={t} className="bg-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── MAPPA VISUALE ─── */}
        <section className="mb-24">
          <div className="relative group bg-stone-900/40 border border-stone-800 rounded-[3rem] p-8 md:p-12 overflow-hidden shadow-2xl">
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
                  🗺️ Mappa delle Esplorazioni
                </h2>
                <p className="text-stone-400 text-lg leading-relaxed mb-8">
                  Dalle profondità del Carso triestino fino ai tubi di lava dell'Etna, l'Italia offre una varietà geologica senza eguali. 
                  Scegli una regione per scoprire le cattedrali naturali nascoste sotto i nostri piedi.
                </p>
                <div className="space-y-4">
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                         <span className="font-bold">55+</span>
                      </div>
                      <span className="text-sm text-stone-300">Grotte censite e pronte per la prenotazione</span>
                   </div>
                   <div className="flex items-center gap-4 p-4 rounded-2xl bg-cyan-500/5 border border-cyan-500/10">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                         <span className="font-bold">8</span>
                      </div>
                      <span className="text-sm text-stone-300">Tipologie geologiche diverse</span>
                   </div>
                </div>
              </div>
              <div className="relative aspect-square md:aspect-video rounded-2xl overflow-hidden border border-stone-800 bg-stone-950">
                <img 
                  src="/api/placeholder/800/600" 
                  alt="Mappa Speleologica d'Italia" 
                  className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
                  style={{ backgroundImage: `url('/mappa_speleologica_italia_premium_1778710732003.png')`, backgroundSize: 'cover' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent" />
                
                {/* Hotspots mock */}
                <div className="absolute top-[20%] left-[45%] w-3 h-3 bg-emerald-500 rounded-full animate-ping opacity-75" />
                <div className="absolute top-[85%] left-[55%] w-3 h-3 bg-red-500 rounded-full animate-ping opacity-75" />
                <div className="absolute top-[70%] left-[45%] w-3 h-3 bg-cyan-500 rounded-full animate-ping opacity-75" />
              </div>
            </div>
            {/* Background glowing effects */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]" />
          </div>
        </section>

        {/* ─── LISTA PER REGIONE ─── */}
        <section className="mb-24">
          <h2 className="text-3xl font-bold mb-4 text-white">📍 Grotte Famose per Regione</h2>
          <p className="text-stone-400 mb-10">Clicca su una regione per vedere le grotte disponibili.</p>

          {/* Pill selezione regione */}
          <div className="flex flex-wrap gap-3 mb-10">
            <button
              onClick={() => setRegioneAttiva(null)}
              className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${regioneAttiva === null ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-stone-900 text-stone-400 border-stone-700 hover:text-white hover:border-stone-500'}`}
            >
              Tutte le regioni
            </button>
            {REGIONI.map((r) => (
              <button
                key={r.regione}
                onClick={() => setRegioneAttiva(r.regione === regioneAttiva ? null : r.regione)}
                className={`px-5 py-2.5 rounded-full border text-sm font-semibold transition-all ${regioneAttiva === r.regione ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-stone-900 text-stone-400 border-stone-700 hover:text-white hover:border-stone-500'}`}
              >
                {r.emoji} {r.regione}
              </button>
            ))}
          </div>

          {/* Grotte */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {REGIONI.filter(r => regioneAttiva === null || r.regione === regioneAttiva).map((r) => (
              <div key={r.regione} className="bg-stone-900/50 border border-stone-800 rounded-3xl overflow-hidden">
                <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between">
                  <h3 className="font-bold text-white flex items-center gap-2">
                    <span className="text-xl">{r.emoji}</span> {r.regione}
                  </h3>
                  {r.slug && ['calabria','puglia','sardegna','friuli','sicilia','campania','liguria','lombardia'].includes(r.slug) && (
                    <Link href={`/prenota/${r.slug}`} className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 transition-colors">
                      Prenota <ChevronRight size={12} />
                    </Link>
                  )}
                </div>
                <div className="divide-y divide-stone-800/50">
                  {r.grotte.map((g) => (
                    <div key={g.nome} className="px-6 py-4 flex items-start gap-4 hover:bg-stone-800/30 transition-colors">
                      <span className="text-2xl shrink-0">{g.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <p className="font-semibold text-white text-sm">{g.nome}</p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${coloriTipo[g.tipo]}`}>
                            {g.tipo}
                          </span>
                        </div>
                        <p className="text-stone-400 text-xs leading-relaxed">{g.nota}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="text-center bg-gradient-to-br from-emerald-950/60 to-stone-900/60 border border-emerald-900/30 rounded-3xl p-12">
          <h2 className="text-3xl font-extrabold mb-4">Vuoi esplorarne una?</h2>
          <p className="text-stone-400 mb-8 max-w-lg mx-auto">Prenota la tua escursione in 4 step. Scegli la zona, la grotta, le date e i dati del gruppo.</p>
          <Link href="/prenota" className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-10 py-4 rounded-full transition-all hover:scale-105 shadow-lg shadow-emerald-500/20">
            Inizia la Prenotazione <ChevronRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
