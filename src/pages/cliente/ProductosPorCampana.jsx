import React, { useState } from 'react';
import { Calendar, Package } from 'lucide-react';

const ProductosPorCampana = () => {
  const campanas = [
    {
      id: 1,
      name: 'Campaña Verano 2024',
      status: 'Activa',
      productos: [
        { name: 'Maíz Cosechado', quantity: '500 kg', price: 8 },
        { name: 'Quinua Premium', quantity: '200 kg', price: 15 },
      ]
    },
    {
      id: 2,
      name: 'Campaña Invierno 2024',
      status: 'Activa',
      productos: [
        { name: 'Trigo Orgánico', quantity: '350 kg', price: 6 },
        { name: 'Cebada', quantity: '280 kg', price: 5 },
      ]
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Calendar className="w-6 h-6 text-orange-400" />
          <h1 className="text-2xl font-bold text-white">Productos por Campaña</h1>
        </div>
        <p className="text-emerald-200/80">Productos disponibles de cada campaña agrícola</p>
      </div>

      <div className="space-y-6">
        {campanas.map((campana) => (
          <div key={campana.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">{campana.name}</h2>
                  <span className="text-emerald-200/60 text-sm">{campana.status}</span>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-200">
                {campana.productos.length} productos
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {campana.productos.map((producto, index) => (
                <div key={index} className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-all duration-200">
                  <div className="flex items-center space-x-3 mb-3">
                    <Package className="w-5 h-5 text-emerald-300" />
                    <h3 className="text-white font-semibold">{producto.name}</h3>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200/70 text-sm">{producto.quantity} disponibles</span>
                    <span className="text-emerald-300 font-bold">Bs. {producto.price}/kg</span>
                  </div>
                  <button className="w-full mt-3 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-3 py-2 rounded-lg transition-colors text-sm">
                    Ver Detalles
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPorCampana;
