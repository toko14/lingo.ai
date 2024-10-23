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
    return data;
  } catch (error) {
    console.error("Dify APIリクエストエラー:", error);
    throw error;
  }
};
