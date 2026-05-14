'use client';

import Link from "next/link";
import { useState, useEffect } from "react";
import { MapPin, ChevronRight, Mountain, Users, ShieldCheck, Compass } from "lucide-react";
import { useUserStore } from "@/hooks/useUserStore";

const zones = [
  { nome: "Calabria", slug: "calabria", grotte: 12, emoji: "🏔️" },
  { nome: "Puglia", slug: "puglia", grotte: 8, emoji: "🌊" },
  { nome: "Sardegna", slug: "sardegna", grotte: 15, emoji: "🪸" },
  { nome: "Friuli-VG", slug: "friuli", grotte: 10, emoji: "❄️" },
];

const features = [
  {
    icon: <Compass className="w-7 h-7" />,
    title: "Prime Regioni Disponibili",
    desc: "Grotte mappate in Calabria, Puglia, Sardegna e Friuli-Venezia Giulia.",
  },
  {
    icon: <Users className="w-7 h-7" />,
    title: "Prenotazione di Gruppo",
    desc: "Gestisci autonomamente la data in cui vuoi visitare la grotta!",
  },
  {
    icon: <ShieldCheck className="w-7 h-7" />,
    title: "Prenotazione Esclusiva",
    desc: "Garantiamo l'esclusività della grotta per il tuo gruppo durante la fascia oraria scelta.",
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
            <span className="text-white">Speleo</span>
            <span className="text-emerald-400">Book</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone-400">
            <Link href="/prenota" className="hover:text-white transition-colors">Prenota</Link>
            <Link href="/grotte" className="hover:text-white transition-colors">Grotte</Link>
          </div>
          {mounted && useUserStore.getState().user ? (
            <Link
              href="/profilo"
              className="bg-stone-800 hover:bg-stone-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg border border-stone-700"
            >
              Il mio Profilo
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-emerald-500/20"
            >
              Accesso
            </Link>
          )}
        </div>
      </nav>

      <section className="relative flex flex-col items-center justify-center text-center min-h-[95vh] px-6 pt-24 overflow-hidden">
        {/* Background System */}
        <div className="absolute inset-0 z-0">
          {/* 1. Base Layer */}
          <div className="absolute inset-0 bg-stone-950" />
          
          {/* 2. Image Layer */}
          <div className="absolute inset-0 z-10">
            <img 
              src="/hero-cave.png" 
              alt="Cave Interior" 
              className="w-full h-full object-cover opacity-80 brightness-110 animate-ken-burns"
            />
          </div>

          {/* 3. Gradient Overlay - Ensures text contrast */}
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-stone-950/70 via-stone-950/10 to-stone-950/90" />
          
          {/* 4. Particle Layer - High visibility */}
          <div className="absolute inset-0 z-30 pointer-events-none">
            {mounted && [...Array(50)].map((_, i) => (
              <div 
                key={i}
                className="particle"
                style={{
                  width: `${Math.random() * 5 + 3}px`,
                  height: `${Math.random() * 5 + 3}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animation: `float-particle ${Math.random() * 15 + 10}s linear infinite`,
                  animationDelay: `${Math.random() * 5}s`,
                  background: i % 2 === 0 ? '#10b981' : '#22d3ee',
                  boxShadow: `0 0 10px ${i % 2 === 0 ? '#10b981' : '#22d3ee'}`,
                  opacity: Math.random() * 0.5 + 0.3
                }}
              />
            ))}
          </div>

          {/* 5. Atmosphere Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-emerald-500/10 blur-[120px] z-20" />
        </div>

        {/* 6. Content Layer */}
        <div className="relative z-40 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-xs font-bold px-4 py-2 rounded-full mb-8 backdrop-blur-md shadow-lg shadow-emerald-500/10">
            <MapPin size={12} />
            13 regioni · 60+ grotte certificate
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.8)]">
            Esplora le{" "}
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
              profondità
            </span>{" "}
            d&apos;Italia
          </h1>

          <p className="text-stone-200 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed drop-shadow-lg font-medium">
            SpeleoBook è la piattaforma sperimentale per prenotare escursioni speleologiche in gruppo.
            Scegli la grotta, seleziona le date e invia i dati del tuo team in pochi click.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Link
              href="/prenota"
              className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-base font-semibold px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-emerald-500/40"
            >
              Inizia a Prenotare <ChevronRight size={18} />
            </Link>
            <Link
              href="/grotte"
              className="flex items-center justify-center gap-2 border border-stone-700 bg-stone-900/40 backdrop-blur-md text-stone-100 hover:bg-stone-800 hover:text-white text-base font-medium px-8 py-4 rounded-full transition-all"
            >
              Scopri le Grotte
            </Link>
          </div>

          {/* Stats bar with gradient hover effect */}
          <div className="group/stats w-full max-w-4xl bg-stone-900/40 backdrop-blur-xl border border-stone-800 rounded-3xl p-8 grid grid-cols-3 divide-x divide-stone-800 relative overflow-hidden transition-all hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5">
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-cyan-500/10 opacity-0 group-hover/stats:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {[
              { label: "Grotte Attive", value: "60+", color: "text-emerald-400" },
              { label: "Regioni", value: "13", color: "text-teal-400" },
              { label: "Sicurezza della tua prenotazione", value: "100%", color: "text-cyan-400" },
            ].map((s) => (
              <div key={s.label} className="text-center px-4 md:px-6 relative z-10 transition-transform group-hover/stats:scale-105 duration-300">
                <p className={`text-3xl md:text-4xl font-black mb-2 tracking-tighter ${s.color} transition-colors group-hover/stats:text-white`}>
                  {s.value}
                </p>
                <p className="text-[10px] md:text-xs text-stone-500 uppercase tracking-[0.2em] font-bold group-hover/stats:text-stone-300">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>



      {/* Features */}
      <section className="w-full py-24 border-t border-stone-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-extrabold text-white mb-4">Perché SpeleoBook?</h2>
            <p className="text-stone-400 text-lg">Una demo interattiva per la pianificazione delle tue uscite.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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



      {/* Footer */}
      <footer className="mt-auto border-t border-stone-900 py-10 text-center text-stone-600 text-sm">
        <p>
          <span className="font-bold text-stone-400">🪨 SpeleoBook</span> — Prenotazione escursioni speleologiche © {new Date().getFullYear()}
        </p>
      </footer>
    </div>
  );
}
