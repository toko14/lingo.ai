import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface LoginProps {
  onClose: () => void;
  refreshSession: () => Promise<void>;
}

export default function Login({ onClose, refreshSession }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const [currentPath, setCurrentPath] = useState('');
  const [isResetMode, setIsResetMode] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, []);

  // 電話番号を際形式に変換する関数
  const formatPhoneNumber = (input: string) => {
    // 数字以外を削除
    const numbers = input.replace(/[^\d]/g, '');
    
    // 先頭の0を削除し、+81を付加
    if (numbers.startsWith('0')) {
      return '+81' + numbers.slice(1);
    }
    return numbers;
  };

  // 電話番号の表示用フォーマット
  const displayPhoneNumber = (input: string) => {
    if (input.startsWith('+81')) {
      const numbers = input.slice(3); // +81を削除
      return `0${numbers}`;
    }
    return input;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedNumber = formatPhoneNumber(input);
    setPhone(formattedNumber);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      alert('ログインに成功しました');
      await refreshSession();
      onClose();
      router.push(currentPath || '/');
    } catch (error) {
      console.error('ログイン処理中にエラーが発生しました', error);
      alert('ログインに失敗しました');
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithOtp({
        phone: phone,
        options: {
          channel: 'sms'
        }
      });

      if (error) throw error;

      setShowVerification(true);
      alert("認証コードを送信しました");
    } catch (error) {
      console.error('SMS送信中にエラーが発生しました', error);
      alert('SMS送信に失敗しました');
    }
  };

  const verifyPhoneNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        phone: phone,
        token: verificationCode,
        type: 'sms'
      });

      if (error) throw error;

      alert("ログインに成功しました");
      await refreshSession();
      onClose();
      router.push(currentPath || '/');
    } catch (error) {
      console.error('認証中にエラーが発生しました', error);
      alert('認証に失敗しました');
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
        
        {isResetMode ? (
          // パスワードリセットフォーム
          <form onSubmit={handleResetPassword} className="space-y-4">
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
            <Button type="submit" className="w-full">リセットメールを送信</Button>
          </form>
        ) : (
          <Tabs defaultValue="email" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">メール</TabsTrigger>
              <TabsTrigger value="phone">電話番号</TabsTrigger>
            </TabsList>

            <TabsContent value="email">
              <form onSubmit={handleEmailLogin} className="space-y-4">
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
                <Button type="submit" className="w-full">メールでログイン</Button>
              </form>
            </TabsContent>

            <TabsContent value="phone">
              {!showVerification ? (
                <form onSubmit={handlePhoneLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="phone">電話番号</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="090xxxxxxxx"
                      value={displayPhoneNumber(phone)}
                      onChange={handlePhoneChange}
                      pattern="[0-9]*"
                      inputMode="numeric"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      ※ 携帯電話番号を入力してください（例：090xxxxxxxx）
                    </p>
                  </div>
                  <Button type="submit" className="w-full">認証コードを送信</Button>
                </form>
              ) : (
                <form onSubmit={verifyPhoneNumber} className="space-y-4">
                  <div>
                    <Label htmlFor="verificationCode">認証コード</Label>
                    <Input
                      id="verificationCode"
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">認証する</Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        )}

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
