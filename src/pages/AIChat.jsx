import { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Trash2, Plus, MessageSquare } from 'lucide-react';
import api from '../services/api';

const AIChat = () => {
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const messagesEndRef = useRef(null);

  // Cargar conversaciones
  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll automático al final
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoadingConversations(true);
      const response = await api.get('/api/ai-chat/conversations/');
      setConversations(response.data.results || response.data);
    } catch (error) {
      console.error('Error al cargar conversaciones:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await api.get(`/api/ai-chat/conversations/${conversationId}/`);
      setCurrentConversation(response.data);
      setMessages(response.data.messages || []);
    } catch (error) {
      console.error('Error al cargar conversación:', error);
    }
  };

  const newConversation = () => {
    setCurrentConversation(null);
    setMessages([]);
    setInput('');
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Agregar mensaje del usuario a la UI
    const tempUserMessage = {
      role: 'user',
      content: userMessage,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempUserMessage]);

    try {
      const response = await api.post('/api/ai-chat/conversations/chat/', {
        message: userMessage,
        conversation_id: currentConversation?.id,
        include_context: true
      });

      // Actualizar conversación actual
      if (!currentConversation) {
        setCurrentConversation({ id: response.data.conversation_id });
        fetchConversations();
      }

      // Agregar respuesta de la IA
      setMessages(prev => [
        ...prev.filter(m => m !== tempUserMessage),
        response.data.user_message,
        response.data.assistant_message
      ]);

    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      // Agregar mensaje de error
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Lo siento, ocurrió un error al procesar tu mensaje. Por favor intenta de nuevo.',
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId) => {
    if (!confirm('¿Eliminar esta conversación?')) return;

    try {
      await api.delete(`/api/ai-chat/conversations/${conversationId}/`);
      fetchConversations();
      if (currentConversation?.id === conversationId) {
        newConversation();
      }
    } catch (error) {
      console.error('Error al eliminar conversación:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Preguntas sugeridas principales
  const suggestedQuestions = [
    '¿Cuántos socios tengo?',
    '¿Cuánto vendí hoy?',
    '¿Qué insumos necesito comprar?',
    '¿Cómo van mis metas?',
    '¿Cuántas campañas activas tengo?',
    'Dame un resumen general'
  ];
  
  // Función para enviar pregunta sugerida
  const handleSuggestedQuestion = (question) => {
    setInput(question);
    // Enviar automáticamente
    setTimeout(() => {
      sendMessage();
    }, 100);
  };

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar de conversaciones */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <button
            onClick={newConversation}
            className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center justify-center gap-2 font-semibold"
          >
            <Plus className="w-5 h-5" />
            Nueva Conversación
          </button>
        </div>

        {/* Lista de conversaciones */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {loadingConversations ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay conversaciones</p>
            </div>
          ) : (
            conversations.map((conv) => (
              <div
                key={conv.id}
                className={`p-3 rounded-lg cursor-pointer transition group ${
                  currentConversation?.id === conv.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-750 hover:bg-gray-700 text-gray-300'
                }`}
                onClick={() => loadConversation(conv.id)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{conv.title}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {conv.message_count} mensajes
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConversation(conv.id);
                    }}
                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500 rounded transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Área de chat */}
      <div className="flex-1 flex flex-col bg-gray-900">
        {/* Header */}
        <div className="border-b border-gray-700">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-7 h-7 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">AgroAssist 🌱</h2>
                <p className="text-sm text-gray-400">
                  Tu asistente inteligente
                </p>
              </div>
            </div>
          </div>
          
          {/* Botones de preguntas rápidas */}
          {messages.length > 0 && (
            <div className="px-4 pb-4">
              <p className="text-xs text-gray-500 mb-2">Preguntas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {['¿Cuántos socios?', '¿Ventas hoy?', '¿Stock bajo?', 'Resumen'].map((q, i) => {
                  const fullQuestions = [
                    '¿Cuántos socios tengo?',
                    '¿Cuánto vendí hoy?',
                    '¿Qué insumos necesito comprar?',
                    'Dame un resumen general'
                  ];
                  return (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(fullQuestions[i]);
                        setTimeout(() => sendMessage(), 100);
                      }}
                      disabled={loading}
                      className="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-xs text-gray-300 rounded-full transition"
                    >
                      {q}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Mensajes */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                ¡Hola! Soy tu asistente IA
              </h3>
              <p className="text-gray-400 mb-6">
                Puedo ayudarte con información sobre tu cooperativa
              </p>
              
              {/* Preguntas sugeridas */}
              <div className="max-w-2xl mx-auto">
                <p className="text-sm text-gray-500 mb-3">💡 Haz clic en una pregunta para obtener respuesta:</p>
                <div className="grid grid-cols-2 gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setInput(question);
                        setTimeout(() => sendMessage(), 100);
                      }}
                      disabled={loading}
                      className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-700 disabled:to-gray-700 text-left text-sm text-white rounded-lg transition shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <span className="font-medium">{question}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-600 mt-3 text-center">
                  O escribe tu propia pregunta abajo ⬇️
                </p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                )}
                
                <div
                  className={`max-w-2xl px-4 py-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-50 mt-2">
                    {new Date(message.created_at).toLocaleTimeString()}
                  </p>
                </div>

                {message.role === 'user' && (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-gray-300" />
                  </div>
                )}
              </div>
            ))
          )}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div className="bg-gray-800 px-4 py-3 rounded-lg">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700">
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta..."
              className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none resize-none"
              rows="2"
              disabled={loading}
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              Enviar
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Presiona Enter para enviar, Shift+Enter para nueva línea
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIChat;
