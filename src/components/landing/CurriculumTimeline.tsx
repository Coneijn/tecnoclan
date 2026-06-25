export default function CurriculumTimeline() {
    const weeks = [
      {
        number: "01",
        title: "El Setup Hacker",
        description: "Conocemos el hardware. Encendemos la Raspberry Pi 5 desde cero, navegamos por Linux y escribimos nuestras primeras líneas de código en Python.",
        status: "active"
      },
      {
        number: "02",
        title: "Electrónica Tangible",
        description: "Salimos de la pantalla. Entendemos qué es la protoboard, conectamos resistencias y logramos que el código controle LEDs y motores en el mundo físico.",
        status: "upcoming"
      },
      {
        number: "03",
        title: "Sensores y Lógica",
        description: "La estación cobra vida. Integramos sensores ultrasónicos para medir distancias y programamos condicionales lógicos para que la máquina tome decisiones.",
        status: "upcoming"
      },
      {
        number: "04",
        title: "Graduación y Despliegue",
        description: "Ensamblamos todo en una estructura 3D. Pruebas finales, entrega de insignias en el LMS y el proyecto se va a casa listo para presumirse.",
        status: "upcoming"
      }
    ];
  
    return (
      <section id="temario" className="bg-zinc-950 py-24 border-b border-zinc-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Tu mapa de ruta de 4 semanas
            </h2>
            <p className="mt-4 text-zinc-400">Un temario progresivo diseñado para mantener la atención y la emoción al máximo cada sábado.</p>
          </div>
  
          <div className="relative border-l-2 border-zinc-800 ml-3 md:ml-6 space-y-12">
            {weeks.map((week, index) => (
              <div key={index} className="relative pl-10 md:pl-16">
                {/* Indicador visual de la semana */}
                <div className="absolute -left-[17px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-950 border-2 border-amber-500 text-xs font-black text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                  {week.number}
                </div>
                
                <div className="bg-zinc-900/40 rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition">
                  <h3 className="text-xl font-bold text-white mb-2">
                    <span className="text-amber-500 text-sm font-mono tracking-widest mr-3 uppercase">Semana {index + 1}</span>
                    <br className="sm:hidden" />
                    {week.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {week.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }