import AdminItemForm from '@/features/admin/AdminItemForm';
import Link from 'next/link';

export default function NewItemPage() {
  return (
    <div className="w-full pb-20">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-neonPink uppercase tracking-wider drop-shadow-[0_0_10px_rgba(255,0,255,0.3)]">
          Add New Item
        </h1>
        <Link 
          href="/admin/items" 
          className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 bg-gray-900 px-4 py-2 rounded-lg border border-gray-800"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Items
        </Link>
      </div>

      {/* The AdminItemForm now handles its own massive 3-column layout, so we just drop it in here! */}
      <AdminItemForm />
    </div>
  );
}