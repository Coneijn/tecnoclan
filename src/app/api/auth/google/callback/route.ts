import { NextRequest, NextResponse } from 'next/server'

const TOKEN_SERVICE_URL = process.env.TOKEN_SERVICE_URL!
const TOKEN_SERVICE_SECRET = process.env.TOKEN_SERVICE_SECRET!

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  if (error || !code) {
    console.error('[Google OAuth] Error o cancelación:', error)
    return NextResponse.redirect(
      new URL('/auth/error?reason=' + (error ?? 'no_code'), request.url)
    )
  }

  try {
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text()
      console.error('[Google OAuth] Error al obtener tokens:', err)
      return NextResponse.redirect(new URL('/auth/error?reason=token_exchange', request.url))
    }

    const tokens = await tokenResponse.json()

    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!userResponse.ok) {
      console.error('[Google OAuth] Error al obtener userinfo')
      return NextResponse.redirect(new URL('/auth/error?reason=userinfo_failed', request.url))
    }

    const userInfo = await userResponse.json()

    const saveResponse = await fetch(TOKEN_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN_SERVICE_SECRET}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        user_id:       userInfo.email,
        email:         userInfo.email,
        access_token:  tokens.access_token,
        refresh_token: tokens.refresh_token ?? null,
        expiry_date:   tokens.expires_in
          ? Date.now() + tokens.expires_in * 1000
          : null,
        scope: tokens.scope ?? null,
      }),
    })

    if (!saveResponse.ok) {
      const saveErr = await saveResponse.text()
      console.error('[Google OAuth] Error al guardar tokens:', saveErr)
      return NextResponse.redirect(new URL('/auth/error?reason=token_save_failed', request.url))
    }

    console.log(`[Google OAuth] Tokens guardados para: ${userInfo.email}`)

    const successUrl = new URL('/auth/success', request.url)
    successUrl.searchParams.set('email', userInfo.email)
    return NextResponse.redirect(successUrl)

  } catch (err) {
    console.error('[Google OAuth] Error inesperado:', err)
    return NextResponse.redirect(new URL('/auth/error?reason=unexpected', request.url))
  }
}