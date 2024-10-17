import React, { useState } from "react";
import { generateEnglishText } from "@/utils/text_generater";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TextGenerationForm({ onTextGenerated }: { onTextGenerated: (text: string) => void }) {
  const [toeicScore, setToeicScore] = useState(500);
  const [wordCount, setWordCount] = useState(50);
  const [theme, setTheme] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerateText = async () => {
    const text = await generateEnglishText(toeicScore, wordCount, theme);
    setGeneratedText(text);
    onTextGenerated(text);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>テキスト生成</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-2">
          <Input
            type="number"
            value={toeicScore}
            onChange={(e) => setToeicScore(Number(e.target.value))}
            placeholder="TOEICスコア"
          />
          <Input
            type="number"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            placeholder="単語数"
          />
          <Input
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="テーマ"
          />
        </div>
        <Button onClick={handleGenerateText} className="w-full">テキスト生成</Button>
        <Textarea
          className="min-h-[200px]"
          value={generatedText}
          readOnly
          placeholder="生成されたテキストがここに表示されます"
        />
      </CardContent>
    </Card>
  );
}
