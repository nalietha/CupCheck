'use client';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AddToVaultButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setLoading(true);
    
    // 1. Check if the user is currently logged in
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      alert("You must be logged in to add to your vault.");
      setLoading(false);
      return;
    }

    // 2. Insert into the junction table
    const { error } = await supabase
      .from('user_items')
      .insert({
        profile_id: session.user.id,
        item_id: itemId
      });

    if (error) {
      console.error("Error adding to vault:", error);
      alert("Failed to add. It might already be in your vault!");
    } else {
      setAdded(true);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleAdd}
      disabled={loading || added}
      className={`w-full bg-transparent border-2 ${added ? 'border-vaporCyan text-vaporCyan hover:bg-vaporCyan' : 'border-vaporPink text-vaporPink hover:bg-vaporPink'} font-bold py-2.5 rounded-md hover:text-[#0B0914] transition-all shadow-[0_0_10px_rgba(255,113,206,0.2)] hover:shadow-[0_0_20px_rgba(255,113,206,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {added ? '✓ IN VAULT' : (loading ? 'ADDING...' : '+ ADD TO VAULT')}
    </button>
  );
}