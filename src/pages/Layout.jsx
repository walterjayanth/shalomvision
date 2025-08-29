
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User } from "@/api/entities";
import {
  Home,
  Users,
  Phone,
  Calendar,
  CalendarDays,
  UserCheck,
  MessageSquare,
  Heart,
  HandHeart,
  ImageIcon,
  Play,
  Menu,
  X,
  Cross,
  ShieldCheck,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";

const navigationItems = [
  { title: "Home", url: createPageUrl("Home"), icon: Home },
  { title: "About", url: createPageUrl("About"), icon: Users },
  { title: "Contact", url: createPageUrl("Contact"), icon: Phone },
  { title: "Ministries", url: createPageUrl("Ministries"), icon: Cross },
  { title: "Events", url: createPageUrl("Events"), icon: Calendar },
  { title: "Meetings", url: createPageUrl("Meetings"), icon: CalendarDays },
  { title: "Leaders", url: createPageUrl("Leaders"), icon: UserCheck },
  { title: "Speaker Profiles", url: createPageUrl("SpeakerProfiles"), icon: MessageSquare },
  { title: "Testimonies", url: createPageUrl("Testimonies"), icon: Heart },
  { title: "Core Belief", url: createPageUrl("CoreBelief"), icon: ShieldCheck },
  { title: "Support", url: createPageUrl("Support"), icon: HandHeart },
  { title: "Gallery", url: createPageUrl("Gallery"), icon: ImageIcon },
  { title: "Live Stream", url: createPageUrl("LiveStream"), icon: Play },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    checkUser();
  }, []);

  const isAdmin = user && ['super_admin', 'admin', 'editor'].includes(user.role);

  const NavContent = () => (
    <>
      <div className="flex items-center gap-3 p-6 border-b border-amber-100">
        <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
          <Cross className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800">Shalom Vision</h2>
          <p className="text-sm text-amber-600">Ministries NZ</p>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Link
              key={item.title}
              to={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                location.pathname === item.url
                  ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon className={`w-5 h-5 transition-colors ${
                location.pathname === item.url ? 'text-amber-600' : 'text-slate-400 group-hover:text-slate-600'
              }`} />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
          
          {isAdmin && (
            <>
              <div className="my-2 border-t border-slate-200" />
              <Link
                to={createPageUrl("Admin")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === createPageUrl("Admin") || location.pathname.startsWith('/Admin')
                    ? 'bg-amber-50 text-amber-700 shadow-sm border border-amber-200'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-amber-700'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Settings className={`w-5 h-5 transition-colors ${
                  location.pathname === createPageUrl("Admin") || location.pathname.startsWith('/Admin')
                    ? 'text-amber-600' 
                    : 'text-slate-400 group-hover:text-amber-600'
                }`} />
                <span className="font-medium">Admin Panel</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-amber-50/80 rounded-xl p-4">
          <h3 className="font-semibold text-slate-800 mb-2">Join Us</h3>
          <p className="text-sm text-slate-600 mb-3">Experience God's love in community</p>
          <Link to={createPageUrl("Contact")}>
            <Button size="sm" className="w-full bg-red-600 hover:bg-red-700 text-white">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <style>
        {`
          :root {
            --fiery-red: #EF4444;
            --golden-yellow: #FBBF24;
            --barley-brown: #FEF3C7; /* A soft, barley-like color */
            --warm-grey: #F5F5F5;
          }
        `}
      </style>
      
      <div className="hidden lg:flex">
        <aside className="w-80 h-screen bg-white/80 backdrop-blur-sm border-r border-amber-100 shadow-lg flex flex-col sticky top-0">
          <NavContent />
        </aside>
        
        <main className="flex-1">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      <div className="lg:hidden">
        <header className="bg-white/90 backdrop-blur-sm border-b border-amber-100 p-4 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center">
                <Cross className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800">Shalom Vision</h1>
                <p className="text-xs text-amber-600">Ministries NZ</p>
              </div>
            </div>
            
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
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
