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
      id="drop-zone-board"
      ref={dropZoneRef}
      className={`w-full flex-1 bg-neutral-900/90 backdrop-blur-sm border-2 border-dashed rounded-xl p-2 md:p-4 relative flex flex-col items-center justify-center transition-all duration-700 ${boardStyles}`}
    >
      {/* FIX 1: Cambiamos a aspect-[2/1] para que coincida matemáticamente con el 800x400 del viewBox.
        FIX 2: Aumentamos el max-w a [800px] para que la capa de componentes HTML encaje perfecto.
      */}
      <div className="relative w-full max-w-[800px] aspect-[2/1] rounded-lg flex items-center justify-center overflow-hidden">
        
        {/* Aquí se inyectan el ProtoboardBackground y la capa de componentes desde Level0 */}
        {children}
        
      </div>
    </div>
  );
}