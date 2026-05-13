import { StepIndicator } from '@/components/booking/StepIndicator';
import { ZoneSelector } from '@/components/booking/ZoneSelector';
import { createClient } from '@/lib/supabase/server';
import { Zona } from '@/types';
import Link from 'next/link';

// Dati mock premium per il fallback
const MOCK_ZONES: Zona[] = [
  {
    id: '1',
    nome: 'Grotte della Calabria',
    regione: 'Calabria',
    slug: 'calabria',
    descrizione: 'Sistemi carsici tra i più profondi del Sud Italia. Abissi vertiginosi, fiumi sotterranei e formazioni stalattitiche millenarie nel cuore del Pollino.',
    immagine_url: 'https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '2',
    nome: 'Grotte di Puglia',
    regione: 'Puglia',
    slug: 'puglia',
    descrizione: 'Grotte carsiche e marine lungo la costa adriatica e ionica. Castellana, Zinzulusa e la Grotta della Poesia: tre esperienze uniche in un\'unica regione.',
    immagine_url: 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '3',
    nome: 'Sardegna Sotterranea',
    regione: 'Sardegna',
    slug: 'sardegna',
    descrizione: 'Sistemi carsici unici e grotte marine tra le più belle del Mediterraneo. Da Nettuno al Bue Marino, la Sardegna nasconde un mondo sotterraneo straordinario.',
    immagine_url: 'https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '4',
    nome: 'Carso di Friuli-VG',
    regione: 'Friuli-Venezia Giulia',
    slug: 'friuli',
    descrizione: 'La culla della speleologia italiana. La Grotta Gigante e l\'Abisso di Trebiciano sono tra le cavità carsiche più importanti e studiate al mondo.',
    immagine_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '5',
    nome: 'Grotte dell\'Etna',
    regione: 'Sicilia',
    slug: 'sicilia',
    descrizione: 'L\'unica destinazione italiana per la speleologia vulcanica. Tubi di lava, ghiacciai perenni e grotte marine di Capri: esperienze uniche al mondo sull\'Etna.',
    immagine_url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '6',
    nome: 'Grotte della Campania',
    regione: 'Campania',
    slug: 'campania',
    descrizione: 'Dal fiume sotterraneo di Pertosa alle cavità marine della Costiera. La Campania offre un mix unico di speleologia carsica e archeologia sotterranea.',
    immagine_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '7',
    nome: 'Speleologia Ligure',
    regione: 'Liguria',
    slug: 'liguria',
    descrizione: 'Grotte affacciate sul mare e sistemi carsici millenari. Le Grotte di Toirano e Borgio Verezzi sono icone del turismo speleologico internazionale.',
    immagine_url: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '8',
    nome: 'Sottosuolo Lombardo',
    regione: 'Lombardia',
    slug: 'lombardia',
    descrizione: 'Esplora le profondità delle Prealpi e delle zone lacustri. Dai sistemi carsici del Buco del Frate alle formazioni glaciali alpine.',
    immagine_url: 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '9',
    nome: 'Grotte delle Marche',
    regione: 'Marche',
    slug: 'marche',
    descrizione: 'Custode delle Grotte di Frasassi, uno dei complessi ipogei più maestosi al mondo. Un viaggio unico nel "ventre della terra".',
    immagine_url: 'https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '10',
    nome: 'Sotterranei del Lazio',
    regione: 'Lazio',
    slug: 'lazio',
    descrizione: 'Dalle Grotte di Pastena ai pozzi tettonici più profondi. Un territorio ricco di storia sotterranea e formazioni geologiche uniche.',
    immagine_url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '11',
    nome: 'Speleologia Toscana',
    regione: 'Toscana',
    slug: 'toscana',
    descrizione: 'Dalle Alpi Apuane al Monte Amiata. La Grotta del Vento e l\'Antro del Corchia sono perle della speleologia mondiale.',
    immagine_url: 'https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '12',
    nome: 'Abissi del Piemonte',
    regione: 'Piemonte',
    slug: 'piemonte',
    descrizione: 'Sistemi carsici alpini di straordinaria bellezza. La Grotta di Bossea e i grandi abissi delle Alpi Marittime.',
    immagine_url: 'https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: '13',
    nome: 'Grotte d\'Abruzzo',
    regione: 'Abruzzo',
    slug: 'abruzzo',
    descrizione: 'Il cuore selvaggio dell\'Appennino. Le Grotte di Stiffe, con il loro torrente sotterraneo, sono uniche in Italia.',
    immagine_url: 'https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'
  },
];

export default async function PrenotaPage() {
  let zones: Zona[] = [];

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from('zone')
        .select('*')
        .eq('attiva', true);

      if (!error && data && data.length > 0) {
        zones = data;
      } else {
        zones = MOCK_ZONES;
      }
    } catch {
      zones = MOCK_ZONES;
    }
  } else {
    zones = MOCK_ZONES;
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/70 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Spelo</span>
            <span className="text-emerald-400">Book</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-500 pb-2 tracking-tight">
            Inizia l'Avventura
          </h1>
          <p className="text-stone-400 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Seleziona la tua prossima destinazione speleologica. Scegli tra le meraviglie carsiche più affascinanti d'Italia.
          </p>
        </div>

        {/* Step Progress */}
        <div className="mb-16">
          <StepIndicator currentStep={1} />
        </div>

        {/* Zone Selector Grid */}
        <div className="pb-24">
          <ZoneSelector zones={zones} />
        </div>
      </div>
    </div>
  );
}
