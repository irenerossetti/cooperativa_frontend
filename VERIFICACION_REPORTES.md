# 🔍 VERIFICACIÓN DE REPORTES - GUÍA RÁPIDA

## ✅ DATOS CREADOS

Se han creado exitosamente:
- **11 Comunidades** (San Juan, El Progreso, La Esperanza, Villa Nueva, Santa Rosa, etc.)
- **11 Socios** (todos asignados a comunidades)
- **6 Parcelas** (con cultivos)
- **44 Productos cosechados** (Papa, Quinua, Maíz, Trigo, Cebada)

## 🚀 PASOS PARA VERIFICAR

### 1. Verificar que el Backend esté corriendo
```bash
cd Backend
python manage.py runserver
```

### 2. Verificar que el Frontend esté corriendo
```bash
cd Frontend
npm run dev
```

### 3. Acceder a los Reportes

#### A. Socios por Comunidad
- **URL**: `http://localhost:5173/reports/partners-community`
- **Debe mostrar**:
  - Lista de comunidades
  - Total de socios por comunidad
  - Socios activos/inactivos
  - Producción total
  - Gráficos de barras

#### B. Hectáreas por Cultivo
- **URL**: `http://localhost:5173/reports/hectares-crop`
- **Debe mostrar**:
  - Lista de cultivos
  - Hectáreas totales por cultivo
  - Número de parcelas
  - Porcentajes
  - Gráficos

#### C. Reportes con IA
- **URL**: `http://localhost:5173/reports/ia`
- **Debe mostrar**:
  - Predicciones de rendimiento
  - Análisis con Random Forest
  - Recomendaciones

### 4. Verificar Dashboard
- **URL**: `http://localhost:5173/dashboard`
- **Debe mostrar**:
  - Widget de Clima (arriba izquierda)
  - Widget de Fertilización IA (abajo izquierda)
  - Widget de Reportes Rápidos (arriba derecha)
  - Widget de Alertas Comerciales (abajo derecha)

## 🐛 SI LAS PÁGINAS ESTÁN EN BLANCO

### Opción 1: Verificar la Consola del Navegador
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Console"
3. Busca errores en rojo
4. Los errores comunes son:
   - `Cannot read property 'map' of undefined` → Los datos no están llegando
   - `404 Not Found` → El endpoint no existe
   - `401 Unauthorized` → No estás autenticado

### Opción 2: Verificar que estés autenticado
1. Ve a `http://localhost:5173/login`
2. Inicia sesión con:
   - **Usuario**: admin
   - **Contraseña**: admin123
3. Luego navega a los reportes

### Opción 3: Verificar los Endpoints del Backend
```bash
cd Backend
python test_reports_endpoints.py
```

Esto probará todos los endpoints y te dirá si están funcionando.

### Opción 4: Verificar la Red
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca las peticiones a `/api/reports/`
5. Verifica:
   - **Status**: Debe ser 200
   - **Response**: Debe tener datos JSON

## 📊 ENDPOINTS DISPONIBLES

### Backend (Django)
- `GET /api/reports/reports/partners_by_community/` - Socios por comunidad
- `GET /api/reports/reports/hectares_by_crop/` - Hectáreas por cultivo
- `GET /api/reports/reports/fertilization_plan/` - Plan de fertilización IA
- `GET /api/reports/reports/price_alerts/` - Alertas comerciales IA
- `GET /api/reports/reports/performance_by_parcel/` - Rendimiento por parcela
- `GET /api/reports/reports/performance_by_partner/` - Rendimiento por socio

### Frontend (React)
- `/reports/partners-community` - Socios por Comunidad
- `/reports/hectares-crop` - Hectáreas por Cultivo
- `/reports/production-plot` - Producción por Parcela
- `/reports/production-campaign` - Producción por Campaña
- `/reports/labors` - Labores por Campaña
- `/reports/ia` - Reportes con IA

## 🔧 SOLUCIÓN RÁPIDA

Si las páginas siguen en blanco, ejecuta esto:

```bash
# Backend
cd Backend
python create_community_data.py

# Luego reinicia el servidor
python manage.py runserver
```

```bash
# Frontend
cd Frontend
npm run dev
```

Luego:
1. Abre `http://localhost:5173`
2. Inicia sesión
3. Ve al menú "Reportes"
4. Haz clic en cualquier reporte

## ✅ VERIFICACIÓN EXITOSA

Si todo funciona correctamente, deberías ver:
- ✅ Datos en las tablas
- ✅ Gráficos con barras
- ✅ Estadísticas en tarjetas
- ✅ Botones de exportación funcionando
- ✅ Filtros y búsqueda funcionando
- ✅ Widgets del dashboard con datos reales

## 📞 SI NECESITAS AYUDA

1. Revisa la consola del navegador (F12 → Console)
2. Revisa la terminal del backend (errores de Django)
3. Revisa la terminal del frontend (errores de Vite)
4. Verifica que ambos servidores estén corriendo
5. Verifica que estés autenticado

## 🎯 PARA LA PRESENTACIÓN

Si todo funciona:
1. ✅ Muestra el dashboard con los 4 widgets
2. ✅ Navega por los 6 reportes
3. ✅ Exporta un reporte a Excel
4. ✅ Usa los filtros y búsqueda
5. ✅ Muestra el asistente de voz
6. ✅ Muestra el chatbot con IA

¡Listo para impresionar! 🚀
