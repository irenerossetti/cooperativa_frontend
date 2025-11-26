import { useNavigate } from 'react-router-dom';
import { DollarSign, TrendingUp, BarChart3, ArrowRight } from 'lucide-react';

const PriceAlertsWidget = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      icon: BarChart3,
      title: 'Análisis de Mercado',
      description: 'Ver tendencias y precios',
      color: 'from-blue-500 to-blue-600',
      action: () => navigate('/reports/ia')
    },
    {
      icon: TrendingUp,
      title: 'Oportunidades de Venta',
      description: 'Alertas comerciales activas',
      color: 'from-green-500 to-green-600',
      action: () => navigate('/reports/ia')
    },
    {
      icon: DollarSign,
      title: 'Precios en Tiempo Real',
      description: 'Consultar precios actuales',
      color: 'from-yellow-500 to-yellow-600',
      action: () => navigate('/reports/ia')
    }
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center space-x-2">
          <DollarSign className="w-5 h-5 text-yellow-400" />
          <span>Accesos Rápidos IA</span>
        </h3>
      </div>

      <div className="space-y-3">
        {quickActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <button
              key={index}
              onClick={action.action}
              className="w-full bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all group text-left"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{action.title}</p>
                    <p className="text-emerald-200/60 text-xs">{action.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-emerald-200/60 group-hover:text-emerald-200 group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-emerald-200/60 text-xs text-center">
          💡 Accede a análisis completos con IA
        </p>
      </div>
    </div>
  );
};

export default PriceAlertsWidget;
