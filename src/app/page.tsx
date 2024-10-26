"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { useRouter } from 'next/navigation';
import TextGenerationForm from "@/components/TextGenerationForm";
import Header from "@/components/Header";
import { themes } from "@/styles/themes";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const { theme } = useTheme();
  const router = useRouter();

  const handleNavigate = () => {
    if (inputText) {
      sessionStorage.setItem('inputText', inputText);
      router.push('/main');
    }
  };

  return (
    <div className={`flex flex-col min-h-screen ${themes[theme as keyof typeof themes]?.background || ''} ${themes[theme as keyof typeof themes]?.text || ''} transition-colors duration-200`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <TextGenerationForm onTextGenerated={setInputText} />
        </div>
        {inputText && (
          <div className="mt-8 flex justify-center">
            <Button
              onClick={handleNavigate}
              className="text-lg font-bold py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              メインページへ進む 🚀
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
