import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
    password: '',
    role: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchUsuarios();
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.ROLES.LIST);
      const data = response.data.results || response.data || [];
      setRoles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching roles:', error);
      setRoles([]);
    }
  };

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.USERS.LIST);
      const data = response.data.results || response.data || [];
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching usuarios:', error);
      setUsuarios([]);
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
    if (!formData.username.trim()) errors.username = 'El usuario es requerido';
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es requerido';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es requerido';
    if (!formData.email.trim()) errors.email = 'El email es requerido';
    if (!editingId && !formData.password) errors.password = 'La contraseña es requerida';
    if (formData.password && formData.password.length < 8) {
      errors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const dataToSend = { ...formData };
      // Si estamos editando y no hay password, no lo enviamos
      if (editingId && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (editingId) {
        await api.put(API_ENDPOINTS.USERS.DETAIL(editingId), dataToSend);
      } else {
        await api.post(API_ENDPOINTS.USERS.LIST, dataToSend);
      }
      
      await fetchUsuarios();
      handleCloseModal();
      alert(editingId ? 'Usuario actualizado exitosamente' : 'Usuario creado exitosamente');
    } catch (error) {
      console.error('Error saving usuario:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar el usuario:\n';
        
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
        alert('Error al guardar el usuario. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (usuario) => {
    setEditingId(usuario.id);
    setFormData({
      username: usuario.username || '',
      email: usuario.email || '',
      first_name: usuario.first_name || '',
      last_name: usuario.last_name || '',
      password: '', // No pre-cargar password
      role: usuario.role || '',
      is_active: usuario.is_active !== undefined ? usuario.is_active : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.USERS.DETAIL(id));
      await fetchUsuarios();
      alert('Usuario eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting usuario:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el usuario';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      role: '',
      is_active: true,
    });
    setFormErrors({});
    setShowPassword(false);
  };

  const filteredUsuarios = Array.isArray(usuarios) 
    ? usuarios.filter(usuario =>
        usuario.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        usuario.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Usuarios</h1>
            <p className="text-emerald-200/80">Administra los usuarios del sistema</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Usuario</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por nombre o usuario..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5 border-b border-white/20">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Acciones</th>
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
              ) : filteredUsuarios.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsuarios.map((usuario) => (
                  <tr key={usuario.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{usuario.username}</td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      {usuario.first_name} {usuario.last_name}
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80">{usuario.email || '-'}</td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      {usuario.is_staff ? 'Administrador' : 'Usuario'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        usuario.is_active 
                          ? 'bg-green-500/20 text-green-200' 
                          : 'bg-red-500/20 text-red-200'
                      }`}>
                        {usuario.is_active ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(usuario)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(usuario.id)}
                          className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
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
                    Usuario *
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: jperez"
                    disabled={editingId} // No permitir cambiar username al editar
                  />
                  {formErrors.username && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.username}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Nombres *
                    </label>
                    <input
                      type="text"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Juan"
                    />
                    {formErrors.first_name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.first_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Pérez"
                    />
                    {formErrors.last_name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.last_name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="usuario@email.com"
                  />
                  {formErrors.email && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Contraseña {editingId ? '(dejar vacío para no cambiar)' : '*'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 pr-12 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300/60 hover:text-emerald-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {formErrors.password && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.password}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Rol
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Sin rol asignado</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2"
                  />
                  <label className="text-white/90 text-sm">Usuario activo</label>
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

export default Usuarios;
