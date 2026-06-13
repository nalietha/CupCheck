'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import AdminItemSearch from '@/components/AdminItemSearch';
import AdminItemForm from '@/components/AdminItemForm'; 

export default function EditItemPage() {
  const [selectedId, setSelectedId] = useState(null);
  const [itemData, setItemData] = useState(null);

  useEffect(() => {
    if (selectedId) {
      const fetchItem = async () => {
        const { data } = await supabase.from('items').select('*').eq('id', selectedId).single();
        setItemData(data);
      };
      fetchItem();
    }
  }, [selectedId]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl text-white font-bold mb-6">Admin: Edit Item</h1>
      
      {!selectedId ? (
        <AdminItemSearch onSelect={setSelectedId} />
      ) : (
        <div>
          <button onClick={() => setSelectedId(null)} className="text-gray-400 mb-4">
            ← Back to Search
          </button>
          {itemData ? (
            <AdminItemForm initialData={itemData} />
          ) : (
            <p>Loading item details...</p>
          )}
        </div>
      )}
    </div>
  );
}