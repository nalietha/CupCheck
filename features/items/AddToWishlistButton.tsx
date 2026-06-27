'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AddToWishlistButton({ itemId }: { itemId: string }) {
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToWishlist = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to add to your wishlist.");
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('user_wishlists')
      .insert([
        { 
          user_id: user.id, 
          item_id: itemId,
          status: 'active'
        }
      ]);

    if (error) {
      console.error("Database error:", error);
    } else {
      setAdded(true);
    }
    
    setLoading(false);
  };

  return (
    <button
      onClick={addToWishlist}
      disabled={loading || added}
      aria-label="Add to Wishlist"
      className={`w-full bg-transparent text-xs tracking-widest uppercase py-1 mt-2 font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        added 
          ? 'text-vaporCyan' 
          : 'text-vaporMuted hover:text-vaporCyan'
      }`}
    >
      <span className={`before:content-[var(--term-add-wishlist)] ${added ? 'before:content-[var(--term-in-wishlist)]' : ''}`}>
        {loading ? 'PROCESSING...' : ''}
      </span>
    </button>
  );
}