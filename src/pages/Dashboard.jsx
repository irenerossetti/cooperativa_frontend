import React from 'react';
import { Users, Sprout, Map, Package, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const stats = [
    { label: 'Socios Activos', value: '0', icon: Users, color: 'from-blue-500 to-blue-600' },
    { label: 'Parcelas', value: '0', icon: Map, color: 'from-green-500 to-green-600' },
    { label: 'Campañas Activas', value: '0', icon: Calendar, color: 'from-purple-500 to-purple-600' },
    { label: 'Productos', value: '0', icon: Package, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-emerald-200/80">Bienvenido al Sistema de Gestión Cooperativa</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <TrendingUp className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-emerald-200/70 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Actividad Reciente</h2>
        <div className="text-center py-8">
          <p className="text-emerald-200/60">No hay actividad reciente</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
