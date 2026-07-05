import React from 'react';
import Link from 'next/link';
// Importación de los niveles
import Level0 from '@/components/arcade/levels/Level0';
// (Descomenta los demás conforme los vayas creando)

export default async function MinigamePage({ 
  params 
}: { 
  params: Promise<{ levelId: string }> 
}) {
  
  // FIX: En Next.js 15+, params es una promesa y debemos esperarla
  const { levelId } = await params;

  // Renderizado dinámico del nivel correspondiente
  const renderLevel = () => {
    switch (levelId) {
      case '0': return <Level0 />;
      
      default: return (
        <div className="flex-1 flex flex-col items-center justify-center text-neutral-400 gap-4">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="stroke-neutral-600 stroke-2">
             <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" strokeLinecap="round"/>
          </svg>
          <p>El Nivel {levelId} está en construcción...</p>
        </div>
      );
    }
  };

  return (
<main className="h-[100dvh] bg-protoboard flex flex-col relative overflow-hidden w-full select-none touch-none">      <header className="w-full p-4 flex justify-between items-center bg-neutral-950/80 backdrop-blur-md border-b border-neutral-800 z-50">
        <Link 
          href="/arcade" 
          className="text-neutral-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Salir
        </Link>
        <div className="text-emerald-500 font-bold text-sm tracking-widest uppercase">
          Nivel {levelId}
        </div>
      </header>

      <section className="flex-1 w-full flex flex-col p-2 md:p-8 max-w-6xl mx-auto min-h-0">
        {renderLevel()}
      </section>

    </main>
  );
}