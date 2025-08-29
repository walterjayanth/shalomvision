import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud, User, X, PlusCircle } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

export default function SpeakerForm({ speaker, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    name: '',
    title: '',
    bio: '',
    profile_image: '',
    gallery_images: [],
    website: '',
    email: '',
    social_links: [],
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (speaker) {
      setFormData({
        name: speaker.name || '',
        title: speaker.title || '',
        bio: speaker.bio || '',
        profile_image: speaker.profile_image || '',
        gallery_images: speaker.gallery_images || [],
        website: speaker.website || '',
        email: speaker.email || '',
        social_links: speaker.social_links || [],
      });
    } else {
      setFormData({
        name: '', title: '', bio: '', profile_image: '', gallery_images: [],
        website: '', email: '', social_links: [],
      });
    }
  }, [speaker]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSocialLinkChange = (index, field) => (eOrValue) => {
    const value = typeof eOrValue === 'string' ? eOrValue : eOrValue.target.value;
    const newLinks = [...formData.social_links];
    newLinks[index][field] = value;
    setFormData(prev => ({ ...prev, social_links: newLinks }));
  };

  const addSocialLink = () => {
    setFormData(prev => ({
      ...prev,
      social_links: [...prev.social_links, { platform: 'Other', url: '' }],
    }));
  };

  const removeSocialLink = (index) => {
    setFormData(prev => ({
      ...prev,
      social_links: formData.social_links.filter((_, i) => i !== index),
    }));
  };

  const handleImageUpload = async (e, field) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      if (field === 'profile_image') {
        const { file_url } = await UploadFile({ file: files[0] });
        setFormData(prev => ({ ...prev, profile_image: file_url }));
      } else if (field === 'gallery_images') {
        const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
        const results = await Promise.all(uploadPromises);
        const newImageUrls = results.map(res => res.file_url);
        setFormData(prev => ({ ...prev, gallery_images: [...prev.gallery_images, ...newImageUrls] }));
      }
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const removeGalleryImage = (indexToRemove) => {
    setFormData(prev => ({
        ...prev,
        gallery_images: prev.gallery_images.filter((_, index) => index !== indexToRemove)
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-4">
            <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="w-32 h-32 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden mx-auto">
                {formData.profile_image ? (
                    <img src={formData.profile_image} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                    <User className="w-16 h-16 text-slate-400" />
                )}
                </div>
                <Button asChild variant="outline" className="relative w-full">
                    <label htmlFor="profile_image_upload" className="cursor-pointer flex items-center justify-center gap-2">
                    {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                    <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                    <Input id="profile_image_upload" type="file" accept="image/*" className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => handleImageUpload(e, 'profile_image')} disabled={uploading} />
                    </label>
                </Button>
            </div>
            <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" value={formData.name} onChange={handleChange('name')} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="title">Title / Role *</Label>
                <Input id="title" value={formData.title} onChange={handleChange('title')} required />
            </div>
        </div>
        
        <div className="lg:col-span-2 space-y-4">
             <div className="space-y-2">
                <Label htmlFor="bio">Biography *</Label>
                <Textarea id="bio" value={formData.bio} onChange={handleChange('bio')} required rows={8} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="email">Contact Email</Label>
                <Input id="email" type="email" value={formData.email} onChange={handleChange('email')} />
            </div>
             <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" type="url" value={formData.website} onChange={handleChange('website')} />
            </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <Label>Photo Gallery</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
            {formData.gallery_images.map((url, index) => (
                <div key={index} className="relative group">
                    <img src={url} alt={`Gallery image ${index + 1}`} className="w-full aspect-square object-cover rounded-md" />
                    <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100" onClick={() => removeGalleryImage(index)}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button asChild variant="outline" className="relative aspect-square">
                <label htmlFor="gallery_upload" className="cursor-pointer flex flex-col items-center justify-center text-slate-500">
                    <UploadCloud className="w-6 h-6" />
                    <span className="text-xs mt-1">Add Images</span>
                    <Input id="gallery_upload" type="file" multiple className="absolute inset-0 w-full h-full opacity-0" onChange={(e) => handleImageUpload(e, 'gallery_images')} disabled={uploading} />
                </label>
            </Button>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t">
        <Label>Social Media Links</Label>
        {formData.social_links.map((link, index) => (
          <div key={index} className="flex items-center gap-2">
            <Select value={link.platform} onValueChange={handleSocialLinkChange(index, 'platform')}>
                <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                <SelectContent>
                    <SelectItem value="Facebook">Facebook</SelectItem>
                    <SelectItem value="Twitter">Twitter</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                    <SelectItem value="YouTube">YouTube</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
            </Select>
            <Input
              type="url"
              placeholder="https://..."
              value={link.url}
              onChange={handleSocialLinkChange(index, 'url')}
            />
            <Button type="button" variant="ghost" size="icon" onClick={() => removeSocialLink(index)}>
              <X className="w-4 h-4 text-red-500" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addSocialLink} className="flex items-center gap-2">
          <PlusCircle className="w-4 h-4" /> Add Social Link
        </Button>
      </div>

      <div className="flex justify-end gap-3 pt-6 border-t">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading || uploading} className="bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Speaker'}
        </Button>
      </div>
    </form>
  );
}