import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { themes } from "@/styles/themes";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, Pause, SkipBack, ChevronLeft, ChevronRight } from "lucide-react";

interface InputTextDisplayProps {
  text: string;
}

export default function InputTextDisplay({ text }: InputTextDisplayProps) {
  const { theme } = useTheme();
  const [isReading, setIsReading] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null);
  const [utterance, setUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
  const sentences = useRef<string[]>([]);

  useEffect(() => {
    setSpeechSynthesis(window.speechSynthesis);
    // テキストを文に分割
    sentences.current = text.match(/[^.!?]+[.!?]+|\s*$/g) || [];

    const newUtterance = new SpeechSynthesisUtterance(sentences.current[0]);
    newUtterance.lang = 'en-US';
    
    const setVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(voice => 
        voice.lang.includes('en-US') && 
        !voice.name.includes('Microsoft') // より自然な音声を選択
      );
      if (englishVoice) {
        newUtterance.voice = englishVoice;
      }
    };

    newUtterance.onstart = () => {
      setStartTime(Date.now());
      setElapsedTime(0);
      timerRef.current = window.setInterval(() => {
        setElapsedTime(prev => prev + 100);
      }, 100);
    };

    newUtterance.onend = () => {
      if (currentSentenceIndex < sentences.current.length - 1) {
        setCurrentSentenceIndex(prev => prev + 1);
        const nextUtterance = new SpeechSynthesisUtterance(sentences.current[currentSentenceIndex + 1]);
        nextUtterance.lang = 'en-US';
        if (newUtterance.voice) {
          nextUtterance.voice = newUtterance.voice;
        }
        setUtterance(nextUtterance);
        speechSynthesis?.speak(nextUtterance);
      } else {
        setIsReading(false);
      }
    };

    setUtterance(newUtterance);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', setVoice);
      if (speechSynthesis) {
        speechSynthesis.cancel();
      }
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [text]);

  const speakFullText = () => {
    if (speechSynthesis && utterance) {
      speechSynthesis.cancel(); // 既存の発話をキャンセル
      const fullUtterance = new SpeechSynthesisUtterance(text);
      fullUtterance.lang = 'en-US';
      if (utterance.voice) {
        fullUtterance.voice = utterance.voice;
      }
      
      fullUtterance.onend = () => {
        setIsReading(false);
        setCurrentSentenceIndex(sentences.current.length - 1);
      };

      setUtterance(fullUtterance);
      speechSynthesis.speak(fullUtterance);
      setIsReading(true);
    }
  };

  const handleSpeak = () => {
    if (currentSentenceIndex === 0) {
      speakFullText();
    } else if (speechSynthesis && utterance) {
      utterance.text = sentences.current[currentSentenceIndex];
      speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handlePause = () => {
    if (speechSynthesis) {
      speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const handleResume = () => {
    if (speechSynthesis) {
      speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const handleNext = () => {
    if (currentSentenceIndex < sentences.current.length - 1) {
      speechSynthesis?.cancel();
      setCurrentSentenceIndex(prev => prev + 1);
      if (utterance) {
        utterance.text = sentences.current[currentSentenceIndex + 1];
        speechSynthesis?.speak(utterance);
      }
    }
  };

  const handlePrevious = () => {
    if (currentSentenceIndex > 0) {
      speechSynthesis?.cancel();
      setCurrentSentenceIndex(prev => prev - 1);
      if (utterance) {
        utterance.text = sentences.current[currentSentenceIndex - 1];
        speechSynthesis?.speak(utterance);
      }
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsReading(false);
      setIsPaused(false);
      setCurrentSentenceIndex(0);
      // 最初の文を設定
      if (utterance) {
        utterance.text = sentences.current[0];
      }
    }
  };

  return (
    <Card className={`${themes[theme as keyof typeof themes]?.card} ${themes[theme as keyof typeof themes]?.cardBorder} border h-full flex flex-col`}>
      <CardHeader className="p-4">
        <CardTitle className={`text-2xl font-bold text-center ${themes[theme as keyof typeof themes]?.cardText}`}>
          入力されたテキスト
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow overflow-y-auto mb-4" style={{ minHeight: '200px' }}>
          <pre 
            className={`
              whitespace-pre-wrap 
              break-words 
              font-['Helvetica_Neue'] 
              text-xl 
              leading-loose 
              tracking-wider 
              px-4 
              py-2 
              ${themes[theme as keyof typeof themes]?.cardText}
            `}
            style={{
              fontWeight: 400,
              letterSpacing: '0.03em',
              lineHeight: 1.8
            }}
          >
            {text}
          </pre>
        </div>
        <div className="flex justify-center space-x-2 mt-auto">
          <Button onClick={handleStop} variant="outline" size="icon" title="最初に戻る">
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button onClick={handlePrevious} variant="outline" size="icon" title="前の文">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {isReading ? (
            isPaused ? (
              <Button onClick={handleResume} variant="outline" size="icon" title="再開">
                <Play className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handlePause} variant="outline" size="icon" title="一時停止">
                <Pause className="h-4 w-4" />
              </Button>
            )
          ) : (
            <Button onClick={handleSpeak} variant="outline" size="icon" title="再生">
              <Play className="h-4 w-4" />
            </Button>
          )}
          <Button onClick={handleNext} variant="outline" size="icon" title="次の文">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
