import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, Sprout, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Semillas = () => {
  const [semillas, setSemillas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    species: '',
    variety: '',
    unit_of_measure: 'kg',
    current_stock: 0,
    minimum_stock: 0,
    unit_price: 0,
    germination_percentage: '',
    description: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSemillas();
  }, []);

  const fetchSemillas = async () => {
    try {
      setLoading(true);
      // Usar el endpoint de items con filtro de categoría SEED
      const response = await api.get(API_ENDPOINTS.INVENTORY.SEEDS.LIST);
      const data = response.data.results || response.data || [];
      setSemillas(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching semillas:', error);
      setSemillas([]);
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
    if (!formData.code.trim()) errors.code = 'El código es requerido';
    if (!formData.name.trim()) errors.name = 'El nombre es requerido';
    if (!formData.unit_of_measure) errors.unit_of_measure = 'La unidad de medida es requerida';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      // Preparar datos para enviar
      const dataToSend = {
        ...formData,
        category: 1, // ID de categoría SEED
        current_stock: parseFloat(formData.current_stock) || 0,
        minimum_stock: parseFloat(formData.minimum_stock) || 0,
        unit_price: parseFloat(formData.unit_price) || 0,
        germination_percentage: formData.germination_percentage ? parseFloat(formData.germination_percentage) : null,
      };

      // Eliminar campos vacíos opcionales
      if (!dataToSend.species) delete dataToSend.species;
      if (!dataToSend.variety) delete dataToSend.variety;
      if (!dataToSend.description) delete dataToSend.description;
      if (!dataToSend.germination_percentage) delete dataToSend.germination_percentage;

      if (editingId) {
        await api.put(API_ENDPOINTS.INVENTORY.SEEDS.DETAIL(editingId), dataToSend);
      } else {
        // Para crear, usar el endpoint base sin filtros
        await api.post(API_ENDPOINTS.INVENTORY.ITEMS.LIST, dataToSend);
      }
      
      await fetchSemillas();
      handleCloseModal();
      alert(editingId ? 'Semilla actualizada exitosamente' : 'Semilla creada exitosamente');
    } catch (error) {
      console.error('Error saving semilla:', error);
      console.error('Error response:', error.response?.data);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar la semilla:\n';
        
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
        alert('Error al guardar la semilla. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (semilla) => {
    setEditingId(semilla.id);
    setFormData({
      code: semilla.code || '',
      name: semilla.name || '',
      species: semilla.species || '',
      variety: semilla.variety || '',
      unit_of_measure: semilla.unit_of_measure || 'kg',
      current_stock: semilla.current_stock || 0,
      minimum_stock: semilla.minimum_stock || 0,
      unit_price: semilla.unit_price || 0,
      germination_percentage: semilla.germination_percentage || '',
      description: semilla.description || '',
      is_active: semilla.is_active !== undefined ? semilla.is_active : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta semilla? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.INVENTORY.SEEDS.DETAIL(id));
      await fetchSemillas();
      alert('Semilla eliminada exitosamente');
    } catch (error) {
      console.error('Error deleting semilla:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar la semilla';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      species: '',
      variety: '',
      unit_of_measure: 'kg',
      current_stock: 0,
      minimum_stock: 0,
      unit_price: 0,
      germination_percentage: '',
      description: '',
      is_active: true,
    });
    setFormErrors({});
  };

  const filteredSemillas = Array.isArray(semillas) 
    ? semillas.filter(semilla =>
        semilla.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semilla.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        semilla.variety?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStockStatus = (semilla) => {
    if (semilla.current_stock === 0) return { label: 'Sin stock', color: 'bg-red-500/20 text-red-200' };
    if (semilla.current_stock <= semilla.minimum_stock) return { label: 'Stock bajo', color: 'bg-yellow-500/20 text-yellow-200' };
    return { label: 'Stock normal', color: 'bg-green-500/20 text-green-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Semillas</h1>
            <p className="text-emerald-200/80">Administra el inventario de semillas</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Semilla</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o variedad..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Variedad</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Precio/Unidad</th>
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
              ) : filteredSemillas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron semillas
                  </td>
                </tr>
              ) : (
                filteredSemillas.map((semilla) => {
                  const stockStatus = getStockStatus(semilla);
                  return (
                    <tr key={semilla.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-mono text-sm">{semilla.code}</td>
                      <td className="px-6 py-4 text-white">{semilla.name}</td>
                      <td className="px-6 py-4 text-emerald-200/80">{semilla.variety || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {semilla.current_stock <= semilla.minimum_stock && semilla.current_stock > 0 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="text-white">
                            {semilla.current_stock} {semilla.unit_of_measure}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-emerald-200/80">
                        Bs. {parseFloat(semilla.unit_price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(semilla)}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(semilla.id)}
                            className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Semilla' : 'Nueva Semilla'}
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
                      placeholder="SEM-001"
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
                      placeholder="Maíz"
                    />
                    {formErrors.name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Especie
                    </label>
                    <input
                      type="text"
                      name="species"
                      value={formData.species}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Zea mays"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Variedad
                    </label>
                    <input
                      type="text"
                      name="variety"
                      value={formData.variety}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Amarillo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Unidad *
                    </label>
                    <select
                      name="unit_of_measure"
                      value={formData.unit_of_measure}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="kg">Kilogramos (kg)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="lb">Libras (lb)</option>
                      <option value="unidades">Unidades</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Stock Actual
                    </label>
                    <input
                      type="number"
                      name="current_stock"
                      value={formData.current_stock}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Stock Mínimo
                    </label>
                    <input
                      type="number"
                      name="minimum_stock"
                      value={formData.minimum_stock}
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
                      Precio Unitario (Bs.)
                    </label>
                    <input
                      type="number"
                      name="unit_price"
                      value={formData.unit_price}
                      onChange={handleInputChange}
                      step="0.01"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      % Germinación
                    </label>
                    <input
                      type="number"
                      name="germination_percentage"
                      value={formData.germination_percentage}
                      onChange={handleInputChange}
                      step="0.01"
                      max="100"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="95.00"
                    />
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
                    rows="3"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Descripción de la semilla..."
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
                  <label className="text-white/90 text-sm">Semilla activa</label>
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

export default Semillas;
