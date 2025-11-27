# 🚀 Acceso Rápido - Panel de Super Admin

## ⚡ Inicio Rápido (3 Pasos)

### 1️⃣ Crear Super Usuario
```bash
cd Backend
python create_superuser.py
```

### 2️⃣ Acceder al Panel
Abre tu navegador en: **http://localhost:5173/super-admin**

### 3️⃣ Iniciar Sesión
```
Username: superadmin
Password: admin123
```

## 🎯 ¡Listo! Ya puedes gestionar todas las cooperativas

---

## 📍 Ubicación del Botón en Landing

El botón **"Admin"** está ubicado en:
- **Desktop:** Barra de navegación superior derecha (antes de "Iniciar Sesión")
- **Mobile:** Menú hamburguesa

**Características:**
- Icono de escudo (🛡️)
- Color gris discreto
- Texto "Admin"

---

## 🎨 Pantallas del Sistema

### 1. Landing Page
```
┌─────────────────────────────────────────────────────┐
│  🌱 AgroCooperativa    [Admin] [Login] [Comenzar]  │
│                                                     │
│         Gestión Agrícola Inteligente               │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### 2. Super Admin Login
```
┌─────────────────────────────────────────────────────┐
│                      🛡️                             │
│            Panel de Super Admin                     │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ Usuario:  [superadmin              ]        │  │
│  │ Password: [••••••••                ]        │  │
│  │                                             │  │
│  │        [🛡️ Acceder al Panel]               │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
│  ⚠️ Solo para administradores del sistema          │
└─────────────────────────────────────────────────────┘
```

### 3. Super Admin Dashboard
```
┌─────────────────────────────────────────────────────────────────┐
│ 🛡️ Panel de Super Admin              [superadmin] [Salir]      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │ 🏢  10   │  │ ✅  7    │  │ 👥 150   │  │ ⚠️  1    │      │
│  │ Total    │  │ Activas  │  │ Usuarios │  │ Suspend. │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ 🔍 [Buscar...] [Estado▼] [Plan▼] [Filtrar] [+ Nueva]  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │ Organización    │ Plan  │ Estado │ Miembros │ Acciones │  │
│  ├─────────────────────────────────────────────────────────┤  │
│  │ Cooperativa SJ  │ PRO   │ ✅     │ 15/50    │ 👁️⚠️🗑️  │  │
│  │ Coop. Norte     │ BASIC │ 🔵     │ 8/20     │ 👁️⚠️🗑️  │  │
│  │ Coop. Sur       │ FREE  │ ⚠️     │ 5/5      │ 👁️✅🗑️  │  │
│  └─────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Acciones Disponibles

### Desde la Tabla
| Icono | Acción | Descripción |
|-------|--------|-------------|
| 👁️ | Ver | Abre modal con detalles completos |
| ✅ | Activar | Cambia estado a ACTIVE (solo si está suspendida) |
| ⚠️ | Suspender | Cambia estado a SUSPENDED (solo si está activa) |
| 🗑️ | Eliminar | Desactiva la organización (soft delete) |

### Desde el Modal de Detalles
- Ver información básica
- Ver límites del plan
- Ver lista de miembros
- Ver fechas importantes

---

## 🎨 Códigos de Color

### Estados
- 🟢 **Verde** → ACTIVE (Activo)
- 🔵 **Azul** → TRIAL (Prueba)
- 🟡 **Amarillo** → SUSPENDED (Suspendido)
- 🔴 **Rojo** → CANCELLED (Cancelado)

### Planes
- ⚪ **Gris** → FREE (Gratuito)
- 🔵 **Azul** → BASIC (Básico)
- 🟣 **Morado** → PROFESSIONAL (Profesional)
- 🟠 **Naranja** → ENTERPRISE (Enterprise)

---

## 🔐 Credenciales por Defecto

```
Username: superadmin
Password: admin123
Email: superadmin@agrocooperativa.com
```

⚠️ **IMPORTANTE:** Cambia estas credenciales en producción

---

## 📱 URLs Importantes

| Descripción | URL |
|-------------|-----|
| Landing Page | http://localhost:5173/ |
| Super Admin Login | http://localhost:5173/super-admin |
| Super Admin Dashboard | http://localhost:5173/super-admin/dashboard |
| Login Normal | http://localhost:5173/login |

---

## 🔄 Flujo de Acceso

```
1. Landing Page (/)
   ↓
2. Click en botón "Admin"
   ↓
3. Super Admin Login (/super-admin)
   ↓
4. Ingresar credenciales
   ↓
5. Verificación is_superuser
   ↓
6. Super Admin Dashboard (/super-admin/dashboard)
```

---

## ⚡ Atajos de Teclado (Próximamente)

| Atajo | Acción |
|-------|--------|
| `Ctrl + K` | Abrir búsqueda |
| `Ctrl + N` | Nueva organización |
| `Esc` | Cerrar modal |
| `Ctrl + R` | Recargar datos |

---

## 🆘 Solución Rápida de Problemas

### ❌ "Acceso denegado"
**Solución:** Verifica que el usuario tenga `is_superuser=True`
```bash
cd Backend
python create_superuser.py
```

### ❌ "No se cargan las organizaciones"
**Solución:** Crea organizaciones de prueba
```bash
cd Backend
python create_test_organizations.py
```

### ❌ "Error 403 Forbidden"
**Solución:** Limpia cookies y vuelve a hacer login
```
1. Abre DevTools (F12)
2. Application → Cookies → Clear
3. Recarga la página
4. Vuelve a hacer login
```

---

## 📞 Soporte Rápido

1. **Documentación Completa:** `Backend/SUPER_ADMIN_PANEL_GUIDE.md`
2. **Guía de Pruebas:** `Frontend/PRUEBA_PANEL_SUPER_ADMIN.md`
3. **Resumen Técnico:** `Frontend/PANEL_SUPER_ADMIN_IMPLEMENTADO.md`

---

## ✅ Checklist de Verificación

Antes de usar el panel, verifica:

- [ ] Backend está corriendo (`python manage.py runserver`)
- [ ] Frontend está corriendo (`npm run dev`)
- [ ] Super usuario fue creado (`python create_superuser.py`)
- [ ] Hay organizaciones en la base de datos
- [ ] Puedes acceder a `http://localhost:5173/`

---

## 🎉 ¡Todo Listo!

El Panel de Super Admin está completamente funcional y listo para usar.

**Acceso directo:** http://localhost:5173/super-admin

**Credenciales:** `superadmin` / `admin123`

---

**Última actualización:** Noviembre 2024  
**Versión:** 1.0.0  
**Estado:** ✅ Funcional
