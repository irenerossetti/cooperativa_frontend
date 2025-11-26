import React, { useState, useEffect } from 'react';
import { Download, Filter, Map, RefreshCw, Search, TrendingUp, TrendingDown, BarChart3, PieChart, Settings } from 'lucide-react';
import api from '../../services/api';
import SimpleBarChart from '../../components/reports/SimpleBarChart';
import ColumnSelector from '../../components/reports/ColumnSelector';
import VoiceAssistantButton from '../../components/reports/VoiceAssistantButton';

const ProduccionPorParcela = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [filters, setFilters] = useState({
    minSurface: '',
    maxSurface: '',
    minProduction: '',
    maxProduction: '',
    minYield: '',
    maxYield: ''
  });

  // Definir todas las columnas disponibles
  const availableColumns = [
    { key: 'parcel_code', label: 'Código Parcela' },
    { key: 'partner_name', label: 'Socio' },
    { key: 'surface', label: 'Superficie (ha)' },
    { key: 'total_production', label: 'Producción (kg)' },
    { key: 'yield_per_hectare', label: 'Rendimiento (kg/ha)' },
    { key: 'efficiency', label: 'Eficiencia' }
  ];

  // Estado para columnas seleccionadas (por defecto todas)
  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.map(col => col.key)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports/reports/performance_by_parcel/');
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
      const response = await api.post('/api/reports/reports/export_report/', {
        report_type: 'performance_by_parcel',
        format: format
      }, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `produccion_parcela.${extension}`);
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

  const filteredData = data.filter(item => {
    // Filtro de búsqueda
    const matchesSearch = item.parcel_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partner_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtros numéricos
    const surface = parseFloat(item.surface) || 0;
    const production = item.total_production || 0;
    const yieldPerHa = item.yield_per_hectare || 0;
    
    const matchesSurface = (!filters.minSurface || surface >= parseFloat(filters.minSurface)) &&
                          (!filters.maxSurface || surface <= parseFloat(filters.maxSurface));
    
    const matchesProduction = (!filters.minProduction || production >= parseFloat(filters.minProduction)) &&
                             (!filters.maxProduction || production <= parseFloat(filters.maxProduction));
    
    const matchesYield = (!filters.minYield || yieldPerHa >= parseFloat(filters.minYield)) &&
                        (!filters.maxYield || yieldPerHa <= parseFloat(filters.maxYield));
    
    return matchesSearch && matchesSurface && matchesProduction && matchesYield;
  });

  // Estadísticas
  const totalProduction = filteredData.reduce((sum, item) => sum + (item.total_production || 0), 0);
  const totalSurface = filteredData.reduce((sum, item) => sum + (parseFloat(item.surface) || 0), 0);
  const avgYield = totalSurface > 0 ? totalProduction / totalSurface : 0;
  
  // Estadísticas adicionales
  const maxYield = filteredData.length > 0 ? Math.max(...filteredData.map(item => item.yield_per_hectare || 0)) : 0;
  const minYield = filteredData.length > 0 ? Math.min(...filteredData.map(item => item.yield_per_hectare || 0)) : 0;
  const highPerformers = filteredData.filter(item => (item.yield_per_hectare || 0) >= avgYield).length;
  const lowPerformers = filteredData.filter(item => (item.yield_per_hectare || 0) < avgYield).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Map className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Producción por Parcela</h1>
              <p className="text-emerald-200/80">Rendimiento detallado por parcela</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <VoiceAssistantButton 
              onReportRequest={(command) => {
                console.log('Comando de voz:', command);
                if (command.filters) {
                  setFilters({...filters, ...command.filters});
                }
              }} 
            />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
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

      {/* Búsqueda y Filtros */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Búsqueda y Filtros</span>
          </h3>
          
          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
            <input
              type="text"
              placeholder="Buscar por código de parcela o nombre de socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          {/* Filtros numéricos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-emerald-200/80 text-sm mb-2">Superficie (ha)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minSurface}
                  onChange={(e) => setFilters({...filters, minSurface: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxSurface}
                  onChange={(e) => setFilters({...filters, maxSurface: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-200/80 text-sm mb-2">Producción (kg)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minProduction}
                  onChange={(e) => setFilters({...filters, minProduction: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxProduction}
                  onChange={(e) => setFilters({...filters, maxProduction: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-emerald-200/80 text-sm mb-2">Rendimiento (kg/ha)</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={filters.minYield}
                  onChange={(e) => setFilters({...filters, minYield: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filters.maxYield}
                  onChange={(e) => setFilters({...filters, maxYield: e.target.value})}
                  className="w-1/2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>
            </div>
          </div>

          {/* Botón limpiar filtros */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setFilters({
                  minSurface: '',
                  maxSurface: '',
                  minProduction: '',
                  maxProduction: '',
                  minYield: '',
                  maxYield: ''
                });
                setSearchTerm('');
              }}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      )}

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

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-200/80 text-sm">Total Parcelas</p>
            <Map className="w-5 h-5 text-purple-300" />
          </div>
          <p className="text-3xl font-bold text-white">{filteredData.length}</p>
          <p className="text-purple-200/60 text-xs mt-1">de {data.length} totales</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-200/80 text-sm">Superficie Total</p>
            <BarChart3 className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalSurface.toFixed(2)}</p>
          <p className="text-green-200/60 text-xs mt-1">hectáreas</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-200/80 text-sm">Producción Total</p>
            <TrendingUp className="w-5 h-5 text-blue-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalProduction.toFixed(2)}</p>
          <p className="text-blue-200/60 text-xs mt-1">kilogramos</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-200/80 text-sm">Rendimiento Promedio</p>
            <PieChart className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-3xl font-bold text-white">{avgYield.toFixed(2)}</p>
          <p className="text-yellow-200/60 text-xs mt-1">kg/ha</p>
        </div>
      </div>

      {/* Estadísticas Adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-emerald-200/80 text-sm">Rendimiento Máximo</p>
          </div>
          <p className="text-2xl font-bold text-green-300">{maxYield.toFixed(2)} kg/ha</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-red-400" />
            <p className="text-emerald-200/80 text-sm">Rendimiento Mínimo</p>
          </div>
          <p className="text-2xl font-bold text-red-300">{minYield.toFixed(2)} kg/ha</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <p className="text-emerald-200/80 text-sm">Alto Rendimiento</p>
          </div>
          <p className="text-2xl font-bold text-white">{highPerformers}</p>
          <p className="text-emerald-200/60 text-xs mt-1">≥ promedio</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingDown className="w-4 h-4 text-orange-400" />
            <p className="text-emerald-200/80 text-sm">Bajo Rendimiento</p>
          </div>
          <p className="text-2xl font-bold text-white">{lowPerformers}</p>
          <p className="text-emerald-200/60 text-xs mt-1">&lt; promedio</p>
        </div>
      </div>

      {/* Gráficos de Análisis */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <h3 className="text-lg font-semibold text-white">Top 10 Producción</h3>
            </div>
            <SimpleBarChart
              data={[...filteredData].sort((a, b) => (b.total_production || 0) - (a.total_production || 0)).slice(0, 10)}
              valueKey="total_production"
              labelKey="parcel_code"
              colorClass="from-blue-500 to-blue-600"
            />
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <div className="flex items-center space-x-2 mb-4">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <h3 className="text-lg font-semibold text-white">Top 10 Rendimiento</h3>
            </div>
            <SimpleBarChart
              data={[...filteredData].sort((a, b) => (b.yield_per_hectare || 0) - (a.yield_per_hectare || 0)).slice(0, 10)}
              valueKey="yield_per_hectare"
              labelKey="parcel_code"
              colorClass="from-yellow-500 to-yellow-600"
            />
          </div>
        </div>
      )}

      {/* Tabla de Datos */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                {selectedColumns.includes('parcel_code') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Código Parcela</th>
                )}
                {selectedColumns.includes('partner_name') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Socio</th>
                )}
                {selectedColumns.includes('surface') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Superficie (ha)</th>
                )}
                {selectedColumns.includes('total_production') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Producción (kg)</th>
                )}
                {selectedColumns.includes('yield_per_hectare') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Rendimiento (kg/ha)</th>
                )}
                {selectedColumns.includes('efficiency') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Eficiencia</th>
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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={selectedColumns.length} className="px-6 py-8 text-center text-emerald-200/60">
                    {searchTerm ? 'No se encontraron resultados para tu búsqueda' : 'No hay datos disponibles'}
                  </td>
                </tr>
              ) : selectedColumns.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    Selecciona al menos una columna para mostrar
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => {
                  const yieldPerHa = row.yield_per_hectare || 0;
                  const efficiency = avgYield > 0 ? (yieldPerHa / avgYield) * 100 : 0;
                  
                  return (
                    <tr key={index} className="hover:bg-white/5 transition-colors">
                      {selectedColumns.includes('parcel_code') && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <Map className="w-4 h-4 text-purple-400" />
                            <span className="text-white font-medium">{row.parcel_code}</span>
                          </div>
                        </td>
                      )}
                      {selectedColumns.includes('partner_name') && (
                        <td className="px-6 py-4 text-white">{row.partner_name}</td>
                      )}
                      {selectedColumns.includes('surface') && (
                        <td className="px-6 py-4 text-emerald-200">{parseFloat(row.surface || 0).toFixed(2)} ha</td>
                      )}
                      {selectedColumns.includes('total_production') && (
                        <td className="px-6 py-4 text-blue-200">{(row.total_production || 0).toFixed(2)} kg</td>
                      )}
                      {selectedColumns.includes('yield_per_hectare') && (
                        <td className="px-6 py-4 text-yellow-200 font-semibold">{yieldPerHa.toFixed(2)} kg/ha</td>
                      )}
                      {selectedColumns.includes('efficiency') && (
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-2">
                            <div className="flex-1 bg-white/10 rounded-full h-2 max-w-[100px]">
                              <div
                                className={`h-2 rounded-full ${
                                  efficiency >= 100 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                                  efficiency >= 75 ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
                                  'bg-gradient-to-r from-red-500 to-red-600'
                                }`}
                                style={{ width: `${Math.min(efficiency, 100)}%` }}
                              ></div>
                            </div>
                            <span className={`text-sm font-medium ${
                              efficiency >= 100 ? 'text-green-200' :
                              efficiency >= 75 ? 'text-yellow-200' :
                              'text-red-200'
                            }`}>
                              {efficiency.toFixed(0)}%
                            </span>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer */}
      {filteredData.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <p className="text-emerald-200/80">
              Mostrando {filteredData.length} de {data.length} parcela{data.length !== 1 ? 's' : ''}
            </p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-white">≥100% Eficiencia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="text-white">75-99% Eficiencia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-white">&lt;75% Eficiencia</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProduccionPorParcela;
