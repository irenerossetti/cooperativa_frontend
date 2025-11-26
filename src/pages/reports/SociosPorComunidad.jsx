import { useState, useEffect } from 'react';
import { Download, Filter, Users, RefreshCw, Search, TrendingUp, BarChart3, PieChart, Settings } from 'lucide-react';
import api from '../../services/api';
import SimpleBarChart from '../../components/reports/SimpleBarChart';
import ColumnSelector from '../../components/reports/ColumnSelector';
import VoiceAssistantButton from '../../components/reports/VoiceAssistantButton';

const SociosPorComunidad = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showColumnSelector, setShowColumnSelector] = useState(false);

  const availableColumns = [
    { key: 'community_name', label: 'Comunidad' },
    { key: 'total_partners', label: 'Total Socios' },
    { key: 'active_partners', label: 'Socios Activos' },
    { key: 'inactive_partners', label: 'Socios Inactivos' },
    { key: 'total_production', label: 'Producción Total (kg)' },
    { key: 'avg_production_per_partner', label: 'Promedio por Socio (kg)' }
  ];

  const [selectedColumns, setSelectedColumns] = useState(
    availableColumns.map(col => col.key)
  );

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/reports/reports/partners_by_community/');
      setData(response.data.data || []);
    } catch (error) {
      console.error('Error:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      // Preparar datos filtrados con solo las columnas seleccionadas
      const exportData = filteredData.map(item => {
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
        report_type: 'partners_by_community',
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
      link.setAttribute('download', `socios_comunidad.${extension}`);
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

  const filteredData = data.filter(item =>
    item.community_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPartners = filteredData.reduce((sum, item) => sum + (item.total_partners || 0), 0);
  const totalActive = filteredData.reduce((sum, item) => sum + (item.active_partners || 0), 0);
  const totalProduction = filteredData.reduce((sum, item) => sum + (item.total_production || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Socios por Comunidad</h1>
              <p className="text-emerald-200/80">Distribución y estadísticas por comunidad</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <VoiceAssistantButton onReportRequest={(command) => console.log('Comando:', command)} />
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>Filtros</span>
            </button>
            <button
              onClick={() => setShowColumnSelector(!showColumnSelector)}
              className="bg-blue-500/20 hover:bg-blue-500/30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
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

      {/* Búsqueda */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
            <input
              type="text"
              placeholder="Buscar por nombre de comunidad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
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

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-blue-200/80 text-sm">Total Comunidades</p>
            <Users className="w-5 h-5 text-blue-300" />
          </div>
          <p className="text-3xl font-bold text-white">{filteredData.length}</p>
        </div>
        
        <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 backdrop-blur-lg border border-green-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-green-200/80 text-sm">Total Socios</p>
            <BarChart3 className="w-5 h-5 text-green-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalPartners}</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-lg border border-purple-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-purple-200/80 text-sm">Socios Activos</p>
            <TrendingUp className="w-5 h-5 text-purple-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalActive}</p>
          <p className="text-purple-200/60 text-xs mt-1">{totalPartners > 0 ? ((totalActive/totalPartners)*100).toFixed(1) : 0}% del total</p>
        </div>
        
        <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 backdrop-blur-lg border border-yellow-400/30 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-yellow-200/80 text-sm">Producción Total</p>
            <PieChart className="w-5 h-5 text-yellow-300" />
          </div>
          <p className="text-3xl font-bold text-white">{totalProduction.toFixed(0)}</p>
          <p className="text-yellow-200/60 text-xs mt-1">kilogramos</p>
        </div>
      </div>

      {/* Gráficos */}
      {filteredData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-blue-400" />
              <span>Socios por Comunidad</span>
            </h3>
            <SimpleBarChart
              data={filteredData}
              valueKey="total_partners"
              labelKey="community_name"
              colorClass="from-blue-500 to-blue-600"
            />
          </div>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <span>Producción por Comunidad</span>
            </h3>
            <SimpleBarChart
              data={filteredData}
              valueKey="total_production"
              labelKey="community_name"
              colorClass="from-green-500 to-green-600"
            />
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                {selectedColumns.includes('community_name') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Comunidad</th>
                )}
                {selectedColumns.includes('total_partners') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Total Socios</th>
                )}
                {selectedColumns.includes('active_partners') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Activos</th>
                )}
                {selectedColumns.includes('inactive_partners') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Inactivos</th>
                )}
                {selectedColumns.includes('total_production') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Producción (kg)</th>
                )}
                {selectedColumns.includes('avg_production_per_partner') && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Promedio/Socio</th>
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
                    No hay datos disponibles
                  </td>
                </tr>
              ) : (
                filteredData.map((row, index) => (
                  <tr key={index} className="hover:bg-white/5 transition-colors">
                    {selectedColumns.includes('community_name') && (
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-medium">{row.community_name}</span>
                        </div>
                      </td>
                    )}
                    {selectedColumns.includes('total_partners') && (
                      <td className="px-6 py-4 text-white font-semibold">{row.total_partners}</td>
                    )}
                    {selectedColumns.includes('active_partners') && (
                      <td className="px-6 py-4 text-green-200">{row.active_partners}</td>
                    )}
                    {selectedColumns.includes('inactive_partners') && (
                      <td className="px-6 py-4 text-red-200">{row.inactive_partners}</td>
                    )}
                    {selectedColumns.includes('total_production') && (
                      <td className="px-6 py-4 text-yellow-200">{row.total_production.toFixed(2)} kg</td>
                    )}
                    {selectedColumns.includes('avg_production_per_partner') && (
                      <td className="px-6 py-4 text-emerald-200">{row.avg_production_per_partner.toFixed(2)} kg</td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SociosPorComunidad;
