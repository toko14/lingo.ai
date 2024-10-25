'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'

// ... 単語データの型定義とサンプルデータは同じ ...

interface Word {
  id: string;
  english: string;
  japanese: string;
  partOfSpeech: string;
  example: string;
}

// サンプルデータの追加
const words: Word[] = [
  {
    id: "1",
    english: "hello",
    japanese: "こんにちは",
    partOfSpeech: "感動詞",
    example: "Hello, how are you?"
  },
  // 他の単語データ...
]

// ダミーデータの追加
const dummyWords: Word[] = [
  {
    id: "1",
    english: "appreciate",
    japanese: "感謝する、理解する",
    partOfSpeech: "動詞",
    example: "I really appreciate your help with this project."
  },
  {
    id: "2",
    english: "magnificent",
    japanese: "壮大な、素晴らしい",
    partOfSpeech: "形容詞",
    example: "The view from the mountain top was magnificent."
  },
  {
    id: "3",
    english: "endeavor",
    japanese: "努力、試み",
    partOfSpeech: "名詞/動詞",
    example: "She will endeavor to finish the task by tomorrow."
  },
  {
    id: "4",
    english: "resilient",
    japanese: "回復力のある、強靭な",
    partOfSpeech: "形容詞",
    example: "Children are often more resilient than adults."
  },
  {
    id: "5",
    english: "serendipity",
    japanese: "幸運な偶然",
    partOfSpeech: "名詞",
    example: "Meeting my best friend was pure serendipity."
  },
  {
    id: "6",
    english: "meticulous",
    japanese: "綿密な、几帳面な",
    partOfSpeech: "形容詞",
    example: "He is meticulous about keeping his records organized."
  },
  {
    id: "7",
    english: "profound",
    japanese: "深い、深遠な",
    partOfSpeech: "形容詞",
    example: "The book had a profound impact on my thinking."
  },
  {
    id: "8",
    english: "versatile",
    japanese: "多才な、汎用性のある",
    partOfSpeech: "形容詞",
    example: "This tool is very versatile and can be used for many purposes."
  }
];

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>(dummyWords)
  const { speak } = useSpeech()

  const filteredWords = words.filter(word => 
    word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.japanese.includes(searchTerm)
  )

  const handleSpeak = (text: string) => {
    speak(text)
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">単語帳</h1>
        
        <div className="flex gap-4 mb-4">
          <Input
            type="text"
            placeholder="単語を検索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex gap-4">
          <Card className="w-1/3">
            <CardHeader>
              <CardTitle>単語リスト</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredWords.map((word) => (
                    <motion.div
                      key={word.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedWord(word)}
                      className="p-2 border rounded-md cursor-pointer hover:bg-accent"
                    >
                      <h3 className="font-semibold">{word.english}</h3>
                      <p className="text-sm text-muted-foreground">{word.japanese}</p>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="w-2/3">
            <CardHeader>
              <CardTitle>単語の詳細</CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                {selectedWord ? (
                  <motion.div
                    key={selectedWord.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
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
                    <Button 
                      variant="outline" 
                      className="flex items-center gap-2"
                      onClick={() => handleSpeak(selectedWord.english)}
                    >
                      <Volume2 className="h-4 w-4" />
                      発音を聞く
                    </Button>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center text-muted-foreground">
                    単語を選択して詳細を表示
                  </div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
