'use client';
import React from 'react';
import Link from 'next/link';

// Reusing the type from above for the example
import { Artist } from '../artists/ArtistCard'; 

interface AdminArtistListProps {
  artists: Artist[];
}

export default function AdminArtistList({ artists }: AdminArtistListProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
            <tr>
              <th scope="col" className="px-6 py-3 w-16">Avatar</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Registered Sites</th>
              <th scope="col" className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {artists.map((artist) => (
              <tr key={artist.id} className="bg-white border-b hover:bg-gray-50">
                <td className="px-6 py-4">
                  {artist.image_url ? (
                    <img src={artist.image_url} alt="" className="w-10 h-10 rounded-full object-cover" />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500 text-xs">NA</span>
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">
                  {artist.name}
                </td>
                <td className="px-6 py-4">
                  {/* Quick summary of sites for the admin */}
                  <div className="flex gap-2">
                    {artist.sites?.map((site, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                        {site.platform}
                      </span>
                    ))}
                    {(!artist.sites || artist.sites.length === 0) && (
                      <span className="text-gray-400 italic">None</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right space-x-3">
                  <Link 
                    href={`/admin/artists/${artist.id}/edit`} 
                    className="font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button 
                    onClick={() => console.log('Delete logic here', artist.id)}
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}