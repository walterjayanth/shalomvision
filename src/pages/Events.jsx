
import React, { useState, useEffect } from 'react';
import { Event } from '@/api/entities';
import { User } from '@/api/entities';
import { SpeakerProfile } from '@/api/entities';
import { Testimony } from '@/api/entities'; // Import Testimony
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Calendar, Plus, Settings, Users, Trash2, ShieldAlert, Heart } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import FeaturedEventCard from '../components/events/FeaturedEventCard';
import EventForm from '../components/events/EventForm';
import TestimonyCard from '../components/testimonies/TestimonyCard'; // Import TestimonyCard

export default function Events() {
  const [events, setEvents] = useState([]);
  const [speakers, setSpeakers] = useState({});
  const [testimonies, setTestimonies] = useState([]); // State for testimonies
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);

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
      const [eventsData, speakersData, testimoniesData] = await Promise.all([
        Event.list({ sort: '-event_date' }),
        SpeakerProfile.list(),
        Testimony.list({ filter: { is_approved: true } }) // Fetch approved testimonies
      ]);
      
      const speakersMap = speakersData.reduce((acc, speaker) => {
        acc[speaker.id] = speaker;
        return acc;
      }, {});

      setEvents(eventsData);
      setSpeakers(speakersMap);
      setTestimonies(testimoniesData); // Set testimonies

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (editingEvent) {
        await Event.update(editingEvent.id, formData);
      } else {
        await Event.create(formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      console.error("Failed to save event:", error);
      alert("Failed to save event.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setShowForm(true);
  };

  const handleDeleteRequest = (event) => {
    setEventToDelete(event);
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    if (!eventToDelete) return;
    try {
      await Event.delete(eventToDelete.id);
      setShowDeleteDialog(false);
      setEventToDelete(null);
      loadData();
    } catch (error) {
      console.error("Failed to delete event:", error);
      alert("Failed to delete event.");
    }
  };

  const handleOpenForm = () => {
    setEditingEvent(null);
    setShowForm(true);
  };

  const now = new Date();
  const upcomingEvents = events.filter(e => new Date(e.event_date) >= now).sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  const pastEvents = events.filter(e => new Date(e.event_date) < now);

  const nextEvent = upcomingEvents[0];
  const otherUpcomingEvents = upcomingEvents.slice(1);
  
  const getEventWithSpeakers = (event) => ({
      ...event,
      speakers: event.speaker_ids ? event.speaker_ids.map(id => speakers[id]).filter(Boolean) : []
  });

  if (loading) {
    return (
        <div className="p-6 lg:p-8 space-y-8">
            <Skeleton className="h-12 w-1/3 mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-96 w-full" />
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-64 w-full" />)}
            </div>
        </div>
    )
  }

  return (
    <div className="p-6 lg:p-8 bg-slate-50">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Community <span className="text-amber-500">Events</span>
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Join us for services, conferences, and special gatherings. Discover opportunities
          for fellowship, growth, and celebration in our community.
        </p>
      </div>
      
      {isAdmin && (
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <Settings className="w-4 h-4" />
            <span>Admin Mode: You can manage events.</span>
          </div>
          <Button onClick={handleOpenForm} className="bg-red-600 hover:bg-red-700 text-white">
            <Plus className="w-5 h-5 mr-2" />
            Add New Event
          </Button>
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>{editingEvent ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          </DialogHeader>
          <EventForm event={editingEvent} onSave={handleSave} onCancel={() => setShowForm(false)} isLoading={isSaving} />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><ShieldAlert className="w-6 h-6 text-red-600"/>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete the event "{eventToDelete?.title}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>Delete Event</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Main Content */}
      <div className="space-y-16">
        {events.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 mb-4">No Events Scheduled</h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Please check back soon for upcoming community events and gatherings.</p>
          </div>
        ) : (
          <>
            {/* Next Event */}
            {nextEvent && <FeaturedEventCard event={getEventWithSpeakers(nextEvent)} />}

            {/* Other Upcoming Events */}
            {otherUpcomingEvents.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">More Upcoming Events</h2>
                <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                  {otherUpcomingEvents.map(event => (
                    <EventCard key={event.id} event={getEventWithSpeakers(event)} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} />
                  ))}
                </div>
              </div>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <div>
                <h2 className="text-3xl font-bold text-slate-800 text-center mb-8">Past Events</h2>
                <div className="space-y-8">
                  {pastEvents.map(event => {
                    const eventTestimonies = testimonies.filter(t => t.linked_event_ids?.includes(event.id));
                    return (
                      <div key={event.id}>
                        <EventCard event={getEventWithSpeakers(event)} isAdmin={isAdmin} onEdit={handleEdit} onDelete={handleDeleteRequest} isPast />
                        {eventTestimonies.length > 0 && (
                          <Accordion type="single" collapsible className="w-full mt-[-1rem] pt-1">
                            <AccordionItem value="item-1" className="border-t-0">
                               <div className="bg-white p-4 rounded-b-lg shadow-lg">
                                <AccordionTrigger className="text-sm font-semibold text-amber-700 hover:text-amber-800 py-2">
                                  <div className="flex items-center gap-2">
                                    <Heart className="w-4 h-4"/>
                                    View {eventTestimonies.length} Testimony/s from this Event
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="pt-4 space-y-4">
                                  {eventTestimonies.map(testimony => (
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
