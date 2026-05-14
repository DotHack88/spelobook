import { StepIndicator } from '@/components/booking/StepIndicator';
import { BookingSearchBar } from '@/components/booking/BookingSearchBar';
import { createClient } from '@/lib/supabase/server';
import { Zona, Grotta } from '@/types';
import Link from 'next/link';

// Helper per generare technical mock data
const tech = (slug: string, nome: string) => ({
  id: slug,
  slug,
  nome,
  tipologia: 'carsica' as const,
  orientamento: 'orizzontale' as const,
  profondita_mt: 50,
  lunghezza_mt: 500,
  min_persone: 2,
  immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'],
  descrizione: `Esplora la meravigliosa ${nome}, un gioiello naturale italiano.`
});

const ALL_MOCK_CAVES: Record<string, Grotta[]> = {
  abruzzo: [
    { ...tech('grotte-di-stiffe', 'Grotte di Stiffe'), zona_id: '13' },
    { ...tech('grotta-del-cavallone', 'Grotta del Cavallone'), zona_id: '13' },
    { ...tech('fiamme-gialle', 'Fiamme Gialle'), zona_id: '13' },
    { ...tech('abisso-del-bivacco', 'Abisso del Bivacco'), zona_id: '13' },
    { ...tech('beatrice-cenci', 'Beatrice Cenci'), zona_id: '13' },
  ],
  calabria: [
    { ...tech('abisso-del-bifurto', 'Abisso del Bifurto'), zona_id: '1' },
    { ...tech('grotta-delle-ninfe', 'Grotta delle Ninfe'), zona_id: '1' },
    { ...tech('grotta-del-romito', 'Grotta del Romito'), zona_id: '1' },
    { ...tech('grotta-di-lamia', 'Grotta di Lamia'), zona_id: '1' },
    { ...tech('grotta-del-fiume', 'Grotta del Fiume'), zona_id: '1' },
  ],
  campania: [
    { ...tech('grotte-di-pertosa', 'Grotte di Pertosa'), zona_id: '6' },
    { ...tech('grotta-dello-smeraldo', 'Grotta dello Smeraldo'), zona_id: '6', tipologia: 'marina' },
    { ...tech('grotte-di-castelcivita', 'Grotte di Castelcivita'), zona_id: '6' },
    { ...tech('grotta-azzurra-capri', 'Grotta Azzurra (Capri)'), zona_id: '6', tipologia: 'marina' },
    { ...tech('grotta-del-melo', 'Grotta del Melo'), zona_id: '6' },
  ],
  friuli: [
    { ...tech('grotta-gigante', 'Grotta Gigante'), zona_id: '4' },
    { ...tech('abisso-di-trebiciano', 'Abisso di Trebiciano'), zona_id: '4' },
    { ...tech('grotta-impossibile', 'Grotta Impossibile'), zona_id: '4' },
    { ...tech('grotta-di-villanova', 'Grotta di Villanova'), zona_id: '4' },
    { ...tech('grotta-doviza', 'Grotta Doviza'), zona_id: '4' },
  ],
  lazio: [
    { ...tech('grotte-di-pastena', 'Grotte di Pastena'), zona_id: '10' },
    { ...tech('grotta-di-collepardo', 'Grotta di Collepardo'), zona_id: '10' },
    { ...tech('pozzo-del-merro', 'Pozzo del Merro'), zona_id: '10' },
    { ...tech('grotta-ciccio-felice', 'Grotta Ciccio Felice'), zona_id: '10' },
    { ...tech('grotta-guattari', 'Grotta Guattari'), zona_id: '10', tipologia: 'marina' },
  ],
  liguria: [
    { ...tech('grotte-di-toirano', 'Grotte di Toirano'), zona_id: '7' },
    { ...tech('grotte-di-borgio-verezzi', 'Grotte di Borgio Verezzi'), zona_id: '7' },
    { ...tech('arma-di-taggia', 'Arma di Taggia'), zona_id: '7' },
    { ...tech('grotta-di-bergeggi', 'Grotta di Bergeggi'), zona_id: '7', tipologia: 'marina' },
    { ...tech('abisso-meraviglie', 'Abisso Meraviglie'), zona_id: '7' },
  ],
  lombardia: [
    { ...tech('grotta-di-ferrera', 'Grotta di Ferrera'), zona_id: '8' },
    { ...tech('grotte-di-rescia', 'Grotte di Rescia'), zona_id: '8' },
    { ...tech('bus-di-garibaldi', 'Bus di Garibaldi'), zona_id: '8' },
    { ...tech('grotta-di-remaron', 'Grotta di Remaron'), zona_id: '8' },
    { ...tech('buco-del-frate', 'Buco del Frate'), zona_id: '8' },
  ],
  marche: [
    { ...tech('grotte-di-frasassi', 'Grotte di Frasassi'), zona_id: '9' },
    { ...tech('grotta-del-vernino', 'Grotta del Vernino'), zona_id: '9' },
    { ...tech('grotta-di-monte-cucco', 'Grotta di Monte Cucco'), zona_id: '9' },
    { ...tech('grotta-del-fiume-marche', 'Grotta del Fiume'), zona_id: '9' },
    { ...tech('abisso-di-faggeto', 'Abisso di Faggeto'), zona_id: '9' },
  ],
  piemonte: [
    { ...tech('grotta-di-bossea', 'Grotta di Bossea'), zona_id: '12' },
    { ...tech('grotte-di-caudano', 'Grotte di Caudano'), zona_id: '12' },
    { ...tech('abisso-fighiera', 'Abisso Fighiera'), zona_id: '12' },
    { ...tech('buco-della-piastra', 'Buco della Piastra'), zona_id: '12' },
    { ...tech('rio-martino', 'Rio Martino'), zona_id: '12' },
  ],
  puglia: [
    { ...tech('grotte-di-castellana', 'Grotte di Castellana'), zona_id: '2' },
    { ...tech('grotta-della-zinzulusa', 'Grotta della Zinzulusa'), zona_id: '2', tipologia: 'marina' },
    { ...tech('grotta-della-poesia', 'Grotta della Poesia'), zona_id: '2', tipologia: 'marina' },
    { ...tech('grotta-palazzese', 'Grotta Palazzese'), zona_id: '2', tipologia: 'marina' },
    { ...tech('abisso-di-rotolo', 'Abisso di Rotolo'), zona_id: '2' },
  ],
  sardegna: [
    { ...tech('grotta-di-nettuno', 'Grotta di Nettuno'), zona_id: '3', tipologia: 'marina' },
    { ...tech('grotta-del-bue-marino', 'Grotta del Bue Marino'), zona_id: '3', tipologia: 'marina' },
    { ...tech('grotta-di-su-mannau', 'Grotta di Su Mannau'), zona_id: '3' },
    { ...tech('grotta-di-su-marmuri', 'Grotta di Su Marmuri'), zona_id: '3' },
    { ...tech('grotta-ispigoli', 'Grotta di Ispinigoli'), zona_id: '3' },
  ],
  sicilia: [
    { ...tech('grotta-del-gelo', 'Grotta del Gelo'), zona_id: '5', tipologia: 'lavica' },
    { ...tech('grotta-dei-tre-livelli', 'Grotta dei Tre Livelli'), zona_id: '5', tipologia: 'lavica' },
    { ...tech('grotta-dei-lamponi', 'Grotta dei Lamponi'), zona_id: '5', tipologia: 'lavica' },
    { ...tech('grotta-serracozzo', 'Grotta di Serracozzo'), zona_id: '5', tipologia: 'lavica' },
    { ...tech('abisso-scinduta', 'Abisso della Scinduta'), zona_id: '5' },
  ],
  toscana: [
    { ...tech('grotta-del-vento', 'Grotta del Vento'), zona_id: '11' },
    { ...tech('antro-del-corchia', 'Antro del Corchia'), zona_id: '11' },
    { ...tech('grotta-giusti', 'Grotta Giusti'), zona_id: '11' },
    { ...tech('grotta-del-maona', 'Grotta del Maona'), zona_id: '11' },
    { ...tech('grotte-di-equi-terme', 'Grotte di Equi Terme'), zona_id: '11' },
    { ...tech('abisso-olivifer', 'Abisso Olivifer'), zona_id: '11' },
  ],
};

