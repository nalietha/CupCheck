'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Profiles = {
    id: string;
    username: string;
    role: string;
    created_at: string;
};

export default function ManageUsersPage() {
    const [users, setUsers] = useState<Profiles[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('profiles')
            .select('id, username, role, created_at')
            .order('created_at', { ascending: false });

        if (error) console.error("Error fetching users:", error);
        if (data) setUsers(data as Profiles[]);
        setLoading(false);
    };

    const handleRoleChange = async (userId: string, newRole: string) => {
        // Because of our SQL policies, only admins can do this!
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId);

        if (error) {
            console.error("Failed to update role:", error);
            alert("Error updating role. Check console.");
        } else {
            // Update local state so UI reflects the change immediately
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        }
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-vaporPink border-b border-vaporBorder pb-2">Manage Users</h2>
            
            <div className="bg-[#1A1625] rounded-xl border border-vaporBorder overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-[#0A0710] text-vaporMuted text-sm">
                        <tr>
                            <th className="p-4 font-normal">Username</th>
                            <th className="p-4 font-normal">Joined</th>
                            <th className="p-4 font-normal">Role</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-vaporBorder">
                        {loading ? (
                            <tr><td colSpan={3} className="p-4 text-center text-vaporMuted">Loading users...</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="hover:bg-[#2A2438] transition-colors">
                                <td className="p-4 text-white font-bold">{user.username || 'Unnamed User'}</td>
                                <td className="p-4 text-gray-400 text-sm">
                                    {new Date(user.created_at).toLocaleDateString()}
                                </td>
                                <td className="p-4">
                                    <select
                                        value={user.role || 'user'}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                        className={`bg-[#0A0710] border rounded p-1 text-sm font-bold outline-none cursor-pointer ${
                                            user.role === 'admin' ? 'border-vaporPink text-vaporPink' : 'border-vaporBorder text-vaporCyan'
                                        }`}
                                    >
                                        <option value="user">User</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}