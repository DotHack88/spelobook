-- SCHEMA PER SPELOBOOK
-- Esegui questo script nell'Editor SQL di Supabase

-- 1. Tabella Zone
CREATE TABLE IF NOT EXISTS public.zone (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    regione TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descrizione TEXT,
    immagine_url TEXT,
    attiva BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabella Grotte
CREATE TABLE IF NOT EXISTS public.grotte (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    zona_id UUID REFERENCES public.zone(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    descrizione TEXT,
    difficolta TEXT CHECK (difficolta IN ('facile', 'media', 'difficile', 'esperta')),
    tipologia TEXT CHECK (tipologia IN ('carsica', 'lavica', 'marina', 'glaciale', 'tettonica', 'eolica', 'crollo', 'artificiale')),
    profondita_mt INTEGER,
    lunghezza_mt INTEGER,
    max_persone INTEGER NOT NULL,
    min_persone INTEGER DEFAULT 1,
    immagini TEXT[] DEFAULT '{}',
    attrezzatura_richiesta TEXT,
    note_sicurezza TEXT,
    attiva BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabella Prenotazioni
CREATE TABLE IF NOT EXISTS public.prenotazioni (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grotta_id UUID REFERENCES public.grotte(id) ON DELETE CASCADE,
    codice_prenotazione TEXT UNIQUE,
    data_checkin DATE NOT NULL,
    data_checkout DATE NOT NULL,
    nome_gruppo TEXT NOT NULL,
    num_persone INTEGER NOT NULL,
    referente_nome TEXT NOT NULL,
    referente_cognome TEXT NOT NULL,
    referente_telefono TEXT NOT NULL,
    referente_email TEXT NOT NULL,
    referente2_nome TEXT,
    referente2_cognome TEXT,
    referente2_telefono TEXT,
    referente2_email TEXT,
    esperienza_dichiarata TEXT,
    note TEXT,
    stato TEXT DEFAULT 'in_attesa' CHECK (stato IN ('in_attesa', 'confermata', 'rifiutata', 'cancellata')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Funzione per generare codice prenotazione automatico (es. SPELO-A7B2X1)
CREATE OR REPLACE FUNCTION generate_booking_code()
RETURNS TRIGGER AS $$
BEGIN
    NEW.codice_prenotazione := 'SPELO-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 6));
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Trigger per codice prenotazione
CREATE TRIGGER tr_generate_booking_code
BEFORE INSERT ON public.prenotazioni
FOR EACH ROW
EXECUTE FUNCTION generate_booking_code();

-- 6. Dati Iniziali (Opzionali)
-- Inserire qui le zone principali
INSERT INTO public.zone (nome, regione, slug, descrizione, immagine_url) VALUES
('Grotte della Calabria', 'Calabria', 'calabria', 'Sistemi carsici tra i più profondi d''Italia.', 'https://images.unsplash.com/photo-1518331566838-898ea6f6631f?auto=format&fit=crop&q=80&w=800'),
('Grotte di Puglia', 'Puglia', 'puglia', 'Grotte carsiche e marine lungo la costa.', 'https://images.unsplash.com/photo-1499578124509-1611b77778c8?auto=format&fit=crop&q=80&w=800'),
('Sardegna Sotterranea', 'Sardegna', 'sardegna', 'Sistemi carsici unici e grotte marine spettacolari.', 'https://images.unsplash.com/photo-1599320502120-e4b77f98e169?auto=format&fit=crop&q=80&w=800');
