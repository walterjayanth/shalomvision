import React, { useState, useEffect } from 'react';
import { GalleryImage } from '@/api/entities';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Image as ImageIcon, Plus, Settings, Trash2, ShieldAlert, X, Calendar, Tag, Info } from 'lucide-react';
import GalleryImageForm from '../components/gallery/GalleryImageForm';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageToDelete, setImageToDelete] = useState(null);
  
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadImages();
    };
    checkUserAndLoad();
  }, []);

  const loadImages = async () => {
    setLoading(true);
    try {
      const data = await GalleryImage.list({ sort: '-created_date' });
      setImages(data);
    } catch (error) {
      console.error('Error loading gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = () => {
    // The form will handle the creation, we just need to reload and close
    setShowForm(false);
    loadImages();
  };

  const handleDeleteRequest = (e, image) => {
    e.stopPropagation();
    setImageToDelete(image);
    setShowDeleteDialog(true);
  };
  
  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return;
    try {
      await GalleryImage.delete(imageToDelete.id);
      setShowDeleteDialog(false);
      setImageToDelete(null);
      loadImages();
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image.");
    }
  };

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array(8).fill(0).map((_, i) => <Skeleton key={i} className="h-48 w-full" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <ImageIcon className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Our <span className="text-amber-500">Gallery</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Moments of faith, fellowship, and joy captured from our services, events, and community life.
        </p>
      </div>

      {isAdmin && (
        <div className="max-w-7xl mx-auto flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can add and delete images.</span>
          </div>
          <Button onClick={() => setShowForm(true)} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add Image
          </Button>
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add New Image to Gallery</DialogTitle></DialogHeader>
          <GalleryImageForm onSave={handleSave} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>
      
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the image "{imageToDelete?.title}"? This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0">
            {selectedImage && (
                <div className="grid md:grid-cols-2">
                    <img src={selectedImage.image_url} alt={selectedImage.title} className="w-full h-full object-cover max-h-[80vh]" />
                    <div className="p-6 flex flex-col">
                        <DialogHeader>
                            <DialogTitle className="text-2xl">{selectedImage.title}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4 text-slate-600 flex-grow">
                            {selectedImage.description && <p className="flex items-start gap-3"><Info className="w-5 h-5 mt-1 text-amber-500 flex-shrink-0"/><span>{selectedImage.description}</span></p>}
                            {selectedImage.event_name && <p className="flex items-center gap-3"><Calendar className="w-5 h-5 text-amber-500"/>{selectedImage.event_name}</p>}
                            {selectedImage.tags?.length > 0 && (
                                <div className="flex items-start gap-3">
                                    <Tag className="w-5 h-5 mt-1 text-amber-500 flex-shrink-0"/>
                                    <div className="flex flex-wrap gap-2">{selectedImage.tags.map(tag => <span key={tag} className="text-xs bg-slate-100 px-2 py-1 rounded-full">{tag}</span>)}</div>
                                </div>
                            )}
                        </div>
                        <Button variant="outline" onClick={() => setSelectedImage(null)}>Close</Button>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

      <div className="max-w-7xl mx-auto">
        {images.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-slate-800">Gallery Coming Soon</h3>
            <p className="text-slate-600 mt-2">We are curating photos from our events. Please check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative aspect-square overflow-hidden rounded-lg cursor-pointer" onClick={() => setSelectedImage(image)}>
                <img src={image.image_url} alt={image.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-3 text-white">
                  <h3 className="font-semibold text-sm line-clamp-2">{image.title}</h3>
                </div>
                {isAdmin && (
                    <Button size="icon" variant="destructive" className="absolute top-2 right-2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => handleDeleteRequest(e, image)}>
                        <Trash2 className="w-4 h-4"/>
                    </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}