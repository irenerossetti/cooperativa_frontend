import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Loader, Package } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const ProductionStatsWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadProductionStats();
  }, []);

  const loadProductionStats = async () => {
    try {
      setLoading(true);
      
      // Intentar cargar datos reales de producción
      const response = await axios.get(`${API_URL}/api/production/harvested-products/`);
      
      if (response.data && response.data.length > 0) {
        // Agrupar por producto y sumar cantidades
        const productMap = {};
        response.data.forEach(item => {
          const product = item.product_name || item.product || 'Sin especificar';
          const quantity = parseFloat(item.quantity_kg || item.quantity || 0);
          
          if (productMap[product]) {
            productMap[product] += quantity;
          } else {
            productMap[product] = quantity;
          }
        });

        // Convertir a array y ordenar
        const productArray = Object.entries(productMap)
          .map(([name, quantity]) => ({ name, quantity }))
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5); // Top 5 productos

        const totalProduction = productArray.reduce((sum, item) => sum + item.quantity, 0);
        
        setData(productArray);
        setTotal(totalProduction);
      } else {
        // Datos de ejemplo si no hay datos reales
        const exampleData = [
          { name: 'Quinua', quantity: 1250 },
          { name: 'Maíz', quantity: 980 },
          { name: 'Papa', quantity: 750 },
          { name: 'Trigo', quantity: 520 },
          { name: 'Cebada', quantity: 380 },
        ];
        setData(exampleData);
        setTotal(exampleData.reduce((sum, item) => sum + item.quantity, 0));
      }
    } catch (err) {
      console.error('Error loading production stats:', err);
      // Mostrar datos de ejemplo en caso de error
      const exampleData = [
        { name: 'Quinua', quantity: 1250 },
        { name: 'Maíz', quantity: 980 },
        { name: 'Papa', quantity: 750 },
        { name: 'Trigo', quantity: 520 },
        { name: 'Cebada', quantity: 380 },
      ];
      setData(exampleData);
      setTotal(exampleData.reduce((sum, item) => sum + item.quantity, 0));
    } finally {
      setLoading(false);
    }
  };

  const colors = [
    '#10b981', // green
    '#3b82f6', // blue
    '#f59e0b', // amber
    '#ef4444', // red
    '#8b5cf6', // purple
  ];

  const maxValue = data.length > 0 ? Math.max(...data.map(item => item.quantity)) : 1;

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <BarChart3 className="w-5 h-5 text-blue-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Producción por Cultivo</h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-blue-300 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <BarChart3 className="w-5 h-5 text-blue-300" />
          </div>
          <h3 className="text-lg font-semibold text-white">Producción por Cultivo</h3>
        </div>
        <div className="flex items-center space-x-1 text-blue-300 text-sm">
          <Package className="w-4 h-4" />
          <span>{total.toLocaleString()} kg</span>
        </div>
      </div>

      <div className="space-y-4">
        {data.map((item, index) => {
          const percentage = (item.quantity / maxValue) * 100;
          const color = colors[index % colors.length];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white font-medium">{item.name}</span>
                <span className="text-gray-300">{item.quantity.toLocaleString()} kg</span>
              </div>
              
              {/* Barra de progreso */}
              <div className="relative h-8 bg-white/5 rounded-lg overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-lg transition-all duration-500 ease-out"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: color,
                    boxShadow: `0 0 20px ${color}40`
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20" />
                </div>
                
                {/* Porcentaje dentro de la barra */}
                <div className="absolute inset-0 flex items-center px-3">
                  <span className="text-xs font-semibold text-white drop-shadow-lg">
                    {((item.quantity / total) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador de crecimiento */}
      <div className="mt-6 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">Total producido este período</p>
          <div className="flex items-center space-x-1 text-green-400 text-sm">
            <TrendingUp className="w-4 h-4" />
            <span>+12.5%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductionStatsWidget;
