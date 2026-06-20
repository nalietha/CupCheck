'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ItemTypeSelect from '@/components/ItemTypeSelect';

export default function ContributeItemForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    itemType: 'Waifu Cup',
    sourceType: 'Store page',
    itemImageUrl: '',
    sourceImageUrl: '',
    releaseDate: '',
    retailPrice: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('item_submissions').insert([
        {
          user_id: user?.id,
          name: formData.name,
          item_type: formData.itemType,
          source_type: formData.sourceType,
          item_image_url: formData.itemImageUrl,
          source_image_url: formData.sourceImageUrl,
          suggested_data: {
            release_date: formData.releaseDate,
            retail_price: formData.retailPrice,
            description: formData.description,
          }
        }
      ]);

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        name: '', itemType: 'Waifu Cup', sourceType: 'Store page', 
        itemImageUrl: '', sourceImageUrl: '', releaseDate: '', retailPrice: '', description: ''
      });
    } catch (err) {
      console.error(err);
      alert("Error submitting item. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-vaporCard p-8 rounded-lg border border-vaporCyan text-center">
        <h3 className="text-2xl font-black italic text-vaporCyan mb-2">SUBMISSION RECEIVED</h3>
        <p className="text-vaporText opacity-90">Thank you for contributing! An admin will review the data to ensure database sanctity before it goes live.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 bg-pink-600 hover:bg-pink-500 text-vaporText font-bold py-2 px-6 rounded transition-colors"
        >
          Submit Another Item
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-vaporCard p-6 rounded-lg border border-gray-700 space-y-6">
      <div className="border-b border-gray-700 pb-4">
        <h3 className="text-2xl font-black italic text-vaporCyan mb-2">Contribute Missing Data</h3>
        <p className="text-sm text-vaporMuted">
          To keep our servers fast, please upload your images to a public host like 
          <a href="https://imgur.com/upload" target="_blank" rel="noreferrer" className="text-vaporPink hover:underline ml-1">Imgur</a>, 
          then paste the direct image links below. We require two images to verify authenticity.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Core Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-1">Item Name</label>
            <input required placeholder="e.g. Sinder Cup" className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-1">Item Type</label>
            <ItemTypeSelect 
                required
                className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
                value={formData.itemType} 
                onChange={(e) => setFormData({...formData, itemType: e.target.value})} 
            />
            </div>
        </div>

        {/* Validation Images */}
        <div className="space-y-4 bg-black/30 p-4 rounded border border-gray-800">
          <div>
            <label className="block text-xs font-bold text-vaporPink uppercase tracking-wider mb-1">Item Image URL</label>
            <input required type="url" placeholder="https://i.imgur.com/..." className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
              value={formData.itemImageUrl} onChange={(e) => setFormData({...formData, itemImageUrl: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-vaporPink uppercase tracking-wider mb-1">Source/Proof Image URL</label>
            <input required type="url" placeholder="https://i.imgur.com/..." className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
              value={formData.sourceImageUrl} onChange={(e) => setFormData({...formData, sourceImageUrl: e.target.value})} />
          </div>

          <div>
            <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-1">Source Type</label>
            <select className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
              value={formData.sourceType} onChange={(e) => setFormData({...formData, sourceType: e.target.value})}>
              <option value="Store page">Store Page Screenshot</option>
              <option value="Order receipt">Order Receipt</option>
              <option value="Item in hand">Item In Hand (Photo)</option>
              <option value="Archived Site">Archived Site / Wayback</option>
            </select>
          </div>
        </div>
      </div>

      {/* Optional Metadata */}
      <div className="space-y-4 border-t border-gray-700 pt-4">
        <h4 className="text-sm font-bold text-vaporCyan uppercase tracking-wider">Suggested Metadata (Optional)</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <input type="date" className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
            value={formData.releaseDate} onChange={(e) => setFormData({...formData, releaseDate: e.target.value})} />
          <input type="number" step="0.01" placeholder="Retail Price (USD)" className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText"
            value={formData.retailPrice} onChange={(e) => setFormData({...formData, retailPrice: e.target.value})} />
        </div>

        <textarea placeholder="Any additional notes or descriptions?" className="w-full bg-black p-2 rounded border border-gray-600 text-vaporText h-24"
          value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
      </div>

      <button disabled={loading} className="w-full bg-vaporCyan hover:bg-cyan-400 text-black font-black italic text-lg py-3 px-4 rounded transition-colors disabled:opacity-50">
        {loading ? 'UPLOADING TO MAINFRAME...' : 'SUBMIT FOR REVIEW'}
      </button>
    </form>
  );
}