'use client';

import React, { useState, useEffect } from 'react';

const Home: React.FC = () => {
  const [conversation, setConversation] =
    useState(`operator: hola que tal buenas tardes 
client: digame
operator: hola que tal muy buenas tardes queria comunicarme con el señor wilfredo puma porfavor 
client: si con el digame 
operator: hola señor wilfredo que tal mucho gusto un placer te esta saludando charles velazquez y le hablo señor wilfredo de falabella servicios generales ya que es cliente hoy para nuestra tarjeta cmr aca en cuzco correcto una tarjeta cmr que recien se le facilito si lo recuerda verdad caballero 
client: si si lo recuerdo`);

  const [feedback, setFeedback] = useState<string>('');
  const [audioStatus, setAudioStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioText, setAudioText] = useState<string>('');
  const [robotAnimation, setRobotAnimation] = useState('idle');

  // Robot animation controller
  useEffect(() => {
    if (loading) {
      setRobotAnimation('analyzing');
    } else if (isPlaying) {
      setRobotAnimation('speaking');
    } else if (feedback) {
      setRobotAnimation('success');
    } else {
      setRobotAnimation('idle');
    }
  }, [loading, isPlaying, feedback]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;

      utterance.onstart = () => {
        setIsPlaying(true);
        setAudioStatus('Reproduciendo audio...');
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setAudioStatus('Audio completado');
      };

      utterance.onerror = () => {
        setIsPlaying(false);
        setAudioStatus('Error en audio');
      };

      window.speechSynthesis.speak(utterance);
    } else {
      setAudioStatus('Tu navegador no soporta síntesis de voz');
    }
  };

  const stopAudio = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setAudioStatus('Audio detenido');
    }
  };

  const handleFeedback = async () => {
    setLoading(true);
    setError('');
    setAudioStatus('');
    setAudioText('');
    setFeedback('');

    try {
      const analyzeResponse = await fetch(
        'https://feedback-ai-two.vercel.app/api/analyze-conversation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ conversation }),
        }
      );

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(
          errorData.error || `Error HTTP: ${analyzeResponse.status}`
        );
      }

      const apiResult = await analyzeResponse.json();
      setFeedback(apiResult.feedback);

      const audioResponse = await fetch(
        'https://feedback-ai-two.vercel.app/api/text-to-speech',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text: apiResult.feedback }),
        }
      );

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        setAudioStatus('Audio listo para reproducir');
        setAudioText(audioData.textToSpeak);
        speakText(audioData.textToSpeak);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const playFeedbackAudio = () => {
    if (!audioText) return;
    speakText(audioText);
  };

  const clearConversation = () => {
    setConversation('');
    setFeedback('');
    setAudioText('');
    setAudioStatus('');
    setError('');
  };

  // Robot icon component with animations
  const RobotIcon = () => {
    const getAnimationClass = () => {
      switch (robotAnimation) {
        case 'analyzing':
          return 'animate-bounce';
        case 'speaking':
          return 'animate-pulse';
        case 'success':
          return 'animate-ping';
        default:
          return 'hover:animate-bounce';
      }
    };

    return (
      <div className={`w-16 h-16 mx-auto mb-4 ${getAnimationClass()}`}>
        <div className="relative">
          {/* Robot body */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-lg border-4 border-white relative overflow-hidden">
            {/* Robot face */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
              {/* Eyes */}
              <div className="flex gap-1">
                <div
                  className={`w-2 h-2 bg-white rounded-full ${
                    isPlaying ? 'animate-ping' : ''
                  }`}
                ></div>
                <div
                  className={`w-2 h-2 bg-white rounded-full ${
                    isPlaying ? 'animate-ping' : ''
                  }`}
                ></div>
              </div>
            </div>

            {/* Mouth */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <div
                className={`w-4 h-1 ${
                  isPlaying ? 'bg-yellow-400' : 'bg-white'
                } rounded-full transition-colors duration-300`}
              ></div>
            </div>

            {/* Status indicator */}
            <div className="absolute -top-1 -right-1">
              <div
                className={`w-4 h-4 rounded-full border-2 border-white ${
                  loading
                    ? 'bg-yellow-400 animate-pulse'
                    : error
                    ? 'bg-red-400'
                    : feedback
                    ? 'bg-green-400'
                    : 'bg-gray-400'
                }`}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 via-transparent to-purple-200/20 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        ></div>
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-200/20 via-transparent to-pink-200/20 rounded-full animate-spin"
          style={{ animationDuration: '25s' }}
        ></div>
      </div>

      {/* Header with enhanced design */}
      <div className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <RobotIcon />
            <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent mb-4">
              Feedback AI
            </h1>
            <p className="text-lg md:text-xl text-gray-600 font-medium">
              Análisis inteligente de conversaciones con IA avanzada
            </p>
            <div className="flex justify-center gap-6 mt-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span>IA Activa</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span>Audio</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                <span>Análisis Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced error alerts */}
        {error && (
          <div className="mb-8 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 shadow-lg animate-shake">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-red-800">
                  Error detectado
                </h3>
                <p className="text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Enhanced input panel */}
          <div className="space-y-8">
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 animate-pulse"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Conversación de Ventas
                    </h2>
                    <p className="text-blue-100 text-sm">
                      Ingresa el diálogo para análisis
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="relative group">
                  <textarea
                    value={conversation}
                    onChange={(e) => setConversation(e.target.value)}
                    className="w-full h-80 p-6 border-2 border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-mono text-sm bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 shadow-inner"
                    placeholder='Ingresa la conversación aquí...&#10;&#10;Formato esperado:&#10;operator: [mensaje del operador]&#10;client: [mensaje del cliente]&#10;&#10;Ejemplo:&#10;operator: Buenos días, "¿cómo está?"&#10;client: Muy bien, gracias'
                  />

                  {/* Enhanced character counter */}
                  <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-gray-500 border border-gray-200 shadow-sm">
                    <span
                      className={
                        conversation.length > 1000
                          ? 'text-orange-600 font-semibold'
                          : ''
                      }
                    >
                      {conversation.length}
                    </span>{' '}
                    caracteres
                  </div>
                </div>

                {/* Enhanced info box */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-blue-800">
                        Formato requerido
                      </p>
                      <p className="text-sm text-blue-700 mt-1">
                        operator: [mensaje] / client: [mensaje]
                      </p>
                    </div>
                  </div>
                </div>

                {/* Enhanced action buttons */}
                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button
                    onClick={handleFeedback}
                    disabled={loading || !conversation.trim()}
                    className="flex-1 relative bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-bold py-4 px-8 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 disabled:transform-none group overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                        <span>Analizando con IA...</span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>Generar Análisis IA</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={clearConversation}
                    className="px-6 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 group"
                    title="Limpiar todo"
                  >
                    <svg
                      className="w-5 h-5 group-hover:animate-bounce"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    <span className="hidden sm:inline">Limpiar</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha con layout mejorado y transiciones suaves */}
          <div className="space-y-8">
            {/* Sección de audio mejorada con altura fija y transición suave */}
            <div
              className={`bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden transition-all duration-700 ease-in-out transform ${
                audioStatus || audioText
                  ? 'opacity-100 scale-100 translate-y-0 max-h-96'
                  : 'opacity-0 scale-95 -translate-y-4 max-h-0 overflow-hidden'
              }`}
            >
              {(audioStatus || audioText) && (
                <>
                  <div className="bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 px-8 py-6 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-400/20 animate-pulse"></div>
                    <div className="relative flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                        <svg
                          className={`w-6 h-6 text-white ${
                            isPlaying ? 'animate-pulse' : ''
                          }`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M9 12h.01M15 12h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-white">
                          Audio Feedback
                        </h2>
                        <p className="text-purple-100 text-sm">
                          Reproducción de texto a voz
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8">
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-200/50 backdrop-blur-sm">
                      {audioStatus && (
                        <div className="flex items-center gap-3 mb-6">
                          <div
                            className={`w-4 h-4 rounded-full transition-all duration-300 ${
                              isPlaying
                                ? 'bg-green-500 shadow-lg shadow-green-500/50 animate-pulse'
                                : audioStatus.includes('Error')
                                ? 'bg-red-500 shadow-lg shadow-red-500/50'
                                : 'bg-blue-500 shadow-lg shadow-blue-500/50'
                            }`}
                          ></div>
                          <p className="text-purple-800 font-semibold flex-1">
                            {audioStatus}
                          </p>
                          {isPlaying && (
                            <div className="flex gap-1">
                              <div className="w-1 h-4 bg-green-500 rounded animate-pulse"></div>
                              <div
                                className="w-1 h-4 bg-green-500 rounded animate-pulse"
                                style={{ animationDelay: '0.1s' }}
                              ></div>
                              <div
                                className="w-1 h-4 bg-green-500 rounded animate-pulse"
                                style={{ animationDelay: '0.2s' }}
                              ></div>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row gap-4">
                        <button
                          onClick={playFeedbackAudio}
                          disabled={isPlaying || !audioText}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-400 disabled:to-gray-400 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:transform-none group"
                        >
                          {isPlaying ? (
                            <>
                              <div className="flex gap-1">
                                <div className="w-1 h-4 bg-white rounded animate-pulse"></div>
                                <div
                                  className="w-1 h-4 bg-white rounded animate-pulse"
                                  style={{ animationDelay: '0.1s' }}
                                ></div>
                                <div
                                  className="w-1 h-4 bg-white rounded animate-pulse"
                                  style={{ animationDelay: '0.2s' }}
                                ></div>
                              </div>
                              <span>Reproduciendo...</span>
                            </>
                          ) : (
                            <>
                              <svg
                                className="w-5 h-5 group-hover:animate-pulse"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8 5v14l11-7z" />
                              </svg>
                              <span>Reproducir Feedback</span>
                            </>
                          )}
                        </button>

                        {isPlaying && (
                          <button
                            onClick={stopAudio}
                            className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 animate-fadeIn"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M6 6h12v12H6z" />
                            </svg>
                            <span>Detener</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Panel de resultados mejorado con mejor scroll y posicionamiento */}
            <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/20 overflow-hidden sticky top-8">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 px-8 py-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-400/20 animate-pulse"></div>
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">
                      Análisis IA
                    </h2>
                    <p className="text-green-100 text-sm">
                      Feedback inteligente y recomendaciones
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-8 max-h-[calc(100vh-20rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                {!feedback ? (
                  <div className="text-center py-16">
                    <div className="relative mb-8">
                      <div className="w-32 h-32 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center shadow-inner">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-3">
                      Esperando análisis IA
                    </h3>
                    <p className="text-gray-500 text-lg mb-2">
                      El robot está listo para analizar
                    </p>
                    <p className="text-gray-400">
                      Haz clic en "Generar Análisis IA" para comenzar
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200/50 backdrop-blur-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <h3 className="text-xl font-bold text-green-800">
                          Resultado del Análisis IA
                        </h3>
                      </div>
                      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-green-200/50 shadow-inner">
                        <pre className="whitespace-pre-wrap text-gray-800 leading-relaxed font-medium">
                          {feedback}
                        </pre>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced footer */}
        <div className="mt-16 text-center">
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/30 p-8 inline-block">
            <div className="flex flex-wrap justify-center items-center gap-8 text-sm text-gray-600">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">IA Activa</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Audio</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <span className="font-semibold">Análisis</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        /* Estilos para scrollbar personalizada */
        .scrollbar-thin {
          scrollbar-width: thin;
        }

        .scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
          background-color: #d1d5db;
          border-radius: 6px;
        }

        .scrollbar-track-gray-100::-webkit-scrollbar-track {
          background-color: #f3f4f6;
          border-radius: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }
      `}</style>
    </div>
  );
};

export default Home;
