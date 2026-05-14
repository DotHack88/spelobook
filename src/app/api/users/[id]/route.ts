export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getLocalUsers, saveLocalUsers } from '../route';

export async function PUT(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const body = await req.json();
    const localUsers = getLocalUsers();
    
    const index = localUsers.findIndex((u: any) => u.id === params.id);
    if (index === -1) {
      return NextResponse.json({ error: 'Utente non trovato' }, { status: 404 });
    }

    localUsers[index] = { ...localUsers[index], ...body };
    saveLocalUsers(localUsers);

    return NextResponse.json({ success: true, user: localUsers[index] });
  } catch (err) {
    console.error('Errore aggiornamento utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const localUsers = getLocalUsers();
    
    const newUsers = localUsers.filter((u: any) => u.id !== params.id);
    saveLocalUsers(newUsers);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Errore eliminazione utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
