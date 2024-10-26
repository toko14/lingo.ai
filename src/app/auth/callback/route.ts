import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
        const supabase = createRouteHandlerClient({ cookies })
        await supabase.auth.exchangeCodeForSession(code)
    }

    // URL のエラーパラメータをチェック
    const error = requestUrl.searchParams.get('error')
    const errorDescription = requestUrl.searchParams.get('error_description')

    if (error) {
        // エラーがある場合、エラーページにリダイレクト
        return NextResponse.redirect(requestUrl.origin + '/auth-error?error=' + error + '&description=' + errorDescription)
    }

    // エラーがない場合、ホームページにリダイレクト
    return NextResponse.redirect(requestUrl.origin)
}
