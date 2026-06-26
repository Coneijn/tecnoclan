import Link from 'next/link';
import Image from 'next/image';
export default function LinksPage() {
  // Modificamos las clases para remover el 'hover:bg-...' y las sombras masivas.
  // Ahora el fondo permanece oscuro y solo se iluminan el borde (edge) y el texto/icono.
  const links = [
    { 
      title: 'Sitio Web', 
      url: 'https://tecnoclan.com.mx/', 
      colorClass: 'hover:border-clan-action hover:text-clan-action',
      icon: (
        <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>
        </svg>
      )
    },
    { 
      title: 'Facebook', 
      url: 'https://www.facebook.com/profile.php?id=61591443808595', 
      colorClass: 'hover:border-clan-contrast-azul hover:text-clan-contrast-azul',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
        </svg>
      )
    },
    { 
      title: 'Twitter (X)', 
      url: 'https://x.com/tecnoclanmx', 
      colorClass: 'hover:border-clan-contrast-amarillo hover:text-clan-contrast-amarillo',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      title: 'Instagram', 
      url: 'https://www.instagram.com/tecnoclanmx/', 
      colorClass: 'hover:border-clan-glow-morado hover:text-clan-glow-morado',
      icon: (
        <svg className="w-5 h-5 stroke-current" viewBox="0 0 24 24" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
        </svg>
      )
    },
    { 
      title: 'YouTube', 
      url: 'https://www.youtube.com/@TecnoClan', 
      colorClass: 'hover:border-clan-contrast-rojo hover:text-clan-contrast-rojo',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.516 0-9.387.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.387.508 9.387.508s7.517 0 9.387-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      title: 'TikTok', 
      url: 'https://tiktok.com/@tecnoclanmx', 
      colorClass: 'hover:border-clan-glow-cian hover:text-clan-glow-cian',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.02 1.59 4.23.94 1.18 2.27 1.99 3.73 2.32v3.87c-1.63-.02-3.23-.46-4.63-1.28-.41-.24-.79-.53-1.15-.85v6.52c.07 1.63-.4 3.25-1.34 4.58-.93 1.35-2.29 2.33-3.84 2.76-1.57.45-3.26.35-4.76-.28-1.5-.61-2.74-1.74-3.5-3.18-.79-1.46-1.04-3.16-.72-4.79.31-1.64 1.2-3.11 2.5-4.13 1.29-.98 2.91-1.47 4.53-1.37.01 1.34-.01 2.68 0 4.02-1-.09-2.02.21-2.77.89-.73.68-1.12 1.67-1.06 2.67.06 1 .55 1.93 1.34 2.52.78.58 1.77.78 2.72.53.95-.24 1.75-.89 2.19-1.76.32-.65.44-1.37.42-2.09V.02z"/>
        </svg>
      )
    },
    
  ];

  return (
    <main className="min-h-screen bg-clan-bg text-clan-text flex flex-col items-center py-16 px-4 antialiased">
      
      {/* 1. Sección de Perfil */}
      <div className="flex flex-col items-center mb-12 text-center">
        {/* Contenedor del Avatar Adaptativo y Responsivo */}
        <div className="relative w-28 h-28 md:w-36 md:h-36 rounded-full bg-[#1A1A1A] border-2 border-clan-glow-verde/50 mb-4 overflow-hidden shadow-[0_0_20px_var(--color-clan-glow-verde)] transition-all duration-500 hover:scale-105">
           <Image 
             src="/LogoOuroboros.png" 
             alt="TecnoClan Logo" 
             fill
             priority
             className="object-contain p-2 drop-shadow-[0_0_8px_rgba(82,255,0,0.5)]" 
           />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">TecnoClan</h1>
        <p className="text-clan-text/70 mt-3 max-w-sm">
          Formando el futuro de la tecnología. Aprende, construye and domina.
        </p>
      </div>

      {/* 2. Botones de Enlaces */}
      <div className="w-full max-w-md flex flex-col gap-5">
        {links.map((link, index) => (
          <Link 
            key={index} 
            href={link.url}
            target={link.url.startsWith('http') ? '_blank' : '_self'}
            rel={link.url.startsWith('http') ? 'noopener noreferrer' : ''}
            // Añadido 'gap-3 flex items-center justify-center' para alinear el SVG perfectamente al lado de las letras
            className={`w-full bg-[#1A1A1A]/80 border border-clan-text/10 py-4 px-6 rounded-2xl flex items-center justify-center gap-3 font-bold shadow-sm transition-all duration-300 hover:-translate-y-1 ${link.colorClass}`}
          >
            {link.icon}
            <span>{link.title}</span>
          </Link>
        ))}
      </div>

      {/* 3. Footer */}
      <div className="mt-20 text-xs text-clan-text/40 font-mono">
        © {new Date().getFullYear()} TecnoClan. Todos los derechos reservados.
      </div>
    </main>
  );
}