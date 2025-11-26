import React from 'react';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import SocioDashboard from './dashboards/SocioDashboard';
import ClienteDashboard from './dashboards/ClienteDashboard';

const Dashboard = () => {
  const { user } = useAuth();

  // Determinar qué dashboard mostrar según el rol
  const getUserRole = () => {
    if (user?.is_staff || user?.is_superuser) {
      return 'ADMIN';
    }
    if (user?.role === 'PARTNER') {
      return 'PARTNER';
    }
    if (user?.role === 'CUSTOMER') {
      return 'CUSTOMER';
    }
    // Por defecto, si no tiene rol específico, mostrar dashboard de cliente
    return 'CUSTOMER';
  };

  const role = getUserRole();

  // Renderizar el dashboard correspondiente
  switch (role) {
    case 'ADMIN':
      return <AdminDashboard />;
    case 'PARTNER':
      return <SocioDashboard />;
    case 'CUSTOMER':
      return <ClienteDashboard />;
    default:
      return <ClienteDashboard />;
  }
};

export default Dashboard;
