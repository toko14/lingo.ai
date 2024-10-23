import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.dify.ai/v1';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

if (!API_KEY) {
  console.warn('API_KEYが環境変数に設定されていません');
}

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`,
  },
});

export async function generateTextFromUrl(url: string, toeicScore: number, wordCount: number): Promise<string> {
  try {
    const response = await axiosInstance.post('/workflows/run', {
      inputs: {
        url: url,
        toeic_level: toeicScore,
        words: wordCount,
      },
      response_mode: 'streaming',
      user: 'abc-123',
    });

    if (typeof response.data === 'string') {
      const lines = response.data.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const jsonData = JSON.parse(line.substring(6));
            if (jsonData.event === 'workflow_finished' && jsonData.data?.outputs?.output) {
              return jsonData.data.outputs.output;
            }
          } catch (error) {
            console.error('JSONパースエラー:', error);
          }
        }
      }
    }
    
    throw new Error('テキスト生成に失敗しました: 出力が見つかりません');
  } catch (error) {
    console.error('API呼び出しエラー:', error);
    throw new Error('テキスト生成中にエラーが発生しました');
  }
}
