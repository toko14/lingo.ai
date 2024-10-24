import { WordBase, GenerateWordsParams } from '@/types/word';

const DIFY_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY;

export class WordListGenerateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WordListGenerateError';
  }
}

// ランダムに配列から要素を抽出する関数
function getRandomElements<T>(array: T[], n: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

export const generateWordList = async (params: GenerateWordsParams): Promise<WordBase[]> => {
  try {
    const response = await fetch(`${DIFY_API_URL}/workflows/run`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${DIFY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        inputs: {
          "TOEIC_LEVEL": params.toeic_level,
          "WORDS_EXTRACT_NUMBER": params.words * 2, // より多くの単語を要求
          "input_text": params.text
        },
        response_mode: "blocking",
        user: "abc-123"
      }),
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      throw new WordListGenerateError(`API request failed with status ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new WordListGenerateError('Response body is null');
    }

    let result = '';
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = new TextDecoder().decode(value);
      console.log("Received chunk:", chunk);
      
      try {
        const data = JSON.parse(chunk);
        if (data.data?.outputs?.words) {
          const wordsOutput = data.data.outputs.words;
          const cleanedJson = wordsOutput
            .replace(/\n/g, '')
            .replace(/\\n/g, '')
            .replace(/\\/g, '')
            .replace(/```json\[|\]```/g, '')
            .replace(/^\s*\[|\]\s*$/g, '');
          
          console.log("Cleaned JSON:", cleanedJson);
          
          // 全ての単語を解析
          const allWords = JSON.parse(`[${cleanedJson}]`) as WordBase[];
          
          // 重複を除去
          const uniqueWords = Array.from(
            new Map(allWords.map(word => [word.english, word])).values()
          );
          
          // 要求された数だけランダムに抽出
          const selectedWords = getRandomElements(uniqueWords, params.words);
          
          console.log(`Selected ${selectedWords.length} words from ${uniqueWords.length} unique words`);
          
          return selectedWords;
        }
      } catch (error) {
        console.error("Error parsing chunk:", error);
        continue;
      }
    }

    throw new WordListGenerateError('No valid response data found');
  } catch (error) {
    if (error instanceof WordListGenerateError) {
      throw error;
    }
    throw new WordListGenerateError('Failed to generate word list');
  }
};
