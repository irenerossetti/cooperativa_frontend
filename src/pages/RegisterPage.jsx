import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Sprout, Building2, User, Mail, Lock, Phone, MapPin, ArrowLeft } from 'lucide-react';
import api from '../services/api';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    // Datos de la organización
    organization_name: '',
    organization_type: 'cooperative',
    address: '',
    phone: '',
    
    // Datos del usuario administrador
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validaciones
    if (formData.password !== formData.password_confirm) {
      setError('Las contraseñas no coinciden');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/api/tenants/register/', {
        organization: {
          name: formData.organization_name,
          organization_type: formData.organization_type,
          address: formData.address,
          phone: formData.phone
        },
        admin_user: {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          first_name: formData.first_name,
          last_name: formData.last_name
        }
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login', { 
          state: { 
            message: '¡Registro exitoso! Ya puedes iniciar sesión',
            username: formData.username 
          } 
        });
      }, 2000);

    } catch (err) {
      console.error('Error en registro:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.message || 
        'Error al registrar. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sprout className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Registro Exitoso!</h2>
          <p className="text-gray-600 mb-4">
            Tu cooperativa ha sido creada correctamente. Redirigiendo al login...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 text-green-600 hover:text-green-700 mb-4">
            <ArrowLeft className="w-5 h-5" />
            <span>Volver al inicio</span>
          </Link>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sprout className="w-10 h-10 text-green-600" />
            <h1 className="text-3xl font-bold text-gray-900">AgroCooperativa</h1>
          </div>
          <p className="text-gray-600">Crea tu cuenta y comienza a gestionar tu cooperativa</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            {/* Left Side - Info */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 text-white">
              <h2 className="text-2xl font-bold mb-6">¿Por qué registrarte?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Gestión Completa</h3>
                    <p className="text-sm text-green-100">Control total de parcelas, cultivos y producción</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Multi-Organización</h3>
                    <p className="text-sm text-green-100">Datos aislados y seguros para tu cooperativa</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">Prueba Gratis</h3>
                    <p className="text-sm text-green-100">30 días sin compromiso ni tarjeta de crédito</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Datos de la Organización */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-green-600" />
                    <span>Datos de la Cooperativa</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nombre de la Cooperativa *
                      </label>
                      <input
                        type="text"
                        name="organization_name"
                        value={formData.organization_name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Ej: Cooperativa San Juan"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Teléfono
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="12345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tipo
                        </label>
                        <select
                          name="organization_type"
                          value={formData.organization_type}
                          onChange={handleChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        >
                          <option value="cooperative">Cooperativa</option>
                          <option value="association">Asociación</option>
                          <option value="company">Empresa</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dirección
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Dirección completa"
                      />
                    </div>
                  </div>
                </div>

                {/* Datos del Usuario */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                    <User className="w-5 h-5 text-green-600" />
                    <span>Datos del Administrador</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nombre *
                        </label>
                        <input
                          type="text"
                          name="first_name"
                          value={formData.first_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Apellido *
                        </label>
                        <input
                          type="text"
                          name="last_name"
                          value={formData.last_name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Usuario *
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="usuario123"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="correo@ejemplo.com"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Contraseña *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="••••••"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirmar *
                        </label>
                        <input
                          type="password"
                          name="password_confirm"
                          value={formData.password_confirm}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="••••••"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registrando...' : 'Crear Cuenta'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿Ya tienes cuenta?{' '}
                    <button
                      onClick={() => navigate('/login')}
                      type="button"
                      className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                    >
                      Iniciar sesión
                    </button>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
