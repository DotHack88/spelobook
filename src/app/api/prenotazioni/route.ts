import { createClient } from '@/lib/supabase/server';
import { fullBookingSchema } from '@/lib/validations/booking';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = fullBookingSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const data = parsed.data;

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
        grotta_id:              data.grotta_id,
        data_checkin:           data.data_checkin,
        data_checkout:          data.data_checkout,
        nome_gruppo:            data.nome_gruppo,
        num_persone:            data.num_persone,
        referente_nome:         data.referente.nome,
        referente_cognome:      data.referente.cognome,
        referente_telefono:     data.referente.telefono,
        referente_email:        data.referente.email,
        referente2_nome:        data.referente2?.nome,
        referente2_cognome:     data.referente2?.cognome,
        referente2_telefono:    data.referente2?.telefono,
        referente2_email:       data.referente2?.email,
        esperienza_dichiarata:  data.esperienza_dichiarata,
        note:                   data.note,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      codice: prenotazione.codice_prenotazione,
      id:     prenotazione.id,
    }, { status: 201 });

  } catch (err: any) {
    // Se Supabase non è configurato, restituiamo un successo mock per testare la UI
    if (err.message?.includes('Supabase non configurato')) {
      return NextResponse.json({
        success: true,
        codice: `SPELO-${Math.random().toString(36).substring(2, 8).toUpperCase()}-DEMO`,
        id: 'mock-id',
        is_demo: true
      }, { status: 201 });
    }

    console.error('Errore prenotazione:', err);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
