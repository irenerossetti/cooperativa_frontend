# Guía de Deploy en Vercel (Frontend)

## Pasos para Deploy en Vercel

### 1. Preparar el repositorio

Asegúrate de hacer commit y push de todos los cambios:

```bash
cd Frontend
git add .
git commit -m "Preparar frontend para deploy en Vercel"
git push origin main
```

### 2. Crear proyecto en Vercel

1. Ve a https://vercel.com
2. Click en "Add New..." → "Project"
3. Importa tu repositorio: `irenerossetti/cooperativa_frontend`
4. Vercel detectará automáticamente que es un proyecto Vite

### 3. Configurar el proyecto

**Framework Preset**: Vite (auto-detectado)
**Root Directory**: `./` (o deja en blanco)
**Build Command**: `npm run build` (auto-detectado)
**Output Directory**: `dist` (auto-detectado)

### 4. Configurar Variables de Entorno

En "Environment Variables", agrega:

```
VITE_API_URL=https://cooperativa-backend.onrender.com
```

⚠️ **Importante**: Reemplaza `cooperativa-backend` con el nombre real de tu servicio en Render.

### 5. Deploy

1. Click en "Deploy"
2. Vercel automáticamente:
   - Instalará dependencias (npm install)
   - Ejecutará el build (npm run build)
   - Desplegará los archivos estáticos

### 6. Verificar el Deploy

Tu frontend estará disponible en:
```
https://tu-proyecto.vercel.app
```

Vercel te dará una URL automática. Puedes:
- Usar esa URL
- Configurar un dominio personalizado
- Cada push a main desplegará automáticamente

### 7. Actualizar CORS en Backend

Una vez que tengas la URL de Vercel, actualiza las variables de entorno en Render:

```
CORS_ALLOWED_ORIGINS=https://tu-proyecto.vercel.app
```

## Configuración Alternativa: Deploy en Render (Static Site)

Si prefieres tener todo en Render:

### 1. Crear Static Site en Render

1. Ve a https://dashboard.render.com
2. Click en "New +" → "Static Site"
3. Conecta tu repositorio: `irenerossetti/cooperativa_frontend`

### 2. Configuración

- **Name**: `cooperativa-frontend`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`

### 3. Variables de Entorno

```
VITE_API_URL=https://cooperativa-backend.onrender.com
```

### 4. Deploy

Click en "Create Static Site"

## Verificar la conexión Frontend-Backend

Una vez desplegados ambos, prueba:

1. Abre el frontend en el navegador
2. Intenta hacer login
3. Verifica en las DevTools (Network) que las peticiones van al backend correcto
4. Si hay errores CORS, revisa la configuración de `CORS_ALLOWED_ORIGINS` en el backend

## Troubleshooting

### Error: "Failed to fetch" o "Network Error"
- Verifica que `VITE_API_URL` esté correctamente configurada
- Asegúrate de que el backend esté activo en Render
- Revisa los logs del backend para errores CORS

### Error: "CORS policy"
- Agrega la URL del frontend a `CORS_ALLOWED_ORIGINS` en el backend
- Formato: `https://tu-proyecto.vercel.app` (sin barra final)

### Cambios no se reflejan
- Vercel: Hace deploy automático en cada push
- Render: Puede necesitar "Manual Deploy" desde el dashboard

### Variables de entorno no funcionan
- En Vite, las variables DEBEN empezar con `VITE_`
- Después de cambiar variables, redeploy el proyecto

## Ventajas de Vercel vs Render para Frontend

**Vercel:**
- ✅ Más rápido (CDN global)
- ✅ Deploy automático en cada push
- ✅ Preview deployments para cada PR
- ✅ Mejor para React/Vite
- ✅ Plan gratuito muy generoso

**Render Static Site:**
- ✅ Todo en un solo lugar
- ✅ Más simple si no conoces Vercel
- ⚠️ Más lento que Vercel
- ⚠️ Sin preview deployments en plan free

## Recomendación

**Usa Vercel para el frontend** - Es más rápido, tiene mejor DX y el plan gratuito es excelente para proyectos como este.

## Próximos pasos después del deploy

1. ✅ Verificar que login funciona
2. ✅ Crear un superusuario en el backend
3. ✅ Crear organizaciones de prueba
4. ✅ Probar todas las funcionalidades principales
5. 🎉 ¡Listo para presentar!
