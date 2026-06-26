// app/guides/vault/page.tsx
import Link from 'next/link';

// Renders the comprehensive guide for using the Vault feature
export default function VaultGuidePage() {
  return (
    <main className="max-w-4xl mx-auto p-8 text-vaporText min-h-screen">
      <div className="mb-8 border-b border-vaporBorder pb-6">
        <Link href="/guides" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
          &larr; Back to Guides
        </Link>
        <h1 className="text-4xl font-black italic mt-4 text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase tracking-widest">
          Mastering Your Vault
        </h1>
      </div>

      <div className="space-y-8">
        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Adding Items</h2>
          <p className="text-vaporMuted mb-4">
            To add an item to your vault, browse the catalog and click the <strong>+ ADD TO VAULT</strong> button on any item card. This automatically logs a single copy of the item into your personal collection.
          </p>
        </section>

        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Managing Details & Duplicates</h2>
          <p className="text-vaporMuted mb-4">
            Inside your Vault, click "View Details" on any item to open its management interface. From here, you can:
          </p>
          <ul className="list-disc list-inside text-vaporMuted space-y-2 ml-4">
            <li><strong>Log Acquisition Data:</strong> Record the purchase price, location, condition, and any creator codes used during checkout.</li>
            <li><strong>Manage Quantity:</strong> Use the inventory management buttons at the bottom to add duplicate copies or remove specific records.</li>
            <li><strong>Favorite Items:</strong> Mark items with a star to feature them prominently on your profile.</li>
          </ul>
        </section>

        <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
          <h2 className="text-2xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Profile Customization</h2>
          <p className="text-vaporMuted mb-4">
            Navigate to your <strong>Settings</strong> (via the gear icon in the navigation bar) to customize your public presence:
          </p>
          <ul className="list-disc list-inside text-vaporMuted space-y-2 ml-4">
            <li><strong>Privacy:</strong> Toggle your vault to public or private.</li>
            <li><strong>Themes:</strong> Swap between the default Vaporwave aesthetic and alternative modes.</li>
            <li><strong>Progress Trackers:</strong> Setup custom trackers to monitor your completion percentage for specific seasons, creators, or item types.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}