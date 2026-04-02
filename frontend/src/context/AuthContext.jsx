import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';

// Create Auth Context
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await authService.getCurrentUser();
      setUser(response.data);
    } catch (err) {
      localStorage.removeItem('token');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await authService.login(email, password);
      
      // Backend returns: { status, message, data: { userId, name, email, role, status, token } }
      if (response.data && response.data.token) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);

        return { success: true, data: userData };
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const register = async (name, email, password, role = 'viewer') => {
    try {
      setError(null);
      const response = await authService.register({ name, email, password, role });
      
      // Backend returns: { status, message, data: { userId, name, email, role, status, token } }
      if (response.data && response.data.token) {
        const { token, ...userData } = response.data;
        
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);

        return { success: true, data: userData };
      } else {
        throw new Error('No token received from server');
      }
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
