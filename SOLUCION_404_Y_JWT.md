# Solución 404 y Configuración JWT

## Problemas Solucionados

### 1. Error 404 en Vercel
**Causa**: Vercel no estaba configurado para manejar rutas de React Router (SPA)

**Solución**: Creado `vercel.json` con rewrites para redirigir todas las rutas a `index.html`

### 2. Frontend no usaba JWT
**Causa**: AuthContext seguía usando Session Authentication, pero el backend ahora devuelve JWT

**Solución**: Actualizado AuthContext para:
- Guardar tokens JWT en localStorage
- Enviar `Authorization: Bearer {token}` en todas las peticiones
- Limpiar tokens al hacer logout

## Archivos Modificados

### 1. `Frontend/vercel.json` (NUEVO)
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### 2. `Frontend/src/context/AuthContext.jsx`
- ✅ Configurado para usar JWT
- ✅ Guarda `access_token` y `refresh_token` en localStorage
- ✅ Envía `Authorization: Bearer {token}` en headers
- ✅ Limpia tokens al hacer logout
- ✅ Organización por defecto cambiada a 'sammantha'

## Cómo Acceder a la Aplicación

### Opción 1: Desde la Landing Page
1. Ir a: `https://cooperativa-frontend-three.vercel.app/`
2. Hacer clic en "Iniciar Sesión"
3. Ingresar credenciales

### Opción 2: Acceso Directo al Login
La URL correcta es la raíz, no `/login`:
- ❌ `https://cooperativa-frontend-three.vercel.app/login` (404)
- ✅ `https://cooperativa-frontend-three.vercel.app/` (Landing con botón de login)

## Credenciales de Prueba

### Usuario Admin (con partner en organización Sam):
```
Username: kihomy
Password: [tu password]
Organización: sammantha
```

### Usuario Superadmin:
```
Username: superadmin
Password: [tu password]
```

## Deploy en Vercel

```bash
# 1. Commit de cambios
git add .
git commit -m "Fix: Agregar vercel.json y configurar JWT en frontend"
git push

# 2. Vercel detectará los cambios y redesplegará automáticamente
```

## Deploy en Render (Backend)

```bash
# 1. Commit de cambios del backend
cd Backend
git add .
git commit -m "Fix: Configurar autenticación JWT"
git push

# 2. Render redesplegará automáticamente
```

## Verificación Post-Deploy

### 1. Verificar que Vercel maneja rutas correctamente:
- Ir a `https://cooperativa-frontend-three.vercel.app/`
- Debe mostrar la landing page
- Hacer clic en "Iniciar Sesión"
- Debe mostrar el formulario de login (no 404)

### 2. Verificar que el login funciona:
- Ingresar credenciales
- Debe redirigir al dashboard
- No debe haber errores 403 en la consola

### 3. Verificar que los endpoints funcionan:
- Abrir DevTools > Network
- Verificar que las peticiones incluyen:
  - `Authorization: Bearer eyJ0eXAiOiJKV1Q...`
  - `X-Organization-Subdomain: sammantha`
- Verificar que las respuestas son 200 OK (no 403)

## Flujo Completo de Autenticación

### Login:
1. Usuario ingresa credenciales
2. Frontend envía POST a `/api/auth/users/login/`
3. Backend valida y devuelve:
   ```json
   {
     "user": {...},
     "access": "eyJ0eXAiOiJKV1Q...",
     "refresh": "eyJ0eXAiOiJKV1Q..."
   }
   ```
4. Frontend guarda tokens en localStorage
5. Frontend configura header: `Authorization: Bearer {access}`

### Peticiones Autenticadas:
1. Frontend envía petición con headers:
   ```
   Authorization: Bearer eyJ0eXAiOiJKV1Q...
   X-Organization-Subdomain: sammantha
   ```
2. Backend valida el token JWT
3. Backend filtra datos por organización
4. Backend devuelve respuesta 200 OK

### Logout:
1. Usuario hace clic en "Cerrar Sesión"
2. Frontend limpia localStorage
3. Frontend elimina header de Authorization
4. Frontend redirige a landing page

## Troubleshooting

### Si sigues viendo 404:
1. Verificar que `vercel.json` existe en la raíz del proyecto Frontend
2. Hacer redeploy en Vercel
3. Limpiar caché del navegador (Ctrl+Shift+R)

### Si sigues viendo 403:
1. Verificar que el backend está desplegado con JWT
2. Hacer logout y volver a hacer login
3. Verificar en DevTools que el header `Authorization` se está enviando

### Si el login no funciona:
1. Verificar en DevTools > Network la respuesta del login
2. Debe incluir `access` y `refresh` tokens
3. Si no los incluye, el backend no está actualizado

## Estado Actual

✅ **Frontend configurado con JWT**
✅ **vercel.json creado para manejar rutas SPA**
✅ **Organización por defecto: sammantha**
✅ **Listo para deploy**

**Siguiente paso**: Hacer commit y push a Vercel y Render
