import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import MainLayout from './components/layout/MainLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SimpleRegisterPage from './pages/SimpleRegisterPage';
import SuperAdminLoginPage from './pages/SuperAdminLoginPage';
import SuperAdminDashboard from './pages/dashboards/SuperAdminDashboard';
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
import LaboresPorCampana from './pages/reports/LaboresPorCampana';
import ProduccionPorCampana from './pages/reports/ProduccionPorCampana';
import ProduccionPorParcela from './pages/reports/ProduccionPorParcela';
import SociosPorComunidad from './pages/reports/SociosPorComunidad';
import HectareasPorCultivo from './pages/reports/HectareasPorCultivo';
import ReportesIA from './pages/reports/ReportesIA';
import ProductosSemillas from './pages/cliente/ProductosSemillas';
import ProductosFertilizantes from './pages/cliente/ProductosFertilizantes';
import ProductosPorCampana from './pages/cliente/ProductosPorCampana';
import TodosProductos from './pages/cliente/TodosProductos';
import MisPedidos from './pages/cliente/MisPedidos';
import PagePlaceholder from './components/common/PagePlaceholder';
// Nuevas funcionalidades
import NotificationsPage from './pages/NotificationsPage';
import DashboardRealTime from './pages/DashboardRealTime';
import AIChat from './pages/AIChat';
import EventsCalendar from './pages/EventsCalendar';
import GoalsPage from './pages/GoalsPage';
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

// Componente para rutas públicas - permite acceso siempre
const PublicRoute = ({ children }) => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  // Permitir acceso siempre (con o sin sesión)
  return children;
};

// Componente para landing - siempre se muestra
const LandingRoute = ({ children }) => {
  return children;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
        <Routes>
          {/* Ruta landing page */}
          <Route 
            path="/" 
            element={
              <LandingRoute>
                <LandingPage />
              </LandingRoute>
            } 
          />
          
          {/* Rutas públicas */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <SimpleRegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register-organization"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          
          {/* Super Admin Routes */}
          <Route
            path="/super-admin"
            element={
              <PublicRoute>
                <SuperAdminLoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/super-admin/dashboard"
            element={
              <ProtectedRoute>
                <SuperAdminDashboard />
              </ProtectedRoute>
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
                    
                    {/* Nuevas funcionalidades */}
                    <Route path="/notifications" element={<NotificationsPage />} />
                    <Route path="/dashboard-realtime" element={<DashboardRealTime />} />
                    <Route path="/ai-chat" element={<AIChat />} />
                    <Route path="/events" element={<EventsCalendar />} />
                    <Route path="/goals" element={<GoalsPage />} />
                    
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
                    <Route path="/reports/labors" element={<LaboresPorCampana />} />
                    <Route path="/reports/production-campaign" element={<ProduccionPorCampana />} />
                    <Route path="/reports/production-plot" element={<ProduccionPorParcela />} />
                    <Route path="/reports/partners-community" element={<SociosPorComunidad />} />
                    <Route path="/reports/hectares-crop" element={<HectareasPorCultivo />} />
                    <Route path="/reports/ia" element={<ReportesIA />} />
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
