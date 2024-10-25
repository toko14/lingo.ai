'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useSpeech } from '@/hooks/useSpeech'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, XCircle } from 'lucide-react'

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
  },
  {
    id: "9",
    english: "eloquent",
    japanese: "雄弁な、説得力のある",
    partOfSpeech: "形容詞",
    example: "She gave an eloquent speech that moved the entire audience."
  },
  {
    id: "10",
    english: "diligent",
    japanese: "勤勉な、熱心な",
    partOfSpeech: "形容詞",
    example: "His diligent study habits helped him achieve excellent grades."
  },
  {
    id: "11",
    english: "benevolent",
    japanese: "慈悲深い、親切な",
    partOfSpeech: "形容詞",
    example: "The benevolent king was loved by all his subjects."
  },
  {
    id: "12",
    english: "perseverance",
    japanese: "忍耐力、粘り強さ",
    partOfSpeech: "名詞",
    example: "Her perseverance in the face of adversity was admirable."
  },
  {
    id: "13",
    english: "innovative",
    japanese: "革新的な",
    partOfSpeech: "形容詞",
    example: "The company is known for its innovative approach to problem-solving."
  },
  {
    id: "14",
    english: "ambiguous",
    japanese: "曖昧な、多義的な",
    partOfSpeech: "形容詞",
    example: "The contract contained several ambiguous clauses that needed clarification."
  },
  {
    id: "15",
    english: "tenacious",
    japanese: "粘り強い、しつこい",
    partOfSpeech: "形容詞",
    example: "She is known for her tenacious pursuit of her goals."
  },
  {
    id: "16",
    english: "empathy",
    japanese: "共感、感情移入",
    partOfSpeech: "名詞",
    example: "A good counselor must have empathy for their clients."
  },
  {
    id: "17",
    english: "pragmatic",
    japanese: "実用的な、現実的な",
    partOfSpeech: "形容詞",
    example: "We need a pragmatic solution to this problem."
  },
  {
    id: "18",
    english: "enigma",
    japanese: "謎、不可解なもの",
    partOfSpeech: "名詞",
    example: "The ancient artifact remained an enigma to archaeologists for decades."
  }
];

interface QuizQuestion {
  word: Word;
  options: string[];
  correctAnswer: string;
}

export default function WordsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedWord, setSelectedWord] = useState<Word | null>(null)
  const [words, setWords] = useState<Word[]>(dummyWords)
  const { speak } = useSpeech()
  const [quizMode, setQuizMode] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [quizSize, setQuizSize] = useState('5')
  const [score, setScore] = useState(0)
  const [quizFinished, setQuizFinished] = useState(false)
  const [answers, setAnswers] = useState<boolean[]>([])

  const filteredWords = words.filter(word => 
    word.english.toLowerCase().includes(searchTerm.toLowerCase()) ||
    word.japanese.includes(searchTerm)
  )

  const handleSpeak = (text: string) => {
    speak(text)
  }

  const generateQuiz = () => {
    const shuffledWords = [...words].sort(() => 0.5 - Math.random())
    const selectedWords = shuffledWords.slice(0, parseInt(quizSize))
    
    const questions = selectedWords.map(word => {
      const otherWords = words.filter(w => w.id !== word.id)
      const options = [word.japanese, ...otherWords.slice(0, 3).map(w => w.japanese)]
      return {
        word,
        options: options.sort(() => 0.5 - Math.random()),
        correctAnswer: word.japanese
      }
    })

    setQuizQuestions(questions)
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizMode(true)
  }

  const handleAnswer = (answer: string) => {
    const isCorrect = answer === quizQuestions[currentQuestionIndex].correctAnswer
    setAnswers([...answers, isCorrect])
    if (isCorrect) {
      setScore(score + 1)
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    } else {
      setQuizMode(false)
      setQuizFinished(true)
    }
  }

  const resetQuiz = () => {
    setQuizMode(false)
    setQuizFinished(false)
    setCurrentQuestionIndex(0)
    setScore(0)
    setQuizQuestions([])
    setAnswers([])
  }

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center mb-6">My単語帳</h1>
        
        {!quizMode && !quizFinished ? (
          <>
            <div className="flex gap-4 mb-4">
              <Input
                type="text"
                placeholder="単語を検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
              <Select value={quizSize} onValueChange={setQuizSize}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="クイズの単語数" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5問</SelectItem>
                  <SelectItem value="10">10問</SelectItem>
                  <SelectItem value="15">15問</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={generateQuiz}>クイズを始める</Button>
            </div>

            <div className="flex gap-4">
              <Card className="w-1/3">
                <CardHeader>
                  <CardTitle>単語リスト</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[600px] pr-4"> {/* pr-4 を追加 */}
                    <div className="space-y-2 px-1">
                      {filteredWords.map((word) => (
                        <motion.div
                          key={word.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setSelectedWord(word)}
                          className="p-2 border rounded-md cursor-pointer hover:bg-accent transform-gpu"
                          style={{ transformOrigin: 'center left' }}
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
          </>
        ) : quizMode ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl">単語クイズ</CardTitle>
              <Progress value={(currentQuestionIndex / quizQuestions.length) * 100} className="mt-2" />
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-3xl font-bold mb-6 text-center">{quizQuestions[currentQuestionIndex].word.english}</h2>
              <div className="grid grid-cols-2 gap-4">
                {quizQuestions[currentQuestionIndex].options.map((option, index) => (
                  <Button 
                    key={index} 
                    onClick={() => handleAnswer(option)}
                    className="py-8 text-lg"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              <p className="text-center mt-6 text-lg">
                問題 {currentQuestionIndex + 1} / {quizQuestions.length}
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">クイズ結果</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <h2 className="text-4xl font-bold text-center mb-6">
                スコア: {score} / {quizQuestions.length}
              </h2>
              <Progress value={(score / quizQuestions.length) * 100} className="mb-6" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {quizQuestions.map((question, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="mr-2 flex-grow">{question.word.english}</span>
                    <span className="flex-shrink-0">
                      {answers[index] ? (
                        <CheckCircle2 className="text-green-500 h-6 w-6" />
                      ) : (
                        <XCircle className="text-red-500 h-6 w-6" />
                      )}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center">
                <Button onClick={resetQuiz} className="px-8 py-4 text-lg">
                  単語リストに戻る
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
