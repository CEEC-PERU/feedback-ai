'use client';

import React, { useState } from 'react';

const Home: React.FC = () => {
  const [conversation, setConversation] =
    useState(`operator: hola que tal buenas tardes 
client: digame
operator: hola que tal muy buenas tardes queria comunicarme con el señor wilfredo puma porfavor 
client: si con el digame 
operator: hola señor wilfredo que tal mucho gusto un placer te esta saludando charles velazquez y le hablo señor wilfredo de falabella servicios generales ya que es cliente hoy para nuestra tarjeta cmr aca en cuzco correcto una tarjeta cmr que recien se le facilito si lo recuerda verdad caballero 
client: si si lo recuerdo`);

  const [feedback, setFeedback] = useState<any>(null);
  const [audioStatus, setAudioStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isPlaying, setIsPlaying] = useState(false);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      // Detener cualquier síntesis anterior
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
        setAudioStatus('Error al reproducir audio');
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

    try {
      console.log('Enviando petición a API...');

      // 1. Analizar conversación
      const analyzeResponse = await fetch('/api/analyze-conversation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ conversation }),
      });

      if (!analyzeResponse.ok) {
        const errorData = await analyzeResponse.json();
        throw new Error(
          errorData.error || `Error HTTP: ${analyzeResponse.status}`
        );
      }

      const { analysis } = await analyzeResponse.json();
      console.log('Análisis recibido:', analysis);
      setFeedback(analysis);

      // 2. Preparar audio
      const feedbackText = `Análisis de conversación completado. 
        Puntuación general: ${analysis.puntuacion_general} de 10. 
        Principales fortalezas: ${
          analysis.fortalezas?.slice(0, 2).join(', ') || 'Ninguna específica'
        }. 
        Áreas de mejora: ${
          analysis.areas_mejora?.slice(0, 2).join(', ') || 'Ninguna específica'
        }. 
        Resumen: ${analysis.resumen_ejecutivo || 'Análisis completado'}`;

      const audioResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: feedbackText }),
      });

      if (audioResponse.ok) {
        const audioData = await audioResponse.json();
        console.log('Audio preparado:', audioData);
        setAudioStatus('Audio listo para reproducir');

        // Auto-reproducir el audio
        setTimeout(() => {
          speakText(audioData.textToSpeak);
        }, 500);
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Error desconocido';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          🎯 Analizador de Conversaciones de Ventas
        </h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            <strong>Error:</strong> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📞 Conversación de Ventas
              </h2>

              <textarea
                value={conversation}
                onChange={(e) => setConversation(e.target.value)}
                className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                placeholder="Ingresa la conversación aquí..."
              />

              <p className="text-sm text-gray-600 mt-2">
                📝 Formato: operator: [mensaje] / client: [mensaje]
              </p>
            </div>

            <button
              onClick={handleFeedback}
              disabled={loading || !conversation.trim()}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Analizando...
                </>
              ) : (
                <>🚀 Generar Feedback</>
              )}
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                📊 Análisis de Feedback
              </h2>

              {!feedback ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">🎯</div>
                  <p className="text-gray-500">
                    Haz clic en "Generar Feedback" para ver el análisis
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <h3 className="font-semibold text-lg text-blue-800 mb-2">
                      🎯 Puntuación General: {feedback.puntuacion_general}/10
                    </h3>
                    <div className="w-full bg-blue-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-1000"
                        style={{
                          width: `${(feedback.puntuacion_general / 10) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {feedback.fortalezas && (
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <h4 className="font-semibold text-green-800 mb-2">
                        💪 Fortalezas
                      </h4>
                      <ul className="space-y-1">
                        {feedback.fortalezas.map(
                          (item: string, index: number) => (
                            <li
                              key={index}
                              className="text-green-700 text-sm flex items-start gap-2"
                            >
                              <span className="text-green-500 mt-1">✓</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {feedback.areas_mejora && (
                    <div className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-400">
                      <h4 className="font-semibold text-orange-800 mb-2">
                        🎯 Áreas de Mejora
                      </h4>
                      <ul className="space-y-1">
                        {feedback.areas_mejora.map(
                          (item: string, index: number) => (
                            <li
                              key={index}
                              className="text-orange-700 text-sm flex items-start gap-2"
                            >
                              <span className="text-orange-500 mt-1">→</span>
                              {item}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}

                  {feedback.seguimiento_script && (
                    <div className="bg-purple-50 p-4 rounded-lg border-l-4 border-purple-400">
                      <h4 className="font-semibold text-purple-800">
                        📋 Adherencia al Script: {feedback.seguimiento_script}
                      </h4>
                    </div>
                  )}

                  {feedback.resumen_ejecutivo && (
                    <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-gray-400">
                      <h4 className="font-semibold text-gray-800 mb-2">
                        📈 Resumen Ejecutivo
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {feedback.resumen_ejecutivo}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {audioStatus && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">
                  🔊 Audio del Feedback
                </h2>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-blue-700 text-sm mb-3">{audioStatus}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={() =>
                        feedback &&
                        speakText(
                          `Puntuación: ${feedback.puntuacion_general} de 10. ${feedback.resumen_ejecutivo}`
                        )
                      }
                      disabled={isPlaying}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                    >
                      {isPlaying ? '🔄 Reproduciendo...' : '▶️ Reproducir'}
                    </button>

                    {isPlaying && (
                      <button
                        onClick={stopAudio}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm flex items-center gap-2"
                      >
                        ⏹️ Detener
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
