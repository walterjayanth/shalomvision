
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Users as UsersIcon, ShieldCheck } from 'lucide-react';

const roleColors = {
  super_admin: 'bg-red-100 text-red-800',
  admin: 'bg-orange-100 text-orange-800', // Changed from rose to orange
  editor: 'bg-blue-100 text-blue-800',
  member: 'bg-slate-100 text-slate-800',
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [usersData, me] = await Promise.all([
          User.list(),
          User.me()
        ]);
        setUsers(usersData);
        setCurrentUser(me);
      } catch (error) {
        console.error("Error loading users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    // Prevent changing your own role or a super admin's role if you're not one
    const targetUser = users.find(u => u.id === userId);
    if (!targetUser) {
        console.error("Target user not found.");
        return;
    }
    if (userId === currentUser.id) {
        alert("You cannot change your own role.");
        return;
    }
    if (targetUser.role === 'super_admin' && currentUser.role !== 'super_admin') {
        alert("You cannot change the role of a Super Admin.");
        return;
    }
      
    try {
      await User.update(userId, { role: newRole });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error("Failed to update role:", error);
      alert("Failed to update role.");
    }
  };

  const canEditRole = (targetUser) => {
      if (!currentUser) return false;
      if (currentUser.id === targetUser.id) return false; // Cannot edit self
      if (currentUser.role === 'super_admin') return true; // Super admin can edit anyone
      // Admin can edit editors and members, but not other admins or super_admins
      if (currentUser.role === 'admin' && targetUser.role !== 'super_admin' && targetUser.role !== 'admin') return true;
      return false;
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <UsersIcon className="w-8 h-8" />
            User Management
          </h1>
          <p className="text-slate-500 mt-1">
            View users and manage their roles and permissions.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead>Role</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-28" /></TableCell>
                  </TableRow>
                ))
              ) : (
                users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{new Date(user.created_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {canEditRole(user) ? (
                        <Select value={user.role} onValueChange={(newRole) => handleRoleChange(user.id, newRole)}>
                          <SelectTrigger className={`w-[150px] ${roleColors[user.role]}`}>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">Member</SelectItem>
                            <SelectItem value="editor">Editor</SelectItem>
                            {/* Only Super Admin can assign Admin or Super Admin roles */}
                            {currentUser?.role === 'super_admin' && <SelectItem value="admin">Admin</SelectItem>}
                            {currentUser?.role === 'super_admin' && <SelectItem value="super_admin">Super Admin</SelectItem>}
                          </SelectContent>
                        </Select>
                      ) : (
                        <div className={`px-2 py-1 text-xs font-medium rounded-md inline-flex items-center gap-1 ${roleColors[user.role]}`}>
                           {user.role === 'super_admin' && <ShieldCheck className="w-3 h-3"/>}
                           {user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
