import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  options?: string[];  // 選択肢を追加
}

export default function ChatComponent() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const { theme: currentTheme } = useTheme();
  const scrollRef = useRef<HTMLDivElement>(null);

  // 新しいメッセージが追加されたときに自動スクロール
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // ユーザーメッセージを追加
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // 仮の応答（選択肢付き）
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: "以下のオプションから選択してください：",
        options: ["オプション1", "オプション2", "オプション3"]
      }]);
    }, 1000);

    setInput('');
  };

  const handleOptionClick = (option: string) => {
    setMessages(prev => [...prev, { role: 'user', content: option }]);
    
    // オプション選択後の応答
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: `「${option}」を選択しました。` 
      }]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
              className={`flex items-start gap-2 mb-2 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex flex-col w-full max-w-[320px] leading-1.5 px-3 py-2 border rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.options && (
                  <div className="flex flex-col gap-2 mt-2">
                    {message.options.map((option, optionIndex) => (
                      <Button
                        key={optionIndex}
                        variant="outline"
                        size="sm"
                        onClick={() => handleOptionClick(option)}
                        className="text-sm text-left hover:bg-gray-200 dark:hover:bg-gray-700"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                )}
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
            onKeyPress={handleKeyPress}
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
