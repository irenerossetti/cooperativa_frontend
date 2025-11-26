import React, { useState, useEffect } from 'react';
import { Brain, TrendingUp, Sparkles, Download, RefreshCw, AlertCircle, Users, MapPin, Package } from 'lucide-react';
import api from '../../services/api';
import VoiceReportAssistant from '../../components/reports/VoiceReportAssistant';
import SimpleBarChart from '../../components/reports/SimpleBarChart';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const ReportesIA = () => {
  const [modelStatus, setModelStatus] = useState('unknown');
  const [training, setTraining] = useState(false);
  const [predictions, setPredictions] = useState([]);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedParcel, setSelectedParcel] = useState('');
  const [parcels, setParcels] = useState([]);
  const [partners, setPartners] = useState([]);
  const [showStats, setShowStats] = useState(false);
  const [statsData, setStatsData] = useState(null);

  useEffect(() => {
    fetchParcels();
    fetchPartners();
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

  const fetchPartners = async () => {
    try {
      const response = await api.get('/api/partners/partners/');
      setPartners(response.data.results || response.data || []);
    } catch (error) {
      console.error('Error al cargar socios:', error);
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

  const generatePDF = () => {
    if (predictions.length === 0) {
      alert('No hay predicciones para exportar. Genera predicciones primero.');
      return;
    }

    const doc = new jsPDF();
    
    // Título
    doc.setFontSize(20);
    doc.setTextColor(88, 28, 135); // Purple
    doc.text('Reporte de Predicciones IA', 14, 20);
    
    // Fecha
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generado: ${new Date().toLocaleString('es-ES')}`, 14, 28);
    
    // Estadísticas generales
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('Resumen General', 14, 38);
    
    const totalProduction = predictions.reduce((sum, p) => sum + parseFloat(p.predicted_production || 0), 0);
    const avgYield = predictions.reduce((sum, p) => sum + parseFloat(p.predicted_yield || 0), 0) / predictions.length;
    
    doc.setFontSize(10);
    doc.text(`Total de parcelas analizadas: ${predictions.length}`, 14, 46);
    doc.text(`Producción total predicha: ${totalProduction.toFixed(2)} kg`, 14, 52);
    doc.text(`Rendimiento promedio: ${avgYield.toFixed(2)} kg/ha`, 14, 58);
    
    // Tabla de predicciones
    doc.autoTable({
      startY: 65,
      head: [['Parcela', 'Rendimiento\n(kg/ha)', 'Producción\n(kg)', 'Histórico\n(kg)', 'Recomendación']],
      body: predictions.map(p => [
        p.parcel_code,
        p.predicted_yield,
        p.predicted_production,
        p.historical_avg,
        p.recommendation
      ]),
      theme: 'grid',
      headStyles: { fillColor: [88, 28, 135], textColor: 255 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 25, halign: 'right' },
        2: { cellWidth: 25, halign: 'right' },
        3: { cellWidth: 25, halign: 'right' },
        4: { cellWidth: 'auto' }
      }
    });
    
    // Footer
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Guardar
    doc.save(`reporte_predicciones_ia_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const handleVoiceCommand = async (command) => {
    console.log('Comando de voz recibido:', command);
    
    // Comandos de estadísticas - Mostrar panel visual
    if (command.type === 'show_stats') {
      const totalProduction = predictions.reduce((sum, p) => sum + parseFloat(p.predicted_production || 0), 0);
      const avgYield = predictions.length > 0 
        ? predictions.reduce((sum, p) => sum + parseFloat(p.predicted_yield || 0), 0) / predictions.length 
        : 0;
      
      setStatsData({
        partners: partners.length,
        parcels: parcels.length,
        predictions: predictions.length,
        totalProduction: totalProduction.toFixed(2),
        avgYield: avgYield.toFixed(2),
        modelStatus: modelStatus === 'trained' ? 'Entrenado' : 'No entrenado'
      });
      setShowStats(true);
      
      // Auto-ocultar después de 10 segundos
      setTimeout(() => setShowStats(false), 10000);
    }
    
    // Comandos de ordenamiento
    else if (command.type === 'sort') {
      const sorted = [...predictions].sort((a, b) => {
        let aVal, bVal;
        if (command.sortBy === 'yield') {
          aVal = parseFloat(a.predicted_yield);
          bVal = parseFloat(b.predicted_yield);
        } else if (command.sortBy === 'production') {
          aVal = parseFloat(a.predicted_production);
          bVal = parseFloat(b.predicted_production);
        } else if (command.sortBy === 'name') {
          aVal = a.parcel_code;
          bVal = b.parcel_code;
        }
        return command.sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });
      setPredictions(sorted);
    }
    
    // Comandos de top
    else if (command.type === 'top') {
      const sorted = [...predictions].sort((a, b) => {
        if (command.category === 'yield') {
          return parseFloat(b.predicted_yield) - parseFloat(a.predicted_yield);
        } else if (command.category === 'production') {
          return parseFloat(b.predicted_production) - parseFloat(a.predicted_production);
        }
        return 0;
      });
      setPredictions(sorted.slice(0, command.limit));
    }
    
    // Comando de actualizar
    else if (command.type === 'refresh') {
      await checkModelStatus();
      await fetchParcels();
      if (predictions.length > 0) {
        await predictAllParcels();
      }
    }
    
    // Comando de exportar
    else if (command.type === 'export') {
      if (predictions.length === 0) {
        alert('No hay predicciones para exportar. Genera predicciones primero.');
        return;
      }
      
      // Generar según formato
      if (command.format === 'pdf') {
        generatePDF();
      } else {
        // Crear CSV
        const headers = ['Parcela', 'Rendimiento Predicho', 'Producción Predicha', 'Promedio Histórico', 'Recomendación'];
        const rows = predictions.map(p => [
          p.parcel_code,
          p.predicted_yield,
          p.predicted_production,
          p.historical_avg,
          p.recommendation
        ]);
        
        const csvContent = [
          headers.join(','),
          ...rows.map(row => row.join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `predicciones_ia_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
      }
    }
    
    // Comando de limpiar filtros
    else if (command.type === 'clear_filters') {
      setPredictions([]);
      setSelectedParcel('');
    }
    
    // Comandos de ML
    else if (command.type === 'ml_prediction') {
      if (selectedParcel) {
        await predictYield(selectedParcel);
      } else {
        await predictAllParcels();
      }
    }
    
    // Navegación
    else if (command.type === 'production_by_parcel') {
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

      {/* Panel de Estadísticas (activado por voz) */}
      {showStats && statsData && (
        <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-6 animate-pulse">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            <span>Estadísticas del Sistema</span>
          </h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {/* Total Socios */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Total Socios</p>
                  <p className="text-white text-2xl font-bold">{statsData.partners}</p>
                </div>
              </div>
            </div>

            {/* Total Parcelas */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Total Parcelas</p>
                  <p className="text-white text-2xl font-bold">{statsData.parcels}</p>
                </div>
              </div>
            </div>

            {/* Predicciones */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Predicciones</p>
                  <p className="text-white text-2xl font-bold">{statsData.predictions}</p>
                </div>
              </div>
            </div>

            {/* Producción Total */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <Package className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Producción Total</p>
                  <p className="text-white text-xl font-bold">{statsData.totalProduction} kg</p>
                </div>
              </div>
            </div>

            {/* Rendimiento Promedio */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-600 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Rendimiento Promedio</p>
                  <p className="text-white text-xl font-bold">{statsData.avgYield} kg/ha</p>
                </div>
              </div>
            </div>

            {/* Estado del Modelo */}
            <div className="bg-white/10 border border-white/20 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                  statsData.modelStatus === 'Entrenado' 
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600' 
                    : 'bg-gradient-to-r from-gray-500 to-gray-600'
                }`}>
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-emerald-200/60 text-xs">Estado del Modelo</p>
                  <p className="text-white text-lg font-bold">{statsData.modelStatus}</p>
                </div>
              </div>
            </div>
          </div>

          <p className="text-emerald-200/60 text-xs mt-4 text-center">
            Este panel se ocultará automáticamente en 10 segundos
          </p>
        </div>
      )}

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
          <div className="p-6 border-b border-white/20 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Predicciones Generadas</h3>
            <button
              onClick={generatePDF}
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Descargar PDF</span>
            </button>
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
