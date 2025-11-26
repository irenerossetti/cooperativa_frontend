import React, { useState } from 'react';
import { Search, ShoppingCart, FlaskConical } from 'lucide-react';

const ProductosFertilizantes = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const productos = [
    { id: 1, name: 'Fertilizante Orgánico', price: 180, unit: 'kg', stock: 600, description: 'Fertilizante 100% orgánico' },
    { id: 2, name: 'Fertilizante NPK 15-15-15', price: 220, unit: 'kg', stock: 450, description: 'Nutrición balanceada' },
    { id: 3, name: 'Compost Premium', price: 150, unit: 'kg', stock: 300, description: 'Mejora la estructura del suelo' },
    { id: 4, name: 'Humus de Lombriz', price: 200, unit: 'kg', stock: 250, description: 'Rico en nutrientes' },
  ];

  const filteredProductos = productos.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <FlaskConical className="w-6 h-6 text-purple-400" />
          <h1 className="text-2xl font-bold text-white">Fertilizantes</h1>
        </div>
        <p className="text-emerald-200/80">Fertilizantes y mejoradores de suelo</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar fertilizantes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProductos.map((producto) => (
          <div key={producto.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-purple-500 to-purple-600">
                <FlaskConical className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-purple-500/20 text-purple-200">
                Stock: {producto.stock} {producto.unit}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{producto.name}</h3>
            <p className="text-emerald-200/70 text-sm mb-4">{producto.description}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-purple-300">Bs. {producto.price}</span>
              <span className="text-emerald-200/60 text-sm">por {producto.unit}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200">
              <ShoppingCart className="w-4 h-4" />
              <span>Agregar al Carrito</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosFertilizantes;
