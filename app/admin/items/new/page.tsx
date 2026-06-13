'use client';

import AdminItemForm from '@/components/AdminItemForm';

export default function AddItemPage() {
  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <h1 className="text-3xl text-vaporPink font-bold mb-6">
        Admin: Add Item
      </h1>

      <AdminItemForm initialData={null} />
    </div>
  );
}