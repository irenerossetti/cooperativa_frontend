import { useState, useEffect } from 'react';
import {
  Calendar,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  MapPin,
  Clock,
  Users,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

const EventsCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    location: '',
    max_participants: '',
  });

  const fetchEvents = async () => {
    try {
      const response = await api.get('/api/events/events/');
      setEvents(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await api.put(`/api/events/events/${editingEvent.id}/`, formData);
      } else {
        await api.post('/api/events/events/', formData);
      }
      setShowModal(false);
      setEditingEvent(null);
      setFormData({
        title: '',
        description: '',
        event_date: '',
        location: '',
        max_participants: '',
      });
      fetchEvents();
    } catch (error) {
      console.error('Error al guardar evento:', error);
      alert('Error al guardar el evento');
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      event_date: event.event_date,
      location: event.location || '',
      max_participants: event.max_participants || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este evento?')) return;

    try {
      await api.delete(`/api/events/events/${id}/`);
      fetchEvents();
    } catch (error) {
      console.error('Error al eliminar evento:', error);
    }
  };

  const handleNew = () => {
    setEditingEvent(null);
    setFormData({
      title: '',
      description: '',
      event_date: '',
      location: '',
      max_participants: '',
    });
    setShowModal(true);
  };

  // Agrupar eventos por mes
  const groupedEvents = events.reduce((acc, event) => {
    const date = new Date(event.event_date);
    const monthYear = date.toLocaleDateString('es-ES', {
      month: 'long',
      year: 'numeric',
    });
    if (!acc[monthYear]) acc[monthYear] = [];
    acc[monthYear].push(event);
    return acc;
  }, {});

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
          <h1 className="text-3xl font-bold text-white mb-2">
            Calendario de Eventos
          </h1>
          <p className="text-emerald-200">{events.length} eventos programados</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleNew}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Evento</span>
          </button>

          <button
            onClick={fetchEvents}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Lista de Eventos por Mes */}
      <div className="space-y-6">
        {Object.keys(groupedEvents).length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <Calendar className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No hay eventos programados</p>
            <button
              onClick={handleNew}
              className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Crear primer evento
            </button>
          </div>
        ) : (
          Object.entries(groupedEvents).map(([monthYear, monthEvents]) => (
            <div key={monthYear}>
              <h2 className="text-xl font-bold text-white mb-4 capitalize">
                {monthYear}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all"
                  >
                    {/* Fecha */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-16 h-16 bg-emerald-500/20 rounded-lg flex flex-col items-center justify-center border border-emerald-400/30">
                        <span className="text-emerald-300 text-2xl font-bold">
                          {new Date(event.event_date).getDate()}
                        </span>
                        <span className="text-emerald-200 text-xs uppercase">
                          {new Date(event.event_date).toLocaleDateString('es-ES', {
                            month: 'short',
                          })}
                        </span>
                      </div>

                      <div className="flex-1">
                        <h3 className="text-white font-semibold text-lg">
                          {event.title}
                        </h3>
                        <div className="flex items-center space-x-2 text-emerald-200 text-sm">
                          <Clock className="w-4 h-4" />
                          <span>
                            {new Date(event.event_date).toLocaleTimeString('es-ES', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className="text-white/70 text-sm mb-4 line-clamp-2">
                      {event.description}
                    </p>

                    {/* Detalles */}
                    <div className="space-y-2 mb-4">
                      {event.location && (
                        <div className="flex items-center space-x-2 text-white/60 text-sm">
                          <MapPin className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}

                      {event.max_participants && (
                        <div className="flex items-center space-x-2 text-white/60 text-sm">
                          <Users className="w-4 h-4" />
                          <span>Máx. {event.max_participants} participantes</span>
                        </div>
                      )}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center space-x-2 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleEdit(event)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Editar</span>
                      </button>

                      <button
                        onClick={() => handleDelete(event.id)}
                        className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Eliminar</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingEvent ? 'Editar Evento' : 'Nuevo Evento'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white mb-2">Título *</label>
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
                <label className="block text-white mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Fecha y Hora *</label>
                  <input
                    type="datetime-local"
                    value={formData.event_date}
                    onChange={(e) =>
                      setFormData({ ...formData, event_date: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Ubicación</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                    placeholder="Ej: Salón principal"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">
                  Máximo de Participantes
                </label>
                <input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) =>
                    setFormData({ ...formData, max_participants: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  placeholder="Dejar vacío para ilimitado"
                  min="1"
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingEvent ? 'Guardar Cambios' : 'Crear Evento'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
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

export default EventsCalendar;
