
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SpeakerProfile } from '@/api/entities';
import { Event } from '@/api/entities';
import { Meeting } from '@/api/entities';
import { Testimony } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Globe, User, ImageOff, Youtube, Instagram, Linkedin, Link2, Facebook, Twitter, MessageSquare, ArrowLeft, Briefcase, CalendarCheck, ClipboardList, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { format, isPast } from 'date-fns';
import TestimonyCard from '../components/testimonies/TestimonyCard';

const SocialIcon = ({ platform }) => {
    switch (platform) {
        case 'Facebook': return <Facebook className="w-5 h-5" />;
        case 'Twitter': return <Twitter className="w-5 h-5" />;
        case 'Instagram': return <Instagram className="w-5 h-5" />;
        case 'LinkedIn': return <Linkedin className="w-5 h-5" />;
        case 'YouTube': return <Youtube className="w-5 h-5" />;
        default: return <Link2 className="w-5 h-5" />;
    }
};

const LoadingSkeleton = () => (
    <div className="p-6 lg:p-8">
        <Skeleton className="h-8 w-48 mb-12" />
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <Skeleton className="w-48 h-48 rounded-full mx-auto" />
                <Skeleton className="h-8 w-3/4 mx-auto" />
                <Skeleton className="h-5 w-1/2 mx-auto" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
            <div className="lg:col-span-2 space-y-8">
                <Skeleton className="h-8 w-1/3" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
                <Skeleton className="h-48 w-full" />
                <div>
                    <Skeleton className="h-8 w-1/3 mb-4" />
                    <Skeleton className="h-16 w-full mb-2" />
                    <Skeleton className="h-16 w-full" />
                </div>
            </div>
        </div>
    </div>
);

