'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface CircuitBoardProps {
  dropZoneRef: React.RefObject<HTMLDivElement | null>;
  isSimulating: boolean;
  simulationState: string;
  ledPolarity?: 'correct' | 'reversed';
  children: React.ReactNode; // Aquí inyectaremos los componentes colocados
}

export default function CircuitBoard({ 
  dropZoneRef, 
  isSimulating, 
  simulationState, 
  ledPolarity, 
  children 
}: CircuitBoardProps) {
  
  // Estilos dinámicos del borde según el estado
  const boardStyles = 
    simulationState === 'exploded' ? 'border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.2)]' : 
    simulationState === 'perfect' ? 'border-emerald-500 shadow-[0_0_50px_rgba(16,185,129,0.2)]' : 
    isSimulating ? 'border-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.1)]' : 'border-neutral-700';

  return (
    <div 
      ref={dropZoneRef}
      className={`flex-1 bg-neutral-900 border-2 border-dashed rounded-xl p-8 relative flex flex-col items-center justify-center transition-all duration-700 ${boardStyles}`}
    >
      <div className="relative w-full max-w-lg aspect-video rounded-lg flex items-center justify-center">
        
        {/* Cables Base */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
          <path d="M 150 200 L 150 100 L 650 100 L 650 300 L 150 300 Z" fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
          
          {/* Animación de la corriente (Electrones) */}
          {isSimulating && (
            <motion.path 
              d={ledPolarity === 'reversed' 
                ? "M 150 200 L 150 100 L 650 100 L 650 180" // Se detiene
                : "M 150 200 L 150 100 L 650 100 L 650 300 L 150 300 Z" // Fluye
              }
              fill="none" stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"
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

        {/* Aquí se renderizarán la Batería, Resistencia y LED colocados */}
        {children}
        
      </div>
    </div>
  );
}