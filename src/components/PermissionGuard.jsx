import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

/**
 * Componente para controlar la visibilidad de elementos según permisos
 * 
 * Uso:
 * <PermissionGuard permission="users.delete">
 *   <button>Eliminar</button>
 * </PermissionGuard>
 * 
 * Con múltiples permisos (requiere todos):
 * <PermissionGuard permissions={['users.view', 'users.edit']} requireAll>
 *   <button>Editar</button>
 * </PermissionGuard>
 * 
 * Con múltiples permisos (requiere al menos uno):
 * <PermissionGuard permissions={['users.view', 'users.edit']}>
 *   <div>Contenido</div>
 * </PermissionGuard>
 */
const PermissionGuard = ({ 
  permission, 
  permissions, 
  requireAll = false,
  fallback = null,
  children 
}) => {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions();

  let hasAccess = false;

  if (permission) {
    // Permiso único
    hasAccess = hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Múltiples permisos
    hasAccess = requireAll 
      ? hasAllPermissions(permissions)
      : hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return <>{children}</>;
};

export default PermissionGuard;
