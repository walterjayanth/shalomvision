import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2, UploadCloud, User, Calendar, CheckSquare, Link as LinkIcon, BookOpen, Users } from 'lucide-react';
import { UploadFile } from '@/api/integrations';
import { Event } from '@/api/entities';
import { Meeting } from '@/api/entities';
import { SpeakerProfile } from '@/api/entities';
import { MultiSelectComboBox } from '../shared/MultiSelectComboBox'; // Assuming a shared component exists
import { format, parseISO } from 'date-fns';

export default function TestimonyForm({ testimony, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    testifier_name: '',
    story: '',
    testimony_date: '',
    image_url: '',
    is_approved: false,
    linked_event_ids: [],
    linked_meeting_ids: [],
    linked_speaker_ids: [],
  });

  const [linkableItems, setLinkableItems] = useState({ events: [], meetings: [], speakers: [] });
  const [loadingLinks, setLoadingLinks] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (testimony) {
      setFormData({
        title: testimony.title || '',
        testifier_name: testimony.testifier_name || '',
        story: testimony.story || '',
        testimony_date: testimony.testimony_date ? format(parseISO(testimony.testimony_date), 'yyyy-MM-dd') : '',
        image_url: testimony.image_url || '',
        is_approved: testimony.is_approved || false,
        linked_event_ids: testimony.linked_event_ids || [],
        linked_meeting_ids: testimony.linked_meeting_ids || [],
        linked_speaker_ids: testimony.linked_speaker_ids || [],
      });
    }
  }, [testimony]);

  useEffect(() => {
    const fetchLinkableItems = async () => {
      setLoadingLinks(true);
      try {
        const [events, meetings, speakers] = await Promise.all([
          Event.list(),
          Meeting.list(),
          SpeakerProfile.list(),
        ]);
        setLinkableItems({ events, meetings, speakers });
      } catch (error) {
        console.error("Failed to load items for linking", error);
      } finally {
        setLoadingLinks(false);
      }
    };
    fetchLinkableItems();
  }, []);

  const handleChange = (field) => (e) => setFormData(prev => ({ ...prev, [field]: e.target.value }));
  const handleSwitchChange = (field) => (checked) => setFormData(prev => ({ ...prev, [field]: checked }));
  const handleMultiSelectChange = (field) => (ids) => setFormData(prev => ({ ...prev, [field]: ids }));

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" value={formData.title} onChange={handleChange('title')} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="testifier_name">Testifier's Name *</Label>
          <Input id="testifier_name" value={formData.testifier_name} onChange={handleChange('testifier_name')} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="story">Story *</Label>
        <Textarea id="story" value={formData.story} onChange={handleChange('story')} required rows={8} />
      </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-2">
            <Label htmlFor="testimony_date">Date of Testimony *</Label>
            <Input id="testimony_date" type="date" value={formData.testimony_date} onChange={handleChange('testimony_date')} required />
          </div>
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              {formData.image_url ? (
                <img src={formData.image_url} alt="Profile" className="w-16 h-16 rounded-full object-cover" />
              ) : (
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                    <User className="w-8 h-8 text-slate-400" />
                 </div>
              )}
              <Button type="button" variant="outline" onClick={() => document.getElementById('image-upload').click()} disabled={uploading}>
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <UploadCloud className="w-4 h-4 mr-2" />}
                  {uploading ? 'Uploading...' : 'Upload Image'}
              </Button>
              <Input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
            </div>
        </div>
      </div>
      
      <div className="space-y-4 pt-4 border-t">
        <h3 className="text-lg font-semibold flex items-center gap-2"><LinkIcon className="w-5 h-5"/>Link Testimony (Optional)</h3>
        {loadingLinks ? <Loader2 className="animate-spin"/> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MultiSelectComboBox
              items={linkableItems.events}
              selectedIds={formData.linked_event_ids}
              onSelectionChange={handleMultiSelectChange('linked_event_ids')}
              placeholder="Link to Events..."
              itemIcon={Calendar}
            />
            <MultiSelectComboBox
              items={linkableItems.meetings}
              selectedIds={formData.linked_meeting_ids}
              onSelectionChange={handleMultiSelectChange('linked_meeting_ids')}
              placeholder="Link to Meetings..."
              itemIcon={BookOpen}
            />
            <MultiSelectComboBox
              items={linkableItems.speakers}
              selectedIds={formData.linked_speaker_ids}
              onSelectionChange={handleMultiSelectChange('linked_speaker_ids')}
              placeholder="Link to Speakers..."
              itemIcon={Users}
              renderItem={(item) => (
                <div className="flex items-center gap-2">
                  <img src={item.profile_image} className="w-6 h-6 rounded-full object-cover" />
                  <span>{item.name}</span>
                </div>
              )}
            />
          </div>
        )}
      </div>

      <div className="space-y-4 pt-4 border-t">
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <Label htmlFor="is_approved" className="flex items-center gap-2 font-semibold">
                <CheckSquare className="w-5 h-5"/>
                Approve for Public Display
            </Label>
            <Switch id="is_approved" checked={formData.is_approved} onCheckedChange={handleSwitchChange('is_approved')} />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
          {testimony ? 'Save Changes' : 'Create Testimony'}
        </Button>
      </div>
    </form>
  );
}