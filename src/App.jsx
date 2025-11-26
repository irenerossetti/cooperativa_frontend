import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Socios from './pages/Socios';
import Usuarios from './pages/Usuarios';
import Roles from './pages/Roles';
import Parcelas from './pages/Parcelas';
import Semillas from './pages/Semillas';
import Insumos from './pages/Insumos';
import Campanas from './pages/Campanas';
import LaboresAgricolas from './pages/LaboresAgricolas';
import ProductosCosechados from './pages/ProductosCosechados';
import Auditoria from './pages/Auditoria';
import MetodosPago from './pages/MetodosPago';
import Ventas from './pages/Ventas';
import ProductosSemillas from './pages/cliente/ProductosSemillas';
import ProductosFertilizantes from './pages/cliente/ProductosFertilizantes';
import ProductosPorCampana from './pages/cliente/ProductosPorCampana';
import TodosProductos from './pages/cliente/TodosProductos';
import MisPedidos from './pages/cliente/MisPedidos';
import PagePlaceholder from './components/common/PagePlaceholder';
import { Key, FlaskConical, Tractor, Package, CreditCard, Calendar, FileText, BarChart3, ShoppingCart, User } from 'lucide-react';

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" />;
};

// Componente para redirigir si ya está autenticado
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return user ? <Navigate to="/dashboard" /> : children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Routes>
          {/* Ruta pública */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          {/* Rutas protegidas */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <MainLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    
                    {/* Rutas principales */}
                    <Route path="/socios" element={<Socios />} />
                    <Route path="/usuarios" element={<Usuarios />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/semillas" element={<Semillas />} />
                    <Route path="/parcelas" element={<Parcelas />} />
                    
                    {/* Rutas en desarrollo */}
                    <Route path="/insumos" element={<Insumos />} />
                    <Route path="/campaigns" element={<Campanas />} />
                    <Route path="/labores" element={<LaboresAgricolas />} />
                    <Route path="/productos-cosechados" element={<ProductosCosechados />} />
                    <Route path="/payment-methods" element={<MetodosPago />} />
                    <Route path="/ventas" element={<Ventas />} />
                    <Route path="/auditoria" element={<Auditoria />} />
                    
                    {/* Rutas de productos para clientes */}
                    <Route path="/productos/semillas" element={<ProductosSemillas />} />
                    <Route path="/productos/fertilizantes" element={<ProductosFertilizantes />} />
                    <Route path="/productos/campana" element={<ProductosPorCampana />} />
                    <Route path="/productos/todos" element={<TodosProductos />} />
                    
                    {/* Rutas para socios */}
                    <Route path="/mis-parcelas" element={<PagePlaceholder title="Mis Parcelas" description="Gestiona tus parcelas" icon={Package} />} />
                    <Route path="/mis-labores" element={<PagePlaceholder title="Mis Labores" description="Historial de labores agrícolas" icon={Tractor} />} />
                    <Route path="/mi-produccion" element={<PagePlaceholder title="Mi Producción" description="Historial de producción" icon={Package} />} />
                    <Route path="/mis-pagos" element={<PagePlaceholder title="Mis Pagos" description="Historial de pagos" icon={CreditCard} />} />
                    
                    {/* Rutas para clientes */}
                    <Route path="/mis-pedidos" element={<MisPedidos />} />
                    <Route path="/mi-perfil" element={<PagePlaceholder title="Mi Perfil" description="Información personal" icon={User} />} />
                    
                    {/* Reportes */}
                    <Route path="/reportes" element={<PagePlaceholder title="Reportes" description="Genera reportes del sistema" icon={BarChart3} />} />
                    <Route path="/reports/labors" element={<PagePlaceholder title="Reporte de Labores" description="Reporte de labores por campaña" icon={BarChart3} />} />
                    <Route path="/reports/production-campaign" element={<PagePlaceholder title="Reporte de Producción" description="Reporte de producción por campaña" icon={BarChart3} />} />
                    <Route path="/reports/production-plot" element={<PagePlaceholder title="Reporte de Producción" description="Reporte de producción por parcela" icon={BarChart3} />} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