const MOCK_ZONES: Zona[] = [
  { id: '13', nome: 'Grotte d\'Abruzzo', regione: 'Abruzzo', slug: 'abruzzo', descrizione: 'Il cuore selvaggio dell\'Appennino.', immagine_url: '...' },
  { id: '1', nome: 'Grotte della Calabria', regione: 'Calabria', slug: 'calabria', descrizione: 'Abissi vertiginosi nel Pollino.', immagine_url: '...' },
  { id: '6', nome: 'Grotte della Campania', regione: 'Campania', slug: 'campania', descrizione: 'Mix unico di carsismo e mare.', immagine_url: '...' },
  { id: '4', nome: 'Carso di Friuli-VG', regione: 'Friuli-Venezia Giulia', slug: 'friuli', descrizione: 'La culla della speleologia.', immagine_url: '...' },
  { id: '10', nome: 'Grotte del Lazio', regione: 'Lazio', slug: 'lazio', descrizione: 'Cultura e natura ipogea.', immagine_url: '...' },
  { id: '7', nome: 'Grotte della Liguria', regione: 'Liguria', slug: 'liguria', descrizione: 'Grotte marine e preistoria.', immagine_url: '...' },
  { id: '8', nome: 'Prealpi Lombarde', regione: 'Lombardia', slug: 'lombardia', descrizione: 'Vette e abissi.', immagine_url: '...' },
  { id: '9', nome: 'Grotte delle Marche', regione: 'Marche', slug: 'marche', descrizione: 'Il maestoso complesso di Frasassi.', immagine_url: '...' },
  { id: '12', nome: 'Alpi Piemontesi', regione: 'Piemonte', slug: 'piemonte', descrizione: 'Speleologia alpina.', immagine_url: '...' },
  { id: '2', nome: 'Grotte di Puglia', regione: 'Puglia', slug: 'puglia', descrizione: 'Grotte carsiche e marine.', immagine_url: '...' },
  { id: '3', nome: 'Sardegna Sotterranea', regione: 'Sardegna', slug: 'sardegna', descrizione: 'Un mondo sotterraneo straordinario.', immagine_url: '...' },
  { id: '5', nome: 'Grotte dell\'Etna', regione: 'Sicilia', slug: 'sicilia', descrizione: 'Speleologia vulcanica.', immagine_url: '...' },
  { id: '11', nome: 'Speleologia Toscana', regione: 'Toscana', slug: 'toscana', descrizione: 'Dalle Alpi Apuane al Monte Amiata.', immagine_url: '...' },
];

