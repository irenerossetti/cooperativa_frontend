import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../config/apiEndpoints';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axios.get(`${API_URL}${API_ENDPOINTS.AUTH.ME}`);
      setUser(response.data);
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}${API_ENDPOINTS.AUTH.LOGIN}`, credentials);
      const { user } = response.data;
      
      // Django Session Authentication - no necesitamos token
      setUser(user);
      
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error al iniciar sesión';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}${API_ENDPOINTS.AUTH.LOGOUT}`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading, error }}>
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
