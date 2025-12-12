import { useState, useEffect } from 'react';
import {
  Bell,
  Check,
  Trash2,
  Filter,
  RefreshCw,
  Plus,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from 'lucide-react';
import api from '../services/api';

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'INFO',
    action_url: '',
  });

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/api/notifications/notifications/');
      setNotifications(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await api.post(`/api/notifications/notifications/${id}/mark-read/`);
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/api/notifications/notifications/mark-all-read/');
      fetchNotifications();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta notificación?')) return;

    try {
      await api.delete(`/api/notifications/notifications/${id}/`);
      fetchNotifications();
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/notifications/notifications/', formData);
      setShowCreateModal(false);
      setFormData({ title: '', message: '', type: 'INFO', action_url: '' });
      fetchNotifications();
    } catch (error) {
      console.error('Error al crear notificación:', error);
      alert('Error al crear la notificación');
    }
  };

  const getIcon = (type) => {
    const icons = {
      INFO: <Info className="w-5 h-5 text-blue-400" />,
      SUCCESS: <CheckCircle className="w-5 h-5 text-green-400" />,
      WARNING: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
      ERROR: <XCircle className="w-5 h-5 text-red-400" />,
      ALERT: <AlertCircle className="w-5 h-5 text-orange-400" />,
    };
    return icons[type] || icons.INFO;
  };

  const getTypeColor = (type) => {
    const colors = {
      INFO: 'bg-blue-500/20 border-blue-500/50',
      SUCCESS: 'bg-green-500/20 border-green-500/50',
      WARNING: 'bg-yellow-500/20 border-yellow-500/50',
      ERROR: 'bg-red-500/20 border-red-500/50',
      ALERT: 'bg-orange-500/20 border-orange-500/50',
    };
    return colors[type] || colors.INFO;
  };

  const filteredNotifications = notifications.filter((notif) => {
    if (filter === 'unread') return !notif.read;
    if (filter === 'read') return notif.read;
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Notificaciones</h1>
          <p className="text-emerald-200">
            {unreadCount} notificaciones sin leer
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva</span>
          </button>

          <button
            onClick={handleMarkAllAsRead}
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <Check className="w-5 h-5" />
            <span>Marcar todas</span>
          </button>

          <button
            onClick={fetchNotifications}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center space-x-3">
        <Filter className="w-5 h-5 text-white/60" />
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'all'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Todas ({notifications.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'unread'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          No leídas ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            filter === 'read'
              ? 'bg-emerald-500 text-white'
              : 'bg-white/10 text-white/60 hover:bg-white/20'
          }`}
        >
          Leídas ({notifications.length - unreadCount})
        </button>
      </div>

      {/* Lista de Notificaciones */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <Bell className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No hay notificaciones</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border transition-all ${
                notification.read
                  ? 'border-white/20 opacity-75'
                  : 'border-emerald-400/50 shadow-lg shadow-emerald-500/20'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Icono */}
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center border ${getTypeColor(
                    notification.type
                  )}`}
                >
                  {getIcon(notification.type)}
                </div>

                {/* Contenido */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold">
                        {notification.title}
                      </h3>
                      <p className="text-white/60 text-sm mt-1">
                        {notification.message}
                      </p>
                    </div>

                    {!notification.read && (
                      <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs">
                      {new Date(notification.created_at).toLocaleString('es-ES')}
                    </span>

                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg transition-colors"
                          title="Marcar como leída"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(notification.id)}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Crear Notificación */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 max-w-md w-full border border-white/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Nueva Notificación</h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Título</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Mensaje</label>
                <textarea
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Tipo</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                >
                  <option value="INFO">Información</option>
                  <option value="SUCCESS">Éxito</option>
                  <option value="WARNING">Advertencia</option>
                  <option value="ERROR">Error</option>
                  <option value="ALERT">Alerta</option>
                </select>
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Crear Notificación
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
