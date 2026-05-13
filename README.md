# 🪨 SpeloBook

**SpeloBook** è la piattaforma speleologica definitiva per l'esplorazione del sottosuolo italiano. Progettata per gruppi e appassionati, unisce un'estetica immersiva a un sistema di prenotazione professionale e semplificato.

🚀 **Vedi l'applicazione in azione:** [https://spelobook.vercel.app](https://spelobook.vercel.app)

---

## ✨ Caratteristiche Principali

### 🌊 Esperienza Immersiva
- **Hero Page Dinamica**: Sfondo con effetto *Ken Burns* (zoom lento cinematografico) e sistema di *particelle ipogee* che simulano l'atmosfera di una grotta viva.
- **Design Premium**: Tema scuro (stone/emerald) con gradienti moderni, glassmorphism e micro-animazioni.

### 📍 Esplorazione e Catalogo
- **60+ Grotte Censite**: Database esteso coprente 13 regioni italiane.
- **Filtro Geologico**: Esplora le cavità in base alla loro origine (Carsica, Lavica, Marina, Glaciale, ecc.) con aggiornamento istantaneo dei risultati.
- **Integrazione Google Maps**: Ogni grotta include un link diretto per la navigazione GPS, presente nel catalogo, nella scelta della grotta e nel riepilogo finale.

### 📅 Sistema di Prenotazione Avanzato
- **Flusso Multi-step**: Selezione zona -> Scelta grotta -> Calendario disponibilità -> Dati del gruppo.
- **Gestione Gruppo**: Campi dedicati per capogruppo e referente secondario, con validazione dei dati.
- **Calendario Real-time**: Visualizzazione chiara dei giorni occupati e disponibili.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Database & Auth**: [Supabase](https://supabase.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Icone**: [Lucide React](https://lucide.dev/)
- **Validazione**: [Zod](https://zod.dev/) & React Hook Form
- **Animazioni**: Framer Motion & CSS Keyframes

---

## 🚀 Installazione Locale

1. **Clona la repository:**
   ```bash
   git clone https://github.com/DotHack88/spelobook.git
   cd spelobook
   ```

2. **Installa le dipendenze:**
   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente:**
   Crea un file `.env.local` con le tue chiavi di Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tua_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tua_chiave_anon
   SUPABASE_SERVICE_ROLE_KEY=tua_chiave_service
   ```

4. **Avvia il server di sviluppo:**
   ```bash
   npm run dev
   ```

Apri [http://localhost:3000](http://localhost:3000) per vedere il risultato.

---

## 🗺️ Roadmap Futura
- [ ] Integrazione pagamenti con Stripe.
- [ ] Automazione email con Resend.
- [ ] Area riservata per i gestori delle grotte.
- [ ] Traduzione multilingua (Inglese/Tedesco).

---

Realizzato con passione per la speleologia e il web design moderno. 🏔️🧭
