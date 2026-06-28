// app/privacy/page.tsx
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-vaporBg text-vaporText p-8 flex justify-center">
      <div className="max-w-3xl w-full space-y-8">
        
        {/* Navigation back to support hub */}
        <div>
          <Link href="/support" className="text-vaporCyan hover:text-vaporPink transition-colors font-bold tracking-wider text-sm uppercase">
            &larr; BACK TO SUPPORT
          </Link>
        </div>

        {/* Header section */}
        <header className="border-b border-vaporBorder pb-6 mb-8">
          <h1 className="text-4xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase">
            Privacy Policy
          </h1>
          <p className="text-vaporMuted mt-2">
            Your data security and privacy are fundamental to CupCheck. Here is exactly what we collect and how it is used.
          </p>
        </header>

        <div className="space-y-8">
          {/* Data collection details */}
          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">Data Collection</h2>
            <p className="text-vaporMuted leading-relaxed">
              CupCheck collects the minimum amount of data required to maintain your vault and authenticate your session. This includes your email address (used strictly for authentication and account recovery), your chosen username and display name, and the items you log in your collection.
            </p>
          </section>

          {/* Vault visibility explanation */}
          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">Vault Visibility</h2>
            <p className="text-vaporMuted leading-relaxed">
              Your Vault is <strong>private by default</strong>. If you wish to share your collection and tier lists with the community, you can toggle your vault to Public at any time via your Account Settings. Private vaults cannot be viewed by anyone other than yourself and database administrators.
            </p>
          </section>

          {/* Third party and security details */}
          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">Data Security & Third Parties</h2>
            <p className="text-vaporMuted leading-relaxed">
              Authentication and database management are securely handled by Supabase. We do not sell, rent, or share your personal information with external marketers or third-party advertisers. Your passwords are cryptographically hashed and never visible to our team.
            </p>
          </section>

          {/* Contact escalation path */}
          <section className="bg-vaporCard p-6 rounded-xl border border-vaporBorder">
            <h2 className="text-xl font-bold text-vaporCyan mb-3 uppercase tracking-wider">Contact & Support</h2>
            <p className="text-vaporMuted leading-relaxed mb-6">
              We ask that all users attempt to resolve their issues using our self-serve tools before escalating to direct communication.
            </p>
            <ul className="list-none space-y-4 mb-6">
              <li className="flex items-center gap-3">
                <span className="text-vaporPink font-bold">»</span>
                <Link href="/guides" className="text-vaporCyan hover:underline font-bold tracking-wider uppercase text-sm">Read the Self-Serve Guides</Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-vaporPink font-bold">»</span>
                <Link href="/rules" className="text-vaporCyan hover:underline font-bold tracking-wider uppercase text-sm">Review the Community Guidelines</Link>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-vaporPink font-bold">»</span>
                <Link href="/support/request" className="text-vaporCyan hover:underline font-bold tracking-wider uppercase text-sm">Submit a Support Ticket</Link>
              </li>
            </ul>
            <p className="text-vaporMuted text-sm mt-6 pt-6 border-t border-vaporBorder">
              For critical privacy concerns or legal inquiries that cannot be handled via the ticket system, contact the admin directly at <a href="mailto:Medusa.Studio@proton.me" className="text-vaporCyan hover:underline">Medusa.Studio@proton.me</a>.
            </p>
          </section>
        </div>

        <footer className="pt-8 text-center text-sm text-vaporMuted opacity-50">
          Last updated: June 2026
        </footer>
      </div>
    </main>
  );
}