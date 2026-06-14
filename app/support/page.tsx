import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="max-w-6xl mx-auto p-8 text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-pink-500">Help Center</h1>
      
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Self-Serve */}
        <SupportSection 
          title="Self-Serve" 
          links={[
            { name: "How to use your Vault", href: "/guides/vault" },
            { name: "Managing Collections", href: "/guides/collections" },
            { name: "FAQ", href: "/faq" }
          ]} 
        />

        {/* Improve the App */}
        <SupportSection 
          title="Improve the App" 
          links={[
            { name: "Report a Bug", href: "/support/bug" },
            { name: "Suggest a Feature", href: "/support/feature" },
            { name: "Incorrect Cup Data", href: "/support/data-fix" }
          ]} 
        />

        {/* Moderation */}
        <SupportSection 
          title="Moderation & Safety" 
          links={[
            { name: "Community Guidelines", href: "/rules" },
            { name: "Report User/Content", href: "/support/report" },
            { name: "Privacy & Visibility", href: "/support/privacy" }
          ]} 
        />
      </div>
    </div>
  );
}

function SupportSection({ title, links }: { title: string, links: { name: string, href: string }[] }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-700 hover:border-pink-500 transition-colors">
      <h2 className="text-xl font-semibold mb-4 text-cyan-400">{title}</h2>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="hover:text-pink-400 transition-colors underline">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}