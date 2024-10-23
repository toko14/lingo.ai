"use server";

export async function sendDifyRequest(input_text: string, message: string, conversationId?: string): Promise<any> {
  try {
    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {"input": input_text},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId || "",
        user: "abc-123",
      }),
    });

    if (!response.ok) {
      throw new Error("Dify APIからのレスポンスが正常ではありません");
    }


    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Dify APIリクエストエラー:", error);
    throw new Error("Dify APIリクエスト中にエラーが発生しました");
  }
}
