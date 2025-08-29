import React, { useState, useEffect } from 'react';
import { Testimony } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Heart, Plus, Settings, Trash2, ShieldAlert } from 'lucide-react';
import TestimonyCard from '../components/testimonies/TestimonyCard';
import TestimonyForm from '../components/testimonies/TestimonyForm';

export default function Testimonies() {
  const [testimonies, setTestimonies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTestimony, setEditingTestimony] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [testimonyToDelete, setTestimonyToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadTestimonies();
    };
    checkUserAndLoad();
  }, []);

  const loadTestimonies = async () => {
    setLoading(true);
    try {
      const allTestimonies = await Testimony.list({ sort: '-testimony_date' });
      // Filter client-side based on admin status
      const currentUser = await User.me().catch(() => null);
      if (currentUser && ['super_admin', 'admin', 'editor'].includes(currentUser.role)) {
        setTestimonies(allTestimonies);
      } else {
        setTestimonies(allTestimonies.filter(t => t.is_approved));
      }
    } catch (error) {
      console.error('Error loading testimonies:', error);
      setTestimonies([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingTestimony) {
        await Testimony.update(editingTestimony.id, formData);
      } else {
        await Testimony.create(formData);
      }
      setShowForm(false);
      setEditingTestimony(null);
      loadTestimonies();
    } catch (error) {
      console.error("Failed to save testimony:", error);
      alert("Failed to save testimony.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (testimony) => {
    setEditingTestimony(testimony);
    setShowForm(true);
  };

  const handleDeleteRequest = (testimony) => {
    setTestimonyToDelete(testimony);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!testimonyToDelete) return;
    try {
      await Testimony.delete(testimonyToDelete.id);
      setShowDeleteDialog(false);
      setTestimonyToDelete(null);
      loadTestimonies();
    } catch (error) {
      console.error("Failed to delete testimony:", error);
      alert("Failed to delete testimony.");
    }
  };

  const handleOpenForm = () => {
    setEditingTestimony(null);
    setShowForm(true);
  };

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
                {Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Heart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Stories of <span className="text-amber-500">Faith</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Read powerful testimonies of God's work in the lives of our community members. Be encouraged and inspired by these stories of transformation.
        </p>
      </div>
      
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage and approve testimonies.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add New Testimony
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingTestimony ? 'Edit Testimony' : 'Add New Testimony'}</DialogTitle>
          </DialogHeader>
          <TestimonyForm testimony={editingTestimony} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the testimony "{testimonyToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Testimony</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="space-y-8">
        {testimonies.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No Testimonies Yet</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Check back soon for inspiring stories from our community. {isAdmin && 'Use the "Add New Testimony" button to get started.'}</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {testimonies.map(testimony => (
                <TestimonyCard key={testimony.id} testimony={testimony} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}