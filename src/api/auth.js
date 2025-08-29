import { Base44 } from '@base44/sdk';

// Initialize Base44 client
const base44 = new Base44({
  apiKey: import.meta.env.VITE_BASE44_API_KEY,
  baseUrl: import.meta.env.VITE_BASE44_BASE_URL || 'https://api.base44.com'
});

// Authentication functions
export const Auth = {
  async login(email, password) {
    try {
      const response = await base44.auth.login({ email, password });
      return response;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  },
  
  async register(email, password, userData = {}) {
    try {
      const response = await base44.auth.register({ 
        email, 
        password,
        ...userData 
      });
      return response;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  },
  
  async logout() {
    try {
      await base44.auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  },
  
  async getCurrentUser() {
    try {
      return await base44.auth.me();
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  },
  
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },
  
  async hasRole(requiredRoles) {
    try {
      const user = await this.getCurrentUser();
      if (!user) return false;
      
      const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
      return roles.includes(user.role);
    } catch (error) {
      return false;
    }
  }
};