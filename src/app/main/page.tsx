"use client";

import { useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import TranslationForm from "@/components/TranslationForm";
import InputTextDisplay from "@/components/InputTextDisplay";
import Header from "@/components/Header";
import { themes } from "@/styles/themes";

export default function MainPage() {
  const searchParams = useSearchParams();
  const inputText = searchParams.get("text") || "";
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${themes[theme as keyof typeof themes]?.background || ''} ${themes[theme as keyof typeof themes]?.text || ''} transition-colors duration-200`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <InputTextDisplay text={inputText} />
          <TranslationForm textToTranslate={inputText} />
        </div>
        {/* ここに他の機能を追加できます */}
      </main>
    </div>
  );
}
