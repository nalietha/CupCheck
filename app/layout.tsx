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
    <html lang="en" suppressHydrationWarning>

      
      {/* 2. Simplified Body Classes */}
      <body className="bg-vaporBg text-vaporText min-h-screen flex flex-col transition-colors duration-300 relative">
        
        {/* Absolute overlay */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines z-0 opacity-50" />

        {/* 3. Removed redundant min-h-screen from the inner wrapper */}
        <div className="relative z-10 flex flex-col flex-grow">
          <NavBar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
        
        <Analytics />
      </body>
    </html>
  );
}