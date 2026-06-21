'use client';

import React from 'react';
import Link from 'next/link';
import AdminList from './AdminList';

interface ArtistLink {
  [key: string]: string;
}

interface AdminArtist {
  id: string;
  name: string;
  image_url?: string;
  links?: ArtistLink;
}

interface AdminArtistListProps {
  artists: AdminArtist[];
}

export default function AdminArtistList({ artists }: AdminArtistListProps) {
  return (
    <div className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-lg">
      <AdminList
        title="Artist Directory"
        items={artists}
        editBaseUrl="/admin/artists/edit"
        columns={[
          {
            header: "Avatar",
            accessor: (a) => (
              <img src={a.image_url || '/default.png'} className="w-10 h-10 rounded-full" />
            )
          },
          {
            header: "Name",
            accessor: (a) => <span className="font-bold text-vaporText">{a.name}</span>
          },
          {
            header: "Links",
            accessor: (a) => Object.keys(a.links || {}).length + " platforms"
          }
        ]}
      />
    </div>
  );
}