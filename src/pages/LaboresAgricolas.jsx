import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, CheckCircle, Calendar } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const LaboresAgricolas = () => {
  const [labores, setLabores] = useState([]);
  const [activityTypes, setActivityTypes] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [parcels, setParcels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    activity_type: '',
    campaign: '',
    parcel: '',
    scheduled_date: '',
    actual_date: '',
    description: '',
    quantity: '',
    area_covered: '',
    workers_count: 1,
    hours_worked: '',
    status: 'PENDING',
    observations: '',
    weather_conditions: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchLabores();
    fetchActivityTypes();
    fetchCampaigns();
    fetchParcels();
  }, []);

  const fetchLabores = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.FARM_ACTIVITIES.LIST);
      const data = response.data.results || response.data || [];
      setLabores(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching labores:', error);
      setLabores([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchActivityTypes = async () => {
    try {
      const response = await api.get('/api/farm-activities/activity-types/');
      const data = response.data.results || response.data || [];
      setActivityTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching activity types:', error);
      setActivityTypes([]);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CAMPAIGNS.LIST);
      const data = response.data.results || response.data || [];
      setCampaigns(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      setCampaigns([]);
    }
  };

  const fetchParcels = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARCELS.LIST);
      const data = response.data.results || response.data || [];
      setParcels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching parcels:', error);
      setParcels([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.activity_type) errors.activity_type = 'El tipo de labor es requerido';
    if (!formData.campaign) errors.campaign = 'La campaña es requerida';
    if (!formData.parcel) errors.parcel = 'La parcela es requerida';
    if (!formData.scheduled_date) errors.scheduled_date = 'La fecha programada es requerida';
    if (!formData.description.trim()) errors.description = 'La descripción es requerida';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const dataToSend = {
        activity_type: parseInt(formData.activity_type),
        campaign: parseInt(formData.campaign),
        parcel: parseInt(formData.parcel),
        scheduled_date: formData.scheduled_date,
        actual_date: formData.actual_date || null,
        description: formData.description,
        quantity: formData.quantity ? parseFloat(formData.quantity) : null,
        area_covered: formData.area_covered ? parseFloat(formData.area_covered) : null,
        workers_count: parseInt(formData.workers_count) || 1,
        hours_worked: formData.hours_worked ? parseFloat(formData.hours_worked) : null,
        status: formData.status,
        observations: formData.observations || '',
        weather_conditions: formData.weather_conditions || '',
      };

      if (editingId) {
        await api.put(API_ENDPOINTS.FARM_ACTIVITIES.DETAIL(editingId), dataToSend);
      } else {
        await api.post(API_ENDPOINTS.FARM_ACTIVITIES.LIST, dataToSend);
      }
      
      await fetchLabores();
      handleCloseModal();
      alert(editingId ? 'Labor actualizada exitosamente' : 'Labor creada exitosamente');
    } catch (error) {
      console.error('Error saving labor:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar la labor:\n';
        
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
        alert('Error al guardar la labor. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (labor) => {
    setEditingId(labor.id);
    setFormData({
      activity_type: labor.activity_type || '',
      campaign: labor.campaign || '',
      parcel: labor.parcel || '',
      scheduled_date: labor.scheduled_date || '',
      actual_date: labor.actual_date || '',
      description: labor.description || '',
      quantity: labor.quantity || '',
      area_covered: labor.area_covered || '',
      workers_count: labor.workers_count || 1,
      hours_worked: labor.hours_worked || '',
      status: labor.status || 'PENDING',
      observations: labor.observations || '',
      weather_conditions: labor.weather_conditions || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta labor? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.FARM_ACTIVITIES.DETAIL(id));
      await fetchLabores();
      alert('Labor eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting labor:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar la labor';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      activity_type: '',
      campaign: '',
      parcel: '',
      scheduled_date: '',
      actual_date: '',
      description: '',
      quantity: '',
      area_covered: '',
      workers_count: 1,
      hours_worked: '',
      status: 'PENDING',
      observations: '',
      weather_conditions: '',
    });
    setFormErrors({});
  };

  const filteredLabores = Array.isArray(labores) 
    ? labores.filter(labor =>
        labor.activity_type_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        labor.parcel_code?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStatusColor = (status) => {
    const colors = {
      'PENDING': 'bg-yellow-500/20 text-yellow-200',
      'IN_PROGRESS': 'bg-blue-500/20 text-blue-200',
      'COMPLETED': 'bg-green-500/20 text-green-200',
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
            <h1 className="text-2xl font-bold text-white mb-2">Labores Agrícolas</h1>
            <p className="text-emerald-200/80">Registra y gestiona las labores agrícolas</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Labor</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por tipo de labor o parcela..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Tipo de Labor</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Parcela</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Fecha Programada</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Estado</th>
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
              ) : filteredLabores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron labores agrícolas
                  </td>
                </tr>
              ) : (
                filteredLabores.map((labor) => (
                  <tr key={labor.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white">{labor.activity_type_name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{labor.parcel_code}</td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(labor.scheduled_date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(labor.status)}`}>
                        {labor.status_display}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(labor)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(labor.id)}
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
                  {editingId ? 'Editar Labor' : 'Nueva Labor'}
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
                      Tipo de Labor *
                    </label>
                    <select
                      name="activity_type"
                      value={formData.activity_type}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Seleccionar tipo</option>
                      {activityTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name_display || type.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.activity_type && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.activity_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Campaña *
                    </label>
                    <select
                      name="campaign"
                      value={formData.campaign}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Seleccionar campaña</option>
                      {campaigns.map(campaign => (
                        <option key={campaign.id} value={campaign.id}>
                          {campaign.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.campaign && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.campaign}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Parcela *
                  </label>
                  <select
                    name="parcel"
                    value={formData.parcel}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Seleccionar parcela</option>
                    {parcels.map(parcel => (
                      <option key={parcel.id} value={parcel.id}>
                        {parcel.code} - {parcel.name}
                      </option>
                    ))}
                  </select>
                  {formErrors.parcel && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.parcel}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Fecha Programada *
                    </label>
                    <input
                      type="date"
                      name="scheduled_date"
                      value={formData.scheduled_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    {formErrors.scheduled_date && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.scheduled_date}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Fecha Real
                    </label>
                    <input
                      type="date"
                      name="actual_date"
                      value={formData.actual_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Descripción *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Descripción de la labor..."
                  />
                  {formErrors.description && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Cantidad (kg/l)
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Área Cubierta (ha)
                    </label>
                    <input
                      type="number"
                      name="area_covered"
                      value={formData.area_covered}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Trabajadores
                    </label>
                    <input
                      type="number"
                      name="workers_count"
                      value={formData.workers_count}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="1"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Horas Trabajadas
                    </label>
                    <input
                      type="number"
                      name="hours_worked"
                      value={formData.hours_worked}
                      onChange={handleInputChange}
                      step="0.5"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
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
                      <option value="PENDING">Pendiente</option>
                      <option value="IN_PROGRESS">En Progreso</option>
                      <option value="COMPLETED">Completada</option>
                      <option value="CANCELLED">Cancelada</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Condiciones Climáticas
                  </label>
                  <input
                    type="text"
                    name="weather_conditions"
                    value={formData.weather_conditions}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Soleado, nublado, etc."
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Observaciones
                  </label>
                  <textarea
                    name="observations"
                    value={formData.observations}
                    onChange={handleInputChange}
                    rows="2"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Observaciones adicionales..."
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

export default LaboresAgricolas;
