// /app/api/auth/google/callback/route.ts
// Recibe el callback de Google, intercambia el code por tokens
import { NextRequest, NextResponse } from 'next/server'

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
    const userInfo = await userResponse.json()

    console.log('[Google OAuth] Usuario autenticado:', userInfo.email)

    // Enviar tokens a OpenClaw via webhook
    const openclawWebhookUrl = process.env.OPENCLAW_WEBHOOK_URL
    if (openclawWebhookUrl) {
      await fetch(openclawWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'google_oauth_success',
          email: userInfo.email,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          expires_in: tokens.expires_in,
          scope: tokens.scope,
        }),
      })
    }

    return NextResponse.redirect(
      new URL(`/auth/success?email=${encodeURIComponent(userInfo.email)}`, request.url)
    )
  } catch (err) {
    console.error('[Google OAuth] Error inesperado:', err)
    return NextResponse.redirect(new URL('/auth/error?reason=unexpected', request.url))
  }
}