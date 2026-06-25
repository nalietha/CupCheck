import type { Metadata } from "next";
import Script from "next/script"; // 1. Import Script
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";

import NavBar from "@/components/NavBar";
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: "CupCheck.cc | Gamersupps Tracker",
  description: "Track your Waifu Cups and Merch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* 2. Theme script placed in head to prevent flash of unstyled content */}
        <Script
          id="theme-switcher"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var savedTheme = localStorage.getItem('app_theme');
                  var theme = savedTheme || 'vaporwave';
                  document.documentElement.setAttribute('data-theme', theme);
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      
      <body className="bg-vaporBg text-vaporText min-h-screen flex flex-col transition-colors duration-300 relative">
        
        {/* Absolute overlay */}
        <div className="absolute inset-0 pointer-events-none bg-scanlines z-0 opacity-50" />

        {/* Inner wrapper */}
        <div className="relative z-10 flex flex-col flex-grow">
          <NavBar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
        
        <Analytics />
      </body>
    </html>
  );
}