import React from 'react';

export default function ArtistsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Artists</h1>
          <p className="text-gray-500 mt-1">Discover and search for artists.</p>
        </div>
        
        {/* Search Bar Placeholder */}
        <div className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search artists..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* Optional: Add a search icon SVG here */}
          </div>
        </div>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* TODO: Map through your fetched artists here.
          For now, here is a placeholder so you can see the layout.
        */}
        {[1, 2, 3, 4].map((placeholder) => (
          <div 
            key={placeholder} 
            className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 text-vaporMuted"
          >
            ArtistCard Component Here
          </div>
        ))}
      </div>
    </div>
  );
}