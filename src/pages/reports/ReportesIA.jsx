import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Sparkles, Download, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import VoiceReportAssistant from '../../components/reports/VoiceReportAssistant';
import SimpleBarChart from '../../components/reports/SimpleBarChart';

const ReportesIA = () => {
  const [modelStatus, setModelStatus] = useState('unknown');
  const [training, setTraining] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState('');
  const [parcels, setParcels] = useState([]);

  useEffect(() => {
    fetchParcels();
    checkModelStatus();
  }, []);

  const fetchParcels = async () => {
    try {
      const response = await api.get('/api/parcels/parcels/');
      setParcels(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error al cargar parcelas:', error);
    }
  };

  const checkModelStatus = async () => {
    try {
      const response = await api.get('/api/reports/reports/ml_insights/');
      setModelStatus('trained');
      setInsights(response.data);
    } catch (error) {
      setModelStatus('not_trained');
    }
  };

  const trainModel = async () => {
    setTraining(true);
    try {
      const response = await api.post('/api/reports/reports/train_ml_model/');
      if (response.data.success) {
        setModelStatus('trained');
        alert(`Modelo entrenado exitosamente!\n\nPrecisión: ${(response.data.test_score * 100).toFixed(2)}%\nMuestras: ${response.data.samples}`);
        checkModelStatus();
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error('Error al entrenar:', error);
      alert('Error al entrenar el modelo');
    } finally {
      setTraining(false);
    }
  };

  const predictYield = async (parcelId) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/reports/reports/predict_yield/?parcel_id=${parcelId}`);
      setPredictions([response.data]);
    } catch (error) {
      console.error('Error al predecir:', error);
      alert('Error al generar predicción. Asegúrate de que el modelo esté entrenado.');
    } finally {
      setLoading(false);
    }
  };

  const predictAllParcels = async () => {
    setLoading(true);
    try {
      const allPredictions = [];
      for (const parcel of parcels.slice(0, 10)) { // Limitar a 10 para no saturar
        try {
          const response = await api.get(`/api/reports/reports/predict_yield/?parcel_id=${parcel.id}`);
          allPredictions.push(response.data);
        } catch (error) {
          console.error(`Error en parcela ${parcel.id}:`, error);
        }
      }
      setPredictions(allPredictions);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceCommand = async (command) => {
    console.log('Comando de voz recibido:', command);
    
    if (command.type === 'ml_prediction') {
      if (selectedParcel) {
        await predictYield(selectedParcel);
      } else {
        await predictAllParcels();
      }
    } else if (command.type === 'production_by_parcel') {
      window.location.href = '/reportes/produccion-parcela';
    } else if (command.type === 'labors_by_campaign') {
      window.location.href = '/reportes/labores-campana';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Reportes con Inteligencia Artificial</h1>
            <p className="text-purple-200/80">Predicciones y análisis con Machine Learning</p>
          </div>
        </div>
        
        {/* Estado del modelo */}
        <div className="mt-4 flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${
            modelStatus === 'trained' ? 'bg-green-400 animate-pulse' : 
            modelStatus === 'not_trained' ? 'bg-yellow-400' : 
            'bg-gray-400'
          }`}></div>
          <span className="text-white text-sm">
            {modelStatus === 'trained' ? 'Modelo entrenado y listo' : 
             modelStatus === 'not_trained' ? 'Modelo no entrenado' : 
             'Verificando estado...'}
          </span>
        </div>
      </div>

      {/* Asistente de Voz */}
      <VoiceReportAssistant onReportRequest={handleVoiceCommand} />

      {/* Controles del Modelo */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-yellow-400" />
          <span>Control del Modelo de IA</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Entrenar modelo */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Entrenar Modelo</h4>
            <p className="text-emerald-200/60 text-sm mb-3">
              Entrena el modelo Random Forest con datos históricos de producción
            </p>
            <button
              onClick={trainModel}
              disabled={training}
              className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
            >
              {training ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Entrenando...</span>
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" />
                  <span>Entrenar Modelo</span>
                </>
              )}
            </button>
          </div>

          {/* Predecir */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Generar Predicciones</h4>
            <div className="space-y-2">
              <select
                value={selectedParcel}
                onChange={(e) => setSelectedParcel(e.target.value)}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Todas las parcelas</option>
                {parcels.map(parcel => (
                  <option key={parcel.id} value={parcel.id}>
                    {parcel.code} - {parcel.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => selectedParcel ? predictYield(selectedParcel) : predictAllParcels()}
                disabled={loading || modelStatus !== 'trained'}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Prediciendo...</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4" />
                    <span>Predecir Rendimiento</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Advertencia si no está entrenado */}
        {modelStatus === 'not_trained' && (
          <div className="mt-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-sm font-medium">Modelo no entrenado</p>
              <p className="text-yellow-200/80 text-xs mt-1">
                Debes entrenar el modelo antes de generar predicciones. Haz clic en "Entrenar Modelo" para comenzar.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Insights del Modelo */}
      {insights && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Importancia de Factores</h3>
          <SimpleBarChart
            data={[
              { label: 'Superficie', value: insights.feature_importance.surface * 100 },
              { label: 'Tipo de Suelo', value: insights.feature_importance.soil_type * 100 },
              { label: 'Tipo de Cultivo', value: insights.feature_importance.crop_type * 100 },
              { label: 'Historial de Cosechas', value: insights.feature_importance.harvest_count * 100 }
            ]}
            valueKey="value"
            labelKey="label"
            colorClass="from-purple-500 to-indigo-600"
          />
        </div>
      )}

      {/* Predicciones */}
      {predictions.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-white/20">
            <h3 className="text-lg font-semibold text-white">Predicciones Generadas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Parcela</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Rendimiento Predicho</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Producción Predicha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Promedio Histórico</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Recomendación</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {predictions.map((pred, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-medium">{pred.parcel_code}</td>
                    <td className="px-6 py-4 text-yellow-200 font-semibold">{pred.predicted_yield} kg/ha</td>
                    <td className="px-6 py-4 text-green-200">{pred.predicted_production} kg</td>
                    <td className="px-6 py-4 text-blue-200">{pred.historical_avg} kg</td>
                    <td className="px-6 py-4">
                      <span className={`text-xs px-2 py-1 rounded ${
                        pred.recommendation.includes('Excelente') ? 'bg-green-500/20 text-green-200' :
                        pred.recommendation.includes('Bueno') ? 'bg-blue-500/20 text-blue-200' :
                        pred.recommendation.includes('Atención') ? 'bg-yellow-500/20 text-yellow-200' :
                        'bg-red-500/20 text-red-200'
                      }`}>
                        {pred.recommendation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportesIA;
