import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mail, Phone, Edit, Trash2, User } from 'lucide-react';

export default function LeaderCard({ leader, isAdmin, onEdit, onDelete }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 group bg-white shadow-lg hover:shadow-xl flex flex-col">
      <div className="aspect-square overflow-hidden relative bg-slate-100">
        {leader.profile_image ? (
            <img
                src={leader.profile_image}
                alt={leader.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400 bg-gradient-to-br from-slate-50 to-slate-200">
                <User className="w-24 h-24" />
            </div>
        )}
        
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button size="icon" className="h-8 w-8 bg-white/80 hover:bg-white text-slate-700" onClick={() => onEdit(leader)}><Edit className="w-4 h-4" /></Button>
            <Button size="icon" className="h-8 w-8 bg-red-500/80 hover:bg-red-600 text-white" onClick={() => onDelete(leader)}><Trash2 className="w-4 h-4" /></Button>
          </div>
        )}
      </div>
      <CardContent className="p-6 flex-grow flex flex-col">
        <h3 className="font-bold text-xl text-slate-800">{leader.name}</h3>
        <Badge variant="secondary" className="bg-amber-100 text-amber-800 border-amber-200 mb-4 mt-1 self-start">
          {leader.role}
        </Badge>
        <p className="text-sm text-slate-600 line-clamp-4 flex-grow">{leader.bio}</p>
        
        {(leader.email || leader.phone) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
                {leader.email && (
                    <Button asChild variant="outline" size="sm" className="flex-grow">
                        <a href={`mailto:${leader.email}`} className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> Email
                        </a>
                    </Button>
                )}
                {leader.phone && (
                     <Button asChild variant="outline" size="sm" className="flex-grow">
                        <a href={`tel:${leader.phone}`} className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> Call
                        </a>
                    </Button>
                )}
            </div>
        )}
      </CardContent>
    </Card>
  );
}