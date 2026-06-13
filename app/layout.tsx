import type { Metadata } from "next";
import "./globals.css";
import Link from 'next/link';
import UserMenu from '@/components/UserMenu';

export const metadata: Metadata = {
  title: "CupCheck | Gamersupps Tracker",
  description: "Track, flex, and manage your Gamersupps collection.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Moved the global background and text colors to the body tag */}
      <body className="min-h-screen bg-vaporBg text-vaporText font-sans antialiased pb-12">
        
        {/* --- GLOBAL NAVIGATION BAR --- */}
        <nav className="border-b border-vaporBorder bg-[#0B0914]/80 backdrop-blur-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            
            {/* Logo Link to Home */}
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded bg-vaporCyan flex items-center justify-center text-black font-black italic shadow-[0_0_10px_rgba(1,205,254,0.5)]">
                CC
              </div>
              <span className="font-black text-2xl tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink hidden sm:block">
                CUPCHECK
              </span>
            </Link>

            {/* Global Links */}
            <div className="flex gap-6 items-center">
               <Link href="/explore" className="text-sm font-bold text-vaporMuted hover:text-vaporCyan transition-colors">
                 EXPLORE
               </Link>
               {/* Client Component that handles Login/Vault states */}
               <UserMenu />
            </div>

          </div>
        </nav>

        {/* --- PAGE CONTENT (app/page.tsx injects here) --- */}
        {children}

      </body>
    </html>
  );
}