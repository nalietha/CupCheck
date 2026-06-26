// app/guides/page.tsx
import Link from 'next/link';

// Renders the main guides directory
export default function GuidesPage() {
  return (
    <main className="max-w-5xl mx-auto p-8 text-vaporText min-h-screen">
      <div className="mb-12">
        <Link href="/support" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
          &larr; Back to Support
        </Link>
        <h1 className="text-4xl font-black italic mt-4 text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase tracking-widest">
          Self-Serve Guides
        </h1>
        <p className="text-vaporMuted mt-2">Learn how to navigate and maximize your CupCheck experience.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <Link href="/guides/vault" className="bg-vaporCard p-8 rounded-xl border border-vaporBorder hover:border-vaporCyan transition-all shadow-neon group">
          <h2 className="text-2xl font-black italic text-vaporCyan group-hover:text-vaporPink transition-colors mb-4 uppercase tracking-widest">The Vault</h2>
          <p className="text-vaporMuted">Learn how to add items, track duplicates, log purchase details, and setup your profile trackers.</p>
        </Link>

        <Link href="/guides/collections" className="bg-vaporCard p-8 rounded-xl border border-vaporBorder hover:border-vaporCyan transition-all shadow-neon group">
          <h2 className="text-2xl font-black italic text-vaporCyan group-hover:text-vaporPink transition-colors mb-4 uppercase tracking-widest">Collections</h2>
          <p className="text-vaporMuted">Understand how items are categorized into seasons and creator collaborations.</p>
        </Link>
      </div>
    </main>
  );
}