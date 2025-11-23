import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';

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
                    
                    {/* Placeholder para otras rutas */}
                    <Route path="/socios" element={<div className="text-white">Socios - En desarrollo</div>} />
                    <Route path="/usuarios" element={<div className="text-white">Usuarios - En desarrollo</div>} />
                    <Route path="/roles" element={<div className="text-white">Roles - En desarrollo</div>} />
                    <Route path="/semillas" element={<div className="text-white">Semillas - En desarrollo</div>} />
                    <Route path="/parcelas" element={<div className="text-white">Parcelas - En desarrollo</div>} />
                    <Route path="/insumos" element={<div className="text-white">Insumos - En desarrollo</div>} />
                    <Route path="/labores" element={<div className="text-white">Labores - En desarrollo</div>} />
                    <Route path="/productos-cosechados" element={<div className="text-white">Productos - En desarrollo</div>} />
                    <Route path="/payment-methods" element={<div className="text-white">Métodos de Pago - En desarrollo</div>} />
                    <Route path="/campaigns" element={<div className="text-white">Campañas - En desarrollo</div>} />
                    <Route path="/auditoria" element={<div className="text-white">Auditoría - En desarrollo</div>} />
                    <Route path="/reportes" element={<div className="text-white">Reportes - En desarrollo</div>} />
                    <Route path="/reports/labors" element={<div className="text-white">Reporte Labores - En desarrollo</div>} />
                    <Route path="/reports/production-campaign" element={<div className="text-white">Reporte Producción Campaña - En desarrollo</div>} />
                    <Route path="/reports/production-plot" element={<div className="text-white">Reporte Producción Parcela - En desarrollo</div>} />
                  </Routes>
                </MainLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
