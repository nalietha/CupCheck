'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import ItemCard from './ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

async function getOrCreateArtist(artistName: string) {
  // 1. Try to find the artist by name
  const { data: existingArtist, error: findError } = await supabase
    .from('artists')
    .select('id')
    .eq('name', artistName)
    .single();

  if (existingArtist) {
    return existingArtist.id;
  }

  // 2. If not found, create the artist
  const { data: newArtist, error: createError } = await supabase
    .from('artists')
    .insert([{ name: artistName }])
    .select('id')
    .single();

  if (createError) {
    console.error("Error creating artist:", createError);
    throw new Error("Could not create artist");
  }

  return newArtist.id;
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

  // --- SUBMISSION LOGIC ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setSuccess(false);

    try {
      let primaryImageUrl = formData.image_url;

      // Step 1: Upload new files to Supabase Storage
      const processedImages = await Promise.all(itemImages.map(async (img, idx) => {
        if (img.isNew && img.file) {
          const fileExt = img.file.name.split('.').pop();
          const fileName = `${Math.random()}.${fileExt}`;
          const filePath = `items/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('item-images') 
            .upload(filePath, img.file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('item-images')
            .getPublicUrl(filePath);

          return { url: publicUrl, display_order: idx };
        }
        return { url: img.url, display_order: idx };
      }));

      // Ensure the legacy image_url column always has the primary image
      if (processedImages.length > 0) {
        primaryImageUrl = processedImages[0].url;
      }

      // Step 2: Insert or Update the Main Item
      const itemPayload = {
        ...formData,
        image_url: primaryImageUrl,
      };

      let savedItemId = itemId;

      if (itemId) {
        const { error } = await supabase.from('items').update(itemPayload).eq('id', itemId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('items').insert([itemPayload]).select().single();
        if (error) throw error;
        savedItemId = data.id;
      }

      // Step 3: Sync item_images table
      if (savedItemId) {
        await supabase.from('item_images').delete().eq('item_id', savedItemId);

        if (processedImages.length > 0) {
          const imageInserts = processedImages.map(img => ({
            item_id: savedItemId,
            url: img.url,
            display_order: img.display_order
          }));
          const { error: imgError } = await supabase.from('item_images').insert(imageInserts);
          if (imgError) console.error("Error saving to item_images:", imgError);
        }

        // Step 4: Sync item_creators table
        await supabase.from('item_creators').delete().eq('item_id', savedItemId);
        if (selectedCreators.length > 0) {
          const creatorInserts = selectedCreators.map(cid => ({
            item_id: savedItemId,
            creator_id: cid
          }));
          const { error: creError } = await supabase.from('item_creators').insert(creatorInserts);
          if (creError) console.error("Error saving to item_creators:", creError);
        }
      }

      setSuccess(true);
      if (onComplete) onComplete();
    } catch (err: any) {
      console.error(err);
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