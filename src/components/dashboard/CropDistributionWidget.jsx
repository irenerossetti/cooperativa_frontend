import React, { useState, useEffect } from 'react';
import { PieChart, TrendingUp, Loader } from 'lucide-react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const CropDistributionWidget = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadCropDistribution();
  }, []);

  const loadCropDistribution = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`${API_URL}/api/parcels/parcels/`);
      
      // Agrupar por cultivo y sumar hectáreas
      const cropMap = {};
      response.data.forEach(parcel => {
        const crop = parcel.crop_type || 'Sin especificar';
        const hectares = parseFloat(parcel.hectares) || 0;
        
        if (cropMap[crop]) {
          cropMap[crop] += hectares;
        } else {
          cropMap[crop] = hectares;
        }
      });

      // Convertir a array y ordenar
      const cropArray = Object.entries(cropMap)
        .map(([name, hectares]) => ({ name, hectares }))
        .sort((a, b) => b.hectares - a.hectares)
        .slice(0, 6); // Top 6 cultivos

      setData(cropArray);
    } catch (err) {
      console.error('Error loading crop distribution:', err);
      setError('No se pudo cargar la distribución de cultivos');
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
    '#ec4899', // pink
  ];

  const total = data.reduce((sum, item) => sum + item.hectares, 0);

  // Calcular ángulos para el gráfico de roseta
  let currentAngle = 0;
  const segments = data.map((item, index) => {
    const percentage = (item.hectares / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      ...item,
      percentage,
      startAngle,
      endAngle: currentAngle,
      color: colors[index % colors.length]
    };
  });

  // Función para crear el path del segmento
  const createArc = (startAngle, endAngle, innerRadius = 60, outerRadius = 100) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
    const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);
    
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';
    
    return [
      'M', start.x, start.y,
      'A', outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
      'L', innerEnd.x, innerEnd.y,
      'A', innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
      'Z'
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians)
    };
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <PieChart className="w-5 h-5 text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Distribución de Cultivos</h3>
          </div>
        </div>
        <div className="flex items-center justify-center h-64">
          <Loader className="w-8 h-8 text-green-300 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <PieChart className="w-5 h-5 text-green-300" />
            </div>
            <h3 className="text-lg font-semibold text-white">Distribución de Cultivos</h3>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
          <PieChart className="w-12 h-12 mb-2 opacity-50" />
          <p className="text-sm">{error || 'No hay datos de cultivos disponibles'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <PieChart className="w-5 h-5 text-green-300" />
          </div>
          <h3 className="text-lg font-semibold text-white">Distribución de Cultivos</h3>
        </div>
        <div className="flex items-center space-x-1 text-green-300 text-sm">
          <TrendingUp className="w-4 h-4" />
          <span>{total.toFixed(1)} ha</span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Donut Chart */}
        <div className="relative w-48 h-48 flex-shrink-0">
          <svg viewBox="0 0 200 200" className="w-full h-full transform -rotate-90">
            {segments.map((segment, index) => (
              <g key={index}>
                <path
                  d={createArc(segment.startAngle, segment.endAngle)}
                  fill={segment.color}
                  className="transition-all duration-300 hover:opacity-80"
                  style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }}
                />
              </g>
            ))}
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-white">{data.length}</p>
            <p className="text-xs text-gray-300">Cultivos</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {segments.map((segment, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div 
                  className="w-3 h-3 rounded-full flex-shrink-0" 
                  style={{ backgroundColor: segment.color }}
                />
                <span className="text-sm text-white truncate">{segment.name}</span>
              </div>
              <div className="flex items-center space-x-3 flex-shrink-0">
                <span className="text-sm font-medium text-white">{segment.hectares.toFixed(1)} ha</span>
                <span className="text-xs text-gray-400 w-12 text-right">{segment.percentage.toFixed(1)}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-gray-400 text-center">
          Distribución por hectáreas de los principales cultivos
        </p>
      </div>
    </div>
  );
};

export default CropDistributionWidget;
