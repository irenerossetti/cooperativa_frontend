import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Users,
  FileText,
  Shield,
  X,
  LogOut,
  UserCog,
  BarChart3,
  Key,
  Sprout,
  FlaskConical,
  Calendar,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Map,
  Package,
  Tractor,
  CreditCard,
  ShoppingCart,
  User,
  Bell,
  Activity,
  MessageSquare,
  Target
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [expandedMenus, setExpandedMenus] = useState({});

  const handleLogout = async () => {
    if (window.confirm('¿Está seguro de que desea cerrar sesión?')) {
      await logout();
    }
  };

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  // Determinar el rol del usuario
  const getUserRole = () => {
    if (user?.is_staff || user?.is_superuser) return 'ADMIN';
    if (user?.role === 'PARTNER') return 'PARTNER';
    if (user?.role === 'CUSTOMER') return 'CUSTOMER';
    return 'CUSTOMER';
  };

  const userRole = getUserRole();

  // Menús según rol
  const adminMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/dashboard-realtime', label: 'Dashboard Tiempo Real', icon: Activity },
    { path: '/notifications', label: 'Notificaciones', icon: Bell },
    { path: '/ai-chat', label: 'Asistente IA', icon: MessageSquare },
    { path: '/socios', label: 'Socios', icon: Users },
    { path: '/usuarios', label: 'Clientes', icon: UserCog },
    { path: '/roles', label: 'Roles', icon: Key },
    { path: '/semillas', label: 'Semillas', icon: Sprout },
    { path: '/parcelas', label: 'Parcelas', icon: Map },
    { path: '/insumos', label: 'Insumos', icon: FlaskConical },
    { path: '/labores', label: 'Labores Agrícolas', icon: Tractor },
    { path: '/productos-cosechados', label: 'Productos Cosechados', icon: Package },
    { path: '/ventas', label: 'Ventas / Pedidos', icon: ShoppingCart },
    { path: '/payment-methods', label: 'Métodos de Pago', icon: CreditCard },
    { path: '/campaigns', label: 'Campañas', icon: Calendar },
    { path: '/events', label: 'Calendario Eventos', icon: Calendar },
    { path: '/goals', label: 'Metas y Objetivos', icon: Target },
    { path: '/auditoria', label: 'Auditoría', icon: FileText },
    {
      path: '/reportes',
      label: 'Reportes',
      icon: BarChart3,
      subMenu: [
        { path: '/reports/labors', label: 'Labores por Campaña', icon: TrendingUp },
        { path: '/reports/production-campaign', label: 'Producción por Campaña', icon: TrendingUp },
        { path: '/reports/production-plot', label: 'Producción por Parcela', icon: TrendingUp },
        { path: '/reports/partners-community', label: 'Socios por Comunidad', icon: Users },
        { path: '/reports/hectares-crop', label: 'Hectáreas por Cultivo', icon: Map },
        { path: '/reports/ia', label: 'Reportes con IA', icon: BarChart3 },
      ]
    }
  ];

  const partnerMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/notifications', label: 'Notificaciones', icon: Bell },
    { path: '/ai-chat', label: 'Asistente IA', icon: MessageSquare },
    { path: '/mis-parcelas', label: 'Mis Parcelas', icon: Map },
    { path: '/mis-labores', label: 'Mis Labores', icon: Tractor },
    { path: '/mi-produccion', label: 'Mi Producción', icon: Package },
    { path: '/mis-pagos', label: 'Mis Pagos', icon: CreditCard },
    { path: '/campaigns', label: 'Campañas', icon: Calendar },
    { path: '/events', label: 'Eventos', icon: Calendar },
    { path: '/goals', label: 'Mis Metas', icon: Target },
    { path: '/mi-perfil', label: 'Mi Perfil', icon: User },
  ];

  const customerMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: Home },
    { path: '/notifications', label: 'Notificaciones', icon: Bell },
    { path: '/ai-chat', label: 'Asistente IA', icon: MessageSquare },
    {
      path: '/productos',
      label: 'Productos',
      icon: Package,
      subMenu: [
        { path: '/productos/semillas', label: 'Semillas', icon: Sprout },
        { path: '/productos/fertilizantes', label: 'Fertilizantes', icon: FlaskConical },
        { path: '/productos/campana', label: 'Por Campaña', icon: Calendar },
        { path: '/productos/todos', label: 'Todos los Productos', icon: Package },
      ]
    },
    { path: '/mis-pedidos', label: 'Mis Pedidos', icon: ShoppingCart },
    { path: '/payment-methods', label: 'Métodos de Pago', icon: CreditCard },
    { path: '/events', label: 'Eventos', icon: Calendar },
    { path: '/mi-perfil', label: 'Mi Perfil', icon: User },
  ];

  // Seleccionar menú según rol
  let menuItems = [];
  if (userRole === 'ADMIN') menuItems = adminMenuItems;
  else if (userRole === 'PARTNER') menuItems = partnerMenuItems;
  else if (userRole === 'CUSTOMER') menuItems = customerMenuItems;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40
        w-64 bg-white/10 backdrop-blur-lg border-r border-white/20
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between p-4 border-b border-white/20">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Cooperativa</span>
          </div>
          
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-white lg:hidden"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation with scroll */}
        <nav className="flex-1 overflow-hidden hover:overflow-y-auto py-4">
          <div className="px-4 mb-2">
            <div className="text-xs text-emerald-200/60 font-medium uppercase tracking-wider">
              Navegación
            </div>
          </div>

          <ul className="space-y-1 px-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const hasSubMenu = item.subMenu && item.subMenu.length > 0;
              const isExpanded = expandedMenus[item.label];

              return (
                <li key={item.path}>
                  {hasSubMenu ? (
                    <div>
                      {/* Menú principal con submenú */}
                      <button
                        onClick={() => toggleMenu(item.label)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 text-white/80 hover:text-white hover:bg-white/10"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-5 h-5 flex-shrink-0" />
                          <span className="text-sm font-medium">{item.label}</span>
                        </div>
                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>

                      {/* Submenú expandible */}
                      {isExpanded && (
                        <ul className="mt-1 ml-4 space-y-1 border-l-2 border-white/10 pl-4">
                          {item.subMenu.map((subItem) => {
                            const SubIcon = subItem.icon;
                            return (
                              <li key={subItem.path}>
                                <NavLink
                                  to={subItem.path}
                                  onClick={onClose}
                                  className={({ isActive }) => `
                                    flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                                    ${isActive
                                      ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                                      : 'text-white/70 hover:text-white hover:bg-white/10'
                                    }
                                  `}
                                >
                                  <SubIcon className="w-4 h-4 flex-shrink-0" />
                                  <span className="text-xs font-medium">{subItem.label}</span>
                                </NavLink>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  ) : (
                    /* Menú normal sin submenú */
                    <NavLink
                      to={item.path}
                      onClick={onClose}
                      className={({ isActive }) => `
                        flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200
                        ${isActive
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-400/30'
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                        }
                      `}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </NavLink>
                  )}
                </li>
              );
            })}
          </ul>

          {/* Scroll helper text for mobile */}
          <div className="lg:hidden px-4 mt-4">
            <div className="text-center">
              <div className="text-xs text-emerald-200/40 animate-bounce">
                ↑ Desplázate para ver más opciones ↑
              </div>
            </div>
          </div>
        </nav>

        {/* User info and logout - Fixed at bottom */}
        <div className="flex-shrink-0 p-4 border-t border-white/20">
          <div className="space-y-3">
            {/* User info */}
            <div className="text-center p-2 bg-white/5 rounded-lg">
              <p className="text-white text-sm font-medium truncate">
                {user?.first_name || user?.username || 'Usuario'}
              </p>
              <p className="text-emerald-200/60 text-xs truncate">
                {userRole === 'ADMIN' ? 'Administrador' : userRole === 'PARTNER' ? 'Socio' : 'Cliente'}
              </p>
            </div>

            <div className="text-center">
              <p className="text-white/60 text-xs">Sistema de Gestión</p>
              <p className="text-emerald-200 text-xs font-medium">Cooperativa Agrícola</p>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-200 hover:text-red-100 rounded-lg transition-all duration-200 border border-red-400/30 hover:border-red-400/50"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm font-medium">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
