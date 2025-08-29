import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud, ImageOff } from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { GalleryImage } from '@/api/entities';

export default function GalleryImageForm({ onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    tags: [],
    event_name: '',
    description: ''
  });
  const [tagInput, setTagInput] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({ ...prev, image_url: file_url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setUploading(false);
    }
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const newTag = tagInput.trim();
      if (newTag && !formData.tags.includes(newTag)) {
        setFormData(prev => ({...prev, tags: [...prev.tags, newTag]}));
      }
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove) => {
      setFormData(prev => ({...prev, tags: prev.tags.filter(tag => tag !== tagToRemove)}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image_url) {
        alert("Please upload an image first.");
        return;
    }
    setSaving(true);
    try {
        await GalleryImage.create(formData);
        onSave();
    } catch (error) {
        console.error("Failed to save image:", error);
        alert("Failed to save image.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label>Image *</Label>
        {formData.image_url ? (
            <img src={formData.image_url} className="w-full h-48 object-cover rounded-md" />
        ) : (
            <div className="w-full h-48 rounded-md bg-slate-100 flex items-center justify-center">
                <ImageOff className="w-12 h-12 text-slate-400"/>
            </div>
        )}
        <Button type="button" variant="outline" className="w-full" onClick={() => document.getElementById('image-upload').click()} disabled={uploading}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
          {uploading ? 'Uploading...' : 'Upload Image'}
        </Button>
        <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input id="title" value={formData.title} onChange={handleChange('title')} required />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange('description')} rows={3} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="event_name">Associated Event</Label>
          <Input id="event_name" value={formData.event_name} onChange={handleChange('event_name')} />
        </div>
        <div className="space-y-2">
            <Label htmlFor="tags">Tags (press Enter to add)</Label>
            <Input id="tags" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={handleTagKeyDown} />
            <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map(tag => (
                    <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded-full flex items-center gap-1">
                        {tag} <button type="button" onClick={() => removeTag(tag)}>&times;</button>
                    </span>
                ))}
            </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving || uploading}>
          {(saving || uploading) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Save Image
        </Button>
      </div>
    </form>
  );
}