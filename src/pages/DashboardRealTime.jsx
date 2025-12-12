import { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  Package,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  DollarSign,
  ShoppingCart,
} from 'lucide-react';
import api from '../services/api';

const DashboardRealTime = () => {
  const [stats, setStats] = useState({
    total_sales: 0,
    total_partners: 0,
    total_products: 0,
    pending_orders: 0,
    sales_chart: [],
    top_products: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchStats = async () => {
    try {
      setError(null);
      const response = await api.get('/api/dashboard/realtime/');
      setStats(response.data);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Error al cargar estadísticas:', err);
      setError('Error al cargar los datos del dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh cada 30 segundos
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchStats();
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const handleRefresh = () => {
    setLoading(true);
    fetchStats();
  };

  if (loading && !stats.total_sales) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Dashboard en Tiempo Real
          </h1>
          <p className="text-emerald-200">
            Última actualización:{' '}
            {lastUpdate.toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 text-white">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              className="rounded"
            />
            <span>Auto-actualizar</span>
          </label>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 flex items-center space-x-3">
          <AlertCircle className="w-6 h-6 text-red-400" />
          <p className="text-red-200">{error}</p>
        </div>
      )}

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Ventas */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-400" />
            </div>
            <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          </div>
          <h3 className="text-white/60 text-sm mb-1">Total Ventas</h3>
          <p className="text-white text-2xl font-bold">
            ${stats.total_sales.toFixed(2)}
          </p>
        </div>

        {/* Total Socios */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <Activity className="w-5 h-5 text-blue-400 animate-pulse" />
          </div>
          <h3 className="text-white/60 text-sm mb-1">Total Socios</h3>
          <p className="text-white text-2xl font-bold">{stats.total_partners}</p>
        </div>

        {/* Total Productos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-purple-400" />
            </div>
            <Activity className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>
          <h3 className="text-white/60 text-sm mb-1">Total Productos</h3>
          <p className="text-white text-2xl font-bold">{stats.total_products}</p>
        </div>

        {/* Pedidos Pendientes */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-orange-400" />
            </div>
            <Activity className="w-5 h-5 text-orange-400 animate-pulse" />
          </div>
          <h3 className="text-white/60 text-sm mb-1">Pedidos Pendientes</h3>
          <p className="text-white text-2xl font-bold">{stats.pending_orders}</p>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas Últimos 7 Días */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5" />
            <span>Ventas Últimos 7 Días</span>
          </h3>
          <div className="space-y-3">
            {stats.sales_chart && stats.sales_chart.length > 0 ? (
              stats.sales_chart.map((sale, index) => {
                const maxAmount = Math.max(...stats.sales_chart.map((s) => s.amount));
                const percentage = maxAmount > 0 ? (sale.amount / maxAmount) * 100 : 0;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <span className="text-emerald-200 font-medium">{sale.date}</span>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-white font-semibold min-w-[80px] text-right">
                        ${sale.amount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">No hay datos de ventas</p>
              </div>
            )}
          </div>
        </div>

        {/* Productos Más Vendidos */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white text-lg font-semibold mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5" />
            <span>Productos Más Vendidos</span>
          </h3>
          <div className="space-y-3">
            {stats.top_products && stats.top_products.length > 0 ? (
              stats.top_products.map((product, index) => {
                const maxQuantity = Math.max(...stats.top_products.map((p) => p.quantity));
                const percentage = maxQuantity > 0 ? (product.quantity / maxQuantity) * 100 : 0;
                
                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                        <span className="text-emerald-300 font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-white/10 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-purple-500 to-purple-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-emerald-200 font-semibold min-w-[60px] text-right">
                        {product.quantity} uds
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-12 h-12 text-white/40 mx-auto mb-2" />
                <p className="text-white/60">No hay datos de productos</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Info de Auto-refresh */}
      {autoRefresh && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-4 flex items-center space-x-3">
          <Activity className="w-5 h-5 text-emerald-400 animate-pulse" />
          <p className="text-emerald-200 text-sm">
            Dashboard actualizándose automáticamente cada 30 segundos
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardRealTime;
