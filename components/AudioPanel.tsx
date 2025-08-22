import React from 'react';

interface AudioPanelProps {
  audioStatus: string;
  audioText: string;
  isPlaying: boolean;
  playFeedbackAudio: () => void;
  stopAudio: () => void;
}

const AudioPanel: React.FC<AudioPanelProps> = ({
  audioStatus,
  audioText,
  isPlaying,
  playFeedbackAudio,
  stopAudio,
}) => (
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
              <h2 className="text-2xl font-bold text-white">Audio Feedback</h2>
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
);

export default AudioPanel;