export default function SpeakerProfilePage() {
    const [searchParams] = useSearchParams();
    const speakerId = searchParams.get('id');
    const [speaker, setSpeaker] = useState(null);
    const [engagements, setEngagements] = useState([]);
    const [testimonies, setTestimonies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (speakerId) {
            const fetchSpeakerData = async () => {
                setLoading(true);
                try {
                    const [speakerData, eventsData, meetingsData, testimoniesData] = await Promise.all([
                        SpeakerProfile.get(speakerId),
                        Event.list(),
                        Meeting.list(),
                        Testimony.list({ filter: { is_approved: true, linked_speaker_ids: speakerId } })
                    ]);

                    setSpeaker(speakerData);

                    const pastEvents = eventsData
                        .filter(event =>
                            event.speaker_ids?.includes(speakerId) && event.event_date && isPast(new Date(event.event_date))
                        )
                        .map(event => ({
                            type: 'event',
                            title: event.title,
                            date: new Date(event.event_date),
                            url: createPageUrl('Events')
                        }));

                    const pastMeetings = meetingsData
                        .filter(meeting =>
                            meeting.speaker_ids?.includes(speakerId) && !meeting.is_regular && meeting.meeting_date && isPast(new Date(meeting.meeting_date))
                        )
                        .map(meeting => ({
                            type: 'meeting',
                            title: meeting.title,
                            date: new Date(meeting.meeting_date),
                            url: createPageUrl('Meetings')
                        }));
                    
                    const allEngagements = [...pastEvents, ...pastMeetings];
                    allEngagements.sort((a, b) => b.date.getTime() - a.date.getTime()); // Sort by timestamp descending

                    setEngagements(allEngagements);
                    setTestimonies(testimoniesData);

                } catch (error) {
                    console.error("Failed to fetch speaker profile data:", error);
                    setSpeaker(null);
                    setEngagements([]);
                    setTestimonies([]);
                } finally {
                    setLoading(false);
                }
            };
            fetchSpeakerData();
        } else {
            setLoading(false);
        }
    }, [speakerId]);

    if (loading) {
        return <LoadingSkeleton />;
    }

    if (!speaker) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Speaker Not Found</h2>
                <p className="text-lg text-slate-600">The speaker profile you are looking for does not exist.</p>
                <Button asChild variant="link" className="mt-4">
                    <Link to={createPageUrl("SpeakerProfiles")}>
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to all speakers
                    </Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 bg-slate-50">
            <Link to={createPageUrl("SpeakerProfiles")} className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 mb-8 group">
                <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                Back to All Speakers
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 items-start">
                {/* Left Column - Sticky Profile Card */}
                <div className="lg:col-span-1 lg:sticky top-8">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="relative mb-4">
                            {speaker.profile_image ? (
                                <img src={speaker.profile_image} alt={speaker.name} className="w-48 h-48 rounded-full object-cover mx-auto border-4 border-amber-100 shadow-md" />
                            ) : (
                                <div className="w-48 h-48 rounded-full bg-slate-200 flex items-center justify-center mx-auto">
                                    <User className="w-24 h-24 text-slate-400" />
                                </div>
                            )}
                        </div>
                        <div className="text-center">
                            <h1 className="text-3xl font-bold text-slate-800">{speaker.name}</h1>
                            <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 mt-2">
                                {speaker.title}
                            </Badge>
                        </div>
                        <div className="mt-6 space-y-3">
                             {speaker.website && (
                                <Button asChild variant="outline" className="w-full">
                                    <a href={speaker.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                        <Globe className="w-4 h-4" /> Website
                                    </a>
                                </Button>
                            )}
                            {speaker.email && (
                                <Button asChild variant="outline" className="w-full">
                                    <a href={`mailto:${speaker.email}`} className="flex items-center gap-2">
                                        <Mail className="w-4 h-4" /> Email
                                    </a>
                                </Button>
                            )}
                        </div>
                        {speaker.social_links?.length > 0 && (
                            <div className="flex justify-center flex-wrap gap-2 pt-4 mt-4 border-t border-slate-100">
                                {speaker.social_links.map(link => (
                                    <Button key={link.platform} asChild variant="ghost" size="icon" className="text-slate-500 hover:text-slate-800">
                                        <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                                            <SocialIcon platform={link.platform} />
                                        </a>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Main Content */}
                <div className="lg:col-span-2 space-y-12">
                     <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-3">
                            <MessageSquare className="w-6 h-6 text-amber-500"/>
                            Biography
                        </h2>
                        <div className="prose prose-slate max-w-none text-slate-600">
                            <p>{speaker.bio}</p>
                        </div>
                    </div>

                    {(speaker.gallery_images && speaker.gallery_images.length > 0) && (
                         <div className="bg-white rounded-xl shadow-lg p-8">
                            <h2 className="text-2xl font-bold text-slate-800 mb-6">Gallery</h2>
                            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                                <CarouselContent>
                                {speaker.gallery_images.map((img, index) => (
                                    <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                                        <div className="p-1">
                                             <img src={img} alt={`Gallery image ${index + 1}`} className="aspect-square w-full h-full object-cover rounded-lg" />
                                        </div>
                                    </CarouselItem>
                                ))}
                                </CarouselContent>
                                <CarouselPrevious className="hidden md:flex"/>
                                <CarouselNext className="hidden md:flex"/>
                            </Carousel>
                        </div>
                    )}

                    {engagements.length > 0 && (
                        <Card className="bg-white rounded-xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <Briefcase className="w-6 h-6 text-amber-500"/>
                                    Speaking History
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {engagements.map((item, index) => (
                                    <Link to={item.url} key={index} className="block">
                                        <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                                            <div className="flex-shrink-0">
                                                {item.type === 'event' ? 
                                                    <CalendarCheck className="w-5 h-5 text-red-500" /> : 
                                                    <ClipboardList className="w-5 h-5 text-amber-600" />
                                                }
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-slate-800">{item.title}</p>
                                                <p className="text-sm text-slate-500">
                                                    {item.type === 'event' ? 'Event' : 'Meeting'} on {format(item.date, 'MMMM d, yyyy')}
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    
                    {testimonies.length > 0 && (
                        <Card className="bg-white rounded-xl shadow-lg">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-3 text-slate-800">
                                    <Heart className="w-6 h-6 text-amber-500"/>
                                    Testimonies
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {testimonies.map((testimony) => (
                                    <TestimonyCard key={testimony.id} testimony={testimony} isAdmin={false} />
                                ))}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
