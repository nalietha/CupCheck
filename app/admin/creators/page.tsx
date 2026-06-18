import React from 'react';

export default function CreatorsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header & Search Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Creators</h1>
          <p className="text-gray-500 mt-1">Browse all content creators.</p>
        </div>
        
        {/* Search Bar Placeholder */}
        <div className="w-full md:w-96">
          <div className="relative">
            <input
              type="text"
              placeholder="Search creators..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Grid Layout for Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* TODO: Map through your fetched creators here.
        */}
        {[1, 2, 3, 4, 5, 6].map((placeholder) => (
          <div 
            key={placeholder} 
            className="h-64 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 text-vaporMuted"
          >
            CreatorCard Component Here
          </div>
        ))}
      </div>
    </div>
  );
}