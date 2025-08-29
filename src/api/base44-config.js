// Base44 Configuration and Entity Definitions

export const BASE44_ENTITIES = {
  User: {
    fields: {
      id: { type: 'uuid', primary: true },
      email: { type: 'string', required: true },
      full_name: { type: 'string' },
      role: { type: 'string', default: 'member' }, // member, editor, admin, super_admin
      created_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  Ministry: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      description: { type: 'text' },
      image_url: { type: 'string' },
      display_order: { type: 'integer', default: 1 },
      is_active: { type: 'boolean', default: true },
      leader_name: { type: 'string' },
      contact_email: { type: 'string' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  Event: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      description: { type: 'text' },
      event_date: { type: 'timestamp' },
      location: { type: 'string' },
      image_url: { type: 'string' },
      speaker_ids: { type: 'json', default: '[]' },
      is_coming_soon: { type: 'boolean', default: false },
      show_on_homepage_carousel: { type: 'boolean', default: false },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  Meeting: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      summary: { type: 'text' },
      meeting_date: { type: 'date' },
      images: { type: 'json', default: '[]' },
      speaker_ids: { type: 'json', default: '[]' },
      is_regular: { type: 'boolean', default: false },
      frequency: { type: 'string' },
      day_of_week: { type: 'string' },
      time_of_day: { type: 'string' },
      show_on_homepage: { type: 'boolean', default: false },
      show_on_homepage_carousel: { type: 'boolean', default: false },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  Leader: {
    fields: {
      id: { type: 'uuid', primary: true },
      name: { type: 'string', required: true },
      role: { type: 'string' },
      bio: { type: 'text' },
      profile_image: { type: 'string' },
      email: { type: 'string' },
      phone: { type: 'string' },
      display_order: { type: 'integer', default: 1 },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  SpeakerProfile: {
    fields: {
      id: { type: 'uuid', primary: true },
      name: { type: 'string', required: true },
      title: { type: 'string' },
      bio: { type: 'text' },
      profile_image: { type: 'string' },
      gallery_images: { type: 'json', default: '[]' },
      website: { type: 'string' },
      email: { type: 'string' },
      social_links: { type: 'json', default: '[]' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  Testimony: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      testifier_name: { type: 'string', required: true },
      story: { type: 'text', required: true },
      testimony_date: { type: 'date' },
      image_url: { type: 'string' },
      is_approved: { type: 'boolean', default: false },
      linked_event_ids: { type: 'json', default: '[]' },
      linked_meeting_ids: { type: 'json', default: '[]' },
      linked_speaker_ids: { type: 'json', default: '[]' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  CoreBelief: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      scripture_reference: { type: 'string' },
      statement: { type: 'text', required: true },
      display_order: { type: 'integer', default: 1 },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  SupportInfo: {
    fields: {
      id: { type: 'uuid', primary: true },
      page_title: { type: 'string', default: 'Support Our Ministry' },
      intro_text: { type: 'text' },
      image_url: { type: 'string' },
      donation_title: { type: 'string', default: 'Giving & Donations' },
      donation_details: { type: 'text' },
      volunteer_title: { type: 'string', default: 'Volunteer Opportunities' },
      volunteer_details: { type: 'text' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  GalleryImage: {
    fields: {
      id: { type: 'uuid', primary: true },
      title: { type: 'string', required: true },
      image_url: { type: 'string', required: true },
      tags: { type: 'json', default: '[]' },
      event_name: { type: 'string' },
      description: { type: 'text' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  },
  
  WebsiteSettings: {
    fields: {
      id: { type: 'uuid', primary: true },
      site_name: { type: 'string', default: 'Shalom Vision Ministries' },
      site_tagline: { type: 'string' },
      logo_url: { type: 'string' },
      created_date: { type: 'timestamp', default: 'now' },
      updated_date: { type: 'timestamp', default: 'now' }
    }
  }
};

// Base44 API configuration
export const BASE44_CONFIG = {
  apiVersion: 'v1',
  timeout: 30000,
  retryAttempts: 3,
  retryDelay: 1000
};