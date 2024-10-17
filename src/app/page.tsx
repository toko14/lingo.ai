"use client";

import { useState } from "react";
import TextGenerationForm from "@/components/TextGenerationForm";
import TranslationForm from "@/components/TranslationForm";
import Header from "@/components/Header";

export default function Home() {
  const [generatedText, setGeneratedText] = useState("");

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <TextGenerationForm onTextGenerated={setGeneratedText} />
          <TranslationForm textToTranslate={generatedText} />
        </div>
      </main>
    </div>
  );
}
