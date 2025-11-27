# 🧪 Guía de Prueba - Panel de Super Admin

## ✅ Estado: Implementación Completa

El Panel de Super Admin está **100% funcional** y listo para probar.

## 🚀 Pasos para Probar

### 1. Preparar el Entorno

#### Backend
```bash
cd Backend

# Asegúrate de que el servidor esté corriendo
python manage.py runserver
```

#### Frontend
```bash
cd Frontend

# Asegúrate de que el servidor esté corriendo
npm run dev
```

### 2. Crear Super Usuario (Ya Creado ✅)

El super usuario ya fue creado con estas credenciales:

```
Username: superadmin
Password: admin123
Email: superadmin@agrocooperativa.com
```

Si necesitas crearlo nuevamente:
```bash
cd Backend
python create_superuser.py
```

### 3. Acceder al Panel

#### Opción A: Desde el Landing Page
1. Abre tu navegador en `http://localhost:5173/`
2. Busca el botón **"Admin"** con icono de escudo en la barra de navegación (arriba a la derecha)
3. Haz clic en el botón
4. Serás redirigido a la página de login del super admin

#### Opción B: URL Directa
1. Abre tu navegador en `http://localhost:5173/super-admin`
2. Verás la página de login del super admin

### 4. Iniciar Sesión

1. Ingresa las credenciales:
   - **Username:** `superadmin`
   - **Password:** `admin123`

2. Haz clic en **"Acceder al Panel"**

3. Si las credenciales son correctas, serás redirigido al dashboard

### 5. Explorar el Dashboard

Una vez dentro, verás:

#### Tarjetas de Estadísticas (arriba)
- 📊 **Total Organizaciones** - Número total de cooperativas
- ✅ **Organizaciones Activas** - Cooperativas en funcionamiento
- 👥 **Total Usuarios** - Usuarios en todo el sistema
- ⚠️ **Suspendidas** - Cooperativas que requieren atención

#### Filtros y Búsqueda
- 🔍 **Barra de búsqueda** - Busca por nombre, subdominio o email
- 📋 **Filtro por estado** - ACTIVE, TRIAL, SUSPENDED, CANCELLED
- 💼 **Filtro por plan** - FREE, BASIC, PROFESSIONAL, ENTERPRISE
- 🔄 **Botón Filtrar** - Aplica los filtros seleccionados
- ➕ **Nueva Organización** - Crear nueva cooperativa (próximamente)

#### Tabla de Organizaciones
Cada fila muestra:
- **Nombre** de la organización y subdominio
- **Plan** contratado (badge con color)
- **Estado** actual (badge con icono)
- **Miembros** (actual / máximo)
- **Fecha** de creación
- **Acciones** disponibles

## 🎯 Funcionalidades a Probar

### 1. Ver Estadísticas Globales ✅
- Verifica que se muestren los números correctos
- Observa las tarjetas con iconos y colores

### 2. Buscar Organizaciones ✅
```
Prueba:
1. Escribe "san" en la búsqueda
2. Haz clic en "Filtrar"
3. Deberías ver solo organizaciones que contengan "san"
```

### 3. Filtrar por Estado ✅
```
Prueba:
1. Selecciona "Activo" en el filtro de estado
2. Haz clic en "Filtrar"
3. Deberías ver solo organizaciones activas
```

### 4. Filtrar por Plan ✅
```
Prueba:
1. Selecciona "Profesional" en el filtro de plan
2. Haz clic en "Filtrar"
3. Deberías ver solo organizaciones con plan profesional
```

### 5. Ver Detalles de Organización ✅
```
Prueba:
1. Haz clic en el icono de ojo (👁️) en cualquier organización
2. Se abrirá un modal con:
   - Información básica
   - Límites del plan
   - Lista de miembros
3. Haz clic en la X para cerrar
```

### 6. Suspender Organización ✅
```
Prueba (solo si hay una organización ACTIVE):
1. Busca una organización con estado "Activo"
2. Haz clic en el icono de advertencia (⚠️)
3. La organización cambiará a estado "Suspendido"
4. Las estadísticas se actualizarán automáticamente
```

