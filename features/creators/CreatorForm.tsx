'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface CreatorFormProps {
  creatorId?: string;
  initialData?: {
    name: string;
    description?: string;
    image_url?: string;
    gg_code?: string;
    is_active?: boolean;
    is_nsfw?: boolean;
    social_links?: {
      twitter?: string;
      twitch?: string;
      youtube?: string;
    };
  };
}

export default function CreatorForm({ creatorId, initialData }: CreatorFormProps) {
  const router = useRouter();

  const defaultLinks = initialData?.social_links || {};

  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    image_url: initialData?.image_url || '',
    gg_code: initialData?.gg_code || '',
    is_active: initialData?.is_active ?? true,
    is_nsfw: initialData?.is_nsfw ?? false,
    twitter: defaultLinks.twitter || '',
    twitch: defaultLinks.twitch || '',
    youtube: defaultLinks.youtube || '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      name: formData.name,
      description: formData.description,
      image_url: formData.image_url,
      gg_code: formData.gg_code,
      is_active: formData.is_active,
      is_nsfw: formData.is_nsfw,
      social_links: {
        twitter: formData.twitter,
        twitch: formData.twitch,
        youtube: formData.youtube,
      }
    };

    try {
      if (creatorId) {
        const { error: updateError } = await supabase
          .from('creators')
          .update(payload)
          .eq('id', creatorId);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('creators')
          .insert([payload]);

        if (insertError) throw insertError;
      }

      router.push('/admin/creators');
      router.refresh();
      
    } catch (err: any) {
      console.error('Error saving creator:', err);
      setError(err.message || 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-vaporBg p-6 rounded-xl border border-vaporBorder max-w-3xl">
      {error && (
        <div className="p-4 bg-red-900/50 border border-red-500 text-red-200 rounded-lg">
          {error}
        </div>
      )}

      {/* --- Main Details --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">Creator Name</label>
          <input
            type="text" required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">GG Code</label>
          <input
            type="text"
            value={formData.gg_code}
            onChange={(e) => setFormData({ ...formData, gg_code: e.target.value })}
            className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3"
            placeholder="e.g. Smii7y"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">Profile Image URL</label>
          <input
            type="url"
            value={formData.image_url}
            onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
            className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-300 uppercase tracking-wider mb-2">Description</label>
          <textarea
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg focus:ring-cyan-400 focus:border-cyan-400 block p-3"
          />
        </div>
      </div>

      {/* --- Toggles --- */}
      <div className="flex gap-8 p-4 bg-vaporCard rounded-lg border border-vaporBorder">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_active}
            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
            className="w-5 h-5 accent-cyan-400 bg-vaporCard border-gray-700 rounded"
          />
          <span className="text-vaporText font-medium">Active Creator</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.is_nsfw}
            onChange={(e) => setFormData({ ...formData, is_nsfw: e.target.checked })}
            className="w-5 h-5 accent-pink-500 bg-vaporCard border-gray-700 rounded"
          />
          <span className="text-pink-400 font-medium">NSFW Content</span>
        </label>
      </div>

      {/* --- Social Links --- */}
      <div className="pt-6 border-t border-vaporBorder space-y-4">
        <h3 className="text-lg font-bold text-vaporText uppercase tracking-wider mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-vaporMuted mb-1">Twitch</label>
            <input
              type="url"
              value={formData.twitch}
              onChange={(e) => setFormData({ ...formData, twitch: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg block p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-vaporMuted mb-1">YouTube</label>
            <input
              type="url"
              value={formData.youtube}
              onChange={(e) => setFormData({ ...formData, youtube: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg block p-2.5"
            />
          </div>
          <div>
            <label className="block text-sm text-vaporMuted mb-1">Twitter / X</label>
            <input
              type="url"
              value={formData.twitter}
              onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
              className="w-full bg-vaporCard border border-gray-700 text-vaporText rounded-lg block p-2.5"
            />
          </div>
        </div>
      </div>

      {/* --- Action Buttons --- */}
      <div className="flex justify-end gap-4 pt-6 border-t border-vaporBorder">
        <button type="button" onClick={() => router.back()} className="px-6 py-2 text-vaporMuted hover:text-vaporText transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={loading || !formData.name.trim()} className="px-6 py-2 bg-pink-600 hover:bg-pink-500 text-vaporText font-bold rounded-lg transition-colors disabled:opacity-50">
          {loading ? 'Saving...' : creatorId ? 'Update Creator' : 'Add Creator'}
        </button>
      </div>
    </form>
  );
}