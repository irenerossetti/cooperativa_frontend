import { useState, useEffect } from 'react';
import { Sprout, TrendingUp, Calendar, AlertCircle, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../../services/api';

const HarvestOptimizerWidget = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOptimalHarvest();
  }, []);

  const fetchOptimalHarvest = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/alerts/alerts/optimal_harvest/');
      if (response.data.success) {
        setResults(response.data.results || []);
      }
    } catch (error) {
      console.error('Error al calcular momento óptimo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationColor = (recommendation) => {
    switch (recommendation) {
      case 'COSECHAR_AHORA': return 'from-green-500 to-emerald-600';
      case 'COSECHAR_PRONTO': return 'from-blue-500 to-cyan-600';
      case 'MONITOREAR': return 'from-yellow-500 to-orange-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getRecommendationText = (recommendation) => {
    switch (recommendation) {
      case 'COSECHAR_AHORA': return 'Cosechar Ahora';
      case 'COSECHAR_PRONTO': return 'Cosechar Pronto';
      case 'MONITOREAR': return 'Monitorear';
      default: return 'Esperar';
    }
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex justify-center py-8">
          <RefreshCw className="w-6 h-6 text-white animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Sprout className="w-5 h-5 text-green-400" />
          <span>Momento Óptimo Cosecha</span>
        </h3>
        <button
          onClick={fetchOptimalHarvest}
          className="text-emerald-200/60 hover:text-emerald-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-emerald-200/40 mx-auto mb-3" />
            <p className="text-emerald-200/60 text-sm">No hay parcelas con cultivos activos</p>
          </div>
        ) : (
          results.slice(0, 5).map((result, index) => {
            const colorClass = getRecommendationColor(result.recommendation);
            const score = result.scores?.overall || 0;
            
            return (
              <div
                key={index}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-medium text-sm">{result.parcel_code}</span>
                    <span className="text-emerald-200/60 text-xs">• {result.crop_name}</span>
                  </div>
                  <div className={`px-2 py-1 bg-gradient-to-r ${colorClass} rounded text-white text-xs font-medium`}>
                    {getRecommendationText(result.recommendation)}
                  </div>
                </div>

                <p className="text-emerald-200/70 text-xs mb-2">{result.message}</p>

                {/* Score Bar */}
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-emerald-200/60">Score General</span>
                    <span className="text-white font-medium">{score.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`bg-gradient-to-r ${colorClass} h-2 rounded-full transition-all`}
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>

                {/* Scores Detallados */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200/50">Maduración:</span>
                    <span className="text-emerald-200">{result.scores?.maturation?.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200/50">Clima:</span>
                    <span className="text-emerald-200">{result.scores?.weather?.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200/50">Mercado:</span>
                    <span className="text-emerald-200">{result.scores?.market?.toFixed(0)}%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-emerald-200/50">Logística:</span>
                    <span className="text-emerald-200">{result.scores?.logistics?.toFixed(0)}%</span>
                  </div>
                </div>

                {result.optimal_date && (
                  <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                    <span className="text-emerald-200/60 flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>Fecha óptima:</span>
                    </span>
                    <span className="text-white">{new Date(result.optimal_date).toLocaleDateString('es-ES')}</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {results.length > 5 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <button className="w-full text-blue-200 hover:text-blue-100 text-sm flex items-center justify-center space-x-1 transition-colors">
            <span>Ver todas las parcelas</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default HarvestOptimizerWidget;
