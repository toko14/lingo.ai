'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      alert('パスワードが一致しません')
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error
      alert('パスワードが正常に更新されました')
      router.push('/')
    } catch (error) {
      console.error('パスワードの更新中にエラーが発生しました:', error)
      alert('パスワードの更新に失敗しました')
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">新しいパスワードを設定</h1>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label htmlFor="password">新しいパスワード</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="passwordConfirmation">パスワードの確認</Label>
            <Input
              id="passwordConfirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full">
            パスワードを更新
          </Button>
        </form>
      </div>
    </div>
  )
}
