"use server";

export const sendDifyRequest = async (
  initialText: string,
  message: string,
  conversationId?: string
) => {
  try {
    console.log("api call");
    const response = await fetch("https://api.dify.ai/v1/chat-messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CHAT_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: {"input": initialText},
        query: message,
        response_mode: "blocking",
        conversation_id: conversationId || "",
        user: "abc-123",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Error:", errorData);
      throw new Error(`Dify APIエラー: ${response.status}`);
    }

    console.log("initialText", initialText);
    const data = await response.json();
    
    // レスポンスデータを整形
    if (data.answer) {
      try {
        // JSONとして解析可能な場合は解析
        const parsedAnswer = JSON.parse(data.answer);
        data.answer = parsedAnswer.meaning || parsedAnswer.content || data.answer;
      } catch {
        // JSON解析に失敗した場合は元のテキストをそのまま使用
        // **と##を削除し、改行を保持
        data.answer = data.answer
          .replace(/\*\*/g, '')
          .replace(/##/g, '')
          .replace(/\\n/g, '\n');  // バックスラッシュ付きの改行文字を実際の改行に変換
      }
    }
    
    return data;
  } catch (error) {
    console.error("Dify APIリクエストエラー:", error);
    throw error;
  }
};
