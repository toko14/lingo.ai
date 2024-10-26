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
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* アプリケーションの説明セクションを追加 */}
        <div className="max-w-3xl mx-auto mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            Lingo.aiへようこそ
          </h1>
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-5 shadow-lg border border-purple-500/30 hover:border-pink-500/30 transition-colors duration-300">
            <p className="text-lg mb-3">
              このアプリは、AIを活用して自分だけの英語学習を促進するツールです。
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-left">
              <div className="p-3 rounded-lg bg-white/5 border border-purple-400/20">
                <h3 className="text-xl font-semibold mb-2">✨ 唯一の教材</h3>
                <p>難易度、語数、テーマを設定し、自分だけの教材を生成できます。</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-purple-400/20">
                <h3 className="text-xl font-semibold mb-2">🚀 自動単語帳生成</h3>
                <p>AIにより自動で難しい単語を抽出し、単語帳を生成します。</p>
              </div>
              <div className="p-3 rounded-lg bg-white/5 border border-purple-400/20">
                <h3 className="text-xl font-semibold mb-2">🎨 AIチャット</h3>
                <p>文章の意味や単語の意味をAIに質問できます。</p>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <TextGenerationForm onTextGenerated={setInputText} />
        </div>
        {inputText && (
          <div className="mt-6 flex justify-center">
            <Button
              onClick={handleNavigate}
              className="text-lg font-bold py-3 px-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              この文章で学習を始める 🚀
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
