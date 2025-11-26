import React from 'react';
import { Users, Package, TrendingUp, DollarSign, Sprout, Map } from 'lucide-react';
import WeatherWidget from '../../components/weather/WeatherWidget';
import GrowthStatsWidget from '../../components/dashboard/GrowthStatsWidget';
import QuickReportsWidget from '../../components/dashboard/QuickReportsWidget';
import PriceAlertsWidget from '../../components/dashboard/PriceAlertsWidget';
import AlertsWidget from '../../components/dashboard/AlertsWidget';
import HarvestOptimizerWidget from '../../components/dashboard/HarvestOptimizerWidget';

const AdminDashboard = () => {
  const stats = [
    { label: 'Total Socios', value: '45', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Parcelas Activas', value: '128', icon: Map, color: 'from-green-500 to-green-600' },
    { label: 'Productos Cosechados', value: '2,450 kg', icon: Package, color: 'from-purple-500 to-purple-600' },
    { label: 'Campañas Activas', value: '3', icon: Sprout, color: 'from-orange-500 to-orange-600' },
    { label: 'Ingresos del Mes', value: 'Bs. 45,000', icon: DollarSign, color: 'from-emerald-500 to-emerald-600' },
    { label: 'Crecimiento', value: '+12%', icon: TrendingUp, color: 'from-pink-500 to-pink-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard Administrativo</h1>
        <p className="text-emerald-200/80">Vista general del sistema cooperativo</p>
      </div>

      {/* Stats Grid with Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
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

        {/* Weather Widget */}
        <div className="lg:col-span-1">
          <WeatherWidget lat={-17.78} lon={-63.18} />
        </div>
      </div>

      {/* IA Widgets Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Accesos Rápidos IA */}
        <PriceAlertsWidget />
        
        {/* Reportes Rápidos */}
        <QuickReportsWidget />
        
        {/* Estadísticas de Crecimiento */}
        <GrowthStatsWidget />
      </div>

      {/* Alertas y Optimización */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas Tempranas */}
        <AlertsWidget />
        
        {/* Optimizador de Cosecha */}
        <HarvestOptimizerWidget />
      </div>

      {/* Quick Actions */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button 
            onClick={() => window.location.href = '/socios'}
            className="bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            Nuevo Socio
          </button>
          <button 
            onClick={() => window.location.href = '/parcelas'}
            className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            Nueva Parcela
          </button>
          <button 
            onClick={() => window.location.href = '/productos-cosechados'}
            className="bg-purple-500/20 hover:bg-purple-500/30 text-purple-200 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            Registrar Cosecha
          </button>
          <button 
            onClick={() => window.location.href = '/campaigns'}
            className="bg-orange-500/20 hover:bg-orange-500/30 text-orange-200 px-4 py-3 rounded-lg transition-colors text-sm font-medium"
          >
            Nueva Campaña
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
