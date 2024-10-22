"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import Link from 'next/link';
import TextGenerationForm from "@/components/TextGenerationForm";
import Header from "@/components/Header";
import { themes } from "@/styles/themes";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const { theme } = useTheme();

  return (
    <div className={`flex flex-col min-h-screen ${themes[theme as keyof typeof themes]?.background || ''} ${themes[theme as keyof typeof themes]?.text || ''} transition-colors duration-200`}>
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <TextGenerationForm onTextGenerated={setInputText} />
        {inputText && (
          <div className="mt-4">
            <Link href={`/main?text=${encodeURIComponent(inputText)}`} passHref>
              <Button>メインページへ</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
