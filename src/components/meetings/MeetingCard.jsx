import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, Edit, Trash2, ImageOff, Clock, Repeat, User } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function MeetingCard({ meeting, isAdmin, onEdit, onDelete }) {
  const meetingDate = meeting.meeting_date ? parseISO(meeting.meeting_date) : null;
  const hasSpeakers = meeting.speakers && meeting.speakers.length > 0;

  return (
    <Card className="overflow-hidden transition-all duration-300 group bg-white shadow-lg hover:shadow-xl flex flex-col">
      <div className="aspect-video overflow-hidden relative bg-slate-100">
        {(meeting.images && meeting.images.length > 0) ? (
          <Carousel className="w-full h-full">
            <CarouselContent>
              {meeting.images.map((img, index) => (
                <CarouselItem key={index}>
                  <img
                    src={img}
                    alt={`${meeting.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            {meeting.images.length > 1 && (
                <>
                    <CarouselPrevious className="absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <CarouselNext className="absolute right-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
            )}
          </Carousel>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <ImageOff className="w-12 h-12" />
            <p className="mt-2 text-sm">No Images</p>
          </div>
        )}
        
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="h-8 w-8 bg-white/80 hover:bg-white text-slate-700" onClick={() => onEdit(meeting)}><Edit className="w-4 h-4" /></Button>
            <Button size="icon" className="h-8 w-8 bg-red-500/80 hover:bg-red-600 text-white" onClick={() => onDelete(meeting)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <div className='flex justify-between items-start'>
            <h3 className="font-bold text-lg text-slate-800 mb-3 line-clamp-2">{meeting.title}</h3>
            {meeting.is_regular && <Badge variant="secondary" className="bg-amber-100 text-amber-800 ml-2">Regular</Badge>}
        </div>
        
        {meeting.is_regular ? (
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-slate-600 mb-3">
                <div className="flex items-center gap-1.5">
                    <Repeat className="w-4 h-4 text-amber-600" />
                    <span>{meeting.frequency}</span>
                </div>
                {meeting.day_of_week && (
                    <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-amber-600" />
                        <span>{meeting.day_of_week}</span>
                    </div>
                )}
                {meeting.time_of_day && (
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>{meeting.time_of_day}</span>
                    </div>
                )}
            </div>
        ) : (
            meetingDate && (
                <div className="flex items-center gap-3 text-sm text-slate-600 mb-3">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>{format(meetingDate, 'MMMM d, yyyy')}</span>
                </div>
            )
        )}
        
        <p className="text-sm text-slate-500 line-clamp-3 flex-grow">{meeting.summary}</p>
        
        {hasSpeakers && (
          <div className="flex items-start gap-2 mt-3 pt-3 border-t text-sm">
            <User className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="flex flex-wrap items-center gap-x-2">
              <span className="font-medium">Speakers:</span>
              {meeting.speakers.map((speaker, index) => (
                  <span key={speaker.id} className="text-slate-600">
                      {speaker.name}{index < meeting.speakers.length - 1 ? ',' : ''}
                  </span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}