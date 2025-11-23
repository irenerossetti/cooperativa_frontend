# Mapeo de Endpoints - Backend ↔ Frontend

Este documento muestra el mapeo completo entre los endpoints del backend Django y el frontend React.

## 📋 Configuración

**Backend Base URL:** `http://localhost:8000`  
**Frontend Base URL:** `http://localhost:5174`

## 🔐 Autenticación y Usuarios (Sprint 1)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Login | `POST /api/auth/users/login/` | `API_ENDPOINTS.AUTH.LOGIN` |
| Logout | `POST /api/auth/users/logout/` | `API_ENDPOINTS.AUTH.LOGOUT` |
| Usuario Actual | `GET /api/auth/users/me/` | `API_ENDPOINTS.AUTH.ME` |
| Cambiar Contraseña | `POST /api/auth/users/change_password/` | `API_ENDPOINTS.AUTH.CHANGE_PASSWORD` |
| Listar Usuarios | `GET /api/auth/users/` | `API_ENDPOINTS.USERS.LIST` |
| Detalle Usuario | `GET /api/auth/users/{id}/` | `API_ENDPOINTS.USERS.DETAIL(id)` |
| Activar Usuario | `POST /api/auth/users/{id}/activate/` | `API_ENDPOINTS.USERS.ACTIVATE(id)` |
| Desactivar Usuario | `POST /api/auth/users/{id}/deactivate/` | `API_ENDPOINTS.USERS.DEACTIVATE(id)` |

## 👥 Roles (Sprint 1)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Roles | `GET /api/auth/roles/` | `API_ENDPOINTS.ROLES.LIST` |
| Detalle Rol | `GET /api/auth/roles/{id}/` | `API_ENDPOINTS.ROLES.DETAIL(id)` |

## 🤝 Socios (Sprint 1)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Socios | `GET /api/partners/` | `API_ENDPOINTS.PARTNERS.LIST` |
| Detalle Socio | `GET /api/partners/{id}/` | `API_ENDPOINTS.PARTNERS.DETAIL(id)` |
| Activar Socio | `POST /api/partners/{id}/activate/` | `API_ENDPOINTS.PARTNERS.ACTIVATE(id)` |
| Desactivar Socio | `POST /api/partners/{id}/deactivate/` | `API_ENDPOINTS.PARTNERS.DEACTIVATE(id)` |

## 🗺️ Parcelas (Sprint 1)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Parcelas | `GET /api/parcels/` | `API_ENDPOINTS.PARCELS.LIST` |
| Detalle Parcela | `GET /api/parcels/{id}/` | `API_ENDPOINTS.PARCELS.DETAIL(id)` |
| Parcelas por Socio | `GET /api/parcels/?partner={id}` | `API_ENDPOINTS.PARCELS.BY_PARTNER(id)` |

## 📝 Auditoría (Sprint 1)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Auditoría | `GET /api/audit/` | `API_ENDPOINTS.AUDIT.LIST` |
| Detalle Auditoría | `GET /api/audit/{id}/` | `API_ENDPOINTS.AUDIT.DETAIL(id)` |
| Por Modelo | `GET /api/audit/?model={model}` | `API_ENDPOINTS.AUDIT.BY_MODEL(model)` |
| Por Usuario | `GET /api/audit/?user={id}` | `API_ENDPOINTS.AUDIT.BY_USER(id)` |

## 📅 Campañas (Sprint 2)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Campañas | `GET /api/campaigns/` | `API_ENDPOINTS.CAMPAIGNS.LIST` |
| Detalle Campaña | `GET /api/campaigns/{id}/` | `API_ENDPOINTS.CAMPAIGNS.DETAIL(id)` |
| Campañas Activas | `GET /api/campaigns/?is_active=true` | `API_ENDPOINTS.CAMPAIGNS.ACTIVE` |

## 🚜 Labores Agrícolas (Sprint 2)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Labores | `GET /api/farm-activities/` | `API_ENDPOINTS.FARM_ACTIVITIES.LIST` |
| Detalle Labor | `GET /api/farm-activities/{id}/` | `API_ENDPOINTS.FARM_ACTIVITIES.DETAIL(id)` |
| Por Campaña | `GET /api/farm-activities/?campaign={id}` | `API_ENDPOINTS.FARM_ACTIVITIES.BY_CAMPAIGN(id)` |
| Por Parcela | `GET /api/farm-activities/?parcel={id}` | `API_ENDPOINTS.FARM_ACTIVITIES.BY_PARCEL(id)` |

## 📦 Inventario (Sprint 2)

### Semillas

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Semillas | `GET /api/inventory/seeds/` | `API_ENDPOINTS.INVENTORY.SEEDS.LIST` |
| Detalle Semilla | `GET /api/inventory/seeds/{id}/` | `API_ENDPOINTS.INVENTORY.SEEDS.DETAIL(id)` |

### Insumos

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Insumos | `GET /api/inventory/inputs/` | `API_ENDPOINTS.INVENTORY.INPUTS.LIST` |
| Detalle Insumo | `GET /api/inventory/inputs/{id}/` | `API_ENDPOINTS.INVENTORY.INPUTS.DETAIL(id)` |

### Movimientos

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Movimientos | `GET /api/inventory/movements/` | `API_ENDPOINTS.INVENTORY.MOVEMENTS.LIST` |
| Detalle Movimiento | `GET /api/inventory/movements/{id}/` | `API_ENDPOINTS.INVENTORY.MOVEMENTS.DETAIL(id)` |

