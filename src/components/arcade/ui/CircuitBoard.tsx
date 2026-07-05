'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CircuitBoardProps {
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  isSimulating: boolean;
  simulationState: string;
  ledPolarity?: 'correct' | 'reversed';
  children: React.ReactNode; 
}

export default function CircuitBoard({ 
  dropZoneRef, 
  isSimulating, 
  simulationState, 
  ledPolarity, 
  children 
}: CircuitBoardProps) {
  
  const boardStyles = 
    simulationState === 'exploded' ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.3)]' : 
    simulationState === 'perfect' ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 
    isSimulating ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-neutral-700';

  return (
    <div 
      // Esta es la zona de captura. Al darle id, facilitamos el debuggeo.
      id="drop-zone-board"
      ref={dropZoneRef}
      /* FIX MÓVIL 1: Redujimos el padding en móvil (p-4) y lo subimos en desktop (md:p-8). 
         También aseguramos que ocupe todo el ancho disponible. */
      className={`w-full flex-1 bg-neutral-900/90 backdrop-blur-sm border-2 border-dashed rounded-xl p-4 md:p-8 relative flex flex-col items-center justify-center transition-all duration-700 ${boardStyles}`}
    >
      {/* FIX MÓVIL 2: Quitamos aspect-video estricto para que en móvil no quede súper pequeño,
          usando aspect-[4/3] en móviles y aspect-video en tablets/desktop */}
      <div className="relative w-full max-w-lg aspect-[4/3] md:aspect-video rounded-lg flex items-center justify-center">
        
        {/* Cables Base */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
          <path d="M 150 200 L 150 100 L 650 100 L 650 300 L 150 300 Z" fill="none" stroke="#333" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* Animación de la corriente */}
          {isSimulating && (
            <motion.path 
              d={ledPolarity === 'reversed' 
                ? "M 150 200 L 150 100 L 650 100 L 650 180" 
                : "M 150 200 L 150 100 L 650 100 L 650 300 L 150 300 Z" 
              }
              fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"
              strokeDasharray="0 25"
              initial={{ strokeDashoffset: 1000 }}
              animate={{ strokeDashoffset: ledPolarity === 'reversed' ? 850 : 0 }}
              transition={{ 
                duration: ledPolarity === 'reversed' ? 1.5 : 3, 
                ease: "linear", 
                repeat: ledPolarity === 'reversed' ? 0 : Infinity 
              }}
            />
          )}
        </svg>

        {/* Componentes inyectados */}
        {children}
        
      </div>
    </div>
  );
}