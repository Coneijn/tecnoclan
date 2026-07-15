'use client'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
function ErrorContent() {
  const params = useSearchParams()
  const reason = params.get('reason')

  const messages: Record<string, string> = {
    no_code: 'No se recibió el código de autorización.',
    token_exchange: 'Error al intercambiar el código por tokens.',
    unexpected: 'Ocurrió un error inesperado.',
    access_denied: 'Acceso denegado por el usuario.',
  }

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>❌ Error de autenticación</h1>
      <p>{messages[reason ?? ''] ?? 'Error desconocido.'}</p>
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Código: {reason}</p>
      <a href="/api/auth/google" style={{ color: '#0070f3' }}>Intentar de nuevo</a>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <ErrorContent />
    </Suspense>
  )
}
