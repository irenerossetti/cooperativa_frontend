import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const API_URL = 'http://localhost:8000/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        axios.defaults.headers.common['Authorization'] = `Token ${token}`;
        const response = await axios.get(`${API_URL}/users/me/`);
        setUser(response.data);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await axios.post(`${API_URL}/users/login/`, credentials);
      const { token, user } = response.data;
      
      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Token ${token}`;
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
      await axios.post(`${API_URL}/users/logout/`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
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
