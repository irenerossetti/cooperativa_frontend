import React from 'react';
import { ShoppingCart, Package, CreditCard, TrendingUp, Sprout, FlaskConical } from 'lucide-react';

const ClienteDashboard = () => {
  const stats = [
    { label: 'Pedidos Activos', value: '2', icon: ShoppingCart, color: 'from-blue-500 to-blue-600' },
    { label: 'Pedidos Completados', value: '15', icon: Package, color: 'from-green-500 to-green-600' },
    { label: 'Total Gastado', value: 'Bs. 8,500', icon: CreditCard, color: 'from-purple-500 to-purple-600' },
  ];

  const featuredProducts = [
    { name: 'Semillas de Maíz Premium', category: 'Semillas', price: 'Bs. 250/kg', stock: 'Disponible', icon: Sprout },
    { name: 'Fertilizante Orgánico', category: 'Fertilizantes', price: 'Bs. 180/kg', stock: 'Disponible', icon: FlaskConical },
    { name: 'Semillas de Quinua', category: 'Semillas', price: 'Bs. 320/kg', stock: 'Disponible', icon: Sprout },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h1 className="text-2xl font-bold text-white mb-2">Bienvenido</h1>
        <p className="text-emerald-200/80">Explora nuestros productos agrícolas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* Featured Products */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Productos Destacados</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {featuredProducts.map((product, index) => {
            const Icon = product.icon;
            return (
              <div
                key={index}
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/20">
                    <Icon className="w-5 h-5 text-emerald-300" />
                  </div>
                  <span className="text-emerald-200/60 text-xs">{product.category}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="text-emerald-300 font-bold">{product.price}</span>
                  <span className="text-green-300 text-xs">{product.stock}</span>
                </div>
                <button className="w-full mt-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-3 py-2 rounded-lg transition-colors text-sm">
                  Ver Detalles
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Pedidos Recientes</h2>
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Pedido #1234</p>
              <p className="text-emerald-200/60 text-sm">Semillas de Maíz - 10 kg</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-200">En proceso</span>
          </div>
          <div className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
            <div>
              <p className="text-white font-medium">Pedido #1233</p>
              <p className="text-emerald-200/60 text-sm">Fertilizante Orgánico - 5 kg</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-200">Completado</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClienteDashboard;
