import { WordBase, GenerateWordsParams } from '@/types/word';

const DIFY_API_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const DIFY_API_KEY = process.env.NEXT_PUBLIC_DIFY_API_KEY;

export class WordListGenerateError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'WordListGenerateError';
  }
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
          "WORDS_EXTRACT_NUMBER": params.words,
          "input_text": params.text
        },
        response_mode: "blocking",
        user: "abc-123"
      }),
    });
    
    // response.bodyの代わりにresponseの状態をログ出力
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers));

    if (!response.ok) {
      throw new WordListGenerateError(`API request failed with status ${response.status}`);
    }

    // ストリームからデータを読み取り
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
          // JSONの文字列をクリーンアップ
          const cleanedJson = wordsOutput
            .replace(/\n/g, '')  // 改行を削除
            .replace(/\\n/g, '') // エスケープされた改行を削除
            .replace(/\\/g, '')  // バックスラッシュを削除
            .replace(/```json\[|\]```/g, '') // マークダウンのJSON記法を削除
            .replace(/^\s*\[|\]\s*$/g, '');  // 配列の括弧を削除
          
          console.log("Cleaned JSON:", cleanedJson);
          // 配列として解析するために括弧で囲む
          return JSON.parse(`[${cleanedJson}]`) as WordBase[];
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
