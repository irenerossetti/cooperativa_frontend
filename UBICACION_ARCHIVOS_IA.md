# 📍 Ubicación de Archivos - Sistema de IA

## 🎤 Asistente de Voz

### Componente:
```
Frontend/src/components/reports/VoiceReportAssistant.jsx
```

**Descripción**: Componente React que implementa el reconocimiento de voz y síntesis de voz.

**Características**:
- Reconocimiento de voz en español (Web Speech API)
- Respuestas por voz (Speech Synthesis)
- Procesamiento de comandos naturales
- Extracción de filtros de la voz
- Interfaz visual con animaciones

**Cómo usarlo**:
```jsx
import VoiceReportAssistant from '../../components/reports/VoiceReportAssistant';

<VoiceReportAssistant 
  onReportRequest={(command) => {
    console.log('Comando recibido:', command);
    // Manejar el comando
  }} 
/>
```

---

## 🧠 Random Forest (Machine Learning)

### Backend - Lógica del Modelo:
```
Backend/reports/ml_predictions.py
```

**Clases principales**:
- `YieldPredictor`: Modelo Random Forest para predecir rendimientos
- `ProductionForecaster`: Predicciones de producción futura

**Funciones**:
- `train()`: Entrena el modelo con datos históricos
- `predict_yield()`: Predice rendimiento de una parcela
- `get_feature_importance()`: Importancia de factores

### Backend - Endpoints API:
```
Backend/reports/views.py
```

**Endpoints agregados**:
- `POST /api/reports/reports/train_ml_model/`
- `GET /api/reports/reports/predict_yield/?parcel_id=1`
- `GET /api/reports/reports/predict_partner_production/?partner_id=1`
- `GET /api/reports/reports/ml_insights/`

---

## 📊 Página de Reportes con IA

### Frontend - Página Principal:
```
Frontend/src/pages/reports/ReportesIA.jsx
```

**Descripción**: Página completa que integra:
- Asistente de voz
- Control del modelo ML (entrenar/predecir)
- Visualización de predicciones
- Gráficos de importancia de factores
- Selector de parcelas

**Cómo acceder**:
Necesitas agregar la ruta en tu router de React:

```jsx
// En tu archivo de rutas (App.jsx o similar)
import ReportesIA from './pages/reports/ReportesIA';

<Route path="/reportes/ia" element={<ReportesIA />} />
```

---

## 🎨 Componentes Auxiliares

### Selector de Columnas:
```
Frontend/src/components/reports/ColumnSelector.jsx
```

### Gráficos Simples:
```
Frontend/src/components/reports/SimpleBarChart.jsx
```

---

## 📂 Estructura Completa

```
Frontend/
├── src/
│   ├── components/
│   │   └── reports/
│   │       ├── VoiceReportAssistant.jsx    ← ASISTENTE DE VOZ
│   │       ├── ColumnSelector.jsx          ← Selector de columnas
│   │       └── SimpleBarChart.jsx          ← Gráficos
│   └── pages/
│       └── reports/
│           ├── ReportesIA.jsx              ← PÁGINA PRINCIPAL IA
│           ├── ProduccionPorParcela.jsx    ← Con selector dinámico
│           ├── ProduccionPorCampana.jsx    ← Con selector dinámico
│           └── LaboresPorCampana.jsx       ← Con selector dinámico

Backend/
├── reports/
│   ├── ml_predictions.py                   ← RANDOM FOREST
│   ├── views.py                            ← Endpoints API
│   └── models/
│       └── yield_predictor.pkl             ← Modelo entrenado
```

---

## 🚀 Cómo Integrar en tu Aplicación

### 1. Agregar Ruta en el Router:

```jsx
// En Frontend/src/App.jsx o tu archivo de rutas
import ReportesIA from './pages/reports/ReportesIA';

// Dentro de tus rutas:
<Route path="/reportes/ia" element={<ReportesIA />} />
```

### 2. Agregar en el Menú/Sidebar:

```jsx
// En tu componente de navegación
<Link to="/reportes/ia">
  <Brain className="w-5 h-5" />
  <span>Reportes con IA</span>
</Link>
```

### 3. Verificar que el Backend esté corriendo:

```bash
cd Backend
.\venv\Scripts\python.exe manage.py runserver
```

### 4. Probar el Sistema:

1. Navega a `http://localhost:3000/reportes/ia` (o tu puerto de frontend)
2. Haz clic en "Entrenar Modelo"
3. Espera a que termine el entrenamiento
4. Haz clic en "Predecir Rendimiento"
5. Prueba el asistente de voz haciendo clic en el micrófono

---

## 🎤 Comandos de Voz Disponibles

El asistente entiende estos comandos:

- "Muestra producción por parcela"
- "Genera reporte de labores"
- "Predice rendimiento de parcela"
- "Exportar en Excel"
- "Producción mayor a 100"
- "Reporte del socio [nombre]"

---

## 🔧 Troubleshooting

### No veo el asistente de voz:
1. Verifica que la ruta `/reportes/ia` esté agregada en tu router
2. Verifica que el componente `ReportesIA.jsx` esté importado correctamente
3. Abre la consola del navegador para ver errores

### El asistente dice "Navegador no soporta voz":
- Usa Google Chrome o Microsoft Edge
- Firefox y Safari tienen soporte limitado

### El Random Forest no funciona:
1. Verifica que las librerías estén instaladas: `pip list | grep scikit-learn`
2. Verifica que el servidor esté corriendo con el venv activado
3. Genera datos de prueba: `python create_production_data.py`

---

## 📚 Documentación Adicional

- `Backend/REPORTES_IA_IMPLEMENTACION.md` - Documentación técnica completa
- `Backend/GUIA_RAPIDA_REPORTES_IA.md` - Guía rápida de uso
- `Frontend/REPORTES_DINAMICOS_EXPLICACION.md` - Reportes dinámicos vs estáticos

---

**¡Todos los archivos están creados y listos para usar!** 🎉
