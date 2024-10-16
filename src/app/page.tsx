"use client";

import TranslationForm from "@/components/TranslationForm";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <main className="w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">英語から日本語への翻訳</h1>
        <TranslationForm />
      </main>
    </div>
  );
}
