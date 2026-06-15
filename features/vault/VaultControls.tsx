interface VaultControlsProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  filterType: string;
  setFilterType: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  uniqueItemTypes: string[];
}

export default function VaultControls({
  searchQuery, setSearchQuery, filterType, setFilterType, sortBy, setSortBy, uniqueItemTypes
}: VaultControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <input 
        type="text" 
        placeholder="Search items..." 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-lg"
      />
      <select 
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-lg"
      >
        <option value="all">All Types</option>
        {uniqueItemTypes.map(type => <option key={type} value={type}>{type}</option>)}
      </select>
      <select 
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value)}
        className="bg-gray-900 border border-gray-800 text-white px-4 py-2 rounded-lg"
      >
        <option value="newest">Newest Added</option>
        <option value="oldest">Oldest Added</option>
        <option value="price-desc">Highest Price</option>
        <option value="price-asc">Lowest Price</option>
      </select>
    </div>
  );
}