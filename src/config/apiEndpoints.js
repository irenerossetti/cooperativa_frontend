/**
 * Configuración centralizada de endpoints de la API
 * Mapeo directo con las URLs del backend Django
 */

const API_BASE = '/api';

export const API_ENDPOINTS = {
  // Autenticación y Usuarios (Sprint 1)
  AUTH: {
    LOGIN: `${API_BASE}/auth/users/login/`,
    LOGOUT: `${API_BASE}/auth/users/logout/`,
    ME: `${API_BASE}/auth/users/me/`,
    CHANGE_PASSWORD: `${API_BASE}/auth/users/change_password/`,
  },
  
  USERS: {
    LIST: `${API_BASE}/auth/users/`,
    DETAIL: (id) => `${API_BASE}/auth/users/${id}/`,
    ACTIVATE: (id) => `${API_BASE}/auth/users/${id}/activate/`,
    DEACTIVATE: (id) => `${API_BASE}/auth/users/${id}/deactivate/`,
  },

  ROLES: {
    LIST: `${API_BASE}/auth/roles/`,
    DETAIL: (id) => `${API_BASE}/auth/roles/${id}/`,
  },

  // Socios (Sprint 1)
  PARTNERS: {
    LIST: `${API_BASE}/partners/partners/`,
    DETAIL: (id) => `${API_BASE}/partners/partners/${id}/`,
    ACTIVATE: (id) => `${API_BASE}/partners/partners/${id}/activate/`,
    DEACTIVATE: (id) => `${API_BASE}/partners/partners/${id}/deactivate/`,
  },
  
  COMMUNITIES: {
    LIST: `${API_BASE}/partners/communities/`,
    DETAIL: (id) => `${API_BASE}/partners/communities/${id}/`,
  },

  // Parcelas (Sprint 1)
  PARCELS: {
    LIST: `${API_BASE}/parcels/parcels/`,
    DETAIL: (id) => `${API_BASE}/parcels/parcels/${id}/`,
    BY_PARTNER: (partnerId) => `${API_BASE}/parcels/parcels/?partner=${partnerId}`,
    SOIL_TYPES: `${API_BASE}/parcels/soil-types/`,
    CROPS: `${API_BASE}/parcels/crops/`,
  },

  // Auditoría (Sprint 1)
  AUDIT: {
    LIST: `${API_BASE}/audit/logs/`,
    DETAIL: (id) => `${API_BASE}/audit/logs/${id}/`,
    BY_MODEL: (model) => `${API_BASE}/audit/logs/?model=${model}`,
    BY_USER: (userId) => `${API_BASE}/audit/logs/?user=${userId}`,
    DEVELOPER_ACCESS: `${API_BASE}/audit/logs/developer-access/`,
  },

  // Campañas (Sprint 2)
  CAMPAIGNS: {
    LIST: `${API_BASE}/campaigns/campaigns/`,
    DETAIL: (id) => `${API_BASE}/campaigns/campaigns/${id}/`,
    ACTIVE: `${API_BASE}/campaigns/campaigns/?is_active=true`,
  },

  // Labores Agrícolas (Sprint 2)
  FARM_ACTIVITIES: {
    LIST: `${API_BASE}/farm-activities/activities/`,
    DETAIL: (id) => `${API_BASE}/farm-activities/activities/${id}/`,
    BY_CAMPAIGN: (campaignId) => `${API_BASE}/farm-activities/activities/?campaign=${campaignId}`,
    BY_PARCEL: (parcelId) => `${API_BASE}/farm-activities/?parcel=${parcelId}`,
  },

  // Inventario (Sprint 2)
  INVENTORY: {
    ITEMS: {
      LIST: `${API_BASE}/inventory/items/`,
      DETAIL: (id) => `${API_BASE}/inventory/items/${id}/`,
      AVAILABILITY: `${API_BASE}/inventory/items/availability/`,
      LOW_STOCK: `${API_BASE}/inventory/items/low_stock_items/`,
    },
    SEEDS: {
      LIST: `${API_BASE}/inventory/items/?category=1`, // Filtrar por categoría SEED
      DETAIL: (id) => `${API_BASE}/inventory/items/${id}/`,
    },
    INPUTS: {
      LIST: `${API_BASE}/inventory/items/?category__in=2,3`, // PESTICIDE, FERTILIZER
      DETAIL: (id) => `${API_BASE}/inventory/items/${id}/`,
    },
    MOVEMENTS: {
      LIST: `${API_BASE}/inventory/movements/`,
      DETAIL: (id) => `${API_BASE}/inventory/movements/${id}/`,
    },
  },

  // Producción (Sprint 2)
  PRODUCTION: {
    LIST: `${API_BASE}/production/harvested-products/`,
    DETAIL: (id) => `${API_BASE}/production/harvested-products/${id}/`,
    BY_CAMPAIGN: (campaignId) => `${API_BASE}/production/harvested-products/?campaign=${campaignId}`,
    BY_PARCEL: (parcelId) => `${API_BASE}/production/harvested-products/?parcel=${parcelId}`,
  },

  // Ventas (Sprint 3)
  SALES: {
    PAYMENT_METHODS: {
      LIST: `${API_BASE}/sales/payment-methods/`,
      DETAIL: (id) => `${API_BASE}/sales/payment-methods/${id}/`,
    },
    CUSTOMERS: {
      LIST: `${API_BASE}/sales/customers/`,
      DETAIL: (id) => `${API_BASE}/sales/customers/${id}/`,
    },
    ORDERS: {
      LIST: `${API_BASE}/sales/orders/`,
      DETAIL: (id) => `${API_BASE}/sales/orders/${id}/`,
      CONFIRM: (id) => `${API_BASE}/sales/orders/${id}/confirm/`,
      CANCEL: (id) => `${API_BASE}/sales/orders/${id}/cancel/`,
      SALES_REPORT: `${API_BASE}/sales/orders/sales_report/`,
      EXPORT_CSV: `${API_BASE}/sales/orders/export_csv/`,
    },
    ORDER_ITEMS: {
      LIST: `${API_BASE}/sales/order-items/`,
      DETAIL: (id) => `${API_BASE}/sales/order-items/${id}/`,
    },
    PAYMENTS: {
      LIST: `${API_BASE}/sales/payments/`,
      DETAIL: (id) => `${API_BASE}/sales/payments/${id}/`,
      HISTORY: `${API_BASE}/sales/payments/payment_history/`,
    },
  },

  // Solicitudes (Sprint 3)
  REQUESTS: {
    LIST: `${API_BASE}/requests/`,
    DETAIL: (id) => `${API_BASE}/requests/${id}/`,
  },

  // Precios (Sprint 3)
  PRICING: {
    LIST: `${API_BASE}/pricing/`,
    DETAIL: (id) => `${API_BASE}/pricing/${id}/`,
  },

  // Envíos (Sprint 3)
  SHIPPING: {
    LIST: `${API_BASE}/shipping/`,
    DETAIL: (id) => `${API_BASE}/shipping/${id}/`,
  },

  // IA y Recomendaciones (Sprint 4)
  AI: {
    RECOMMENDATIONS: `${API_BASE}/ai/recommendations/`,
  },

  // Financiero (Sprint 4)
  FINANCIAL: {
    LIST: `${API_BASE}/financial/`,
    DETAIL: (id) => `${API_BASE}/financial/${id}/`,
  },

  // Reportes (Sprint 4)
  REPORTS: {
    TYPES: `${API_BASE}/reports/types/`,
    LIST: `${API_BASE}/reports/reports/`,
    PERFORMANCE_BY_PARTNER: `${API_BASE}/reports/reports/performance_by_partner/`,
    POPULATION_ACTIVE: `${API_BASE}/reports/reports/population_active_partners/`,
    HECTARES_BY_CROP: `${API_BASE}/reports/reports/hectares_by_crop/`,
    PERFORMANCE_BY_PARCEL: `${API_BASE}/reports/reports/performance_by_parcel/`,
    EXPORT: `${API_BASE}/reports/reports/export_report/`,
    // Alias para compatibilidad
    LABORS_BY_CAMPAIGN: `${API_BASE}/reports/reports/performance_by_partner/`,
    PRODUCTION_BY_CAMPAIGN: `${API_BASE}/reports/reports/hectares_by_crop/`,
    PRODUCTION_BY_PARCEL: `${API_BASE}/reports/reports/performance_by_parcel/`,
  },

  // Trazabilidad (Sprint 4)
  TRACEABILITY: {
    LIST: `${API_BASE}/traceability/`,
    DETAIL: (id) => `${API_BASE}/traceability/${id}/`,
  },

  // Analíticas (Sprint 4)
  ANALYTICS: {
    DASHBOARD: `${API_BASE}/analytics/dashboard/`,
  },

  // Monitoreo (Sprint 5)
  MONITORING: {
    LIST: `${API_BASE}/monitoring/`,
    DETAIL: (id) => `${API_BASE}/monitoring/${id}/`,
  },

  // Clima (Sprint 5)
  WEATHER: {
    CURRENT: `${API_BASE}/weather/current/`,
    FORECAST: `${API_BASE}/weather/forecast/`,
  },

  // Multi-Tenancy
  TENANTS: {
    REGISTER: `${API_BASE}/tenants/register/`,
    MY_ORGANIZATIONS: `${API_BASE}/tenants/my-organizations/`,
    ORGANIZATIONS: `${API_BASE}/tenants/organizations/`,
    CURRENT: `${API_BASE}/tenants/organizations/current/`,
  },

  // Super Admin
  SUPER_ADMIN: {
    STATS: `${API_BASE}/tenants/super-admin/stats/`,
    ORGANIZATIONS: `${API_BASE}/tenants/super-admin/organizations/`,
    CREATE_ORG: `${API_BASE}/tenants/super-admin/organizations/create/`,
    ORG_DETAIL: (id) => `${API_BASE}/tenants/super-admin/organizations/${id}/`,
    UPDATE_ORG: (id) => `${API_BASE}/tenants/super-admin/organizations/${id}/update/`,
    DELETE_ORG: (id) => `${API_BASE}/tenants/super-admin/organizations/${id}/delete/`,
  },
};

export default API_ENDPOINTS;
