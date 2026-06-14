'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkAdminStatus = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                router.push('/login');
                return;
            }

            // Check their profile role
            const { data: profiles } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();

            if (profiles?.role !== 'admin') {
                // If they aren't an admin, kick them back to the explore page!
                router.push('/explore');
            } else {
                setIsAuthorized(true);
            }
        };

        checkAdminStatus();
    }, [router]);

    // Show a loading state (or black screen) while checking credentials
    if (!isAuthorized) return <div className="min-h-screen bg-[#0B0914]" />;

    const navLinks = [
        { name: 'Dashboard', href: '/admin' },
        {name: 'Add New Item', href: '/admin/items/new'},
        { name: 'Manage Items', href: '/admin/items' },
        { name: 'Manage Collections', href: '/admin/collections' },
        { name: 'Manage Users', href: '/admin/users' },
        { name: 'Add Artist', href: '/admin/artists/new' },
        { name: 'Manage Artists', href: '/admin/artists/edit' },
        { name: 'Manage Creators', href: '/admin/creators' },
    ];

    return (
        <div className="flex min-h-screen bg-[#0B0914]">
            <aside className="w-64 bg-[#1A1625] border-r border-vaporBorder p-6 flex flex-col gap-4">
                <h2 className="text-xl font-black text-vaporPink mb-6 tracking-widest">ADMIN PANEL</h2>
                <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className={`px-4 py-3 rounded transition-all font-bold ${
                                    isActive 
                                    ? 'bg-vaporCyan text-[#0B0914]' 
                                    : 'text-vaporMuted hover:bg-[#2A2438] hover:text-white'
                                }`}
                            >
                                {link.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-10">
                {children}
            </main>
        </div>
    );
}