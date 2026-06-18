'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

/* =====================================================================
 * GOAL: Provide a single, reusable form for both creating and updating 
 * artists. This prevents us from writing the exact same form UI twice.
 * ===================================================================== */

interface ArtistFormProps {
  artistId?: string;
  initialData?: {
    name: string;
    links?: {
      twitter?: string;
      instagram?: string;
      pixiv?: string;
      portfolio?: string;
    };
  };
}

export default function ArtistForm({ artistId, initialData }: ArtistFormProps) {
  const router = useRouter();

  // Safely grab existing links or default to empty object
  const defaultLinks = initialData?.links || {};

  // -------------------------------------------------------------------
  // Section: State Management
  // -------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    twitter: defaultLinks.twitter || '',
    instagram: defaultLinks.instagram || '',
    pixiv: defaultLinks.pixiv || '',
    portfolio: defaultLinks.portfolio || '',
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------
  // Section: Form Submission Handler
  // -------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Package the data to match the DB Schema (name: text, links: jsonb)
    const payload = {
      name: formData.name,
      links: {
        twitter: formData.twitter,
        instagram: formData.instagram,
        pixiv: formData.pixiv,
        portfolio: formData.portfolio,
      }
    };

    try {
      if (artistId) {
        // Edit Mode: Update the existing record
        const { error: updateError } = await supabase
          .from('artists')
          .update(payload)
          .eq('id', artistId);

        if (updateError) throw updateError;
      } else {
        // Create Mode: Insert a brand new record
        const { error: insertError } = await supabase
          .from('artists')
          .insert([payload]);

        if (insertError) throw insertError;
      }

      // Success! Redirect the admin back to the main artists list
      router.push('/admin/artists');
      router.refresh(); // Forces Next.js to pull the latest data
      
    } catch (err: any) {
      console.error('Error saving artist:', err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------------------------------------------
  // Section: UI Render
  // -------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-vaporBg p-6 rounded-xl border border-vaporBorder max-w-2xl">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* --- Basic Info --- */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">
          Artist Name
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3 transition-colors"
          placeholder="e.g. Suki, QueenOfChibiArt"
        />
      </div>

      {/* --- Social Links (Saved as JSONB) --- */}
      <div className="pt-6 border-t border-vaporBorder space-y-4">
        <h3 className="text-lg font-bold text-vaporText uppercase tracking-wider mb-4">Social Links & Portfolio</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="twitter" className="block text-sm font-medium text-vaporMuted mb-1">
              Twitter / X URL
            </label>
            <input
              type="url"
              id="twitter"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 transition-colors"
              placeholder="https://x.com/..."
            />
          </div>

          <div>
            <label htmlFor="instagram" className="block text-sm font-medium text-vaporMuted mb-1">
              Instagram URL
            </label>
            <input
              type="url"
              id="instagram"
              value={formData.instagram}
              onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 transition-colors"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label htmlFor="pixiv" className="block text-sm font-medium text-vaporMuted mb-1">
              Pixiv URL
            </label>
            <input
              type="url"
              id="pixiv"
              value={formData.pixiv}
              onChange={(e) => setFormData({ ...formData, pixiv: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 transition-colors"
              placeholder="https://pixiv.net/..."
            />
          </div>

          <div>
            <label htmlFor="portfolio" className="block text-sm font-medium text-vaporMuted mb-1">
              General Portfolio / Website
            </label>
            <input
              type="url"
              id="portfolio"
              value={formData.portfolio}
              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-2.5 transition-colors"
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex justify-end gap-4 pt-6 border-t border-vaporBorder">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-transparent text-vaporMuted hover:text-vaporText transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-vaporText font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : artistId ? 'Update Artist' : 'Add Artist'}
        </button>
      </div>
    </form>
  );
}