import { Base44 } from '@base44/sdk';

// Initialize Base44 client
const base44 = new Base44({
  apiKey: import.meta.env.VITE_BASE44_API_KEY,
  baseUrl: import.meta.env.VITE_BASE44_BASE_URL || 'https://api.base44.com'
});

// User entity
export const User = {
  async me() {
    return await base44.auth.me();
  },
  
  async list() {
    return await base44.entities.User.list();
  },
  
  async get(id) {
    return await base44.entities.User.get(id);
  },
  
  async update(id, data) {
    return await base44.entities.User.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.User.delete(id);
  },
  
  async logout() {
    return await base44.auth.logout();
  }
};

// Ministry entity
export const Ministry = {
  async list(options = {}) {
    return await base44.entities.Ministry.list(options);
  },
  
  async get(id) {
    return await base44.entities.Ministry.get(id);
  },
  
  async create(data) {
    return await base44.entities.Ministry.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.Ministry.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.Ministry.delete(id);
  }
};

// Event entity
export const Event = {
  async list(options = {}) {
    return await base44.entities.Event.list(options);
  },
  
  async get(id) {
    return await base44.entities.Event.get(id);
  },
  
  async create(data) {
    return await base44.entities.Event.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.Event.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.Event.delete(id);
  },
  
  async filter(filters, sort, limit) {
    return await base44.entities.Event.filter(filters, sort, limit);
  }
};

// Meeting entity
export const Meeting = {
  async list(options = {}) {
    return await base44.entities.Meeting.list(options);
  },
  
  async get(id) {
    return await base44.entities.Meeting.get(id);
  },
  
  async create(data) {
    return await base44.entities.Meeting.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.Meeting.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.Meeting.delete(id);
  },
  
  async filter(filters, sort) {
    return await base44.entities.Meeting.filter(filters, sort);
  }
};

// Leader entity
export const Leader = {
  async list(options = {}) {
    return await base44.entities.Leader.list(options);
  },
  
  async get(id) {
    return await base44.entities.Leader.get(id);
  },
  
  async create(data) {
    return await base44.entities.Leader.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.Leader.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.Leader.delete(id);
  }
};

// SpeakerProfile entity
export const SpeakerProfile = {
  async list(sort) {
    const options = sort ? { sort } : {};
    return await base44.entities.SpeakerProfile.list(options);
  },
  
  async get(id) {
    return await base44.entities.SpeakerProfile.get(id);
  },
  
  async create(data) {
    return await base44.entities.SpeakerProfile.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.SpeakerProfile.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.SpeakerProfile.delete(id);
  }
};

// Testimony entity
export const Testimony = {
  async list(options = {}) {
    return await base44.entities.Testimony.list(options);
  },
  
  async get(id) {
    return await base44.entities.Testimony.get(id);
  },
  
  async create(data) {
    return await base44.entities.Testimony.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.Testimony.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.Testimony.delete(id);
  }
};

// CoreBelief entity
export const CoreBelief = {
  async list(options = {}) {
    return await base44.entities.CoreBelief.list(options);
  },
  
  async get(id) {
    return await base44.entities.CoreBelief.get(id);
  },
  
  async create(data) {
    return await base44.entities.CoreBelief.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.CoreBelief.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.CoreBelief.delete(id);
  }
};

// SupportInfo entity
export const SupportInfo = {
  async list(options = {}) {
    return await base44.entities.SupportInfo.list(options);
  },
  
  async get(id) {
    return await base44.entities.SupportInfo.get(id);
  },
  
  async create(data) {
    return await base44.entities.SupportInfo.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.SupportInfo.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.SupportInfo.delete(id);
  }
};

// GalleryImage entity
export const GalleryImage = {
  async list(options = {}) {
    return await base44.entities.GalleryImage.list(options);
  },
  
  async get(id) {
    return await base44.entities.GalleryImage.get(id);
  },
  
  async create(data) {
    return await base44.entities.GalleryImage.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.GalleryImage.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.GalleryImage.delete(id);
  }
};

// WebsiteSettings entity
export const WebsiteSettings = {
  async list(options = {}) {
    return await base44.entities.WebsiteSettings.list(options);
  },
  
  async get(id) {
    return await base44.entities.WebsiteSettings.get(id);
  },
  
  async create(data) {
    return await base44.entities.WebsiteSettings.create(data);
  },
  
  async update(id, data) {
    return await base44.entities.WebsiteSettings.update(id, data);
  },
  
  async delete(id) {
    return await base44.entities.WebsiteSettings.delete(id);
  }
};