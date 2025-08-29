
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Event } from "@/api/entities";
import { Meeting } from "@/api/entities"; // Added Meeting import
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Cross,
  Heart,
  Users,
  Calendar,
  ArrowRight,
  Play,
  MapPin,
  Clock,
  Speaker,
  Repeat, // Added Repeat icon
} from "lucide-react";
import { format } from 'date-fns';

function NextEventPreview() {
    const [nextEvent, setNextEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNextEvent = async () => {
            try {
                const now = new Date().toISOString();
                const upcomingEvents = await Event.filter({ 'event_date >=': now }, 'event_date', 1);
                if (upcomingEvents.length > 0) {
                    setNextEvent(upcomingEvents[0]);
                }
            } catch (error) {
                console.error("Error fetching next event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchNextEvent();
    }, []);

    if (loading) {
        return (
            <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md">
                <CardContent className="p-6">
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2 animate-pulse"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                </CardContent>
            </Card>
        );
    }
    
    if (!nextEvent) {
        return null; // Don't show the section if no upcoming events
    }

    return (
        <Link to={createPageUrl("Events")}>
            <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                        <div className="bg-amber-100 p-4 rounded-lg">
                           <Calendar className="w-8 h-8 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800 group-hover:text-amber-600 transition-colors">{nextEvent.title}</h3>
                            <p className="text-sm text-slate-600">{format(new Date(nextEvent.event_date), 'MMM d, yyyy')} at {format(new Date(nextEvent.event_date), 'h:mm a')}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

function EventCard({ event }) {
  const eventDate = new Date(event.event_date);
  return (
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?q=80&w=1470&auto=format&fit=crop'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-bold text-lg leading-tight">{event.title}</h3>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
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
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">{event.description}</p>
        <Button asChild variant="outline" className="w-full mt-auto">
            <Link to={createPageUrl(`Events`)}>
                Learn More <ArrowRight className="w-4 h-4 ml-2"/>
            </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function HomepageEventCarousel() {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedEvents = async () => {
      try {
        const events = await Event.filter({ show_on_homepage_carousel: true }, '-event_date');
        setFeaturedEvents(events);
      } catch (error) {
        console.error("Error fetching featured events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedEvents();
  }, []);

  if (loading) {
    return <div className="h-96 bg-slate-100 animate-pulse rounded-lg mx-auto max-w-6xl px-6 lg:px-8 py-12 lg:py-20"></div>;
  }

  if (featuredEvents.length === 0) {
    return null; // Don't render the carousel if there are no featured events
  }

  return (
     <section className="py-12 lg:py-20 bg-barley-brown/30">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                Featured Events
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12">
                Check out what's new and exciting in our community.
            </p>
            <Carousel
                opts={{
                    align: "start",
                    loop: true,
                }}
                className="w-full"
            >
                <CarouselContent>
                    {featuredEvents.map((event) => (
                        <CarouselItem key={event.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <EventCard event={event} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex"/>
                <CarouselNext className="hidden md:flex"/>
            </Carousel>
        </div>
     </section>
  );
}

function HomepageMeetingCarousel() {
  const [featuredMeetings, setFeaturedMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedMeetings = async () => {
      try {
        const meetings = await Meeting.filter({ show_on_homepage_carousel: true });
        setFeaturedMeetings(meetings);
      } catch (error) {
        console.error("Error fetching featured meetings:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeaturedMeetings();
  }, []);

  if (loading || featuredMeetings.length === 0) {
    return null;
  }

  return (
     <section className="py-12 lg:py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-800 text-center mb-2">
                Featured Gatherings
            </h2>
            <p className="text-lg text-slate-600 text-center mb-12">
                Highlights from our community life and special services.
            </p>
            <Carousel opts={{ align: "start", loop: true }} className="w-full">
                <CarouselContent>
                    {featuredMeetings.map((meeting) => (
                        <CarouselItem key={meeting.id} className="md:basis-1/2 lg:basis-1/3">
                            <div className="p-1">
                                <MeetingCarouselCard meeting={meeting} />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="hidden md:flex"/>
                <CarouselNext className="hidden md:flex"/>
            </Carousel>
        </div>
     </section>
  );
}

function MeetingCarouselCard({ meeting }) {
  return (
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col">
      <div className="aspect-video overflow-hidden relative">
        <img
          src={meeting.images?.[0] || 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?q=80&w=1470&auto=format&fit=crop'}
          alt={meeting.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        <div className="absolute bottom-4 left-4 text-white">
            <h3 className="font-bold text-lg leading-tight">{meeting.title}</h3>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        {meeting.is_regular ? (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                <Repeat className="w-4 h-4 text-amber-600" />
                <span>{meeting.frequency} on {meeting.day_of_week}s</span>
            </div>
        ) : (
            <div className="flex items-center gap-1.5 text-sm text-slate-600 mb-3">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>{format(new Date(meeting.meeting_date), 'MMM d, yyyy')}</span>
            </div>
        )}
        <p className="text-sm text-slate-500 line-clamp-3 mb-4 flex-grow">{meeting.summary}</p>
        <Button asChild variant="outline" className="w-full mt-auto">
            <Link to={createPageUrl(`Meetings`)}>
                View Summary <ArrowRight className="w-4 h-4 ml-2"/>
            </Link>
        </Button>
      </CardContent>
    </Card>
  )
}

function RegularMeetingsPreview() {
    const [regularMeetings, setRegularMeetings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRegularMeetings = async () => {
            try {
                const meetings = await Meeting.filter({ show_on_homepage: true, is_regular: true });
                setRegularMeetings(meetings);
            } catch (error) {
                console.error("Error fetching regular meetings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRegularMeetings();
    }, []);

    if (loading || regularMeetings.length === 0) {
        return null;
    }

    return (
        <section className="px-6 lg:px-8 py-20 bg-barley-brown/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Our Regular Gatherings
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regularMeetings.map(meeting => (
                <Link to={createPageUrl("Meetings")} key={meeting.id}>
                    <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                        <CardContent className="p-6 flex flex-col items-center text-center">
                           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-200">
                               <Repeat className="w-8 h-8 text-amber-500" />
                           </div>
                           <h3 className="font-semibold text-slate-800 text-lg">{meeting.title}</h3>
                           <p className="text-sm text-slate-600">{meeting.frequency} at {meeting.time_of_day}</p>
                        </CardContent>
                    </Card>
                </Link>
            ))}
          </div>
        </div>
      </section>
    );
}

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative bg-barley-brown/30 text-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-50 to-transparent z-10"></div>
        <div className="relative px-6 lg:px-8 py-24 lg:py-32 z-20">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-full flex items-center justify-center shadow-lg">
                <Cross className="w-10 h-10" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Welcome to <span className="text-amber-500">Shalom Vision</span>
            </h1>
            
            <p className="text-xl lg:text-2xl mb-8 text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Experience God's peace and love in community. Join us as we grow together in faith, hope, and fellowship.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("About")}>
                <Button size="lg" className="bg-red-600 text-white hover:bg-red-700 font-semibold px-8 py-4 text-lg">
                  Learn About Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link to={createPageUrl("LiveStream")}>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-slate-300 text-slate-700 hover:bg-slate-100 hover:text-slate-900 px-8 py-4 text-lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Watch Live
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      <HomepageEventCarousel />

      <HomepageMeetingCarousel />

      <RegularMeetingsPreview />

      {/* Welcome Message */}
      <section className="px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-8">
            A Community of <span className="text-amber-500">Faith and Love</span>
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed mb-12">
            At Shalom Vision Ministries, we believe in the transformative power of God's love. 
            Our community is built on the foundations of faith, hope, and fellowship, where every person 
            is welcomed with open arms and encouraged to grow in their spiritual journey.
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white border-slate-100 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Cross className="w-8 h-8 text-amber-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Faith</h3>
                <p className="text-slate-600">
                  Growing deeper in our relationship with God through worship, prayer, and His Word.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-slate-100 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-slate-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Fellowship</h3>
                <p className="text-slate-600">
                  Building meaningful connections and supporting one another in our spiritual journeys.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white border-slate-100 shadow-md hover:shadow-xl transition-all duration-300">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-4">Love</h3>
                <p className="text-slate-600">
                  Sharing God's unconditional love with our community and reaching out to those in need.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="px-6 lg:px-8 py-20 bg-barley-brown/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-800 text-center mb-12">
            Connect with Us
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link to={createPageUrl("Meetings")}>
              <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                        <div className="bg-slate-100 p-4 rounded-lg">
                           <Clock className="w-8 h-8 text-slate-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Regular Meetings</h3>
                            <p className="text-sm text-slate-600">Weekly services & studies</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={createPageUrl("Testimonies")}>
              <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                 <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                        <div className="bg-red-100 p-4 rounded-lg">
                           <Heart className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Testimonies</h3>
                            <p className="text-sm text-slate-600">Inspiring stories of faith</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </Link>
            
            <Link to={createPageUrl("Contact")}>
              <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                 <CardContent className="p-6">
                   <div className="flex items-center gap-4">
                        <div className="bg-green-100 p-4 rounded-lg">
                           <MapPin className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-slate-800">Visit Us</h3>
                            <p className="text-sm text-slate-600">Find our location & info</p>
                        </div>
                    </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 lg:px-8 py-20 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-12 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Experience God's Peace Today
              </h2>
              <p className="text-xl mb-8 text-red-100">
                Join our community of believers and discover the joy of walking with Christ.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to={createPageUrl("Contact")}>
                  <Button size="lg" className="bg-white text-red-600 hover:bg-red-50 px-8 py-4 text-lg font-semibold">
                    Get Connected
                  </Button>
                </Link>
                <Link to={createPageUrl("Support")}>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-4 text-lg"
                  >
                    Support Our Ministry
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
