import { useState, useCallback } from 'react';
import { Word, WordBase, GenerateWordsParams } from '@/types/word';
import { generateWordList, WordListGenerateError } from '@/utils/wordListGenerate';

export const useWordList = () => {
  const [words, setWords] = useState<Word[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateWords = useCallback(async (params: GenerateWordsParams) => {
    setIsLoading(true);
    setError(null);
    try {
      const wordBaseList = await generateWordList(params);
      const wordsWithId: Word[] = wordBaseList.map((word, index) => ({
        ...word,
        id: Date.now() + index,
      }));
      setWords(wordsWithId);
    } catch (err) {
      setError(
        err instanceof WordListGenerateError 
          ? err.message 
          : '単語リストの生成に失敗しました'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    words,
    isLoading,
    error,
    generateWords,
  };
};
