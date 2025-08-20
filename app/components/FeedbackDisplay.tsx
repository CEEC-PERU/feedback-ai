import React from 'react';

interface Props {
  feedback: any;
}

const FeedbackDisplay: React.FC<Props> = ({ feedback }) => {
  if (!feedback) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          Análisis de Feedback
        </h2>
        <p className="text-gray-500">
          Haz clic en "Generar Feedback" para ver el análisis
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Análisis de Feedback
      </h2>

      {feedback.puntuacion_general && (
        <div className="mb-4">
          <h3 className="font-semibold text-lg text-blue-600">
            Puntuación General: {feedback.puntuacion_general}/10
          </h3>
        </div>
      )}

      {feedback.fortalezas && (
        <div className="mb-4">
          <h4 className="font-semibold text-green-600 mb-2">Fortalezas:</h4>
          <ul className="list-disc list-inside space-y-1">
            {feedback.fortalezas.map((item: string, index: number) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.areas_mejora && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-600 mb-2">Áreas de Mejora:</h4>
          <ul className="list-disc list-inside space-y-1">
            {feedback.areas_mejora.map((item: string, index: number) => (
              <li key={index} className="text-gray-700">
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {feedback.seguimiento_script && (
        <div className="mb-4">
          <h4 className="font-semibold text-purple-600">
            Adherencia al Script: {feedback.seguimiento_script}
          </h4>
        </div>
      )}

      {feedback.resumen_ejecutivo && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Resumen:</h4>
          <p className="text-gray-700">{feedback.resumen_ejecutivo}</p>
        </div>
      )}

      {feedback.texto_completo && (
        <div className="whitespace-pre-wrap text-gray-700">
          {feedback.texto_completo}
        </div>
      )}
    </div>
  );
};

export default FeedbackDisplay;
