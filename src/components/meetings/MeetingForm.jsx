import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UploadCloud, X } from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { format, parseISO } from 'date-fns';
import SpeakerSelection from '../speakers/SpeakerSelection';

export default function MeetingForm({ meeting, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    summary: '',
    meeting_date: '',
    images: [],
    speaker_ids: [],
    is_regular: false,
    frequency: '',
    day_of_week: '',
    time_of_day: '',
    show_on_homepage: false,
    show_on_homepage_carousel: false,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        summary: meeting.summary || '',
        meeting_date: meeting.meeting_date ? format(parseISO(meeting.meeting_date), 'yyyy-MM-dd') : '',
        images: meeting.images || [],
        speaker_ids: meeting.speaker_ids || [],
        is_regular: meeting.is_regular || false,
        frequency: meeting.frequency || '',
        day_of_week: meeting.day_of_week || '',
        time_of_day: meeting.time_of_day || '',
        show_on_homepage: meeting.show_on_homepage || false,
        show_on_homepage_carousel: meeting.show_on_homepage_carousel || false,
      });
    } else {
      setFormData({
        title: '', summary: '', meeting_date: '', images: [], speaker_ids: [],
        is_regular: false, frequency: '', day_of_week: '', time_of_day: '',
        show_on_homepage: false, show_on_homepage_carousel: false,
      });
    }
  }, [meeting]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleSelectChange = (field) => (value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  const handleSwitchChange = (field) => (checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  }

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(file => UploadFile({ file }));
      const results = await Promise.all(uploadPromises);
      const newImageUrls = results.map(res => res.file_url);
      setFormData(prev => ({ ...prev, images: [...prev.images, ...newImageUrls] }));
    } catch (error) {
      console.error("Image upload failed:", error);
      alert("One or more image uploads failed.");
    } finally {
      setUploading(false);
    }
  };
  
  const removeImage = (indexToRemove) => {
    setFormData(prev => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove)
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const dataToSave = { ...formData };
    if (dataToSave.is_regular) {
        dataToSave.meeting_date = null; // Clear meeting_date if it's a regular meeting
    } else {
        // Clear regular meeting specific fields if it's not a regular meeting
        dataToSave.frequency = '';
        dataToSave.day_of_week = '';
        dataToSave.time_of_day = '';
    }
    onSave(dataToSave);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Meeting Title *</Label>
        <Input id="title" value={formData.title} onChange={handleChange('title')} placeholder="e.g., Sunday Service" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="summary">Summary *</Label>
        <Textarea id="summary" value={formData.summary} onChange={handleChange('summary')} placeholder="A brief summary of the meeting or sermon..." required rows={5} />
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="is_regular" checked={formData.is_regular} onCheckedChange={handleSwitchChange('is_regular')} />
        <Label htmlFor="is_regular">This is a Regular Meeting</Label>
      </div>

      {formData.is_regular ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg bg-slate-50">
            <div className="space-y-2">
                <Label htmlFor="frequency">Frequency</Label>
                <Select value={formData.frequency} onValueChange={handleSelectChange('frequency')}>
                    <SelectTrigger id="frequency"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Daily">Daily</SelectItem>
                        <SelectItem value="Weekly">Weekly</SelectItem>
                        <SelectItem value="Fortnightly">Fortnightly</SelectItem>
                        <SelectItem value="Monthly">Monthly</SelectItem>
                        <SelectItem value="Quarterly">Quarterly</SelectItem>
                        <SelectItem value="Annually">Annually</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="day_of_week">Day of Week</Label>
                 <Select value={formData.day_of_week} onValueChange={handleSelectChange('day_of_week')}>
                    <SelectTrigger id="day_of_week"><SelectValue placeholder="Select..." /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Sunday">Sunday</SelectItem>
                        <SelectItem value="Monday">Monday</SelectItem>
                        <SelectItem value="Tuesday">Tuesday</SelectItem>
                        <SelectItem value="Wednesday">Wednesday</SelectItem>
                        <SelectItem value="Thursday">Thursday</SelectItem>
                        <SelectItem value="Friday">Friday</SelectItem>
                        <SelectItem value="Saturday">Saturday</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="time_of_day">Time</Label>
                <Input id="time_of_day" value={formData.time_of_day} onChange={handleChange('time_of_day')} placeholder="e.g. 7:00 PM" />
            </div>
        </div>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="meeting_date">Meeting Date *</Label>
          <Input id="meeting_date" type="date" value={formData.meeting_date} onChange={handleChange('meeting_date')} required={!formData.is_regular} />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="speaker">Speakers</Label>
        <SpeakerSelection 
          value={formData.speaker_ids} 
          onChange={(ids) => setFormData(prev => ({...prev, speaker_ids: ids}))}
        />
      </div>

      <div className="space-y-2">
        <Label>Meeting Images</Label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {formData.images.map((url, index) => (
                <div key={index} className="relative group">
                    <img src={url} alt={`Meeting image ${index + 1}`} className="w-full aspect-square object-cover rounded-md" />
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeImage(index)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}
            <Button asChild variant="outline" className="relative aspect-square">
              <label htmlFor="image_upload" className="cursor-pointer flex flex-col items-center justify-center text-slate-500">
                {uploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <UploadCloud className="w-6 h-6" />}
                <span className="text-xs mt-1">{uploading ? 'Uploading...' : 'Add Images'}</span>
                <Input id="image_upload" type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label htmlFor="show_on_homepage" className="flex flex-col">
                <span>Show on Homepage</span>
                <span className="text-xs text-slate-500 font-normal">Features in the "Regular Gatherings" list.</span>
            </Label>
            <Switch id="show_on_homepage" checked={formData.show_on_homepage} onCheckedChange={handleSwitchChange('show_on_homepage')} />
        </div>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label htmlFor="show_on_homepage_carousel" className="flex flex-col">
                <span>Show in Homepage Carousel</span>
                <span className="text-xs text-slate-500 font-normal">Features prominently at the top.</span>
            </Label>
            <Switch id="show_on_homepage_carousel" checked={formData.show_on_homepage_carousel} onCheckedChange={handleSwitchChange('show_on_homepage_carousel')} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>Cancel</Button>
        <Button type="submit" disabled={isLoading || uploading} className="bg-red-600 hover:bg-red-700 text-white">
          {isLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Meeting'}
        </Button>
      </div>
    </form>
  );
}