import React from 'react';

interface ConversationInputProps {
  conversation: string;
  setConversation: (value: string) => void;
  loading: boolean;
  handleFeedback: () => void;
  clearConversation: () => void;
}

const ConversationInput: React.FC<ConversationInputProps> = ({
  conversation,
  setConversation,
  loading,
  handleFeedback,
  clearConversation,
}) => (
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
    <div className="p-8 relative">
      <textarea
        value={conversation}
        onChange={(e) => setConversation(e.target.value)}
        className="w-full h-80 p-6 border-2 border-gray-200 rounded-2xl resize-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 font-mono text-sm bg-gradient-to-br from-gray-50 to-white hover:from-white hover:to-gray-50 shadow-inner"
        placeholder="Ingresa la conversación aquí...&#10;&#10;Formato esperado:&#10;operator: [mensaje del operador]&#10;client: [mensaje del cliente]"
      />
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-lg text-xs text-gray-500 border border-gray-200 shadow-sm">
        <span
          className={
            conversation.length > 1000 ? 'text-orange-600 font-semibold' : ''
          }
        >
          {conversation.length}
        </span>{' '}
        caracteres
      </div>
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
);

export default ConversationInput;
