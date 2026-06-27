'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTickets = async () => {
    setLoading(true);
    
    // Uses standard join syntax. 
    const { data, error } = await supabase
      .from('support_tickets')
      .select(`
        *,
        profiles (username)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      // Extracts the actual readable message instead of an empty object
      console.error('Error fetching tickets:', error.message || JSON.stringify(error));
      setTickets([]); // Gracefully fall back to an empty state
    } else {
      // Ensure we always set an array, even if data is returned as null
      setTickets(data || []);
    }
    
    setLoading(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase
      .from('support_tickets')
      .update({ status: newStatus })
      .eq('id', id);

    if (error) {
      alert('Failed to update ticket status.');
      console.error(error);
    } else {
      fetchTickets();
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-black italic tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-vaporCyan to-vaporPink drop-shadow-[0_0_10px_rgba(1,205,254,0.3)] uppercase">
          Support Tickets
        </h1>
        <p className="text-vaporMuted mt-2">
          Manage and resolve bug reports, suggestions, and data errors submitted by users.
        </p>
      </div>

      <div className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-lg">
        <table className="w-full text-left text-sm text-vaporMuted">
          <thead className="bg-vaporBg text-gray-300 uppercase">
            <tr>
              <th className="px-6 py-4 font-medium">User</th>
              <th className="px-6 py-4 font-medium">Ticket Details</th>
              <th className="px-6 py-4 font-medium">Description</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-vaporCyan animate-pulse">
                  Loading Tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No active support tickets.
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-vaporCard/50 transition-colors">
                  
                  <td className="px-6 py-4">
                    {ticket.profiles?.username ? (
                      <Link href={`/vault/${ticket.profiles.username}`} className="text-vaporCyan hover:underline font-bold">
                        @{ticket.profiles.username}
                      </Link>
                    ) : (
                      <span className="text-gray-500 italic">Anonymous</span>
                    )}
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-bold text-vaporText text-base">{ticket.subject}</p>
                    <p className="text-vaporPink text-xs uppercase tracking-wider">{ticket.category}</p>
                    <p className="text-gray-600 text-xs mt-1">{new Date(ticket.created_at).toLocaleDateString()}</p>
                  </td>

                  <td className="px-6 py-4">
                    <p className="text-sm max-w-sm whitespace-pre-wrap">
                      {ticket.description}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    {!ticket.status || ticket.status === 'open' ? (
                      <span className="text-yellow-400 bg-yellow-400/10 border border-yellow-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Open</span>
                    ) : ticket.status === 'resolved' ? (
                      <span className="text-green-400 bg-green-400/10 border border-green-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Resolved</span>
                    ) : (
                      <span className="text-gray-400 bg-gray-400/10 border border-gray-500/20 px-2 py-1 rounded text-xs font-bold uppercase">Closed</span>
                    )}
                  </td>

                  <td className="px-6 py-4 text-right space-y-2">
                    <div className="flex flex-col gap-2 items-end">
                      {(!ticket.status || ticket.status === 'open') && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'resolved')}
                          className="text-green-400 hover:bg-green-400/10 px-3 py-1 rounded border border-green-500/30 text-xs font-bold transition-colors w-full md:w-auto text-center"
                        >
                          RESOLVE
                        </button>
                      )}
                      {ticket.status !== 'closed' && (
                        <button
                          onClick={() => handleUpdateStatus(ticket.id, 'closed')}
                          className="text-gray-400 hover:bg-gray-400/10 px-3 py-1 rounded border border-gray-500/30 text-xs font-bold transition-colors w-full md:w-auto text-center"
                        >
                          CLOSE
                        </button>
                      )}
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