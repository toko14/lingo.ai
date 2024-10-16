import React, { useState } from "react";
import { translateText } from "@/utils/translate";
import { generateEnglishText } from "@/utils/text_generater";

export default function TranslationForm() {
  const [inputText, setInputText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [toeicScore, setToeicScore] = useState(500);
  const [wordCount, setWordCount] = useState(50);
  const [theme, setTheme] = useState("");

  const handleTranslate = async () => {
    if (inputText) {
      const result = await translateText(inputText);
      setTranslatedText(result);
    }
  };

  const handleGenerateText = async () => {
    const generatedText = await generateEnglishText(toeicScore, wordCount, theme);
    setInputText(generatedText);
  };

  return (
    <div>
      <div className="mb-4">
        <h2 className="font-bold mb-2">テキスト生成</h2>
        <div className="flex gap-2 mb-2">
          <input
            type="number"
            className="w-1/3 p-2 border border-gray-300 rounded"
            value={toeicScore}
            onChange={(e) => setToeicScore(Number(e.target.value))}
            placeholder="TOEICスコア"
          />
          <input
            type="number"
            className="w-1/3 p-2 border border-gray-300 rounded"
            value={wordCount}
            onChange={(e) => setWordCount(Number(e.target.value))}
            placeholder="単語数"
          />
          <input
            type="text"
            className="w-1/3 p-2 border border-gray-300 rounded"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="テーマ"
          />
        </div>
        <button
          className="w-full bg-green-500 text-white p-2 rounded mb-4"
          onClick={handleGenerateText}
        >
          テキスト生成
        </button>
      </div>
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
    </div>
  );
}
