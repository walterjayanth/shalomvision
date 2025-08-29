import React, { useState, useEffect } from "react";
import { Leader } from "@/api/entities";
import { User } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Users as UsersIcon, Plus, Settings, Trash2, ShieldAlert, User as UserIcon } from "lucide-react";
import LeaderCard from "../components/leaders/LeaderCard";
import LeaderForm from "../components/leaders/LeaderForm";

export default function Leaders() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [leaderToDelete, setLeaderToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadLeaders();
    };
    checkUserAndLoad();
  }, []);

  const loadLeaders = async () => {
    setLoading(true);
    try {
      const leadersData = await Leader.list({ sort: 'display_order' });
      setLeaders(leadersData);
    } catch (error) {
      console.error('Error loading leaders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingLeader) {
        await Leader.update(editingLeader.id, formData);
      } else {
        await Leader.create(formData);
      }
      setShowForm(false);
      setEditingLeader(null);
      loadLeaders();
    } catch (error) {
      console.error("Failed to save leader:", error);
      alert("Failed to save leader.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (leader) => {
    setEditingLeader(leader);
    setShowForm(true);
  };

  const handleDeleteRequest = (leader) => {
    setLeaderToDelete(leader);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!leaderToDelete) return;
    try {
      await Leader.delete(leaderToDelete.id);
      setShowDeleteDialog(false);
      setLeaderToDelete(null);
      loadLeaders();
    } catch (error) {
      console.error("Failed to delete leader:", error);
      alert("Failed to delete leader.");
    }
  };

  const handleOpenForm = () => {
    setEditingLeader(null);
    setShowForm(true);
  };

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-16">
            {/* Header Skeleton */}
            <div className="text-center">
                <Skeleton className="w-20 h-20 rounded-full mx-auto mb-6" />
                <Skeleton className="h-12 w-96 mx-auto mb-4" />
                <Skeleton className="h-6 w-[600px] mx-auto" />
            </div>
            {/* Grid Skeleton */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, i) => (
                    <div key={i} className="space-y-2">
                        <Skeleton className="h-80 w-full" />
                        <Skeleton className="h-6 w-1/2" />
                        <Skeleton className="h-4 w-1/4" />
                    </div>
                ))}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <UsersIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Our Leadership Team
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Meet the passionate leaders who guide and serve our community with dedication, 
          wisdom, and love for God's people.
        </p>
      </div>
      
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage the leadership team.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add New Leader
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingLeader ? 'Edit Leader' : 'Add New Leader'}</DialogTitle>
          </DialogHeader>
          <LeaderForm leader={editingLeader} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the profile for "{leaderToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="space-y-16">
        {leaders.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Leadership Profiles Coming Soon</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We are currently preparing profiles for our dedicated leadership team. Please check back soon.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {leaders.map(leader => (
                <LeaderCard key={leader.id} leader={leader} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}