import React, { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Search, Filter, Eye, Edit, Trash2, Check, X, Package, Save, DollarSign, CreditCard } from 'lucide-react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

const Ventas = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, [statusFilter]);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const params = statusFilter ? `?status=${statusFilter}` : '';
      const response = await api.get(API_ENDPOINTS.SALES.ORDERS.LIST + params);
      const data = response.data.results || response.data || [];
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setModalMode('create');
    setSelectedPedido(null);
    setShowModal(true);
  };

  const handleEdit = (pedido) => {
    setModalMode('edit');
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const handleView = (pedido) => {
    setModalMode('view');
    setSelectedPedido(pedido);
    setShowModal(true);
  };

  const handleRegisterPayment = (pedido) => {
    setSelectedOrderForPayment(pedido);
    setShowPaymentModal(true);
  };

  const handleChangeStatus = async (pedidoId, newStatus) => {
    if (!confirm(`¿Confirmar cambio de estado a ${getStatusLabel(newStatus)}?`)) return;
    
    try {
      await api.patch(API_ENDPOINTS.SALES.ORDERS.DETAIL(pedidoId), { status: newStatus });
      alert('Estado actualizado correctamente');
      fetchPedidos();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Error al actualizar el estado: ' + (error.response?.data?.detail || error.message));
    }
  };

  const handleDelete = async (pedidoId) => {
    if (!confirm('¿Está seguro de eliminar este pedido?')) return;
    
    try {
      await api.delete(API_ENDPOINTS.SALES.ORDERS.DETAIL(pedidoId));
      alert('Pedido eliminado correctamente');
      fetchPedidos();
    } catch (error) {
      console.error('Error deleting pedido:', error);
      alert('Error al eliminar el pedido');
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      'DRAFT': 'Borrador',
      'CONFIRMED': 'Confirmado',
      'PAID': 'Pagado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      'DRAFT': 'bg-gray-500/20 text-gray-200',
      'CONFIRMED': 'bg-blue-500/20 text-blue-200',
      'PAID': 'bg-green-500/20 text-green-200',
      'SHIPPED': 'bg-purple-500/20 text-purple-200',
      'DELIVERED': 'bg-emerald-500/20 text-emerald-200',
      'CANCELLED': 'bg-red-500/20 text-red-200'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-200';
  };

  const filteredPedidos = pedidos.filter(p =>
    p.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ShoppingCart className="w-6 h-6 text-emerald-400" />
            <div>
              <h1 className="text-2xl font-bold text-white">Gestión de Ventas / Pedidos</h1>
              <p className="text-emerald-200/80">CU17: Gestionar ventas y pedidos de clientes</p>
            </div>
          </div>
          <button
            onClick={handleCreate}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Pedido</span>
          </button>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
            <input
              type="text"
              placeholder="Buscar por número o cliente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white"
            >
              <option value="">Todos los estados</option>
              <option value="DRAFT">Borrador</option>
              <option value="CONFIRMED">Confirmado</option>
              <option value="PAID">Pagado</option>
              <option value="SHIPPED">Enviado</option>
              <option value="DELIVERED">Entregado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredPedidos.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
          <ShoppingCart className="w-16 h-16 text-emerald-300/50 mx-auto mb-4" />
          <p className="text-emerald-200/60">No hay pedidos registrados</p>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Nro. Pedido</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredPedidos.map((pedido) => (
                  <tr key={pedido.id} className="hover:bg-white/5">
                    <td className="px-6 py-4 text-white">{pedido.order_number}</td>
                    <td className="px-6 py-4 text-white">{pedido.customer_name}</td>
                    <td className="px-6 py-4 text-emerald-200/80">{new Date(pedido.order_date).toLocaleDateString('es-BO')}</td>
                    <td className="px-6 py-4 text-white font-semibold">Bs. {pedido.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(pedido.status)}`}>
                        {getStatusLabel(pedido.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleView(pedido)}
                          className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {pedido.status === 'DRAFT' && (
                          <button
                            onClick={() => handleEdit(pedido)}
                            className="p-2 hover:bg-white/10 rounded-lg text-yellow-400"
                            title="Editar"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {pedido.status === 'DRAFT' && (
                          <button
                            onClick={() => handleChangeStatus(pedido.id, 'CONFIRMED')}
                            className="p-2 hover:bg-white/10 rounded-lg text-green-400"
                            title="Confirmar"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        )}
                        {(pedido.status === 'CONFIRMED' || pedido.status === 'SHIPPED') && (
                          <button
                            onClick={() => handleRegisterPayment(pedido)}
                            className="p-2 hover:bg-white/10 rounded-lg text-blue-400"
                            title="Registrar pago"
                          >
                            <DollarSign className="w-4 h-4" />
                          </button>
                        )}
                        {pedido.status === 'CONFIRMED' && (
                          <button
                            onClick={() => handleChangeStatus(pedido.id, 'DELIVERED')}
                            className="p-2 hover:bg-white/10 rounded-lg text-emerald-400"
                            title="Marcar como entregado"
                          >
                            <Package className="w-4 h-4" />
                          </button>
                        )}
                        {(pedido.status === 'DRAFT' || pedido.status === 'CANCELLED') && (
                          <button
                            onClick={() => handleDelete(pedido.id)}
                            className="p-2 hover:bg-white/10 rounded-lg text-red-400"
                            title="Eliminar"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <PedidoModal
          mode={modalMode}
          pedido={selectedPedido}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            fetchPedidos();
          }}
        />
      )}

      {showPaymentModal && (
        <PaymentModal
          order={selectedOrderForPayment}
          onClose={() => {
            setShowPaymentModal(false);
            setSelectedOrderForPayment(null);
          }}
          onSuccess={() => {
            setShowPaymentModal(false);
            setSelectedOrderForPayment(null);
            fetchPedidos();
          }}
        />
      )}
    </div>
  );
};

const PaymentModal = ({ order, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    payment_method: '',
    amount: order?.total || 0,
    payment_date: new Date().toISOString().split('T')[0],
    reference_number: '',
    notes: ''
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(false);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPaymentMethods();
    fetchOrderPayments();
  }, []);

  const fetchPaymentMethods = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.SALES.PAYMENT_METHODS.LIST);
      const data = response.data.results || response.data || [];
      setPaymentMethods(Array.isArray(data) ? data.filter(pm => pm.is_active) : []);
    } catch (error) {
      console.error('Error fetching payment methods:', error);
    }
  };

  const fetchOrderPayments = async () => {
    try {
      const response = await api.get(`${API_ENDPOINTS.SALES.PAYMENTS.LIST}?order_id=${order.id}`);
      const data = response.data.results || response.data || [];
      setPayments(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    }
  };

  const getTotalPaid = () => {
    return payments.reduce((sum, p) => sum + parseFloat(p.amount || 0), 0);
  };

  const getRemainingBalance = () => {
    return parseFloat(order.total) - getTotalPaid();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.payment_method) {
      alert('El método de pago es obligatorio');
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      alert('El monto debe ser mayor a 0');
      return;
    }

    const remainingBalance = getRemainingBalance();
    if (parseFloat(formData.amount) > remainingBalance) {
      alert(`El monto no puede ser mayor al saldo pendiente (Bs. ${remainingBalance.toFixed(2)})`);
      return;
    }

    try {
      setLoading(true);

      const paymentData = {
        order: order.id,
        payment_method: formData.payment_method,
        amount: parseFloat(formData.amount),
        payment_date: formData.payment_date,
        reference_number: formData.reference_number,
        notes: formData.notes,
        status: 'COMPLETED'
      };

      await api.post(API_ENDPOINTS.SALES.PAYMENTS.LIST, paymentData);

      // Si el pago completa el total, actualizar estado del pedido
      const newTotalPaid = getTotalPaid() + parseFloat(formData.amount);
      if (newTotalPaid >= parseFloat(order.total)) {
        await api.patch(API_ENDPOINTS.SALES.ORDERS.DETAIL(order.id), { status: 'PAID' });
      }

      alert('Pago registrado correctamente');
      onSuccess();
    } catch (error) {
      console.error('Error registering payment:', error);
      alert('Error al registrar el pago: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(pm => pm.id === parseInt(formData.payment_method));
  const remainingBalance = getRemainingBalance();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-white">Registrar Pago</h2>
              <p className="text-white/70 text-sm mt-1">Pedido: {order.order_number}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Resumen del pedido */}
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Resumen del Pedido</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/60">Cliente</p>
                <p className="text-white font-medium">{order.customer_name}</p>
              </div>
              <div>
                <p className="text-white/60">Total del Pedido</p>
                <p className="text-white font-bold">Bs. {parseFloat(order.total).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60">Total Pagado</p>
                <p className="text-emerald-300 font-medium">Bs. {getTotalPaid().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60">Saldo Pendiente</p>
                <p className="text-yellow-300 font-bold">Bs. {remainingBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

          {/* Historial de pagos */}
          {payments.length > 0 && (
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Historial de Pagos</h3>
              <div className="space-y-2">
                {payments.map((payment, index) => (
                  <div key={index} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded">
                    <div>
                      <p className="text-white">{payment.payment_method_name}</p>
                      <p className="text-white/60 text-xs">{new Date(payment.payment_date).toLocaleDateString('es-BO')}</p>
                    </div>
                    <p className="text-emerald-300 font-semibold">Bs. {parseFloat(payment.amount).toFixed(2)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Formulario de pago */}
          {remainingBalance > 0 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Método de Pago *</label>
                  <select
                    value={formData.payment_method}
                    onChange={(e) => setFormData({...formData, payment_method: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  >
                    <option value="">Seleccionar método</option>
                    {paymentMethods.map(pm => (
                      <option key={pm.id} value={pm.id}>{pm.name_display}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Monto (Bs) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    max={remainingBalance}
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                  <p className="text-white/60 text-xs mt-1">Máximo: Bs. {remainingBalance.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">Fecha de Pago *</label>
                  <input
                    type="date"
                    value={formData.payment_date}
                    onChange={(e) => setFormData({...formData, payment_date: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white/90 text-sm font-medium mb-2">
                    Número de Referencia {selectedMethod?.requires_reference && '*'}
                  </label>
                  <input
                    type="text"
                    value={formData.reference_number}
                    onChange={(e) => setFormData({...formData, reference_number: e.target.value})}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    placeholder="Ej: TRF-123456"
                    required={selectedMethod?.requires_reference}
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/90 text-sm font-medium mb-2">Observaciones</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                  rows="2"
                  placeholder="Notas adicionales sobre el pago..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-all flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Registrando...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Registrar Pago</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <Check className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Pedido Pagado Completamente</p>
              <p className="text-white/60 mt-2">Este pedido no tiene saldo pendiente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const PedidoModal = ({ mode, pedido, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customer: pedido?.customer || '',
    campaign: pedido?.campaign || '',
    order_date: pedido?.order_date || new Date().toISOString().split('T')[0],
    delivery_date: pedido?.delivery_date || '',
    notes: pedido?.notes || ''
  });
  const [items, setItems] = useState(pedido?.items || []);
  const [clientes, setClientes] = useState([]);
  const [campanas, setCampanas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientesRes, campanasRes, productosRes] = await Promise.all([
        api.get(API_ENDPOINTS.SALES.CUSTOMERS.LIST),
        api.get(API_ENDPOINTS.CAMPAIGNS.LIST),
        api.get(API_ENDPOINTS.PRODUCTION.LIST)
      ]);
      
      // Manejar respuestas paginadas o directas
      const clientesData = clientesRes.data.results || clientesRes.data || [];
      const campanasData = campanasRes.data.results || campanasRes.data || [];
      const productosData = productosRes.data.results || productosRes.data || [];
      
      // Filtrar solo productos con stock disponible (quantity > 0)
      const productosConStock = Array.isArray(productosData) 
        ? productosData.filter(p => parseFloat(p.quantity) > 0)
        : [];
      
      // Asegurar que sean arrays
      setClientes(Array.isArray(clientesData) ? clientesData : []);
      setCampanas(Array.isArray(campanasData) ? campanasData : []);
      setProductos(productosConStock);
      
      // Log para depuración
      const totalProductos = Array.isArray(productosData) ? productosData.length : 0;
      const sinStock = totalProductos - productosConStock.length;
      console.log(`✅ ${productosConStock.length} productos con stock disponible`);
      if (sinStock > 0) {
        console.log(`⚠️ ${sinStock} productos sin stock (no se muestran en el selector)`);
      }
    } catch (error) {
      console.error('❌ Error fetching data:', error);
      console.error('Error details:', error.response?.data);
      setClientes([]);
      setCampanas([]);
      setProductos([]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { product: '', quantity: 1, unit_price: 0 }]);
  };

  const handleRemoveItem = (index) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'product') {
      const producto = productos.find(p => p.id === parseInt(value));
      if (producto) {
        newItems[index].unit_price = 250;
      }
    }
    
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0);
    }, 0);
  };

  const validateStock = () => {
    for (const item of items) {
      const producto = productos.find(p => p.id === parseInt(item.product));
      
      if (!producto) {
        alert('Por favor seleccione un producto válido');
        return false;
      }
      
      // Validar que el producto tenga stock
      if (parseFloat(producto.quantity) <= 0) {
        alert(`❌ Producto sin stock\n\n${producto.product_name}\nStock disponible: 0 kg\n\nNo se puede agregar este producto al pedido.`);
        return false;
      }
      
      // Validar que la cantidad no exceda el stock
      if (parseFloat(item.quantity) > parseFloat(producto.quantity)) {
        alert(`❌ Stock insuficiente\n\n${producto.product_name}\nCantidad solicitada: ${item.quantity} kg\nStock disponible: ${producto.quantity} kg\n\nPor favor ajuste la cantidad.`);
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.customer) {
      alert('El campo Cliente es obligatorio');
      return;
    }
    
    if (items.length === 0) {
      alert('Debe agregar al menos un producto');
      return;
    }
    
    if (!validateStock()) {
      return;
    }
    
    try {
      setLoading(true);
      
      const orderData = {
        ...formData,
        order_number: pedido?.order_number || `ORD-${Date.now()}`,
        status: 'DRAFT',
        subtotal: calculateTotal(),
        total: calculateTotal()
      };
      
      let orderId;
      if (mode === 'create') {
        const response = await api.post(API_ENDPOINTS.SALES.ORDERS.LIST, orderData);
        orderId = response.data.id;
      } else {
        await api.put(API_ENDPOINTS.SALES.ORDERS.DETAIL(pedido.id), orderData);
        orderId = pedido.id;
      }
      
      for (const item of items) {
        if (!item.id) {
          await api.post(API_ENDPOINTS.SALES.ORDER_ITEMS.LIST, {
            order: orderId,
            product: item.product,
            quantity: item.quantity,
            unit_price: item.unit_price
          });
        }
      }
      
      alert('Pedido guardado correctamente');
      onSuccess();
    } catch (error) {
      console.error('Error saving pedido:', error);
      alert('Error al guardar el pedido: ' + (error.response?.data?.detail || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'view') {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="p-6 border-b border-white/10">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-white">Detalles del Pedido</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-white/60 text-sm">Número de Pedido</p>
                <p className="text-white font-semibold">{pedido.order_number}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Cliente</p>
                <p className="text-white font-semibold">{pedido.customer_name}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Fecha</p>
                <p className="text-white">{new Date(pedido.order_date).toLocaleDateString('es-BO')}</p>
              </div>
              <div>
                <p className="text-white/60 text-sm">Estado</p>
                <p className="text-white">{pedido.status_display}</p>
              </div>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-white font-semibold mb-3">Productos</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/10">
                    <tr>
                      <th className="px-4 py-2 text-left text-white/80 text-sm">Producto</th>
                      <th className="px-4 py-2 text-left text-white/80 text-sm">Cantidad</th>
                      <th className="px-4 py-2 text-left text-white/80 text-sm">Precio Unit.</th>
                      <th className="px-4 py-2 text-left text-white/80 text-sm">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pedido.items?.map((item, index) => (
                      <tr key={index} className="border-t border-white/10">
                        <td className="px-4 py-3 text-white">{item.product_name}</td>
                        <td className="px-4 py-3 text-white">{item.quantity}</td>
                        <td className="px-4 py-3 text-white">Bs. {item.unit_price}</td>
                        <td className="px-4 py-3 text-emerald-300 font-semibold">Bs. {item.line_total}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-white text-lg">Total del Pedido:</span>
                <span className="text-3xl font-bold text-emerald-300">Bs. {pedido.total}</span>
              </div>
            </div>
          </div>
          <div className="p-6 border-t border-white/10 flex justify-end">
            <button
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white">
              {mode === 'create' ? 'Nuevo Pedido' : 'Editar Pedido'}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Cliente *</label>
              <select
                value={formData.customer}
                onChange={(e) => setFormData({...formData, customer: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              >
                <option value="">Seleccionar cliente</option>
                {Array.isArray(clientes) && clientes.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Campaña *</label>
              <select
                value={formData.campaign}
                onChange={(e) => setFormData({...formData, campaign: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              >
                <option value="">Seleccionar campaña</option>
                {Array.isArray(campanas) && campanas.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Fecha de Pedido *</label>
              <input
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData({...formData, order_date: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                required
              />
            </div>
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Fecha de Entrega</label>
              <input
                type="date"
                value={formData.delivery_date}
                onChange={(e) => setFormData({...formData, delivery_date: e.target.value})}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                placeholder="dd/mm/aaaa"
              />
            </div>
          </div>

          <div className="bg-white/5 rounded-lg p-4 border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <label className="block text-white/90 text-sm font-medium">Productos *</label>
              <button
                type="button"
                onClick={handleAddItem}
                disabled={productos.length === 0}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition-all"
                title={productos.length === 0 ? 'No hay productos con stock disponible' : 'Agregar producto al pedido'}
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Producto</span>
              </button>
            </div>
            
            {productos.length === 0 ? (
              <div className="text-center py-8 text-yellow-300/80">
                <Package className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">No hay productos con stock disponible</p>
                <p className="text-sm text-white/60 mt-2">Los productos sin stock no se pueden agregar al pedido</p>
              </div>
            ) : items.length === 0 ? (
              <div className="text-center py-8 text-white/60">
                <Package className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay productos agregados</p>
                <p className="text-sm">Haz clic en "Agregar Producto" para comenzar</p>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="bg-white/10 rounded-lg p-3 border border-white/10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-start">
                      <div className="md:col-span-5">
                        <label className="block text-white/80 text-xs mb-1">Producto</label>
                        <select
                          value={item.product}
                          onChange={(e) => handleItemChange(index, 'product', e.target.value)}
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          required
                        >
                          <option value="">Seleccionar producto</option>
                          {Array.isArray(productos) && productos.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.product_name} | Campaña: {p.campaign_name || 'N/A'} | Stock: {p.quantity} kg | Calidad: {p.quality_grade || 'N/A'}
                            </option>
                          ))}
                        </select>
                        {item.product && (
                          <div className="mt-1 text-xs text-white/60">
                            {(() => {
                              const selectedProduct = productos.find(p => p.id === parseInt(item.product));
                              return selectedProduct ? (
                                <div className="grid grid-cols-2 gap-1">
                                  <span>📦 Stock disponible: <strong className="text-emerald-300">{selectedProduct.quantity} kg</strong></span>
                                  <span>📅 Cosecha: {new Date(selectedProduct.harvest_date).toLocaleDateString('es-BO')}</span>
                                  <span>🏷️ Calidad: {selectedProduct.quality_grade || 'N/A'}</span>
                                  <span>📍 Almacén: {selectedProduct.storage_location || 'N/A'}</span>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-xs mb-1">Cantidad (kg)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0.01"
                          max={(() => {
                            const selectedProduct = productos.find(p => p.id === parseInt(item.product));
                            return selectedProduct ? selectedProduct.quantity : undefined;
                          })()}
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          required
                        />
                        {item.product && item.quantity && (() => {
                          const selectedProduct = productos.find(p => p.id === parseInt(item.product));
                          if (selectedProduct && parseFloat(item.quantity) > parseFloat(selectedProduct.quantity)) {
                            return (
                              <p className="text-red-300 text-xs mt-1">
                                ⚠️ Excede el stock disponible ({selectedProduct.quantity} kg)
                              </p>
                            );
                          }
                          return null;
                        })()}
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-xs mb-1">Precio Unit. (Bs)</label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          placeholder="0.00"
                          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                          required
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-white/80 text-xs mb-1">Subtotal</label>
                        <div className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-emerald-300 font-semibold text-sm">
                          Bs. {((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                        </div>
                      </div>
                      <div className="md:col-span-1 flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(index)}
                          className="w-full md:w-auto p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                          title="Eliminar producto"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <span className="text-white text-lg">Total del Pedido:</span>
              <span className="text-3xl font-bold text-emerald-300">Bs. {calculateTotal().toFixed(2)}</span>
            </div>
          </div>

          <div>
            <label className="block text-white/90 text-sm font-medium mb-2">Notas / Observaciones</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({...formData, notes: e.target.value})}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
              rows="3"
              placeholder="Agregar notas adicionales sobre el pedido..."
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg transition-all flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Guardando...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Guardar</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Ventas;
