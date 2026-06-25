export default function SocialProof() {
    const testimonials = [
      {
        body: "Mi hijo pasaba 4 horas viendo videos de Minecraft. Ahora pasa ese tiempo programando en su Raspberry Pi para hacer que las luces de su cuarto parpadeen. Es un cambio brutal.",
        author: "Roberto M.",
        role: "Papá de Leo (11 años)"
      },
      {
        body: "Yo no sé nada de computadoras, pensé que me iba a aburrir. Pero el sábado pasado terminé compitiendo con mi hija para ver quién armaba el circuito primero. ¡Vale cada peso!",
        author: "Mariana T.",
        role: "Mamá de Sofía (9 años)"
      },
      {
        body: "El sistema de insignias en la plataforma (LMS) los tiene enganchados. Llega de la escuela directo a terminar los retos del fin de semana para subir de nivel en el Clan.",
        author: "Carlos H.",
        role: "Papá de Diego (13 años)"
      }
    ];
  
    return (
      <section className="bg-zinc-950 py-24 sm:py-32 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-lg font-semibold leading-8 tracking-tight text-amber-500">
              Respaldo Académico
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Familias en Morelia ya son parte del Clan
            </p>
            <p className="mt-4 text-zinc-400 max-w-2xl mx-auto">
              Metodología desarrollada en conjunto con investigadores de <strong className="text-zinc-200">Saber en Piezas</strong>.
            </p>
          </div>
  
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {testimonials.map((testimonial, idx) => (
              <div key={idx} className="flex flex-col justify-between rounded-2xl bg-zinc-900/50 p-8 ring-1 ring-zinc-800 shadow-xl">
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {/* 5 Estrellas */}
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                    </svg>
                  ))}
                </div>
                <p className="text-zinc-300 text-sm leading-relaxed mb-6">"{testimonial.body}"</p>
                <div>
                  <p className="font-bold text-white">{testimonial.author}</p>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }