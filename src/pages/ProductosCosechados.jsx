import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Package, TrendingUp } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const ProductosCosechados = () => {
  const [productos, setProductos] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [allParcels, setAllParcels] = useState([]);
  const [filteredParcels, setFilteredParcels] = useState([]);
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    campaign: '',
    parcel: '',
    partner: '',
    product_name: '',
    harvest_date: '',
    quantity: '',
    quality_grade: '',
    moisture_percentage: '',
    temperature: '',
    storage_location: '',
    observations: '',
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchProductos();
    fetchCampaigns();
    fetchParcels();
    fetchPartners();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/production/harvested-products/');
      const data = response.data.results || response.data || [];
      setProductos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCampaigns = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.CAMPAIGNS.LIST);
      let data = response.data.results || response.data || [];
      
      // Si las campañas no tienen el campo parcels con datos, obtener cada una individualmente
      if (Array.isArray(data) && data.length > 0) {
        // Verificar si alguna campaña tiene parcels
        const needsDetailFetch = data.every(c => !c.parcels || c.parcels.length === 0);
        
        if (needsDetailFetch) {
          // Obtener detalles de cada campaña para tener los IDs de parcelas
          const campaignsWithDetails = await Promise.all(
            data.map(async (campaign) => {
              try {
                const detailResponse = await api.get(API_ENDPOINTS.CAMPAIGNS.DETAIL(campaign.id));
                return detailResponse.data;
              } catch (error) {
                console.error(`Error fetching campaign ${campaign.id}:`, error);
                return campaign;
              }
            })
          );
          data = campaignsWithDetails;
        }
      }
      
      console.log('Campañas obtenidas con detalles:', data);
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
      setAllParcels(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching parcels:', error);
      setAllParcels([]);
    }
  };

  const fetchPartners = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.PARTNERS.LIST);
      const data = response.data.results || response.data || [];
      setPartners(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching partners:', error);
      setPartners([]);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }

    // Si cambia la campaña, filtrar las parcelas
    if (name === 'campaign' && value) {
      const selectedCampaign = campaigns.find(c => c.id === parseInt(value));
      console.log('Campaña seleccionada:', selectedCampaign);
      
      if (selectedCampaign) {
        // El campo parcels puede ser un array de IDs o puede estar vacío
        const parcelIds = selectedCampaign.parcels || [];
        console.log('IDs de parcelas en campaña:', parcelIds);
        console.log('Todas las parcelas disponibles:', allParcels);
        
        if (Array.isArray(parcelIds) && parcelIds.length > 0) {
          // Filtrar parcelas que están en la campaña
          const parcelasEnCampana = allParcels.filter(p => 
            parcelIds.includes(p.id)
          );
          console.log('Parcelas filtradas:', parcelasEnCampana);
          setFilteredParcels(parcelasEnCampana);
          
          // Limpiar la parcela seleccionada si ya no está en la campaña
          if (formData.parcel && !parcelIds.includes(parseInt(formData.parcel))) {
            setFormData(prev => ({ ...prev, parcel: '' }));
          }
        } else {
          console.log('No hay parcelas en esta campaña');
          setFilteredParcels([]);
        }
      } else {
        setFilteredParcels([]);
      }
    } else if (name === 'campaign' && !value) {
      // Si se deselecciona la campaña, limpiar parcelas filtradas
      setFilteredParcels([]);
      setFormData(prev => ({ ...prev, parcel: '' }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.campaign) errors.campaign = 'La campaña es requerida';
    if (!formData.parcel) errors.parcel = 'La parcela es requerida';
    if (!formData.partner) errors.partner = 'El socio es requerido';
    if (!formData.product_name.trim()) errors.product_name = 'El nombre del producto es requerido';
    if (!formData.harvest_date) errors.harvest_date = 'La fecha de cosecha es requerida';
    if (!formData.quantity || parseFloat(formData.quantity) <= 0) {
      errors.quantity = 'La cantidad debe ser mayor a 0';
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
        campaign: parseInt(formData.campaign),
        parcel: parseInt(formData.parcel),
        partner: parseInt(formData.partner),
        product_name: formData.product_name,
        harvest_date: formData.harvest_date,
        quantity: parseFloat(formData.quantity),
        quality_grade: formData.quality_grade || '',
        moisture_percentage: formData.moisture_percentage ? parseFloat(formData.moisture_percentage) : null,
        temperature: formData.temperature ? parseFloat(formData.temperature) : null,
        storage_location: formData.storage_location || '',
        observations: formData.observations || '',
      };

      if (editingId) {
        await api.put(`/api/production/harvested-products/${editingId}/`, dataToSend);
      } else {
        await api.post('/api/production/harvested-products/', dataToSend);
      }
      
      await fetchProductos();
      handleCloseModal();
      alert(editingId ? 'Producto actualizado exitosamente' : 'Producto registrado exitosamente');
    } catch (error) {
      console.error('Error saving producto:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar el producto:\n';
        
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
        alert('Error al guardar el producto. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (producto) => {
    setEditingId(producto.id);
    setFormData({
      campaign: producto.campaign || '',
      parcel: producto.parcel || '',
      partner: producto.partner || '',
      product_name: producto.product_name || '',
      harvest_date: producto.harvest_date || '',
      quantity: producto.quantity || '',
      quality_grade: producto.quality_grade || '',
      moisture_percentage: producto.moisture_percentage || '',
      temperature: producto.temperature || '',
      storage_location: producto.storage_location || '',
      observations: producto.observations || '',
    });
    
    // Filtrar parcelas de la campaña al editar
    if (producto.campaign) {
      const selectedCampaign = campaigns.find(c => c.id === producto.campaign);
      if (selectedCampaign && selectedCampaign.parcels) {
        const parcelasEnCampana = allParcels.filter(p => 
          selectedCampaign.parcels.includes(p.id)
        );
        setFilteredParcels(parcelasEnCampana);
      }
    }
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este producto? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(`/api/production/harvested-products/${id}/`);
      await fetchProductos();
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting producto:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el producto';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      campaign: '',
      parcel: '',
      partner: '',
      product_name: '',
      harvest_date: '',
      quantity: '',
      quality_grade: '',
      moisture_percentage: '',
      temperature: '',
      storage_location: '',
      observations: '',
    });
    setFormErrors({});
    setFilteredParcels([]);
  };

  const filteredProductos = Array.isArray(productos) 
    ? productos.filter(producto =>
        producto.product_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.parcel_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        producto.partner_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Productos Cosechados</h1>
            <p className="text-emerald-200/80">Gestiona los productos cosechados</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Registrar Cosecha</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por producto, parcela o socio..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Producto</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Parcela</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Socio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Cantidad (kg)</th>
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
              ) : filteredProductos.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron productos cosechados
                  </td>
                </tr>
              ) : (
                filteredProductos.map((producto) => (
                  <tr key={producto.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-emerald-400" />
                        <span className="text-white">{producto.product_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-emerald-200/80">{producto.parcel_code}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{producto.partner_name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">
                      {new Date(producto.harvest_date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                        <span className="text-white font-semibold">{producto.quantity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(producto)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDelete(producto.id)}
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
                  {editingId ? 'Editar Producto' : 'Registrar Cosecha'}
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

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Parcela * {formData.campaign && filteredParcels.length > 0 && (
                        <span className="text-emerald-300 text-xs">
                          ({filteredParcels.length} parcelas en esta campaña)
                        </span>
                      )}
                    </label>
                    <select
                      name="parcel"
                      value={formData.parcel}
                      onChange={handleInputChange}
                      disabled={!formData.campaign}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">
                        {!formData.campaign 
                          ? 'Primero selecciona una campaña' 
                          : filteredParcels.length === 0 
                            ? 'No hay parcelas en esta campaña'
                            : 'Seleccionar parcela'}
                      </option>
                      {filteredParcels.map(parcel => (
                        <option key={parcel.id} value={parcel.id}>
                          {parcel.code} - {parcel.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.parcel && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.parcel}</p>
                    )}
                    {formData.campaign && filteredParcels.length === 0 && (
                      <p className="text-yellow-300 text-xs mt-1">
                        Esta campaña no tiene parcelas asignadas. Asigna parcelas en el módulo de Campañas.
                      </p>
                    )}
                  </div>
                </div>

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
                    {partners.map(partner => (
                      <option key={partner.id} value={partner.id}>
                        {partner.full_name}
                      </option>
                    ))}
                  </select>
                  {formErrors.partner && (
                    <p className="text-red-300 text-xs mt-1">{formErrors.partner}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Maíz, Papa, etc."
                    />
                    {formErrors.product_name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.product_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Fecha de Cosecha *
                    </label>
                    <input
                      type="date"
                      name="harvest_date"
                      value={formData.harvest_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                    {formErrors.harvest_date && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.harvest_date}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Cantidad (kg) *
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
                    {formErrors.quantity && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.quantity}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Grado de Calidad
                    </label>
                    <input
                      type="text"
                      name="quality_grade"
                      value={formData.quality_grade}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="A, B, C"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Humedad (%)
                    </label>
                    <input
                      type="number"
                      name="moisture_percentage"
                      value={formData.moisture_percentage}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Temperatura (°C)
                    </label>
                    <input
                      type="number"
                      name="temperature"
                      value={formData.temperature}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Ubicación de Almacenamiento
                    </label>
                    <input
                      type="text"
                      name="storage_location"
                      value={formData.storage_location}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Almacén 1, Silo 2, etc."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Observaciones
                  </label>
                  <textarea
                    name="observations"
                    value={formData.observations}
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

export default ProductosCosechados;
