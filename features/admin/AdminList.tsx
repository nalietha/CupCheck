'use client';

import React from 'react';
import Link from 'next/link';

interface AdminListProps<T> {
  title: string;
  items: T[];
  columns: {
    header: string;
    accessor: (item: T) => React.ReactNode;
  }[];
  editBaseUrl: string;
}

export default function AdminList<T extends { id: string }>({ 
  title, 
  items, 
  columns, 
  editBaseUrl 
}: AdminListProps<T>) {
  return (
    <div className="bg-vaporCard border border-vaporBorder rounded-xl overflow-hidden shadow-lg">
      <div className="p-6 border-b border-vaporBorder bg-vaporBg/50">
        <h2 className="text-xl font-bold text-vaporText uppercase tracking-wider">{title}</h2>
      </div>
      <table className="w-full text-left text-sm text-vaporMuted">
        <thead className="bg-vaporBg text-gray-300 uppercase">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-6 py-4 font-medium">{col.header}</th>
            ))}
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800">
          {items.map((item) => (
            <tr key={item.id} className="hover:bg-vaporCard/50 transition-colors">
              {columns.map((col, i) => (
                <td key={i} className="px-6 py-4">{col.accessor(item)}</td>
              ))}
              <td className="px-6 py-4 text-right">
                <Link
                  href={`${editBaseUrl}/${item.id}`}
                  className="text-vaporCyan hover:text-cyan-300 font-bold underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-8 text-center">
                No entries found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}