import { BookingFlow } from '@/components/booking/BookingFlow';
import { createClient } from '@/lib/supabase/server';
import { Grotta } from '@/types';
import Link from 'next/link';

// Dataset reale di grotte italiane suddivise per zona e tipologia
const MOCK_CAVES: Record<string, Grotta[]> = {
  calabria: [
    {
      id: 'cal-1', zona_id: '1', slug: 'abisso-del-bifurto', nome: 'Abisso del Bifurto',
      tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 683, lunghezza_mt: 1200,
      max_persone: 6, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Uno degli abissi carsici più profondi del Sud Italia nel Pollino. Richiede altissima competenza tecnica ed è riservato a speleologi esperti con esperienza in pozzi verticali.",
    },
    {
      id: 'cal-2', zona_id: '1', slug: 'grotta-delle-ninfe', nome: 'Grotta delle Ninfe',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 45, lunghezza_mt: 300,
      max_persone: 15, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Un percorso carsico incantevole adatto a tutti, con pozze d'acqua sulfurea e affascinanti formazioni stalattitiche millenarie.",
    },
    {
      id: 'cal-3', zona_id: '1', slug: 'grotta-del-romito', nome: 'Grotta del Romito',
      tipologia: 'carsica', difficolta: 'media', profondita_mt: 90, lunghezza_mt: 560,
      max_persone: 10, min_persone: 3,
      immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Celebre grotta carsica con incisioni rupestri paleolitiche, tra cui il famoso bos primigenius. Patrimonio storico e speleologico unico nel suo genere.",
    },
  ],
  puglia: [
    {
      id: 'pug-1', zona_id: '2', slug: 'grotte-di-castellana', nome: 'Grotte di Castellana',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 122, lunghezza_mt: 3348,
      max_persone: 50, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Il complesso carsico più famoso della Puglia. La maestosa 'Grotta Bianca' è definita la più splendente al mondo per la purezza delle sue formazioni calcaree.",
    },
    {
      id: 'pug-2', zona_id: '2', slug: 'grotta-della-zinzulusa', nome: 'Grotta della Zinzulusa',
      tipologia: 'marina', difficolta: 'facile', profondita_mt: 30, lunghezza_mt: 170,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Affascinante cavità marina a Castro, ricca di stalattiti e stalagmiti. Ospita acque salmastre dove convivono specie di fauna sotterranea endemica rarissima.",
    },
    {
      id: 'pug-3', zona_id: '2', slug: 'grotta-della-poesia', nome: 'Grotta della Poesia',
      tipologia: 'marina', difficolta: 'media', profondita_mt: 12, lunghezza_mt: 95,
      max_persone: 12, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Grotta marina a Roca Vecchia con migliaia di iscrizioni rupestri messapiche e micenee. Considerata uno dei siti epigrafici preistorici più importanti del Mediterraneo.",
    },
  ],
  sardegna: [
    {
      id: 'sar-1', zona_id: '3', slug: 'grotta-di-nettuno', nome: 'Grotta di Nettuno',
      tipologia: 'marina', difficolta: 'facile', profondita_mt: 10, lunghezza_mt: 2500,
      max_persone: 30, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'],
      descrizione: "La grotta marina più spettacolare della Sardegna, accessibile via mare o dalla famosa scalinata 'Escala del Cabirol' ad Alghero. Sale imponenti e laghi sotterranei.",
    },
    {
      id: 'sar-2', zona_id: '3', slug: 'grotta-del-bue-marino', nome: 'Grotta del Bue Marino',
      tipologia: 'marina', difficolta: 'media', profondita_mt: 15, lunghezza_mt: 3800,
      max_persone: 15, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Storico rifugio della foca monaca a Cala Gonone, visitabile in parte via mare. Le sue gallerie meravigliosamente decorate si estendono per quasi 4 km sotto la costa.",
    },
    {
      id: 'sar-3', zona_id: '3', slug: 'grotta-di-su-mannau', nome: 'Grotta di Su Mannau',
      tipologia: 'carsica', difficolta: 'media', profondita_mt: 70, lunghezza_mt: 8500,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Imponente sistema carsico a Fluminimaggiore con laghi sotterranei cristallini, fiumi e una delle collezioni di stalattiti più spettacolari della Sardegna.",
    },
    {
      id: 'sar-4', zona_id: '3', slug: 'grotta-di-su-marmuri', nome: 'Grotta di Su Marmuri',
      tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 35, lunghezza_mt: 850,
      max_persone: 20, min_persone: 3,
      immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Sale imponenti alte fino a 50 metri e sculture naturali titaniche a Ulassai. Definita 'la cattedrale del Supramonte', è tra le grotte carsiche più maestose d'Italia.",
    },
  ],
  friuli: [
    {
      id: 'fvg-1', zona_id: '4', slug: 'grotta-gigante', nome: 'Grotta Gigante',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 107, lunghezza_mt: 380,
      max_persone: 40, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Una delle cavità turistiche a sala unica più grandi al mondo nel Carso triestino. I pendoli sismoscopici al suo interno sono tra i più sensibili del pianeta.",
    },
    {
      id: 'fvg-2', zona_id: '4', slug: 'grotta-di-bossea', nome: 'Grotta di Bossea (collega Piemonte)',
      tipologia: 'carsica', difficolta: 'media', profondita_mt: 85, lunghezza_mt: 2000,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Sistema carsico con percorso lungo un torrente sotterraneo attivo. Le ricchissime concrezioni e i laghi verdi ne fanno una delle più belle del Nord Italia.",
    },
    {
      id: 'fvg-3', zona_id: '4', slug: 'grotta-del-vento-carso', nome: 'Abisso di Trebiciano',
      tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 329, lunghezza_mt: 720,
      max_persone: 6, min_persone: 3,
      immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Storico abisso carsico del Carso classico, dove scorre un ramo del fiume Timavo. Una delle cavità più importanti della storia della speleologia italiana ed europea.",
    },
    {
      id: 'fvg-4', zona_id: '4', slug: 'grotta-impossibile', nome: 'Grotta Impossibile',
      tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 50, lunghezza_mt: 3000,
      max_persone: 8, min_persone: 3,
      immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Scoperta durante i lavori autostradali, questa grotta triestina offre scenari mozzafiato con gallerie enormi e concrezioni intatte.",
    },
  ],
  sicilia: [
    {
      id: 'sic-1', zona_id: '5', slug: 'grotta-del-gelo', nome: 'Grotta del Gelo',
      tipologia: 'lavica', difficolta: 'difficile', profondita_mt: 40, lunghezza_mt: 200,
      max_persone: 8, min_persone: 3,
      immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Tubo di lava sull'Etna che custodisce un ghiacciaio perenne a 2.040 metri di quota. Un'anomalia climatica straordinaria.",
    },
    {
      id: 'sic-2', zona_id: '5', slug: 'grotta-dei-tre-livelli', nome: 'Grotta dei Tre Livelli',
      tipologia: 'lavica', difficolta: 'media', profondita_mt: 30, lunghezza_mt: 450,
      max_persone: 12, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Uno dei tubi di lava più lunghi dell'Etna, sviluppato su tre livelli sovrapposti. Morfologie vulcaniche di rara bellezza.",
    },
    {
      id: 'sic-3', zona_id: '5', slug: 'grotta-dei-lamponi', nome: 'Grotta dei Lamponi',
      tipologia: 'lavica', difficolta: 'facile', profondita_mt: 15, lunghezza_mt: 320,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Classico tubo di lava etneo, ideale per chi si avvicina alla speleologia vulcanica per la prima volta.",
    },
  ],
  campania: [
    {
      id: 'cam-1', zona_id: '6', slug: 'grotte-di-pertosa', nome: 'Grotte di Pertosa-Auletta',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 20, lunghezza_mt: 3000,
      max_persone: 30, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'],
      descrizione: "L'unico sito speleologico in Europa dove è possibile navigare un fiume sotterraneo verso il cuore della montagna.",
    },
    {
      id: 'cam-2', zona_id: '6', slug: 'grotta-dello-smeraldo', nome: 'Grotta dello Smeraldo',
      tipologia: 'marina', difficolta: 'facile', profondita_mt: 4, lunghezza_mt: 60,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Perla della Costiera Amalfitana, celebre per le sue stalagmiti sottomarine e i riflessi smeraldo dell'acqua.",
    },
  ],
  liguria: [
    {
      id: 'lig-1', zona_id: '7', slug: 'grotte-di-toirano', nome: 'Grotte di Toirano',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 25, lunghezza_mt: 1300,
      max_persone: 25, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Famosa per il 'Cimitero degli Orsi' e le impronte dell'uomo preistorico. Un viaggio nel tempo tra geologia e archeologia.",
    },
    {
      id: 'lig-2', zona_id: '7', slug: 'grotte-di-borgio-verezzi', nome: 'Grotte di Borgio Verezzi',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 15, lunghezza_mt: 800,
      max_persone: 20, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Le grotte più colorate d'Italia, grazie alla varietà di minerali che tingono le concrezioni di giallo, rosso e bianco.",
    },
  ],
  lombardia: [
    {
      id: 'lom-1', zona_id: '8', slug: 'grotta-di-ferrera', nome: 'Grotta di Ferrera (Buco del Frate)',
      tipologia: 'carsica', difficolta: 'media', profondita_mt: 15, lunghezza_mt: 500,
      max_persone: 10, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Situata vicino al Lago di Como, offre un percorso suggestivo tra ampie sale e strettoie tecniche.",
    },
    {
      id: 'lom-2', zona_id: '8', slug: 'grotte-di-rescia', nome: 'Grotte di Rescia',
      tipologia: 'carsica', difficolta: 'facile', profondita_mt: 10, lunghezza_mt: 400,
      max_persone: 15, min_persone: 2,
      immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'],
      descrizione: "Sette grotte unite in un unico percorso, caratterizzate da spettacolari cascate di travertino e formazioni attive.",
    },
  ],
};

export default async function ZonaPage({ params }: { params: Promise<{ zona: string }> }) {
  let caves: Grotta[] = [];
  const resolvedParams = await params;
  const { zona } = resolvedParams;

  const supabaseConfigured =
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseConfigured) {
    try {
      const supabase = await createClient();
      const { data: zonaData } = await supabase.from('zone').select('id').eq('slug', zona).single();

      if (zonaData) {
        const { data, error } = await supabase
          .from('grotte')
          .select('*')
          .eq('zona_id', zonaData.id)
          .eq('attiva', true);

        if (!error && data && data.length > 0) {
          caves = data;
        } else {
          caves = MOCK_CAVES[zona] || MOCK_CAVES['calabria'];
        }
      } else {
        caves = MOCK_CAVES[zona] || MOCK_CAVES['calabria'];
      }
    } catch {
      caves = MOCK_CAVES[zona] || MOCK_CAVES['calabria'];
    }
  } else {
    caves = MOCK_CAVES[zona] || MOCK_CAVES['calabria'];
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
          <Link href="/prenota" className="text-stone-400 hover:text-white text-sm transition-colors">
            ← Cambia Destinazione
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        <BookingFlow caves={caves} />
      </div>
    </div>
  );
}
