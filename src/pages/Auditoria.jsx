import { useState, useEffect } from 'react';
import { Search, FileText, User, Calendar, Filter, X } from 'lucide-react';
import api from '../services/api';

const Auditoria = () => {
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    model_name: '',
    date_from: '',
    date_to: '',
  });

  const actionTypes = [
    { value: 'LOGIN', label: 'Inicio de sesión' },
    { value: 'LOGOUT', label: 'Cierre de sesión' },
    { value: 'LOGIN_FAILED', label: 'Intento fallido' },
    { value: 'CREATE', label: 'Creación' },
    { value: 'UPDATE', label: 'Actualización' },
    { value: 'DELETE', label: 'Eliminación' },
  ];

  useEffect(() => {
    fetchLogs();
    fetchUsers();
  }, []);

  const fetchLogs = async (customFilters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      const activeFilters = { ...filters, ...customFilters };
      
      if (activeFilters.user) params.append('user', activeFilters.user);
      if (activeFilters.action) params.append('action', activeFilters.action);
      if (activeFilters.model_name) params.append('model_name', activeFilters.model_name);
      if (activeFilters.date_from) params.append('date_from', activeFilters.date_from);
      if (activeFilters.date_to) params.append('date_to', activeFilters.date_to);
      if (searchTerm) params.append('search', searchTerm);

      const queryString = params.toString();
      const url = `/api/audit/logs/${queryString ? `?${queryString}` : ''}`;
      
      const response = await api.get(url);
      const data = response.data.results || response.data || [];
      setLogs(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/auth/users/');
      const data = response.data.results || response.data || [];
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleApplyFilters = () => {
    fetchLogs();
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    setFilters({
      user: '',
      action: '',
      model_name: '',
      date_from: '',
      date_to: '',
    });
    setSearchTerm('');
    fetchLogs({
      user: '',
      action: '',
      model_name: '',
      date_from: '',
      date_to: '',
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchLogs();
  };

  const getActionColor = (action) => {
    const colors = {
      'LOGIN': 'bg-green-500/20 text-green-200',
      'LOGOUT': 'bg-blue-500/20 text-blue-200',
      'LOGIN_FAILED': 'bg-red-500/20 text-red-200',
      'CREATE': 'bg-emerald-500/20 text-emerald-200',
      'UPDATE': 'bg-yellow-500/20 text-yellow-200',
      'DELETE': 'bg-red-500/20 text-red-200',
    };
    return colors[action] || 'bg-gray-500/20 text-gray-200';
  };

  const filteredLogs = Array.isArray(logs) 
    ? logs.filter(log =>
        log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.username?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Auditoría del Sistema</h1>
            <p className="text-emerald-200/80">Revisa el historial de cambios y acciones</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Filter className="w-5 h-5" />
            <span>Filtros</span>
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Filtros de Búsqueda</h3>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Usuario
              </label>
              <select
                name="user"
                value={filters.user}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Todos los usuarios</option>
                {users.map(user => (
                  <option key={user.id} value={user.id}>
                    {user.username}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Acción
              </label>
              <select
                name="action"
                value={filters.action}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Todas las acciones</option>
                {actionTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Modelo
              </label>
              <input
                type="text"
                name="model_name"
                value={filters.model_name}
                onChange={handleFilterChange}
                placeholder="Ej: Partner, Parcel"
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Fecha Desde
              </label>
              <input
                type="date"
                name="date_from"
                value={filters.date_from}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">
                Fecha Hasta
              </label>
              <input
                type="date"
                name="date_to"
                value={filters.date_to}
                onChange={handleFilterChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleApplyFilters}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-colors"
            >
              Aplicar Filtros
            </button>
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar en descripción o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </form>
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Fecha y Hora</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Modelo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Descripción</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    <div className="flex justify-center">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron registros de auditoría
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-emerald-400" />
                        <span className="text-white text-sm">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-blue-400" />
                        <span className="text-emerald-200/80">{log.username || 'Sistema'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getActionColor(log.action)}`}>
                        {log.action_display}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80 font-mono text-sm">
                      {log.model_name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start space-x-2">
                        <FileText className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" />
                        <span className="text-white text-sm">{log.description}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80 font-mono text-xs">
                      {log.ip_address || '-'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      {filteredLogs.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <div className="text-center text-emerald-200/80">
            Mostrando {filteredLogs.length} registro{filteredLogs.length !== 1 ? 's' : ''}
          </div>
        </div>
      )}
    </div>
  );
};

export default Auditoria;
