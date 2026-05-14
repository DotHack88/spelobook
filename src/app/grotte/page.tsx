'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ChevronRight, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

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
  { regione: 'Abruzzo', emoji: '🐻', slug: 'abruzzo', grotte: [
    { nome: 'Grotte di Stiffe', tipo: 'carsica', emoji: '🪨', nota: 'Risorgenza attiva nel cuore dell\'Appennino' },
    { nome: 'Grotta del Cavallone', tipo: 'carsica', emoji: '🪨', nota: 'Celebre "Grotta della Figlia di Iorio"' },
    { nome: 'Fiamme Gialle', tipo: 'carsica', emoji: '🪨', nota: 'Cavità tecnica con pozzi' },
    { nome: 'Abisso del Bivacco', tipo: 'carsica', emoji: '🪨', nota: 'Profondo abisso nella Maiella' },
    { nome: 'Beatrice Cenci', tipo: 'carsica', emoji: '🪨', nota: 'Piccola e ricca di storia' },
  ]},
  { regione: 'Calabria', emoji: '🏔️', slug: 'calabria', grotte: [
    { nome: 'Abisso del Bifurto', tipo: 'carsica', emoji: '🪨', nota: '683m di profondità nel Pollino' },
    { nome: 'Grotta delle Ninfe', tipo: 'carsica', emoji: '🪨', nota: 'Acque sulfuree e percorso facile' },
    { nome: 'Grotta del Romito', tipo: 'carsica', emoji: '🪨', nota: 'Incisioni paleolitiche del bos primigenius' },
    { nome: 'Grotta di Lamia', tipo: 'carsica', emoji: '🪨', nota: 'Sale concrezionate molto ampie' },
    { nome: 'Grotta del Fiume', tipo: 'carsica', emoji: '🪨', nota: 'Sistema attivo nel Pollino' },
  ]},
  { regione: 'Campania', emoji: '🌋', slug: 'campania', grotte: [
    { nome: 'Grotte di Pertosa', tipo: 'carsica', emoji: '🪨', nota: 'Navigabile in barca su fiume sotterraneo' },
    { nome: 'Grotta dello Smeraldo', tipo: 'marina', emoji: '🌊', nota: 'Luce smeraldo per rifrazione' },
    { nome: 'Grotte di Castelcivita', tipo: 'carsica', emoji: '🪨', nota: 'Vasto complesso alle porte del Cilento' },
    { nome: 'Grotta Azzurra (Capri)', tipo: 'marina', emoji: '🌊', nota: 'Luce blu per rifrazione solare' },
    { nome: 'Grotta del Melo', tipo: 'carsica', emoji: '🪨', nota: 'Cavità tecnica con ampie sale' },
  ]},
  { regione: 'Friuli-VG', emoji: '❄️', slug: 'friuli', grotte: [
    { nome: 'Grotta Gigante', tipo: 'carsica', emoji: '🪨', nota: 'La sala unica più grande al mondo' },
    { nome: 'Abisso di Trebiciano', tipo: 'carsica', emoji: '🪨', nota: 'Scorre il fiume Timavo sotterraneo' },
    { nome: 'Grotta Impossibile', tipo: 'carsica', emoji: '🪨', nota: 'Enormi gallerie scoperte recentemente' },
    { nome: 'Grotta di Villanova', tipo: 'carsica', emoji: '🪨', nota: 'Importante grotta di contatto' },
    { nome: 'Grotta Doviza', tipo: 'carsica', emoji: '🪨', nota: 'Ricca di fauna ipogea' },
  ]},
  { regione: 'Lazio', emoji: '🏛️', slug: 'lazio', grotte: [
    { nome: 'Grotte di Pastena', tipo: 'carsica', emoji: '🪨', nota: 'Cascate e laghetti sotterranei' },
    { nome: 'Grotta di Collepardo', tipo: 'carsica', emoji: '🪨', nota: '"La Regina" per maestosità delle sale' },
    { nome: 'Pozzo del Merro', tipo: 'tettonica', emoji: '⛰️', nota: 'Sinkhole allagato più profondo al mondo' },
    { nome: 'Grotta Ciccio Felice', tipo: 'carsica', emoji: '🪨', nota: 'Importante sito archeologico' },
    { nome: 'Grotta Guattari', tipo: 'marina', emoji: '🌊', nota: 'Famosa per i resti neandertaliani' },
  ]},
  { regione: 'Liguria', emoji: '🌊', slug: 'liguria', grotte: [
    { nome: 'Grotte di Toirano', tipo: 'carsica', emoji: '🪨', nota: 'Cimitero degli Orsi e impronte preistoriche' },
    { nome: 'Grotte di Borgio Verezzi', tipo: 'carsica', emoji: '🪨', nota: 'Le grotte più colorate d\'Italia' },
    { nome: 'Arma di Taggia', tipo: 'carsica', emoji: '🪨', nota: 'Sito preistorico di rilievo' },
    { nome: 'Grotta di Bergeggi', tipo: 'marina', emoji: '🌊', nota: 'Grotta marina con reperti' },
    { nome: 'Abisso Meraviglie', tipo: 'carsica', emoji: '🪨', nota: 'Cavità tecnica verticale' },
  ]},
  { regione: 'Lombardia', emoji: '🏔️', slug: 'lombardia', grotte: [
    { nome: 'Grotta di Ferrera', tipo: 'carsica', emoji: '🪨', nota: 'Suggestiva cavità vicino al Lago di Como' },
    { nome: 'Grotte di Rescia', tipo: 'carsica', emoji: '🪨', nota: 'Cascate di travertino sul Lago di Lugano' },
    { nome: 'Bus di Garibaldi', tipo: 'carsica', emoji: '🪨', nota: 'Ricca di storia e leggende locali' },
    { nome: 'Grotta di Remaron', tipo: 'carsica', emoji: '🪨', nota: 'Importante sito carsico varesino' },
    { nome: 'Buco del Frate', tipo: 'carsica', emoji: '🪨', nota: 'Ideale per prime esplorazioni' },
  ]},
  { regione: 'Marche', emoji: '🏔️', slug: 'marche', grotte: [
    { nome: 'Grotte di Frasassi', tipo: 'carsica', emoji: '🪨', nota: '"Abisso Ancona" — tra le più grandi d\'Europa' },
    { nome: 'Grotta del Vernino', tipo: 'carsica', emoji: '🪨', nota: 'Suggestiva cavità nell\'Appennino' },
    { nome: 'Grotta di Monte Cucco', tipo: 'carsica', emoji: '🪨', nota: 'Sistema vasto e profondo (922m)' },
    { nome: 'Grotta del Fiume', tipo: 'carsica', emoji: '🪨', nota: 'Percorso attivo lungo il ruscello ipogeo' },
    { nome: 'Abisso di Faggeto', tipo: 'carsica', emoji: '🪨', nota: 'Cavità tecnica verticale' },
  ]},
  { regione: 'Piemonte', emoji: '🏔️', slug: 'piemonte', grotte: [
    { nome: 'Grotta di Bossea', tipo: 'carsica', emoji: '🪨', nota: 'Prima grotta turistica d\'Italia' },
    { nome: 'Grotte di Caudano', tipo: 'carsica', emoji: '🪨', nota: 'Vasto complesso nel cuneese' },
    { nome: 'Abisso Fighiera', tipo: 'carsica', emoji: '🪨', nota: 'Tecnico e di altissima difficoltà' },
    { nome: 'Buco della Piastra', tipo: 'carsica', emoji: '🪨', nota: 'Ampi saloni suggestivi' },
    { nome: 'Rio Martino', tipo: 'carsica', emoji: '🪨', nota: 'Cascate ipogee spettacolari' },
  ]},
  { regione: 'Puglia', emoji: '🫒', slug: 'puglia', grotte: [
    { nome: 'Grotte di Castellana', tipo: 'carsica', emoji: '🪨', nota: 'La "Grotta Bianca" è la più splendente al mondo' },
    { nome: 'Grotta della Zinzulusa', tipo: 'marina', emoji: '🌊', nota: 'Fauna endemica rarissima a Castro' },
    { nome: 'Grotta della Poesia', tipo: 'marina', emoji: '🌊', nota: 'Iscrizioni micenee — sito epigrafico unico' },
    { nome: 'Grotta Palazzese', tipo: 'marina', emoji: '🌊', nota: 'Celebre ristorante ipogeo sul mare' },
    { nome: 'Abisso di Rotolo', tipo: 'carsica', emoji: '🪨', nota: 'La più profonda della Puglia (264m)' },
  ]},
  { regione: 'Sardegna', emoji: '🪸', slug: 'sardegna', grotte: [
    { nome: 'Grotta di Nettuno', tipo: 'marina', emoji: '🌊', nota: 'Accessibile via mare o dalla "Escala del Cabirol"' },
    { nome: 'Grotta del Bue Marino', tipo: 'marina', emoji: '🌊', nota: 'Ex rifugio della foca monaca a Cala Gonone' },
    { nome: 'Grotta di Su Mannau', tipo: 'carsica', emoji: '🪨', nota: '8,5 km di gallerie con laghi sotterranei' },
    { nome: 'Grotta di Su Marmuri', tipo: 'carsica', emoji: '🪨', nota: '"La cattedrale del Supramonte" — sale fino a 50m' },
    { nome: 'Grotta di Ispinigoli', tipo: 'carsica', emoji: '🪨', nota: 'Colonna stalagmitica tra le più alte d\'Europa' },
  ]},
  { regione: 'Sicilia', emoji: '🌋', slug: 'sicilia', grotte: [
    { nome: 'Grotta del Gelo', tipo: 'lavica', emoji: '🧊', nota: 'Ghiacciaio perenne sull\'Etna a 2.040m' },
    { nome: 'Grotta dei Tre Livelli', tipo: 'lavica', emoji: '🌋', nota: 'Tubo di lava su 3 livelli sovrapposti' },
    { nome: 'Grotta dei Lamponi', tipo: 'lavica', emoji: '🌋', nota: 'Classico tubo di lava etneo' },
    { nome: 'Grotta di Serracozzo', tipo: 'lavica', emoji: '🌋', nota: 'Tunnel con suggestivo crollo terminale' },
    { nome: 'Abisso della Scinduta', tipo: 'carsica', emoji: '🪨', nota: 'Pozzo tecnico nelle Madonie' },
  ]},
  { regione: 'Toscana', emoji: '🍷', slug: 'toscana', grotte: [
    { nome: 'Grotta del Vento', tipo: 'carsica', emoji: '🪨', nota: 'Icona della Garfagnana' },
    { nome: 'Antro del Corchia', tipo: 'carsica', emoji: '🪨', nota: 'Tra i sistemi più vasti d\'Europa' },
    { nome: 'Grotta Giusti', tipo: 'carsica', emoji: '🪨', nota: 'Termalismo ipogeo unico' },
    { nome: 'Grotta del Maona', tipo: 'carsica', emoji: '🪨', nota: 'Due pozzi di entrata e uscita' },
    { nome: 'Grotte di Equi Terme', tipo: 'carsica', emoji: '🪨', nota: 'Complesso carsico con geoparco e sorgenti termali' },
    { nome: 'Abisso Olivifer', tipo: 'carsica', emoji: '🪨', nota: 'Il più profondo della Toscana' },
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
  const router = useRouter();
  const [regioneAttiva, setRegioneAttiva] = useState<string | null>(null);
  const [selectedTipo, setSelectedTipo] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-stone-950 text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/80 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Speleo</span><span className="text-emerald-400">Book</span>
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
            8 tipologie geologiche, 60+ grotte famose, 13 regioni. 
            L'Italia è uno dei paesi europei con la maggiore densità di cavità naturali.
          </p>
        </div>

        {/* ─── TABELLA TIPOLOGIE ─── */}
        <section className="mb-24">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">🗂️ Tipologie Geologiche</h2>
            {selectedTipo && (
              <button 
                onClick={() => setSelectedTipo(null)}
                className="text-emerald-400 hover:text-emerald-300 text-sm font-semibold transition-colors"
              >
                Mostra tutte le tipologie
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {TIPOLOGIE.map((t) => (
              <button 
                key={t.tipo} 
                onClick={() => {
                  setSelectedTipo(t.tipo === selectedTipo ? null : t.tipo);
                  if (t.tipo !== selectedTipo) {
                    document.getElementById('lista-regioni')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`group text-left bg-stone-900/50 border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${
                  selectedTipo === t.tipo 
                  ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-950/20' 
                  : cardBorder[t.colore]
                }`}
              >
                <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{t.emoji}</div>
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
              </button>
            ))}
          </div>
        </section>


        {/* ─── LISTA PER REGIONE ─── */}
        <section id="lista-regioni" className="mb-24 scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">📍 Grotte per Regione</h2>
              <p className="text-stone-400">
                {selectedTipo 
                  ? `Mostrando solo grotte di tipo "${selectedTipo.toUpperCase()}"` 
                  : 'Clicca su una regione o su una tipologia sopra per filtrare.'}
              </p>
            </div>
            {selectedTipo && (
              <span className={`px-4 py-2 rounded-full text-xs font-bold border flex items-center gap-2 ${coloriTipo[selectedTipo]}`}>
                Tipo: {selectedTipo.toUpperCase()}
              </span>
            )}
          </div>

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
            {REGIONI
              .filter(r => regioneAttiva === null || r.regione === regioneAttiva)
              .filter(r => selectedTipo === null || r.grotte.some(g => g.tipo === selectedTipo))
              .map((r) => {
                const grotteFiltrate = selectedTipo 
                  ? r.grotte.filter(g => g.tipo === selectedTipo)
                  : r.grotte;

                if (grotteFiltrate.length === 0) return null;

                return (
                  <div key={r.regione} className="bg-stone-900/50 border border-stone-800 rounded-3xl overflow-hidden animate-in fade-in duration-500 shadow-xl">
                    <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-950/30">
                      <h3 className="font-bold text-white flex items-center gap-2">
                        <span className="text-xl">{r.emoji}</span> {r.regione}
                      </h3>
                      {r.slug && (
                        <Link href={`/prenota/${r.slug}`} className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 transition-colors font-bold uppercase tracking-widest">
                          Esplora <ChevronRight size={14} />
                        </Link>
                      )}
                    </div>
                    <div className="max-h-[380px] overflow-y-auto custom-scrollbar divide-y divide-stone-800/50">
                      {grotteFiltrate.map((g) => (
                        <div 
                          key={g.nome} 
                          onClick={() => router.push(`/prenota/${r.slug}`)}
                          className="group/cave px-6 py-5 flex items-start gap-4 hover:bg-emerald-500/5 transition-all cursor-pointer relative overflow-hidden"
                        >
                          <span className="text-2xl shrink-0 group-hover/cave:scale-110 transition-transform">{g.emoji}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              <p className="font-bold text-white text-base group-hover/cave:text-emerald-400 transition-colors">{g.nome}</p>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize tracking-tight ${coloriTipo[g.tipo]}`}>
                                {g.tipo}
                              </span>
                            </div>
                            <p className="text-stone-400 text-xs leading-relaxed italic">{g.nota}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(g.nome + " " + r.regione)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="p-2.5 rounded-xl bg-stone-800/50 hover:bg-emerald-600 text-stone-400 hover:text-white transition-all shadow-lg border border-stone-700/50 relative z-10"
                              title="Apri in Google Maps"
                            >
                              <MapPin size={16} />
                            </a>
                            <div className="opacity-0 group-hover/cave:opacity-100 transition-opacity text-emerald-500">
                               <ChevronRight size={20} />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
          </div>
        </section>

        {/* ─── CTA ─── */}
        <div className="text-center bg-gradient-to-br from-emerald-950/60 to-stone-900/60 border border-emerald-900/30 rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl font-extrabold mb-4 text-white">Pronto per l&apos;esplorazione?</h2>
            <p className="text-stone-400 mb-10 max-w-lg mx-auto text-lg leading-relaxed">
              Il nostro sistema di prenotazione esclusiva ti garantisce la massima sicurezza e il rispetto delle norme ambientali.
            </p>
            <Link href="/prenota" className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-12 py-5 rounded-full transition-all hover:scale-105 shadow-xl shadow-emerald-500/25 text-lg">
              Prenota la tua Grotta <ChevronRight size={22} />
            </Link>
          </div>
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>

      </div>
    </div>
  );
}
