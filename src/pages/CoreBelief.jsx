import React, { useState, useEffect } from 'react';
import { CoreBelief as CoreBeliefEntity } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ShieldCheck, Plus, Settings, Trash2, Edit, BookOpen, ShieldAlert } from 'lucide-react';
import CoreBeliefForm from '../components/corebeliefs/CoreBeliefForm';

export default function CoreBelief() {
  const [beliefs, setBeliefs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingBelief, setEditingBelief] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [beliefToDelete, setBeliefToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadBeliefs();
    };
    checkUserAndLoad();
  }, []);

  const loadBeliefs = async () => {
    setLoading(true);
    try {
      const data = await CoreBeliefEntity.list({ sort: 'display_order' });
      setBeliefs(data);
    } catch (error) {
      console.error('Error loading core beliefs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingBelief) {
        await CoreBeliefEntity.update(editingBelief.id, formData);
      } else {
        await CoreBeliefEntity.create(formData);
      }
      setShowForm(false);
      setEditingBelief(null);
      loadBeliefs();
    } catch (error) {
      console.error("Failed to save belief:", error);
      alert("Failed to save belief.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (belief) => {
    setEditingBelief(belief);
    setShowForm(true);
  };
  
  const handleDeleteRequest = (belief) => {
    setBeliefToDelete(belief);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!beliefToDelete) return;
    try {
      await CoreBeliefEntity.delete(beliefToDelete.id);
      setShowDeleteDialog(false);
      setBeliefToDelete(null);
      loadBeliefs();
    } catch (error) {
      console.error("Failed to delete belief:", error);
      alert("Failed to delete belief.");
    }
  };

  const handleOpenForm = () => {
    setEditingBelief(null);
    setShowForm(true);
  };

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <div className="space-y-4 max-w-4xl mx-auto">
                {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-20 w-full" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ShieldCheck className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Our Core <span className="text-amber-500">Beliefs</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          The foundational, biblical truths that anchor our faith, guide our ministry, and unite us as a community.
        </p>
      </div>

      {isAdmin && (
        <div className="max-w-4xl mx-auto flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage these statements.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add Statement
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingBelief ? 'Edit Belief' : 'Add New Belief'}</DialogTitle>
          </DialogHeader>
          <CoreBeliefForm belief={editingBelief} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the statement on "{beliefToDelete?.title}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        {beliefs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-slate-800">Statements Coming Soon</h3>
            <p className="text-slate-600 mt-2">Our detailed statement of faith is being prepared.</p>
          </div>
        ) : (
          <Accordion type="single" collapsible className="w-full bg-white p-4 sm:p-8 rounded-xl shadow-lg" defaultValue="item-0">
            {beliefs.map((belief, index) => (
              <AccordionItem value={`item-${index}`} key={belief.id}>
                <AccordionTrigger className="text-left hover:no-underline">
                  <div className="flex justify-between items-center w-full group">
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{belief.title}</h3>
                      {belief.scripture_reference && <p className="text-sm text-slate-500 mt-1">{belief.scripture_reference}</p>}
                    </div>
                     {isAdmin && (
                        <div className="flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-slate-100" onClick={(e) => {e.stopPropagation(); handleEdit(belief);}}><Edit className="w-4 h-4 text-slate-500"/></Button>
                            <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-red-50" onClick={(e) => {e.stopPropagation(); handleDeleteRequest(belief);}}><Trash2 className="w-4 h-4 text-red-500"/></Button>
                        </div>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-4 pb-6 text-base text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {belief.statement}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
}