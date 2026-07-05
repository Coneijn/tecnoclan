'use client';

import React, { useState, useEffect } from 'react';

export default function HydrationTest() {
  const [clicks, setClicks] = useState(0);
  const [status, setStatus] = useState("❌ Esperando a React...");

  // useEffect SOLO se ejecuta en el navegador del cliente si JavaScript funciona.
  useEffect(() => {
    setStatus("✅ ¡React está vivo!");
    alert("¡El motor de JavaScript logró cargar en tu celular!");
  }, []);

  return (
    <div style={{ padding: '40px', backgroundColor: '#111', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      <h2>Diagnóstico de Motor</h2>
      
      <div style={{ padding: '20px', backgroundColor: '#333', borderRadius: '8px', margin: '20px 0' }}>
        <strong>Estado actual:</strong> <br/>
        <span style={{ fontSize: '20px', color: status.includes('vivo') ? '#10b981' : '#ef4444' }}>
          {status}
        </span>
      </div>

      <p style={{ fontSize: '24px', margin: '20px 0' }}>Toques: {clicks}</p>

      <button 
        onClick={() => setClicks(clicks + 1)}
        style={{
          padding: '30px', fontSize: '24px', backgroundColor: '#10b981', 
          color: 'white', border: 'none', borderRadius: '12px', width: '100%'
        }}
      >
        ¡TÓCAME!
      </button>

    </div>
  );
}