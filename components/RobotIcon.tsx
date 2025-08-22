import React from 'react';

interface RobotIconProps {
  robotAnimation: string;
  loading: boolean;
  error: string;
  feedback: string;
  isPlaying: boolean;
}

const RobotIcon: React.FC<RobotIconProps> = ({
  robotAnimation,
  loading,
  error,
  feedback,
  isPlaying,
}) => {
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
        <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl shadow-lg border-4 border-white relative overflow-hidden">
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
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
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
            <div
              className={`w-4 h-1 ${
                isPlaying ? 'bg-yellow-400' : 'bg-white'
              } rounded-full transition-colors duration-300`}
            ></div>
          </div>
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

export default RobotIcon;
