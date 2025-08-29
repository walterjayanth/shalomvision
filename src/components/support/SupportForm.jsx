import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Loader2, UploadCloud } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

export default function SupportForm({ supportInfo, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    page_title: 'Support Our Ministry',
    intro_text: '',
    image_url: '',
    donation_title: 'Giving & Donations',
    donation_details: '',
    volunteer_title: 'Volunteer Opportunities',
    volunteer_details: ''
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (supportInfo) {
      setFormData(supportInfo);
    }
  }, [supportInfo]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="page_title">Page Title</Label>
        <Input id="page_title" value={formData.page_title} onChange={handleChange('page_title')} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="intro_text">Introductory Text</Label>
        <Textarea id="intro_text" value={formData.intro_text || ''} onChange={handleChange('intro_text')} rows={4} />
      </div>
      
      <div className="space-y-2">
        <Label>Support Image</Label>
        <div className="flex items-center gap-4">
            {formData.image_url && <img src={formData.image_url} className="w-24 h-24 object-cover rounded-md" />}
            <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload').click()} disabled={uploading}>
              {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
              {uploading ? 'Uploading...' : 'Upload Image'}
            </Button>
            <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="donation_title">Donation Section Title</Label>
                <Input id="donation_title" value={formData.donation_title} onChange={handleChange('donation_title')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="donation_details">Donation Details</Label>
                <Textarea id="donation_details" value={formData.donation_details || ''} onChange={handleChange('donation_details')} rows={8} />
            </div>
        </div>
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="volunteer_title">Volunteer Section Title</Label>
                <Input id="volunteer_title" value={formData.volunteer_title} onChange={handleChange('volunteer_title')} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="volunteer_details">Volunteer Details</Label>
                <Textarea id="volunteer_details" value={formData.volunteer_details || ''} onChange={handleChange('volunteer_details')} rows={8} />
            </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
}