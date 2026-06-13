import type { Metadata } from "next";
import "./globals.css";
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
      <body className="bg-[#0B0914] text-white min-h-screen flex flex-col">
        {/* 2. Place it here so it sits at the top of every page */}
        <NavBar /> 
        
        {/* 3. The rest of your pages load inside this main tag */}
        <main className="flex-1">
            {children}
        </main>
      <Footer />
      </body>
    </html>
  );
}