'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminDashboard() {
    const [stats, setStats] = useState({ users: 0, items: 0, collections: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            // Fetch exact counts from the database tables
            const [usersReq, itemsReq, collectionsReq] = await Promise.all([
                supabase.from('profiles').select('*', { count: 'exact', head: true }),
                supabase.from('items').select('*', { count: 'exact', head: true }),
                supabase.from('collections').select('*', { count: 'exact', head: true })
            ]);

            setStats({
                users: usersReq.count || 0,
                items: itemsReq.count || 0,
                collections: collectionsReq.count || 0
            });
            setLoading(false);
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-black text-vaporPink mb-2">SYSTEM OVERVIEW</h1>
                <p className="text-vaporMuted">Welcome to the CupCheck central database mainframe.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Card 1 */}
                <div className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vaporCyan opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <h3 className="text-vaporMuted text-sm font-bold tracking-widest mb-1">TOTAL USERS</h3>
                    <p className="text-5xl font-black text-vaporText">{loading ? '-' : stats.users}</p>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-vaporPink opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <h3 className="text-vaporMuted text-sm font-bold tracking-widest mb-1">ITEMS IN CATALOG</h3>
                    <p className="text-5xl font-black text-vaporText">{loading ? '-' : stats.items}</p>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity"></div>
                    <h3 className="text-vaporMuted text-sm font-bold tracking-widest mb-1">ACTIVE COLLECTIONS</h3>
                    <p className="text-5xl font-black text-vaporText">{loading ? '-' : stats.collections}</p>
                </div>
            </div>
        </div>
    );
}