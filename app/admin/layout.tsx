// app/admin/layout.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navGroups = [
    {
      title: 'Catalog',
      links: [
        { name: 'Dashboard', href: '/admin' },
        { name: 'Items', href: '/admin/items' },
        { name: 'Add Item', href: '/admin/items/new' },
        { name: 'Collections', href: '/admin/collections' },
      ],
    },
    {
      title: 'Contributors',
      links: [
        { name: 'Artists', href: '/admin/artists' },
        { name: 'Creators', href: '/admin/creators' },
      ],
    },
    {
      title: 'System',
      links: [
        { name: 'Submissions', href: '/admin/submissions' }, // <-- Added Submissions here
        { name: 'Users', href: '/admin/users' },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-vaporBg">
      <aside className="w-64 bg-[#1A1625] border-r border-vaporBorder p-6 flex flex-col gap-8">
        <h2 className="text-xl font-black text-vaporPink tracking-widest">ADMIN PANEL</h2>
        {navGroups.map((group) => (
          <div key={group.title}>
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">{group.title}</h3>
            <nav className="flex flex-col gap-1">
              {group.links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-4 py-2 rounded font-medium transition-colors ${
                    pathname.startsWith(link.href) && link.href !== '/admin'
                      ? 'bg-cyan-900/50 text-cyan-300'
                      : pathname === link.href
                      ? 'bg-cyan-900/50 text-cyan-300'
                      : 'text-vaporMuted hover:text-vaporText'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}