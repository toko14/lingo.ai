import React, { useState } from "react";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function UrlTextGenerationForm({ onTextGenerated }: { onTextGenerated: (text: string) => void }) {
  const [toeicScore, setToeicScore] = useState(500);
  const [wordCount, setWordCount] = useState(50);
  const [url, setUrl] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const { theme: currentTheme } = useTheme();

  const handleGenerateText = async () => {
    try {
      const response = await fetch('/api/generate-text-from-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toeicScore, wordCount, url }),
      });

      if (!response.ok) {
        throw new Error('テキスト生成に失敗しました');
      }

      const data = await response.json();
      setGeneratedText(data.text);
      onTextGenerated(data.text);
    } catch (error) {
      console.error('エラー:', error);
      alert('テキスト生成中にエラーが発生しました');
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneratedText(e.target.value);
    onTextGenerated(e.target.value);
  };

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={themes[currentTheme as keyof typeof themes]?.cardText}>URLからテキスト生成</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={toeicScore}
            onChange={(e) => setToeicScore(Number(e.target.value))}
            placeholder="TOEICスコア"
            className={themes[currentTheme as keyof typeof themes]?.input}
          />
          <Input
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            placeholder="単語数"
            className={themes[currentTheme as keyof typeof themes]?.input}
          />
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="URL"
            className={themes[currentTheme as keyof typeof themes]?.input}
          />
        </div>
        <Button onClick={handleGenerateText} className={`w-full ${themes[currentTheme as keyof typeof themes]?.button}`}>テキスト生成</Button>
        <Textarea
          className={`min-h-[200px] ${themes[currentTheme as keyof typeof themes]?.input}`}
          value={generatedText}
          onChange={handleTextareaChange}
          placeholder="生成されたテキストがここに表示されます。編集も可能です。"
        />
      </CardContent>
    </Card>
  );
}
