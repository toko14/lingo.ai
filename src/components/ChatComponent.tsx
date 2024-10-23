import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";
import { sendDifyRequest } from "@/utils/chatApi";

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatComponentProps {
  initialText?: string;
}

export default function ChatComponent({ initialText = "" }: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const { theme: currentTheme } = useTheme();
  const [conversationId, setConversationId] = useState<string>("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    try {
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      
      const userInput = input;
      setInput('');

      const result = await sendDifyRequest(initialText, userInput, conversationId);
      
      if (result && result.answer) {
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: result.answer 
        }]);
        
        if (result.conversation_id) {
          setConversationId(result.conversation_id);
        }
      }
    } catch (error) {
      console.error("エラー:", error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "申し訳ありませんが、エラーが発生しました。" 
      }]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (role: 'user' | 'assistant') => {
    return role === 'user' 
      ? themes[currentTheme as keyof typeof themes]?.userMessage
      : themes[currentTheme as keyof typeof themes]?.assistantMessage;
  };

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border h-[600px] flex flex-col`}>
      <CardHeader>
        <CardTitle className={themes[currentTheme as keyof typeof themes]?.cardText}>チャット</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto pr-4"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 mb-4 ${
                message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`flex flex-col w-full max-w-[80%] leading-1.5 p-4 rounded-lg ${getMessageStyle(message.role)}`}
              >
                <p className="text-sm font-medium">{message.content}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="メッセージを入力..."
            className={themes[currentTheme as keyof typeof themes]?.input}
          />
          <Button 
            onClick={handleSendMessage}
            className={themes[currentTheme as keyof typeof themes]?.button}
          >
            送信
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
