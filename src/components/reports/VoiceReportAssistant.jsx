import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, Loader, CheckCircle, XCircle, Sparkles } from 'lucide-react';

const VoiceReportAssistant = ({ onReportRequest }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('idle'); // idle, listening, processing, success, error
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Verificar si el navegador soporta Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'es-ES';

      recognitionInstance.onstart = () => {
        setStatus('listening');
        setTranscript('');
        setResponse('');
      };

      recognitionInstance.onresult = (event) => {
        const current = event.resultIndex;
        const transcriptText = event.results[current][0].transcript;
        setTranscript(transcriptText);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
        if (transcript) {
          processCommand(transcript);
        } else {
          setStatus('idle');
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);
        setStatus('error');
        setResponse('Error al reconocer el audio. Intenta de nuevo.');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      speak('Te escucho, ¿qué reporte necesitas?');
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const processCommand = async (command) => {
    setStatus('processing');
    const lowerCommand = command.toLowerCase();

    try {
      // Detectar tipo de reporte solicitado
      if (lowerCommand.includes('producción') && lowerCommand.includes('parcela')) {
        setResponse('Generando reporte de producción por parcela...');
        speak('Generando reporte de producción por parcela');
        onReportRequest({ type: 'production_by_parcel', filters: extractFilters(command) });
        setStatus('success');
      } 
      else if (lowerCommand.includes('producción') && lowerCommand.includes('campaña')) {
        setResponse('Generando reporte de producción por campaña...');
        speak('Generando reporte de producción por campaña');
        onReportRequest({ type: 'production_by_campaign', filters: extractFilters(command) });
        setStatus('success');
      }
      else if (lowerCommand.includes('labores') || lowerCommand.includes('rendimiento')) {
        setResponse('Generando reporte de labores por campaña...');
        speak('Generando reporte de labores por campaña');
        onReportRequest({ type: 'labors_by_campaign', filters: extractFilters(command) });
        setStatus('success');
      }
      else if (lowerCommand.includes('predicción') || lowerCommand.includes('predecir')) {
        setResponse('Generando predicción con inteligencia artificial...');
        speak('Generando predicción con inteligencia artificial');
        onReportRequest({ type: 'ml_prediction', filters: extractFilters(command) });
        setStatus('success');
      }
      else if (lowerCommand.includes('exportar') || lowerCommand.includes('descargar')) {
        const format = lowerCommand.includes('excel') ? 'excel' : 
                      lowerCommand.includes('pdf') ? 'pdf' : 'csv';
        setResponse(`Exportando reporte en formato ${format.toUpperCase()}...`);
        speak(`Exportando reporte en formato ${format}`);
        onReportRequest({ type: 'export', format });
        setStatus('success');
      }
      else {
        setResponse('No entendí el comando. Intenta decir: "muestra producción por parcela" o "genera predicción"');
        speak('No entendí el comando. Intenta de nuevo.');
        setStatus('error');
      }
    } catch (error) {
      setResponse('Error al procesar el comando');
      speak('Ocurrió un error al procesar tu solicitud');
      setStatus('error');
    }
  };

  const extractFilters = (command) => {
    const filters = {};
    const lowerCommand = command.toLowerCase();

    // Extraer filtros de la voz
    if (lowerCommand.includes('mayor a') || lowerCommand.includes('más de')) {
      const match = lowerCommand.match(/(?:mayor a|más de)\s+(\d+)/);
      if (match) {
        filters.minProduction = match[1];
      }
    }

    if (lowerCommand.includes('menor a') || lowerCommand.includes('menos de')) {
      const match = lowerCommand.match(/(?:menor a|menos de)\s+(\d+)/);
      if (match) {
        filters.maxProduction = match[1];
      }
    }

    // Extraer nombres de socios
    const socioMatch = lowerCommand.match(/socio\s+([a-záéíóúñ\s]+?)(?:\s|$)/i);
    if (socioMatch) {
      filters.partnerName = socioMatch[1].trim();
    }

    return filters;
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'listening':
        return <Mic className="w-6 h-6 text-red-400 animate-pulse" />;
      case 'processing':
        return <Loader className="w-6 h-6 text-blue-400 animate-spin" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <MicOff className="w-6 h-6 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening':
        return 'from-red-500 to-pink-500';
      case 'processing':
        return 'from-blue-500 to-cyan-500';
      case 'success':
        return 'from-green-500 to-emerald-500';
      case 'error':
        return 'from-red-500 to-orange-500';
      default:
        return 'from-purple-500 to-indigo-500';
    }
  };

  if (!recognition) {
    return (
      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-center">
        <p className="text-red-200 text-sm">
          Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-10 h-10 bg-gradient-to-r ${getStatusColor()} rounded-lg flex items-center justify-center`}>
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Asistente de Voz con IA</h3>
          <p className="text-emerald-200/80 text-sm">Pide reportes usando tu voz</p>
        </div>
      </div>

      {/* Botón de micrófono */}
      <div className="flex justify-center mb-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={status === 'processing'}
          className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
            isListening 
              ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
              : 'bg-gradient-to-r from-purple-500 to-indigo-500'
          } ${status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isListening ? (
            <Mic className="w-10 h-10 text-white" />
          ) : (
            <MicOff className="w-10 h-10 text-white" />
          )}
          
          {isListening && (
            <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
          )}
        </button>
      </div>

      {/* Estado y transcripción */}
      <div className="space-y-3">
        {/* Estado */}
        <div className="flex items-center justify-center space-x-2">
          {getStatusIcon()}
          <span className="text-white text-sm font-medium">
            {status === 'idle' && 'Presiona el micrófono para hablar'}
            {status === 'listening' && 'Escuchando...'}
            {status === 'processing' && 'Procesando comando...'}
            {status === 'success' && 'Comando ejecutado'}
            {status === 'error' && 'Error al procesar'}
          </span>
        </div>

        {/* Transcripción */}
        {transcript && (
          <div className="bg-white/5 border border-white/10 rounded-lg p-3">
            <div className="flex items-start space-x-2">
              <Volume2 className="w-4 h-4 text-purple-400 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs text-emerald-200/60 mb-1">Escuché:</p>
                <p className="text-white text-sm">{transcript}</p>
              </div>
            </div>
          </div>
        )}

        {/* Respuesta */}
        {response && (
          <div className={`border rounded-lg p-3 ${
            status === 'success' 
              ? 'bg-green-500/10 border-green-500/30' 
              : 'bg-red-500/10 border-red-500/30'
          }`}>
            <p className={`text-sm ${
              status === 'success' ? 'text-green-200' : 'text-red-200'
            }`}>
              {response}
            </p>
          </div>
        )}
      </div>

      {/* Ejemplos de comandos */}
      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-xs text-emerald-200/60 mb-2">Ejemplos de comandos:</p>
        <div className="grid grid-cols-1 gap-2">
          {[
            'Muestra producción por parcela',
            'Genera reporte de labores',
            'Predice rendimiento de parcela',
            'Exportar en Excel'
          ].map((example, index) => (
            <button
              key={index}
              onClick={() => {
                setTranscript(example);
                processCommand(example);
              }}
              className="text-left text-xs text-purple-300 hover:text-purple-200 bg-white/5 hover:bg-white/10 rounded px-3 py-2 transition-colors"
            >
              "{example}"
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VoiceReportAssistant;
