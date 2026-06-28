'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AddToVaultButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToVault = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to add to your vault.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('user_collections')
      .insert([{ user_id: user.id, item_id: itemId }]);

    if (error) {
      console.error("Database error:", error);
      alert("Failed to add to vault. Check the console for details!");
    } else {
      setAdded(true);
    }
    
    setLoading(false);
  };

  return (
    <button
      onClick={addToVault}
      disabled={loading || added}
      className={`w-full bg-transparent border-2 ${
        added 
          ? 'border-vaporCyan text-vaporCyan' 
          : 'border-vaporPink text-vaporPink hover:bg-vaporPink hover:text-[#0B0914]'
      } font-bold py-1.5 md:py-2.5 text-[10px] md:text-sm rounded-md transition-all shadow-[0_0_10px_rgba(255,113,206,0.2)] hover:shadow-[0_0_20px_rgba(255,113,206,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {added ? '✓ IN VAULT' : (loading ? 'ADDING...' : '+ ADD TO VAULT')}
    </button>
  );
}