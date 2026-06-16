'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function AdminUserForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    role: profile.role || 'user',
    status: profile.status || 'active',
  });

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ role: formData.role, status: formData.status })
      .eq('id', profile.id);

    setLoading(false);
    if (error) alert('Error updating user');
    else alert('User updated successfully!');
  };

  return (
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4 text-pink-400">Account Settings</h2>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm text-gray-400 mb-1">Role</label>
          <select 
            value={formData.role} 
            onChange={(e) => setFormData({...formData, role: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
          >
            <option value="user">User</option>
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-400 mb-1">Status</label>
          <select 
            value={formData.status} 
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full bg-gray-800 border border-gray-700 rounded p-2 text-white"
          >
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>
        </div>
      </div>

      <button 
        onClick={handleUpdate} 
        disabled={loading}
        className="bg-pink-600 hover:bg-pink-500 text-white px-4 py-2 rounded"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
}