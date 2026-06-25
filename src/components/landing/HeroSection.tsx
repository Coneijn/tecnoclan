import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32 border-b border-zinc-900">
      {/* Elemento decorativo de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.08),transparent_45%)]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge de Lanzamiento */}
          <span className="inline-flex items-center rounded-full bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-500 ring-1 ring-inset ring-amber-500/20 mb-6">
            ⚡ Inicio: 1 de Agosto • Cupo Limitado por Maletín Física
          </span>

          {/* Título Principal */}
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl px-2">
            Transforma su tiempo de pantalla en{' '}
            <span className="bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Ingeniería Real
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="mt-6 text-lg leading-8 text-zinc-400 px-4">
            Un taller de 4 semanas diseñado para que padres e hijos programen, ensamblen y hackeen hardware juntos usando estaciones basadas en Raspberry Pi. Sin teoría aburrida: 100% proyectos que se van a casa.
          </p>

          {/* Ganchos Rápidos */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-zinc-400">
            <div className="flex items-center gap-2">🟢 <span className="text-zinc-200 font-semibold">Inscripción Early Bird: $250 MXN</span></div>
            <div className="flex items-center gap-2">💻 <span className="text-zinc-200 font-semibold">Incluye acceso a Plataforma LMS</span></div>
          </div>

          {/* Acciones */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="#checkout"
              className="rounded-xl bg-amber-500 px-8 py-4 text-base font-black text-zinc-950 shadow-xl shadow-amber-500/10 hover:bg-amber-400 transition w-full sm:w-auto text-center"
            >
              Inscribirme hoy por $250
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}