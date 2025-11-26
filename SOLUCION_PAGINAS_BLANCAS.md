# 🔧 SOLUCIÓN: PÁGINAS DE REPORTES EN BLANCO

## 🎯 PROBLEMA
Los últimos 3 submódulos de reportes (Socios por Comunidad, Hectáreas por Cultivo, Reportes con IA) aparecen en blanco.

## ✅ SOLUCIÓN RÁPIDA

### Paso 1: Verificar que los datos existan
```bash
cd Backend
python create_community_data.py
```

**Resultado esperado:**
```
✅ Total comunidades: 11
✅ Socios: 11
✅ Parcelas: 6
✅ Productos cosechados: 44
```

### Paso 2: Reiniciar el Backend
```bash
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
python manage.py runserver
```

### Paso 3: Reiniciar el Frontend
```bash
cd Frontend
# Detener el servidor (Ctrl+C)
# Luego reiniciar:
npm run dev
```

### Paso 4: Limpiar caché del navegador
1. Abre el navegador
2. Presiona `Ctrl + Shift + Delete`
3. Selecciona "Caché" y "Cookies"
4. Haz clic en "Borrar datos"
5. Recarga la página con `Ctrl + F5`

### Paso 5: Verificar autenticación
1. Ve a `http://localhost:5173/login`
2. Inicia sesión:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. Navega a los reportes desde el menú

## 🐛 DIAGNÓSTICO

### Opción A: Abrir Consola del Navegador
1. Presiona `F12`
2. Ve a la pestaña "Console"
3. Busca errores en rojo

**Errores comunes:**
- `Cannot read property 'map' of undefined` → No hay datos
- `404 Not Found` → Endpoint no existe
- `401 Unauthorized` → No estás autenticado
- `Network Error` → Backend no está corriendo

### Opción B: Verificar Red
1. Presiona `F12`
2. Ve a la pestaña "Network"
3. Recarga la página
4. Busca peticiones a `/api/reports/`
5. Haz clic en cada petición y verifica:
   - **Status**: Debe ser `200 OK`
   - **Response**: Debe tener datos JSON

### Opción C: Probar Endpoints Directamente
```bash
cd Backend
python test_reports_endpoints.py
```

O manualmente en el navegador:
```
http://localhost:8000/api/reports/reports/partners_by_community/
http://localhost:8000/api/reports/reports/hectares_by_crop/
http://localhost:8000/api/reports/reports/fertilization_plan/
http://localhost:8000/api/reports/reports/price_alerts/
```

## 📋 CHECKLIST DE VERIFICACIÓN

- [ ] Backend está corriendo en `http://localhost:8000`
- [ ] Frontend está corriendo en `http://localhost:5173`
- [ ] Estás autenticado (iniciaste sesión)
- [ ] Los datos existen en la base de datos
- [ ] No hay errores en la consola del navegador
- [ ] Los endpoints responden con status 200
- [ ] El header `X-Organization` está configurado

## 🎨 LO QUE DEBERÍAS VER

### Socios por Comunidad (`/reports/partners-community`)
```
✅ 4 tarjetas de estadísticas (Total Comunidades, Total Socios, Socios Activos, Producción Total)
✅ 2 gráficos de barras (Socios por Comunidad, Producción por Comunidad)
✅ Tabla con datos de comunidades
✅ Botones de exportación (Excel, PDF, CSV)
✅ Filtros y búsqueda
✅ Asistente de voz
```

### Hectáreas por Cultivo (`/reports/hectares-crop`)
```
✅ 4 tarjetas de estadísticas (Tipos de Cultivo, Hectáreas Totales, Total Parcelas, Tamaño Promedio)
✅ 2 gráficos de barras (Hectáreas por Cultivo, Parcelas por Cultivo)
✅ Tabla con datos de cultivos
✅ Barras de progreso con porcentajes
✅ Botones de exportación
✅ Filtros y búsqueda
```

### Dashboard (`/dashboard`)
```
✅ Widget de Clima (pronóstico 5 días)
✅ Widget de Fertilización IA (recomendaciones)
✅ Widget de Reportes Rápidos (comunidades y cultivos)
✅ Widget de Alertas Comerciales (precios y oportunidades)
```

## 🚨 SI SIGUE EN BLANCO

### Solución 1: Verificar que el componente se exporta correctamente
Los archivos deben terminar con:
```javascript
export default NombreDelComponente;
```

### Solución 2: Verificar que las rutas están bien configuradas
En `App.jsx` debe estar:
```javascript
<Route path="/reports/partners-community" element={<SociosPorComunidad />} />
<Route path="/reports/hectares-crop" element={<HectareasPorCultivo />} />
<Route path="/reports/ia" element={<ReportesIA />} />
```

### Solución 3: Verificar que el Sidebar tiene los enlaces
En `Sidebar.jsx` debe estar:
```javascript
{ path: '/reports/partners-community', label: 'Socios por Comunidad', icon: Users },
{ path: '/reports/hectares-crop', label: 'Hectáreas por Cultivo', icon: Map },
{ path: '/reports/ia', label: 'Reportes con IA', icon: BarChart3 },
```

### Solución 4: Crear datos de prueba manualmente
Si el script no funcionó, crea datos manualmente:

1. Ve a `http://localhost:8000/admin`
2. Inicia sesión con admin/admin123
3. Crea:
   - 3-5 Comunidades
   - Asigna socios a comunidades
   - Crea parcelas con cultivos
   - Crea productos cosechados

## 🎯 PRUEBA FINAL

1. Abre `http://localhost:5173`
2. Inicia sesión
3. Ve al menú "Reportes"
4. Haz clic en "Socios por Comunidad"
5. Deberías ver:
   - Tarjetas con números
   - Gráficos con barras
   - Tabla con datos
   - Botones funcionando

Si ves todo esto: **¡ÉXITO! 🎉**

Si sigue en blanco: Revisa la consola del navegador (F12) y comparte el error.

## 📞 CONTACTO DE EMERGENCIA

Si nada funciona:
1. Toma captura de la consola del navegador (F12 → Console)
2. Toma captura de la terminal del backend
3. Toma captura de la terminal del frontend
4. Comparte las capturas para diagnóstico

## ✅ CONFIRMACIÓN FINAL

Para confirmar que todo funciona:
```bash
# Backend
cd Backend
python manage.py runserver
# Debe decir: Starting development server at http://127.0.0.1:8000/

# Frontend (en otra terminal)
cd Frontend
npm run dev
# Debe decir: Local: http://localhost:5173/
```

Luego abre `http://localhost:5173` y navega a los reportes.

**¡Listo para la presentación! 🚀**
