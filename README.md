# Frontend - Sistema Cooperativa Agrícola

Sistema de gestión para cooperativas agrícolas desarrollado con React + Vite.

## Tecnologías

- React 18
- Vite
- React Router DOM
- Tailwind CSS
- Lucide React (iconos)
- Axios

## Instalación

```bash
npm install
```

## Configuración

1. Copiar el archivo `.env.example` a `.env`
2. Configurar la URL del backend en `.env`:

```
VITE_API_URL=http://localhost:8000/api
```

## Desarrollo

```bash
npm run dev
```

El servidor de desarrollo estará disponible en `http://localhost:5173`

## Build

```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/
│   └── layout/
│       ├── MainLayout.jsx
│       ├── Navbar.jsx
│       └── Sidebar.jsx
├── context/
│   └── AuthContext.jsx
├── pages/
│   ├── Dashboard.jsx
│   └── LoginPage.jsx
├── services/
│   └── api.js
├── App.jsx
├── main.jsx
└── index.css
```

## Características

- Autenticación con JWT
- Diseño responsive
- Glass morphism UI
- Navegación con sidebar colapsable
- Rutas protegidas
- Integración con backend Django

## Módulos Disponibles

- Dashboard
- Socios
- Usuarios
- Roles
- Semillas
- Parcelas
- Insumos
- Labores Agrícolas
- Productos Cosechados
- Métodos de Pago
- Campañas
- Auditoría
- Reportes

## Conexión con Backend

El frontend se conecta con el backend Django REST API. Asegúrate de que el backend esté corriendo en `http://localhost:8000`.
