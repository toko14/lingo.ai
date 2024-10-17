import React, { useState, useEffect } from "react";
import { translateText } from "@/utils/translate";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function TranslationForm({ textToTranslate }: { textToTranslate: string }) {
  const [translatedText, setTranslatedText] = useState("");
  const { theme } = useTheme();

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
    <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={themes[theme as keyof typeof themes]?.cardText}>翻訳結果</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border`}>
          <CardContent className="mt-4">
            <div className="h-[200px] overflow-y-auto">
              <p className={`whitespace-pre-wrap ${themes[theme as keyof typeof themes]?.cardText}`}>{translatedText}</p>
            </div>
          </CardContent>
        </Card>
        <Button onClick={handleTranslate} className={`w-full ${themes[theme as keyof typeof themes]?.button}`}>再翻訳</Button>
      </CardContent>
    </Card>
  );
}
