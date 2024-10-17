import React, { useState } from "react";
import { generateEnglishText } from "@/utils/text_generater";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function TextGenerationForm({ onTextGenerated }: { onTextGenerated: (text: string) => void }) {
  const [toeicScore, setToeicScore] = useState(500);
  const [wordCount, setWordCount] = useState(50);
  const [theme, setTheme] = useState("");
  const [generatedText, setGeneratedText] = useState("");
  const { theme: currentTheme } = useTheme();

  const handleGenerateText = async () => {
    const text = await generateEnglishText(toeicScore, wordCount, theme);
    setGeneratedText(text);
    onTextGenerated(text);
  };

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={themes[currentTheme as keyof typeof themes]?.cardText}>テキスト生成</CardTitle>
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
            type="text"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="テーマ"
            className={themes[currentTheme as keyof typeof themes]?.input}
          />
        </div>
        <Button onClick={handleGenerateText} className={`w-full ${themes[currentTheme as keyof typeof themes]?.button}`}>テキスト生成</Button>
        <Textarea
          className={`min-h-[200px] ${themes[currentTheme as keyof typeof themes]?.input}`}
          value={generatedText}
          readOnly
          placeholder="生成されたテキストがここに表示されます"
        />
      </CardContent>
    </Card>
  );
}
