'use client'
import { useSearchParams } from 'next/navigation'

export default function SuccessContent() {
  const params = useSearchParams()
  const email = params.get('email')

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '2rem', textAlign: 'center' }}>
      <h1>✅ Conexión exitosa</h1>
      <p>Google Workspace conectado correctamente.</p>
      {email && <p><strong>Cuenta:</strong> {email}</p>}
      <p style={{ color: '#666', fontSize: '0.9rem' }}>Puedes cerrar esta ventana.</p>
    </div>
  )
}

