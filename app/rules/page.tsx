// app/rules/page.tsx
import Link from 'next/link';

export default function GuidelinesPage() {
  return (
    <main className="min-h-screen bg-vaporBg text-vaporText p-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Navigation */}
        <div>
          <Link href="/support" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
            &larr; BACK TO SUPPORT
          </Link>
        </div>

        {/* Header */}
        <header className="border-b border-vaporBorder pb-6 mb-8">
          <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase">
            Community Guidelines
          </h1>
          <p className="text-vaporMuted mt-2">
            CupCheck is a community-driven catalog. Keeping the database clean and the community welcoming relies on everyone following a few simple rules.
          </p>
        </header>
        
        <div className="space-y-8">
          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">1. Database Integrity</h2>
            <p className="text-vaporMuted leading-relaxed">
              When submitting missing items via the Contribute Data form, ensure all information is accurate. 
              <strong> Do not submit fake, leaked, or unannounced items.</strong> Provide clear proof (like a store screenshot or an in-hand photo) so admins can verify the entry quickly. 
              Intentionally flooding the submission queue with junk data will result in a permanent ban.
            </p>
          </section>

          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">2. Profile Etiquette</h2>
            <p className="text-vaporMuted leading-relaxed">
              Your Vault and Tier Lists are private by default, but <strong>if you choose to make them public</strong>, please keep your Display Name and Bio respectful. 
              While we track NSFW content tags for creators and artists within the database, overtly offensive, hateful, or discriminatory text in your personal profile is not permitted.
            </p>
          </section>

          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">3. Honest Tracking</h2>
            <p className="text-vaporMuted leading-relaxed">
              Your collection progress is based on an honor system. We aren't verifying your receipts, but inflating your vault with items you don't actually own defeats the purpose of the app. Keep it authentic so the community stats accurately reflect real collectors.
            </p>
          </section>

          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">4. Support Requests</h2>
            <p className="text-vaporMuted leading-relaxed">
              If you encounter a bug, please check the Self-Serve guides first. If you still need help, submit a detailed ticket. Be patient—this is a passion project built for the community, and tickets are reviewed as quickly as possible.
            </p>
          </section>
        </div>

      </div>
    </main>
  );
}