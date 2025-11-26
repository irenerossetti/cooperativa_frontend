import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Sprout } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import API_ENDPOINTS from '../../config/apiEndpoints';

const ProductosSemillas = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, loading: cartLoading } = useCart();

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      // Cargar productos cosechados que contengan "Semilla" en el nombre
      const response = await api.get(API_ENDPOINTS.PRODUCTION.LIST);
      const data = response.data.results || response.data || [];
      const semillas = Array.isArray(data) 
        ? data.filter(p => p.product_name?.toLowerCase().includes('semilla'))
        : [];
      setProductos(semillas);
    } catch (error) {
      console.error('Error fetching productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (producto) => {
    // Validar que el producto tenga stock disponible
    if (!producto.quantity || parseFloat(producto.quantity) <= 0) {
      alert(`❌ Producto sin stock\n\n${producto.product_name}\nStock disponible: 0 kg\n\nEste producto no está disponible en este momento.`);
      return;
    }
    
    addToCart({
      id: producto.id,
      name: producto.product_name,
      price: 250, // Precio fijo por ahora
    }, 1);
  };

  const filteredProductos = productos.filter(p =>
    p.product_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-2">
          <Sprout className="w-6 h-6 text-emerald-400" />
          <h1 className="text-2xl font-bold text-white">Semillas</h1>
        </div>
        <p className="text-emerald-200/80">Semillas certificadas de alta calidad</p>
      </div>

      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
          <input
            type="text"
            placeholder="Buscar semillas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-12 pr-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="spinner"></div>
        </div>
      ) : filteredProductos.length === 0 ? (
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-12 text-center">
          <Sprout className="w-16 h-16 text-emerald-300/50 mx-auto mb-4" />
          <p className="text-emerald-200/60">No hay productos de semillas disponibles</p>
          <p className="text-emerald-200/40 text-sm mt-2">Los productos aparecerán aquí una vez que sean cosechados y registrados</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProductos.map((producto) => (
          <div key={producto.id} className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 hover:bg-white/15 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${parseFloat(producto.quantity) > 0 ? 'bg-gradient-to-r from-green-500 to-green-600' : 'bg-gray-500'}`}>
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${parseFloat(producto.quantity) > 0 ? 'bg-green-500/20 text-green-200' : 'bg-red-500/20 text-red-200'}`}>
                Stock: {producto.quantity} kg
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{producto.product_name}</h3>
            <p className="text-emerald-200/70 text-sm mb-4">Cosechado: {new Date(producto.harvest_date).toLocaleDateString('es-BO')}</p>
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl font-bold text-emerald-300">Bs. 250</span>
              <span className="text-emerald-200/60 text-sm">por kg</span>
            </div>
            {parseFloat(producto.quantity) > 0 ? (
              <button 
                onClick={() => handleAddToCart(producto)}
                disabled={cartLoading}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>{cartLoading ? 'Agregando...' : 'Agregar al Carrito'}</span>
              </button>
            ) : (
              <button 
                disabled
                className="w-full bg-gray-600 cursor-not-allowed text-white/60 px-4 py-2 rounded-lg flex items-center justify-center space-x-2"
                title="Producto sin stock"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Sin Stock</span>
              </button>
            )}
          </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductosSemillas;
