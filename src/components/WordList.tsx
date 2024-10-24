'use client'

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Volume2, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";
import { useWordList } from '@/hooks/useWordList';
import { GenerateWordsParams } from '@/types/word';

type Word = {
  id: number;
  english: string;
  japanese: string;
  partOfSpeech: string;
  example: string;
}

const words: Word[] = [
  { id: 1, english: "Apple", japanese: "りんご", partOfSpeech: "noun", example: "I eat an apple every day." },
  { id: 2, english: "Run", japanese: "走る", partOfSpeech: "verb", example: "I run in the park every morning." },
  // ... 他の単語データ
];

interface WordListProps {
  text: string;
  toeicLevel?: number;
  wordCount?: number;
}

export default function WordList({ 
  text, 
  toeicLevel: initialToeicLevel = 700, 
  wordCount: initialWordCount = 10 
}: WordListProps) {
  const { theme: currentTheme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [toeicLevel, setToeicLevel] = useState(initialToeicLevel);
  const [wordCount, setWordCount] = useState(initialWordCount);
  
  const { words: generatedWords, isLoading, error, generateWords } = useWordList();

  const handleGenerateWords = () => {
    const params: GenerateWordsParams = {
      toeic_level: toeicLevel,
      words: wordCount,
      text: text
    };
    generateWords(params);
  };

  useEffect(() => {
    handleGenerateWords();
  }, [text]); // テキストが変更されたときのみ自動生成

  const filteredWords = generatedWords.filter(word => 
    word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.japanese.includes(searchTerm)
  );

  return (
    <Card className={`w-full h-[600px] max-w-4xl ${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-2xl font-bold text-center ${themes[currentTheme as keyof typeof themes]?.cardText}`}>
          単語リスト
          {isLoading && <span className="ml-2">生成中...</span>}
        </CardTitle>
        <div className="flex gap-4 mt-4">
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">TOEICレベル</label>
            <Input
              type="number"
              min="300"
              max="990"
              value={toeicLevel}
              onChange={(e) => setToeicLevel(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium mb-1 block">生成する単語数</label>
            <Input
              type="number"
              min="1"
              max="50"
              value={wordCount}
              onChange={(e) => setWordCount(Number(e.target.value))}
              className="w-full"
            />
          </div>
          <div className="flex items-end">
            <Button 
              onClick={handleGenerateWords}
              disabled={isLoading}
              className="mb-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              再生成
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="flex gap-4 h-full">
            <div className="w-1/3">
              <div className="flex items-center mb-4">
                <Input
                  type="text"
                  placeholder="単語を検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow"
                />
                <Button variant="ghost" className="ml-2">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="h-[calc(600px-16rem)]">
                <div className="space-y-2">
                  {filteredWords.map((word) => (
                    <motion.div
                      key={word.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWord(word)}
                      className="p-2 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors"
                    >
                      <h3 className="font-semibold">{word.english}</h3>
                      <p className="text-sm text-muted-foreground">{word.japanese}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </div>
            <div className="w-2/3 border-l pl-4">
              {selectedWord ? (
                <motion.div
                  key={selectedWord.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedWord.english}</h2>
                      <p className="text-xl text-muted-foreground">{selectedWord.japanese}</p>
                    </div>
                    <Badge variant="secondary" className="text-sm">
                      {selectedWord.partOfSpeech}
                    </Badge>
                  </div>
                  <p className="mb-4">{selectedWord.example}</p>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Volume2 className="h-4 w-4" />
                    発音を聞く
                  </Button>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  単語を選択して詳細を表示
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
