import React from 'react';
import RobotIcon from './RobotIcon';

interface HeaderProps {
  robotAnimation: string;
  loading: boolean;
  error: string;
  feedback: string;
  isPlaying: boolean;
}

const Header: React.FC<HeaderProps> = ({
  robotAnimation,
  loading,
  error,
  feedback,
  isPlaying,
}) => (
  <div className="relative bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center">
        <RobotIcon
          robotAnimation={robotAnimation}
          loading={loading}
          error={error}
          feedback={feedback}
          isPlaying={isPlaying}
        />
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
);

export default Header;
