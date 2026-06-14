'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ItemCard from './ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';
import { uploadItemImages, saveItem, syncItemRelationships } from '@/lib/itemActions';
import { debug } from '@/lib/debug';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

export default function AdminItemForm({ initialData, itemId, onComplete }: AdminItemFormProps) {
  // Main form submission state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // 1. Metadata State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    item_type: initialData?.item_type || 'cup',
    collection_id: initialData?.collection_id || '',
    description: initialData?.description || '',
    retail_price: initialData?.retail_price || '',
    season: initialData?.season || '',
    artist: initialData?.artist || '',
    material: initialData?.material || '',
    limited: initialData?.limited || false,
    retired: initialData?.retired || false,
    image_url: initialData?.image_url || '',
  });

  const [selectedCreators, setSelectedCreators] = useState<string[]>(
    initialData?.item_creators?.map((ic: any) => ic.creator_id) || []
  );

  // 2. Images State
  const [itemImages, setItemImages] = useState<any[]>(
    initialData?.item_images?.sort((a: any, b: any) => a.display_order - b.display_order) || []
  );

  // TODO Split into manager files
  // --- SUBMISSION LOGIC ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    debug.info("Submitting with itemId:", itemId);
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      // Clean form data
      const cleanedData = {
        ...formData,
        season: formData.season || null,
        collection_id: formData.collection_id || null,
        description: formData.description || null,
        artist: formData.artist || null,
        material: formData.material || null,
        retail_price: formData.retail_price ? parseFloat(formData.retail_price) : null,
      };

      // Process images
      const processedImages = await uploadItemImages(itemImages);
      const primaryImageUrl = processedImages.length > 0 ? processedImages[0].url : formData.image_url;

      // Save Item (save manager handles update/insert logic)
      const savedItemId = await saveItem(itemId ?? null, {
        ...cleanedData,
        image_url: primaryImageUrl
      });

      // 3. Sync Relationships
      await syncItemRelationships(savedItemId, processedImages, selectedCreators);

      setSuccess(true);
      if (onComplete) onComplete();

      debug.verbose("Image upload successful", { url: primaryImageUrl });
    } catch (err: any) {
      // console.error(err);
      debug.error("Form submission failed", err);
      setErrorMsg(err.message || 'Failed to save item');
    } finally {
      setLoading(false);
    }
  };

  // Mock object for the live preview card
  const previewItem = {
    ...formData,
    id: itemId || 'preview',
    item_images: itemImages,
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col xl:flex-row gap-8 w-full max-w-[1600px] mx-auto">

      {/* COLUMN 1: LIVE PREVIEW */}
      <div className="w-full xl:w-1/4">
        <h2 className="text-xl font-bold text-neonPink mb-4 uppercase tracking-widest">Live Preview</h2>
        <div className="sticky top-24">
          <ItemCard item={previewItem} showAddButton={false} />
          {itemImages.length > 1 && (
            <p className="text-xs text-center text-gray-500 mt-4">
              Hover image registered! Mouse over the card to test.
            </p>
          )}
        </div>
      </div>

      {/* COLUMN 2: IMAGE DETAILS */}
      <AdminItemImageManager
        itemImages={itemImages}
        setItemImages={setItemImages}
      />

      {/* COLUMN 3: EDIT FORMS (METADATA) */}
      <div className="w-full xl:w-2/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white uppercase tracking-widest">Edit Forms</h2>
          <button
            type="submit"
            disabled={loading}
            className="bg-neonPink hover:bg-pink-600 text-white px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Item'}
          </button>
        </div>

        <AdminItemMetadataForm
          formData={formData}
          setFormData={setFormData}
          selectedCreators={selectedCreators}
          setSelectedCreators={setSelectedCreators}
        />

        {errorMsg && <div className="mt-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-200">{errorMsg}</div>}
        {success && <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg text-green-400">Item saved successfully!</div>}

      </div>
    </form>
  );
}