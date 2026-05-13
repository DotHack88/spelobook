import { BookingFlow } from '@/components/booking/BookingFlow';
import { createClient } from '@/lib/supabase/server';
import { Grotta } from '@/types';
import Link from 'next/link';

// Dataset reale di grotte italiane suddivise per zona e tipologia
const MOCK_CAVES: Record<string, Grotta[]> = {
  calabria: [
    { id: 'cal-1', zona_id: '1', slug: 'abisso-del-bifurto', nome: 'Abisso del Bifurto', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 683, lunghezza_mt: 1200, max_persone: 6, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Uno degli abissi carsici più profondi del Sud Italia nel Pollino." },
    { id: 'cal-2', zona_id: '1', slug: 'grotta-delle-ninfe', nome: 'Grotta delle Ninfe', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 45, lunghezza_mt: 300, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Percorso carsico con pozze d'acqua sulfurea." },
    { id: 'cal-3', zona_id: '1', slug: 'grotta-del-romito', nome: 'Grotta del Romito', tipologia: 'carsica', difficolta: 'media', profondita_mt: 90, lunghezza_mt: 560, max_persone: 10, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Famosa per le incisioni paleolitiche del bos primigenius." },
    { id: 'cal-4', zona_id: '1', slug: 'grotta-di-lamia', nome: 'Grotta di Lamia', tipologia: 'carsica', difficolta: 'media', profondita_mt: 30, lunghezza_mt: 400, max_persone: 8, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Cavità suggestiva con ampie sale concrezionate." },
    { id: 'cal-5', zona_id: '1', slug: 'grotta-del-fiume', nome: 'Grotta del Fiume Pollino', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 120, lunghezza_mt: 1500, max_persone: 6, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Complesso sistema attivo con scorrimento idrico perenne." },
  ],
  puglia: [
    { id: 'pug-1', zona_id: '2', slug: 'grotte-di-castellana', nome: 'Grotte di Castellana', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 122, lunghezza_mt: 3348, max_persone: 50, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Il complesso carsico più famoso della Puglia, con la splendida Grotta Bianca." },
    { id: 'pug-2', zona_id: '2', slug: 'grotta-della-zinzulusa', nome: 'Grotta della Zinzulusa', tipologia: 'marina', difficolta: 'facile', profondita_mt: 30, lunghezza_mt: 170, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'], descrizione: "Affascinante cavità marina a Castro, ricca di stalattiti." },
    { id: 'pug-3', zona_id: '2', slug: 'grotta-della-poesia', nome: 'Grotta della Poesia', tipologia: 'marina', difficolta: 'facile', profondita_mt: 12, lunghezza_mt: 95, max_persone: 12, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Cenote naturale sul mare con importanti iscrizioni antiche." },
    { id: 'pug-4', zona_id: '2', slug: 'grotta-palazzese', nome: 'Grotta Palazzese', tipologia: 'marina', difficolta: 'facile', profondita_mt: 5, lunghezza_mt: 50, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Iconica grotta marina a Polignano a Mare." },
    { id: 'pug-5', zona_id: '2', slug: 'abisso-di-rotolo', nome: 'Abisso di Rotolo', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 264, lunghezza_mt: 800, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "La grotta più profonda della Puglia, per speleologi esperti." },
  ],
  sardegna: [
    { id: 'sar-1', zona_id: '3', slug: 'grotta-di-nettuno', nome: 'Grotta di Nettuno', tipologia: 'marina', difficolta: 'facile', profondita_mt: 10, lunghezza_mt: 2500, max_persone: 30, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "La regina delle grotte marine sarde ad Alghero." },
    { id: 'sar-2', zona_id: '3', slug: 'grotta-del-bue-marino', nome: 'Grotta del Bue Marino', tipologia: 'marina', difficolta: 'facile', profondita_mt: 15, lunghezza_mt: 3800, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Splendido sistema costiero nel Golfo di Orosei." },
    { id: 'sar-3', zona_id: '3', slug: 'grotta-di-su-mannau', nome: 'Grotta di Su Mannau', tipologia: 'carsica', difficolta: 'media', profondita_mt: 70, lunghezza_mt: 8500, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Sistema complesso con fiumi sotterranei cristallini." },
    { id: 'sar-4', zona_id: '3', slug: 'grotta-di-su-marmuri', nome: 'Grotta di Su Marmuri', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 35, lunghezza_mt: 850, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Sale titaniche e concrezioni maestose a Ulassai." },
    { id: 'sar-5', zona_id: '3', slug: 'grotta-ispigoli', nome: 'Grotta di Ispinigoli', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 38, lunghezza_mt: 1000, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Contiene una delle colonne stalagmitiche più alte d'Europa (38m)." },
  ],
  friuli: [
    { id: 'fvg-1', zona_id: '4', slug: 'grotta-gigante', nome: 'Grotta Gigante', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 107, lunghezza_mt: 380, max_persone: 40, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "La sala unica più grande al mondo." },
    { id: 'fvg-2', zona_id: '4', slug: 'abisso-di-trebiciano', nome: 'Abisso di Trebiciano', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 329, lunghezza_mt: 720, max_persone: 6, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Storico abisso del Carso dove scorre il Timavo." },
    { id: 'fvg-3', zona_id: '4', slug: 'grotta-impossibile', nome: 'Grotta Impossibile', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 50, lunghezza_mt: 3000, max_persone: 8, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Enormi gallerie scoperte recentemente a Trieste." },
    { id: 'fvg-4', zona_id: '4', slug: 'grotta-nuova-villanova', nome: 'Grotta Nuova di Villanova', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 60, lunghezza_mt: 7000, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Suggestiva grotta di contatto nel cuore del Friuli." },
    { id: 'fvg-5', zona_id: '4', slug: 'grotta-doviza', nome: 'Grotta Doviza', tipologia: 'carsica', difficolta: 'media', profondita_mt: 40, lunghezza_mt: 1200, max_persone: 10, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'], descrizione: "Cavità ricca di fauna ipogea e ruscelli." },
  ],
  sicilia: [
    { id: 'sic-1', zona_id: '5', slug: 'grotta-del-gelo', nome: 'Grotta del Gelo', tipologia: 'lavica', difficolta: 'difficile', profondita_mt: 40, lunghezza_mt: 200, max_persone: 8, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Ghiacciaio perenne nel ventre dell'Etna." },
    { id: 'sic-2', zona_id: '5', slug: 'grotta-dei-tre-livelli', nome: 'Grotta dei Tre Livelli', tipologia: 'lavica', difficolta: 'media', profondita_mt: 30, lunghezza_mt: 450, max_persone: 12, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'], descrizione: "Tubo di lava complesso su più livelli." },
    { id: 'sic-3', zona_id: '5', slug: 'grotta-dei-lamponi', nome: 'Grotta dei Lamponi', tipologia: 'lavica', difficolta: 'facile', profondita_mt: 15, lunghezza_mt: 320, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Tubo di lava ideale per il primo approccio vulcanico." },
    { id: 'sic-4', zona_id: '5', slug: 'grotta-serracozzo', nome: 'Grotta di Serracozzo', tipologia: 'lavica', difficolta: 'media', profondita_mt: 20, lunghezza_mt: 350, max_persone: 10, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Splendido tunnel lavico con crollo terminale suggestivo." },
    { id: 'sic-5', zona_id: '5', slug: 'abisso-della-scinduta', nome: 'Abisso della Scinduta', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 150, lunghezza_mt: 600, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Pozzo carsico tecnico nelle Madonie." },
  ],
  campania: [
    { id: 'cam-1', zona_id: '6', slug: 'grotte-di-pertosa', nome: 'Grotte di Pertosa-Auletta', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 20, lunghezza_mt: 3000, max_persone: 30, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "L'unico sito speleologico navigabile in barca." },
    { id: 'cam-2', zona_id: '6', slug: 'grotta-dello-smeraldo', nome: 'Grotta dello Smeraldo', tipologia: 'marina', difficolta: 'facile', profondita_mt: 4, lunghezza_mt: 60, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Perla della Costiera Amalfitana con riflessi smeraldo." },
    { id: 'cam-3', zona_id: '6', slug: 'grotta-di-castelcivita', nome: 'Grotte di Castelcivita', tipologia: 'carsica', difficolta: 'media', profondita_mt: 50, lunghezza_mt: 4800, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Vasto complesso carsico alle porte del Cilento." },
    { id: 'cam-4', zona_id: '6', slug: 'grotta-azzurra-capri', nome: 'Grotta Azzurra', tipologia: 'marina', difficolta: 'facile', profondita_mt: 5, lunghezza_mt: 60, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "La grotta più famosa di Capri." },
    { id: 'cam-5', zona_id: '6', slug: 'grotta-del-melo', nome: 'Grotta del Melo', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 80, lunghezza_mt: 1200, max_persone: 6, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Cavità tecnica ricca di concrezioni attive." },
  ],
  liguria: [
    { id: 'lig-1', zona_id: '7', slug: 'grotte-di-toirano', nome: 'Grotte di Toirano', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 25, lunghezza_mt: 1300, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Famosa per l'orso delle caverne e impronte umane." },
    { id: 'lig-2', zona_id: '7', slug: 'grotte-di-borgio-verezzi', nome: 'Grotte di Borgio Verezzi', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 15, lunghezza_mt: 800, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Le grotte più colorate d'Italia." },
    { id: 'lig-3', zona_id: '7', slug: 'arma-di-taggia', nome: 'Arma di Taggia', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 5, lunghezza_mt: 100, max_persone: 30, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Sito archeologico e speleologico di rilievo." },
    { id: 'lig-4', zona_id: '7', slug: 'grotta-di-bergeggi', nome: 'Grotta Marina di Bergeggi', tipologia: 'marina', difficolta: 'media', profondita_mt: 10, lunghezza_mt: 150, max_persone: 10, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Grotta marina con reperti preistorici." },
    { id: 'lig-5', zona_id: '7', slug: 'abisso-delle-meraviglie', nome: 'Abisso delle Meraviglie', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 200, lunghezza_mt: 500, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Stretta e profonda cavità per speleologi tecnici." },
  ],
  lombardia: [
    { id: 'lom-1', zona_id: '8', slug: 'grotta-di-ferrera', nome: 'Grotta di Ferrera', tipologia: 'carsica', difficolta: 'media', profondita_mt: 15, lunghezza_mt: 500, max_persone: 10, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Suggestivo percorso vicino al Lago di Como." },
    { id: 'lom-2', zona_id: '8', slug: 'grotte-di-rescia', nome: 'Grotte di Rescia', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 10, lunghezza_mt: 400, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Sette grotte unite con cascate di travertino." },
    { id: 'lom-3', zona_id: '8', slug: 'bus-di-garibaldi', nome: 'Bus di Garibaldi', tipologia: 'carsica', difficolta: 'media', profondita_mt: 45, lunghezza_mt: 1000, max_persone: 12, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Grotta ricca di storia e leggende locali." },
    { id: 'lom-4', zona_id: '8', slug: 'grotta-di-remaron', nome: 'Grotta di Remaron', tipologia: 'carsica', difficolta: 'media', profondita_mt: 60, lunghezza_mt: 1500, max_persone: 8, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Importante sito carsico varesino." },
    { id: 'lom-5', zona_id: '8', slug: 'buco-del-frate', nome: 'Buco del Frate', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 20, lunghezza_mt: 350, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Perfetta per le prime esplorazioni didattiche." },
  ],
  marche: [
    { id: 'mar-1', zona_id: '9', slug: 'grotte-di-frasassi', nome: 'Grotte di Frasassi', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 150, lunghezza_mt: 30000, max_persone: 50, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "L'Abisso Ancona potrebbe contenere il Duomo di Milano." },
    { id: 'mar-2', zona_id: '9', slug: 'grotta-del-vernino', nome: 'Grotta del Vernino', tipologia: 'carsica', difficolta: 'media', profondita_mt: 60, lunghezza_mt: 1800, max_persone: 12, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Affascinante cavità nell'Appennino marchigiano." },
    { id: 'mar-3', zona_id: '9', slug: 'grotta-di-monte-cucco', nome: 'Grotta di Monte Cucco', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 922, lunghezza_mt: 35000, max_persone: 8, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Uno dei sistemi carsici più profondi d'Italia." },
    { id: 'mar-4', zona_id: '9', slug: 'grotta-del-fiume-frasassi', nome: 'Grotta del Fiume', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 100, lunghezza_mt: 15000, max_persone: 6, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Percorso avventuroso lungo il fiume ipogeo." },
    { id: 'mar-5', zona_id: '9', slug: 'abisso-di-faggeto', nome: 'Abisso di Faggeto', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 300, lunghezza_mt: 2000, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'], descrizione: "Cavità tecnica verticale impegnativa." },
  ],
  lazio: [
    { id: 'laz-1', zona_id: '10', slug: 'grotte-di-pastena', nome: 'Grotte di Pastena', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 40, lunghezza_mt: 3000, max_persone: 30, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&q=80&w=800'], descrizione: "Sito straordinario con cascate e fiumi ipogei." },
    { id: 'laz-2', zona_id: '10', slug: 'grotta-di-collepardo', nome: 'Grotta di Collepardo', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 30, lunghezza_mt: 600, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Definita 'La Regina' per la maestosità delle sue sale." },
    { id: 'laz-3', zona_id: '10', slug: 'pozzo-del-merro', nome: 'Pozzo del Merro', tipologia: 'tettonica', difficolta: 'esperta', profondita_mt: 392, lunghezza_mt: 400, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Il sinkhole allagato più profondo al mondo." },
    { id: 'laz-4', zona_id: '10', slug: 'grotta-di-ciccio-felice', nome: 'Grotta di Ciccio Felice', tipologia: 'carsica', difficolta: 'media', profondita_mt: 20, lunghezza_mt: 450, max_persone: 12, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Importante sito per reperti dell'età del bronzo." },
    { id: 'laz-5', zona_id: '10', slug: 'grotta-guattari', nome: 'Grotta Guattari', tipologia: 'marina', difficolta: 'media', profondita_mt: 10, lunghezza_mt: 80, max_persone: 8, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Famosa per il ritrovamento di un cranio neandertaliano." },
  ],
  toscana: [
    { id: 'tos-1', zona_id: '11', slug: 'grotta-del-vento', nome: 'Grotta del Vento', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 120, lunghezza_mt: 4500, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Sito icone in Garfagnana con tre diversi itinerari." },
    { id: 'tos-2', zona_id: '11', slug: 'antro-del-corchia', nome: 'Antro del Corchia', tipologia: 'carsica', difficolta: 'media', profondita_mt: 1187, lunghezza_mt: 70000, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Uno dei sistemi ipogei più vasti d'Europa." },
    { id: 'tos-3', zona_id: '11', slug: 'grotta-giusti', nome: 'Grotta Giusti', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 50, lunghezza_mt: 300, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&q=80&w=800'], descrizione: "Famosa per le sue proprietà termali e il lago ipogeo." },
    { id: 'tos-4', zona_id: '11', slug: 'grotta-del-maona', nome: 'Grotta del Maona', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 20, lunghezza_mt: 200, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Unica grotta in Italia con due pozzi di entrata e uscita." },
    { id: 'tos-5', zona_id: '11', slug: 'abisso-olivifer', nome: 'Abisso Olivifer', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 1215, lunghezza_mt: 5000, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "L'abisso più profondo della Toscana." },
  ],
  piemonte: [
    { id: 'pie-1', zona_id: '12', slug: 'grotta-di-bossea', nome: 'Grotta di Bossea', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 85, lunghezza_mt: 2000, max_persone: 25, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Tra le più belle e importanti d'Italia." },
    { id: 'pie-2', zona_id: '12', slug: 'grotte-di-caudano', nome: 'Grotte di Caudano', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 30, lunghezza_mt: 3000, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?auto=format&fit=crop&q=80&w=800'], descrizione: "Vasto complesso carsico nel cuneese." },
    { id: 'pie-3', zona_id: '12', slug: 'abisso-fighiera', nome: 'Abisso Fighiera', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 1100, lunghezza_mt: 20000, max_persone: 4, min_persone: 3, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Abisso tecnico di altissima difficoltà." },
    { id: 'pie-4', zona_id: '12', slug: 'buco-della-piastra', nome: 'Buco della Piastra', tipologia: 'carsica', difficolta: 'media', profondita_mt: 40, lunghezza_mt: 600, max_persone: 10, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Suggestiva cavità con ampi saloni." },
    { id: 'pie-5', zona_id: '12', slug: 'grotta-di-rio-martino', nome: 'Grotta di Rio Martino', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 100, lunghezza_mt: 3000, max_persone: 6, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Percorso con cascate ipogee spettacolari." },
  ],
  abruzzo: [
    { id: 'abr-1', zona_id: '13', slug: 'grotte-di-stiffe', nome: 'Grotte di Stiffe', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 30, lunghezza_mt: 1000, max_persone: 30, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1515238152791-8216bfdf89a7?auto=format&fit=crop&q=80&w=800'], descrizione: "Risorgenza attiva unica nel cuore dell'Appennino." },
    { id: 'abr-2', zona_id: '13', slug: 'grotta-del-cavallone', nome: 'Grotta del Cavallone', tipologia: 'carsica', difficolta: 'media', profondita_mt: 150, lunghezza_mt: 2000, max_persone: 15, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1576435728678-68d0fbf94946?auto=format&fit=crop&q=80&w=800'], descrizione: "Resa famosa da D'Annunzio, offre panorami mozzafiato." },
    { id: 'abr-3', zona_id: '13', slug: 'grotta-delle-fiamme-gialle', nome: 'Grotta delle Fiamme Gialle', tipologia: 'carsica', difficolta: 'difficile', profondita_mt: 100, lunghezza_mt: 1200, max_persone: 8, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'], descrizione: "Cavità tecnica ricca di pozzi verticali." },
    { id: 'abr-4', zona_id: '13', slug: 'abisso-del-bivacco', nome: 'Abisso del Bivacco', tipologia: 'carsica', difficolta: 'esperta', profondita_mt: 400, lunghezza_mt: 1500, max_persone: 4, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800'], descrizione: "Profondo abisso nella Maiella." },
    { id: 'abr-5', zona_id: '13', slug: 'grotta-di-beatrice-cenci', nome: 'Grotta di Beatrice Cenci', tipologia: 'carsica', difficolta: 'facile', profondita_mt: 20, lunghezza_mt: 350, max_persone: 20, min_persone: 2, immagini: ['https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'], descrizione: "Piccola e suggestiva grotta con reperti storici." },
  ],
};ive.",
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
