import React from 'react';
import { Map, Package, TrendingUp, Calendar, DollarSign, Tractor, RefreshCw } from 'lucide-react';
import { usePartnerDashboardStats } from '../../hooks/usePartnerDashboardStats';

const SocioDashboard = () => {
  const dashboardStats = usePartnerDashboardStats();

  const stats = [
    { 
      label: 'Mis Parcelas', 
      value: dashboardStats.loading ? '...' : dashboardStats.myParcels.toString(), 
      icon: Map, 
      color: 'from-green-500 to-green-600' 
    },
    { 
      label: 'Producción Total', 
      value: dashboardStats.loading ? '...' : `${dashboardStats.totalProduction.toLocaleString()} kg`, 
      icon: Package, 
      color: 'from-purple-500 to-purple-600' 
    },
    { 
      label: 'Labores Realizadas', 
      value: dashboardStats.loading ? '...' : dashboardStats.completedActivities.toString(), 
      icon: Tractor, 
      color: 'from-blue-500 to-blue-600' 
    },
    { 
      label: 'Campañas Activas', 
      value: dashboardStats.loading ? '...' : dashboardStats.activeCampaigns.toString(), 
      icon: Calendar, 
      color: 'from-orange-500 to-orange-600' 
    },
    { 
      label: 'Ingresos del Mes', 
      value: dashboardStats.loading ? '...' : `Bs. ${dashboardStats.monthlyRevenue.toLocaleString()}`, 
      icon: DollarSign, 
      color: 'from-emerald-500 to-emerald-600' 
    },
    { 
      label: 'Rendimiento', 
      value: dashboardStats.loading ? '...' : `+${dashboardStats.performance}%`, 
      icon: TrendingUp, 
      color: 'from-pink-500 to-pink-600' 
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Mi Dashboard</h1>
            <p className="text-emerald-200/80">Resumen de tus actividades y producción</p>
          </div>
          <button
            onClick={dashboardStats.refresh}
            disabled={dashboardStats.loading}
            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 rounded-lg transition-colors disabled:opacity-50"
            title="Actualizar estadísticas"
          >
            <RefreshCw className={`w-5 h-5 text-emerald-200 ${dashboardStats.loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">{stat.value}</h3>
              <p className="text-emerald-200/70 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Cosecha registrada - Parcela A1</p>
              <p className="text-emerald-200/60 text-sm">Hace 2 días</p>
            </div>
            <span className="text-emerald-300 text-sm">150 kg</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Labor de riego completada</p>
              <p className="text-emerald-200/60 text-sm">Hace 5 días</p>
            </div>
            <span className="text-blue-300 text-sm">Parcela B2</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Pago recibido</p>
              <p className="text-emerald-200/60 text-sm">Hace 1 semana</p>
            </div>
            <span className="text-green-300 text-sm">Bs. 1,500</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocioDashboard;
