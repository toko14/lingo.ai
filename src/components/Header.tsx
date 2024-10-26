import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { themes } from "@/styles/themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, User, Book, Palette, LogOut, LogIn, UserPlus } from 'lucide-react'
import { useRouter } from 'next/navigation';
import SignUp from '@/components/SignUp';
import Login from '@/components/Login';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session } from '@supabase/supabase-js'
import { Badge } from "@/components/ui/badge";

export default function Header() {
  const { theme } = useTheme()
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [wordCount, setWordCount] = useState<number | null>(null);
  const supabase = createClientComponentClient();
  const [logoNumber, setLogoNumber] = useState(1);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);
/*
  const handleNavigateToWordList = () => {
    router.push('/words_page');
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      alert('ログアウトに成功しました');
      router.push('/');
    } catch (error) {
      console.error('ログアウト処理中にエラーが発生しました', error);
      alert('ログアウト処理中にエラーが発生しました');
    }
  };
*/
  const refreshSession = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setSession(session);
  }, [supabase.auth]);

  // 単語数を取得する関数
  const fetchWordCount = useCallback(async () => {
    if (session) {
      const { count, error } = await supabase
        .from('user_words')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', session.user.id);
      
      if (error) {
        console.error('単語数の取得に失敗しました:', error);
      } else {
        setWordCount(count);
      }
    }
  }, [session, supabase]);

  useEffect(() => {
    if (session) {
      fetchWordCount();
    } else {
      setWordCount(null);
    }
  }, [session, fetchWordCount]);

  // コンポーネントマウント時にランダムなロゴを選択
  useEffect(() => {
    const randomNumber = Math.floor(Math.random() * 10) + 1;
    setLogoNumber(randomNumber);
  }, []);

  return (
    <>
      <header className={`${themes[theme as keyof typeof themes]?.background || ''} border-b transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <Image 
                src={`/logo${logoNumber}.png`} 
                alt="Logo" 
                width={65} 
                height={65} 
                className="shadow-lg transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="ml-4 flex flex-col">
              <div className="flex items-baseline">
                <span className={`text-5xl font-black tracking-tight ${themes[theme as keyof typeof themes]?.text || ''} background-animate`}>
                  Lingo
                  <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">.ai</span>
                </span>
                <span className="ml-2 px-2 py-1 text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full shadow-md">
                  Beta
                </span>
              </div>
              <span className="text-sm font-medium text-muted-foreground mt-1">
                AIで効率的に英語を学習
              </span>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            <Button
              variant="ghost"
              className="text-base font-medium transition-all duration-200 hover:text-primary hover:scale-105 flex items-center h-11 px-4"
              onClick={() => router.push('/words_page')}
            >
              <Book className="mr-2 h-5 w-5" />
              My単語帳
              {session && wordCount !== null && (
                <Badge variant="secondary" className="ml-2 text-sm bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {wordCount} / 200
                </Badge>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center h-11 px-4 text-base">
                  <Palette className="mr-2 h-5 w-5" />
                  テーマ
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                <DropdownMenuItem className="text-base py-2">
                  デフォルト
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base py-2">
                  ライト
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base py-2">
                  ダーク
                </DropdownMenuItem>
                <DropdownMenuItem className="text-base py-2">
                  ネイチャー
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center h-11 px-4 text-base">
                  <User className="mr-2 h-5 w-5" />
                  ユーザー
                  <ChevronDown className="ml-2 h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48">
                {!session ? (
                  <>
                    <DropdownMenuItem className="text-base py-2">
                      <LogIn className="mr-2 h-5 w-5" />
                      ログイン
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-base py-2">
                      <UserPlus className="mr-2 h-5 w-5" />
                      サインアップ
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem className="text-base py-2">
                    <LogOut className="mr-2 h-5 w-5" />
                    ログアウト
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </header>
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
      {showLogin && <Login onClose={() => setShowLogin(false)} refreshSession={refreshSession} />}
    </>
  );
}