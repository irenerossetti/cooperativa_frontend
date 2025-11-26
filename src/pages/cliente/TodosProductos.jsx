import React, { useState } from 'react';
import { Search, ShoppingCart, Package, Sprout, FlaskConical } from 'lucide-react';

const TodosProductos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  const productos = [
    { id: 1, name: 'Semillas de Maíz Premium', category: 'Semillas', price: 250, unit: 'kg', stock: 500, icon: Sprout },
    { id: 2, name: 'Fertilizante Orgánico', category: 'Fertilizantes', price: 180, unit: 'kg', stock: 600, icon: FlaskConical },
    { id: 3, name: 'Semillas de Quinua', category: 'Semillas', price: 320, unit: 'kg', stock: 200, icon: Sprout },
    { id: 4, name: 'Fertilizante NPK', category: 'Fertilizantes', price: 220, unit: 'kg', stock: 450, icon: FlaskConical },
    { id: 5, name: 'Maíz Cosechado', category: 'Cosecha', price: 8, unit: 'kg', stock: 500, icon: Package },
    { id: 6, name: 'Quinua Premium', category: 'Cosecha', price: 15, unit: 'kg', stock: 200, icon: Package },
  ];

  const categories = ['Todos', 'Semillas', 'Fertilizantes', 'Cosecha'];

  const filteredProductos = productos.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Package className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Todos los Productos</h1>
        </div>
        <p className="text-emerald-200/80">Catálogo completo de productos disponibles</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? 'bg-emerald-500/30 text-emerald-200 border border-emerald-400/50'
                  : 'bg-white/5 text-emerald-200/70 hover:bg-white/10'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => {
          const Icon = producto.icon;
          const colorMap = {
            Semillas: 'from-green-500 to-green-600',
            Fertilizantes: 'from-purple-500 to-purple-600',
            Cosecha: 'from-orange-500 to-orange-600',
          };
          return (
            <div key={producto.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-r ${colorMap[producto.category]}`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <span className="px-3 py-1 rounded-full text-xs bg-emerald-500/20 text-emerald-200">
                  {producto.category}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{producto.name}</h3>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-emerald-300">Bs. {producto.price}</span>
                <span className="text-emerald-200/60 text-sm">por {producto.unit}</span>
              </div>
              <div className="mb-4">
                <span className="text-emerald-200/70 text-sm">Stock: {producto.stock} {producto.unit}</span>
              </div>
              <button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200">
                <ShoppingCart className="w-4 h-4" />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TodosProductos;
