import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';

const SuperAdminLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await login(formData);
      
      // Verificar que sea superusuario
      if (!response.user.is_superuser) {
        setError('Acceso denegado. Solo super administradores pueden acceder.');
        setLoading(false);
        return;
      }

      // Redirigir al dashboard de super admin
      navigate('/super-admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Panel de Super Admin
          </h1>
          <p className="text-gray-400">
            Acceso restringido solo para administradores del sistema
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          {error && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Usuario
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="admin"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <Shield className="w-5 h-5" />
                  <span>Acceder al Panel</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={() => navigate('/')}
              className="w-full py-2 text-gray-400 hover:text-white transition flex items-center justify-center space-x-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al inicio</span>
            </button>
          </div>
        </div>

        {/* Warning */}
        <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
          <p className="text-yellow-200 text-sm text-center">
            <Shield className="w-4 h-4 inline mr-1" />
            Este panel es solo para administradores del sistema. 
            Todas las acciones son registradas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminLoginPage;
