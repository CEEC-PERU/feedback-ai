'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConversationInput from '../components/ConversationInput';
import FeedbackPanel from '../components/FeedbackPanel';
import AudioPanel from '../components/AudioPanel';
import ErrorAlert from '../components/ErrorAlert';
import styles from '../app/styles/Home.module.css';

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
      const apiResult = await analyzeResponse.json();
      setFeedback(apiResult.feedback);
      const audioResponse = await fetch('/api/text-to-speech', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: apiResult.feedback }),
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-blue-200/20 via-transparent to-purple-200/20 rounded-full animate-spin"
          style={{ animationDuration: '20s' }}
        />
        <div
          className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-indigo-200/20 via-transparent to-pink-200/20 rounded-full animate-spin"
          style={{ animationDuration: '25s' }}
        />
      </div>

      <Header
        robotAnimation={robotAnimation}
        loading={loading}
        error={error}
        feedback={feedback}
        isPlaying={isPlaying}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert error={error} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ConversationInput
            conversation={conversation}
            setConversation={setConversation}
            loading={loading}
            handleFeedback={handleFeedback}
            clearConversation={clearConversation}
          />

          <div className="space-y-8">
            <AudioPanel
              audioStatus={audioStatus}
              audioText={audioText}
              isPlaying={isPlaying}
              playFeedbackAudio={playFeedbackAudio}
              stopAudio={stopAudio}
            />

            <FeedbackPanel feedback={feedback} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
