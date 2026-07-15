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

    const html = `
<!DOCTYPE html>
<html>
<head>
  <title>OAuth Tokens</title>
  <style>
    body { font-family: monospace; padding: 2rem; background: #1a1a1a; color: #00ff00; }
    h2 { color: #fff; }
    .token { background: #2a2a2a; padding: 1rem; border-radius: 6px; margin: 1rem 0; word-break: break-all; }
    label { color: #aaa; font-size: 0.8rem; display: block; margin-bottom: 4px; }
    .copy-btn {
      background: #333; color: #fff; border: 1px solid #555;
      padding: 4px 10px; border-radius: 4px; cursor: pointer; margin-top: 6px;
    }
    .copy-btn:hover { background: #444; }
    .warning { background: #3a1a00; color: #ffaa00; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h2>✅ Google OAuth exitoso</h2>
  <div class="warning">⚠️ Copia estos tokens y pásalos a OpenClaw. Borra esta página del historial después.</div>

  <p><strong>Email:</strong> ${userInfo.email}</p>

  <div class="token">
    <label>ACCESS TOKEN</label>
    <div id="at">${tokens.access_token}</div>
    <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('at').innerText)">Copiar</button>
  </div>

  <div class="token">
    <label>REFRESH TOKEN</label>
    <div id="rt">${tokens.refresh_token ?? '(no disponible)'}</div>
    <button class="copy-btn" onclick="navigator.clipboard.writeText(document.getElementById('rt').innerText)">Copiar</button>
  </div>

  <div class="token">
    <label>EXPIRES IN (segundos)</label>
    <div>${tokens.expires_in}</div>
  </div>

  <div class="token">
    <label>SCOPE</label>
    <div>${tokens.scope}</div>
  </div>
</body>
</html>`

    return new NextResponse(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    })
  } catch (err) {
    console.error('[Google OAuth] Error inesperado:', err)
    return NextResponse.redirect(new URL('/auth/error?reason=unexpected', request.url))
  }
}