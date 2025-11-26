import { useState, useEffect } from 'react';
import { AlertTriangle, AlertCircle, Cloud, DollarSign, Sprout, X, RefreshCw } from 'lucide-react';
import api from '../../services/api';

const AlertsWidget = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, []);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/alerts/alerts/');
      setAlerts(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error al cargar alertas:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateAlerts = async () => {
    setGenerating(true);
    try {
      await api.post('/api/alerts/alerts/generate/');
      await fetchAlerts();
    } catch (error) {
      console.error('Error al generar alertas:', error);
    } finally {
      setGenerating(false);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      await api.post(`/api/alerts/alerts/${alertId}/dismiss/`);
      setAlerts(alerts.filter(a => a.id !== alertId));
    } catch (error) {
      console.error('Error al descartar alerta:', error);
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'WEATHER': return Cloud;
      case 'PRICE': return DollarSign;
      case 'HARVEST': return Sprout;
      default: return AlertCircle;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'from-red-500 to-red-600';
      case 'HIGH': return 'from-orange-500 to-orange-600';
      case 'MEDIUM': return 'from-yellow-500 to-yellow-600';
      default: return 'from-blue-500 to-blue-600';
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
          <AlertTriangle className="w-5 h-5 text-yellow-400" />
          <span>Alertas Tempranas</span>
        </h3>
        <button
          onClick={generateAlerts}
          disabled={generating}
          className="text-emerald-200/60 hover:text-emerald-200 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${generating ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <AlertCircle className="w-12 h-12 text-emerald-200/40 mx-auto mb-3" />
            <p className="text-emerald-200/60 text-sm">No hay alertas activas</p>
            <button
              onClick={generateAlerts}
              disabled={generating}
              className="mt-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              {generating ? 'Generando...' : 'Generar Alertas'}
            </button>
          </div>
        ) : (
          alerts.map((alert) => {
            const Icon = getAlertIcon(alert.alert_type);
            const colorClass = getSeverityColor(alert.severity);
            
            return (
              <div
                key={alert.id}
                className="bg-white/5 border border-white/10 rounded-lg p-3 hover:bg-white/10 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${colorClass} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">{alert.title}</p>
                        <p className="text-emerald-200/70 text-xs mt-1">{alert.message}</p>
                        <div className="flex items-center space-x-2 mt-2">
                          <span className="text-emerald-200/50 text-xs">{alert.alert_type_display}</span>
                          <span className="text-emerald-200/50 text-xs">•</span>
                          <span className="text-emerald-200/50 text-xs">{alert.severity_display}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-emerald-200/40 hover:text-emerald-200 transition-colors ml-2"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {alerts.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <p className="text-emerald-200/60 text-xs text-center">
            {alerts.length} alerta{alerts.length > 1 ? 's' : ''} activa{alerts.length > 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default AlertsWidget;