### 7. Activar Organización ✅
```
Prueba (solo si hay una organización SUSPENDED):
1. Busca una organización con estado "Suspendido"
2. Haz clic en el icono de check (✅)
3. La organización cambiará a estado "Activo"
4. Las estadísticas se actualizarán automáticamente
```

### 8. Desactivar Organización ✅
```
Prueba:
1. Haz clic en el icono de basura (🗑️) en cualquier organización
2. Aparecerá un mensaje de confirmación
3. Si confirmas, la organización se desactivará (soft delete)
4. Cambiará a estado "Cancelado"
```

### 9. Cerrar Sesión ✅
```
Prueba:
1. Haz clic en el botón "Salir" (arriba a la derecha)
2. Serás redirigido a la página principal
3. Tu sesión se cerrará
```

## 🔒 Pruebas de Seguridad

### Probar Acceso No Autorizado

#### Test 1: Usuario Normal
```
1. Cierra sesión del super admin
2. Inicia sesión con un usuario normal (no superuser)
3. Intenta acceder a http://localhost:5173/super-admin/dashboard
4. Deberías ser redirigido a la página principal
```

#### Test 2: Sin Autenticación
```
1. Cierra sesión completamente
2. Intenta acceder a http://localhost:5173/super-admin/dashboard
3. Deberías ser redirigido al login
```

#### Test 3: Login con Usuario Normal
```
1. Ve a http://localhost:5173/super-admin
2. Intenta hacer login con un usuario normal
3. Deberías ver el mensaje: "Acceso denegado. Solo super administradores pueden acceder."
```

## 📊 Datos de Prueba

Si necesitas más organizaciones para probar:

```bash
cd Backend
python create_test_organizations.py
```

Esto creará varias organizaciones con diferentes:
- Estados (ACTIVE, TRIAL, SUSPENDED)
- Planes (FREE, BASIC, PROFESSIONAL, ENTERPRISE)
- Miembros

## ✅ Checklist de Pruebas

Marca cada funcionalidad después de probarla:

### Acceso y Autenticación
- [ ] Acceder desde el botón en landing page
- [ ] Acceder desde URL directa
- [ ] Login con super admin exitoso
- [ ] Login con usuario normal rechazado
- [ ] Redirección correcta después de login
- [ ] Logout funciona correctamente

### Dashboard
- [ ] Estadísticas se cargan correctamente
- [ ] Números son precisos
- [ ] Tarjetas tienen iconos y colores correctos
- [ ] Organizaciones recientes se muestran

### Búsqueda y Filtros
- [ ] Búsqueda por nombre funciona
- [ ] Búsqueda por subdominio funciona
- [ ] Búsqueda por email funciona
- [ ] Filtro por estado funciona
- [ ] Filtro por plan funciona
- [ ] Combinación de filtros funciona
- [ ] Botón "Filtrar" aplica cambios

### Tabla de Organizaciones
- [ ] Se muestran todas las columnas
- [ ] Badges de estado tienen colores correctos
- [ ] Badges de plan tienen colores correctos
- [ ] Contador de miembros es correcto
- [ ] Fechas se formatean correctamente

### Acciones
- [ ] Ver detalles abre modal
- [ ] Modal muestra información completa
- [ ] Modal muestra lista de miembros
- [ ] Cerrar modal funciona
- [ ] Suspender organización funciona
- [ ] Activar organización funciona
- [ ] Desactivar organización pide confirmación
- [ ] Desactivar organización funciona
- [ ] Estadísticas se actualizan después de acciones

### Seguridad
- [ ] Solo super admins pueden acceder
- [ ] Usuarios normales son rechazados
- [ ] Sin autenticación redirige a login
- [ ] Sesión se mantiene correctamente
- [ ] Logout limpia la sesión

## 🎉 Resultado Esperado

Después de completar todas las pruebas, deberías tener:

✅ Un panel de super admin completamente funcional
✅ Acceso seguro solo para super administradores
✅ Gestión completa de organizaciones
✅ Estadísticas en tiempo real
✅ Búsqueda y filtros avanzados
✅ Interfaz profesional y responsiva

---

**¡Disfruta probando el Panel de Super Admin!** 🚀
