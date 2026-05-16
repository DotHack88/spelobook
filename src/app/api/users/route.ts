export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';

// Usa /tmp in produzione (Vercel) perché il file system è di sola lettura, altrimenti usa /data locale
const DATA_FILE = process.env.VERCEL || process.env.NODE_ENV === 'production'
  ? path.join(os.tmpdir(), 'users.json')
  : path.join(process.cwd(), 'data', 'users.json');

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([]));
  }
}

export function getLocalUsers() {
  ensureDataDir();
  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(fileContent);
}

export function saveLocalUsers(users: any[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
}

export async function GET() {
  try {
    const localUsers = getLocalUsers();
    return NextResponse.json(localUsers);
  } catch (err) {
    console.error('Errore recupero utenti:', err);
    return NextResponse.json([], { status: 200 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const localUsers = getLocalUsers();
    
    // Check if email already exists
    if (localUsers.find((u: any) => u.email === body.email)) {
      return NextResponse.json({ error: 'Utente già registrato' }, { status: 400 });
    }

    const newUser = {
      id: Math.random().toString(36).substring(2, 9),
      name: body.name,
      email: body.email,
      status: 'pending', // pending, approved, rejected
      created_at: new Date().toISOString()
    };
    
    localUsers.push(newUser);
    saveLocalUsers(localUsers);

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error('Errore creazione utente:', err);
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
  }
}
