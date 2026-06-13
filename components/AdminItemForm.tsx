'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface Item {
  id: string;
  name: string;
  item_type: string;
  collection_id?: string | null;
  description?: string | null;
  retail_price?: number | string | null;
  limited?: boolean | null;
}

export default function AdminItemForm({ initialData = null }: { initialData?: Item | null }) {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [imageFiles, setImageFiles] = useState<FileList | null>(null);
    const [collections, setCollections] = useState<{ id: string, name: string }[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        item_type: 'cup',
        collection_id: '',
        description: '',
        retail_price: '',
        limited: false,
    });

    useEffect(() => {
        const fetchCollections = async () => {
            const { data } = await supabase.from('collections').select('id, name');
            if (data) setCollections(data);
        };
        fetchCollections();
    }, []);

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                item_type: initialData.item_type || 'cup',
                collection_id: initialData.collection_id || '',
                description: initialData.description || '',
                retail_price: initialData.retail_price?.toString() || '',
                limited: initialData.limited || false,
            });
        }
    }, [initialData]);

    const DEFAULT_PRICES: Record<string, string> = {
        cup: '24.99',
        tub: '39.99',
        apparel: '24.99',
        accessory: '9.99',
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSuccess(false);

        const imageUrls: string[] = [];

        // 1. Upload all files
        if (imageFiles) {
            for (let i = 0; i < imageFiles.length; i++) {
                const file = imageFiles[i];
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
                const filePath = `cups/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('cup-images')
                    .upload(filePath, file);

                if (!uploadError) {
                    const { data } = supabase.storage.from('cup-images').getPublicUrl(filePath);
                    imageUrls.push(data.publicUrl);
                }
            }
        }

        // 2. Insert the item
        const { data: newItem, error: itemError } = await supabase
            .from('items')
            .insert({
                name: formData.name,
                item_type: formData.item_type,
                collection_id: formData.collection_id || null, // Ensure empty strings are treated as null
                description: formData.description,
                retail_price: formData.retail_price ? parseFloat(formData.retail_price) : null,
                limited: formData.limited,
                image_url: imageUrls[0] || null,
            })
            .select()
            .single();

        // 3. Insert remaining images into a gallery table (if you have one)
        if (newItem && imageUrls.length > 1) {
            const galleryItems = imageUrls.slice(1).map(url => ({
                item_id: newItem.id,
                image_url: url
            }));
            await supabase.from('item_images').insert(galleryItems);
        }

        if (itemError) {
            console.error("Database error:", itemError);
        } else {
            setSuccess(true);
            // FIXED: Added collection_id to the reset
            setFormData({ name: '', item_type: 'cup', collection_id: '', description: '', retail_price: '', limited: false });
            setImageFiles(null);
        }
        setLoading(false);
    };

    const handleTypeChange = (value: string) => {
        setFormData(prev => ({
            ...prev,
            item_type: value,
            retail_price: prev.retail_price === '' ? DEFAULT_PRICES[value] || '' : prev.retail_price
        }));
    };

    return (
        <form onSubmit={handleSubmit} className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder space-y-4">
            <h2 className="text-2xl font-bold text-vaporPink mb-4">Add New Item to Catalog</h2>

            <div>
                <label className="block text-vaporMuted text-sm mb-1">Item Image</label>
                <input
                    type="file"
                    multiple accept="image/*"
                    onChange={(e) => setImageFiles(e.target.files)}
                    className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-bold file:bg-vaporCyan file:text-[#0B0914] hover:file:bg-white transition-all"
                />
            </div>

            <div>
                <label className="block text-vaporMuted text-sm mb-1">Item Name</label>
                <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-vaporMuted text-sm mb-1">Item Type</label>
                    <select
                        value={formData.item_type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                    >
                        <option value="cup">Waifu Cup</option>
                        <option value="tub">Energy Tub</option>
                        <option value="apparel">Apparel</option>
                        <option value="accessory">Accessory</option>
                    </select>
                </div>

                <div>
                    <label className="block text-vaporMuted text-sm mb-1">Retail Price ($)</label>
                    <input
                        type="number"
                        step="0.01"
                        value={formData.retail_price}
                        onChange={(e) => setFormData({ ...formData, retail_price: e.target.value })}
                        placeholder={DEFAULT_PRICES[formData.item_type]}
                        className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                    />
                </div>
            </div>

            {/* NEW: Added the Collection Dropdown to the UI */}
            <div>
                <label className="block text-vaporMuted text-sm mb-1">Collection / Season</label>
                <select
                    value={formData.collection_id}
                    onChange={(e) => setFormData({ ...formData, collection_id: e.target.value })}
                    className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                >
                    <option value="">No Collection</option>
                    {collections.map((col) => (
                        <option key={col.id} value={col.id}>{col.name}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-vaporMuted text-sm mb-1">Description</label>
                <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                />
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="limited"
                    checked={formData.limited}
                    onChange={(e) => setFormData({ ...formData, limited: e.target.checked })}
                    className="w-4 h-4 accent-vaporCyan"
                />
                <label htmlFor="limited" className="text-vaporMuted text-sm">Is this a Limited Edition item?</label>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-vaporCyan text-[#0B0914] font-bold py-3 rounded hover:opacity-80 transition-all mt-4 disabled:opacity-50"
            >
                {loading ? 'UPLOADING & SAVING...' : 'PUBLISH ITEM'}
            </button>

            {success && <p className="text-green-400 text-center text-sm font-bold mt-2">Item added successfully!</p>}
        </form>
    );
}