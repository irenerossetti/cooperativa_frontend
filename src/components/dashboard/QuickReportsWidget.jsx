import { useState, useEffect } from 'react';
import { Users, Map, BarChart3, TrendingUp, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const QuickReportsWidget = () => {
  const [communityData, setCommunityData] = useState([]);
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [commResponse, cropResponse] = await Promise.all([
        api.get('/api/reports/reports/partners_by_community/'),
        api.get('/api/reports/reports/hectares_by_crop/')
      ]);
      
      setCommunityData(commResponse.data.data || []);
      
      const crops = cropResponse.data || [];
      const totalHectares = crops.reduce((sum, item) => sum + (parseFloat(item.total_hectares) || 0), 0);
      const enrichedCrops = crops.map(item => ({
        ...item,
        percentage: totalHectares > 0 ? ((parseFloat(item.total_hectares) / totalHectares) * 100) : 0
      }));
      setCropData(enrichedCrops);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setCommunityData([]);
      setCropData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex justify-center py-8">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  const totalHectares = cropData.reduce((sum, item) => sum + (parseFloat(item.total_hectares) || 0), 0);

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-blue-400" />
          <span>Reportes Rápidos</span>
        </h3>
        <button
          onClick={fetchData}
          className="text-emerald-200/60 hover:text-emerald-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Socios por Comunidad */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-3">
          <Users className="w-4 h-4 text-blue-300" />
          <h4 className="text-sm font-medium text-blue-200">Socios por Comunidad</h4>
        </div>
        <div className="space-y-2">
          {communityData.slice(0, 3).map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-white">{item.community_name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-blue-300">{item.total_partners} socios</span>
                  <span className="text-green-300">{item.active_partners} activos</span>
                </div>
              </div>
            </div>
          ))}
          {communityData.length === 0 && (
            <p className="text-emerald-200/60 text-xs text-center py-2">No hay datos</p>
          )}
        </div>
      </div>

      {/* Hectáreas por Cultivo */}
      <div>
        <div className="flex items-center space-x-2 mb-3">
          <Map className="w-4 h-4 text-green-300" />
          <h4 className="text-sm font-medium text-green-200">Hectáreas por Cultivo</h4>
        </div>
        <div className="space-y-2">
          {cropData.slice(0, 3).map((item, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-2">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-white">{item.current_crop__name || 'Sin cultivo'}</span>
                <span className="text-green-300 font-semibold">{parseFloat(item.total_hectares || 0).toFixed(1)} ha</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <div 
                  className="bg-gradient-to-r from-green-400 to-emerald-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
          {cropData.length === 0 && (
            <p className="text-emerald-200/60 text-xs text-center py-2">No hay datos</p>
          )}
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <div className="flex items-center justify-between text-sm mb-3">
          <span className="text-emerald-200/70">Total Superficie</span>
          <div className="flex items-center space-x-2">
            <span className="text-white font-bold">{totalHectares.toFixed(1)} hectáreas</span>
            <TrendingUp className="w-4 h-4 text-green-400" />
          </div>
        </div>
        <button
          onClick={() => window.location.href = '/reportes'}
          className="w-full bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
        >
          Ver Todos los Reportes
        </button>
      </div>
    </div>
  );
};

export default QuickReportsWidget;
