'use client'

import { useSearchParams } from 'next/navigation'

export default function AuthError() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')
  const errorDescription = searchParams.get('description')

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-4">認証エラー</h1>
      <p className="text-xl mb-4">エラーが発生しました：{error}</p>
      <p className="text-lg">{errorDescription}</p>
    </div>
  )
}