## 🌾 Producción (Sprint 2)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Producción | `GET /api/production/` | `API_ENDPOINTS.PRODUCTION.LIST` |
| Detalle Producción | `GET /api/production/{id}/` | `API_ENDPOINTS.PRODUCTION.DETAIL(id)` |
| Por Campaña | `GET /api/production/?campaign={id}` | `API_ENDPOINTS.PRODUCTION.BY_CAMPAIGN(id)` |
| Por Parcela | `GET /api/production/?parcel={id}` | `API_ENDPOINTS.PRODUCTION.BY_PARCEL(id)` |

## 💰 Ventas (Sprint 3)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Ventas | `GET /api/sales/` | `API_ENDPOINTS.SALES.LIST` |
| Detalle Venta | `GET /api/sales/{id}/` | `API_ENDPOINTS.SALES.DETAIL(id)` |

## 📋 Solicitudes (Sprint 3)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Solicitudes | `GET /api/requests/` | `API_ENDPOINTS.REQUESTS.LIST` |
| Detalle Solicitud | `GET /api/requests/{id}/` | `API_ENDPOINTS.REQUESTS.DETAIL(id)` |

## 💵 Precios (Sprint 3)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Precios | `GET /api/pricing/` | `API_ENDPOINTS.PRICING.LIST` |
| Detalle Precio | `GET /api/pricing/{id}/` | `API_ENDPOINTS.PRICING.DETAIL(id)` |

## 🚚 Envíos (Sprint 3)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Envíos | `GET /api/shipping/` | `API_ENDPOINTS.SHIPPING.LIST` |
| Detalle Envío | `GET /api/shipping/{id}/` | `API_ENDPOINTS.SHIPPING.DETAIL(id)` |

## 🤖 IA y Recomendaciones (Sprint 4)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Recomendaciones | `GET /api/ai/recommendations/` | `API_ENDPOINTS.AI.RECOMMENDATIONS` |

## 💳 Financiero (Sprint 4)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Transacciones | `GET /api/financial/` | `API_ENDPOINTS.FINANCIAL.LIST` |
| Detalle Transacción | `GET /api/financial/{id}/` | `API_ENDPOINTS.FINANCIAL.DETAIL(id)` |

## 📊 Reportes (Sprint 4)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Labores por Campaña | `GET /api/reports/labors-by-campaign/` | `API_ENDPOINTS.REPORTS.LABORS_BY_CAMPAIGN` |
| Producción por Campaña | `GET /api/reports/production-by-campaign/` | `API_ENDPOINTS.REPORTS.PRODUCTION_BY_CAMPAIGN` |
| Producción por Parcela | `GET /api/reports/production-by-parcel/` | `API_ENDPOINTS.REPORTS.PRODUCTION_BY_PARCEL` |

## 🔍 Trazabilidad (Sprint 4)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Trazabilidad | `GET /api/traceability/` | `API_ENDPOINTS.TRACEABILITY.LIST` |
| Detalle Trazabilidad | `GET /api/traceability/{id}/` | `API_ENDPOINTS.TRACEABILITY.DETAIL(id)` |

## 📈 Analíticas (Sprint 4)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Dashboard | `GET /api/analytics/dashboard/` | `API_ENDPOINTS.ANALYTICS.DASHBOARD` |

## 🔔 Monitoreo (Sprint 5)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Listar Monitoreo | `GET /api/monitoring/` | `API_ENDPOINTS.MONITORING.LIST` |
| Detalle Monitoreo | `GET /api/monitoring/{id}/` | `API_ENDPOINTS.MONITORING.DETAIL(id)` |

## 🌤️ Clima (Sprint 5)

| Funcionalidad | Backend Endpoint | Frontend Constant |
|--------------|------------------|-------------------|
| Clima Actual | `GET /api/weather/current/` | `API_ENDPOINTS.WEATHER.CURRENT` |
| Pronóstico | `GET /api/weather/forecast/` | `API_ENDPOINTS.WEATHER.FORECAST` |

---

## 📝 Uso en el Frontend

### Ejemplo de uso:

```javascript
import api from '../services/api';
import API_ENDPOINTS from '../config/apiEndpoints';

// Obtener lista de socios
const response = await api.get(API_ENDPOINTS.PARTNERS.LIST);

// Obtener detalle de un socio
const response = await api.get(API_ENDPOINTS.PARTNERS.DETAIL(5));

// Crear un nuevo socio
const response = await api.post(API_ENDPOINTS.PARTNERS.LIST, data);

// Actualizar un socio
const response = await api.put(API_ENDPOINTS.PARTNERS.DETAIL(5), data);

// Eliminar un socio
const response = await api.delete(API_ENDPOINTS.PARTNERS.DETAIL(5));
```

## ✅ Ventajas de esta Arquitectura

1. **Centralización**: Todos los endpoints en un solo lugar
2. **Mantenibilidad**: Fácil de actualizar si cambian las URLs
3. **Consistencia**: Mismo patrón en todo el frontend
4. **Autocompletado**: Los IDEs pueden sugerir endpoints disponibles
5. **Documentación**: Este archivo sirve como documentación viva
6. **Refactoring**: Cambios en URLs solo requieren actualizar un archivo

---

**Última actualización:** 22 de Noviembre de 2025
