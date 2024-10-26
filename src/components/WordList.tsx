'use client'

import React, { useState, useEffect, useCallback } from "react";
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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

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
  const supabase = createClientComponentClient();
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  const { words: generatedWords, isLoading, error, generateWords } = useWordList();

  const handleGenerateWords = useCallback(() => {
    if (text.trim()) {
      const params: GenerateWordsParams = {
        toeic_level: toeicLevel,
        words: wordCount,
        text: text
      };
      generateWords(params);
    }
  }, [text, toeicLevel, wordCount, generateWords]);

  useEffect(() => {
    if (text.trim()) {
      handleGenerateWords();
    }
  }, [text, handleGenerateWords]);

  const filteredWords = generatedWords.filter(word => 
    word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.japanese.includes(searchTerm)
  );

  const handleSpeak = useCallback((text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  }, []);

  // 通知を表示する関数
  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    // 3秒後に通知を消す
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  // 単語を保存する関数
  const handleSaveWord = async (word: Word) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        showNotification('単語を保存するにはログインが必要です', 'error');
        return;
      }

      // 現在の保存済み単語数を取得
      const { count } = await supabase
        .from('user_words')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);

      // 単語数が200を超える場合は保存を中止
      if (count && count >= 200) {
        showNotification('単語帳の登録上限（200語）に達しています', 'error');
        return;
      }

      // まず既存の単語をチェック
      const { data: existingWord } = await supabase
        .from('user_words')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('word_id', word.id)
        .single();

      if (existingWord) {
        showNotification(`「${word.english}」は既に単語帳に保存されています`, 'error');
        return;
      }

      const { error } = await supabase
        .from('user_words')
        .insert({
          user_id: session.user.id,
          word_id: word.id,
          english: word.english,
          japanese: word.japanese,
          part_of_speech: word.partOfSpeech,
          example: word.example
        });

      if (error) {
        // 一意制約違反のエラーをチェック
        if (error.code === '23505') {
          showNotification(`「${word.english}」は既に単語帳に保存されています`, 'error');
          return;
        }
        throw error;
      }

      showNotification(`「${word.english}」を単語帳に保存しました`, 'success');

    } catch (error) {
      console.error('単語の保存中にエラーが発生しました:', error);
      showNotification('単語の保存に失敗しました', 'error');
    }
  };

  return (
    <Card className={`w-full h-[600px] max-w-4xl ${themes[currentTheme as keyof typeof themes]?.card} ${themes[currentTheme as keyof typeof themes]?.cardBorder} border relative`}>
      {/* 通知メッセージ */}
      {notification && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`absolute top-4 right-4 z-50 p-4 rounded-md shadow-lg ${
            notification.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}
        >
          {notification.message}
        </motion.div>
      )}

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
        ) : text.trim() ? (
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
              <ScrollArea className="h-[calc(600px-16rem)] pr-4">
                <div className="space-y-2 px-1">
                  {filteredWords.map((word) => (
                    <motion.div
                      key={word.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWord(word)}
                      className="p-2 border rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors transform-gpu"
                      style={{ transformOrigin: 'center left' }}
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
                  <div className="flex gap-2 mt-4">
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleSpeak(selectedWord.english)}
                    >
                      <Volume2 className="h-4 w-4" />
                      発音を聞く
                    </Button>
                    <Button 
                      variant="default"
                      onClick={() => handleSaveWord(selectedWord)}
                    >
                      単語帳に保存
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  単語を選択して詳細を表示
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center text-muted-foreground">
            テキストを入力すると単語リストが生成されます。
          </div>
        )}
      </CardContent>
    </Card>
  );
}
