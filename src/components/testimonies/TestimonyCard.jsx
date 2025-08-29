import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Quote, User, CheckCircle2, ShieldAlert } from 'lucide-react';
import { format } from 'date-fns';

export default function TestimonyCard({ testimony, isAdmin, onEdit, onDelete }) {

  const handleAdminAction = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    action(testimony);
  };
  
  return (
    <Card className={`transition-all duration-300 group bg-white shadow-lg flex flex-col h-full ${!testimony.is_approved ? 'border-amber-400 border-2' : ''}`}>
        <CardHeader className="flex flex-row items-start gap-4">
            {testimony.image_url ? (
                <img src={testimony.image_url} alt={testimony.testifier_name} className="w-16 h-16 rounded-full object-cover border-4 border-amber-100 shadow-md" />
            ) : (
                <div className="w-16 h-16 rounded-full bg-slate-200 flex items-center justify-center border-4 border-amber-100 shadow-md">
                    <User className="w-8 h-8 text-slate-400" />
                </div>
            )}
            <div className='flex-1'>
                <CardTitle className="text-xl text-slate-800">{testimony.title}</CardTitle>
                <p className="text-sm text-slate-600 mt-1">by <span className="font-semibold">{testimony.testifier_name}</span></p>
                <p className="text-xs text-slate-500">{format(new Date(testimony.testimony_date), 'MMMM d, yyyy')}</p>
            </div>
            <Quote className="w-10 h-10 text-amber-200" />
        </CardHeader>
      <CardContent className="px-6 pt-0 pb-6 flex-grow">
        <p className="text-sm text-slate-600 line-clamp-6">{testimony.story}</p>
      </CardContent>
      {isAdmin && (
        <CardFooter className="bg-slate-50 p-3 flex justify-between items-center border-t">
            {!testimony.is_approved && (
                <Badge variant="destructive" className="bg-amber-100 text-amber-800 border-amber-200">
                    <ShieldAlert className="w-4 h-4 mr-2"/>
                    Pending Approval
                </Badge>
            )}
            {testimony.is_approved && (
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle2 className="w-4 h-4 mr-2"/>
                    Approved
                </Badge>
            )}
            <div className="flex gap-2">
                <Button size="icon" variant="outline" className="h-8 w-8" onClick={(e) => handleAdminAction(e, onEdit)}><Edit className="w-4 h-4" /></Button>
                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={(e) => handleAdminAction(e, onDelete)}><Trash2 className="w-4 h-4" /></Button>
            </div>
        </CardFooter>
      )}
    </Card>
  );
}