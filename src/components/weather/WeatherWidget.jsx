import { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, AlertTriangle, MapPin, Clock } from 'lucide-react';
import api from '../../services/api';

// Ciudades principales de Bolivia
const BOLIVIA_CITIES = [
  { name: 'Santa Cruz', lat: -17.78, lon: -63.18 },
  { name: 'La Paz', lat: -16.50, lon: -68.15 },
  { name: 'Cochabamba', lat: -17.39, lon: -66.16 },
  { name: 'Sucre', lat: -19.03, lon: -65.26 },
  { name: 'Tarija', lat: -21.53, lon: -64.73 },
  { name: 'Potosí', lat: -19.58, lon: -65.75 },
  { name: 'Oruro', lat: -17.98, lon: -67.13 },
  { name: 'Trinidad', lat: -14.83, lon: -64.90 },
  { name: 'Cobija', lat: -11.03, lon: -68.73 }
];

const WeatherWidget = ({ lat: initialLat = -17.78, lon: initialLon = -63.18 }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState(BOLIVIA_CITIES[0]);
  const [showHourly, setShowHourly] = useState(false);
  const [lat, setLat] = useState(initialLat);
  const [lon, setLon] = useState(initialLon);

  useEffect(() => {
    fetchWeather();
    // Actualizar cada 30 minutos
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);
    return () => clearInterval(interval);
  }, [lat, lon]);

  const fetchWeather = async () => {
    try {
      const response = await api.get(`/api/weather/agricultural/?lat=${lat}&lon=${lon}`);
      setWeather(response.data.data);
    } catch (error) {
      console.error('Error al cargar clima:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCityChange = (city) => {
    setSelectedCity(city);
    setLat(city.lat);
    setLon(city.lon);
    setLoading(true);
  };

  const getWeatherIcon = (icon) => {
    if (icon?.includes('01')) return <Sun className="w-12 h-12 text-yellow-400" />;
    if (icon?.includes('02') || icon?.includes('03')) return <Cloud className="w-12 h-12 text-gray-300" />;
    if (icon?.includes('09') || icon?.includes('10')) return <CloudRain className="w-12 h-12 text-blue-400" />;
    return <Cloud className="w-12 h-12 text-gray-300" />;
  };

  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 animate-pulse">
        <div className="h-48 bg-white/5 rounded"></div>
      </div>
    );
  }

  if (!weather) return null;

  const { current, forecast, alerts, recommendations } = weather;

  return (
    <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 backdrop-blur-lg border border-blue-400/30 rounded-xl p-6">
      {/* Header with City Selector */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Clima Actual</h3>
          {getWeatherIcon(current.icon)}
        </div>
        
        {/* City Selector */}
        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-300" />
          <select
            value={selectedCity.name}
            onChange={(e) => {
              const city = BOLIVIA_CITIES.find(c => c.name === e.target.value);
              if (city) handleCityChange(city);
            }}
            className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none cursor-pointer"
          >
            {BOLIVIA_CITIES.map(city => (
              <option key={city.name} value={city.name} className="bg-gray-800">
                {city.name}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => setShowHourly(false)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              !showHourly 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            Días
          </button>
          <button
            onClick={() => setShowHourly(true)}
            className={`flex-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center space-x-1 ${
              showHourly 
                ? 'bg-blue-500 text-white' 
                : 'bg-white/10 text-blue-200 hover:bg-white/20'
            }`}
          >
            <Clock className="w-3 h-3" />
            <span>Horas</span>
          </button>
        </div>
      </div>

      {/* Temperatura y condiciones */}
      <div className="mb-4">
        <div className="flex items-baseline space-x-2">
          <span className="text-5xl font-bold text-white">{current.temperature}°</span>
          <span className="text-xl text-blue-200">C</span>
        </div>
        <p className="text-blue-200 mt-1">{current.description}</p>
        <p className="text-blue-200/60 text-sm">Sensación: {current.feels_like}°C</p>
      </div>

      {/* Detalles */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Droplets className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">Humedad</span>
          </div>
          <p className="text-white font-semibold mt-1">{current.humidity}%</p>
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Wind className="w-4 h-4 text-blue-300" />
            <span className="text-blue-200 text-sm">Viento</span>
          </div>
          <p className="text-white font-semibold mt-1">{current.wind_speed} km/h</p>
        </div>
      </div>

      {/* Pronóstico */}
      <div className="mb-4">
        <h4 className="text-white font-medium text-sm mb-2">
          {showHourly ? 'Próximas horas' : 'Próximos días'}
        </h4>
        <div className="space-y-2">
          {showHourly ? (
            // Vista por hora (simulada - en producción vendría del API)
            <>
              {[
                { time: 'Ahora', temp: current.temperature, icon: current.icon, rain: 10 },
                { time: '+3h', temp: current.temperature + 2, icon: current.icon, rain: 15 },
                { time: '+6h', temp: current.temperature + 3, icon: current.icon, rain: 20 },
                { time: '+9h', temp: current.temperature + 1, icon: current.icon, rain: 25 },
                { time: '+12h', temp: current.temperature - 2, icon: current.icon, rain: 30 }
              ].map((hour, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200 text-sm w-12">{hour.time}</span>
                  <div className="flex items-center space-x-2 flex-1 justify-center">
                    {getWeatherIcon(hour.icon)}
                    <span className="text-white text-sm">{hour.temp}°C</span>
                  </div>
                  <span className="text-blue-300 text-xs">💧 {hour.rain}%</span>
                </div>
              ))}
            </>
          ) : (
            // Vista por días
            <>
              {forecast?.slice(0, 3).map((day, index) => (
                <div key={index} className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                  <span className="text-blue-200 text-sm">{day.day_name}</span>
                  <div className="flex items-center space-x-2">
                    {getWeatherIcon(day.icon)}
                    <span className="text-white text-sm">{day.temp_max}° / {day.temp_min}°</span>
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Alertas */}
      {alerts && alerts.length > 0 && (
        <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-3">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-200 text-sm font-medium">Alertas</p>
              {alerts.map((alert, index) => (
                <p key={index} className="text-yellow-200/80 text-xs mt-1">{alert.message}</p>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recomendaciones */}
      {recommendations && recommendations.length > 0 && (
        <div className="mt-3 bg-green-500/20 border border-green-500/30 rounded-lg p-3">
          <p className="text-green-200 text-sm font-medium mb-1">Recomendaciones</p>
          {recommendations.slice(0, 2).map((rec, index) => (
            <p key={index} className="text-green-200/80 text-xs mt-1">• {rec}</p>
          ))}
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
