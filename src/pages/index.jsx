import Layout from "./Layout.jsx";

import Home from "./Home";

import About from "./About";

import Contact from "./Contact";

import Leaders from "./Leaders";

import LiveStream from "./LiveStream";

import Ministries from "./Ministries";

import Events from "./Events";

import Meetings from "./Meetings";

import SpeakerProfiles from "./SpeakerProfiles";

import Testimonies from "./Testimonies";

import CoreBelief from "./CoreBelief";

import Support from "./Support";

import Gallery from "./Gallery";

import Admin from "./Admin";

import AdminUsers from "./AdminUsers";

import AdminContent from "./AdminContent";

import AdminSettings from "./AdminSettings";

import SpeakerProfilePage from "./SpeakerProfilePage";

import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

const PAGES = {
    
    Home: Home,
    
    About: About,
    
    Contact: Contact,
    
    Leaders: Leaders,
    
    LiveStream: LiveStream,
    
    Ministries: Ministries,
    
    Events: Events,
    
    Meetings: Meetings,
    
    SpeakerProfiles: SpeakerProfiles,
    
    Testimonies: Testimonies,
    
    CoreBelief: CoreBelief,
    
    Support: Support,
    
    Gallery: Gallery,
    
    Admin: Admin,
    
    AdminUsers: AdminUsers,
    
    AdminContent: AdminContent,
    
    AdminSettings: AdminSettings,
    
    SpeakerProfilePage: SpeakerProfilePage,
    
}

function _getCurrentPage(url) {
    if (url.endsWith('/')) {
        url = url.slice(0, -1);
    }
    let urlLastPart = url.split('/').pop();
    if (urlLastPart.includes('?')) {
        urlLastPart = urlLastPart.split('?')[0];
    }

    const pageName = Object.keys(PAGES).find(page => page.toLowerCase() === urlLastPart.toLowerCase());
    return pageName || Object.keys(PAGES)[0];
}

// Create a wrapper component that uses useLocation inside the Router context
function PagesContent() {
    const location = useLocation();
    const currentPage = _getCurrentPage(location.pathname);
    
    return (
        <Layout currentPageName={currentPage}>
            <Routes>            
                
                    <Route path="/" element={<Home />} />
                
                
                <Route path="/Home" element={<Home />} />
                
                <Route path="/About" element={<About />} />
                
                <Route path="/Contact" element={<Contact />} />
                
                <Route path="/Leaders" element={<Leaders />} />
                
                <Route path="/LiveStream" element={<LiveStream />} />
                
                <Route path="/Ministries" element={<Ministries />} />
                
                <Route path="/Events" element={<Events />} />
                
                <Route path="/Meetings" element={<Meetings />} />
                
                <Route path="/SpeakerProfiles" element={<SpeakerProfiles />} />
                
                <Route path="/Testimonies" element={<Testimonies />} />
                
                <Route path="/CoreBelief" element={<CoreBelief />} />
                
                <Route path="/Support" element={<Support />} />
                
                <Route path="/Gallery" element={<Gallery />} />
                
                <Route path="/Admin" element={<Admin />} />
                
                <Route path="/AdminUsers" element={<AdminUsers />} />
                
                <Route path="/AdminContent" element={<AdminContent />} />
                
                <Route path="/AdminSettings" element={<AdminSettings />} />
                
                <Route path="/SpeakerProfilePage" element={<SpeakerProfilePage />} />
                
            </Routes>
        </Layout>
    );
}

export default function Pages() {
    return (
        <Router>
            <PagesContent />
        </Router>
    );
}