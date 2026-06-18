'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function AddToVaultButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToVault = async () => {
    // 1. Get the current user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to add to your vault.");
      return;
    }

    // 2. Set loading state to true
    setLoading(true);

    // 3. Perform the insert into the junction table
    const { error } = await supabase
      .from('user_collections')
      .insert([
        { 
          user_id: user.id, 
          item_id: itemId 
        }
      ]);

    if (error) {
      console.error("Database error:", error);
      // Optional: keep alert only for actual errors
      alert("Failed to add to vault. Check the console for details!");
    } else {
      // 4. Update the 'added' state to trigger the button text change
      setAdded(true);
    }
    
    // 5. Reset loading state
    setLoading(false);
  };

  return (
    <button
      onClick={addToVault}
      disabled={loading || added}
      className={`w-full bg-transparent border-2 ${
        added 
          ? 'border-vaporCyan text-vaporCyan' 
          : 'border-vaporPink text-vaporPink hover:bg-vaporPink'
      } font-bold py-2.5 rounded-md hover:text-[#0B0914] transition-all shadow-[0_0_10px_rgba(255,113,206,0.2)] hover:shadow-[0_0_20px_rgba(255,113,206,0.6)] disabled:opacity-50 disabled:cursor-not-allowed`}
    >
      {added ? '✓ IN VAULT' : (loading ? 'ADDING...' : '+ ADD TO VAULT')}
    </button>
  );
}