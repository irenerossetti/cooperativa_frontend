import { useAuth } from '../context/AuthContext';

/**
 * Hook para verificar permisos del usuario
 * Soporta permisos anidados usando notación de punto
 * 
 * Ejemplos:
 * - hasPermission('users.view')
 * - hasPermission('users.delete')
 * - hasPermission('ui.show_delete_button')
 */
export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permissionKey) => {
    // Superuser tiene todos los permisos
    if (user?.is_superuser) {
      return true;
    }

    // Sin rol o rol inactivo = sin permisos
    if (!user?.role || !user.role.permissions) {
      return false;
    }

    // Navegar por la estructura anidada
    const keys = permissionKey.split('.');
    let value = user.role.permissions;

    for (const key of keys) {
      if (value && typeof value === 'object' && key in value) {
        value = value[key];
      } else {
        return false;
      }
    }

    return Boolean(value);
  };

  const hasAnyPermission = (permissionKeys) => {
    return permissionKeys.some(key => hasPermission(key));
  };

  const hasAllPermissions = (permissionKeys) => {
    return permissionKeys.every(key => hasPermission(key));
  };

  return {
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
  };
};

export default usePermissions;
