import { useState } from 'react';

export const useAudio = () => {
  const [audioStatus, setAudioStatus] = useState('');
  const [audioText, setAudioText] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);

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

  const generateAudio = async (text: string) => {
    setAudioStatus('');
    setAudioText('');
    if (!text) return;
    const audioResponse = await fetch('/api/text-to-speech', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });
    if (audioResponse.ok) {
      const audioData = await audioResponse.json();
      setAudioStatus('Audio listo para reproducir');
      setAudioText(audioData.textToSpeak);
      speakText(audioData.textToSpeak);
    }
  };

  const clear = () => {
    setAudioText('');
    setAudioStatus('');
  };

  return {
    audioText,
    audioStatus,
    isPlaying,
    speakText,
    stopAudio,
    generateAudio,
    clear,
    setAudioText,
  };
};
