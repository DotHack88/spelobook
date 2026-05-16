export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const supabase = await createClient();
    
    const { data, error } = await supabase
      .from('utenti_registrati')
      .update(body)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw error;
    if (!data) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch (err) {
    console.error('Errore aggiornamento utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const supabase = await createClient();
    
    const { error } = await supabase
      .from('utenti_registrati')
      .delete()
      .eq('id', params.id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Errore eliminazione utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
