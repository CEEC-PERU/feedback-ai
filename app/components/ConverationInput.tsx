import React from 'react';

interface Props {
  conversation: string;
  onChange: (value: string) => void;
}

const ConversationInput: React.FC<Props> = ({ conversation, onChange }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Conversación de Ventas
      </h2>

      <textarea
        value={conversation}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Ingresa la conversación aquí..."
      />

      <p className="text-sm text-gray-600 mt-2">
        Formato: operator: [mensaje] / client: [mensaje]
      </p>
    </div>
  );
};

export default ConversationInput;
