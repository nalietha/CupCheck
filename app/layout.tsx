import type { Metadata } from "next";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next"

import NavBar from "@/components/NavBar";
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "CupCheck | Gamersupps Tracker",
  description: "Track your Waifu Cups and Merch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-vaporBg text-vaporText min-h-screen flex flex-col transition-colors duration-300 relative">
        {/* Absolute overlay for scanlines that sits behind the content */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines z-0 opacity-50" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}