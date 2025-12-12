import { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Trash2, X } from 'lucide-react';
import api from '../../services/api';

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones
  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications/notifications/recent/');
      setNotifications(response.data);
      
      // Obtener conteo de no leídas
      const countResponse = await api.get('/api/notifications/notifications/unread_count/');
      setUnreadCount(countResponse.data.unread_count);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  // Cargar al montar y cada 30 segundos
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Marcar como leída
  const markAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/notifications/${id}/mark_read/`);
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await api.post('/api/notifications/notifications/mark_all_read/');
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar todas las leídas
  const deleteAllRead = async () => {
    if (!confirm('¿Eliminar todas las notificaciones leídas?')) return;
    
    try {
      setLoading(true);
      await api.delete('/notifications/notifications/delete_all_read/');
      fetchNotifications();
    } catch (error) {
      console.error('Error al eliminar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener color según tipo
  const getTypeColor = (type) => {
    const colors = {
      INFO: 'bg-blue-500',
      SUCCESS: 'bg-green-500',
      WARNING: 'bg-yellow-500',
      ERROR: 'bg-red-500',
      SALE: 'bg-purple-500',
      PAYMENT: 'bg-emerald-500',
      STOCK: 'bg-orange-500',
      REQUEST: 'bg-cyan-500',
      ALERT: 'bg-red-500',
      TASK: 'bg-indigo-500',
    };
    return colors[type] || 'bg-gray-500';
  };

  // Obtener icono según tipo
  const getTypeIcon = (type) => {
    const icons = {
      SALE: '💰',
      PAYMENT: '💳',
      STOCK: '📦',
      REQUEST: '📝',
      ALERT: '⚠️',
      TASK: '✅',
      SUCCESS: '✓',
      ERROR: '✗',
      WARNING: '⚡',
      INFO: 'ℹ️',
    };
    return icons[type] || 'ℹ️';
  };

  return (
    <div className="relative">
      {/* Botón de campana */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-300 hover:text-white hover:bg-gray-700 rounded-lg transition"
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown de notificaciones */}
      {isOpen && (
        <>
          {/* Overlay para cerrar */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* Panel de notificaciones */}
          <div className="absolute right-0 mt-2 w-96 bg-gray-800 rounded-lg shadow-2xl z-50 border border-gray-700">
            {/* Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-white">Notificaciones</h3>
                <p className="text-sm text-gray-400">
                  {unreadCount} sin leer
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Acciones rápidas */}
            {notifications.length > 0 && (
              <div className="p-2 border-b border-gray-700 flex gap-2">
                <button
                  onClick={markAllAsRead}
                  disabled={loading || unreadCount === 0}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  <CheckCheck className="w-4 h-4" />
                  Marcar todas
                </button>
                <button
                  onClick={deleteAllRead}
                  disabled={loading}
                  className="flex-1 px-3 py-2 text-sm bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Limpiar leídas
                </button>
              </div>
            )}

            {/* Lista de notificaciones */}
            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-gray-400">
                  <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No tienes notificaciones</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 border-b border-gray-700 hover:bg-gray-750 transition cursor-pointer ${
                      !notification.read ? 'bg-gray-750' : ''
                    }`}
                    onClick={() => {
                      if (!notification.read) {
                        markAsRead(notification.id);
                      }
                      if (notification.action_url) {
                        window.location.href = notification.action_url;
                      }
                    }}
                  >
                    <div className="flex gap-3">
                      {/* Icono de tipo */}
                      <div className={`flex-shrink-0 w-10 h-10 ${getTypeColor(notification.type)} rounded-full flex items-center justify-center text-white text-lg`}>
                        {getTypeIcon(notification.type)}
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className={`text-sm font-semibold ${
                            notification.read ? 'text-gray-300' : 'text-white'
                          }`}>
                            {notification.title}
                          </h4>
                          {!notification.read && (
                            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mt-1 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {notification.time_ago}
                          </span>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markAsRead(notification.id);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                            >
                              <Check className="w-3 h-3" />
                              Marcar leída
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-3 border-t border-gray-700 text-center">
                <a
                  href="/notifications"
                  className="text-sm text-blue-400 hover:text-blue-300"
                  onClick={() => setIsOpen(false)}
                >
                  Ver todas las notificaciones →
                </a>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
