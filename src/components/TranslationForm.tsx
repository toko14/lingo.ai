import React, { useState, useEffect, useRef } from "react";
import { translateText } from "@/utils/translate";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function TranslationForm({ textToTranslate }: { textToTranslate: string }) {
  const [translatedText, setTranslatedText] = useState("");
  const { theme } = useTheme();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textToTranslate) {
      handleTranslate();
    }
  }, [textToTranslate]);

  useEffect(() => {
    adjustHeight();
  }, [translatedText]);

  const handleTranslate = async () => {
    if (textToTranslate) {
      const result = await translateText(textToTranslate);
      setTranslatedText(result);
    }
  };

  const adjustHeight = () => {
    if (contentRef.current) {
      contentRef.current.style.height = 'auto';
      contentRef.current.style.height = `${contentRef.current.scrollHeight}px`;
    }
  };

  return (
    <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border h-full flex flex-col`}>
      <CardHeader>
        <CardTitle className={themes[theme as keyof typeof themes]?.cardText}>翻訳結果</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4">
          <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border h-full`}>
            <CardContent className="h-full pt-6">
              <div
                ref={contentRef}
                className="overflow-y-auto h-full"
                style={{ minHeight: '200px' }}
              >
                <p className={`whitespace-pre-wrap ${themes[theme as keyof typeof themes]?.cardText}`}>{translatedText}</p>
              </div>
            </CardContent>
          </Card>
        </div>
        <Button onClick={handleTranslate} className={`w-full ${themes[theme as keyof typeof themes]?.button}`}>再翻訳</Button>
      </CardContent>
    </Card>
  );
}
