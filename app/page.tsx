'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ConversationInput from '../components/ConversationInput';
import FeedbackPanel from '../components/FeedbackPanel';
import AudioPanel from '../components/AudioPanel';
import ErrorAlert from '../components/ErrorAlert';
import styles from '../app/styles/Home.module.css';
import { useFeedback } from '../hooks/useFeedback';
import { useAudio } from '../hooks/useAudio';

const Home: React.FC = () => {
  const [conversation, setConversation] =
    useState(`operator: hola que tal buenas tardes 
client: digame
operator: hola que tal muy buenas tardes queria comunicarme con el señor wilfredo puma porfavor 
client: si con el digame 
operator: hola señor wilfredo que tal mucho gusto un placer te esta saludando charles velazquez y le hablo señor wilfredo de falabella servicios generales ya que es cliente hoy para nuestra tarjeta cmr aca en cuzco correcto una tarjeta cmr que recien se le facilito si lo recuerda verdad caballero 
client: si si lo recuerdo`);

  const [robotAnimation, setRobotAnimation] = useState('idle');

  // Custom hooks
  const feedbackHook = useFeedback();
  const audioHook = useAudio();

  useEffect(() => {
    if (feedbackHook.loading) {
      setRobotAnimation('analyzing');
    } else if (audioHook.isPlaying) {
      setRobotAnimation('speaking');
    } else if (feedbackHook.feedback) {
      setRobotAnimation('success');
    } else {
      setRobotAnimation('idle');
    }
  }, [feedbackHook.loading, audioHook.isPlaying, feedbackHook.feedback]);

  const handleFeedback = async () => {
    feedbackHook.clear();
    audioHook.clear();
    const result = await feedbackHook.analyzeConversation(conversation);
    if (result) {
      await audioHook.generateAudio(result);
    }
  };

  const clearConversation = () => {
    setConversation('');
    feedbackHook.clear();
    audioHook.clear();
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
        loading={feedbackHook.loading}
        error={feedbackHook.error}
        feedback={feedbackHook.feedback}
        isPlaying={audioHook.isPlaying}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorAlert error={feedbackHook.error} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <ConversationInput
            conversation={conversation}
            setConversation={setConversation}
            loading={feedbackHook.loading}
            handleFeedback={handleFeedback}
            clearConversation={clearConversation}
          />

          <div className="space-y-8">
            <AudioPanel
              audioStatus={audioHook.audioStatus}
              audioText={audioHook.audioText}
              isPlaying={audioHook.isPlaying}
              playFeedbackAudio={() => audioHook.speakText(audioHook.audioText)}
              stopAudio={audioHook.stopAudio}
            />

            <FeedbackPanel feedback={feedbackHook.feedback} />
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default Home;
