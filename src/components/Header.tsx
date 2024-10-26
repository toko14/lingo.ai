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

export default function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter();
  const [showSignUp, setShowSignUp] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const supabase = createClientComponentClient();

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

  return (
    <>
      <header className={`${themes[theme as keyof typeof themes]?.background || ''} border-b transition-colors duration-200`}>
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={40} height={40} className="rounded-full" />
            <span className={`ml-2 text-xl font-bold ${themes[theme as keyof typeof themes]?.text || ''}`}>/&%#$??!!</span>
          </Link>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={handleNavigateToWordList} className="flex items-center">
              <Book className="mr-2 h-4 w-4" />
              My単語帳
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
          </div>
        </div>
      </header>
      {showSignUp && <SignUp onClose={() => setShowSignUp(false)} />}
      {showLogin && <Login onClose={() => setShowLogin(false)} refreshSession={refreshSession} />}
    </>
  );
}