export default async function PrenotaPage() {
  let zones: Zona[] = MOCK_ZONES;
  let allCaves: Record<string, Grotta[]> = ALL_MOCK_CAVES;

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-stone-950/70 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Speleo</span>
            <span className="text-emerald-400">Book</span>
          </Link>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-32 flex flex-col items-center justify-center min-h-[80vh]">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-6xl md:text-8xl font-black bg-clip-text text-transparent bg-gradient-to-br from-emerald-400 via-teal-300 to-cyan-500 pb-2 tracking-tighter uppercase">
            Prenota ora
          </h1>
          <p className="text-stone-500 text-xl md:text-2xl max-w-2xl mx-auto font-medium tracking-tight">
            Il portale unico per le tue esplorazioni speleologiche certificate.
          </p>

          {/* User Request: Move StepIndicator here */}
          <div className="pt-4 flex justify-center">
             <div className="opacity-70 scale-90">
               <StepIndicator currentStep={1} />
             </div>
          </div>
        </div>

        {/* Search Bar Section */}
        <div className="w-full mb-16">
          <BookingSearchBar zones={zones} allCaves={allCaves} />
        </div>
      </div>

      <footer className="py-10 text-center border-t border-stone-900/50">
         <p className="text-stone-700 text-[10px] font-bold uppercase tracking-[0.3em]">SpeleoBook — Demo Version</p>
      </footer>
    </div>
  );
}
