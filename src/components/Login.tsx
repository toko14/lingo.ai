import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface LoginProps {
  onClose: () => void;
  refreshSession: () => Promise<void>;
}

export default function Login({ onClose, refreshSession }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    // コンポーネントがマウントされたときに現在のパスを保存
    setCurrentPath(window.location.pathname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ログイン成功
      alert('ログインに成功しました');
      await refreshSession(); // セッション状態を更新
      onClose();
      router.push(currentPath || '/');
    } catch (error) {
      console.error('ログイン処理中にエラーが発生しました', error);
      alert('ログインに失敗しました');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset`,
      });

      if (error) throw error;

      alert('パスワードリセットのメールを送信しました。メールをご確認ください。');
      setIsResetMode(false);
    } catch (error) {
      console.error('パスワードリセット処理中にエラーが発生しました', error);
      alert('パスワードリセットに失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold mb-6">{isResetMode ? 'パスワードリセット' : 'ログイン'}</h2>
        <form onSubmit={isResetMode ? handleResetPassword : handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">メールアドレス</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {!isResetMode && (
            <div>
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <Button type="submit" className="w-full">
            {isResetMode ? 'リセットメールを送信' : 'ログイン'}
          </Button>
        </form>
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsResetMode(!isResetMode)}
            className="text-blue-500 hover:underline"
          >
            {isResetMode ? 'ログインに戻る' : 'パスワードを忘れた場合'}
          </button>
        </div>
      </div>
    </div>
  );
}
