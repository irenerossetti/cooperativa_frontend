import React, { useState, useEffect } from 'react';
import { Download, Filter, Package, RefreshCw, Users, BarChart3, Settings } from 'lucide-react';
import api from '../../services/api';
import SimpleBarChart from '../../components/reports/SimpleBarChart';
import ColumnSelector from '../../components/reports/ColumnSelector';
import VoiceAssistantButton from '../../components/reports/VoiceAssistantButton';

const ProduccionPorCampana = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  // Columnas disponibles
  const availableColumns = [
    { key: 'crop_name', label: 'Cultivo' },
    { key: 'total_hectares', label: 'Hectáreas Totales' },
    { key: 'parcel_count', label: 'Número de Parcelas' },
    { key: 'avg_per_parcel', label: 'Promedio por Parcela' },
    { key: 'percentage', label: '% del Total' }
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.map(col => col.key)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports/reports/hectares_by_crop/');
      setData(response.data || []);
    } catch (error) {
      console.error('Error:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      // Preparar datos con solo las columnas seleccionadas
      const exportData = data.map(item => {
        const row = {};
        selectedColumns.forEach(colKey => {
          row[colKey] = item[colKey];
        });
        return row;
      });

      // Preparar headers con solo las columnas seleccionadas
      const exportHeaders = availableColumns
        .filter(col => selectedColumns.includes(col.key))
        .map(col => col.label);

      const response = await api.post('/api/reports/reports/export_report/', {
        report_type: 'hectares_by_crop',
        format: format,
        data: exportData,
        headers: exportHeaders,
        selected_columns: selectedColumns
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `produccion_campana.${extension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al exportar el reporte');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalHectares = data.reduce((sum, item) => sum + (parseFloat(item.total_hectares) || 0), 0);
  const totalParcels = data.reduce((sum, item) => sum + (item.parcel_count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Producción por Campaña</h1>
              <p className="text-emerald-200/80">Hectáreas cultivadas por tipo de cultivo</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <VoiceAssistantButton 
              onReportRequest={(command) => {
                console.log('Comando de voz:', command);
              }} 
            />
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="bg-purple-500/20 hover:bg-purple-500/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Settings className="w-4 h-4" />
              <span>Columnas</span>
            </button>
            <button
              onClick={fetchData}
              disabled={loading}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Actualizar</span>
            </button>
            <button
              onClick={() => handleExport('excel')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Excel</span>
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>PDF</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>CSV</span>
            </button>
          </div>
        </div>
      </div>

      {/* Selector de Columnas */}
      {showColumnSelector && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <ColumnSelector
            columns={availableColumns}
            selectedColumns={selectedColumns}
            onToggle={(key) => {
              if (selectedColumns.includes(key)) {
                setSelectedColumns(selectedColumns.filter(col => col !== key));
              } else {
                setSelectedColumns([...selectedColumns, key]);
              }
            }}
            onSelectAll={() => setSelectedColumns(availableColumns.map(col => col.key))}
            onDeselectAll={() => setSelectedColumns([])}
          />
        </div>
      )}

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200/80 text-sm mb-1">Total Hectáreas</p>
              <p className="text-3xl font-bold text-white">{totalHectares.toFixed(2)}</p>
              <p className="text-green-200/60 text-xs mt-1">ha cultivadas</p>
            </div>
            <div className="w-12 h-12 bg-green-500/30 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6 text-green-200" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200/80 text-sm mb-1">Total Parcelas</p>
              <p className="text-3xl font-bold text-white">{totalParcels}</p>
              <p className="text-blue-200/60 text-xs mt-1">parcelas registradas</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/30 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-200" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200/80 text-sm mb-1">Tipos de Cultivo</p>
              <p className="text-3xl font-bold text-white">{data.length}</p>
              <p className="text-purple-200/60 text-xs mt-1">cultivos diferentes</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/30 rounded-lg flex items-center justify-center">
              <Filter className="w-6 h-6 text-purple-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico de Distribución */}
      {data.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Distribución de Hectáreas por Cultivo</h3>
          </div>
          <SimpleBarChart
            data={data.slice(0, 10)}
            valueKey="total_hectares"
            labelKey="current_crop__name"
            colorClass="from-green-500 to-green-600"
          />
        </div>
      )}

      {/* Tabla de Datos */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                {selectedColumns.includes('crop_name') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Cultivo</th>
                )}
                {selectedColumns.includes('total_hectares') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Hectáreas Totales</th>
                )}
                {selectedColumns.includes('parcel_count') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Número de Parcelas</th>
                )}
                {selectedColumns.includes('avg_per_parcel') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Promedio por Parcela</th>
                )}
                {selectedColumns.includes('percentage') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">% del Total</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="px-6 py-8 text-center text-white">
                    <div className="flex justify-center">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="px-6 py-8 text-center text-emerald-200/60">
                    No hay datos disponibles
                  </td>
                </tr>
              ) : selectedColumns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-emerald-200/60">
                    Selecciona al menos una columna para mostrar
                  </td>
                </tr>
              ) : (
                data.map((row, index) => {
                  const hectares = parseFloat(row.total_hectares) || 0;
                  const parcels = row.parcel_count || 0;
                  const avgPerParcel = parcels > 0 ? hectares / parcels : 0;
                  const percentage = totalHectares > 0 ? (hectares / totalHectares) * 100 : 0;

                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      {selectedColumns.includes('crop_name') && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                            <span className="text-white font-medium">
                              {row.current_crop__name || 'Sin especificar'}
                            </span>
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('total_hectares') && (
                        <td className="px-6 py-4 text-emerald-200 font-semibold">
                          {hectares.toFixed(2)} ha
                        </td>
                      )}
                      {selectedColumns.includes('parcel_count') && (
                        <td className="px-6 py-4 text-white">{parcels}</td>
                      )}
                      {selectedColumns.includes('avg_per_parcel') && (
                        <td className="px-6 py-4 text-blue-200">
                          {avgPerParcel.toFixed(2)} ha
                        </td>
                      )}
                      {selectedColumns.includes('percentage') && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                              <div
                                className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-white text-sm">{percentage.toFixed(1)}%</span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
            {data.length > 0 && (
              <tfoot className="bg-white/5 border-t border-white/20">
                <tr>
                  <td className="px-6 py-4 text-white font-bold">TOTAL</td>
                  <td className="px-6 py-4 text-emerald-200 font-bold">{totalHectares.toFixed(2)} ha</td>
                  <td className="px-6 py-4 text-white font-bold">{totalParcels}</td>
                  <td className="px-6 py-4 text-blue-200 font-bold">
                    {(totalParcels > 0 ? totalHectares / totalParcels : 0).toFixed(2)} ha
                  </td>
                  <td className="px-6 py-4 text-white font-bold">100%</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Footer */}
      {data.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-center text-emerald-200/80">
            Mostrando {data.length} tipo{data.length !== 1 ? 's' : ''} de cultivo
          </p>
        </div>
      )}
    </div>
  );
};

export default ProduccionPorCampana;
