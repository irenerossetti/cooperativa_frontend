import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import api from '../services/api';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { type: 'bot', text: '¡Hola! Soy tu asistente virtual de la Cooperativa Agrícola. ¿En qué puedo ayudarte hoy?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [clienteId] = useState(() => `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const quickMessages = [
    '¿Qué servicios ofrecen?',
    'Información sobre créditos',
    '¿Tienen semillas disponibles?',
    'Quiero afiliarme',
    'Asesoría técnica'
  ];

  const handleSendMessage = async (messageText = null) => {
    const textToSend = messageText || inputMessage.trim();
    if (!textToSend) return;

    // Agregar mensaje del usuario
    const userMessage = { type: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Llamar al API del chatbot
      const response = await api.post('/api/chatbot/api/', {
        message: textToSend,
        cliente_id: clienteId
      });

      // Agregar respuesta del bot
      const botMessage = { 
        type: 'bot', 
        text: response.data.response || 'Lo siento, no pude procesar tu mensaje.'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error al enviar mensaje:', error);
      const errorMessage = { 
        type: 'bot', 
        text: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  const handleQuickMessage = (message) => {
    handleSendMessage(message);
  };

  const handleReset = () => {
    setMessages([
      { type: 'bot', text: '¡Hola! Soy tu asistente virtual de la Cooperativa Agrícola. ¿En qué puedo ayudarte hoy?' }
    ]);
  };

  return (
    <>
      {/* Botón flotante */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 animate-pulse"
          style={{ zIndex: 9999 }}
          title="Abrir asistente virtual"
        >
          <MessageCircle className="w-7 h-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></span>
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full"></span>
        </button>
      )}

      {/* Ventana del chat */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-gray-900/95 backdrop-blur-xl border border-emerald-500/30 rounded-2xl shadow-2xl flex flex-col animate-in slide-in-from-bottom-5"
          style={{ zIndex: 9999 }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center animate-pulse">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold">Asistente Agrícola</h3>
                <p className="text-emerald-100 text-xs flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></span>
                  <span>En línea</span>
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleReset}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Reiniciar conversación"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
                title="Cerrar chat"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quick Messages */}
          {messages.length <= 1 && (
            <div className="p-3 bg-emerald-500/10 border-b border-emerald-500/20">
              <p className="text-emerald-200 text-xs mb-2">Preguntas rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {quickMessages.map((msg, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickMessage(msg)}
                    className="text-xs bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 px-3 py-1.5 rounded-full transition-colors border border-emerald-500/30"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-gray-900/50 to-gray-900/80">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl shadow-lg ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-br-sm'
                      : 'bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-bl-sm'
                  }`}
                >
                  {message.type === 'bot' && (
                    <div className="flex items-center space-x-2 mb-1">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span className="text-xs text-emerald-300 font-medium">Asistente</span>
                    </div>
                  )}
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
                  <span className="text-xs opacity-60 mt-1 block">
                    {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
            
            {/* Loading indicator */}
            {isLoading && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-3 rounded-2xl rounded-bl-sm">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
                    <span className="text-sm text-emerald-200">Escribiendo...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/20 bg-gray-900/80">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                disabled={isLoading}
                className="flex-1 bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-emerald-200/50 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white p-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            </div>
            <p className="text-xs text-emerald-200/40 mt-2 text-center">
              Powered by IA • Cooperativa Agrícola
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
