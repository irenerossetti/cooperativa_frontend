import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sprout, Users, BarChart3, Cloud, MessageSquare, Shield, 
  CheckCircle, ArrowRight, Menu, X, Zap, TrendingUp, Globe,
  CreditCard, Lock
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubscribe = (planName, planPrice) => {
    setSelectedPlan({ name: planName, price: planPrice });
    setShowPaymentModal(true);
  };

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica de procesamiento de pago
    alert(`Pago procesado exitosamente para el plan ${selectedPlan.name}`);
    setShowPaymentModal(false);
    navigate('/register?type=socio&plan=' + selectedPlan.name.toLowerCase());
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const features = [
    {
      icon: <Sprout className="w-8 h-8" />,
      title: "Gestión de Cultivos",
      description: "Control completo de parcelas, campañas y producción agrícola"
    },
    {
      icon: <Cloud className="w-8 h-8" />,
      title: "Clima Inteligente",
      description: "Predicciones meteorológicas y recomendaciones agrícolas en tiempo real"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Reportes con IA",
      description: "Análisis predictivo y reportes personalizables con Machine Learning"
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Asistente Virtual",
      description: "Chatbot con IA y comandos de voz para consultas instantáneas"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Multi-Organización",
      description: "Sistema SaaS para múltiples cooperativas con datos aislados"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Auditoría Completa",
      description: "Trazabilidad total de operaciones y control de permisos"
    }
  ];

  const benefits = [
    "Aumenta la productividad hasta 40%",
    "Reduce costos operativos",
    "Toma decisiones basadas en datos",
    "Acceso desde cualquier dispositivo",
    "Soporte técnico especializado",
    "Actualizaciones automáticas"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-lg border-b border-green-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Sprout className="w-8 h-8 text-green-600" />
              <span className="text-2xl font-bold text-green-800">AgroCooperativa</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-green-600 transition">Funcionalidades</a>
              <a href="#benefits" className="text-gray-700 hover:text-green-600 transition">Beneficios</a>
              <a href="#pricing" className="text-gray-700 hover:text-green-600 transition">Planes</a>
              <button
                onClick={() => navigate('/super-admin')}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 transition text-sm"
                title="Panel de Administración"
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Admin
              </button>
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-green-600 hover:text-green-700 transition"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register?type=cliente')}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-lg"
              >
                Comenzar Gratis
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-700"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-green-600">Funcionalidades</a>
              <a href="#benefits" className="block text-gray-700 hover:text-green-600">Beneficios</a>
              <a href="#pricing" className="block text-gray-700 hover:text-green-600">Planes</a>
              <button
                onClick={() => navigate('/super-admin')}
                className="block w-full text-left text-gray-500 hover:text-gray-700 text-sm"
              >
                <Shield className="w-4 h-4 inline mr-1" />
                Admin
              </button>
              <button
                onClick={() => navigate('/login')}
                className="block w-full text-left text-gray-700 hover:text-green-600"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => navigate('/register?type=cliente')}
                className="block w-full px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Comenzar Gratis
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 bg-green-100 text-green-700 px-4 py-2 rounded-full mb-6">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">Plataforma SaaS Multi-Tenant</span>
              </div>
              
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Gestión Agrícola
                <span className="text-green-600"> Inteligente</span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Sistema completo para cooperativas agrícolas con IA, análisis predictivo y gestión en la nube. 
                Optimiza tu producción y toma decisiones basadas en datos.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => navigate('/register?type=cliente')}
                  className="px-8 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition shadow-xl flex items-center justify-center space-x-2 text-lg font-semibold"
                >
                  <span>Comenzar Gratis</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="px-8 py-4 bg-white text-green-600 border-2 border-green-600 rounded-lg hover:bg-green-50 transition text-lg font-semibold"
                >
                  Iniciar Sesión
                </button>
              </div>

              <div className="mt-8 flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Sin tarjeta de crédito</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Configuración en 5 minutos</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition duration-300">
                <img 
                  src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=600&h=400&fit=crop" 
                  alt="Agricultura" 
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 bg-white rounded-lg shadow-xl p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="w-8 h-8 text-green-600" />
                  <div>
                    <p className="text-2xl font-bold text-gray-900">+40%</p>
                    <p className="text-sm text-gray-600">Productividad</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Funcionalidades Completas
            </h2>
            <p className="text-xl text-gray-600">
              Todo lo que necesitas para gestionar tu cooperativa agrícola
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 hover:shadow-xl transition transform hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-green-600 text-white rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">
                ¿Por qué elegir AgroCooperativa?
              </h2>
              <p className="text-xl text-green-100 mb-8">
                Más de 50 cooperativas confían en nuestra plataforma para optimizar sus operaciones
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                    <span className="text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Usuarios Activos</span>
                  <span className="text-2xl font-bold">1,200+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Hectáreas Gestionadas</span>
                  <span className="text-2xl font-bold">15,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Reportes Generados</span>
                  <span className="text-2xl font-bold">50,000+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-green-100">Satisfacción</span>
                  <span className="text-2xl font-bold">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Planes Flexibles
            </h2>
            <p className="text-xl text-gray-600">
              Elige el plan que mejor se adapte a tu cooperativa
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Plan Básico */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Básico</h3>
              <p className="text-gray-600 mb-6">Para cooperativas pequeñas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$49</span>
                <span className="text-gray-600">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Hasta 50 usuarios</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Gestión de parcelas</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Reportes básicos</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Soporte por email</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('Básico', 49)}
                className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Comenzar
              </button>
            </div>

            {/* Plan Profesional */}
            <div className="bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-xl shadow-2xl p-8 transform scale-105 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                Más Popular
              </div>
              <h3 className="text-2xl font-bold mb-2">Profesional</h3>
              <p className="text-green-100 mb-6">Para cooperativas en crecimiento</p>
              <div className="mb-6">
                <span className="text-4xl font-bold">$99</span>
                <span className="text-green-100">/mes</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Usuarios ilimitados</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>IA y Machine Learning</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Clima inteligente</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Chatbot con IA</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span>Soporte prioritario</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('Profesional', 99)}
                className="w-full px-6 py-3 bg-white text-green-600 rounded-lg hover:bg-green-50 transition font-semibold"
              >
                Seleccionar Plan
              </button>
            </div>

            {/* Plan Enterprise */}
            <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
              <p className="text-gray-600 mb-6">Para grandes cooperativas</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">Custom</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Todo lo de Profesional</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Servidor dedicado</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Personalización completa</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Soporte 24/7</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span>Capacitación incluida</span>
                </li>
              </ul>
              <button 
                onClick={() => handleSubscribe('Enterprise', 'Custom')}
                className="w-full px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition"
              >
                Seleccionar Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-emerald-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Globe className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-4xl font-bold mb-4">
            ¿Listo para transformar tu cooperativa?
          </h2>
          <p className="text-xl text-green-100 mb-8">
            Únete a las cooperativas que ya están optimizando su producción con tecnología de punta
          </p>
          <button
            onClick={() => navigate('/register?type=cliente')}
            className="px-8 py-4 bg-white text-green-600 rounded-lg hover:bg-green-50 transition shadow-xl text-lg font-semibold inline-flex items-center space-x-2"
          >
            <span>Comenzar Gratis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
            <button
              onClick={() => setShowPaymentModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Método de Pago
              </h3>
              <p className="text-gray-600">
                Plan {selectedPlan?.name} - ${selectedPlan?.price}{selectedPlan?.price !== 'Custom' && '/mes'}
              </p>
            </div>

            <form onSubmit={handlePaymentSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Tarjeta
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={paymentData.cardNumber}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      cardNumber: formatCardNumber(e.target.value)
                    })}
                    placeholder="1234 5678 9012 3456"
                    maxLength="19"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <CreditCard className="absolute right-3 top-3.5 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre en la Tarjeta
                </label>
                <input
                  type="text"
                  value={paymentData.cardName}
                  onChange={(e) => setPaymentData({
                    ...paymentData,
                    cardName: e.target.value.toUpperCase()
                  })}
                  placeholder="JUAN PÉREZ"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Expiración
                  </label>
                  <input
                    type="text"
                    value={paymentData.expiryDate}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      expiryDate: formatExpiryDate(e.target.value)
                    })}
                    placeholder="MM/AA"
                    maxLength="5"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVV
                  </label>
                  <input
                    type="text"
                    value={paymentData.cvv}
                    onChange={(e) => setPaymentData({
                      ...paymentData,
                      cvv: e.target.value.replace(/\D/g, '')
                    })}
                    placeholder="123"
                    maxLength="4"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start space-x-3">
                <Lock className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-800">
                  Tu información está protegida con encriptación SSL de 256 bits
                </p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold text-lg shadow-lg"
              >
                Confirmar Pago
              </button>

              <p className="text-xs text-center text-gray-500">
                Al confirmar, aceptas nuestros términos y condiciones
              </p>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Sprout className="w-6 h-6 text-green-500" />
                <span className="text-xl font-bold text-white">AgroCooperativa</span>
              </div>
              <p className="text-sm">
                Plataforma SaaS para gestión agrícola inteligente
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Producto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-green-500">Funcionalidades</a></li>
                <li><a href="#pricing" className="hover:text-green-500">Precios</a></li>
                <li><a href="#" className="hover:text-green-500">Integraciones</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500">Sobre Nosotros</a></li>
                <li><a href="#" className="hover:text-green-500">Blog</a></li>
                <li><a href="#" className="hover:text-green-500">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-green-500">Privacidad</a></li>
                <li><a href="#" className="hover:text-green-500">Términos</a></li>
                <li><a href="#" className="hover:text-green-500">Seguridad</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
            <p>&copy; 2024 AgroCooperativa. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
