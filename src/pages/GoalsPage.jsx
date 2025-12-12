import { useState, useEffect } from 'react';
import {
  Target,
  Plus,
  Edit,
  Trash2,
  X,
  Save,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import api from '../services/api';

const GoalsPage = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'OTHER',
    target_value: '',
    current_value: '0',
    unit: '',
    start_date: '',
    end_date: '',
    status: 'NOT_STARTED',
    responsible: null,
    notes: '',
  });

  const fetchGoals = async () => {
    try {
      const response = await api.get('/api/goals/goals/');
      setGoals(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar metas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingGoal) {
        await api.put(`/api/goals/goals/${editingGoal.id}/`, formData);
      } else {
        await api.post('/api/goals/goals/', formData);
      }
      setShowModal(false);
      setEditingGoal(null);
      setFormData({
        name: '',
        description: '',
        type: 'OTHER',
        target_value: '',
        current_value: '0',
        unit: '',
        start_date: '',
        end_date: '',
        status: 'NOT_STARTED',
        responsible: null,
        notes: '',
      });
      fetchGoals();
    } catch (error) {
      console.error('Error al guardar meta:', error);
      alert('Error al guardar la meta');
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description,
      type: goal.type || 'OTHER',
      target_value: goal.target_value,
      current_value: goal.current_value,
      unit: goal.unit || '',
      start_date: goal.start_date || '',
      end_date: goal.end_date || '',
      status: goal.status,
      responsible: goal.responsible || null,
      notes: goal.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta meta?')) return;

    try {
      await api.delete(`/api/goals/goals/${id}/`);
      fetchGoals();
    } catch (error) {
      console.error('Error al eliminar meta:', error);
    }
  };

  const handleNew = () => {
    setEditingGoal(null);
    setFormData({
      name: '',
      description: '',
      type: 'OTHER',
      target_value: '',
      current_value: '0',
      unit: '',
      start_date: '',
      end_date: '',
      status: 'NOT_STARTED',
      responsible: null,
      notes: '',
    });
    setShowModal(true);
  };

  const getStatusIcon = (status) => {
    const icons = {
      NOT_STARTED: <Clock className="w-5 h-5 text-yellow-400" />,
      IN_PROGRESS: <TrendingUp className="w-5 h-5 text-blue-400" />,
      AT_RISK: <AlertCircle className="w-5 h-5 text-orange-400" />,
      COMPLETED: <CheckCircle className="w-5 h-5 text-green-400" />,
      CANCELLED: <AlertCircle className="w-5 h-5 text-red-400" />,
    };
    return icons[status] || icons.NOT_STARTED;
  };

  const getStatusColor = (status) => {
    const colors = {
      NOT_STARTED: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300',
      IN_PROGRESS: 'bg-blue-500/20 border-blue-500/50 text-blue-300',
      AT_RISK: 'bg-orange-500/20 border-orange-500/50 text-orange-300',
      COMPLETED: 'bg-green-500/20 border-green-500/50 text-green-300',
      CANCELLED: 'bg-red-500/20 border-red-500/50 text-red-300',
    };
    return colors[status] || colors.NOT_STARTED;
  };

  const getStatusLabel = (status) => {
    const labels = {
      NOT_STARTED: 'No Iniciada',
      IN_PROGRESS: 'En Progreso',
      AT_RISK: 'En Riesgo',
      COMPLETED: 'Completada',
      CANCELLED: 'Cancelada',
    };
    return labels[status] || status;
  };

  const calculateProgress = (current, target) => {
    if (!target || target === 0) return 0;
    const progress = (current / target) * 100;
    return Math.min(Math.round(progress), 100);
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 75) return 'bg-blue-500';
    if (progress >= 50) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  // Agrupar metas por estado
  const groupedGoals = goals.reduce((acc, goal) => {
    if (!acc[goal.status]) acc[goal.status] = [];
    acc[goal.status].push(goal);
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
          <h1 className="text-3xl font-bold text-white mb-2">Metas y Objetivos</h1>
          <p className="text-emerald-200">{goals.length} metas registradas</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleNew}
            className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Meta</span>
          </button>

          <button
            onClick={fetchGoals}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-yellow-500/20 backdrop-blur-lg rounded-xl p-4 border border-yellow-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-200 text-sm">No Iniciadas</p>
              <p className="text-white text-2xl font-bold">
                {groupedGoals.NOT_STARTED?.length || 0}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-blue-500/20 backdrop-blur-lg rounded-xl p-4 border border-blue-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-200 text-sm">En Progreso</p>
              <p className="text-white text-2xl font-bold">
                {groupedGoals.IN_PROGRESS?.length || 0}
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-green-500/20 backdrop-blur-lg rounded-xl p-4 border border-green-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-200 text-sm">Completadas</p>
              <p className="text-white text-2xl font-bold">
                {groupedGoals.COMPLETED?.length || 0}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-orange-500/20 backdrop-blur-lg rounded-xl p-4 border border-orange-500/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-200 text-sm">En Riesgo</p>
              <p className="text-white text-2xl font-bold">
                {groupedGoals.AT_RISK?.length || 0}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-400" />
          </div>
        </div>
      </div>

      {/* Lista de Metas */}
      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-12 text-center border border-white/20">
            <Target className="w-16 h-16 text-white/40 mx-auto mb-4" />
            <p className="text-white/60 text-lg">No hay metas registradas</p>
            <button
              onClick={handleNew}
              className="mt-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Crear primera meta
            </button>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.current_value, goal.target_value);

            return (
              <div
                key={goal.id}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 hover:border-emerald-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-white font-semibold text-lg">
                        {goal.name}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          goal.status
                        )}`}
                      >
                        {getStatusLabel(goal.status)}
                      </span>
                    </div>

                    <p className="text-white/70 text-sm mb-3">{goal.description}</p>

                    {/* Progreso */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-white/60">Progreso</span>
                        <span className="text-white font-semibold">
                          {goal.current_value} / {goal.target_value} {goal.unit}
                        </span>
                      </div>

                      <div className="w-full bg-white/10 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(
                            progress
                          )}`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="text-white/40">{progress}% completado</span>
                        {goal.end_date && (
                          <div className="flex items-center space-x-1 text-white/40">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {new Date(goal.end_date).toLocaleDateString('es-ES')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(goal)}
                      className="p-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(goal.id)}
                      className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal de Crear/Editar */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 rounded-xl p-6 max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {editingGoal ? 'Editar Meta' : 'Nueva Meta'}
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
                <label className="block text-white mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div>
                <label className="block text-white mb-2">Tipo *</label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  required
                >
                  <option value="PRODUCTION">Producción</option>
                  <option value="SALES">Ventas</option>
                  <option value="QUALITY">Calidad</option>
                  <option value="EFFICIENCY">Eficiencia</option>
                  <option value="PARTNERS">Socios</option>
                  <option value="SURFACE">Superficie</option>
                  <option value="OTHER">Otro</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Descripción *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-white mb-2">Valor Objetivo *</label>
                  <input
                    type="number"
                    value={formData.target_value}
                    onChange={(e) =>
                      setFormData({ ...formData, target_value: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Valor Actual *</label>
                  <input
                    type="number"
                    value={formData.current_value}
                    onChange={(e) =>
                      setFormData({ ...formData, current_value: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Unidad</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) =>
                      setFormData({ ...formData, unit: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                    placeholder="Ej: kg, unidades, Bs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white mb-2">Fecha de Inicio *</label>
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>

                <div>
                  <label className="block text-white mb-2">Fecha de Fin *</label>
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) =>
                      setFormData({ ...formData, end_date: e.target.value })
                    }
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-white mb-2">Estado *</label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-emerald-400"
                  required
                >
                  <option value="NOT_STARTED">No Iniciada</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="AT_RISK">En Riesgo</option>
                  <option value="COMPLETED">Completada</option>
                  <option value="CANCELLED">Cancelada</option>
                </select>
              </div>

              <div>
                <label className="block text-white mb-2">Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-emerald-400"
                  placeholder="Notas adicionales..."
                />
              </div>

              <div className="flex items-center space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  <Save className="w-5 h-5" />
                  <span>{editingGoal ? 'Guardar Cambios' : 'Crear Meta'}</span>
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

export default GoalsPage;
