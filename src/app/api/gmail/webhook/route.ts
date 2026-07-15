//app/api/gmail/webhook/route.ts


import { NextRequest, NextResponse } from 'next/server'

const TOKEN_SERVICE_WEBHOOK = 'http://18.190.207.166/api/gmail/webhook'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Hacer forward al token service en el otro servidor
    const response = await fetch(TOKEN_SERVICE_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error('[Gmail Webhook Relay] Error:', err)
    return NextResponse.json({ ok: true }, { status: 200 }) // siempre 200 para Pub/Sub
  }
}