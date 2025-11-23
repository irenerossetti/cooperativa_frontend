import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Key } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrador' },
    { value: 'PARTNER', label: 'Socio' },
    { value: 'OPERATOR', label: 'Operador' },
  ];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.ROLES.LIST);
      const data = response.data.results || response.data || [];
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name) errors.name = 'El rol es requerido';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(API_ENDPOINTS.ROLES.DETAIL(editingId), formData);
      } else {
        await api.post(API_ENDPOINTS.ROLES.LIST, formData);
      }
      
      await fetchRoles();
      handleCloseModal();
      alert(editingId ? 'Rol actualizado exitosamente' : 'Rol creado exitosamente');
    } catch (error) {
      console.error('Error saving rol:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar el rol:\n';
        
        if (typeof errorData === 'object') {
          Object.keys(errorData).forEach(key => {
            const value = errorData[key];
            if (Array.isArray(value)) {
              errorMessage += `${key}: ${value.join(', ')}\n`;
            } else {
              errorMessage += `${key}: ${value}\n`;
            }
          });
        } else {
          errorMessage = errorData.message || errorData.toString();
        }
        
        alert(errorMessage);
      } else {
        alert('Error al guardar el rol. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (rol) => {
    setEditingId(rol.id);
    setFormData({
      name: rol.name || '',
      description: rol.description || '',
      is_active: rol.is_active !== undefined ? rol.is_active : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este rol? Los usuarios con este rol quedarán sin rol asignado.')) return;

    try {
      await api.delete(API_ENDPOINTS.ROLES.DETAIL(id));
      await fetchRoles();
      alert('Rol eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting rol:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el rol';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      is_active: true,
    });
    setFormErrors({});
  };

  const getRoleLabel = (roleName) => {
    const role = roleOptions.find(r => r.value === roleName);
    // Si encuentra el rol en las opciones predefinidas, devuelve el label
    // Si no, devuelve el nombre tal cual (para roles personalizados)
    return role ? role.label : roleName;
  };

  const filteredRoles = Array.isArray(roles) 
    ? roles.filter(rol =>
        getRoleLabel(rol.name)?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        rol.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Roles</h1>
            <p className="text-emerald-200/80">Administra los roles y permisos del sistema</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Rol</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar rol..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full flex justify-center py-12">
            <div className="spinner"></div>
          </div>
        ) : filteredRoles.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Key className="w-16 h-16 text-emerald-300/30 mx-auto mb-4" />
            <p className="text-emerald-200/60">No se encontraron roles</p>
          </div>
        ) : (
          filteredRoles.map((rol) => (
            <div
              key={rol.id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Key className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {getRoleLabel(rol.name)}
                    </h3>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs mt-1 ${
                      rol.is_active 
                        ? 'bg-green-500/20 text-green-200' 
                        : 'bg-red-500/20 text-red-200'
                    }`}>
                      {rol.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-emerald-200/70 text-sm mb-4 min-h-[40px]">
                {rol.description || 'Sin descripción'}
              </p>

              <div className="flex space-x-2 pt-4 border-t border-white/10">
                <button 
                  onClick={() => handleEdit(rol)}
                  className="flex-1 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm">Editar</span>
                </button>
                <button 
                  onClick={() => handleDelete(rol.id)}
                  className="flex-1 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors flex items-center justify-center space-x-2"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm">Eliminar</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Rol' : 'Nuevo Rol'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Nombre del Rol *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: SUPERVISOR, CONTADOR, etc."
                    disabled={editingId} // No permitir cambiar el nombre al editar
                  />
                  <p className="text-emerald-200/50 text-xs mt-1">
                    Sugerencias: ADMIN, PARTNER, OPERATOR, SUPERVISOR, CONTADOR
                  </p>
                  {formErrors.name && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Describe las responsabilidades de este rol..."
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2"
                  />
                  <label className="text-white/90 text-sm">Rol activo</label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{submitting ? 'Guardando...' : 'Guardar'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Roles;
