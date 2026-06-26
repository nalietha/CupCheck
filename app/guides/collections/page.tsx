// app/guides/collections/page.tsx
import Link from 'next/link';

// Renders the guide explaining database collections and categories
export default function CollectionsGuidePage() {
  return (
    <main className="max-w-4xl mx-auto p-8 text-vaporText min-h-screen">
      <div className="mb-8 border-b border-vaporBorder pb-6">
        <Link href="/guides" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
          &larr; Back to Guides
        </Link>
        <h1 className="text-4xl font-black italic mt-4 text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase tracking-widest">
          Understanding Collections
        </h1>
      </div>

      <div className="space-y-8">
        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">What is a Collection?</h2>
          <p className="text-vaporMuted mb-4">
            In the CupCheck database, items are organized into Collections. These represent formal release groups established by Gamersupps, such as numbered Seasons or specific themed drops.
          </p>
        </section>

        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Seasons vs. Creator Drops</h2>
          <p className="text-vaporMuted mb-4">
            There are two main types of items you'll find in the catalog:
          </p>
          <ul className="list-disc list-inside text-vaporMuted space-y-2 ml-4">
            <li><strong>Waifu Cups (Seasons):</strong> Standard releases grouped by Season (e.g., Season 1, Season 4). These often share a unified numbering system.</li>
            <li><strong>Creator Cups:</strong> Special collaborations with content creators. These are tracked separately from standard seasons and are linked directly to the creator's profile.</li>
          </ul>
        </section>

        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Tracking Your Progress</h2>
          <p className="text-vaporMuted">
            You can use the Progress Trackers in your Settings to target specific collections. Setting a tracker to "Season 4" will calculate exactly how many items from that collection you currently own versus the total amount in the database.
          </p>
        </section>
      </div>
    </main>
  );
}