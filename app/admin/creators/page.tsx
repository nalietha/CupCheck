import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import AdminCreatorList from '@/features/admin/AdminCreatorList';

export const revalidate = 0; // Ensure the admin always sees the absolute latest data

export default async function AdminCreatorsPage() {
  const { data: creators, error } = await supabase
    .from('creators')
    .select('*')
    .order('name');

  if (error) {
    console.error('Error fetching creators for admin:', error);
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-vaporBorder pb-6">
        <div>
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)] uppercase">
            Creator Database
          </h1>
          <p className="text-vaporMuted mt-1">Search, modify, or initialize creator profiles.</p>
        </div>
        <Link 
          href="/admin/creators/new"
          className="px-6 py-3 bg-vaporCyan/10 border border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-black font-black uppercase tracking-widest rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(1,205,254,0.2)] hover:shadow-[0_0_25px_rgba(1,205,254,0.6)] text-center flex-shrink-0"
        >
          + Initialize New
        </Link>
      </div>

      <AdminCreatorList initialCreators={creators || []} />
    </div>
  );
}