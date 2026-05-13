import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpeloBook — Prenota la tua avventura speleologica",
  description:
    "Esplora le grotte più belle d'Italia. SpeloBook è la piattaforma per prenotare escursioni speleologiche in gruppo in modo semplice, sicuro e immediato.",
  keywords: "speleologia, grotte, prenotazione, escursioni, calabria, puglia, sardegna, friuli",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-stone-950 text-white flex flex-col">
        {children}
      </body>
    </html>
  );
}
