// app/support/page.tsx
import Link from 'next/link';

export default function SupportPage() {
  const metaLinks = [
    { name: "Guides", href: "/guides" },
    { name: "Report Issue", href: "/support/request" },
    { name: "Privacy", href: "/support/privacy" },
    { name: "Guidelines", href: "/rules" }
  ];

  return (
    <div className="max-w-5xl mx-auto p-8 text-vaporText min-h-screen">
             
      {/* 1. Meta-Links Bar: The classic retro terminal feel */}
      <nav className="text-center text-vaporMuted text-sm tracking-widest uppercase mb-12">
        {metaLinks.map((link, i) => (
          <span key={link.name}>
            <Link href={link.href} className="hover:text-vaporCyan transition-colors">
              {link.name}
            </Link>
            {i < metaLinks.length - 1 && <span className="mx-4 text-vaporPink opacity-50">*</span>}
          </span>
        ))}
      </nav>

      {/* 2. Hero Vision Block: Spans the full width */}
      <section className="bg-vaporCard p-10 rounded-xl border border-vaporBorder shadow-neon mb-12">
        <h1 className="text-5xl font-black italic mb-6 text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink">
          THE FUTURE OF CUPCHECK
        </h1>
        <p className="text-lg leading-relaxed text-vaporText opacity-90 max-w-3xl">
          CupCheck started as a way to organize my own collection, but the goal is to build the definitive community hub for GamerSupps collectors. 
          My roadmap includes automated release tracking, community-driven price guides, and a robust "Wishlist" system so you can find the trade you've been looking for. 
          I'm building this for the community—every feature added comes directly from your feedback.
        </p>
      </section>

      {/* 3. Three-Column Support Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        <SupportSection 
          title="Self-Serve" 
          content="Stuck with your vault? Check the guides or reach out if you hit a snag."
          href="/guides"
        />
        <SupportSection 
          title="Contribute Data" 
          content="Found a missing cup or incorrect release date? Help me keep the database accurate."
          href="/support/data-fix"
        />
        <SupportSection 
          title="Community" 
          content="Join the discord and share your latest pickups with other collectors."
          href="#" /* Add your Discord invite link here */
        />
      </div>
    </div>
  );
}


function SupportSection({ title, content, href }: { title: string, content: string, href?: string }) {
  const CardContent = (
    <div className="bg-vaporCard/50 p-6 rounded-lg border border-vaporBorder hover:border-vaporCyan transition-all h-full flex flex-col">
      <h2 className="text-xl font-black italic mb-3 text-vaporCyan">{title}</h2>
      <p className="text-sm text-vaporMuted">{content}</p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block h-full group">
        {CardContent}
      </Link>
    );
  }

  return CardContent;
}