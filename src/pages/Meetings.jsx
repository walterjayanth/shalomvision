
import React, { useState, useEffect } from 'react';
import { Meeting } from '@/api/entities';
import { User } from '@/api/entities';
import { SpeakerProfile } from '@/api/entities';
import { Testimony } from '@/api/entities'; // Import Testimony
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"; // Import Accordion components
import { CalendarDays, Plus, Settings, Trash2, ShieldAlert, Repeat, Heart } from 'lucide-react'; // Import Heart icon
import MeetingCard from '../components/meetings/MeetingCard';
import MeetingForm from '../components/meetings/MeetingForm';
import TestimonyCard from '../components/testimonies/TestimonyCard'; // Import TestimonyCard

export default function Meetings() {
  const [meetings, setMeetings] = useState([]);
  const [speakers, setSpeakers] = useState({});
  const [testimonies, setTestimonies] = useState([]); // State for testimonies
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [meetingToDelete, setMeetingToDelete] = useState(null);

  useEffect(() => {
    const checkUserAndLoad = async () => {
      try {
        const currentUser = await User.me();
        setIsAdmin(['super_admin', 'admin', 'editor'].includes(currentUser.role));
      } catch (error) {
        setIsAdmin(false);
      }
      loadData();
    };
    checkUserAndLoad();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [meetingsData, speakersData, testimoniesData] = await Promise.all([
        Meeting.list(),
        SpeakerProfile.list(),
        Testimony.list({ filter: { is_approved: true } }) // Fetch approved testimonies
      ]);

      const speakersMap = speakersData.reduce((acc, speaker) => {
        acc[speaker.id] = speaker;
        return acc;
      }, {});

      setMeetings(meetingsData);
      setSpeakers(speakersMap);
      setTestimonies(testimoniesData); // Set testimonies
    } catch (error) {
      console.error('Error loading meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingMeeting) {
        await Meeting.update(editingMeeting.id, formData);
      } else {
        await Meeting.create(formData);
      }
      setShowForm(false);
      setEditingMeeting(null);
      loadData();
    } catch (error) {
      console.error("Failed to save meeting:", error);
      alert("Failed to save meeting.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (meeting) => {
    setEditingMeeting(meeting);
    setShowForm(true);
  };

  const handleDeleteRequest = (meeting) => {
    setMeetingToDelete(meeting);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!meetingToDelete) return;
    try {
      await Meeting.delete(meetingToDelete.id);
      setShowDeleteDialog(false);
      setMeetingToDelete(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete meeting:", error);
      alert("Failed to delete meeting.");
    }
  };

  const handleOpenForm = () => {
    setEditingMeeting(null);
    setShowForm(true);
  };
  
  const getMeetingWithSpeakers = (meeting) => ({
    ...meeting,
    speakers: meeting.speaker_ids ? meeting.speaker_ids.map(id => speakers[id]).filter(Boolean) : []
  });

  const regularMeetings = meetings.filter(m => m.is_regular);
  const pastSummaries = meetings.filter(m => !m.is_regular).sort((a, b) => new Date(b.meeting_date) - new Date(a.meeting_date));

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-80 w-full" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <CalendarDays className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Meetings & <span className="text-amber-500">Gatherings</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Explore our regular gatherings and browse an archive of summaries and photos 
          from past services and community fellowships.
        </p>
      </div>
      
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage meeting entries.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add New Entry
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingMeeting ? 'Edit Meeting Entry' : 'Add New Entry'}</DialogTitle>
          </DialogHeader>
          <MeetingForm meeting={editingMeeting} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the entry for "{meetingToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Entry</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="space-y-16">
        {meetings.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CalendarDays className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No Meeting Summaries Yet</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Please check back soon for summaries and photos from our services and gatherings.</p>
          </div>
        ) : (
            <>
                {/* Regular Meetings */}
                {regularMeetings.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8 flex items-center justify-center gap-3">
                            <Repeat className="w-8 h-8 text-amber-500" />
                            Regular Gatherings
                        </h2>
                        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                            {regularMeetings.map(meeting => (
                            <MeetingCard key={meeting.id} meeting={getMeetingWithSpeakers(meeting)} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Past Summaries */}
                {pastSummaries.length > 0 && (
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">
                            Past Meeting Summaries
                        </h2>
                        <div className="space-y-8"> {/* Changed to space-y-8 to stack cards and accordions */}
                            {pastSummaries.map(meeting => {
                                const meetingTestimonies = testimonies.filter(t => t.linked_meeting_ids?.includes(meeting.id));
                                return (
                                    <div key={meeting.id}>
                                        <MeetingCard meeting={getMeetingWithSpeakers(meeting)} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
                                        {meetingTestimonies.length > 0 && (
                                            <Accordion type="single" collapsible className="w-full mt-[-1rem] pt-1">
                                                <AccordionItem value="item-1" className="border-t-0">
                                                    <div className="bg-white p-4 rounded-b-lg shadow-lg">
                                                        <AccordionTrigger className="text-sm font-semibold text-amber-700 hover:text-amber-800 py-2">
                                                        <div className="flex items-center gap-2">
                                                            <Heart className="w-4 h-4"/>
                                                            View {meetingTestimonies.length} Testimony/s from this Meeting
                                                        </div>
                                                        </AccordionTrigger>
                                                        <AccordionContent className="pt-4 space-y-4">
                                                        {meetingTestimonies.map(testimony => (
                                                            <TestimonyCard key={testimony.id} testimony={testimony} isAdmin={false} />
                                                        ))}
                                                        </AccordionContent>
                                                    </div>
                                                </AccordionItem>
                                            </Accordion>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </>
        )}
      </div>
    </div>
  );
}
