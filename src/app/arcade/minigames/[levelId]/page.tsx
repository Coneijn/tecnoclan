import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, Gamepad2, Award } from 'lucide-react';
import { redirect } from 'next/navigation';

// Importamos el nivel que acabamos de crear
import Level0 from '@/components/arcade/levels/Level0';
import Level1 from '@/components/arcade/levels/Level1';
import Level2 from '@/components/arcade/levels/Level2';
import Level3 from '@/components/arcade/levels/Level3';
import Level4 from '@/components/arcade/levels/Level4';
import Level5 from '@/components/arcade/levels/Level5';
import Level6 from '@/components/arcade/levels/Level6';
import Level7 from '@/components/arcade/levels/Level7';
import Level8 from '@/components/arcade/levels/Level8';
import Level9 from '@/components/arcade/levels/Level9';
const TOTAL_LEVELS = 10;

const LEVEL_TITLES = [
  "Conceptos Abstractos",
  "Polaridad",
  "Posición Estricta",
  "Distractores: Color",
  "Distractores: Resistencias",
  "Cambio de Fuente",
  "La Ley de Ohm",
  "Cálculo + Colores",
  "Componentes Físicos",
  "Lectura de Diagramas"
];

// 1. Actualizamos el tipo para indicar que params es una Promesa
type PageProps = {
  params: Promise<{ levelId: string }>;
};

// 2. Hacemos la función asíncrona (async)
export default async function LevelPage({ params }: PageProps) {
  // 3. Desempaquetamos (unwrap) los parámetros con await
  const resolvedParams = await params;
  const currentLevelId = parseInt(resolvedParams.levelId, 10);

  if (isNaN(currentLevelId) || currentLevelId < 0 || currentLevelId >= TOTAL_LEVELS) {
    redirect('/arcade'); 
  }

  const hasNext = currentLevelId < TOTAL_LEVELS - 1;
  const hasPrev = currentLevelId > 0;

  const renderLevelComponent = () => {
    switch (currentLevelId) {
      case 0: return <Level0 />;
      case 1: return <Level1 />;
      case 2: return <Level2 />;
      case 3: return <Level3 />;
      case 4: return <Level4 />;
      case 5: return <Level5 />;
      case 6: return <Level6 />;
      case 7: return <Level7 />;
      case 8: return <Level8 />;
      case 9: return <Level9 />;
      default: 
        return (
          <div className="flex flex-col items-center justify-center h-96 text-neutral-500 bg-neutral-900/30 rounded-2xl border-2 border-neutral-800 border-dashed m-8">
            <Gamepad2 size={64} className="mb-4 opacity-20" />
            <h2 className="text-xl font-bold text-neutral-400 mb-2">Zona en Construcción</h2>
            <p>Pronto se habilitará el Nivel {currentLevelId}: {LEVEL_TITLES[currentLevelId]}.</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans flex flex-col">
      <header className="border-b border-neutral-800 bg-neutral-900/80 p-4 sticky top-0 z-50 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between relative">
          <Link 
            href="/arcade" 
            className="flex items-center gap-2 text-neutral-400 hover:text-emerald-400 transition-colors font-medium z-10"
          >
            <ArrowLeft size={20} />
            <span className="hidden sm:inline">Volver al Arcade</span>
          </Link>
          
          <div className="text-center absolute left-1/2 -translate-x-1/2 w-full max-w-[200px] sm:max-w-md pointer-events-none">
            <span className="text-[10px] sm:text-xs font-bold tracking-wider text-emerald-500 uppercase">
              Nivel {currentLevelId} de {TOTAL_LEVELS - 1}
            </span>
            <h1 className="text-sm sm:text-lg font-bold text-neutral-200 truncate">
              {LEVEL_TITLES[currentLevelId]}
            </h1>
          </div>

          <div className="w-24 z-10" />
        </div>
      </header>

      <main className="flex-grow flex flex-col w-full">
        {renderLevelComponent()}
      </main>

      <footer className="border-t border-neutral-800 bg-neutral-950 p-6 sticky bottom-0 z-40">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {hasPrev ? (
            <Link 
              href={`/arcade/minigames/${currentLevelId - 1}`}
              className="flex items-center gap-2 px-5 py-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-xl transition-all font-medium hover:-translate-x-1"
            >
              <ArrowLeft size={18} /> <span className="hidden sm:inline">Anterior</span>
            </Link>
          ) : (
            <div className="w-24" />
          )}

          {hasNext ? (
            <Link 
              href={`/arcade/minigames/${currentLevelId + 1}`}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all font-bold shadow-lg shadow-emerald-900/20 hover:translate-x-1"
            >
              Siguiente <ArrowRight size={18} />
            </Link>
          ) : (
            <Link 
              href="/" 
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all font-bold shadow-[0_0_30px_rgba(79,70,229,0.3)] hover:scale-105"
            >
              <Award size={18} /> Inscribirse al Taller
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}