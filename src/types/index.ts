export type Difficolta = 'facile' | 'media' | 'difficile' | 'esperta';
export type StatoPrenotazione = 'in_attesa' | 'confermata' | 'rifiutata' | 'cancellata';
export type TipologiaGrotta =
  | 'carsica'
  | 'lavica'
  | 'marina'
  | 'glaciale'
  | 'tettonica'
  | 'eolica'
  | 'crollo'
  | 'artificiale';

export interface Zona {
  id: string;
  nome: string;
  regione: string;
  slug: string;
  descrizione?: string;
  immagine_url?: string;
}

export interface Grotta {
  id: string;
  zona_id: string;
  nome: string;
  slug: string;
  descrizione?: string;
  difficolta: Difficolta;
  tipologia?: TipologiaGrotta;
  profondita_mt?: number;
  lunghezza_mt?: number;
  max_persone: number;
  min_persone: number;
  immagini: string[];
  mappa_url?: string;
  attrezzatura_richiesta?: string;
  note_sicurezza?: string;
  zona?: Zona;
}

export interface Referente {
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
}

export interface PrenotazioneInput {
  grotta_id: string;
  data_checkin: string;        // formato ISO: "2025-08-15"
  data_checkout: string;
  nome_gruppo: string;
  num_persone: number;
  referente: Referente;
  referente2?: Partial<Referente>;
  note?: string;
  esperienza_dichiarata?: string;
}

export interface Prenotazione extends PrenotazioneInput {
  id: string;
  stato: StatoPrenotazione;
  codice_prenotazione: string;
  created_at: string;
  grotta?: Grotta;
}

// Stato globale del flusso multi-step
export interface BookingState {
  zona?: Zona;
  grotta?: Grotta;
  dateRange?: { from: Date; to: Date };
  gruppo?: {
    nome_gruppo: string;
    num_persone: number;
    referente: Referente;
    referente2?: Partial<Referente>;
    note?: string;
    esperienza_dichiarata?: string;
  };
}
