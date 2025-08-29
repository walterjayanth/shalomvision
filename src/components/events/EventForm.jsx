import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, UploadCloud } from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { format } from 'date-fns';
import SpeakerSelection from '../speakers/SpeakerSelection';

export default function EventForm({ event, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    image_url: '',
    speaker_ids: [],
    is_coming_soon: false,
    show_on_homepage_carousel: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        event_date: event.event_date ? format(new Date(event.event_date), "yyyy-MM-dd'T'HH:mm") : '',
        location: event.location || '',
        image_url: event.image_url || '',
        speaker_ids: event.speaker_ids || [],
        is_coming_soon: event.is_coming_soon || false,
        show_on_homepage_carousel: event.show_on_homepage_carousel || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        image_url: '',
        speaker_ids: [],
        is_coming_soon: false,
        show_on_homepage_carousel: false,
      });
    }
  }, [event]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };
  
  const handleSwitchChange = (field) => (checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
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
      alert("Image upload failed.");
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
        <Label htmlFor="title">Event Title *</Label>
        <Input id="title" value={formData.title} onChange={handleChange('title')} placeholder="e.g., Annual Conference" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" value={formData.description} onChange={handleChange('description')} placeholder="A brief summary of the event..." required rows={4} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="event_date">Date and Time *</Label>
          <Input id="event_date" type="datetime-local" value={formData.event_date} onChange={handleChange('event_date')} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input id="location" value={formData.location} onChange={handleChange('location')} placeholder="e.g., Main Auditorium" required />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="speaker">Speakers</Label>
        <SpeakerSelection 
          value={formData.speaker_ids} 
          onChange={(ids) => setFormData(prev => ({...prev, speaker_ids: ids}))}
        />
      </div>

      <div className="space-y-2">
        <Label>Event Image</Label>
        <div className="flex items-center gap-4">
          {formData.image_url && <img src={formData.image_url} alt="Preview" className="w-24 h-16 object-cover rounded-md" />}
          <Button asChild variant="outline" className="relative">
            <label htmlFor="image_upload" className="cursor-pointer flex items-center gap-2">
              {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
              <span>{uploading ? 'Uploading...' : 'Upload Image'}</span>
              <Input id="image_upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label htmlFor="is_coming_soon" className="font-medium text-slate-700">Mark as 'Coming Soon'</Label>
            <Switch
                id="is_coming_soon"
                checked={formData.is_coming_soon}
                onCheckedChange={handleSwitchChange('is_coming_soon')}
            />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label htmlFor="show_on_homepage_carousel" className="font-medium text-slate-700">Show on Homepage Carousel</Label>
            <Switch
                id="show_on_homepage_carousel"
                checked={formData.show_on_homepage_carousel}
                onCheckedChange={handleSwitchChange('show_on_homepage_carousel')}
            />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading || uploading} className="bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Event'}
        </Button>
      </div>
    </form>
  );
}