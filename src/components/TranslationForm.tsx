import React, { useState } from "react";
import { translateText } from "@/utils/translate";
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TranslationForm({ initialText = "" }: { initialText?: string }) {
  const [inputText, setInputText] = useState(initialText);
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    if (inputText) {
      const result = await translateText(inputText);
      setTranslatedText(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>翻訳</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          className="min-h-[200px]"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="英語のテキストを入力してください"
        />
        <Button onClick={handleTranslate} className="w-full">翻訳</Button>
        <Card>
          <CardHeader>
            <CardTitle>翻訳結果</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{translatedText}</p>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
