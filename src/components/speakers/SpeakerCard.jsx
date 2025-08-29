import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Mail, Globe, Edit, Trash2, User, ImageOff, Youtube, Instagram, Linkedin, Link2, Facebook, Twitter } from 'lucide-react';

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

export default function SpeakerCard({ speaker, isAdmin, onEdit, onDelete }) {
  // Stop propagation for admin buttons to prevent card link navigation
  const handleAdminAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action(speaker);
  };
  
  return (
    <Card className="overflow-hidden transition-all duration-300 group bg-white shadow-lg hover:shadow-xl flex flex-col h-full hover:border-amber-300">
        <CardHeader className="flex flex-row items-center gap-4">
            <div className="relative">
                {speaker.profile_image ? (
                    <img src={speaker.profile_image} alt={speaker.name} className="w-24 h-24 rounded-full object-cover border-4 border-amber-100 shadow-md" />
                ) : (
                    <div className="w-24 h-24 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="w-12 h-12 text-slate-400" />
                    </div>
                )}
                 {isAdmin && (
                    <div className="absolute -top-1 -right-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button size="icon" className="h-7 w-7 bg-white/80 hover:bg-white text-slate-700" onClick={(e) => handleAdminAction(e, onEdit)}><Edit className="w-4 h-4" /></Button>
                        <Button size="icon" className="h-7 w-7 bg-red-500/80 hover:bg-red-600 text-white" onClick={(e) => handleAdminAction(e, onDelete)}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                )}
            </div>
            <div>
                <CardTitle className="text-2xl text-slate-800">{speaker.name}</CardTitle>
                <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 mt-1">
                    {speaker.title}
                </Badge>
            </div>
        </CardHeader>
      <CardContent className="p-6 pt-0">
        <p className="text-sm text-slate-600 mb-6 line-clamp-3">{speaker.bio}</p>
        
        {(speaker.gallery_images && speaker.gallery_images.length > 0) && (
             <div className="mb-6">
                <h4 className="font-semibold text-sm text-slate-700 mb-2">Gallery</h4>
                <Carousel className="w-full">
                    <CarouselContent>
                    {speaker.gallery_images.map((img, index) => (
                        <CarouselItem key={index} className="basis-1/2 sm:basis-1/3">
                            <img src={img} alt={`Gallery image ${index + 1}`} className="w-full h-24 object-cover rounded-md" />
                        </CarouselItem>
                    ))}
                    </CarouselContent>
                    <CarouselPrevious className="absolute left-2" />
                    <CarouselNext className="absolute right-2" />
                </Carousel>
            </div>
        )}

        <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            {speaker.website && (
                <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    <a href={speaker.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                        <Globe className="w-4 h-4" /> Website
                    </a>
                </Button>
            )}
            {speaker.email && (
                <Button asChild variant="outline" size="sm" onClick={(e) => e.stopPropagation()}>
                    <a href={`mailto:${speaker.email}`} className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                    </a>
                </Button>
            )}
             {speaker.social_links?.map(link => (
                <Button key={link.platform} asChild variant="outline" size="icon" className="h-9 w-9" onClick={(e) => e.stopPropagation()}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" title={link.platform}>
                        <SocialIcon platform={link.platform} />
                    </a>
                </Button>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}