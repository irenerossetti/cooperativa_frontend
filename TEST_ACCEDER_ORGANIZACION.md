# 🧪 Test: Acceder a Organización

## Problema Actual

Cuando haces clic en el botón "Acceder" (→) de una organización:
- El localStorage NO se está guardando
- Siempre muestra datos de "sanjuan" (organización por defecto)
- Las organizaciones nuevas muestran datos incorrectos

## Pasos para Probar

### 1. Verificar Estado Actual

En la consola del navegador (F12 → Console):

```javascript
// Ver qué organización está guardada
localStorage.getItem('currentOrganization')
// Resultado actual: null (vacío)

// Ver qué header está usando axios
axios.defaults.headers.common['X-Organization-Subdomain']
// Resultado esperado: debería coincidir con localStorage
```

### 2. Establecer Organización Manualmente

Para probar que tu organización "Sypha" está vacía:

```javascript
// Guardar la organización en localStorage
localStorage.setItem('currentOrganization', 'syphita')

// Recargar la página
location.reload()
```

Después de recargar, deberías ver:
- 0 Socios
- 0 Parcelas
- 0 Productos
- Dashboard vacío

### 3. Probar con San Juan (que tiene datos)

```javascript
// Cambiar a San Juan
localStorage.setItem('currentOrganization', 'sanjuan')
location.reload()
```

Deberías ver:
- 10 Socios
- Parcelas con datos
- Dashboard con información

### 4. Probar el Botón de Acceder

1. Ve al panel de super admin: `/super-admin/dashboard`
2. Busca la organización "Sypha" (syphita)
3. Haz clic en el botón morado (→)
4. Abre la consola INMEDIATAMENTE
5. Verifica:
   ```javascript
   localStorage.getItem('currentOrganization')
   // Debería mostrar: "syphita"
   ```

## Solución Temporal

Mientras se arregla el botón, puedes cambiar de organización manualmente:

```javascript
// En la consola del navegador:

// Para acceder a Sypha (tu organización nueva):
localStorage.setItem('currentOrganization', 'syphita')
location.reload()

// Para acceder a San Juan (con datos de prueba):
localStorage.setItem('currentOrganization', 'sanjuan')
location.reload()

// Para acceder a cualquier otra:
localStorage.setItem('currentOrganization', 'SUBDOMINIO')
location.reload()
```

## Organizaciones Disponibles

Según la base de datos:

| Nombre | Subdominio | Socios | Estado |
|--------|------------|--------|--------|
| Sypha | `syphita` | 0 | TRIAL |
| Cooperativa San Juan | `sanjuan` | 10 | ACTIVE |
| Cooperativa El Progreso | `progreso` | 1 | ACTIVE |
| Cooperativa Demo | `demo` | 0 | TRIAL |
| Mi Cooperativa | `micooperativa` | 0 | TRIAL |
| Cooperativa Demo 6847 | `demo6847` | 0 | ACTIVE |
| Cooperativa MiAUU | `Miauu` | 0 | CANCELLED |
| Cooperativa Santa Rosa | `santarosa` | 0 | TRIAL |
| Cooperativa Demo 9306 | `demo9306` | 0 | CANCELLED |

## Verificar Aislamiento de Datos

Para confirmar que cada organización solo ve sus datos:

```javascript
// 1. Acceder a Sypha (vacía)
localStorage.setItem('currentOrganization', 'syphita')
location.reload()
// Verificar: 0 socios

// 2. Acceder a San Juan (con datos)
localStorage.setItem('currentOrganization', 'sanjuan')
location.reload()
// Verificar: 10 socios

// 3. Volver a Sypha
localStorage.setItem('currentOrganization', 'syphita')
location.reload()
// Verificar: sigue con 0 socios (no se mezclaron los datos)
```

## Resultado Esperado

✅ **Sypha (syphita):**
- 0 Socios
- 0 Parcelas
- 0 Productos
- Dashboard vacío
- Solo tiene el usuario admin que creaste

✅ **San Juan (sanjuan):**
- 10 Socios
- Múltiples parcelas
- Productos
- Dashboard con datos
- Datos de prueba

## Próximo Fix

El botón de "Acceder" será arreglado para:
1. Guardar correctamente en localStorage
2. Actualizar el header de axios
3. Redirigir al dashboard
4. Mostrar los datos correctos de la organización seleccionada

---

**Mientras tanto, usa el método manual de la consola para cambiar de organización.**
