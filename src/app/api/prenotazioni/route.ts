export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { fullBookingSchema } from '@/lib/validations/booking';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Usa /tmp in produzione (Vercel) perché il file system è di sola lettura, altrimenti usa /data locale
const DATA_FILE = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'prenotazioni.json')
  : path.join(process.cwd(), 'data', 'prenotazioni.json');

// Assicurati che la cartella data esista
function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

function getLocalBookings() {
  ensureDataDir();
  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(fileContent);
}

function saveLocalBooking(booking: any) {
  const bookings = getLocalBookings();
  bookings.push(booking);
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    const supabase = await createClient();

    let query = supabase.from('prenotazioni').select('*').order('created_at', { ascending: false });
    if (email) {
      query = query.eq('referente_email', email);
    }

    const { data: bookings, error } = await query;

    if (error) throw error;

    return NextResponse.json(bookings);
  } catch (err: any) {
    if (err.message?.includes('Supabase non configurato')) {
      // Fallback a dati locali
      const { searchParams } = new URL(req.url);
      const email = searchParams.get('email');

      let localBookings = getLocalBookings();
      if (email) {
        localBookings = localBookings.filter((b: any) => b.referente_email === email);
      }
      return NextResponse.json(localBookings);
    }
    console.error('Errore recupero prenotazioni:', err);
    return NextResponse.json([], { status: 200 }); // Return empty array on error for safety
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = fullBookingSchema.safeParse(body);

    if (!parsed.success) {
      console.error('ERRORE VALIDAZIONE:', parsed.error.format());
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const data = parsed.data;

    try {
      const supabase = await createClient();

      // Controllo disponibilità: verifica che non ci siano sovrapposizioni
      const { data: conflitti } = await supabase
        .from('prenotazioni')
        .select('id')
        .eq('grotta_id', data.grotta_id)
        .in('stato', ['in_attesa', 'confermata'])
        .or(`data_checkin.lte.${data.data_checkout},data_checkout.gte.${data.data_checkin}`);

      if (conflitti && conflitti.length > 0) {
        return NextResponse.json(
          { error: 'La grotta non è disponibile nelle date selezionate' },
          { status: 409 }
        );
      }

      // Inserimento prenotazione
      const { data: prenotazione, error } = await supabase
        .from('prenotazioni')
        .insert({
          grotta_id: data.grotta_id,
          data_checkin: data.data_checkin,
          data_checkout: data.data_checkout,
          fascia_oraria: data.fascia_oraria,
          nome_gruppo: data.nome_gruppo,
          num_persone: data.num_persone,
          referente_nome: data.referente.nome,
          referente_cognome: data.referente.cognome,
          referente_telefono: data.referente.telefono,
          referente_email: data.referente.email,
          note: data.note,
        })
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        success: true,
        codice: prenotazione.codice_prenotazione,
        id: prenotazione.id,
      }, { status: 201 });

    } catch (err: any) {
      // Se Supabase non è configurato, salviamo localmente per testare la UI
      if (err.message?.includes('Supabase non configurato')) {
        const id = Math.random().toString(36).substring(2, 9);
        const codice = `SPELO-${id.toUpperCase()}-DEMO`;
        const localBooking = {
          id,
          codice_prenotazione: codice,
          grotta_id: data.grotta_id,
          data_checkin: data.data_checkin,
          data_checkout: data.data_checkout,
          fascia_oraria: data.fascia_oraria,
          nome_gruppo: data.nome_gruppo,
          num_persone: data.num_persone,
          referente_nome: data.referente.nome,
          referente_cognome: data.referente.cognome,
          referente_telefono: data.referente.telefono,
          referente_email: data.referente.email,
          note: data.note,
          stato: 'in_attesa',
          created_at: new Date().toISOString()
        };

        saveLocalBooking(localBooking);

        return NextResponse.json({
          success: true,
          codice,
          id,
          is_demo: true
        }, { status: 201 });
      }

      console.error('Errore prenotazione:', err);
      return NextResponse.json(
        { error: 'Errore interno del server' },
        { status: 500 }
      );
    }

  } catch (err: any) {
    console.error('Errore generale:', err);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
