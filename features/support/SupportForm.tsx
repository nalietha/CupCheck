'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SupportForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    category: 'bug',
    subject: '',
    description: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase.from('support_tickets').insert([
        {
          user_id: user?.id,
          category: formData.category,
          subject: formData.subject,
          description: formData.description,
        }
      ]);

      if (error) throw error;
      alert("Ticket submitted! We'll look into it.");
      setFormData({ category: 'bug', subject: '', description: '' });
    } catch (err) {
      console.error(err);
      alert("Error submitting ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-900 p-6 rounded-lg border border-gray-700 space-y-4">
      <h3 className="text-xl font-bold text-cyan-400">Submit a Ticket</h3>
      
      <select 
        className="w-full bg-black p-2 rounded border border-gray-600 text-white"
        value={formData.category}
        onChange={(e) => setFormData({...formData, category: e.target.value})}
      >
        <option value="bug">Bug Report</option>
        <option value="suggestion">Feature Suggestion</option>
        <option value="data_error">Incorrect Cup Data</option>
      </select>

      <input 
        required
        placeholder="Subject"
        className="w-full bg-black p-2 rounded border border-gray-600 text-white"
        value={formData.subject}
        onChange={(e) => setFormData({...formData, subject: e.target.value})}
      />

      <textarea 
        required
        placeholder="Description"
        className="w-full bg-black p-2 rounded border border-gray-600 text-white h-32"
        value={formData.description}
        onChange={(e) => setFormData({...formData, description: e.target.value})}
      />

      <button 
        disabled={loading}
        className="w-full bg-pink-600 hover:bg-pink-500 text-white font-bold py-2 px-4 rounded transition-colors"
      >
        {loading ? 'Sending...' : 'Send Ticket'}
      </button>
    </form>
  );
}