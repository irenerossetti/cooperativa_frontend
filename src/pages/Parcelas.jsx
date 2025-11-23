import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Parcelas = () => {
  const [parcelas, setParcelas] = useState([]);
  const [socios, setSocios] = useState([]);
  const [soilTypes, setSoilTypes] = useState([]);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    surface: '',
    location: '',
    latitude: '',
    longitude: '',
    partner: '',
    soil_type: '',
    current_crop: '',
    status: 'ACTIVE',
    notes: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchParcelas();
    fetchSocios();
    fetchSoilTypes();
    fetchCrops();
  }, []);

  const fetchParcelas = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.PARCELS.LIST);
      const data = response.data.results || response.data || [];
      setParcelas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching parcelas:', error);
      setParcelas([]);
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

  const fetchSoilTypes = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARCELS.SOIL_TYPES);
      const data = response.data.results || response.data || [];
      setSoilTypes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching soil types:', error);
      setSoilTypes([]);
    }
  };

  const fetchCrops = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARCELS.CROPS);
      const data = response.data.results || response.data || [];
      setCrops(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching crops:', error);
      setCrops([]);
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
    if (!formData.code.trim()) errors.code = 'El código es requerido';
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.surface || parseFloat(formData.surface) <= 0) errors.surface = 'La superficie debe ser mayor a 0';
    if (!formData.location.trim()) errors.location = 'La ubicación es requerida';
    if (!formData.partner) errors.partner = 'El socio es requerido';
    if (!formData.soil_type) errors.soil_type = 'El tipo de suelo es requerido';
    
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
        surface: parseFloat(formData.surface),
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        partner: parseInt(formData.partner),
        soil_type: parseInt(formData.soil_type),
        current_crop: formData.current_crop ? parseInt(formData.current_crop) : null,
        status: formData.status,
        notes: formData.notes,
      };

      if (editingId) {
        await api.put(API_ENDPOINTS.PARCELS.DETAIL(editingId), dataToSend);
      } else {
        await api.post(API_ENDPOINTS.PARCELS.LIST, dataToSend);
      }
      
      await fetchParcelas();
      handleCloseModal();
      alert(editingId ? 'Parcela actualizada exitosamente' : 'Parcela creada exitosamente');
    } catch (error) {
      console.error('Error saving parcela:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar la parcela:\n';
        
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
        alert('Error al guardar la parcela. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (parcela) => {
    setEditingId(parcela.id);
    setFormData({
      code: parcela.code || '',
      name: parcela.name || '',
      surface: parcela.surface || '',
      location: parcela.location || '',
      latitude: parcela.latitude || '',
      longitude: parcela.longitude || '',
      partner: parcela.partner || '',
      soil_type: parcela.soil_type || '',
      current_crop: parcela.current_crop || '',
      status: parcela.status || 'ACTIVE',
      notes: parcela.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta parcela? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.PARCELS.DETAIL(id));
      await fetchParcelas();
      alert('Parcela eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting parcela:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar la parcela';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      surface: '',
      location: '',
      latitude: '',
      longitude: '',
      partner: '',
      soil_type: '',
      current_crop: '',
      status: 'ACTIVE',
      notes: '',
    });
    setFormErrors({});
  };

  const filteredParcelas = Array.isArray(parcelas) 
    ? parcelas.filter(parcela =>
        parcela.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcela.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcela.location?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Parcelas</h1>
            <p className="text-emerald-200/80">Administra las parcelas de la cooperativa</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Parcela</span>
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Área (ha)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Socio</th>
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
              ) : filteredParcelas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron parcelas
                  </td>
                </tr>
              ) : (
                filteredParcelas.map((parcela) => (
                  <tr key={parcela.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 text-white font-mono">{parcela.code}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{parcela.name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{parcela.surface}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{parcela.partner_name || '-'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        parcela.status === 'ACTIVE' 
                          ? 'bg-green-500/20 text-green-200' 
                          : 'bg-red-500/20 text-red-200'
                      }`}>
                        {parcela.status === 'ACTIVE' ? 'Activa' : 'Inactiva'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(parcela)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(parcela.id)}
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
                  {editingId ? 'Editar Parcela' : 'Nueva Parcela'}
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
                      placeholder="PAR-001"
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
                      placeholder="Parcela Norte"
                    />
                    {formErrors.name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Socio *
                    </label>
                    <select
                      name="partner"
                      value={formData.partner}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Seleccionar socio</option>
                      {socios.map(socio => (
                        <option key={socio.id} value={socio.id}>
                          {socio.full_name}
                        </option>
                      ))}
                    </select>
                    {formErrors.partner && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.partner}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Superficie (ha) *
                    </label>
                    <input
                      type="number"
                      name="surface"
                      value={formData.surface}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="10.5"
                    />
                    {formErrors.surface && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.surface}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Ubicación *
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Zona Norte, Comunidad..."
                  />
                  {formErrors.location && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.location}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Latitud
                    </label>
                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      step="0.0000001"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="-17.3935"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Longitud
                    </label>
                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      step="0.0000001"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="-66.1570"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Tipo de Suelo *
                    </label>
                    <select
                      name="soil_type"
                      value={formData.soil_type}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Seleccionar tipo</option>
                      {soilTypes.map(type => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.soil_type && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.soil_type}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Cultivo Actual
                    </label>
                    <select
                      name="current_crop"
                      value={formData.current_crop}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Sin cultivo</option>
                      {crops.map(crop => (
                        <option key={crop.id} value={crop.id}>
                          {crop.name}
                        </option>
                      ))}
                    </select>
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
                    <option value="ACTIVE">Activa</option>
                    <option value="INACTIVE">Inactiva</option>
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
                    rows="3"
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

export default Parcelas;
