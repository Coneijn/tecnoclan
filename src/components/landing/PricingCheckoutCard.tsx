'use client';

import { useState } from 'react';

export default function PricingCheckoutCard() {
  // Estado para la frecuencia elegida por el papá
  const [frequency, setFrequency] = useState<'SEMANAL' | 'QUINCENAL' | 'MENSUAL'>('SEMANAL');

  // Tabla dinámica de precios en base a la frecuencia elegida
  const paymentDetails = {
    SEMANAL: { cuotas: 4, monto: '$500', leyenda: 'cada viernes' },
    QUINCENAL: { cuotas: 2, monto: '$1,000', leyenda: 'cada 15 días' },
    MENSUAL: { cuotas: 1, monto: '$2,000', leyenda: 'pago único de mensualidad' },
  };

  return (
    <section id="checkout" className="bg-zinc-950 py-24 border-b border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Asegura tu estación física hoy
          </h2>
          <p className="mt-4 text-zinc-400">
            A partir de la 4a semana de promoción, el costo de inscripción subirá a $500 MXN. Aparta tu lugar con tarifa Early Bird.
          </p>
        </div>

        {/* Tarjeta de precios contenedora */}
        <div className="mx-auto max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8 shadow-2xl relative">
          
          {/* Badge Urgencia Promocional */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-500 px-4 py-1 text-xs font-black uppercase tracking-wider text-zinc-950">
            🔥 Descuento del 50% en Inscripción
          </div>

          <div className="text-center mt-4">
            <span className="text-sm font-medium text-zinc-400">Pagas hoy de inscripción:</span>
            <div className="mt-2 flex items-baseline justify-center gap-x-2">
              <span className="text-5xl font-black tracking-tight text-white">$250</span>
              <span className="text-xl font-semibold text-zinc-400">MXN</span>
            </div>
          </div>

          <hr className="my-6 border-zinc-800" />

          {/* Selector de Frecuencia Domiciliada */}
          <div className="mb-6">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 block mb-3 text-center">
              ¿Cómo prefieres diferir el resto? ($2,000 MXN)
            </label>
            <div className="grid grid-cols-3 gap-2 bg-zinc-950 p-1.5 rounded-xl border border-zinc-800">
              {(['SEMANAL', 'QUINCENAL', 'MENSUAL'] as const).map((freq) => (
                <button
                  key={freq}
                  onClick={() => setFrequency(freq)}
                  className={`rounded-lg py-2 text-xs font-bold uppercase transition ${
                    frequency === freq
                      ? 'bg-amber-500 text-zinc-950 shadow'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {freq.toLowerCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Desglose dinámico de pagos */}
          <div className="rounded-xl bg-zinc-950 p-4 border border-zinc-800 text-center text-sm text-zinc-400 mb-8">
            Autorizas un plan domiciliado de <br />
            <span className="text-white font-extrabold text-base">
              {paymentDetails[frequency].cuotas} {paymentDetails[frequency].cuotas === 1 ? 'pago' : 'pagos'} de {paymentDetails[frequency].monto} MXN
            </span>{' '}
            {paymentDetails[frequency].leyenda}.
          </div>

          {/* Botón de Checkout Integrado a Mercado Pago */}
          <button 
            onClick={() => alert(`Redirigiendo de forma segura a Mercado Pago con plan ${frequency}...`)}
            className="w-full rounded-xl bg-amber-500 py-4 text-center text-base font-black text-zinc-950 hover:bg-amber-400 transition shadow-xl shadow-amber-500/10"
          >
            Pagar Inscripción con Mercado Pago
          </button>

          {/* Garantías de seguridad */}
          <p className="mt-4 text-center text-xs text-zinc-500 flex items-center justify-center gap-1.5">
            🔒 Transacciones seguras procesadas por MercadoLibre. Puedes pausar o cancelar tu plan desde tu panel de usuario.
          </p>
        </div>
      </div>
    </section>
  );
}