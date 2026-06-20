// components/Pagination.tsx
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    return `/?${params.toString()}`;
  };

  return (
    <div className="flex space-x-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link 
          href={createPageURL(currentPage - 1)}
          className="px-4 py-2 bg-black/40 border border-vaporBorder text-vaporMuted hover:text-vaporCyan hover:border-vaporCyan transition-colors rounded"
        >
          &larr; Prev
        </Link>
      ) : (
        <span className="px-4 py-2 border border-transparent text-gray-600 cursor-not-allowed">
          &larr; Prev
        </span>
      )}

      {/* Page Indicator */}
      <div className="px-4 py-2 font-bold text-vaporPink">
        Page {currentPage} of {totalPages}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageURL(currentPage + 1)}
          className="px-4 py-2 bg-black/40 border border-vaporBorder text-vaporMuted hover:text-vaporCyan hover:border-vaporCyan transition-colors rounded"
        >
          Next &rarr;
        </Link>
      ) : (
        <span className="px-4 py-2 border border-transparent text-gray-600 cursor-not-allowed">
          Next &rarr;
        </span>
      )}
    </div>
  );
}