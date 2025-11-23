import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Calendar, Users, MapPin } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Campanas = () => {
  const [campanas, setCampanas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [parcelas, setParcelas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    actual_end_date: '',
    target_area: '',
    target_production: '',
    status: 'PLANNING',
    partners: [],
    parcels: [],
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchCampanas();
    fetchSocios();
    fetchParcelas();
  }, []);

  const fetchCampanas = async () => {
    try {
      setLoading(true);
      // Usar una petición directa sin las anotaciones complejas
      const response = await api.get('/api/campaigns/campaigns/');
      let data = response.data;
      
      // Si viene paginado
      if (data.results) {
        data = data.results;
      }
      
      // Asegurar que sea un array
      if (!Array.isArray(data)) {
        data = [];
      }
      
      // Asegurar que cada campaña tenga las propiedades necesarias
      const campanasConDefaults = data.map(c => ({
        id: c.id,
        code: c.code || '',
        name: c.name || '',
        description: c.description || '',
        start_date: c.start_date || '',
        end_date: c.end_date || '',
        actual_end_date: c.actual_end_date || '',
        target_area: c.target_area || 0,
        target_production: c.target_production || 0,
        status: c.status || 'PLANNING',
        status_display: c.status_display || '',
        partners: Array.isArray(c.partners) ? c.partners : [],
        parcels: Array.isArray(c.parcels) ? c.parcels : [],
        partners_count: c.partners_count || (Array.isArray(c.partners) ? c.partners.length : 0),
        parcels_count: c.parcels_count || (Array.isArray(c.parcels) ? c.parcels.length : 0),
        notes: c.notes || ''
      }));
      
      setCampanas(campanasConDefaults);
    } catch (error) {
      console.error('Error fetching campañas:', error);
      console.error('Error details:', error.response?.data);
      setCampanas([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocios = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARTNERS.LIST);
      const data = response.data.results || response.data || [];
      setSocios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching socios:', error);
      setSocios([]);
    }
  };

  const fetchParcelas = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARCELS.LIST);
      const data = response.data.results || response.data || [];
      setParcelas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching parcelas:', error);
      setParcelas([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleMultiSelectChange = (e, field) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setFormData(prev => ({ ...prev, [field]: selected }));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.code.trim()) errors.code = 'El código es requerido';
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.start_date) errors.start_date = 'La fecha de inicio es requerida';
    if (!formData.end_date) errors.end_date = 'La fecha de fin es requerida';
    if (!formData.target_area || parseFloat(formData.target_area) <= 0) {
      errors.target_area = 'El área objetivo debe ser mayor a 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const dataToSend = {
        code: formData.code,
        name: formData.name,
        description: formData.description || '',
        start_date: formData.start_date,
        end_date: formData.end_date,
        actual_end_date: formData.actual_end_date || null,
        target_area: parseFloat(formData.target_area),
        target_production: formData.target_production ? parseFloat(formData.target_production) : null,
        status: formData.status,
        partners: formData.partners,
        parcels: formData.parcels,
        notes: formData.notes || '',
      };

      if (editingId) {
        await api.put(API_ENDPOINTS.CAMPAIGNS.DETAIL(editingId), dataToSend);
      } else {
        await api.post(API_ENDPOINTS.CAMPAIGNS.LIST, dataToSend);
      }
      
      await fetchCampanas();
      handleCloseModal();
      alert(editingId ? 'Campaña actualizada exitosamente' : 'Campaña creada exitosamente');
    } catch (error) {
      console.error('Error saving campaña:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar la campaña:\n';
        
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
        alert('Error al guardar la campaña. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (campana) => {
    setEditingId(campana.id);
    setFormData({
      code: campana.code || '',
      name: campana.name || '',
      description: campana.description || '',
      start_date: campana.start_date || '',
      end_date: campana.end_date || '',
      actual_end_date: campana.actual_end_date || '',
      target_area: campana.target_area || '',
      target_production: campana.target_production || '',
      status: campana.status || 'PLANNING',
      partners: campana.partners || [],
      parcels: campana.parcels || [],
      notes: campana.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta campaña? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.CAMPAIGNS.DETAIL(id));
      await fetchCampanas();
      alert('Campaña eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting campaña:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar la campaña';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      actual_end_date: '',
      target_area: '',
      target_production: '',
      status: 'PLANNING',
      partners: [],
      parcels: [],
      notes: '',
    });
    setFormErrors({});
  };

  const filteredCampanas = Array.isArray(campanas) 
    ? campanas.filter(campana =>
        campana.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campana.code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusColor = (status) => {
    const colors = {
      'PLANNING': 'bg-blue-500/20 text-blue-200',
      'ACTIVE': 'bg-green-500/20 text-green-200',
      'COMPLETED': 'bg-gray-500/20 text-gray-200',
      'CANCELLED': 'bg-red-500/20 text-red-200',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Campañas Agrícolas</h1>
            <p className="text-emerald-200/80">Gestiona las campañas agrícolas</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Campaña</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por nombre o código..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Código</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Fechas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Socios</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Parcelas</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-emerald-200/60">
                    <div className="flex justify-center">
                      <div className="spinner"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredCampanas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron campañas
                  </td>
                </tr>
              ) : (
                filteredCampanas.map((campana) => (
                  <tr key={campana.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-mono text-sm">{campana.code}</td>
                    <td className="px-6 py-4 text-white">{campana.name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span className="text-xs">
                          {new Date(campana.start_date).toLocaleDateString()} - {new Date(campana.end_date).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      <div className="flex items-center space-x-2">
                        <Users className="w-4 h-4" />
                        <span>{campana.partners_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4" />
                        <span>{campana.parcels_count || 0}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(campana.status)}`}>
                        {campana.status_display}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(campana)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(campana.id)}
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
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Campaña' : 'Nueva Campaña'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Código *
                    </label>
                    <input
                      type="text"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="CAMP-2025-01"
                    />
                    {formErrors.code && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.code}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Campaña 2025"
                    />
                    {formErrors.name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Descripción
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Descripción de la campaña..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Fecha de Inicio *
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    {formErrors.start_date && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.start_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Fecha de Fin Estimada *
                    </label>
                    <input
                      type="date"
                      name="end_date"
                      value={formData.end_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    {formErrors.end_date && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.end_date}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Área Objetivo (ha) *
                    </label>
                    <input
                      type="number"
                      name="target_area"
                      value={formData.target_area}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="100"
                    />
                    {formErrors.target_area && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.target_area}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Producción Objetivo (kg)
                    </label>
                    <input
                      type="number"
                      name="target_production"
                      value={formData.target_production}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="5000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="PLANNING">En Planificación</option>
                    <option value="ACTIVE">Activa</option>
                    <option value="COMPLETED">Completada</option>
                    <option value="CANCELLED">Cancelada</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Socios Participantes (mantén Ctrl para seleccionar múltiples)
                  </label>
                  <select
                    multiple
                    value={formData.partners}
                    onChange={(e) => handleMultiSelectChange(e, 'partners')}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[100px]"
                  >
                    {socios.map(socio => (
                      <option key={socio.id} value={socio.id}>
                        {socio.full_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Parcelas Asignadas (mantén Ctrl para seleccionar múltiples)
                  </label>
                  <select
                    multiple
                    value={formData.parcels}
                    onChange={(e) => handleMultiSelectChange(e, 'parcels')}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 min-h-[100px]"
                  >
                    {parcelas.map(parcela => (
                      <option key={parcela.id} value={parcela.id}>
                        {parcela.code} - {parcela.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Notas
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Notas adicionales..."
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

export default Campanas;
