import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import {
  Shield, Building2, Users, TrendingUp, Activity, Search,
  Filter, Plus, Edit, Trash2, Eye, CheckCircle, XCircle,
  Clock, AlertCircle, LogOut, BarChart3, Settings, ArrowRight
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [showOrgModal, setShowOrgModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    organization_name: '',
    subdomain: '',
    email: '',
    phone: '',
    plan: 'FREE',
    username: '',
    user_email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    plan: ''
  });

  // Verificar que sea super admin
  useEffect(() => {
    if (!user?.is_superuser) {
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar estadísticas
  useEffect(() => {
    loadStats();
    loadOrganizations();
  }, []);

  const loadStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/tenants/super-admin/stats/`);
      setStats(response.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadOrganizations = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.search) params.append('search', filters.search);
      if (filters.status) params.append('status', filters.status);
      if (filters.plan) params.append('plan', filters.plan);

      const response = await axios.get(
        `${API_URL}/api/tenants/super-admin/organizations/?${params}`
      );
      setOrganizations(response.data);
    } catch (error) {
      console.error('Error loading organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const viewOrgDetails = async (orgId) => {
    try {
      const response = await axios.get(
        `${API_URL}/api/tenants/super-admin/organizations/${orgId}/`
      );
      setSelectedOrg(response.data);
      setShowOrgModal(true);
    } catch (error) {
      console.error('Error loading org details:', error);
    }
  };

  const updateOrgStatus = async (orgId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/api/tenants/super-admin/organizations/${orgId}/update/`,
        { status: newStatus }
      );
      loadOrganizations();
      loadStats();
    } catch (error) {
      console.error('Error updating organization:', error);
    }
  };

  const deleteOrg = async (orgId, orgName) => {
    if (!window.confirm(`¿Estás seguro de desactivar la organización "${orgName}"?\n\nEsta acción cambiará su estado a CANCELADO.`)) {
      return;
    }

    try {
      const response = await axios.delete(
        `${API_URL}/api/tenants/super-admin/organizations/${orgId}/delete/`
      );
      
      console.log('Delete response:', response.data);
      alert(response.data.message || 'Organización desactivada exitosamente');
      
      // Recargar datos
      await loadOrganizations();
      await loadStats();
    } catch (error) {
      console.error('Error deleting organization:', error);
      const errorMsg = error.response?.data?.error || error.response?.data?.detail || 'Error al desactivar la organización';
      alert(`Error: ${errorMsg}`);
    }
  };

  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    setCreateFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setCreateError('');
  };

  const handleCreateOrg = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    setCreateError('');

    try {
      const response = await axios.post(
        `${API_URL}/api/tenants/super-admin/organizations/create/`,
        createFormData
      );

      alert(`✅ Organización creada exitosamente!\n\nOrganización: ${response.data.organization.name}\nSubdominio: ${response.data.organization.subdomain}\nAdmin: ${response.data.user.username}`);
      
      // Cerrar modal y resetear formulario
      setShowCreateModal(false);
      setCreateFormData({
        organization_name: '',
        subdomain: '',
        email: '',
        phone: '',
        plan: 'FREE',
        username: '',
        user_email: '',
        password: '',
        first_name: '',
        last_name: ''
      });

      // Recargar datos
      await loadOrganizations();
      await loadStats();
    } catch (error) {
      console.error('Error creating organization:', error);
      const errorData = error.response?.data;
      let errorMsg = 'Error al crear la organización';
      
      if (errorData) {
        if (typeof errorData === 'object') {
          // Mostrar errores de validación
          const errors = Object.entries(errorData)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('\n');
          errorMsg = errors;
        } else {
          errorMsg = errorData;
        }
      }
      
      setCreateError(errorMsg);
    } finally {
      setCreateLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      ACTIVE: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle },
      TRIAL: { bg: 'bg-blue-100', text: 'text-blue-800', icon: Clock },
      SUSPENDED: { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: AlertCircle },
      CANCELLED: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle }
    };
    const badge = badges[status] || badges.TRIAL;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
        <Icon className="w-3 h-3" />
        <span>{status}</span>
      </span>
    );
  };

  const getPlanBadge = (plan) => {
    const colors = {
      FREE: 'bg-gray-100 text-gray-800',
      BASIC: 'bg-blue-100 text-blue-800',
      PROFESSIONAL: 'bg-purple-100 text-purple-800',
      ENTERPRISE: 'bg-orange-100 text-orange-800'
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${colors[plan] || colors.FREE}`}>
        {plan}
      </span>
    );
  };

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Panel de Super Admin</h1>
                <p className="text-sm text-gray-400">Gestión de Cooperativas</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user?.username}</p>
                <p className="text-xs text-gray-400">Super Administrador</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.organizations.total}
            </h3>
            <p className="text-gray-400 text-sm">Total Organizaciones</p>
            <p className="text-green-400 text-xs mt-2">
              +{stats.organizations.new_last_month} este mes
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <Activity className="w-5 h-5 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.organizations.active}
            </h3>
            <p className="text-gray-400 text-sm">Organizaciones Activas</p>
            <p className="text-gray-500 text-xs mt-2">
              {stats.organizations.trial} en prueba
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <BarChart3 className="w-5 h-5 text-purple-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.users.total}
            </h3>
            <p className="text-gray-400 text-sm">Total Usuarios</p>
            <p className="text-purple-400 text-xs mt-2">
              {stats.users.active} activos
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <Settings className="w-5 h-5 text-orange-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-1">
              {stats.organizations.suspended}
            </h3>
            <p className="text-gray-400 text-sm">Suspendidas</p>
            <p className="text-gray-500 text-xs mt-2">
              Requieren atención
            </p>
          </div>
        </div>

        {/* Filters and Actions */}
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, subdominio o email..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="ACTIVE">Activo</option>
                <option value="TRIAL">Prueba</option>
                <option value="SUSPENDED">Suspendido</option>
                <option value="CANCELLED">Cancelado</option>
              </select>

              <select
                value={filters.plan}
                onChange={(e) => setFilters({ ...filters, plan: e.target.value })}
                className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los planes</option>
                <option value="FREE">Gratuito</option>
                <option value="BASIC">Básico</option>
                <option value="PROFESSIONAL">Profesional</option>
                <option value="ENTERPRISE">Enterprise</option>
              </select>

              <button
                onClick={loadOrganizations}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filtrar</span>
              </button>
            </div>

            <button
              onClick={() => setShowCreateModal(true)}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Organización</span>
            </button>
          </div>
        </div>

        {/* Organizations Table */}
        <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Organización
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Plan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Miembros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Creada
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      Cargando organizaciones...
                    </td>
                  </tr>
                ) : organizations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                      No se encontraron organizaciones
                    </td>
                  </tr>
                ) : (
                  organizations.map((org) => (
                    <tr key={org.id} className="hover:bg-gray-750 transition">
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-white font-medium">{org.name}</p>
                          <p className="text-gray-400 text-sm">{org.subdomain}.app.com</p>
                          <p className="text-gray-500 text-xs">{org.email}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {getPlanBadge(org.plan)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(org.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          <span className="text-white">
                            {org.members_count} / {org.max_users}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400 text-sm">
                        {new Date(org.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => viewOrgDetails(org.id)}
                            className="p-2 text-blue-400 hover:bg-gray-700 rounded-lg transition"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {org.status === 'SUSPENDED' && (
                            <button
                              onClick={() => updateOrgStatus(org.id, 'ACTIVE')}
                              className="p-2 text-green-400 hover:bg-gray-700 rounded-lg transition"
                              title="Activar"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {org.status === 'ACTIVE' && (
                            <button
                              onClick={() => updateOrgStatus(org.id, 'SUSPENDED')}
                              className="p-2 text-yellow-400 hover:bg-gray-700 rounded-lg transition"
                              title="Suspender"
                            >
                              <AlertCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => deleteOrg(org.id, org.name)}
                            className="p-2 text-red-400 hover:bg-gray-700 rounded-lg transition"
                            title="Desactivar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Organization Details Modal */}
      {showOrgModal && selectedOrg && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">Detalles de Organización</h2>
              <button
                onClick={() => setShowOrgModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Información Básica</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">Nombre</p>
                    <p className="text-white font-medium">{selectedOrg.name}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Subdominio</p>
                    <p className="text-white font-medium">{selectedOrg.subdomain}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">{selectedOrg.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Teléfono</p>
                    <p className="text-white font-medium">{selectedOrg.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Plan</p>
                    <div className="mt-1">{getPlanBadge(selectedOrg.plan)}</div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Estado</p>
                    <div className="mt-1">{getStatusBadge(selectedOrg.status)}</div>
                  </div>
                </div>
              </div>

              {/* Limits */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Límites</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Usuarios</p>
                    <p className="text-white font-bold text-xl">{selectedOrg.max_users}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Productos</p>
                    <p className="text-white font-bold text-xl">{selectedOrg.max_products}</p>
                  </div>
                  <div className="bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-400 text-sm">Almacenamiento</p>
                    <p className="text-white font-bold text-xl">{selectedOrg.max_storage_mb} MB</p>
                  </div>
                </div>
              </div>

              {/* Access Info */}
              <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-blue-300 mb-3 flex items-center space-x-2">
                  <Shield className="w-5 h-5" />
                  <span>Acceso a la Organización</span>
                </h3>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-300">
                    Para acceder a esta organización, usa las credenciales del administrador:
                  </p>
                  <div className="bg-gray-800 rounded p-3 space-y-1">
                    <p className="text-gray-400">Usuario: <span className="text-white font-mono">{selectedOrg.members.find(m => m.role === 'ADMIN')?.username || 'N/A'}</span></p>
                    <p className="text-gray-400">Email: <span className="text-white font-mono">{selectedOrg.members.find(m => m.role === 'ADMIN')?.email || 'N/A'}</span></p>
                    <p className="text-yellow-300 text-xs mt-2">💡 Inicia sesión con estas credenciales en la página principal</p>
                  </div>
                </div>
              </div>

              {/* Members */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">
                  Miembros ({selectedOrg.members_count})
                </h3>
                <div className="space-y-2">
                  {selectedOrg.members.map((member) => (
                    <div key={member.id} className="bg-gray-700 rounded-lg p-3 flex items-center justify-between">
                      <div>
                        <p className="text-white font-medium">{member.full_name || member.username}</p>
                        <p className="text-gray-400 text-sm">{member.email}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.role === 'ADMIN' ? 'bg-red-600 text-white' : 'bg-blue-600 text-white'
                      }`}>
                        {member.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* Create Organization Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Crear Nueva Organización</h2>
                <p className="text-gray-400 text-sm mt-1">Complete los datos de la organización y su administrador</p>
              </div>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setCreateError('');
                }}
                className="text-gray-400 hover:text-white"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleCreateOrg} className="p-6">
              {createError && (
                <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg">
                  <p className="text-red-200 text-sm whitespace-pre-line">{createError}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Organization Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Información de la Organización</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre de la Organización *
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={createFormData.organization_name}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Cooperativa San Juan"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Subdominio *
                      </label>
                      <input
                        type="text"
                        name="subdomain"
                        value={createFormData.subdomain}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="sanjuan"
                        pattern="[a-z0-9-]+"
                        title="Solo letras minúsculas, números y guiones"
                        required
                      />
                      <p className="text-gray-500 text-xs mt-1">Solo letras minúsculas, números y guiones</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email de Contacto *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={createFormData.email}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="contacto@cooperativa.com"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={createFormData.phone}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="+54 264 123 4567"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Plan *
                      </label>
                      <select
                        name="plan"
                        value={createFormData.plan}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                        required
                      >
                        <option value="FREE">Gratuito</option>
                        <option value="BASIC">Básico</option>
                        <option value="PROFESSIONAL">Profesional</option>
                        <option value="ENTERPRISE">Enterprise</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Admin User Info */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Administrador de la Organización</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre *
                      </label>
                      <input
                        type="text"
                        name="first_name"
                        value={createFormData.first_name}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Juan"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Apellido *
                      </label>
                      <input
                        type="text"
                        name="last_name"
                        value={createFormData.last_name}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Pérez"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Usuario *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={createFormData.username}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="admin_sanjuan"
                        pattern="[a-zA-Z0-9_]+"
                        title="Solo letras, números y guiones bajos"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Email del Admin *
                      </label>
                      <input
                        type="email"
                        name="user_email"
                        value={createFormData.user_email}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="admin@cooperativa.com"
                        required
                      />
                    </div>

                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Contraseña *
                      </label>
                      <input
                        type="password"
                        name="password"
                        value={createFormData.password}
                        onChange={handleCreateFormChange}
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Mínimo 8 caracteres"
                        minLength="8"
                        required
                      />
                      <p className="text-gray-500 text-xs mt-1">Mínimo 8 caracteres. El admin podrá cambiarla después.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setCreateError('');
                  }}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
                  disabled={createLoading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {createLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Creando...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Crear Organización</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;
