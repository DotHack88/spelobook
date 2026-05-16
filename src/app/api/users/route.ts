export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('utenti_registrati')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (err) {
    console.error('Errore recupero utenti:', err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const supabase = await createClient();

    // Inserimento utente su Supabase
    const { data, error } = await supabase
      .from('utenti_registrati')
      .insert({
        name: body.name,
        email: body.email,
        status: 'pending'
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation (email)
        return NextResponse.json({ error: 'Utente già registrato' }, { status: 400 });
      }
      throw error;
    }

    return NextResponse.json({ success: true, user: data }, { status: 201 });
  } catch (err) {
    console.error('Errore creazione utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
