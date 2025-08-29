-- Database Schema for Shalom Vision Ministries

-- Users table (handled by Base44 authentication)
-- This is managed by Base44's built-in user system

-- Ministries table
CREATE TABLE IF NOT EXISTS ministries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT true,
  leader_name VARCHAR(255),
  contact_email VARCHAR(255),
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date TIMESTAMP,
  location VARCHAR(255),
  image_url TEXT,
  speaker_ids JSON DEFAULT '[]',
  is_coming_soon BOOLEAN DEFAULT false,
  show_on_homepage_carousel BOOLEAN DEFAULT false,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Meetings table
CREATE TABLE IF NOT EXISTS meetings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  summary TEXT,
  meeting_date DATE,
  images JSON DEFAULT '[]',
  speaker_ids JSON DEFAULT '[]',
  is_regular BOOLEAN DEFAULT false,
  frequency VARCHAR(100),
  day_of_week VARCHAR(20),
  time_of_day VARCHAR(50),
  show_on_homepage BOOLEAN DEFAULT false,
  show_on_homepage_carousel BOOLEAN DEFAULT false,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leaders table
CREATE TABLE IF NOT EXISTS leaders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  email VARCHAR(255),
  phone VARCHAR(50),
  display_order INTEGER DEFAULT 1,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Speaker Profiles table
CREATE TABLE IF NOT EXISTS speaker_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  title VARCHAR(255),
  bio TEXT,
  profile_image TEXT,
  gallery_images JSON DEFAULT '[]',
  website TEXT,
  email VARCHAR(255),
  social_links JSON DEFAULT '[]',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonies table
CREATE TABLE IF NOT EXISTS testimonies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  testifier_name VARCHAR(255) NOT NULL,
  story TEXT NOT NULL,
  testimony_date DATE,
  image_url TEXT,
  is_approved BOOLEAN DEFAULT false,
  linked_event_ids JSON DEFAULT '[]',
  linked_meeting_ids JSON DEFAULT '[]',
  linked_speaker_ids JSON DEFAULT '[]',
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Core Beliefs table
CREATE TABLE IF NOT EXISTS core_beliefs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  scripture_reference VARCHAR(255),
  statement TEXT NOT NULL,
  display_order INTEGER DEFAULT 1,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Support Info table
CREATE TABLE IF NOT EXISTS support_info (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_title VARCHAR(255) DEFAULT 'Support Our Ministry',
  intro_text TEXT,
  image_url TEXT,
  donation_title VARCHAR(255) DEFAULT 'Giving & Donations',
  donation_details TEXT,
  volunteer_title VARCHAR(255) DEFAULT 'Volunteer Opportunities',
  volunteer_details TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  tags JSON DEFAULT '[]',
  event_name VARCHAR(255),
  description TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Website Settings table
CREATE TABLE IF NOT EXISTS website_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name VARCHAR(255) DEFAULT 'Shalom Vision Ministries',
  site_tagline VARCHAR(255),
  logo_url TEXT,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_ministries_display_order ON ministries(display_order);
CREATE INDEX IF NOT EXISTS idx_ministries_active ON ministries(is_active);
CREATE INDEX IF NOT EXISTS idx_events_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_homepage ON events(show_on_homepage_carousel);
CREATE INDEX IF NOT EXISTS idx_meetings_date ON meetings(meeting_date);
CREATE INDEX IF NOT EXISTS idx_meetings_regular ON meetings(is_regular);
CREATE INDEX IF NOT EXISTS idx_leaders_display_order ON leaders(display_order);
CREATE INDEX IF NOT EXISTS idx_testimonies_approved ON testimonies(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonies_date ON testimonies(testimony_date);
CREATE INDEX IF NOT EXISTS idx_core_beliefs_display_order ON core_beliefs(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_created_date ON gallery_images(created_date);