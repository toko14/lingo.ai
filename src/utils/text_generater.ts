import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function generateEnglishText(toeicScore: number, wordCount: number, theme: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `You are an English language expert capable of generating text suitable for learners with specific TOEIC scores. Please generate an English passage based on the following criteria:
        TOEIC Score: ${toeicScore}
        Create text appropriate for this English proficiency level.
        Word Count: Approximately ${wordCount} words
        Generate text close to this word count, within ±10%.
        Theme: "${theme}"
        Write content related to this theme.
        Adjust vocabulary, grammar, and sentence complexity according to the TOEIC score level.
        Output Format: Provide only the generated English text, without any additional explanations or metadata.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("テキスト生成エラー:", error);
    return "テキスト生成中にエラーが発生しました。";
  }
}
