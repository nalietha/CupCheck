import AdminItemForm from '@/features/admin/AdminItemForm';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// 1. Update the type definition so params is a Promise
export default async function EditItemPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. Await the params to unwrap them
  const { id } = await params;

  // Server-side fetch to get the Item AND its ordered images
  const { data: item, error } = await supabase
    .from('items')
    .select(`
      *,
      item_images (*)
    `)
    // 3. Use the unwrapped id variable here
    .eq('id', id)
    .single();

  if (error || !item) {
    return notFound();
  }

  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neonBlue uppercase tracking-wider drop-shadow-[0_0_10px_rgba(0,255,255,0.3)] flex items-center gap-3">
          Edit Item <span className="text-gray-500 text-xl font-normal lowercase tracking-normal">({item.name})</span>
        </h1>
        <Link 
          href="/admin/items"
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Items
        </Link>
      </div>

      <AdminItemForm initialData={item} itemId={item.id} />
    </div>
  );
}