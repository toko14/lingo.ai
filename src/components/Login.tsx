import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X } from 'lucide-react'
import { useRouter } from 'next/navigation';

interface LoginProps {
  onClose: () => void;
}

export default function Login({ onClose }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currentPath, setCurrentPath] = useState('');
  const router = useRouter();

  useEffect(() => {
    // コンポーネントがマウントされたときに現在のパスを保存
    setCurrentPath(window.location.pathname);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        // ログイン成功
        alert('ログインに成功しました');
        onClose();
        // 現在のパスに戻る（ただし、現在のパスが空の場合はホームページに戻る）
        router.push(currentPath || '/');
      } else {
        // ログイン失敗
        const data = await response.json();
        alert(data.error || 'ログインに失敗しました');
      }
    } catch (error) {
      console.error('ログイン処理中にエラーが発生しました', error);
      alert('ログイン処理中にエラーが発生しました');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
        <button onClick={onClose} className="absolute top-4 right-4">
          <X className="h-6 w-6 text-gray-500 hover:text-gray-700" />
        </button>
        <h2 className="text-2xl font-bold mb-6">ログイン</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
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
          <Button type="submit" className="w-full">ログイン</Button>
        </form>
      </div>
    </div>
  );
}
