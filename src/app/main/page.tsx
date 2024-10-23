"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from 'next/navigation';
import TranslationForm from "@/components/TranslationForm";
import InputTextDisplay from "@/components/InputTextDisplay";
import WordList from "@/components/WordList";
import ChatComponent from "@/components/ChatComponent";
import Header from "@/components/Header";
import { themes } from "@/styles/themes";

export default function MainPage() {
  const [inputText, setInputText] = useState("");
  const { theme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const storedText = sessionStorage.getItem('inputText');
    if (storedText) {
      setInputText(storedText);
    }
  }, [router]);

  return (
    <div className={`flex flex-col min-h-screen ${themes[theme as keyof typeof themes]?.background || ''} ${themes[theme as keyof typeof themes]?.text || ''} transition-colors duration-200`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <InputTextDisplay text={inputText} />
          <TranslationForm textToTranslate={inputText} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <WordList text={inputText} />
          <ChatComponent initialText={inputText} />
        </div>
      </main>
    </div>
  );
}
