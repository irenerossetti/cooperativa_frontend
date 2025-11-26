import { useState, useEffect } from 'react';
import { Sprout, TrendingUp, AlertCircle, CheckCircle, Leaf, BarChart3, Download } from 'lucide-react';

const PlanesFertilizacion = () => {
  const [selectedCrop, setSelectedCrop] = useState('papa');
  const [loading, setLoading] = useState(false);

  // Datos simulados de planes de fertilización por cultivo
  const fertilizationPlans = {
    papa: {
      name: 'Papa',
      stages: [
        { stage: 'Siembra', days: '0-15', npk: '10-30-10', quantity: '200 kg/ha', cost: 'Bs. 800' },
        { stage: 'Desarrollo', days: '30-45', npk: '20-10-20', quantity: '150 kg/ha', cost: 'Bs. 600' },
        { stage: 'Tuberización', days: '60-75', npk: '15-5-30', quantity: '180 kg/ha', cost: 'Bs. 720' },
        { stage: 'Maduración', days: '90-100', npk: '0-0-20', quantity: '100 kg/ha', cost: 'Bs. 400' }
      ],
      totalCost: 'Bs. 2,520',
      expectedYield: '25-30 ton/ha',
      recommendations: [
        'Aplicar fertilizante en bandas a 5-10 cm del tubérculo',
        'Evitar aplicación en días lluviosos',
        'Complementar con materia orgánica (10 ton/ha)',
        'Monitorear pH del suelo (óptimo 5.5-6.5)'
      ]
    },
    maiz: {
      name: 'Maíz',
      stages: [
        { stage: 'Siembra', days: '0-10', npk: '18-46-0', quantity: '150 kg/ha', cost: 'Bs. 675' },
        { stage: 'V6-V8', days: '30-40', npk: '46-0-0', quantity: '200 kg/ha', cost: 'Bs. 800' },
        { stage: 'Floración', days: '50-60', npk: '20-10-10', quantity: '120 kg/ha', cost: 'Bs. 480' }
      ],
      totalCost: 'Bs. 1,955',
      expectedYield: '8-10 ton/ha',
      recommendations: [
        'Primera aplicación al momento de siembra',
        'Segunda aplicación cuando planta tenga 6-8 hojas',
        'Aplicar nitrógeno fraccionado para mejor aprovechamiento',
        'Considerar análisis de suelo previo'
      ]
    },
    quinua: {
      name: 'Quinua',
      stages: [
        { stage: 'Siembra', days: '0-15', npk: '10-20-10', quantity: '100 kg/ha', cost: 'Bs. 400' },
        { stage: 'Ramificación', days: '40-50', npk: '20-10-10', quantity: '80 kg/ha', cost: 'Bs. 320' },
        { stage: 'Panojamiento', days: '70-80', npk: '15-5-20', quantity: '60 kg/ha', cost: 'Bs. 240' }
      ],
      totalCost: 'Bs. 960',
      expectedYield: '1.5-2 ton/ha',
      recommendations: [
        'Quinua es cultivo de bajo requerimiento',
        'Evitar exceso de nitrógeno (causa acame)',
        'Priorizar fósforo en suelos andinos',
        'Aplicar abono orgánico como base'
      ]
    }
  };

  const plan = fertilizationPlans[selectedCrop];

  // Datos para gráfico comparativo
  const comparisonData = [
    { crop: 'Papa', cost: 2520, yield: 27.5, efficiency: 10.9 },
    { crop: 'Maíz', cost: 1955, yield: 9, efficiency: 4.6 },
    { crop: 'Quinua', cost: 960, yield: 1.75, efficiency: 1.8 }
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Leaf className="w-8 h-8 text-green-600" />
            <span>Planes Personalizados de Fertilización</span>
          </h1>
          <p className="text-gray-600 mt-1">Recomendaciones inteligentes según cultivo y etapa fenológica</p>
        </div>
        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
          <Download className="w-4 h-4" />
          <span>Exportar PDF</span>
        </button>
      </div>

      {/* Selector de Cultivo */}
      <div className="bg-white rounded-lg shadow p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Seleccionar Cultivo
        </label>
        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
        >
          <option value="papa">Papa</option>
          <option value="maiz">Maíz</option>
          <option value="quinua">Quinua</option>
        </select>
      </div>

      {/* Plan de Fertilización */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Etapas */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Plan de Fertilización - {plan.name}</h2>
            <p className="text-sm text-gray-600 mt-1">Aplicaciones recomendadas por etapa fenológica</p>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {plan.stages.map((stage, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 hover:border-green-500 transition">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-semibold">{index + 1}</span>
                        </div>
                        <h3 className="font-semibold text-gray-900">{stage.stage}</h3>
                        <span className="text-sm text-gray-500">({stage.days} días)</span>
                      </div>
                      <div className="ml-10 grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Fórmula NPK:</span>
                          <p className="font-semibold text-gray-900">{stage.npk}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Cantidad:</span>
                          <p className="font-semibold text-gray-900">{stage.quantity}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Costo:</span>
                          <p className="font-semibold text-green-600">{stage.cost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Resumen */}
            <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">Costo Total Estimado:</span>
                  <p className="text-2xl font-bold text-green-600">{plan.totalCost}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Rendimiento Esperado:</span>
                  <p className="text-2xl font-bold text-gray-900">{plan.expectedYield}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recomendaciones */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-blue-600" />
              <span>Recomendaciones IA</span>
            </h2>
          </div>
          <div className="p-6">
            <div className="space-y-3">
              {plan.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{rec}</p>
                </div>
              ))}
            </div>

            {/* Alerta Climática */}
            <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">Alerta Climática</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Pronóstico de lluvia en 48h. Posponer aplicación foliar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gráfico Comparativo */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <BarChart3 className="w-5 h-5 text-green-600" />
          <span>Análisis Comparativo de Cultivos</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {comparisonData.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">{item.crop}</h3>
              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Costo/ha</span>
                    <span className="font-semibold">Bs. {item.cost}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(item.cost / 2520) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Rendimiento</span>
                    <span className="font-semibold">{item.yield} ton/ha</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(item.yield / 27.5) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Eficiencia</span>
                    <span className="font-semibold">{item.efficiency} kg/Bs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(item.efficiency / 10.9) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanesFertilizacion;
