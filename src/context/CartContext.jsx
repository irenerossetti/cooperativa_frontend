import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);

  // Cargar carrito al iniciar
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      setCartItems([]);
      setCartCount(0);
      setCurrentOrder(null);
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      // Buscar pedido en borrador del usuario
      const response = await api.get(API_ENDPOINTS.SALES.ORDERS.LIST + '?status=DRAFT');
      const orders = response.data.results || response.data || [];
      const draftOrder = Array.isArray(orders) ? orders.find(o => o.status === 'DRAFT') : null;
      
      if (draftOrder) {
        setCurrentOrder(draftOrder);
        setCartItems(draftOrder.items || []);
        setCartCount(draftOrder.items?.length || 0);
      } else {
        setCurrentOrder(null);
        setCartItems([]);
        setCartCount(0);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const createDraftOrder = async () => {
    try {
      // Primero, obtener o crear un cliente para el usuario actual
      let customerId;
      
      try {
        // Buscar si ya existe un cliente para este usuario
        const customersResponse = await api.get(API_ENDPOINTS.SALES.CUSTOMERS.LIST);
        const customers = customersResponse.data.results || customersResponse.data || [];
        const existingCustomer = Array.isArray(customers) 
          ? customers.find(c => c.email === user.email) 
          : null;
        
        if (existingCustomer) {
          customerId = existingCustomer.id;
        } else {
          // Crear nuevo cliente
          const customerData = {
            name: `${user.first_name} ${user.last_name}`,
            document_type: 'CI',
            document_number: user.username || `USER${user.id}`,
            email: user.email || `${user.username}@cooperativa.com`,
            phone: user.phone || '00000000',
            address: user.address || 'Sin dirección',
          };
          
          const customerResponse = await api.post(API_ENDPOINTS.SALES.CUSTOMERS.LIST, customerData);
          customerId = customerResponse.data.id;
        }
      } catch (error) {
        console.error('Error managing customer:', error);
        throw new Error('No se pudo crear/obtener el cliente');
      }

      // Obtener una campaña activa
      let campaignId;
      try {
        const campaignsResponse = await api.get(API_ENDPOINTS.CAMPAIGNS.ACTIVE);
        const campaigns = campaignsResponse.data.results || campaignsResponse.data || [];
        const activeCampaign = Array.isArray(campaigns) && campaigns.length > 0 
          ? campaigns[0] 
          : null;
        
        if (!activeCampaign) {
          throw new Error('No hay campañas activas');
        }
        
        campaignId = activeCampaign.id;
      } catch (error) {
        console.error('Error getting campaign:', error);
        throw new Error('No se pudo obtener una campaña activa');
      }

      // Crear el pedido en borrador
      const orderData = {
        order_number: `ORD-${Date.now()}`,
        customer: customerId,
        campaign: campaignId,
        order_date: new Date().toISOString().split('T')[0],
        status: 'DRAFT',
        subtotal: 0,
        total: 0,
      };

      const orderResponse = await api.post(API_ENDPOINTS.SALES.ORDERS.LIST, orderData);
      return orderResponse.data;
    } catch (error) {
      console.error('Error creating draft order:', error);
      throw error;
    }
  };

  const addToCart = async (product, quantity = 1) => {
    try {
      setLoading(true);

      let orderId = currentOrder?.id;

      // Si no hay pedido en borrador, crear uno
      if (!currentOrder) {
        try {
          const newOrder = await createDraftOrder();
          orderId = newOrder.id;
          setCurrentOrder(newOrder);
        } catch (error) {
          alert('Error al crear el pedido: ' + error.message);
          return;
        }
      }

      // Verificar que el producto tenga un ID válido de HarvestedProduct
      if (!product.id || typeof product.id !== 'number') {
        alert('Este producto es de demostración. Para agregar productos reales al carrito, primero deben ser cosechados y registrados en el sistema.');
        return;
      }

      // Agregar item al pedido
      const itemData = {
        order: orderId,
        product: product.id,
        quantity: quantity,
        unit_price: product.price || 0,
      };

      await api.post(API_ENDPOINTS.SALES.ORDER_ITEMS.LIST, itemData);
      
      // Recargar carrito
      await loadCart();
      
      alert(`${product.name} agregado al carrito`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      const errorMsg = error.response?.data?.detail || error.message || 'Error desconocido';
      alert('Error al agregar al carrito: ' + errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      setLoading(true);
      await api.delete(API_ENDPOINTS.SALES.ORDER_ITEMS.DETAIL(itemId));
      await loadCart();
      alert('Producto eliminado del carrito');
    } catch (error) {
      console.error('Error removing from cart:', error);
      alert('Error al eliminar del carrito');
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    try {
      if (!currentOrder) return;
      
      setLoading(true);
      // Eliminar todos los items
      for (const item of cartItems) {
        await api.delete(API_ENDPOINTS.SALES.ORDER_ITEMS.DETAIL(item.id));
      }
      await loadCart();
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error al limpiar el carrito');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    cartItems,
    cartCount,
    loading,
    currentOrder,
    addToCart,
    removeFromCart,
    clearCart,
    refreshCart: loadCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
