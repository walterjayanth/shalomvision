import React, { useState, useEffect } from 'react';
import { SupportInfo } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { HandHeart, Edit, DollarSign, Users } from 'lucide-react';
import SupportForm from '../components/support/SupportForm';

export default function Support() {
  const [supportInfo, setSupportInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadSupportInfo();
    };
    checkUserAndLoad();
  }, []);

  const loadSupportInfo = async () => {
    setLoading(true);
    try {
      const data = await SupportInfo.list();
      if (data.length > 0) {
        setSupportInfo(data[0]);
      } else {
        setSupportInfo(null); // No info set yet
      }
    } catch (error) {
      console.error('Error loading support info:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (supportInfo) {
        await SupportInfo.update(supportInfo.id, formData);
      } else {
        await SupportInfo.create(formData);
      }
      setShowForm(false);
      loadSupportInfo();
    } catch (error) {
      console.error("Failed to save support info:", error);
      alert("Failed to save support info.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <Skeleton className="w-full h-96" />;
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
       <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <HandHeart className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          {supportInfo?.page_title || "Support Our Ministry"}
        </h1>
        {supportInfo && (
          <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
            {supportInfo.intro_text}
          </p>
        )}
      </div>

      {isAdmin && (
        <div className="max-w-6xl mx-auto flex justify-end mb-8">
          <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white">
            <Edit className="w-5 h-5 mr-2" />
            Edit Page Content
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Support Page Content</DialogTitle>
          </DialogHeader>
          <SupportForm supportInfo={supportInfo} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {!supportInfo ? (
        <div className="text-center py-20 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
            <h3 className="text-2xl font-semibold text-slate-800">Content Coming Soon</h3>
            <p className="text-slate-600 mt-2">Information about how to support our ministry is being prepared.</p>
            {isAdmin && <p className="text-sm text-slate-500 mt-4">Admins: Click 'Edit Page Content' to add information.</p>}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid lg:grid-cols-5 gap-12">
            <div className="lg:col-span-3 space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><DollarSign className="w-6 h-6 text-amber-500"/>{supportInfo.donation_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {supportInfo.donation_details}
                    </CardContent>
                </Card>
                 <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3"><Users className="w-6 h-6 text-amber-500"/>{supportInfo.volunteer_title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {supportInfo.volunteer_details}
                    </CardContent>
                </Card>
            </div>
            <div className="lg:col-span-2">
                {supportInfo.image_url && <img src={supportInfo.image_url} alt="Support Shalom Vision" className="rounded-xl shadow-lg w-full h-auto object-cover aspect-[4/5]" />}
            </div>
        </div>
      )}
    </div>
  );
}