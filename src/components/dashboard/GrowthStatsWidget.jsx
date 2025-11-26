import { useState, useEffect } from 'react';
import { TrendingUp, Users, ShoppingCart, UserPlus, Calendar } from 'lucide-react';
import api from '../../services/api';

const GrowthStatsWidget = () => {
  const [stats, setStats] = useState({
    newPartners: 0,
    newCustomers: 0,
    newOrders: 0,
    growthRate: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      // Obtener socios de los últimos 30 días
      const partnersResponse = await api.get('/api/partners/partners/');
      const partners = partnersResponse.data.results || partnersResponse.data || [];
      
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const newPartners = partners.filter(p => {
        const createdDate = new Date(p.created_at);
        return createdDate >= thirtyDaysAgo;
      }).length;

      // Obtener pedidos recientes
      try {
        const ordersResponse = await api.get('/api/sales/orders/');
        const orders = ordersResponse.data.results || ordersResponse.data || [];
        const newOrders = orders.filter(o => {
          const orderDate = new Date(o.created_at);
          return orderDate >= thirtyDaysAgo;
        }).length;

        setStats({
          newPartners,
          newCustomers: Math.floor(newOrders * 0.6), // Estimación
          newOrders,
          growthRate: partners.length > 0 ? ((newPartners / partners.length) * 100) : 0
        });
      } catch (error) {
        // Si no hay acceso a ventas, solo mostrar socios
        setStats({
          newPartners,
          newCustomers: 0,
          newOrders: 0,
          growthRate: partners.length > 0 ? ((newPartners / partners.length) * 100) : 0
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Crecimiento</h3>
          <p className="text-emerald-200/60 text-xs">Últimos 30 días</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Nuevos Socios */}
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <UserPlus className="w-4 h-4 text-blue-400" />
              <span className="text-emerald-200/80 text-sm">Nuevos Socios</span>
            </div>
            <span className="text-white font-bold text-lg">{stats.newPartners}</span>
          </div>
        </div>

        {/* Nuevos Clientes */}
        {stats.newCustomers > 0 && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-purple-400" />
                <span className="text-emerald-200/80 text-sm">Nuevos Clientes</span>
              </div>
              <span className="text-white font-bold text-lg">{stats.newCustomers}</span>
            </div>
          </div>
        )}

        {/* Nuevos Pedidos */}
        {stats.newOrders > 0 && (
          <div className="bg-white/5 rounded-lg p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShoppingCart className="w-4 h-4 text-green-400" />
                <span className="text-emerald-200/80 text-sm">Nuevos Pedidos</span>
              </div>
              <span className="text-white font-bold text-lg">{stats.newOrders}</span>
            </div>
          </div>
        )}

        {/* Tasa de Crecimiento */}
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-400/30 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-200 text-sm font-medium">Tasa de Crecimiento</span>
            </div>
            <span className="text-green-300 font-bold text-lg">+{stats.growthRate.toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-center space-x-2 text-emerald-200/60 text-xs">
          <Calendar className="w-3 h-3" />
          <span>Actualizado hoy</span>
        </div>
      </div>
    </div>
  );
};

export default GrowthStatsWidget;
