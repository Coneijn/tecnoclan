import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-zinc-950 pt-16 pb-8 border-t border-zinc-900">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Columna 1: Marca */}
          <div className="col-span-1 md:col-span-2">
            <span className="text-2xl font-black tracking-wider text-white">
              TECNO<span className="text-amber-500">CLAN</span>
            </span>
            <p className="mt-4 text-sm text-zinc-400 max-w-xs leading-relaxed">
              Transformando el tiempo de pantalla en tiempo de calidad y habilidades de ingeniería en Morelia, Michoacán.
            </p>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Explorar</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="#temario" className="hover:text-amber-500 transition">El Temario</Link></li>
              <li><Link href="#faq" className="hover:text-amber-500 transition">Preguntas Frecuentes</Link></li>
              <li><Link href="#checkout" className="hover:text-amber-500 transition">Inscribirse (Promoción)</Link></li>
            </ul>
          </div>

          {/* Columna 3: Plataforma */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-wider">Plataforma</h3>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li><Link href="/login" className="hover:text-amber-500 transition">Acceso al LMS (Alumnos)</Link></li>
              <li><Link href="/instructor" className="hover:text-amber-500 transition">Portal de Instructores</Link></li>
              <li><Link href="/gobierno" className="hover:text-amber-500 transition">Saber en Piezas (B2B)</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
          <p>© {currentYear} Tecnoclan. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <Link href="/privacidad" className="hover:text-zinc-400 transition">Aviso de Privacidad</Link>
            <Link href="/terminos" className="hover:text-zinc-400 transition">Términos y Condiciones</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}