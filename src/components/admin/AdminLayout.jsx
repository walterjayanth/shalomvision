
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { User } from "@/api/entities";
import { createPageUrl } from "@/utils";
import {
  LayoutDashboard,
  Users,
  Settings,
  ShieldAlert,
  Edit,
  LogOut,
  Cross,
  Menu,
  Home
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminLayout({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        if (!['super_admin', 'admin', 'editor'].includes(currentUser.role)) {
          navigate(createPageUrl("Home"));
        } else {
          setUser(currentUser);
        }
      } catch (error) {
        navigate(createPageUrl("Home"));
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await User.logout();
    navigate(createPageUrl("Home"));
  };

  const adminNavItems = [
    { title: "Dashboard", url: createPageUrl("Admin"), icon: LayoutDashboard, roles: ['super_admin', 'admin', 'editor'] },
    { title: "Content", url: createPageUrl("AdminContent"), icon: Edit, roles: ['super_admin', 'admin', 'editor'] },
    { title: "Users", url: createPageUrl("AdminUsers"), icon: Users, roles: ['super_admin', 'admin'] },
    { title: "Settings", url: createPageUrl("AdminSettings"), icon: Settings, roles: ['super_admin'] },
  ];

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 p-6 border-b border-amber-100">
        <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Cross className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Admin Panel</h2>
          <p className="text-sm text-orange-600">Shalom Vision</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {adminNavItems.filter(item => user && item.roles.includes(user.role)).map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.url
                  ? 'bg-gradient-to-r from-amber-50 to-amber-100 text-orange-700 shadow-sm border border-amber-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                location.pathname === item.url ? 'text-orange-600' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="flex flex-col gap-2">
            <Link to={createPageUrl("Home")}>
              <Button variant="outline" className="w-full">
                <Home className="w-4 h-4 mr-2" /> Back to Website
              </Button>
            </Link>
            <Button variant="ghost" onClick={handleLogout} className="w-full text-slate-600">
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
        </div>
      </div>
    </>
  );

  if (loading) {
    return (
        <div className="flex">
            <Skeleton className="w-80 h-screen hidden lg:block" />
            <div className="flex-1 p-8">
                <Skeleton className="h-16 w-full mb-8" />
                <Skeleton className="h-96 w-full" />
            </div>
        </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-100">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-slate-600">You do not have permission to view this page.</p>
        <Link to={createPageUrl("Home")} className="mt-4">
          <Button>Go to Homepage</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="hidden lg:flex">
        <aside className="w-80 h-screen bg-white/80 backdrop-blur-sm border-r border-amber-100 shadow-lg flex flex-col sticky top-0">
          <NavContent />
        </aside>
        <main className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <header className="bg-white/90 backdrop-blur-sm border-b border-amber-100 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-slate-800">Admin Panel</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-slate-600">
                  <Menu className="w-6 h-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 p-0 bg-white/95 backdrop-blur-sm">
                <div className="flex flex-col h-full">
                  <NavContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <main className="p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
