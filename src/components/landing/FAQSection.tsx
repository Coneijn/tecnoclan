'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "¿Necesito saber de computación para ayudar a mi hijo?",
      answer: "Absolutamente no. El taller está diseñado desde cero. Nuestro objetivo es que tú y tu hijo aprendan juntos. Los instructores los guiarán paso a paso, desde cómo encender la Raspberry Pi hasta programar el código."
    },
    {
      question: "¿Qué pasa si faltamos a una clase el sábado?",
      answer: "¡No pasa nada! Gracias a nuestra Plataforma LMS (Learning Management System), todo el material, manuales y el código que se vio en clase estará disponible en tu perfil. Pueden reponer la práctica en casa o llegar más temprano la siguiente semana para que los apoyemos."
    },
    {
      question: "¿Cómo funcionan los 4 pagos semanales de $500 MXN?",
      answer: "Hoy solo pagas $250 MXN (Early Bird) para apartar tu lugar y tu estación física. Al inscribirte, Mercado Pago domiciliará automáticamente $500 MXN por semana (o $1,000 quincenal, como prefieras) durante 4 ciclos. Sin intereses, sin letras chiquitas y puedes actualizar tu tarjeta cuando quieras."
    },
    {
      question: "¿A partir de qué edad recomiendan el taller?",
      answer: "Recomendamos el ingreso a partir de los 9 años y hasta los 15 años. A esta edad ya tienen la lógica deductiva para entender la electrónica y la capacidad de seguir instrucciones, pero lo más valioso es el trabajo en equipo con su mamá/papá."
    }
  ];

  return (
    <section id="faq" className="bg-zinc-950 py-24 border-b border-zinc-900">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Preguntas Frecuentes
          </h2>
          <p className="mt-4 text-zinc-400">Todo lo que necesitas saber antes de asegurar tu lugar.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="rounded-xl border border-zinc-800 bg-zinc-900/30 overflow-hidden transition-colors hover:bg-zinc-900/50"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-bold text-white pr-4">{faq.question}</span>
                <span className="text-amber-500 font-bold text-xl">
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              
              {openIndex === index && (
                <div className="px-6 pb-6 text-zinc-400 text-sm leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}