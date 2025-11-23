import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, X, Save, AlertTriangle, Package } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Insumos = () => {
  const [insumos, setInsumos] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    category: '',
    species: '',
    variety: '',
    brand: '',
    unit_of_measure: 'kg',
    current_stock: 0,
    minimum_stock: 0,
    maximum_stock: '',
    unit_price: '',
    expiration_date: '',
    description: '',
    notes: '',
    is_active: true,
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchInsumos();
    fetchCategories();
  }, []);

  const fetchInsumos = async () => {
    try {
      setLoading(true);
      // Filtrar por categorías de insumos (PESTICIDE=2, FERTILIZER=3, TOOL=4, OTHER=5)
      const response = await api.get(API_ENDPOINTS.INVENTORY.INPUTS.LIST);
      const data = response.data.results || response.data || [];
      setInsumos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching insumos:', error);
      setInsumos([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/api/inventory/categories/');
      const data = response.data.results || response.data || [];
      // Filtrar solo categorías de insumos (no semillas)
      const insumosCategories = Array.isArray(data) 
        ? data.filter(cat => cat.name !== 'SEED') 
        : [];
      setCategories(insumosCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
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
    if (!formData.category) errors.category = 'La categoría es requerida';
    if (!formData.unit_of_measure) errors.unit_of_measure = 'La unidad de medida es requerida';
    
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
        category: parseInt(formData.category),
        species: formData.species || '',
        variety: formData.variety || '',
        brand: formData.brand || '',
        unit_of_measure: formData.unit_of_measure,
        minimum_stock: parseFloat(formData.minimum_stock) || 0,
        maximum_stock: formData.maximum_stock ? parseFloat(formData.maximum_stock) : null,
        unit_price: formData.unit_price ? parseFloat(formData.unit_price) : null,
        expiration_date: formData.expiration_date || null,
        description: formData.description || '',
        notes: formData.notes || '',
        is_active: formData.is_active,
      };

      if (editingId) {
        await api.put(API_ENDPOINTS.INVENTORY.INPUTS.DETAIL(editingId), dataToSend);
      } else {
        await api.post(API_ENDPOINTS.INVENTORY.ITEMS.LIST, dataToSend);
      }
      
      await fetchInsumos();
      handleCloseModal();
      alert(editingId ? 'Insumo actualizado exitosamente' : 'Insumo creado exitosamente');
    } catch (error) {
      console.error('Error saving insumo:', error);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        let errorMessage = 'Error al guardar el insumo:\n';
        
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
        alert('Error al guardar el insumo. Por favor intente nuevamente.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (insumo) => {
    setEditingId(insumo.id);
    setFormData({
      code: insumo.code || '',
      name: insumo.name || '',
      category: insumo.category || '',
      species: insumo.species || '',
      variety: insumo.variety || '',
      brand: insumo.brand || '',
      unit_of_measure: insumo.unit_of_measure || 'kg',
      current_stock: insumo.current_stock || 0,
      minimum_stock: insumo.minimum_stock || 0,
      maximum_stock: insumo.maximum_stock || '',
      unit_price: insumo.unit_price || '',
      expiration_date: insumo.expiration_date || '',
      description: insumo.description || '',
      notes: insumo.notes || '',
      is_active: insumo.is_active !== undefined ? insumo.is_active : true,
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar este insumo? Esta acción no se puede deshacer.')) return;

    try {
      await api.delete(API_ENDPOINTS.INVENTORY.INPUTS.DETAIL(id));
      await fetchInsumos();
      alert('Insumo eliminado exitosamente');
    } catch (error) {
      console.error('Error deleting insumo:', error);
      const errorMsg = error.response?.data?.detail || 'Error al eliminar el insumo';
      alert(errorMsg);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      code: '',
      name: '',
      category: '',
      species: '',
      variety: '',
      brand: '',
      unit_of_measure: 'kg',
      current_stock: 0,
      minimum_stock: 0,
      maximum_stock: '',
      unit_price: '',
      expiration_date: '',
      description: '',
      notes: '',
      is_active: true,
    });
    setFormErrors({});
  };

  const filteredInsumos = Array.isArray(insumos) 
    ? insumos.filter(insumo =>
        insumo.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insumo.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insumo.brand?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const getStockStatus = (insumo) => {
    if (insumo.current_stock === 0) return { label: 'Sin stock', color: 'bg-red-500/20 text-red-200' };
    if (insumo.current_stock <= insumo.minimum_stock) return { label: 'Stock bajo', color: 'bg-yellow-500/20 text-yellow-200' };
    return { label: 'Stock normal', color: 'bg-green-500/20 text-green-200' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Gestión de Insumos</h1>
            <p className="text-emerald-200/80">Administra el inventario de insumos agrícolas</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Insumo</span>
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o marca..."
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
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Marca</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase tracking-wider">Stock</th>
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
              ) : filteredInsumos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-emerald-200/60">
                    No se encontraron insumos
                  </td>
                </tr>
              ) : (
                filteredInsumos.map((insumo) => {
                  const stockStatus = getStockStatus(insumo);
                  return (
                    <tr key={insumo.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-mono text-sm">{insumo.code}</td>
                      <td className="px-6 py-4 text-white">{insumo.name}</td>
                      <td className="px-6 py-4 text-emerald-200/80">{insumo.category_name || '-'}</td>
                      <td className="px-6 py-4 text-emerald-200/80">{insumo.brand || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {insumo.current_stock <= insumo.minimum_stock && insumo.current_stock > 0 && (
                            <AlertTriangle className="w-4 h-4 text-yellow-400" />
                          )}
                          <span className="text-white">
                            {insumo.current_stock} {insumo.unit_of_measure}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${stockStatus.color}`}>
                          {stockStatus.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEdit(insumo)}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(insumo.id)}
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
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingId ? 'Editar Insumo' : 'Nuevo Insumo'}
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
                      placeholder="INS-001"
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
                      placeholder="Fertilizante NPK"
                    />
                    {formErrors.name && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.name}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Categoría *
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name_display || cat.name}
                        </option>
                      ))}
                    </select>
                    {formErrors.category && (
                      <p className="text-red-300 text-xs mt-1">{formErrors.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Marca
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                      placeholder="Marca del producto"
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
                      <option value="l">Litros (l)</option>
                      <option value="g">Gramos (g)</option>
                      <option value="ml">Mililitros (ml)</option>
                      <option value="unidades">Unidades</option>
                    </select>
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

                  <div>
                    <label className="block text-white/90 text-sm font-medium mb-2">
                      Stock Máximo
                    </label>
                    <input
                      type="number"
                      name="maximum_stock"
                      value={formData.maximum_stock}
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
                      Fecha de Vencimiento
                    </label>
                    <input
                      type="date"
                      name="expiration_date"
                      value={formData.expiration_date}
                      onChange={handleInputChange}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
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
                    rows="2"
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Descripción del insumo..."
                  />
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

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-emerald-500 bg-white/10 border-white/20 rounded focus:ring-emerald-400 focus:ring-2"
                  />
                  <label className="text-white/90 text-sm">Insumo activo</label>
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

export default Insumos;
