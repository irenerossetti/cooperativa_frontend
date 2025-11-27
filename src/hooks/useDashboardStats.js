import { useState, useEffect } from 'react';
import api from '../services/api';

export const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalPartners: 0,
    activeParcels: 0,
    harvestedProducts: 0,
    activeCampaigns: 0,
    monthlyRevenue: 0,
    growthRate: 0,
    loading: true,
    error: null
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Obtener socios
      const partnersResponse = await api.get('/api/partners/partners/');
      const partners = partnersResponse.data.results || partnersResponse.data || [];
      const totalPartners = partners.length;

      // Obtener parcelas
      const parcelsResponse = await api.get('/api/parcels/parcels/');
      const parcels = parcelsResponse.data.results || parcelsResponse.data || [];
      const activeParcels = parcels.filter(p => p.status === 'ACTIVE').length;

      // Obtener productos cosechados
      let harvestedProducts = 0;
      try {
        const productsResponse = await api.get('/api/production/harvested-products/');
        const products = productsResponse.data.results || productsResponse.data || [];
        harvestedProducts = products.reduce((sum, p) => sum + (parseFloat(p.quantity) || 0), 0);
      } catch (error) {
        console.log('No se pudieron cargar productos cosechados');
      }

      // Obtener campañas activas
      let activeCampaigns = 0;
      try {
        const campaignsResponse = await api.get('/api/campaigns/campaigns/');
        const campaigns = campaignsResponse.data.results || campaignsResponse.data || [];
        activeCampaigns = campaigns.filter(c => c.status === 'ACTIVE').length;
      } catch (error) {
        console.log('No se pudieron cargar campañas');
      }

      // Calcular ingresos del mes (de ventas)
      let monthlyRevenue = 0;
      try {
        const ordersResponse = await api.get('/api/sales/orders/');
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

      // Calcular tasa de crecimiento (socios nuevos últimos 30 días)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newPartners = partners.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= thirtyDaysAgo;
      }).length;

      const growthRate = totalPartners > 0 ? ((newPartners / totalPartners) * 100) : 0;

      setStats({
        totalPartners,
        activeParcels,
        harvestedProducts: Math.round(harvestedProducts),
        activeCampaigns,
        monthlyRevenue: Math.round(monthlyRevenue),
        growthRate: Math.round(growthRate * 10) / 10,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('Error al cargar estadísticas del dashboard:', error);
      setStats(prev => ({
        ...prev,
        loading: false,
        error: 'Error al cargar estadísticas'
      }));
    }
  };

  return { ...stats, refresh: fetchStats };
};
