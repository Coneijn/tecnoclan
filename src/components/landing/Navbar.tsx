import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-clan-bg/90 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-clan-action drop-shadow-[0_0_8px_rgba(255,118,67,0.4)]">
              TECNOCLAN
            </span>
          </div>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-clan-text/70">
            <Link href="#taller" className="hover:text-clan-glow-cian hover:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)] transition-all">El Taller</Link>
            <Link href="#lms" className="hover:text-clan-glow-cian hover:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)] transition-all">Plataforma LMS</Link>
            <Link href="#faq" className="hover:text-clan-glow-cian hover:drop-shadow-[0_0_5px_rgba(0,229,255,0.5)] transition-all">Dudas</Link>
          </div>
          {/* CTA Botón */}
          <div>
            <Link
              href="#checkout"
              className="inline-flex items-center justify-center rounded-xl bg-clan-action px-4 py-2 text-sm font-bold text-clan-bg hover:brightness-110 transition-all shadow-[0_0_15px_rgba(255,118,67,0.3)] hover:shadow-[0_0_25px_rgba(255,118,67,0.6)]"
            >
              Asegurar Lugar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}