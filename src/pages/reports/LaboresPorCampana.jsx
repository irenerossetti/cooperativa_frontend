import React, { useState, useEffect } from 'react';
import { Download, Filter, Calendar, TrendingUp, RefreshCw, Users, Package, BarChart3, Search, Settings } from 'lucide-react';
import api from '../../services/api';
import SimpleBarChart from '../../components/reports/SimpleBarChart';
import ColumnSelector from '../../components/reports/ColumnSelector';
import VoiceAssistantButton from '../../components/reports/VoiceAssistantButton';

const LaboresPorCampana = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);
  const [filters, setFilters] = useState({
    partner_id: '',
    date_from: '',
    date_to: '',
    minProduction: '',
    maxProduction: '',
    minYield: '',
    maxYield: ''
  });

  // Columnas disponibles
  const availableColumns = [
    { key: 'partner_id', label: 'ID' },
    { key: 'partner_name', label: 'Socio' },
    { key: 'total_production', label: 'Producción Total' },
    { key: 'total_parcels', label: 'Parcelas' },
    { key: 'avg_yield', label: 'Rendimiento Promedio' }
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.map(col => col.key)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports/reports/performance_by_partner/', {
        params: filters
      });
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
        report_type: 'performance_by_partner',
        format: format
      }, {
        responseType: 'blob'
      });

      // Descargar archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const extension = format === 'excel' ? 'xlsx' : format;
      link.setAttribute('download', `labores_campana.${extension}`);
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

  // Filtrar datos
  const filteredData = data.filter(item => {
    const matchesSearch = item.partner_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const production = item.total_production || 0;
    const yieldValue = item.avg_yield || 0;
    
    const matchesProduction = (!filters.minProduction || production >= parseFloat(filters.minProduction)) &&
                             (!filters.maxProduction || production <= parseFloat(filters.maxProduction));
    
    const matchesYield = (!filters.minYield || yieldValue >= parseFloat(filters.minYield)) &&
                        (!filters.maxYield || yieldValue <= parseFloat(filters.maxYield));
    
    return matchesSearch && matchesProduction && matchesYield;
  });

  // Estadísticas
  const totalProduction = filteredData.reduce((sum, item) => sum + (item.total_production || 0), 0);
  const totalParcels = filteredData.reduce((sum, item) => sum + (item.total_parcels || 0), 0);
  const avgYield = filteredData.length > 0 
    ? filteredData.reduce((sum, item) => sum + (item.avg_yield || 0), 0) / filteredData.length
    : 0;
  
  // Top performers
  const topProducers = [...filteredData].sort((a, b) => (b.total_production || 0) - (a.total_production || 0)).slice(0, 3);
  const topYielders = [...filteredData].sort((a, b) => (b.avg_yield || 0) - (a.avg_yield || 0)).slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Labores por Campaña</h1>
              <p className="text-emerald-200/80">Reporte de rendimiento por socio</p>
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

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Filter className="w-5 h-5" />
            <span>Filtros de Búsqueda</span>
          </h3>
          
          {/* Búsqueda */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
            <input
              type="text"
              placeholder="Buscar por nombre de socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Desde
              </label>
              <input
                type="date"
                value={filters.date_from}
                onChange={(e) => setFilters({...filters, date_from: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                <Calendar className="w-4 h-4 inline mr-1" />
                Fecha Hasta
              </label>
              <input
                type="date"
                value={filters.date_to}
                onChange={(e) => setFilters({...filters, date_to: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          {/* Filtros numéricos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

          <div className="mt-4 flex justify-between">
            <button
              onClick={() => {
                setFilters({
                  partner_id: '',
                  date_from: '',
                  date_to: '',
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
            <button
              onClick={fetchData}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Aplicar Filtros de Fecha
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
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-200/80 text-sm">Total Socios</p>
            <Users className="w-5 h-5 text-blue-300" />
          </div>
          <p className="text-3xl font-bold text-white">{filteredData.length}</p>
          <p className="text-blue-200/60 text-xs mt-1">de {data.length} totales</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-200/80 text-sm">Producción Total</p>
            <Package className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalProduction.toFixed(2)}</p>
          <p className="text-green-200/60 text-xs mt-1">kilogramos</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-200/80 text-sm">Total Parcelas</p>
            <BarChart3 className="w-5 h-5 text-purple-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalParcels}</p>
          <p className="text-purple-200/60 text-xs mt-1">parcelas activas</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-200/80 text-sm">Rendimiento Promedio</p>
            <TrendingUp className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-3xl font-bold text-white">{avgYield.toFixed(2)}</p>
          <p className="text-yellow-200/60 text-xs mt-1">kg/ha</p>
        </div>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <Package className="w-5 h-5 text-green-400" />
            <span>Top 3 Productores</span>
          </h3>
          <div className="space-y-3">
            {topProducers.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{item.partner_name}</span>
                </div>
                <span className="text-green-300 font-bold">{(item.total_production || 0).toFixed(2)} kg</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <span>Top 3 Rendimiento</span>
          </h3>
          <div className="space-y-3">
            {topYielders.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    'bg-orange-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  <span className="text-white font-medium">{item.partner_name}</span>
                </div>
                <span className="text-blue-300 font-bold">{(item.avg_yield || 0).toFixed(2)} kg/ha</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Gráfico de Comparación */}
      {filteredData.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <div className="flex items-center space-x-2 mb-4">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-semibold text-white">Comparación de Producción por Socio</h3>
          </div>
          <SimpleBarChart
            data={[...filteredData].sort((a, b) => (b.total_production || 0) - (a.total_production || 0)).slice(0, 15)}
            valueKey="total_production"
            labelKey="partner_name"
            colorClass="from-emerald-500 to-emerald-600"
          />
        </div>
      )}

      {/* Tabla de Datos */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                {selectedColumns.includes('partner_id') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">ID</th>
                )}
                {selectedColumns.includes('partner_name') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Socio</th>
                )}
                {selectedColumns.includes('total_production') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Producción Total</th>
                )}
                {selectedColumns.includes('total_parcels') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Parcelas</th>
                )}
                {selectedColumns.includes('avg_yield') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Rendimiento Promedio</th>
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
                    No hay datos disponibles. Intenta ajustar los filtros.
                  </td>
                </tr>
              ) : selectedColumns.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-emerald-200/60">
                    Selecciona al menos una columna para mostrar
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    {selectedColumns.includes('partner_id') && (
                      <td className="px-6 py-4 text-white">{row.partner_id}</td>
                    )}
                    {selectedColumns.includes('partner_name') && (
                      <td className="px-6 py-4 text-white font-medium">{row.partner_name}</td>
                    )}
                    {selectedColumns.includes('total_production') && (
                      <td className="px-6 py-4 text-emerald-200">{(row.total_production || 0).toFixed(2)} kg</td>
                    )}
                    {selectedColumns.includes('total_parcels') && (
                      <td className="px-6 py-4 text-white">{row.total_parcels || 0}</td>
                    )}
                    {selectedColumns.includes('avg_yield') && (
                      <td className="px-6 py-4 text-blue-200">{(row.avg_yield || 0).toFixed(2)} kg/ha</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer con total de registros */}
      {filteredData.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-center text-emerald-200/80">
            Mostrando {filteredData.length} de {data.length} registro{data.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}
    </div>
  );
};

export default LaboresPorCampana;
