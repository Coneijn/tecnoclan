import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <span className="text-xl font-black tracking-wider text-amber-500">
              TECNOCLAN
            </span>
          </div>

          {/* Enlaces de navegación */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
            <Link href="#taller" className="hover:text-white transition">El Taller</Link>
            <Link href="#lms" className="hover:text-white transition">Plataforma LMS</Link>
            <Link href="#faq" className="hover:text-white transition">Dudas</Link>
          </div>

          {/* CTA Botón */}
          <div>
            <Link
              href="#checkout"
              className="inline-flex items-center justify-center rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-zinc-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20"
            >
              Asegurar Lugar
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}