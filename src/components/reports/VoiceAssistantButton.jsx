import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Mic, MicOff, Volume2, Sparkles, ChevronDown } from 'lucide-react';

const VoiceAssistantButton = ({ onReportRequest }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('idle');
  const [recognition, setRecognition] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Cerrar dropdown al hacer clic fuera
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    // Calcular posición del dropdown cuando se abre
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right
      });
    }
  }, [isOpen]);

  useEffect(() => {
    // Inicializar Web Speech API
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
        setResponse('Error al reconocer el audio');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [transcript]);

  const startListening = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
      speak('Te escucho');
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

  const processCommand = (command) => {
    setStatus('processing');
    const lowerCommand = command.toLowerCase();

    try {
      let filters = {};
      let commandRecognized = false;
      
      // Comandos de estadísticas y totales
      if (lowerCommand.includes('total') || lowerCommand.includes('cuántos') || lowerCommand.includes('cuantos')) {
        if (lowerCommand.includes('socio')) {
          setResponse('Mostrando total de socios');
          speak('Mostrando total de socios');
          onReportRequest({ type: 'show_stats', stat: 'partners' });
        } else if (lowerCommand.includes('parcela')) {
          setResponse('Mostrando total de parcelas');
          speak('Mostrando total de parcelas');
          onReportRequest({ type: 'show_stats', stat: 'parcels' });
        } else if (lowerCommand.includes('producción') || lowerCommand.includes('produccion')) {
          setResponse('Mostrando producción total');
          speak('Mostrando producción total');
          onReportRequest({ type: 'show_stats', stat: 'production' });
        } else {
          setResponse('Mostrando estadísticas generales');
          speak('Mostrando estadísticas generales');
          onReportRequest({ type: 'show_stats', stat: 'all' });
        }
        setStatus('success');
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }

      // Comandos de ordenamiento
      if (lowerCommand.includes('ordenar') || lowerCommand.includes('ordenado') || lowerCommand.includes('orden')) {
        let sortBy = 'production';
        let sortOrder = 'desc';
        
        if (lowerCommand.includes('nombre')) sortBy = 'name';
        else if (lowerCommand.includes('superficie')) sortBy = 'surface';
        else if (lowerCommand.includes('rendimiento')) sortBy = 'yield';
        
        if (lowerCommand.includes('ascendente') || lowerCommand.includes('menor') || lowerCommand.includes('bajo')) {
          sortOrder = 'asc';
        }
        
        setResponse(`Ordenando por ${sortBy} ${sortOrder === 'desc' ? 'descendente' : 'ascendente'}`);
        speak(`Ordenando por ${sortBy}`);
        setStatus('success');
        onReportRequest({ type: 'sort', sortBy, sortOrder });
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }

      // Comandos de top/mejores
      if (lowerCommand.includes('mejor') || lowerCommand.includes('top') || lowerCommand.includes('primero')) {
        const numberMatch = lowerCommand.match(/(\d+)/);
        const limit = numberMatch ? parseInt(numberMatch[1]) : 5;
        
        let category = 'production';
        if (lowerCommand.includes('rendimiento')) category = 'yield';
        else if (lowerCommand.includes('superficie')) category = 'surface';
        
        setResponse(`Mostrando top ${limit} por ${category}`);
        speak(`Mostrando los ${limit} mejores`);
        setStatus('success');
        onReportRequest({ type: 'top', category, limit });
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }

      // Comando de actualizar
      if (lowerCommand.includes('actualizar') || lowerCommand.includes('refrescar') || lowerCommand.includes('recargar')) {
        setResponse('Actualizando datos...');
        speak('Actualizando datos');
        setStatus('success');
        onReportRequest({ type: 'refresh' });
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }

      // Comando de exportar
      if (lowerCommand.includes('exportar') || lowerCommand.includes('descargar') || lowerCommand.includes('generar') || lowerCommand.includes('crear')) {
        let format = 'csv';
        if (lowerCommand.includes('pdf')) format = 'pdf';
        else if (lowerCommand.includes('excel')) format = 'excel';
        else if (lowerCommand.includes('reporte') || lowerCommand.includes('informe')) format = 'pdf';
        
        setResponse(`Generando ${format.toUpperCase()}...`);
        speak(`Generando ${format === 'pdf' ? 'reporte en PDF' : format}`);
        setStatus('success');
        onReportRequest({ type: 'export', format });
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }

      // Comando de limpiar filtros
      if (lowerCommand.includes('limpiar') || lowerCommand.includes('borrar') || lowerCommand.includes('quitar')) {
        setResponse('Limpiando filtros...');
        speak('Filtros limpiados');
        setStatus('success');
        onReportRequest({ type: 'clear_filters' });
        commandRecognized = true;
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
        return;
      }
      
      // Extraer filtros numéricos
      const mayorMatch = lowerCommand.match(/mayor\s+(?:a|de|que)\s+(\d+)/);
      const menorMatch = lowerCommand.match(/menor\s+(?:a|de|que)\s+(\d+)/);
      
      if (mayorMatch) {
        if (lowerCommand.includes('producción') || lowerCommand.includes('produccion')) {
          filters.minProduction = mayorMatch[1];
          commandRecognized = true;
        } else if (lowerCommand.includes('rendimiento')) {
          filters.minYield = mayorMatch[1];
          commandRecognized = true;
        } else if (lowerCommand.includes('superficie') || lowerCommand.includes('hectárea')) {
          filters.minSurface = mayorMatch[1];
          commandRecognized = true;
        }
      }
      
      if (menorMatch) {
        if (lowerCommand.includes('producción') || lowerCommand.includes('produccion')) {
          filters.maxProduction = menorMatch[1];
          commandRecognized = true;
        } else if (lowerCommand.includes('rendimiento')) {
          filters.maxYield = menorMatch[1];
          commandRecognized = true;
        } else if (lowerCommand.includes('superficie') || lowerCommand.includes('hectárea')) {
          filters.maxSurface = menorMatch[1];
          commandRecognized = true;
        }
      }

      if (Object.keys(filters).length > 0) {
        const filterDesc = Object.entries(filters).map(([key, value]) => {
          if (key.includes('Production')) return `producción ${key.includes('min') ? 'mayor a' : 'menor a'} ${value}`;
          if (key.includes('Yield')) return `rendimiento ${key.includes('min') ? 'mayor a' : 'menor a'} ${value}`;
          if (key.includes('Surface')) return `superficie ${key.includes('min') ? 'mayor a' : 'menor a'} ${value}`;
          return '';
        }).join(', ');
        
        setResponse(`Filtros aplicados: ${filterDesc}`);
        speak('Filtros aplicados correctamente');
        setStatus('success');
        onReportRequest({ type: 'apply_filters', filters });
        setTimeout(() => {
          setIsOpen(false);
          setStatus('idle');
          setTranscript('');
          setResponse('');
        }, 2000);
      } else if (!commandRecognized) {
        setResponse('No entendí el comando. Intenta: "total de socios", "top 5 mejores", "ordenar por rendimiento", "actualizar" o "exportar"');
        speak('No entendí el comando');
        setStatus('error');
      }
    } catch (error) {
      setResponse('Error al procesar el comando');
      speak('Ocurrió un error');
      setStatus('error');
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'listening': return 'text-red-400';
      case 'processing': return 'text-blue-400';
      case 'success': return 'text-green-400';
      case 'error': return 'text-red-400';
      default: return 'text-purple-400';
    }
  };

  const hasVoiceSupport = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  return (
    <>
      {/* Botón principal */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg"
        title="Asistente de Voz"
      >
        <Mic className="w-4 h-4" />
        <span className="hidden sm:inline">Voz</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown compacto con portal */}
      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          className="fixed w-80 bg-gray-900/95 backdrop-blur-lg border border-purple-500/30 rounded-xl shadow-2xl overflow-hidden" 
          style={{ 
            top: `${dropdownPosition.top}px`, 
            right: `${dropdownPosition.right}px`,
            zIndex: 99999 
          }}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600/20 to-indigo-600/20 p-3 border-b border-purple-500/20">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-white text-sm font-semibold">Asistente de Voz</span>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-4 space-y-3">
            {!hasVoiceSupport ? (
              <p className="text-red-300 text-xs text-center">
                Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge.
              </p>
            ) : (
              <>
                {/* Botón de micrófono */}
                <div className="flex justify-center">
                  <button
                    onClick={isListening ? stopListening : startListening}
                    disabled={status === 'processing'}
                    className={`relative w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                      isListening 
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 animate-pulse' 
                        : 'bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-110'
                    } ${status === 'processing' ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isListening ? (
                      <Mic className="w-8 h-8 text-white" />
                    ) : (
                      <MicOff className="w-8 h-8 text-white" />
                    )}
                    {isListening && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></span>
                    )}
                  </button>
                </div>

                {/* Estado */}
                <div className={`text-center text-xs font-medium ${getStatusColor()}`}>
                  {status === 'idle' && 'Presiona el micrófono'}
                  {status === 'listening' && 'Escuchando...'}
                  {status === 'processing' && 'Procesando...'}
                  {status === 'success' && '✓ Comando ejecutado'}
                  {status === 'error' && '✗ Error'}
                </div>

                {/* Transcripción */}
                {transcript && (
                  <div className="bg-white/5 border border-white/10 rounded-lg p-2">
                    <div className="flex items-start space-x-2">
                      <Volume2 className="w-3 h-3 text-purple-400 mt-0.5 flex-shrink-0" />
                      <p className="text-white text-xs">{transcript}</p>
                    </div>
                  </div>
                )}

                {/* Respuesta */}
                {response && (
                  <div className={`border rounded-lg p-2 ${
                    status === 'success' 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <p className={`text-xs ${
                      status === 'success' ? 'text-green-200' : 'text-red-200'
                    }`}>
                      {response}
                    </p>
                  </div>
                )}

                {/* Ejemplos */}
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-emerald-200/60 mb-1">Ejemplos:</p>
                  <div className="space-y-1">
                    {[
                      'Quiero el total de socios',
                      'Generar reporte en PDF',
                      'Top 5 mejores',
                      'Ordenar por rendimiento',
                      'Actualizar datos'
                    ].map((example, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setTranscript(example);
                          processCommand(example);
                        }}
                        className="w-full text-left text-xs text-purple-300 hover:text-purple-200 bg-white/5 hover:bg-white/10 rounded px-2 py-1 transition-colors"
                      >
                        "{example}"
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default VoiceAssistantButton;
