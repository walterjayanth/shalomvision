import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, ArrowRight, Speaker, Users } from 'lucide-react';
import { format } from 'date-fns';

export default function FeaturedEventCard({ event }) {
  if (!event) return null;

  const eventDate = new Date(event.event_date);
  const now = new Date();
  const timeDifference = eventDate.getTime() - now.getTime();
  const daysUntil = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  const hasSpeakers = event.speakers && event.speakers.length > 0;

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-amber-50 via-barley-brown to-amber-100 border-amber-200 shadow-xl">
      <div className="grid md:grid-cols-2">
        <div className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <Badge className="bg-red-600 text-white mb-4">Next Upcoming Event</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">{event.title}</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">{event.description}</p>
            <div className="space-y-4 text-slate-700 mb-8">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-amber-600" />
                <span>{format(eventDate, 'eeee, MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <span>{format(eventDate, 'h:mm a')}</span>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-amber-600" />
                <span>{event.location}</span>
              </div>
              {hasSpeakers && (
                <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 pt-0.5">
                      <Users className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <span className="font-semibold">Featuring:</span>
                      <div className="flex flex-wrap gap-x-2">
                        {event.speakers.map(speaker => (
                          <span key={speaker.id}>{speaker.name}</span>
                        ))}
                      </div>
                    </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button className="bg-red-600 hover:bg-red-700 text-white">
              Event Details <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {daysUntil > 0 && (
                <div className="font-semibold text-slate-700">{daysUntil} {daysUntil === 1 ? 'day' : 'days'} to go!</div>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1511795409834-ef04bbd51725?q=80&w=1470&auto=format&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </Card>
  );
}