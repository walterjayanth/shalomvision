
import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import { WebsiteSettings } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Settings as SettingsIcon, Upload, Loader2 } from 'lucide-react';
import { UploadFile } from '@/api/integrations';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      let settingsData = await WebsiteSettings.list();
      if (settingsData.length === 0) {
        // Create initial settings if they don't exist
        settingsData = [await WebsiteSettings.create({})];
      }
      setSettings(settingsData[0]);
      setLoading(false);
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await WebsiteSettings.update(settings.id, {
        site_name: settings.site_name,
        site_tagline: settings.site_tagline,
        logo_url: settings.logo_url
      });
      alert('Settings saved successfully!');
    } catch (error) {
      console.error("Error saving settings:", error);
      alert('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field) => (e) => {
    setSettings(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setSettings(prev => ({ ...prev, logo_url: file_url }));
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <p>Loading settings...</p>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <SettingsIcon className="w-8 h-8" />
            Website Settings
          </h1>
          <p className="text-slate-500 mt-1">
            Manage global branding and information for your website.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Branding</CardTitle>
            <CardDescription>Update your site's name, tagline, and logo.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6 max-w-2xl">
              <div className="space-y-2">
                <Label htmlFor="site_name">Site Name</Label>
                <Input id="site_name" value={settings.site_name || ''} onChange={handleChange('site_name')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="site_tagline">Site Tagline</Label>
                <Input id="site_tagline" value={settings.site_tagline || ''} onChange={handleChange('site_tagline')} />
              </div>
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="flex items-center gap-4">
                  {settings.logo_url && (
                    <img src={settings.logo_url} alt="Logo" className="h-16 w-16 object-contain rounded-md border p-1" />
                  )}
                  <div className="flex-1">
                     <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="logo-upload"
                      disabled={uploading}
                    />
                    <label htmlFor="logo-upload">
                        <Button type="button" variant="outline" as="span" className="cursor-pointer" disabled={uploading}>
                            {uploading ? (
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : (
                                <Upload className="w-4 h-4 mr-2" />
                            )}
                            {uploading ? 'Uploading...' : 'Change Logo'}
                        </Button>
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={saving || uploading} className="bg-orange-600 hover:bg-orange-700">
                  {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Settings
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
