'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, ChevronRight, Mountain, Users, ShieldCheck, Compass } from "lucide-react";

const zones = [
  { nome: "Calabria", slug: "calabria", grotte: 12, emoji: "🏔️" },
  { nome: "Puglia", slug: "puglia", grotte: 8, emoji: "🌊" },
  { nome: "Sardegna", slug: "sardegna", grotte: 15, emoji: "🪸" },
  { nome: "Friuli-VG", slug: "friuli", grotte: 10, emoji: "❄️" },
];

const features = [
  {
    icon: <Compass className="w-7 h-7" />,
    title: "4 Regioni d'Eccellenza",
    desc: "Grotte certificate in Calabria, Puglia, Sardegna e Friuli-Venezia Giulia.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Prenotazione di Gruppo",
    desc: "Gestisci capogruppo, referente secondario e dati di tutti i partecipanti.",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Anti-Conflitto Date",
    desc: "Il sistema verifica in tempo reale le disponibilità ed evita sovrapposizioni.",
  },
  {
    icon: <Mountain className="w-7 h-7" />,
    title: "Tutti i Livelli",
    desc: "Percorsi da facile a esperto. Filtra le grotte per il livello del tuo gruppo.",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-stone-950 font-[var(--font-inter)]">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-stone-950/70 border-b border-stone-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-xl tracking-tight">
            <span className="text-2xl">🪨</span>
            <span className="text-white">Spelo</span>
            <span className="text-emerald-400">Book</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <Link href="/prenota" className="hover:text-white transition-colors">Prenota</Link>
            <Link href="/grotte" className="hover:text-white transition-colors">Grotte</Link>
          </div>
          <Link
            href="/prenota"
            className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
          >
            Prenota ora
          </Link>
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center text-center min-h-[95vh] px-6 pt-24 overflow-hidden">
        {/* New Hero Background Image with Animation */}
        <div className="absolute inset-0 -z-20 scale-110">
          <img 
            src="/hero-cave.png" 
            alt="Cave Interior" 
            className="w-full h-full object-cover opacity-60 brightness-[0.8] animate-ken-burns"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950 via-stone-950/40 to-stone-950" />
        </div>

        {/* Floating Particles Overlay - Visible only after mount to avoid hydration mismatch */}
        <div className="absolute inset-0 -z-15 pointer-events-none overflow-hidden">
          {mounted && [...Array(25)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                width: `${Math.random() * 8 + 3}px`,
                height: `${Math.random() * 8 + 3}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float-particle ${Math.random() * 15 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 8}s`,
                opacity: Math.random() * 0.7 + 0.3
              }}
            />
          ))}
        </div>

        {/* Background glow overlay */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-emerald-900/20 blur-[120px]" />
        </div>

        <div className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-800/50 text-emerald-400 text-xs font-semibold px-4 py-2 rounded-full mb-8 backdrop-blur-sm">
          <MapPin size={12} />
          13 regioni · 60+ grotte certificate
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl text-white drop-shadow-2xl">
          Esplora le{" "}
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
            profondità
          </span>{" "}
          d&apos;Italia
        </h1>

        <p className="text-stone-300 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow-sm">
          SpeloBook è la piattaforma professionale per prenotare escursioni speleologiche in gruppo.
          Scegli la grotta, seleziona le date e invia i dati del tuo team in pochi click.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-20">
          <Link
            href="/prenota"
            className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30"
          >
            Inizia a Prenotare <ChevronRight size={18} />
          </Link>
          <Link
            href="/grotte"
            className="flex items-center justify-center gap-2 border border-stone-700 bg-stone-900/30 backdrop-blur-md text-stone-100 hover:bg-stone-800 hover:text-white text-base font-medium px-8 py-4 rounded-full transition-all"
          >
            Scopri il Catalogo
          </Link>
        </div>

        {/* Stats bar */}
        <div className="w-full max-w-4xl bg-stone-900/60 backdrop-blur-xl border border-stone-800 rounded-3xl p-6 grid grid-cols-3 divide-x divide-stone-800">
          {[
            { label: "Grotte Attive", value: "60+" },
            { label: "Regioni", value: "13" },
            { label: "Sicurezza", value: "100%" },
          ].map((s) => (
            <div key={s.label} className="text-center px-4 md:px-6">
              <p className="text-2xl md:text-3xl font-extrabold text-white mb-1">{s.value}</p>
              <p className="text-[10px] md:text-sm text-stone-500 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Regions Highlights */}
      <section className="max-w-7xl mx-auto px-6 py-24 w-full">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-white mb-4">Destinazioni in Primo Piano</h2>
          <p className="text-stone-400 text-lg max-w-xl mx-auto">
            Dalle Alpi alle isole, ogni regione offre un ecosistema carsico unico.
          </p>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-8 custom-scrollbar snap-x snap-mandatory px-4 -mx-4 md:px-0 md:mx-0">
          {[
            { nome: "Sicilia", slug: "sicilia", emoji: "🌋" },
            { nome: "Toscana", slug: "toscana", emoji: "🍷" },
            { nome: "Marche", slug: "marche", emoji: "🏔️" },
            { nome: "Puglia", slug: "puglia", emoji: "🌊" },
            { nome: "Sardegna", slug: "sardegna", emoji: "🪸" },
            { nome: "Lazio", slug: "lazio", emoji: "🏛️" },
            { nome: "Calabria", slug: "calabria", emoji: "🌶️" },
            { nome: "Friuli", slug: "friuli", emoji: "❄️" },
            { nome: "Liguria", slug: "liguria", emoji: "🌊" },
            { nome: "Abruzzo", slug: "abruzzo", emoji: "🐻" },
          ].map((z) => (
            <Link
              key={z.slug}
              href={`/prenota/${z.slug}`}
              className="flex-shrink-0 w-[160px] md:w-[180px] snap-center group bg-stone-900/40 hover:bg-emerald-950/20 border border-stone-800 hover:border-emerald-500/30 rounded-3xl p-6 transition-all duration-300 text-center"
            >
              <div className="text-4xl mb-3 group-hover:scale-110 transition-transform">{z.emoji}</div>
              <h3 className="text-white font-bold text-sm">{z.nome}</h3>
              <div className="mt-2 text-emerald-500 text-[10px] font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                Prenota
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
           <Link href="/grotte" className="text-stone-400 hover:text-emerald-400 text-sm font-medium transition-colors flex items-center justify-center gap-1">
             Vedi tutte le 13 regioni <ChevronRight size={16} />
           </Link>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-24 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Perché SpeloBook?</h2>
            <p className="text-stone-400 text-lg">Strumenti professionali per esploratori seri.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-stone-900/40 border border-stone-800 rounded-3xl p-7 hover:border-emerald-900 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-emerald-400 mb-5 inline-flex items-center justify-center w-14 h-14 bg-emerald-950/50 rounded-2xl">
                  {f.icon}
                </div>
                <h3 className="text-white font-bold text-lg mb-2">{f.title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="max-w-7xl mx-auto px-6 py-12 w-full">
        <div className="relative bg-gradient-to-br from-emerald-950/80 to-stone-900/80 border border-emerald-900/30 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-800/20 rounded-full blur-[120px]" />
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Pronto per l&apos;avventura?</h2>
          <p className="text-stone-300 text-lg mb-8 max-w-xl mx-auto">
            Compila il form in 4 step e ricevi il tuo codice di prenotazione univoco in pochi secondi.
          </p>
          <Link
            href="/prenota"
            className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-lg font-semibold px-10 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/30"
          >
            Inizia ora <ChevronRight size={20} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-900 py-10 text-center text-stone-600 text-sm">
        <p>
          <span className="font-bold text-stone-400">🪨 SpeloBook</span> — Prenotazione escursioni speleologiche © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
