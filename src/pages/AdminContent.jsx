
import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { ArrowRight, BookUser, Calendar, CalendarDays, Edit, FileText, ImageIcon, MessageSquare, Heart, ShieldCheck, HandHeart } from 'lucide-react';
import AdminLayout from '../components/admin/AdminLayout';

const contentSections = [
    { title: "Ministries", description: "Manage ministry pages and details.", icon: Edit, page: "Ministries" },
    { title: "Events", description: "Create and manage community events.", icon: Calendar, page: "Events" },
    { title: "Meetings", description: "Post summaries and photos from gatherings.", icon: CalendarDays, page: "Meetings" },
    { title: "Leaders", description: "Manage leadership team profiles.", icon: BookUser, page: "Leaders" },
    { title: "Speaker Profiles", description: "Manage guest speaker profiles.", icon: MessageSquare, page: "SpeakerProfiles" },
    { title: "Testimonies", description: "Approve and manage shared testimonies.", icon: Heart, page: "Testimonies" },
    { title: "Core Beliefs", description: "Edit the core beliefs statements.", icon: ShieldCheck, page: "CoreBelief" },
    { title: "Support Page", description: "Edit the content of the support page.", icon: HandHeart, page: "Support" },
    { title: "Gallery", description: "Upload and manage photo galleries.", icon: ImageIcon, page: "Gallery" }
];

export default function AdminContent() {
    return (
        <AdminLayout>
            <div className="space-y-4">
                <h1 className="text-2xl font-bold">Content Management</h1>
                <p className="text-slate-500">
                    Add, edit, and manage the content across your website's main pages.
                </p>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
                    {contentSections.map(section => (
                        <Link to={createPageUrl(section.page)} key={section.title}>
                            <Card className="hover:border-amber-400 hover:bg-amber-50/50 transition-all group">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-lg font-medium text-slate-800 group-hover:text-amber-700">
                                        {section.title}
                                    </CardTitle>
                                    <section.icon className="w-6 h-6 text-slate-400 group-hover:text-amber-600" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-slate-600">{section.description}</p>
                                    <div className="flex items-center gap-1 text-xs text-amber-600 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                        Manage Content <ArrowRight className="w-3 h-3"/>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
