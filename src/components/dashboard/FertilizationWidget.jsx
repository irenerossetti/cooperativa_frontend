import { useState, useEffect } from 'react';
import { Leaf, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const FertilizationWidget = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports/reports/fertilization_plan/');
      setRecommendations(response.data.recommendations || []);
    } catch (error) {
      console.error('Error al cargar plan de fertilización:', error);
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
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

  const rec = recommendations[0]; // Mostrar primera recomendación

  if (!rec) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2 mb-4">
          <Leaf className="w-5 h-5 text-green-400" />
          <span>Plan de Fertilización IA</span>
        </h3>
        <p className="text-emerald-200/60 text-center py-4">No hay recomendaciones disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <Leaf className="w-5 h-5 text-green-400" />
          <span>Plan de Fertilización IA</span>
        </h3>
        <button
          onClick={fetchRecommendations}
          className="text-emerald-200/60 hover:text-emerald-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 rounded-lg p-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-200/70 text-sm">Campaña</span>
            <span className="text-white font-semibold">{rec.campaign_name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-emerald-200/70 text-sm">Área Total</span>
            <span className="text-white font-semibold">{rec.total_area} ha</span>
          </div>
        </div>

        {rec.fertilizers.slice(0, 2).map((fert, idx) => (
          <div key={idx} className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-400/30 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-4 h-4 text-green-300" />
                <span className="text-green-200 text-sm font-medium">{fert.type}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                fert.priority === 'Alta' ? 'bg-red-500/20 text-red-300' : 'bg-yellow-500/20 text-yellow-300'
              }`}>
                {fert.priority}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-green-200/70">Cantidad:</span>
                <p className="text-white font-semibold">{fert.quantity} {fert.unit}</p>
              </div>
              <div>
                <span className="text-green-200/70">Dosis:</span>
                <p className="text-white font-semibold">{fert.application_rate}</p>
              </div>
            </div>
            <div className="mt-2 text-xs text-green-100/80">
              📅 {fert.timing}
            </div>
          </div>
        ))}

        <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-xs font-medium">Impacto Esperado</p>
              <p className="text-yellow-100/80 text-xs mt-1">
                Incremento de rendimiento: {rec.expected_yield_increase}
              </p>
              <p className="text-yellow-100/80 text-xs">
                Costo estimado: S/ {rec.estimated_cost}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FertilizationWidget;
