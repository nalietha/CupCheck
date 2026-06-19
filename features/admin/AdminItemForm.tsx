'use client';

import { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import ItemCard from '../../components/ItemCard';
import AdminItemImageManager from './AdminItemImageManager';
import AdminItemMetadataForm from './AdminItemMetadataForm';
import { uploadItemImages, saveItem, syncItemRelationships } from '@/lib/itemActions';
import { debug } from '@/lib/debug';

interface AdminItemFormProps {
  initialData?: any;
  itemId?: string;
  onComplete?: () => void;
}

const DEFAULT_PRICES: Record<string, number> = {
  cup: 25.00,
  tub: 40.00,
  shirt: 25.00, 
  merch: 20.00, 
  apparel: 40.00,
};

interface CreatorJoin {
  creators?: { id: string; name: string };
  creator?: { id: string; name: string };
  id?: string;
  name?: string;
}

const normalizeCreators = (creatorsData: CreatorJoin[]) => {
  if (!Array.isArray(creatorsData)) return [];

  return creatorsData.map((c: CreatorJoin) => {
    // 1. Handles legacy arrays of strings
    if (typeof c === 'string') return { name: c }; 
    
    // 2. Handles Supabase nested joins
    if (c.creators) return { id: c.creators.id, name: c.creators.name }; 
    if (c.creator) return { id: c.creator.id, name: c.creator.name }; 
    
    // 3. Standard expected object
    return { id: c.id || '', name: c.name || 'Unknown' }; 
  }).filter((c) => c.name !== 'Unknown');
};

export default function AdminItemForm({ initialData, itemId, onComplete }: AdminItemFormProps) {
  // Main form submission state
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [success, setSuccess] = useState(false);

  // Reference for the hidden file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Metadata State
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    item_type: initialData?.item_type || 'cup',
    collection_id: initialData?.collection_id || '',
    description: initialData?.description || '',
    retail_price: initialData?.retail_price || DEFAULT_PRICES['cup'],
    season: initialData?.season || '',
    release_date: initialData?.release_date || '',
    artist: initialData?.artist || '',
    material: initialData?.material || '',
    limited: initialData?.limited || false,
    retired: initialData?.retired || false,
    image_url: initialData?.image_url || '',
    parent_item_id: initialData?.parent_item_id || '',
    variant_type: initialData?.variant_type || 'standard',
    flavor_profile: initialData?.flavor_profile || '',
  });

  // Creator relationships state - SAFELY NORMALIZED
  const [selectedCreators, setSelectedCreators] = useState<{ id?: string, name: string }[]>(
    normalizeCreators(initialData?.creators)
  );

  // 2. Images State - SAFELY SORTED
  const [itemImages, setItemImages] = useState<any[]>(
    Array.isArray(initialData?.item_images)
      ? [...initialData.item_images].sort((a: any, b: any) => (a.display_order || 0) - (b.display_order || 0))
      : []
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
  const { name, value, type } = e.target;
  
  // Handle checkboxes
  if (type === 'checkbox') {
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: checked }));
    return;
  }

  // --- NEW LOGIC FOR DEFAULT PRICES ---
  if (name === 'item_type') {
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      // Automatically set the price based on the dictionary, default to 0 if not found
      retail_price: DEFAULT_PRICES[value] !== undefined ? DEFAULT_PRICES[value] : prev.retail_price
    }));
    return;
  }

  // Handle all other fields normally
  setFormData(prev => ({ ...prev, [name]: value }));
};

  const handleClearForm = () => {
    // Reset Metadata
    setFormData({
      name: '',
      item_type: 'cup',
      collection_id: '',
      description: '',
      retail_price: '25',
      season: '',
      release_date: '',
      artist: '',
      material: '',
      limited: true,
      retired: true,
      image_url: '',
      parent_item_id: '',
      variant_type: 'standard',
      flavor_profile: '',
    });

    // Reset Relationships and Images
    setSelectedCreators([]);
    setItemImages([]);

    // Clear UI messages
    setErrorMsg('');
    setSuccess(false);
  };

  // --- JSON UPLOAD LOGIC ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);

        // Map the uploaded JSON fields into the formData.
        // Falls back to empty string/false if the field is missing from the JSON.
        setFormData({
          name: json.name || '',
          item_type: json.type || 'cup',
          collection_id: json.collection || '',
          description: json.description || '',
          retail_price: json.releasePrice !== undefined && json.releasePrice !== null ? String(json.releasePrice) : '',
          season: json.season || '',
          release_date: json.releaseDate || '',
          artist: json.artists || '',
          material: json.material || '',
          limited: Boolean(json.limited),
          retired: Boolean(json.retired),
          image_url: json.url || '',
          parent_item_id: json.parentId || '',
          variant_type: json.variantType || 'standard',
          flavor_profile: json.flavorProfile || '',
          
        });

        // Parse creators if they exist
        if (json.creators) {
          let parsedCreators: { name: string }[] = [];
          if (Array.isArray(json.creators)) {
            parsedCreators = json.creators.map((c: any) => ({ name: typeof c === 'string' ? c : c.name }));
          } else if (typeof json.creators === 'string' && json.creators.trim() !== '') {
              parsedCreators = json.creators
                .split(',')
                .map((c: string) => ({ name: c.trim() }))
                .filter((c: { name: string }) => c.name.length > 0);
          }
          setSelectedCreators(parsedCreators);
        } else {
          setSelectedCreators([]);
        }

        setErrorMsg(''); // Clear any previous errors

      } catch (err) {
        debug.error("Failed to parse JSON metadata", err);
        setErrorMsg('Invalid JSON file. Please ensure it is formatted correctly.');
      }
    };
    reader.readAsText(file);

    // Reset the input value so the same file can be uploaded again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        material: formData.material || null,
        retail_price: formData.retail_price ? parseFloat(formData.retail_price as string) : null,
        parent_item_id: formData.parent_item_id.trim() === "" ? null : formData.parent_item_id,
        release_date: formData.release_date?.trim() === "" ? null : formData.release_date,
      };

      // Remove artist from cleaned data (handled in separate table)
      delete (cleanedData as any).artist;

      // Process images
      const processedImages = await uploadItemImages(itemImages);
      const primaryImageUrl = processedImages.length > 0 ? processedImages[0].url : formData.image_url;

      // --- NEW CREATOR LOGIC START ---
      const finalCreatorIds: string[] = [];
      for (const creator of selectedCreators) {
        if (creator.id) {
          finalCreatorIds.push(creator.id);
        } else {
          // It's a new creator, so we need to insert them into the database first
          const { data: newCreator } = await supabase
            .from('creators')
            .insert([{ name: creator.name }])
            .select('id')
            .single();

          if (newCreator) finalCreatorIds.push(newCreator.id);
        }
      }
      // --- NEW CREATOR LOGIC END ---

      // Save Item
      const savedItemId = await saveItem(itemId ?? null, {
        ...cleanedData,
        image_url: primaryImageUrl
      });

      const finalItemId = savedItemId?.id || savedItemId;

      if (finalItemId) {
        await supabase.from('item_artist').delete().eq('item_id', finalItemId);
        if (formData.artist) {
          await supabase.from('item_artist').insert({
            item_id: finalItemId,
            artist_id: formData.artist,
          });
        }
      }

      // 3. Sync Relationships using the resolved IDs
      await syncItemRelationships(finalItemId, processedImages, finalCreatorIds);

      setSuccess(true);
      if (onComplete) onComplete();

      debug.verbose("Image upload successful", { url: primaryImageUrl });
    } catch (err: any) {
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
    creators: selectedCreators // Added this so your ItemCard has access to the creators during preview
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
          <h2 className="text-xl font-bold text-vaporText uppercase tracking-widest">Edit Forms</h2>
          <div className="flex gap-2">
            {/* Hidden file input for metadata JSON */}
            <input
              type="file"
              accept=".json"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-purple-700 hover:bg-purple-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all"
            >
              Upload JSON
            </button>

            <button
              type="button"
              onClick={handleClearForm}
              className="bg-gray-700 hover:bg-gray-600 text-vaporText px-4 py-2 rounded-lg font-bold transition-all"
            >
              Clear
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-neonPink hover:bg-pink-600 text-vaporText px-6 py-2 rounded-lg font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Item'}
            </button>
          </div>
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