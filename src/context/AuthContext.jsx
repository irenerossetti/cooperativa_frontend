import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import API_ENDPOINTS from '../config/apiEndpoints';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Configurar axios para enviar cookies
axios.defaults.withCredentials = true;

// Configurar organización inicial desde localStorage
// Si no hay organización guardada, usar 'sammantha' como fallback
const initialOrganization = localStorage.getItem('currentOrganization') || 'sammantha';
if (initialOrganization) {
  axios.defaults.headers.common['X-Organization-Subdomain'] = initialOrganization;
}

// Configurar token JWT si existe
const token = localStorage.getItem('access_token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentOrganization, setCurrentOrganization] = useState(initialOrganization);

  useEffect(() => {
    checkAuth();
  }, []);
  
  useEffect(() => {
    // Guardar organización actual en localStorage
    localStorage.setItem('currentOrganization', currentOrganization);
    
    // Configurar axios para enviar el header de organización en todas las requests
    axios.defaults.headers.common['X-Organization-Subdomain'] = currentOrganization;
  }, [currentOrganization]);

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
      const { user, access, refresh } = response.data;
      
      // Guardar tokens JWT
      if (access) {
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      }
      
      setUser(user);
      
      // Si el usuario tiene partner, usar su organización automáticamente
      if (user.partner && user.partner.organization) {
        const userOrg = user.partner.organization.subdomain;
        if (userOrg !== currentOrganization) {
          setCurrentOrganization(userOrg);
          localStorage.setItem('currentOrganization', userOrg);
          axios.defaults.headers.common['X-Organization-Subdomain'] = userOrg;
        }
      }
      
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
      // Limpiar tokens JWT
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      delete axios.defaults.headers.common['Authorization'];
      setUser(null);
    }
  };

  const changeOrganization = (orgSubdomain) => {
    // Si el usuario está logueado, solo permitir cambio si es admin
    if (user && user.role?.name !== 'ADMIN') {
      console.warn('Solo administradores pueden cambiar de organización');
      return;
    }
    // Si no está logueado (en login page), permitir cambio libre
    setCurrentOrganization(orgSubdomain);
    localStorage.setItem('currentOrganization', orgSubdomain);
    axios.defaults.headers.common['X-Organization-Subdomain'] = orgSubdomain;
    
    // Solo recargar si ya está logueado
    if (user) {
      window.location.reload();
    }
  };
  
  // Detectar organización del usuario al hacer login
  useEffect(() => {
    if (user && user.partner) {
      // Si el usuario tiene un partner asociado, usar su organización
      const partnerOrg = user.partner.organization?.subdomain;
      if (partnerOrg && partnerOrg !== currentOrganization) {
        setCurrentOrganization(partnerOrg);
        localStorage.setItem('currentOrganization', partnerOrg);
        axios.defaults.headers.common['X-Organization-Subdomain'] = partnerOrg;
      }
    }
  }, [user]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      loading, 
      error,
      currentOrganization,
      changeOrganization
    }}>
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
