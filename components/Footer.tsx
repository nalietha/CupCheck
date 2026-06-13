import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-pink-500/20 bg-gray-950 py-8 mt-auto">
      <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Company Branding */}
        <div className="flex flex-col items-center md:items-start">
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-pink-500">
            Medusa Studio
          </span>
          <p className="text-gray-500 text-sm mt-1">
            © {currentYear} CupCheck. All rights reserved.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8 text-sm text-gray-300">
          <Link href="/" className="hover:text-cyan-400 transition-colors">
            Items
          </Link>
          <Link href="/support" className="hover:text-cyan-400 transition-colors">
            Support
          </Link>
          <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}