import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const usePartnerDashboardStats = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    myParcels: 0,
    totalProduction: 0,
    completedActivities: 0,
    activeCampaigns: 0,
    monthlyRevenue: 0,
    performance: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    if (user && user.partner) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const partnerId = user.partner.id;

      // Obtener mis parcelas
      const parcelsResponse = await api.get(`/api/parcels/parcels/?partner=${partnerId}&page_size=10000`);
      const parcels = parcelsResponse.data.results || parcelsResponse.data || [];
      const myParcels = parcels.filter(p => p.status === 'ACTIVE').length;

      // Obtener mi producción total
      let totalProduction = 0;
      try {
        const productsResponse = await api.get(`/api/production/harvested-products/?partner=${partnerId}&page_size=10000`);
        const products = productsResponse.data.results || productsResponse.data || [];
        totalProduction = products.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
      } catch (error) {
        console.log('No se pudo cargar producción');
      }

      // Obtener labores realizadas
      let completedActivities = 0;
      try {
        const activitiesResponse = await api.get(`/api/farm-activities/activities/?page_size=10000`);
        const activities = activitiesResponse.data.results || activitiesResponse.data || [];
        // Filtrar por parcelas del socio
        const parcelIds = parcels.map(p => p.id);
        completedActivities = activities.filter(a => 
          parcelIds.includes(a.parcel) && a.status === 'COMPLETED'
        ).length;
      } catch (error) {
        console.log('No se pudieron cargar actividades');
      }

      // Obtener campañas activas (del socio)
      let activeCampaigns = 0;
      try {
        const campaignsResponse = await api.get('/api/campaigns/campaigns/?page_size=10000');
        const campaigns = campaignsResponse.data.results || campaignsResponse.data || [];
        activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
      } catch (error) {
        console.log('No se pudieron cargar campañas');
      }

      // Calcular ingresos del mes (ventas del socio)
      let monthlyRevenue = 0;
      try {
        const ordersResponse = await api.get('/api/sales/orders/?page_size=10000');
        const orders = ordersResponse.data.results || ordersResponse.data || [];
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        monthlyRevenue = orders
          .filter(order => {
            const orderDate = new Date(order.created_at);
            return orderDate.getMonth() === currentMonth && 
                   orderDate.getFullYear() === currentYear &&
                   order.status === 'COMPLETED';
          })
          .reduce((sum, order) => sum + (parseFloat(order.total_amount) || 0), 0);
      } catch (error) {
        console.log('No se pudieron cargar ventas');
      }

      // Calcular rendimiento (producción últimos 30 días vs anterior)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      let recentProduction = 0;
      try {
        const productsResponse = await api.get(`/api/production/harvested-products/?partner=${partnerId}&page_size=10000`);
        const products = productsResponse.data.results || productsResponse.data || [];
        recentProduction = products
          .filter(p => new Date(p.harvest_date) >= thirtyDaysAgo)
          .reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
      } catch (error) {
        console.log('No se pudo calcular rendimiento');
      }

      const performance = totalProduction > 0 ? ((recentProduction / totalProduction) * 100) : 0;

      setStats({
        myParcels,
        totalProduction: Math.round(totalProduction),
        completedActivities,
        activeCampaigns,
        monthlyRevenue: Math.round(monthlyRevenue),
        performance: Math.round(performance * 10) / 10,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error al cargar estadísticas del socio:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estadísticas'
      }));
    }
  };

  return { ...stats, refresh: fetchStats };
};
