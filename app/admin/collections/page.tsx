'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

// TODO: move to types/index.tsx
// Define our TypeScript type based on your schema
type Collection = {
    id: string;
    name: string;
    slug: string;
    year: number;
    type: string;
    description: string;
    is_active: boolean;
};

export default function ManageCollectionsPage() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);

    const initialFormState = {
        name: '',
        slug: '',
        year: new Date().getFullYear(),
        type: 'Season',
        description: '',
        is_active: true
    };
    const [formData, setFormData] = useState(initialFormState);

    // Fetch collections on load
    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        const { data, error } = await supabase
            .from('collections')
            .select('*')
            .order('year', { ascending: false })
            .order('name', { ascending: true });

        if (error) console.error("Error fetching collections:", error);
        else if (data) setCollections(data as Collection[]);
    };

    // Auto-generate a URL-friendly slug when the name changes
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setFormData(prev => ({
            ...prev,
            name: newName,
            // Only auto-update slug if we are creating a NEW collection
            slug: editingId ? prev.slug : newName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const payload = {
            name: formData.name,
            slug: formData.slug,
            year: formData.year,
            type: formData.type,
            description: formData.description,
            is_active: formData.is_active
        };

        if (editingId) {
            // UPDATE existing
            const { error } = await supabase.from('collections').update(payload).eq('id', editingId);
            if (error) console.error("Update error:", error);
        } else {
            // INSERT new
            const { error } = await supabase.from('collections').insert([payload]);
            if (error) console.error("Insert error:", error);
        }

        await fetchCollections(); // Refresh the list
        setFormData(initialFormState); // Reset form
        setEditingId(null);
        setLoading(false);
    };

    const handleEditClick = (col: Collection) => {
        setEditingId(col.id);
        setFormData({
            name: col.name,
            slug: col.slug,
            year: col.year,
            type: col.type,
            description: col.description || '',
            is_active: col.is_active
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN: The Form */}
            <div className="lg:col-span-1">
                <form onSubmit={handleSubmit} className="bg-[#1A1625] p-6 rounded-xl border border-vaporBorder space-y-4 sticky top-6">
                    <h2 className="text-2xl font-bold text-vaporPink mb-4">
                        {editingId ? 'Edit Collection' : 'New Collection'}
                    </h2>

                    <div>
                        <label className="block text-vaporMuted text-sm mb-1">Collection Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={handleNameChange}
                            placeholder="e.g. Season 4"
                            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-vaporMuted text-sm mb-1">URL Slug</label>
                        <input
                            required
                            type="text"
                            value={formData.slug}
                            onChange={(e) => setFormData({...formData, slug: e.target.value})}
                            placeholder="season-4"
                            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-vaporMuted text-sm mb-1">Year</label>
                            <input
                                required
                                type="number"
                                value={formData.year}
                                onChange={(e) => setFormData({...formData, year: parseInt(e.target.value)})}
                                className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-vaporMuted text-sm mb-1">Type</label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({...formData, type: e.target.value})}
                                className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                            >
                                <option value="Season">Season</option>
                                <option value="Creator">Creator Collab</option>
                                <option value="Special">Special / Event</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-vaporMuted text-sm mb-1">Description (Optional)</label>
                        <textarea
                            rows={3}
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full bg-[#0A0710] border border-vaporBorder rounded p-2 text-white focus:border-vaporCyan outline-none"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="is_active"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                            className="w-4 h-4 accent-vaporCyan"
                        />
                        <label htmlFor="is_active" className="text-vaporMuted text-sm">Active & Visible to Users</label>
                    </div>

                    <div className="flex gap-2 pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-vaporCyan text-[#0B0914] font-bold py-2 rounded hover:opacity-80 transition-all disabled:opacity-50"
                        >
                            {loading ? 'SAVING...' : (editingId ? 'UPDATE' : 'CREATE')}
                        </button>
                        
                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="px-4 bg-transparent border border-vaporPink text-vaporPink font-bold py-2 rounded hover:bg-vaporPink hover:text-[#0B0914] transition-all"
                            >
                                CANCEL
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* RIGHT COLUMN: The List of Collections */}
            <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-white border-b border-vaporBorder pb-2">Existing Collections</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {collections.map((col) => (
                        <div key={col.id} className="bg-[#1A1625] p-4 rounded border border-vaporBorder hover:border-vaporCyan transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        {col.name}
                                        {!col.is_active && <span className="text-[10px] bg-red-900/50 text-red-400 px-2 py-1 rounded">INACTIVE</span>}
                                    </h3>
                                    <p className="text-xs text-vaporMuted font-mono">/{col.slug}</p>
                                </div>
                                <button 
                                    onClick={() => handleEditClick(col)}
                                    className="text-xs bg-[#2A2438] text-vaporCyan px-3 py-1 rounded hover:bg-vaporCyan hover:text-[#0B0914] font-bold transition-all"
                                >
                                    EDIT
                                </button>
                            </div>
                            
                            <div className="flex gap-2 mt-3 text-xs">
                                <span className="bg-[#0A0710] px-2 py-1 rounded text-gray-400">Year: {col.year}</span>
                                <span className="bg-[#0A0710] px-2 py-1 rounded text-gray-400">Type: {col.type}</span>
                            </div>
                        </div>
                    ))}
                    
                    {collections.length === 0 && !loading && (
                        <p className="text-vaporMuted italic col-span-full">No collections found. Create your first one on the left!</p>
                    )}
                </div>
            </div>

        </div>
    );
}