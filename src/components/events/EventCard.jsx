
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function EventCard({ event, isAdmin, onEdit, onDelete, isPast = false }) {
  const eventDate = new Date(event.event_date);

  return (
    <Card className={`overflow-hidden transition-all duration-300 group ${isPast ? 'bg-slate-50/50' : 'bg-white shadow-lg hover:shadow-xl'}`}>
      <div className="aspect-video overflow-hidden relative">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1470&auto=format&fit=crop'}
          alt={event.title}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${isPast ? 'grayscale' : ''}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="h-8 w-8 bg-white/80 hover:bg-white text-slate-700" onClick={() => onEdit(event)}><Edit className="w-4 h-4" /></Button>
            <Button size="icon" className="h-8 w-8 bg-red-500/80 hover:bg-red-600 text-white" onClick={() => onDelete(event)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2 gap-2">
            <h3 className="font-bold text-lg text-slate-800 line-clamp-2">{event.title}</h3>
            <div className='flex-shrink-0'>
              {isPast && <Badge variant="outline">Past</Badge>}
              {event.is_coming_soon && !isPast && <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200">Coming Soon</Badge>}
            </div>
        </div>
        <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-amber-600" />
            <span>{format(eventDate, 'MMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 line-clamp-3">{event.description}</p>
      </CardContent>
    </Card>
  );
}
