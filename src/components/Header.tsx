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
  const { theme, setTheme } = useTheme()
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
          <Link href="/" className="flex items-center">
            <Image 
              src={`/logo${logoNumber}.png`} 
              alt="Logo" 
              width={60} 
              height={60} 
              className="shadow-lg"
            />
            <div className="ml-4 flex flex-col">
              <span className={`text-4xl font-extrabold tracking-tight ${themes[theme as keyof typeof themes]?.text || ''}`}>
                Lingo
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">.ai</span>
              </span>
              <span className="text-sm text-muted-foreground">AIで学ぶ英単語</span>
            </div>
          </Link>
          <nav className="flex space-x-2">
            <Button
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-primary flex items-center"
              onClick={() => router.push('/words_page')}
            >
              My単語帳
              {session && wordCount !== null && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {wordCount} / 200
                </Badge>
              )}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Palette className="mr-2 h-4 w-4" />
                  テーマ
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setTheme('default')}>
                  デフォルト
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('light')}>
                  ライト
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('dark')}>
                  ダーク
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme('nature')}>
                  ネイチャー
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  ユーザー
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {!session ? (
                  <>
                    <DropdownMenuItem onClick={() => setShowLogin(true)}>
                      <LogIn className="mr-2 h-4 w-4" />
                      ログイン
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowSignUp(true)}>
                      <UserPlus className="mr-2 h-4 w-4" />
                      サインアップ
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
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
