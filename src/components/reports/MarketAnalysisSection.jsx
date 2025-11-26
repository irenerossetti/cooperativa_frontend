import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, RefreshCw, Package } from 'lucide-react';
import api from '../../services/api';

const MarketAnalysisSection = () => {
  const [loading, setLoading] = useState(false);
  const [marketData, setMarketData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMarketData();
  }, []);

  const fetchMarketData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/api/market/analysis/summary/');
      if (response.data.success) {
        setMarketData(response.data.data);
      }
    } catch (err) {
      console.error('Error al cargar análisis de mercado:', err);
      setError('No se pudo cargar el análisis de mercado');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !marketData) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-center space-x-3">
          <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
          <span className="text-white">Cargando análisis de mercado...</span>
        </div>
      </div>
    );
  }

  if (error || !marketData) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Alertas Comerciales</h2>
            <p className="text-emerald-200/80">Análisis de precios y oportunidades de mercado</p>
          </div>
        </div>

        <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-6 text-center">
          <Package className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">Sin datos de producción</h3>
          <p className="text-emerald-200/80 text-sm mb-4">
            El análisis de mercado requiere datos de producción histórica. Registra cosechas para comenzar a ver tendencias y oportunidades.
          </p>
        </div>
      </div>
    );
  }

  const { trends, alerts, opportunities } = marketData;

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Alertas Comerciales</h2>
            <p className="text-emerald-200/80">Análisis de precios y oportunidades de mercado</p>
          </div>
        </div>
        <button
          onClick={fetchMarketData}
          disabled={loading}
          className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Actualizar</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tendencias de Precio */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <span>Tendencias de Precio</span>
          </h3>
          <div className="space-y-2">
            {trends && trends.length > 0 ? (
              trends.slice(0, 3).map((trend, index) => (
                <div
                  key={index}
                  className={`${
                    trend.variation > 0
                      ? 'bg-green-500/10 border-green-400/30'
                      : 'bg-red-500/10 border-red-400/30'
                  } border rounded p-3`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium">{trend.product}</span>
                    <div className="flex items-center space-x-1">
                      {trend.variation > 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-300" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-300" />
                      )}
                      <span
                        className={`text-sm font-bold ${
                          trend.variation > 0 ? 'text-green-300' : 'text-red-300'
                        }`}
                      >
                        {trend.variation > 0 ? '+' : ''}
                        {trend.variation}%
                      </span>
                    </div>
                  </div>
                  <p className="text-emerald-200/80 text-xs">
                    Precio actual: Bs. {trend.current_price}/kg
                  </p>
                  <p className="text-blue-200 text-xs mt-1">
                    💡 {trend.variation > 0 ? 'Momento favorable para venta' : 'Considerar retener stock'}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-emerald-200/60 text-sm">No hay tendencias disponibles</p>
            )}
          </div>
        </div>

        {/* Oportunidades Detectadas */}
        <div className="bg-white/5 rounded-lg p-4">
          <h3 className="text-white font-semibold mb-3 flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            <span>Oportunidades Detectadas</span>
          </h3>
          <div className="space-y-2">
            {opportunities && opportunities.length > 0 ? (
              opportunities.slice(0, 3).map((opp, index) => (
                <div
                  key={index}
                  className={`${
                    opp.urgency === 'high'
                      ? 'bg-yellow-500/10 border-yellow-400/30'
                      : 'bg-blue-500/10 border-blue-400/30'
                  } border rounded p-3`}
                >
                  <p className={`font-medium text-sm ${
                    opp.urgency === 'high' ? 'text-yellow-200' : 'text-blue-200'
                  }`}>
                    {opp.product} - {opp.type}
                  </p>
                  <p className="text-emerald-200/80 text-xs mt-1">{opp.description}</p>
                  {opp.potential_gain > 0 && (
                    <p className="text-green-200 text-xs mt-1">
                      Ganancia potencial: Bs. {opp.potential_gain.toFixed(2)}
                    </p>
                  )}
                  <p className="text-white text-xs mt-1">📌 {opp.action}</p>
                </div>
              ))
            ) : (
              <p className="text-emerald-200/60 text-sm">No hay oportunidades detectadas</p>
            )}
          </div>
        </div>
      </div>

      {/* Alertas Activas */}
      {alerts && alerts.length > 0 && (
        <div className="mt-4 p-4 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-400/20 rounded-lg">
          <p className="text-yellow-200 text-sm font-medium mb-2">
            ⚠️ {alerts.length} Alerta{alerts.length > 1 ? 's' : ''} Activa{alerts.length > 1 ? 's' : ''}
          </p>
          <div className="space-y-1">
            {alerts.map((alert, index) => (
              <p key={index} className="text-yellow-100 text-xs">
                • {alert.product}: {alert.message} ({alert.recommendation})
              </p>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 p-4 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-400/20 rounded-lg">
        <p className="text-purple-200 text-sm">
          📊 <strong>Análisis basado en datos reales:</strong> Los precios y tendencias se calculan a partir de tu producción histórica y precios de mercado actuales.
        </p>
      </div>
    </div>
  );
};

export default MarketAnalysisSection;
