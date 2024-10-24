import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY as string);

export async function translateText(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const prompt = `以下の英語のテキストを、自然で適切な日本語に翻訳してください。文脈や意味を正確に捉え、日本語として違和感のない表現を心がけてください：

                    "${text}"

                   翻訳結果は、引用符やその他の余分な記号を含めず、純粋な日本語テキストのみを出力してください。`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Translation error:", error);
    return "翻訳エラーが発生しました。";
  }
}
