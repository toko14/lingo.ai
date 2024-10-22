import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function WordList() {
  const { theme: currentTheme } = useTheme();

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={themes[currentTheme as keyof typeof themes]?.cardText}>単語リスト</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ここに単語リストの内容を追加します */}
        <p>単語リストの機能はまだ実装されていません。</p>
      </CardContent>
    </Card>
  );
}
