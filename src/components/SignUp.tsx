import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface SignUpProps {
  onClose: () => void;
}

export default function SignUp({ onClose }: SignUpProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [showVerification, setShowVerification] = useState(false);
  const supabase = createClientComponentClient();

  const formatPhoneNumber = (input: string) => {
    const numbers = input.replace(/[^\d]/g, '');
    if (numbers.startsWith('0')) {
      return '+81' + numbers.slice(1);
    }
    return numbers;
  };

  const displayPhoneNumber = (input: string) => {
    if (input.startsWith('+81')) {
      return `0${input.slice(3)}`;
    }
    return input;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formattedNumber = formatPhoneNumber(input);
    setPhone(formattedNumber);
  };

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('パスワードが一致しません');
      return;
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        if (error.message.includes('User already registered')) {
          alert('このメールアドレスは既に登録されています');
        } else {
          throw error;
        }
      } else if (data.user) {
        alert("登録完了メールを確認してください");
        onClose();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(`エラーが発生しました: ${error.message}`);
      } else {
        alert("不明なエラーが発生しました");
      }
      console.error(error);
    }
  };

  const handlePhoneSignUp = async (e: React.FormEvent) => {
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

      alert("電話番号の認証が完了しました");
      onClose();
    } catch (error) {
      console.error('認証中にエラーが発生しました', error);
      alert('認証に失敗しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold mb-6">サインアップ</h2>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="email">メール</TabsTrigger>
            <TabsTrigger value="phone">電話番号</TabsTrigger>
          </TabsList>

          <TabsContent value="email">
            <form onSubmit={handleEmailSignUp} className="space-y-4">
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
              <div>
                <Label htmlFor="confirmPassword">パスワード（確認）</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full">メールでサインアップ</Button>
            </form>
          </TabsContent>

          <TabsContent value="phone">
            {!showVerification ? (
              <form onSubmit={handlePhoneSignUp} className="space-y-4">
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
      </div>
    </div>
  );
}
