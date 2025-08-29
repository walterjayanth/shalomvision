import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, UploadCloud } from "lucide-react";
import { UploadFile } from "@/api/integrations";

export default function MinistryForm({ ministry, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    display_order: 1,
    is_active: true,
    leader_name: '',
    contact_email: '',
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (ministry) {
      setFormData({
        title: ministry.title || '',
        description: ministry.description || '',
        image_url: ministry.image_url || '',
        display_order: ministry.display_order || 1,
        is_active: ministry.is_active !== undefined ? ministry.is_active : true,
        leader_name: ministry.leader_name || '',
        contact_email: ministry.contact_email || '',
      });
    } else {
        // Reset form for new entry
        setFormData({
            title: '',
            description: '',
            image_url: '',
            display_order: 1,
            is_active: true,
            leader_name: '',
            contact_email: '',
        });
    }
  }, [ministry]);

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? parseInt(e.target.value, 10) || 0 : e.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
    <Card className="bg-white/90 backdrop-blur-sm border-slate-100 shadow-lg">
      <CardHeader>
        <CardTitle className="text-slate-800">
          {ministry ? 'Edit Ministry' : 'Add New Ministry'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image_upload" className="text-slate-700">Ministry Image</Label>
            <div className="flex items-center gap-4">
                {formData.image_url && (
                    <img src={formData.image_url} alt="Ministry preview" className="w-24 h-16 object-cover rounded-md" />
                )}
                <Button asChild variant="outline" className="relative">
                    <label htmlFor="image_upload" className="cursor-pointer flex items-center gap-2">
                        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UploadCloud className="w-4 h-4" />}
                        {uploading ? 'Uploading...' : 'Upload Image'}
                        <Input id="image_upload" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </Button>
            </div>
          </div>
          <div className="space-y-2">
              <Label htmlFor="title" className="text-slate-700">Ministry Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange('title')}
                placeholder="e.g., Youth Ministry"
                required
                className="border-slate-200 focus:border-amber-400"
              />
          </div>
          <div className="space-y-2">
              <Label htmlFor="description" className="text-slate-700">Description *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange('description')}
                placeholder="A short description of the ministry..."
                required
                rows={4}
                className="border-slate-200 focus:border-amber-400"
              />
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="leader_name" className="text-slate-700">Leader Name</Label>
                <Input
                    id="leader_name"
                    value={formData.leader_name}
                    onChange={handleChange('leader_name')}
                    placeholder="e.g., John Doe"
                    className="border-slate-200 focus:border-amber-400"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="contact_email" className="text-slate-700">Contact Email</Label>
                <Input
                    id="contact_email"
                    type="email"
                    value={formData.contact_email}
                    onChange={handleChange('contact_email')}
                    placeholder="e.g., youth@shalom.co.nz"
                    className="border-slate-200 focus:border-amber-400"
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="display_order" className="text-slate-700">Display Order</Label>
                <Input
                    id="display_order"
                    type="number"
                    value={formData.display_order}
                    onChange={handleChange('display_order')}
                    className="border-slate-200 focus:border-amber-400"
                />
            </div>
            <div className="flex items-center space-x-2 pt-8">
                <Switch
                    id="is_active"
                    checked={formData.is_active}
                    onCheckedChange={handleSwitchChange('is_active')}
                />
                <Label htmlFor="is_active">Active Ministry</Label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || uploading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Ministry'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}