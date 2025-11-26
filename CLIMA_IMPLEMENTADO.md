# 🌤️ Sistema de Clima Implementado

## ✅ Lo que se Implementó

### Backend (Django)
1. **Servicio de Clima** (`weather_service.py`)
   - Integración con OpenWeatherMap API
   - Datos simulados si no hay API key
   - Cálculos agrícolas específicos

2. **Endpoints REST**
   - `GET /api/weather/current/` - Clima actual
   - `GET /api/weather/forecast/` - Pronóstico 5 días
   - `GET /api/weather/agricultural/` - Datos agrícolas + alertas
   - `GET /api/weather/parcel/<id>/` - Clima por parcela

3. **Funcionalidades Agrícolas**
   - Alertas automáticas (lluvia, viento, temperatura)
   - Recomendaciones contextuales
   - Índices agrícolas (riego, fumigación, cosecha)

### Frontend (React)
1. **WeatherWidget** - Componente compacto
   - Clima actual con temperatura
   - Pronóstico 3 días
   - Alertas y recomendaciones
   - Auto-actualización cada 30 min

## 🎯 Cómo Usar

### 1. Obtener API Key (GRATIS)

1. Ve a: https://openweathermap.org/api
2. Crea cuenta gratis
3. Ve a "API keys"
4. Copia tu key
5. Agrégala al `.env`:
   ```
   OPENWEATHER_API_KEY=tu_key_aqui
   ```

### 2. Agregar Widget al Dashboard

Edita `Frontend/src/pages/Dashboard.jsx`:

```jsx
import WeatherWidget from '../components/weather/WeatherWidget';

// Dentro del componente:
<WeatherWidget lat={-17.78} lon={-63.18} />
```

### 3. Probar los Endpoints

```bash
# Clima actual
GET /api/weather/current/?lat=-17.78&lon=-63.18

# Pronóstico
GET /api/weather/forecast/?lat=-17.78&lon=-63.18&days=5

# Datos agrícolas
GET /api/weather/agricultural/?lat=-17.78&lon=-63.18

# Clima de una parcela
GET /api/weather/parcel/1/
```

## 📊 Datos que Proporciona

### Clima Actual
- 🌡️ Temperatura (actual, mín, máx, sensación)
- 💧 Humedad
- 💨 Viento (velocidad y dirección)
- ☁️ Nubosidad
- 🌅 Amanecer/Atardecer
- 📍 Ubicación

### Pronóstico (5 días)
- Temperatura mín/máx
- Descripción del clima
- Probabilidad de lluvia
- Velocidad del viento
- Nubosidad

### Datos Agrícolas
- **Alertas Automáticas:**
  - ⚠️ Lluvia próxima (>70%)
  - 💨 Vientos fuertes (>20 km/h)
  - 🌡️ Temperatura extrema (<5°C o >35°C)

- **Recomendaciones:**
  - Cuándo aplicar productos
  - Necesidad de riego
  - Condiciones para cosecha

- **Índices (0-100):**
  - Necesidad de riego
  - Condiciones para fumigación
  - Condiciones para cosecha

## 🎨 Diseño del Widget

```
┌─────────────────────────────┐
│  🌤️ Clima Actual            │
│  Santa Cruz, BO             │
│                             │
│  28°C                       │
│  Parcialmente nublado       │
│  Sensación: 30°C            │
│                             │
│  💧 Humedad    💨 Viento    │
│     65%          12 km/h    │
│                             │
│  Próximos días:             │
│  Lun  ☀️ 30° / 20°         │
│  Mar  🌧️ 25° / 18°         │
│  Mié  ⛅ 27° / 19°         │
│                             │
│  ⚠️ Alertas                 │
│  Alta probabilidad de       │
│  lluvia mañana              │
│                             │
│  ✅ Recomendaciones         │
│  • Posponer fumigación      │
│  • Revisar drenajes         │
└─────────────────────────────┘
```

## 🔧 Configuración

### Sin API Key (Modo Demo)
- Usa datos simulados automáticamente
- Perfecto para desarrollo
- No requiere configuración

### Con API Key (Producción)
1. Obtén key gratis en OpenWeatherMap
2. Agrégala al `.env`
3. Reinicia el servidor
4. ¡Listo! Datos reales

## 📈 Límites del Plan Gratuito

**OpenWeatherMap Free:**
- ✅ 1,000 llamadas/día
- ✅ Clima actual
- ✅ Pronóstico 5 días
- ✅ Datos cada 3 horas
- ❌ No incluye pronóstico 16 días
- ❌ No incluye datos históricos

**Para tu uso:**
- Widget se actualiza cada 30 min
- ~50 llamadas/día por usuario
- Suficiente para 20 usuarios activos

## 🚀 Próximas Mejoras

### Fáciles:
- [ ] Agregar más ubicaciones
- [ ] Gráficos de temperatura
- [ ] Notificaciones push de alertas
- [ ] Historial de clima

### Avanzadas:
- [ ] Mapa de clima interactivo
- [ ] Predicción de plagas basada en clima
- [ ] Recomendaciones de cultivos por clima
- [ ] Integración con sistema de riego automático

## 💡 Ejemplos de Uso

### En Dashboard Principal
```jsx
<WeatherWidget />
```

### Para una Parcela Específica
```jsx
<WeatherWidget lat={parcel.latitude} lon={parcel.longitude} />
```

### En Página de Parcelas
```jsx
{parcels.map(parcel => (
  <div key={parcel.id}>
    <h3>{parcel.name}</h3>
    <WeatherWidget 
      lat={parcel.latitude} 
      lon={parcel.longitude} 
    />
  </div>
))}
```

## 🐛 Solución de Problemas

### No muestra datos reales
1. Verifica que `OPENWEATHER_API_KEY` esté en `.env`
2. Reinicia el servidor Django
3. Revisa la consola del backend para errores

### Datos desactualizados
- El widget se actualiza cada 30 minutos
- Refresca la página para forzar actualización

### Coordenadas incorrectas
- Verifica lat/lon de tus parcelas
- Santa Cruz: lat=-17.78, lon=-63.18

## ✅ Estado Actual

**Sistema de Clima: 100% Funcional** 🎉
- Backend implementado ✅
- Servicio de clima ✅
- Endpoints REST ✅
- Widget frontend ✅
- Alertas agrícolas ✅
- Recomendaciones ✅
- Modo demo (sin API key) ✅

¡El sistema de clima está listo para usar!
