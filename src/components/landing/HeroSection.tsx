import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-clan-bg py-24 sm:py-32 border-b border-white/5">
      {/* Elemento decorativo de fondo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,118,67,0.12),transparent_45%)]" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge de Lanzamiento */}
          <span className="inline-flex items-center rounded-full bg-clan-action/10 px-3 py-1 text-xs font-medium text-clan-contrast-rojo ring-1 ring-inset ring-clan-morado/30 mb-6 shadow-[0_0_10px_rgba(255,118,67,0.2)]">
            ⚡ Inicio: 1 de Agosto • Cupo Limitado por Maletín Física
          </span>

          {/* Título Principal */}
          <h1 className="text-4xl font-extrabold tracking-tight text-clan-text sm:text-6xl px-2">
            Transforma su tiempo de pantalla en{' '}
            <span className="bg-gradient-to-r from-clan-action to-clan-contrast-amarillo bg-clip-text text-transparent drop-shadow-sm">
              Ingeniería Real
            </span>
          </h1>

          {/* Subtítulo */}
          <p className="mt-6 text-lg leading-8 text-clan-text/80 px-4">
            Un taller de 4 semanas diseñado para que padres e hijos programen, ensamblen y hackeen hardware juntos usando estaciones basadas en Raspberry Pi. Sin teoría aburrida: 100% proyectos que se van a casa.
          </p>

          {/* Ganchos Rápidos */}
          <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-clan-text/70">
            <div className="flex items-center gap-2 drop-shadow-[0_0_8px_rgba(82,255,0,0.6)]">🟢 <span className="text-clan-text font-semibold">Inscripción Early Bird: $250 MXN</span></div>
            <div className="flex items-center gap-2 drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">💻 <span className="text-clan-text font-semibold">Incluye acceso a Plataforma LMS</span></div>
          </div>

          {/* Acciones */}
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="#checkout"
              className="rounded-xl bg-clan-action px-8 py-4 text-base font-black text-clan-bg shadow-[0_0_20px_rgba(255,118,67,0.3)] hover:shadow-[0_0_35px_rgba(255,118,67,0.6)] hover:brightness-110 transition-all w-full sm:w-auto text-center"
            >
              Inscribirme hoy por $250
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}