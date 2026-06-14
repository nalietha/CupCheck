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
    // We can easily add social_url, bio, etc. here in the future
  };
}

export default function ArtistForm({ artistId, initialData }: ArtistFormProps) {
  const router = useRouter();

  // -------------------------------------------------------------------
  // Section: State Management
  // Purpose: Hold the form input values and track the loading/error 
  // status so we can update the UI accordingly.
  // -------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // -------------------------------------------------------------------
  // Section: Form Submission Handler
  // Purpose: Intercept the form submission, determine if we are 
  // inserting or updating, and safely push data to Supabase.
  // -------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (artistId) {
        // Edit Mode: Update the existing record
        const { error: updateError } = await supabase
          .from('artists')
          .update(formData)
          .eq('id', artistId);

        if (updateError) throw updateError;
      } else {
        // Create Mode: Insert a brand new record
        const { error: insertError } = await supabase
          .from('artists')
          .insert([formData]);

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
  // Purpose: Display the styled form, binding inputs to our React state.
  // -------------------------------------------------------------------
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-950 p-6 rounded-xl border border-gray-800 max-w-2xl">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
          {error}
        </div>
      )}

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
          className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3 transition-colors"
          placeholder="e.g. Suki, QueenOfChibiArt"
        />
      </div>

      {/* Future inputs like 'Twitter Handle' or 'Portfolio Link' can go here */}

      <div className="flex justify-end gap-4 pt-4 border-t border-gray-800">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-transparent text-gray-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !formData.name.trim()}
          className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
        >
          {loading ? 'Saving...' : artistId ? 'Update Artist' : 'Add Artist'}
        </button>
      </div>
    </form>
  );
}