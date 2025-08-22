import { useState } from 'react';

export const useFeedback = () => {
  const [feedback, setFeedback] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const analyzeConversation = async (conversation: string) => {
    setLoading(true);
    setError('');
    setFeedback('');
    try {
      const analyzeResponse = await fetch('/api/analyze-conversation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      return apiResult.feedback;
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error desconocido');
      return '';
    } finally {
      setLoading(false);
    }
  };

  const clear = () => {
    setFeedback('');
    setError('');
  };

  return { feedback, loading, error, analyzeConversation, clear, setFeedback };
};
