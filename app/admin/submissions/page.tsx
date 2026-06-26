// app/admin/submissions/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all submissions, ordered by newest first
  const fetchSubmissions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('item_submissions')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching submissions:', error);
    } else if (data) {
      setSubmissions(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('item_submissions')
      .update({ 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', id);

    if (error) {
      alert('Failed to update status.');
      console.error(error);
    } else {
      // Refresh the list to show the updated status
      fetchSubmissions();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)] uppercase">
          Review Submissions
        </h1>
        <p className="text-vaporMuted mt-2">
          Verify community-submitted items and proof before adding them to the database.
        </p>
      </div>

      <div className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-vaporMuted">
          <thead className="bg-vaporBg text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">Images</th>
              <th className="px-6 py-4 font-medium">Item Details</th>
              <th className="px-6 py-4 font-medium">Suggested Data</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-vaporCyan animate-pulse">
                  Loading Submissions...
                </td>
              </tr>
            ) : submissions.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No submissions pending review.
                </td>
              </tr>
            ) : (
              submissions.map((sub) => (
                <tr key={sub.id} className="hover:bg-vaporCard/50 transition-colors">
                  
                  {/* Images Column */}
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <a href={sub.item_image_url} target="_blank" rel="noreferrer" className="block w-16 h-16 bg-black border border-vaporBorder rounded overflow-hidden hover:border-vaporCyan transition-colors" title="Item Image">
                        <img src={sub.item_image_url} alt="Item" className="w-full h-full object-cover" />
                      </a>
                      <a href={sub.source_image_url} target="_blank" rel="noreferrer" className="block w-16 h-16 bg-black border border-vaporBorder rounded overflow-hidden hover:border-vaporPink transition-colors flex items-center justify-center text-xs text-center" title="Proof Image">
                         <img src={sub.source_image_url} alt="Proof" className="w-full h-full object-cover" />
                      </a>
                    </div>
                  </td>

                  {/* Details Column */}
                  <td className="px-6 py-4">
                    <p className="font-bold text-vaporText text-base">{sub.name}</p>
                    <p className="text-vaporCyan text-xs uppercase tracking-wider">{sub.item_type}</p>
                    <p className="text-gray-500 text-xs mt-1">Proof: {sub.source_type}</p>
                    <p className="text-gray-600 text-xs mt-1">Submitted: {new Date(sub.created_at).toLocaleDateString()}</p>
                  </td>

                  {/* Suggested Meta Column */}
                  <td className="px-6 py-4">
                    <ul className="text-xs space-y-1">
                      {sub.suggested_data?.release_date && <li><span className="text-gray-500">Date:</span> {sub.suggested_data.release_date}</li>}
                      {sub.suggested_data?.retail_price && <li><span className="text-gray-500">Price:</span> ${sub.suggested_data.retail_price}</li>}
                      {sub.suggested_data?.description && <li className="truncate max-w-[200px]" title={sub.suggested_data.description}><span className="text-gray-500">Desc:</span> {sub.suggested_data.description}</li>}
                    </ul>
                  </td>

                  {/* Status Column */}
                  <td className="px-6 py-4">
                    {!sub.status || sub.status === 'pending' ? (
                      <span className="text-yellow-400 bg-yellow-400/10 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Pending</span>
                    ) : sub.status === 'approved' ? (
                      <span className="text-green-400 bg-green-400/10 border border-green-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Approved</span>
                    ) : (
                      <span className="text-red-400 bg-red-400/10 border border-red-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Rejected</span>
                    )}
                  </td>

                  {/* Actions Column */}
                  <td className="px-6 py-4 text-right space-y-2">
                    <div className="flex flex-col gap-2 items-end">
                      {(!sub.status || sub.status === 'pending') && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(sub.id, 'approved')}
                            className="text-green-400 hover:bg-green-400/10 px-3 py-1 rounded border border-green-500/30 text-xs font-bold transition-colors w-full md:w-auto text-center"
                          >
                            APPROVE
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(sub.id, 'rejected')}
                            className="text-red-400 hover:bg-red-400/10 px-3 py-1 rounded border border-red-500/30 text-xs font-bold transition-colors w-full md:w-auto text-center"
                          >
                            REJECT
                          </button>
                        </>
                      )}
                      
                      <Link 
                        href="/admin/items/new" 
                        className="text-vaporCyan hover:bg-vaporCyan/10 px-3 py-1 rounded border border-vaporCyan/30 text-xs font-bold transition-colors w-full md:w-auto text-center mt-2"
                        title="Manually copy this data to create a new item"
                      >
                        DRAFT ITEM &rarr;
                      </Link>
                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}