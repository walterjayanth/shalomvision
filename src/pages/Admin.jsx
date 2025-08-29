
import React from 'react';
import AdminLayout from '../components/admin/AdminLayout';
import {
  LayoutDashboard,
  Users,
  Edit,
  Settings,
  MessageSquare,
  UserCheck
} from "lucide-react";

function AdminDashboardStat({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-800">{value}</p>
        </div>
        <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}

export default function Admin() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <header>
          <h1 className="text-3xl font-bold text-slate-800 flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8" />
            Admin Dashboard
          </h1>
          <p className="text-slate-500 mt-1">
            Welcome! Here's an overview of your website's content and activities.
          </p>
        </header>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminDashboardStat title="Total Users" value="12" icon={Users} color="#475569" />
          <AdminDashboardStat title="Ministries" value="4" icon={Edit} color="#F97316" />
          <AdminDashboardStat title="Testimonies" value="3" icon={MessageSquare} color="#10B981" />
          <AdminDashboardStat title="Leaders" value="3" icon={UserCheck} color="#F59E0B" />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Quick Actions</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <button className="p-4 bg-amber-50 hover:bg-amber-100 rounded-lg text-left">
                        <Edit className="w-6 h-6 text-orange-600 mb-2"/>
                        <h3 className="font-semibold">Manage Content</h3>
                        <p className="text-sm text-slate-500">Edit ministries, events, and more.</p>
                    </button>
                    <button className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg text-left">
                        <Users className="w-6 h-6 text-slate-600 mb-2"/>
                        <h3 className="font-semibold">Manage Users</h3>
                        <p className="text-sm text-slate-500">View users and update their roles.</p>
                    </button>
                    <button className="p-4 bg-green-50 hover:bg-green-100 rounded-lg text-left">
                        <MessageSquare className="w-6 h-6 text-green-600 mb-2"/>
                        <h3 className="font-semibold">Approve Testimonies</h3>
                        <p className="text-sm text-slate-500">Review new submissions.</p>
                    </button>
                    <button className="p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg text-left">
                        <Settings className="w-6 h-6 text-yellow-600 mb-2"/>
                        <h3 className="font-semibold">Website Settings</h3>
                        <p className="text-sm text-slate-500">Update site name and logo.</p>
                    </button>
                </div>
            </div>
             <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
                <ul className="space-y-3">
                    <li className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">Pastor John</span> updated the <span className="font-semibold">Youth Ministry</span> page. <span className="text-slate-400">- 2 hours ago</span>
                    </li>
                    <li className="text-sm text-slate-600">
                        A new user <span className="font-semibold text-slate-800">jane.doe@example.com</span> registered. <span className="text-slate-400">- 1 day ago</span>
                    </li>
                    <li className="text-sm text-slate-600">
                        New testimony submitted by <span className="font-semibold text-slate-800">Maria R</span>. <span className="text-slate-400">- 3 days ago</span>
                    </li>
                     <li className="text-sm text-slate-600">
                        <span className="font-semibold text-slate-800">Super Admin</span> updated the website settings. <span className="text-slate-400">- 5 days ago</span>
                    </li>
                </ul>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
}
