'use client';

import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminUserManagementPage({ params }: { params: Promise<{ username: string }> }) {
  const resolvedParams = use(params);
  const targetUsername = decodeURIComponent(resolvedParams.username);

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    role: 'user',
    status: 'active',
    subscription_tier: 'free',
    display_name: '',
    bio: '',
  });

  const loadUserProfile = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .ilike('username', targetUsername)
      .single();

    if (data) {
      setProfile(data);
      setFormData({
        role: data.role || 'user',
        status: data.status || 'active',
        subscription_tier: data.subscription_tier || 'free',
        display_name: data.display_name || '',
        bio: data.bio || '',
      });
    } else {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUserProfile();
  }, [targetUsername]);

  const handleSaveChanges = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from('profiles')
      .update({
        role: formData.role,
        status: formData.status,
        subscription_tier: formData.subscription_tier,
        display_name: formData.display_name,
        bio: formData.bio,
      })
      .eq('id', profile.id);

    if (error) {
      alert('Failed to update user profile.');
    } else {
      alert('User profile synchronized.');
      loadUserProfile();
    }
    setIsSaving(false);
  };

  const handleSanitizeIdentity = () => {
    setFormData({
      ...formData,
      display_name: 'Restricted User',
      bio: 'This profile has been restricted by a moderator due to a policy violation.',
    });
  };

  const handleSoftDelete = () => {
    if (confirm("Flag this account for deletion? Data will be retained for 30 days before permanent erasure.")) {
      setFormData({
        ...formData,
        status: 'pending_deletion'
      });
    }
  };

  if (loading) return <div className="p-8 text-vaporCyan animate-pulse">Accessing User Data...</div>;
  if (!profile) return <div className="p-8 text-red-500">User record not found in the database.</div>;

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 w-full text-vaporText">
      
      <div className="mb-8 border-b border-vaporBorder pb-6 flex justify-between items-end">
        <div>
          <Link href="/admin/users" className="text-vaporCyan hover:underline font-bold text-sm tracking-wider uppercase mb-2 block">
            &larr; Return to Directory
          </Link>
          <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink uppercase">
            Manage User: @{profile.username}
          </h1>
          <p className="text-vaporMuted mt-1">ID: {profile.id}</p>
        </div>
        <Link 
          href={`/vault/${profile.username}`}
          target="_blank"
          className="bg-transparent border border-vaporCyan text-vaporCyan hover:bg-vaporCyan hover:text-black px-4 py-2 rounded font-bold uppercase tracking-widest text-xs transition-colors"
        >
          Inspect Vault
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        <div className="space-y-8">
          <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder shadow-lg">
            <h2 className="text-xl font-bold text-vaporCyan mb-4 uppercase tracking-wider">Access & Privileges</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">System Role</label>
                <select 
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan transition-colors"
                >
                  <option value="user">Standard User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Account Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan transition-colors"
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended (Temp)</option>
                  <option value="banned">Banned (Permanent)</option>
                  <option value="pending_deletion">Pending Deletion (30 Days)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Support Tier</label>
                <select 
                  value={formData.subscription_tier}
                  onChange={(e) => setFormData({...formData, subscription_tier: e.target.value})}
                  className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporCyan transition-colors"
                >
                  <option value="free">Free Tier</option>
                  <option value="supporter">Supporter</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-vaporCard p-6 rounded-xl border border-vaporBorder shadow-lg">
            <h2 className="text-xl font-bold text-vaporPink mb-4 uppercase tracking-wider flex justify-between items-center">
              Public Identity
              <button 
                onClick={handleSanitizeIdentity}
                className="text-[10px] bg-red-900/40 text-red-400 border border-red-500/50 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-colors"
              >
                RESTRICT IDENTITY
              </button>
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Display Name</label>
                <input 
                  type="text"
                  value={formData.display_name}
                  onChange={(e) => setFormData({...formData, display_name: e.target.value})}
                  className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporPink transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-vaporMuted uppercase tracking-wider mb-2">Profile Tagline / Bio</label>
                <textarea 
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  className="w-full bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-3 rounded focus:outline-none focus:border-vaporPink transition-colors resize-none"
                />
              </div>
            </div>
          </div>
        </div>

      </div>

      <div className="mt-8 bg-black/40 p-6 rounded-xl border border-vaporBorder flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg">
        <button 
          onClick={handleSoftDelete}
          className="w-full md:w-auto px-6 py-3 border border-red-500 text-red-500 font-bold uppercase tracking-widest text-sm rounded hover:bg-red-500 hover:text-white transition-all"
        >
          Flag For Deletion
        </button>
        
        <button 
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="w-full md:w-auto px-10 py-3 bg-gradient-to-r from-vaporCyan to-vaporPink text-[#0B0914] font-black uppercase tracking-widest rounded transition-all shadow-[0_0_15px_rgba(1,205,254,0.4)] disabled:opacity-50"
        >
          {isSaving ? 'TRANSMITTING...' : 'COMMIT CHANGES'}
        </button>
      </div>

    </div>
  );
}