import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, User } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

export default function LeaderForm({ leader, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    profile_image: '',
    email: '',
    phone: '',
    display_order: 1,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (leader) {
      setFormData({
        name: leader.name || '',
        role: leader.role || '',
        bio: leader.bio || '',
        profile_image: leader.profile_image || '',
        email: leader.email || '',
        phone: leader.phone || '',
        display_order: leader.display_order || 1,
      });
    } else {
      setFormData({
        name: '', role: '', bio: '', profile_image: '',
        email: '', phone: '', display_order: 1,
      });
    }
  }, [leader]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, profile_image: file_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Profile Image</Label>
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
            {formData.profile_image ? (
              <img src={formData.profile_image} alt="Profile preview" className="w-full h-full object-cover" />
            ) : (
              <User className="w-12 h-12 text-slate-400" />
            )}
          </div>
          <Button asChild variant="outline" className="relative">
            <label htmlFor="image_upload" className="cursor-pointer flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              {uploading ? 'Uploading...' : 'Upload'}
              <Input id="image_upload" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" value={formData.name} onChange={handleChange('name')} placeholder="e.g., John Doe" required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Role / Title *</Label>
          <Input id="role" value={formData.role} onChange={handleChange('role')} placeholder="e.g., Senior Pastor" required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Biography *</Label>
        <Textarea id="bio" value={formData.bio} onChange={handleChange('bio')} placeholder="A short biography of the leader..." required rows={6} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Contact Email</Label>
          <Input id="email" type="email" value={formData.email} onChange={handleChange('email')} placeholder="e.g., pastor.john@example.com" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Contact Phone</Label>
          <Input id="phone" type="tel" value={formData.phone} onChange={handleChange('phone')} placeholder="e.g., +64 21 123 4567" />
        </div>
      </div>
      
      <div className="space-y-2">
          <Label htmlFor="display_order">Display Order</Label>
          <Input id="display_order" type="number" value={formData.display_order} onChange={handleChange('display_order')} min="1" />
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || uploading} className="bg-red-600 hover:bg-red-700">
          {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
          {isLoading ? 'Saving...' : 'Save Leader'}
        </Button>
      </div>
    </form>
  );
}