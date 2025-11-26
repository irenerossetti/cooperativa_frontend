import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sprout, User, Mail, Lock, Eye, EyeOff, CheckCircle, ArrowLeft, ShoppingCart, Users } from 'lucide-react';
import api from '../services/api';

const SimpleRegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Obtener el tipo de registro desde la URL (cliente o socio)
  const registerType = searchParams.get('type') || 'cliente';
  const plan = searchParams.get('plan') || null;

  const [formData, setFormData] = useState({
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
      // Endpoint simple de registro de usuario
      const response = await api.post('/api/auth/users/register/', {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        first_name: formData.first_name,
        last_name: formData.last_name,
        register_type: registerType, // 'cliente' o 'socio'
        plan: plan // plan seleccionado (si aplica)
      });

      // Redirigir al login con mensaje de éxito
      navigate('/login', { 
        state: { 
          message: '¡Registro exitoso! Ya puedes iniciar sesión',
          username: formData.username 
        } 
      });

    } catch (err) {
      console.error('Error en registro:', err);
      setError(
        err.response?.data?.error || 
        err.response?.data?.username?.[0] ||
        err.response?.data?.email?.[0] ||
        'Error al registrar. Por favor intenta nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-800 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-black/10">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent"></div>
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-[0.03]" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Register Container */}
      <div className="relative w-full max-w-md">
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 transform hover:scale-[1.01] transition-all duration-300">
          {/* Back Button */}
          <button
            onClick={() => navigate('/login')}
            className="flex items-center space-x-2 text-emerald-200 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Volver al login</span>
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              {registerType === 'socio' ? (
                <Users className="w-8 h-8 text-white" />
              ) : (
                <ShoppingCart className="w-8 h-8 text-white" />
              )}
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {registerType === 'socio' ? 'Registro de Socio' : 'Registro de Cliente'}
            </h1>
            <p className="text-emerald-100/80 text-sm">
              {registerType === 'socio' 
                ? 'Únete como socio cooperativista'
                : 'Comienza gratis como cliente'}
            </p>
            {plan && (
              <div className="mt-3 inline-block bg-yellow-400/20 border border-yellow-400/40 text-yellow-200 px-4 py-1.5 rounded-full text-sm font-semibold">
                Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
              </div>
            )}
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-500/80 text-white rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Nombre y Apellido */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium block">Nombre</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Juan"
                />
              </div>
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium block">Apellido</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="Pérez"
                />
              </div>
            </div>

            {/* Username */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block">Usuario</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  autoComplete="username"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="usuario123"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300/60 hover:text-emerald-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              <p className="text-emerald-200/60 text-xs">Mínimo 6 caracteres</p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium block">Confirmar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-300/60" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="password_confirm"
                  value={formData.password_confirm}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-2.5 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent backdrop-blur-sm transition-all duration-200"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-emerald-300/60 hover:text-emerald-300 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium py-3 px-6 rounded-xl shadow-lg transform hover:scale-[1.02] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>{loading ? 'Registrando...' : 'Crear Cuenta'}</span>
              </div>
            </button>

            {/* Login Link */}
            <div className="text-center pt-2">
              <p className="text-white/70 text-sm">
                ¿Ya tienes cuenta?{' '}
                <button
                  onClick={() => navigate('/login')}
                  type="button"
                  className="text-emerald-300 hover:text-emerald-200 font-semibold transition-colors"
                >
                  Iniciar sesión
                </button>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-emerald-100/60 text-xs">
              Al registrarte, aceptas nuestros términos y condiciones
            </p>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-emerald-400/20 rounded-full blur-xl"></div>
        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl"></div>
      </div>
    </div>
  );
};

export default SimpleRegisterPage;
