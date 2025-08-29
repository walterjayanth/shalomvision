import { useState, useEffect, createContext, useContext } from 'react';
import { Auth } from '@/api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await Auth.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await Auth.login(email, password);
      await checkAuthStatus(); // Refresh user data
      return response;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email, password, userData = {}) => {
    try {
      const response = await Auth.register(email, password, userData);
      await checkAuthStatus(); // Refresh user data
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await Auth.logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, clear local state
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const hasRole = (requiredRoles) => {
    if (!user) return false;
    const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
    return roles.includes(user.role);
  };

  const isAdmin = () => {
    return hasRole(['super_admin', 'admin']);
  };

  const canEdit = () => {
    return hasRole(['super_admin', 'admin', 'editor']);
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    hasRole,
    isAdmin,
    canEdit,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};