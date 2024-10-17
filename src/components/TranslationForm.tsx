import React, { useState, useEffect } from "react";
import { translateText } from "@/utils/translate";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TranslationForm({ textToTranslate }: { textToTranslate: string }) {
  const [translatedText, setTranslatedText] = useState("");

  useEffect(() => {
    if (textToTranslate) {
      handleTranslate();
    }
  }, [textToTranslate]);

  const handleTranslate = async () => {
    if (textToTranslate) {
      const result = await translateText(textToTranslate);
      setTranslatedText(result);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>翻訳結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card>
          <CardContent className="mt-4">
            <p className="whitespace-pre-wrap">{translatedText}</p>
          </CardContent>
        </Card>
        <Button onClick={handleTranslate} className="w-full">再翻訳</Button>
      </CardContent>
    </Card>
  );
}
