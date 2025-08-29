
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Calendar,
  Clock,
  Users,
  ExternalLink,
  Youtube,
  Monitor
} from "lucide-react";

export default function LiveStream() {
  const [isLive, setIsLive] = useState(false); // This would be dynamic in real app

  const upcomingServices = [
    {
      title: "Sunday Worship Service",
      date: "2024-12-29",
      time: "10:00 AM - 12:00 PM",
      description: "Join us for worship, prayer, and an inspiring message from God's Word."
    },
    {
      title: "Wednesday Bible Study",
      date: "2025-01-01",
      time: "7:00 PM - 8:30 PM", 
      description: "Deep dive into Scripture with our community Bible study."
    },
    {
      title: "Friday Prayer Meeting",
      date: "2025-01-03",
      time: "6:30 PM - 8:00 PM",
      description: "Come together in prayer for our community and beyond."
    }
  ];

  const pastStreams = [
    {
      title: "Christmas Sunday Service 2024",
      date: "2024-12-22",
      duration: "1h 45m",
      thumbnail: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=400&h=225&fit=crop",
      views: "245"
    },
    {
      title: "Advent Peace Service",
      date: "2024-12-15", 
      duration: "1h 30m",
      thumbnail: "https://images.unsplash.com/photo-1544519503-4f2c0d8f2c42?w=400&h=225&fit=crop",
      views: "189"
    },
    {
      title: "Community Thanksgiving",
      date: "2024-11-24",
      duration: "2h 10m", 
      thumbnail: "https://images.unsplash.com/photo-1515378791036-0648a814c963?w=400&h=225&fit=crop",
      views: "312"
    }
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <Play className="w-10 h-10 text-white ml-1" />
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-slate-800 mb-6">
          Live Stream & Videos
        </h1>
        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
          Join us online for live worship services, Bible studies, and special events. 
          Experience God's presence from anywhere in the world.
        </p>
      </div>

      {/* Live Stream Section */}
      <section className="mb-16">
        <Card className="bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200 shadow-lg overflow-hidden">
          <CardContent className="p-0">
            <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 relative flex items-center justify-center">
              {isLive ? (
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="w-12 h-12 text-white ml-1" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Service is Live!</h3>
                  <p className="text-slate-300">Click to join our worship service</p>
                </div>
              ) : (
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Currently Offline</h3>
                  <p className="text-slate-300">We'll be live during our scheduled service times</p>
                </div>
              )}
              
              {/* Live Badge */}
              {isLive && (
                <div className="absolute top-6 left-6">
                  <Badge className="bg-red-600 text-white border-red-500 animate-pulse">
                    🔴 LIVE
                  </Badge>
                </div>
              )}
              
              {/* Viewer Count */}
              {isLive && (
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1">
                  <Users className="w-4 h-4 text-white" />
                  <span className="text-white text-sm">127 watching</span>
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800 mb-2">
                    {isLive ? "Sunday Worship Service" : "Next Service"}
                  </h2>
                  <p className="text-slate-600 mb-4">
                    {isLive 
                      ? "Join us for worship, prayer, and God's Word" 
                      : "Sunday Worship - December 29, 2024 at 10:00 AM"
                    }
                  </p>
                </div>
                <div className="flex gap-3">
                  <Button 
                    className={`${
                      isLive 
                        ? "bg-red-600 hover:bg-red-700" 
                        : "bg-orange-600 hover:bg-orange-700"
                    }`}
                  >
                    <Play className="w-5 h-5 mr-2" />
                    {isLive ? "Join Live Stream" : "Set Reminder"}
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Youtube className="w-5 h-5" />
                    YouTube
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upcoming Services */}
        <section>
          <Card className="bg-white/80 backdrop-blur-sm border-amber-100 shadow-lg h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <Calendar className="w-6 h-6 text-orange-600" />
                Upcoming Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingServices.map((service, index) => (
                <div key={index} className="p-4 bg-amber-50/50 rounded-lg border border-amber-100">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-800">{service.title}</h3>
                    <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                      Upcoming
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {new Date(service.date).toLocaleDateString('en-NZ', {
                        weekday: 'long',
                        year: 'numeric', 
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {service.time}
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm">{service.description}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Watch Again - Past Streams */}
        <section>
          <Card className="bg-white/80 backdrop-blur-sm border-slate-100 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-slate-800">
                <Play className="w-6 h-6 text-red-600" />
                Watch Again
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {pastStreams.map((stream, index) => (
                <div key={index} className="flex gap-4 p-4 bg-slate-50/50 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="relative flex-shrink-0">
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-24 h-14 object-cover rounded-md"
                    />
                    <div className="absolute inset-0 bg-black/40 rounded-md flex items-center justify-center group-hover:bg-black/30 transition-colors">
                      <Play className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-800 mb-1 group-hover:text-orange-600 transition-colors">
                      {stream.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-1">
                      <span>{new Date(stream.date).toLocaleDateString('en-NZ')}</span>
                      <span>{stream.duration}</span>
                      <span>{stream.views} views</span>
                    </div>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-4">
                <Youtube className="w-4 h-4 mr-2" />
                View All on YouTube
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </section>
      </div>

      {/* How to Connect Section */}
      <section className="mt-16">
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">How to Join Our Live Stream</h2>
            <p className="text-xl mb-8 text-amber-100 max-w-3xl mx-auto">
              We stream live on multiple platforms to make it easy for you to join us wherever you are.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Youtube className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">YouTube Live</h3>
                <p className="text-amber-100">Watch on our YouTube channel with chat interaction</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Monitor className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Website Stream</h3>
                <p className="text-amber-100">Direct streaming right here on our website</p>
              </div>
              
              <div className="bg-white/10 rounded-xl p-6 backdrop-blur-sm">
                <Users className="w-12 h-12 text-white mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Interactive Features</h3>
                <p className="text-amber-100">Live chat, prayer requests, and community interaction</p>
              </div>
            </div>
            
            <Button size="lg" className="bg-white text-orange-600 hover:bg-amber-50">
              Subscribe for Notifications
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
