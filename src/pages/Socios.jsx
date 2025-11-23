import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save } from 'lucide-react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Socios = () => {
  const [socios, setSocios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    ci: '',
    phone: '',
    address: '',
    email: '',
    community: '',
  });
  const [communities, setCommunities] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSocios();
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.COMMUNITIES.LIST);
      const data = response.data.results || response.data || [];
      setCommunities(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching communities:', error);
      setCommunities([]);
    }
  };

  const fetchSocios = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.PARTNERS.LIST);
      const data = response.data.results || response.data || [];
      setSocios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching socios:', error);
      setSocios([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.first_name.trim()) errors.first_name = 'El nombre es requerido';
    if (!formData.last_name.trim()) errors.last_name = 'El apellido es requerido';
    if (!formData.ci.trim()) errors.ci = 'El CI es requerido';
    if (!formData.phone.trim()) errors.phone = 'El teléfono es requerido';
    if (!formData.community) errors.community = 'La comunidad es requerida';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      if (editingId) {
        // Actualizar
        await api.put(API_ENDPOINTS.PARTNERS.DETAIL(editingId), formData);
      } else {
        // Crear
        await api.post(API_ENDPOINTS.PARTNERS.LIST, formData);
      }
      
      await fetchSocios();
      handleCloseModal();
    } catch (error) {
      console.error('Error saving socio:', error);
      console.error('Error response:', error.response?.data);
      
      // Mostrar errores específicos del backend
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar el socio:\n';
        
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
        alert('Error al guardar el socio. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (socio) => {
    setEditingId(socio.id);
    setFormData({
      first_name: socio.first_name || '',
      last_name: socio.last_name || '',
      ci: socio.ci || '',
      phone: socio.phone || '',
      address: socio.address || '',
      email: socio.email || '',
      community: socio.community || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este socio? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.PARTNERS.DETAIL(id));
      await fetchSocios();
      alert('Socio eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting socio:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el socio';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      first_name: '',
      last_name: '',
      ci: '',
      phone: '',
      address: '',
      email: '',
      community: '',
    });
    setFormErrors({});
  };

  const filteredSocios = Array.isArray(socios) 
    ? socios.filter(socio =>
        socio.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        socio.ci?.includes(searchTerm)
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Socios</h1>
            <p className="text-emerald-200/80">Administra los socios de la cooperativa</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Socio</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por nombre o CI..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">CI</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-emerald-200/60">
                    <div className="flex justify-center">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredSocios.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron socios
                  </td>
                </tr>
              ) : (
                filteredSocios.map((socio) => (
                  <tr key={socio.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{socio.first_name} {socio.last_name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{socio.ci}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{socio.phone || '-'}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{socio.email || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(socio)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(socio.id)}
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
                  {editingId ? 'Editar Socio' : 'Nuevo Socio'}
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
                    Nombres *
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: Juan"
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
                    placeholder="Ej: Pérez"
                  />
                  {formErrors.last_name && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.last_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    CI *
                  </label>
                  <input
                    type="text"
                    name="ci"
                    value={formData.ci}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: 1234567"
                  />
                  {formErrors.ci && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.ci}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Teléfono *
                  </label>
                  <PhoneInput
                    international
                    defaultCountry="BO"
                    value={formData.phone}
                    onChange={(value) => setFormData(prev => ({ ...prev, phone: value || '' }))}
                    className="phone-input-custom"
                    placeholder="Ingrese número de teléfono"
                  />
                  {formErrors.phone && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Comunidad *
                  </label>
                  <select
                    name="community"
                    value={formData.community}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Seleccione una comunidad</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.community && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.community}</p>
                  )}
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: socio@email.com"
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Dirección
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Dirección completa"
                  />
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

export default Socios;
