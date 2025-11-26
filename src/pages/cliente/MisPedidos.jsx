import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Clock, CheckCircle, XCircle, Eye, Trash2, CreditCard, DollarSign, X, Save } from 'lucide-react';
import api from '../../services/api';
import API_ENDPOINTS from '../../config/apiEndpoints';

const MisPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      setLoading(true);
      const response = await api.get(API_ENDPOINTS.SALES.ORDERS.LIST);
      const data = response.data.results || response.data || [];
      setPedidos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'DRAFT': 'bg-gray-500/20 text-gray-200',
      'CONFIRMED': 'bg-blue-500/20 text-blue-200',
      'PAID': 'bg-green-500/20 text-green-200',
      'SHIPPED': 'bg-purple-500/20 text-purple-200',
      'DELIVERED': 'bg-emerald-500/20 text-emerald-200',
      'CANCELLED': 'bg-red-500/20 text-red-200',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      'DRAFT': Clock,
      'CONFIRMED': CheckCircle,
      'PAID': CheckCircle,
      'SHIPPED': Package,
      'DELIVERED': CheckCircle,
      'CANCELLED': XCircle,
    };
    return icons[status] || Clock;
  };

  const getStatusText = (status) => {
    const texts = {
      'DRAFT': 'Borrador',
      'CONFIRMED': 'Confirmado',
      'PAID': 'Pagado',
      'SHIPPED': 'Enviado',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado',
    };
    return texts[status] || status;
  };

  const handleViewDetails = (pedido) => {
    setSelectedOrder(pedido);
    setShowDetailModal(true);
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('¿Está seguro de cancelar este pedido?')) return;

    try {
      await api.post(API_ENDPOINTS.SALES.ORDERS.CANCEL(orderId));
      alert('Pedido cancelado exitosamente');
      fetchPedidos();
    } catch (error) {
      console.error('Error canceling order:', error);
      alert('Error al cancelar el pedido');
    }
  };

  const handlePayOrder = (pedido) => {
    setSelectedOrderForPayment(pedido);
    setShowPaymentModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <ShoppingCart className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Mis Pedidos</h1>
        </div>
        <p className="text-emerald-200/80">Historial de pedidos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-emerald-200/70 text-sm mb-1">Total Pedidos</p>
          <p className="text-2xl font-bold text-white">{pedidos.length}</p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-emerald-200/70 text-sm mb-1">En Proceso</p>
          <p className="text-2xl font-bold text-blue-300">
            {pedidos.filter(p => ['CONFIRMED', 'PAID', 'SHIPPED'].includes(p.status)).length}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-emerald-200/70 text-sm mb-1">Entregados</p>
          <p className="text-2xl font-bold text-green-300">
            {pedidos.filter(p => p.status === 'DELIVERED').length}
          </p>
        </div>
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
          <p className="text-emerald-200/70 text-sm mb-1">Total Gastado</p>
          <p className="text-2xl font-bold text-emerald-300">
            Bs. {pedidos.reduce((sum, p) => sum + parseFloat(p.total || 0), 0).toFixed(2)}
          </p>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="spinner mx-auto"></div>
          </div>
        ) : pedidos.length === 0 ? (
          <div className="p-8 text-center">
            <ShoppingCart className="w-16 h-16 text-emerald-300/50 mx-auto mb-4" />
            <p className="text-emerald-200/60">No tienes pedidos aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/20">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Número</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-emerald-200 uppercase">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pedidos.map((pedido) => {
                  const StatusIcon = getStatusIcon(pedido.status);
                  return (
                    <tr key={pedido.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-white font-medium">{pedido.order_number}</td>
                      <td className="px-6 py-4 text-emerald-200/80">
                        {new Date(pedido.order_date).toLocaleDateString('es-BO')}
                      </td>
                      <td className="px-6 py-4 text-emerald-200/80">
                        {pedido.items?.length || 0} items
                      </td>
                      <td className="px-6 py-4 text-emerald-300 font-semibold">
                        Bs. {parseFloat(pedido.total || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs flex items-center space-x-1 w-fit ${getStatusColor(pedido.status)}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{getStatusText(pedido.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(pedido)}
                            className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 rounded-lg transition-colors"
                            title="Ver detalles"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {(pedido.status === 'CONFIRMED' || pedido.status === 'SHIPPED') && (
                            <button
                              onClick={() => handlePayOrder(pedido)}
                              className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-lg transition-colors"
                              title="Pagar pedido"
                            >
                              <DollarSign className="w-4 h-4" />
                            </button>
                          )}
                          {pedido.status === 'DRAFT' && (
                            <button
                              onClick={() => handleCancelOrder(pedido.id)}
                              className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 rounded-lg transition-colors"
                              title="Cancelar pedido"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedOrderForPayment && (
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

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 rounded-xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">Detalle del Pedido</h2>
                <button
                  onClick={() => setShowDetailModal(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Order Info */}
              <div className="bg-white/5 rounded-lg p-4 mb-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-emerald-200/60 text-sm">Número de Pedido</p>
                    <p className="text-white font-semibold">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <p className="text-emerald-200/60 text-sm">Fecha</p>
                    <p className="text-white font-semibold">
                      {new Date(selectedOrder.order_date).toLocaleDateString('es-BO')}
                    </p>
                  </div>
                  <div>
                    <p className="text-emerald-200/60 text-sm">Estado</p>
                    <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(selectedOrder.status)}`}>
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-emerald-200/60 text-sm">Total</p>
                    <p className="text-emerald-300 font-bold text-lg">
                      Bs. {parseFloat(selectedOrder.total || 0).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Items del Pedido</h3>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, index) => (
                      <div key={index} className="bg-white/5 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="text-white font-medium">{item.product_name || 'Producto'}</p>
                          <p className="text-emerald-200/60 text-sm">
                            Cantidad: {item.quantity} x Bs. {parseFloat(item.unit_price || 0).toFixed(2)}
                          </p>
                        </div>
                        <p className="text-emerald-300 font-semibold">
                          Bs. {parseFloat(item.line_total || 0).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-emerald-200/60 text-sm">No hay items en este pedido</p>
                )}
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-white/5 rounded-lg p-4 mt-4">
                  <h3 className="text-white font-semibold mb-2">Notas</h3>
                  <p className="text-emerald-200/80 text-sm">{selectedOrder.notes}</p>
                </div>
              )}

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full mt-6 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
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

    // Validar que si el método requiere referencia, se haya ingresado
    if (selectedMethod?.requires_reference && !formData.reference_number.trim()) {
      alert('Debe ingresar la referencia de la transferencia');
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

      const newTotalPaid = getTotalPaid() + parseFloat(formData.amount);
      if (newTotalPaid >= parseFloat(order.total)) {
        await api.patch(API_ENDPOINTS.SALES.ORDERS.DETAIL(order.id), { status: 'PAID' });
      }

      alert('✅ Pago registrado correctamente');
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
              <h2 className="text-xl font-bold text-white">Pagar Pedido</h2>
              <p className="text-white/70 text-sm mt-1">Pedido: {order.order_number}</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-white/10 rounded-lg p-4 border border-white/10">
            <h3 className="text-white font-semibold mb-3">Resumen del Pedido</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-white/60">Total del Pedido</p>
                <p className="text-white font-bold">Bs. {parseFloat(order.total).toFixed(2)}</p>
              </div>
              <div>
                <p className="text-white/60">Total Pagado</p>
                <p className="text-emerald-300 font-medium">Bs. {getTotalPaid().toFixed(2)}</p>
              </div>
              <div className="col-span-2">
                <p className="text-white/60">Saldo Pendiente</p>
                <p className="text-yellow-300 font-bold text-xl">Bs. {remainingBalance.toFixed(2)}</p>
              </div>
            </div>
          </div>

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
                  placeholder="Notas adicionales..."
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
                      <span>Procesando...</span>
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-4 h-4" />
                      <span>Pagar</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-8">
              <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
              <p className="text-white text-lg font-semibold">Pedido Pagado Completamente</p>
              <p className="text-white/60 mt-2">Este pedido no tiene saldo pendiente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MisPedidos;
