import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function generateEnglishText(toeicScore: number, wordCount: number, theme: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `TOEICスコア${toeicScore}の英語力で、${wordCount}語程度の英文を生成してください。テーマは「${theme}」です。`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("テキスト生成エラー:", error);
    return "テキスト生成中にエラーが発生しました。";
  }
}
