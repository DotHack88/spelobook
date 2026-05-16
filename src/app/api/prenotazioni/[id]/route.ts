export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

const DATA_FILE = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'prenotazioni.json')
  : path.join(process.cwd(), 'data', 'prenotazioni.json');

function getLocalBookings() {
  if (!fs.existsSync(DATA_FILE)) return [];
  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(fileContent);
}

function saveLocalBookings(bookings: any[]) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(bookings, null, 2));
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  try {
    const supabase = await createClient();
    const { error } = await supabase.from('prenotazioni').delete().eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes('Supabase non configurato')) {
      const bookings = getLocalBookings();
      const updated = bookings.filter((b: any) => b.id !== id);
      saveLocalBookings(updated);
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  let body: any = {};
  try {
    body = await req.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from('prenotazioni').update(body).eq('id', id);
    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (err: any) {
    if (err.message?.includes('Supabase non configurato')) {
      const bookings = getLocalBookings();
      const idx = bookings.findIndex((b: any) => b.id === id);
      if (idx !== -1) {
        bookings[idx] = { ...bookings[idx], ...body };
        saveLocalBookings(bookings);
      }
      return NextResponse.json({ success: true });
    }
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
