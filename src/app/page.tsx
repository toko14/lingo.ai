"use client";

import { useState } from "react";
import { translateText } from "@/utils/translate";    

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");

  const handleTranslate = async () => {
    if (inputText) {
      const result = await translateText(inputText);
      setTranslatedText(result);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">英語から日本語への翻訳</h1>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="英語のテキストを入力してください"
        />
        <button
          className="w-full bg-blue-500 text-white p-2 rounded mb-4"
          onClick={handleTranslate}
        >
          翻訳
        </button>
        <div className="border border-gray-300 rounded p-2 min-h-[100px]">
          <h2 className="font-bold mb-2">翻訳結果：</h2>
          <p>{translatedText}</p>
        </div>
      </main>
    </div>
  );
}
