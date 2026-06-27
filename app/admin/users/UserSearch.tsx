'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function UserSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const [roleFilter, setRoleFilter] = useState(searchParams.get('role') || 'all');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || 'all');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('q', searchTerm.trim());
    if (roleFilter !== 'all') params.set('role', roleFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);

    router.push(`/admin/users?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="bg-vaporCard p-4 rounded-lg border border-vaporBorder mb-6 flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Search by username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-2 rounded focus:outline-none focus:border-vaporPink"
      />
      
      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-2 rounded focus:outline-none focus:border-vaporPink"
      >
        <option value="all">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
        className="bg-[#0A0710] border border-vaporBorder text-vaporText px-4 py-2 rounded focus:outline-none focus:border-vaporPink"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
        <option value="banned">Banned</option>
      </select>

      <button
        type="submit"
        className="bg-vaporPink text-[#0B0914] px-6 py-2 rounded font-bold hover:bg-white transition-all shadow-[0_0_10px_rgba(236,72,153,0.3)]"
      >
        FILTER
      </button>
    </form>
  );
}