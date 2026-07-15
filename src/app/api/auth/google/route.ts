// /app/api/auth/google/route.ts
// Inicia el flujo OAuth — redirige al usuario a Google
import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID!
  const redirectUri = process.env.GOOGLE_REDIRECT_URI!

  const scopes = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/drive.readonly',
    'openid',
    'email',
    'profile',
  ].join(' ')

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: scopes,
    access_type: 'offline',   // para obtener refresh_token
    prompt: 'consent',        // fuerza mostrar pantalla de consentimiento
    state: crypto.randomUUID(), // protección CSRF básica
  })

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  return NextResponse.redirect(googleAuthUrl)
}

