import { useCallback } from 'react';

export const useSpeech = () => {
  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    } else {
      console.error('Web Speech API is not supported in this browser.');
    }
  }, []);

  return { speak };
};
