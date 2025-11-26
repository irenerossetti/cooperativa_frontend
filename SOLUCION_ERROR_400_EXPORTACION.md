# 🔧 SOLUCIÓN: Error 400 en Exportación de Reportes

## 🐛 PROBLEMA

Al intentar exportar los reportes de "Socios por Comunidad" y "Hectáreas por Cultivo", aparece el error:

```
Failed to load resource: the server responded with a status of 400 (Bad Request)
Error: AxiosError
```

## ✅ CAUSA

El servidor Django está usando una versión antigua del código que no incluye los nuevos métodos de exportación. Aunque los métodos existen en el archivo `views.py`, el servidor necesita ser reiniciado para cargar los cambios.

## 🚀 SOLUCIÓN RÁPIDA

### Paso 1: Detener el Servidor Backend
```bash
# En la terminal donde está corriendo el backend
# Presiona Ctrl + C para detener el servidor
```

### Paso 2: Reiniciar el Servidor Backend
```bash
cd Backend
python manage.py runserver
```

### Paso 3: Verificar que el Servidor Inició Correctamente
Deberías ver:
```
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.
```

### Paso 4: Probar la Exportación
1. Abre `http://localhost:5173/reports/partners-community`
2. Haz clic en "Excel", "PDF" o "CSV"
3. El archivo debería descargarse correctamente

## 🧪 VERIFICACIÓN

### Opción A: Verificar que los Métodos Existen
```bash
cd Backend
python test_export_endpoints.py
```

**Resultado esperado:**
```
✅ _get_performance_data existe
✅ _get_population_data existe
✅ _get_hectares_data existe
✅ _get_parcel_performance_data existe
✅ _get_partners_by_community_data existe
✅ _get_hectares_by_crop_data existe
```

### Opción B: Probar el Endpoint Directamente
Abre en el navegador:
```
http://localhost:8000/api/reports/reports/partners_by_community/
```

Deberías ver datos JSON con las comunidades.

### Opción C: Verificar en la Consola del Navegador
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña "Network"
3. Haz clic en "Excel" en el reporte
4. Busca la petición a `/api/reports/reports/export_report/`
5. Verifica:
   - **Status**: Debe ser `200 OK` (no 400)
   - **Response**: Debe ser un archivo binario

## 📋 CHECKLIST DE SOLUCIÓN

- [ ] Detener el servidor backend (Ctrl + C)
- [ ] Reiniciar el servidor backend (`python manage.py runserver`)
- [ ] Verificar que el servidor inició sin errores
- [ ] Limpiar caché del navegador (Ctrl + Shift + Delete)
- [ ] Recargar la página del reporte (Ctrl + F5)
- [ ] Probar exportación a Excel
- [ ] Probar exportación a PDF
- [ ] Probar exportación a CSV

## 🔍 SI EL PROBLEMA PERSISTE

### 1. Verificar que los Cambios se Guardaron
```bash
cd Backend
grep -n "_get_partners_by_community_data" reports/views.py
grep -n "_get_hectares_by_crop_data" reports/views.py
```

Deberías ver las líneas donde están definidos los métodos.

### 2. Verificar que No Hay Errores de Sintaxis
```bash
cd Backend
python -m py_compile reports/views.py
```

Si hay errores, se mostrarán aquí.

### 3. Verificar los Logs del Servidor
Revisa la terminal donde está corriendo el backend. Busca errores en rojo.

### 4. Verificar la Petición en el Frontend
Abre `Frontend/src/pages/reports/SociosPorComunidad.jsx` y verifica que la función `handleExport` tenga:

```javascript
const handleExport = async (format) => {
  try {
    const response = await api.post('/api/reports/reports/export_report/', {
      report_type: 'partners_by_community',  // ← Debe ser exactamente esto
      format: format
    }, {
      responseType: 'blob'
    });
    // ...
  }
};
```

### 5. Verificar el Endpoint en el Backend
Abre `Backend/reports/views.py` y verifica que en el método `export_report` esté:

```python
elif report_type == 'partners_by_community':
    data, headers = self._get_partners_by_community_data()
    title = 'Socios por Comunidad'
elif report_type == 'hectares_by_crop_detailed':
    data, headers = self._get_hectares_by_crop_data()
    title = 'Hectáreas por Cultivo - Detallado'
```

## 🎯 SOLUCIÓN ALTERNATIVA

Si reiniciar el servidor no funciona, prueba esto:

### 1. Matar Todos los Procesos de Python
```bash
# Windows
taskkill /F /IM python.exe

# Luego reinicia el servidor
cd Backend
python manage.py runserver
```

### 2. Usar un Puerto Diferente
```bash
cd Backend
python manage.py runserver 8001
```

Luego actualiza el frontend para usar el puerto 8001.

### 3. Verificar que No Hay Múltiples Servidores Corriendo
```bash
# Windows
netstat -ano | findstr :8000
```

Si hay múltiples procesos, mátalos todos y reinicia.

## ✅ CONFIRMACIÓN DE ÉXITO

Cuando funcione correctamente, deberías ver:

1. **En la consola del navegador (F12 → Console)**:
   - Sin errores rojos
   - Mensaje de descarga exitosa

2. **En la pestaña Network (F12 → Network)**:
   - Petición a `/api/reports/reports/export_report/`
   - Status: `200 OK`
   - Response: Archivo binario (blob)

3. **En tu carpeta de Descargas**:
   - Archivo `socios_comunidad.xlsx` (o .pdf, .csv)
   - Archivo se abre correctamente
   - Datos están presentes

## 📞 SI NADA FUNCIONA

1. Toma captura de:
   - Terminal del backend (errores)
   - Consola del navegador (F12 → Console)
   - Pestaña Network (F12 → Network → petición fallida)

2. Verifica que:
   - El backend está en el puerto 8000
   - El frontend está en el puerto 5173
   - Estás autenticado (iniciaste sesión)
   - El header `X-Organization` está configurado

3. Prueba con otro reporte que funcione:
   - Ve a `/reports/production-plot`
   - Haz clic en "Excel"
   - Si funciona, el problema es específico de los nuevos reportes
   - Si no funciona, el problema es general de exportación

## 🎉 RESULTADO ESPERADO

Después de reiniciar el servidor:

```bash
# Terminal Backend
Starting development server at http://127.0.0.1:8000/
Quit the server with CTRL-BREAK.

# Navegador
✅ Reporte carga correctamente
✅ Botón "Excel" descarga archivo .xlsx
✅ Botón "PDF" descarga archivo .pdf
✅ Botón "CSV" descarga archivo .csv
✅ Archivos se abren correctamente
✅ Datos están presentes
```

**¡Listo para la presentación! 🚀**
