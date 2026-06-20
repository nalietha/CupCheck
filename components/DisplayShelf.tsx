// components/DisplayShelf.tsx
import Link from 'next/link';
import ItemCard from '../features/items/ItemCard'; 

interface DisplayShelfProps {
  title: string;
  items: any[]; 
  emptyMessage?: string;
  viewAllHref?: string; 
}

export default function DisplayShelf({ title, items, emptyMessage = "This shelf is empty.", viewAllHref }: DisplayShelfProps) {
  return (
    <div className="mb-12">
      {/* Shelf Header */}
      <div className="flex items-center mb-4">
        <h2 className="text-2xl font-bold text-pink-400 uppercase tracking-wider">{title}</h2>
        <div className="ml-4 flex-grow h-px bg-gradient-to-r from-pink-500 to-transparent"></div>
        {/* Render the View All link if a URL is provided */}
        {viewAllHref && (
          <Link 
            href={viewAllHref} 
            className="ml-4 text-sm font-bold text-vaporCyan hover:text-vaporPink transition-colors uppercase tracking-wider flex-shrink-0"
          >
            View All &rarr;
          </Link>
        )}
      </div>

      {/* The Shelf Display */}
      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pb-4 border-b-[16px] border-vaporBorder rounded-b shadow-[0_10px_20px_-5px_rgba(6,182,212,0.3)]">
          {items.map((item) => (
            <div key={item.id} className="flex justify-center transition-transform hover:-translate-y-2">
              <ItemCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <div className="w-full py-8 text-center border-b-[16px] border-vaporBorder rounded-b">
          <p className="text-gray-500 italic">{emptyMessage}</p>
        </div>
      )}
    </div>
  );
}