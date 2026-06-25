export default function ExperienceSection() {
    const experiences = [
      {
        title: "Tiempo de Calidad Real",
        description: "Olvídate de ver la tele juntos en silencio. Aquí van a pelar cables, quemar LEDs y resolver problemas codo a codo. Es construcción de vínculos a través de la ingeniería.",
        icon: "🤝"
      },
      {
        title: "De Consumidores a Creadores",
        description: "Cambiamos el deslizar en TikTok por teclear en Linux. Tu hijo entenderá cómo funciona la tecnología que usa todos los días en lugar de solo consumirla.",
        icon: "🧠"
      },
      {
        title: "Tolerancia a la Frustración",
        description: "El código va a fallar. El circuito no va a encender a la primera. Aprenderán a iterar, debugear y no rendirse hasta que el proyecto funcione. Habilidades para la vida.",
        icon: "🛠️"
      }
    ];
  
    return (
      <section id="experiencia" className="bg-zinc-950 py-24 border-b border-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Más que un curso, un rito de iniciación
            </h2>
            <p className="mt-4 text-lg text-zinc-400">
              En el Clan no hay pupitres ni exámenes. Hay estaciones de hardware y misiones que solo pueden resolverse trabajando en equipo.
            </p>
          </div>
  
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {experiences.map((exp, index) => (
              <div key={index} className="rounded-2xl bg-zinc-900/50 p-8 border border-zinc-800/50 hover:bg-zinc-900 transition">
                <div className="text-4xl mb-4">{exp.icon}</div>
                <h3 className="text-xl font-bold text-white mb-3">{exp.title}</h3>
                <p className="text-zinc-400 leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }