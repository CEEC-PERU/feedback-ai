import React from 'react';

interface Props {
  audioUrl: string;
}

const AudioPlayer: React.FC<Props> = ({ audioUrl }) => {
  if (!audioUrl) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Audio del Feedback
        </h2>
        <p className="text-gray-500">
          El audio aparecerá aquí después del análisis
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Audio del Feedback
      </h2>

      <audio controls className="w-full" src={audioUrl}>
        Tu navegador no soporta el elemento de audio.
      </audio>

      <a
        href={audioUrl}
        download="feedback.mp3"
        className="inline-block mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-colors"
      >
        Descargar Audio
      </a>
    </div>
  );
};

export default AudioPlayer;
