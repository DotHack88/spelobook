import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "SpeleoBook — Esplorazioni Speleologiche Certificate",
  description:
    "Il portale unico per le tue esplorazioni speleologiche certificate in tutta Italia.",
  icons: {
    icon: "/favicon.svg",
  },
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
