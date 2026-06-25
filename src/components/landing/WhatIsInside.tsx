export default function WhatIsInside() {
    const features = [
      {
        title: "Estación de Hardware Hacker",
        description: "Uso garantizado de un 'MobileKit' equipado con Raspberry Pi 5, monitor, periféricos y componentes electrónicos durante todas las sesiones presenciales.",
        highlight: "Infraestructura Top"
      },
      {
        title: "Acceso al LMS del Clan",
        description: "Nuestra plataforma nativa. Tu hijo se lleva retos, juegos y simuladores a casa para seguir programando en la semana. Tú ves sus métricas de avance desde tu celular.",
        highlight: "Software Nativo"
      },
      {
        title: "Proyecto Físico (Takeaway)",
        description: "No es conocimiento etéreo. Lo que construyan y ensamblen en la semana 4 (piezas 3D y componentes) se lo llevan a casa para presumirlo en la sala.",
        highlight: "Entregable Real"
      },
      {
        title: "Manuales y Comunidad",
        description: "Guías impresas y digitales paso a paso, y acceso a la comunidad de familias STEM de Morelia. Si faltan un sábado, la plataforma los pone al corriente.",
        highlight: "Soporte Total"
      }
    ];
  
    return (
      <section id="taller" className="bg-zinc-950 py-24 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Lado izquierdo: Copy */}
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl mb-6">
                ¿Qué incluye tu lugar en el <span className="text-amber-500">Tecnoclan</span>?
              </h2>
              <p className="text-lg text-zinc-400 mb-8">
                No necesitas comprar equipo caro ni saber programar. Nosotros ponemos la tecnología de grado industrial; ustedes ponen las ganas de aprender.
              </p>
              
              <div className="space-y-6">
                {features.map((feature, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex-shrink-0 mt-1">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 font-bold">
                        ✓
                      </div>
                    </div>
                    <div>
                      <h4 className="text-white font-bold flex items-center gap-3">
                        {feature.title}
                        <span className="text-[10px] uppercase tracking-wider bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-full">
                          {feature.highlight}
                        </span>
                      </h4>
                      <p className="mt-1 text-sm text-zinc-400">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Lado derecho: Visual (Placeholder para foto del maletín o la clase) */}
            <div className="lg:w-1/2 w-full">
              <div className="aspect-square rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center relative overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent"></div>
                <p className="text-zinc-600 font-mono text-sm text-center px-8">
                  [Aquí va una foto épica de un niño y su papá armando la Raspberry Pi en uno de sus talleres]
                </p>
              </div>
            </div>
  
          </div>
        </div>
      </section>
    );
  }