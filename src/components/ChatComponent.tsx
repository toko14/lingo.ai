import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";
import { sendDifyRequest } from "@/utils/chatApi";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || isWaitingForResponse) return;

    try {
      setIsWaitingForResponse(true);
      setMessages(prev => [...prev, { role: 'user', content: input }]);
      
      const userInput = input;
      setInput('');

      const result = await sendDifyRequest(initialText, userInput, conversationId);
      
      if (result && result.answer) {
        const formattedAnswer = typeof result.answer === 'string' 
          ? result.answer.trim()
          : result.answer;
        
        setMessages(prev => [...prev, { 
          role: 'assistant', 
          content: formattedAnswer 
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
    } finally {
      setIsWaitingForResponse(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isWaitingForResponse) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMessageStyle = (role: 'user' | 'assistant') => {
    return role === 'user' 
      ? themes[currentTheme as keyof typeof themes]?.userMessage
      : themes[currentTheme as keyof typeof themes]?.assistantMessage;
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border h-[600px] flex flex-col`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-2xl font-bold text-center ${themes[currentTheme as keyof typeof themes]?.cardText}`}>
          チャット
          {isWaitingForResponse && <span className="ml-2">応答待ち...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden p-4">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto pr-4"
        >
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                variants={messageVariants}
                initial="hidden"
                animate="visible"
                transition={{ duration: 0.2 }}
                className={`flex items-start gap-2 mb-4 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`flex flex-col w-full max-w-[80%] leading-1.5 p-4 rounded-lg ${getMessageStyle(message.role)}`}
                >
                  <p className="text-sm font-medium whitespace-pre-wrap">{message.content}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
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
            disabled={isWaitingForResponse}
          />
          <Button 
            onClick={handleSendMessage}
            className={themes[currentTheme as keyof typeof themes]?.button}
            disabled={isWaitingForResponse}
          >
            送信
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
