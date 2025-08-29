import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { User, Users, Mail, Edit, Trash2 } from "lucide-react";

export default function MinistryCard({ ministry, onEdit, onDelete, isAdmin = false }) {
  return (
    <Card className="bg-white border-slate-100 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Ministry Image */}
      <div className="aspect-video relative overflow-hidden">
        {ministry.image_url ? (
          <img
            src={ministry.image_url}
            alt={ministry.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Users className="w-16 h-16 text-slate-400" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Admin Controls */}
        {isAdmin && (
          <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Button
              size="sm"
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={() => onEdit(ministry)}
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="destructive"
              className="bg-red-600/90 hover:bg-red-700"
              onClick={() => onDelete(ministry)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Ministry Info */}
      <CardContent className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-800 mb-2">{ministry.title}</h3>
          {!ministry.is_active && (
            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
              Inactive
            </Badge>
          )}
        </div>

        {/* Description */}
        <div className="mb-6">
          <p className="text-slate-600 leading-relaxed">
            {ministry.description}
          </p>
        </div>

        {/* Ministry Leader & Contact */}
        {(ministry.leader_name || ministry.contact_email) && (
          <div className="space-y-2 pt-4 border-t border-slate-100">
            {ministry.leader_name && (
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <User className="w-4 h-4" />
                <span>Led by {ministry.leader_name}</span>
              </div>
            )}
            {ministry.contact_email && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-slate-600 hover:text-amber-600 border-slate-200 hover:border-amber-300"
                  asChild
                >
                  <a href={`mailto:${ministry.contact_email}`}>
                    <Mail className="w-4 h-4" />
                    Contact
                  </a>
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}