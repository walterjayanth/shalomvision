
import React, { useState, useEffect } from 'react';
import { SpeakerProfile } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Plus, Settings, Trash2, ShieldAlert, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import SpeakerCard from '../components/speakers/SpeakerCard';
import SpeakerForm from '../components/speakers/SpeakerForm';

export default function SpeakerProfiles() {
  const [speakers, setSpeakers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingSpeaker, setEditingSpeaker] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [speakerToDelete, setSpeakerToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadSpeakers();
    };
    checkUserAndLoad();
  }, []);

  const loadSpeakers = async () => {
    setLoading(true);
    try {
      // Corrected the API call to use the correct syntax for sorting
      const speakersData = await SpeakerProfile.list('name');
      setSpeakers(speakersData);
    } catch (error) {
      console.error('Error loading speakers:', error);
      // In case of error, ensure speakers is an empty array
      setSpeakers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingSpeaker) {
        await SpeakerProfile.update(editingSpeaker.id, formData);
      } else {
        await SpeakerProfile.create(formData);
      }
      setShowForm(false);
      setEditingSpeaker(null);
      loadSpeakers();
    } catch (error) {
      console.error("Failed to save speaker:", error);
      alert("Failed to save speaker.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (speaker) => {
    setEditingSpeaker(speaker);
    setShowForm(true);
  };

  const handleDeleteRequest = (speaker) => {
    setSpeakerToDelete(speaker);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!speakerToDelete) return;
    try {
      await SpeakerProfile.delete(speakerToDelete.id);
      setShowDeleteDialog(false);
      setSpeakerToDelete(null);
      loadSpeakers();
    } catch (error) {
      console.error("Failed to delete speaker:", error);
      alert("Failed to delete speaker.");
    }
  };

  const handleOpenForm = () => {
    setEditingSpeaker(null);
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="p-6 lg:p-8 space-y-8">
          <Skeleton className="h-12 w-1/3 mx-auto" />
          <Skeleton className="h-6 w-2/3 mx-auto" />
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8">
              {Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-[500px] w-full" />)}
          </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <MessageSquare className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Speaker <span className="text-amber-500">Profiles</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Get to know the guest speakers and ministry leaders who share God's word and their testimonies with our community.
        </p>
      </div>
      
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage speaker profiles.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add New Speaker
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingSpeaker ? 'Edit Speaker Profile' : 'Add New Speaker Profile'}</DialogTitle>
          </DialogHeader>
          <SpeakerForm speaker={editingSpeaker} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the profile for "{speakerToDelete?.name}"? This action cannot be undone.
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
        {speakers.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <UserIcon className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">Speaker Profiles Coming Soon</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">We are currently preparing profiles for our guest speakers. Please check back soon.</p>
            {isAdmin && <p className='text-sm text-slate-500 mt-2'>Admins: Use the "Add New Speaker" button to get started.</p>}
          </div>
        ) : (
          <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              {speakers.map(speaker => (
                <Link key={speaker.id} to={createPageUrl(`SpeakerProfilePage?id=${speaker.id}`)}>
                    <SpeakerCard speaker={speaker} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
                </Link>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
