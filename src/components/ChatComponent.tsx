import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";

export default function ChatComponent() {
  const { theme: currentTheme } = useTheme();

  return (
    <Card className={`${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader>
        <CardTitle className={themes[currentTheme as keyof typeof themes]?.cardText}>チャット</CardTitle>
      </CardHeader>
      <CardContent>
        {/* ここにチャットの内容を追加します */}
        <p>チャット機能はまだ実装されていません。</p>
      </CardContent>
    </Card>
  );
}
