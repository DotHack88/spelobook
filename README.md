# SpeleoBook 🏔️📖

**SpeleoBook** è una piattaforma moderna ed elegante per la gestione e la prenotazione di escursioni speleologiche. Progettata per gruppi di esploratori e appassionati, offre un'interfaccia premium con focus sull'esperienza utente e sull'efficienza amministrativa.

---

## 🚀 Aggiornamenti Recenti (Maggio 2026)

Abbiamo apportato significativi miglioramenti per rendere il processo di prenotazione più fluido e la gestione amministrativa più potente.

### 1. 🔍 Esperienza di Ricerca e Prenotazione
*   **Barra di Ricerca Intelligente**: Integrata la ricerca testuale in tempo reale all'interno del catalogo grotte. È ora possibile cercare una grotta per nome direttamente dalla Home.
*   **Selezione Fascia Oraria**: Aggiunta la possibilità di indicare la fascia oraria preferita (Mattina, Pomeriggio, Intera Giornata) già in fase di ricerca.
*   **Pulsante "Prenota" Diretto**: Il vecchio tasto "Cerca" è stato trasformato in un tasto "Prenota" che porta l'utente direttamente alla fase di inserimento dati (Step 3), pre-popolando il nome del gruppo.
*   **UI Semplificata**: Rimossi i campi tecnici ridondanti (Esplorazione tecnica, Guida inclusa) per un'interfaccia più pulita e immediata.

### 2. 📝 Flusso di Registrazione Ottimizzato
*   **Form Dati Gruppo**: Rimosso il campo "Livello Esperienza" per ridurre l'attrito durante la compilazione.
*   **Persistenza Dati**: Il nome del gruppo inserito nella barra di ricerca viene ora automaticamente trasportato nel modulo dettagliato.
*   **Gestione Errori Avanzata**: In caso di dati non validi, il sistema ora mostra all'utente esattamente quali campi sono errati (es. formato email o telefono), migliorando il debugging.

### 3. 🛡️ Dashboard Amministratore (Admin)
*   **Ricerca Live Prenotazioni**: Implementata una barra di ricerca istantanea per filtrare le prenotazioni per Codice (es. `SPELEO-XXXX`), Nome Gruppo, Referente o Grotta.
*   **Export Report**: Attivata la funzione di esportazione reale in formato **CSV** per i report mensili delle attività.
*   **Azioni Rapide**: Migliorato il feedback visivo per l'inserimento di nuove grotte e altre azioni di gestione rapida.

### 4. 🛠️ Migliorie Tecniche
*   **Integrazione Supabase**: Il database è stato aggiornato per supportare e persistere il campo `fascia_oraria`.
*   **Validazione Zod**: Sincronizzati gli schemi di validazione client e server per garantire la massima integrità del dato.
*   **Branding**: Implementata una nuova **Favicon personalizzata** in formato SVG (Libro + Montagna).
*   **Fix Tipizzazione**: Risolti numerosi errori TypeScript legati all'opzionalità dei campi del gruppo nello store globale.

---

## 🛠️ Stack Tecnologico
*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Router & Turbopack)
*   **Linguaggio**: TypeScript
*   **Styling**: Tailwind CSS
*   **State Management**: Zustand (Global Store)
*   **Validazione**: Zod & React Hook Form
*   **Database & Auth**: Supabase
*   **Icone**: Lucide React

---

## 📂 Struttura del Progetto (Principale)
*   `src/app/admin`: Dashboard e gestione prenotazioni.
*   `src/components/booking`: Componenti core del flusso di prenotazione (SearchBar, GroupForm, Summary).
*   `src/hooks`: Hook personalizzati (es. `useBookingStore`).
*   `src/lib/validations`: Schemi di validazione centralizzati.
*   `src/types`: Definizioni delle interfacce TypeScript.

---

## 📋 Prossimi Passi
- [ ] Implementazione interfaccia visuale per l'aggiunta di nuove grotte (Form Admin).
- [ ] Integrazione sistema di upload immagini per la galleria grotte.
- [ ] Notifiche email automatiche alla conferma della prenotazione.

---
*SpeleoBook - Esplora l'oscurità con facilità.*
