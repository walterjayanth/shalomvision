import React, { useState, useEffect } from "react";
import { Ministry } from "@/api/entities";
import { User } from "@/api/entities";
import MinistryCard from "../components/ministries/MinistryCard";
import MinistryForm from "../components/ministries/MinistryForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Cross,
  Plus,
  Settings,
  Users,
  Trash2,
  Loader2,
  ShieldAlert
} from "lucide-react";

export default function Ministries() {
  const [ministries, setMinistries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingMinistry, setEditingMinistry] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [ministryToDelete, setMinistryToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadMinistries();
    };
    checkUserAndLoad();
  }, []);

  const loadMinistries = async () => {
    setLoading(true);
    try {
      const ministriesData = await Ministry.list({ sort: 'display_order' });
      setMinistries(ministriesData);
    } catch (error) {
      console.error('Error loading ministries:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingMinistry) {
        await Ministry.update(editingMinistry.id, formData);
      } else {
        await Ministry.create(formData);
      }
      setShowForm(false);
      setEditingMinistry(null);
      loadMinistries(); // Reload the list
    } catch (error) {
      console.error("Failed to save ministry:", error);
      alert("Failed to save ministry.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (ministry) => {
    setEditingMinistry(ministry);
    setShowForm(true);
  };
  
  const handleDeleteRequest = (ministry) => {
    setMinistryToDelete(ministry);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!ministryToDelete) return;
    try {
      await Ministry.delete(ministryToDelete.id);
      setShowDeleteDialog(false);
      setMinistryToDelete(null);
      loadMinistries();
    } catch (error) {
      console.error("Failed to delete ministry:", error);
      alert("Failed to delete ministry.");
    }
  };

  const handleOpenForm = () => {
    setEditingMinistry(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Cross className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Our <span className="text-amber-500">Ministries</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Discover how God is working through our various ministries to serve, support, 
          and strengthen our community in faith and fellowship.
        </p>
      </div>

      {/* Admin Controls */}
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode - You can add, edit, and delete ministries</span>
          </div>
          <Button
            onClick={handleOpenForm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Ministry
          </Button>
        </div>
      )}
      
      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[625px]">
          <MinistryForm
            ministry={editingMinistry}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
            isLoading={isSaving}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-red-600" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the ministry "{ministryToDelete?.title}"? 
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Ministries Grid or Empty/Loading State */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {Array(3).fill(0).map((_, i) => (
            <Card key={i}><Skeleton className="h-64 w-full" /></Card>
          ))}
        </div>
      ) : ministries.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-12 h-12 text-slate-400" />
          </div>
          <h3 className="text-2xl font-semibold text-slate-800 mb-4">
            Ministries Coming Soon
          </h3>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            We are currently preparing information about our various ministries. 
            Please check back soon for details.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
          {ministries.filter(m => m.is_active || isAdmin).map((ministry) => (
            <MinistryCard
              key={ministry.id}
              ministry={ministry}
              onEdit={handleEdit}
              onDelete={handleDeleteRequest}
              isAdmin={isAdmin}
            />
          ))}
        </div>
      )}
      
      {/* Call to Action */}
      {ministries.length > 0 && (
        <section className="mt-20">
          <Card className="bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-6">Get Involved</h2>
              <p className="text-xl mb-8 text-red-100 max-w-3xl mx-auto">
                Every ministry is an opportunity to serve God and build community. 
                Whether you're called to lead, serve, or participate, there's a place for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-red-600 hover:bg-red-50">
                  Join a Ministry
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white/30 text-white hover:bg-white/10"
                >
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}