'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LevelInstructionsProps {
  title: string;
  description: string;
  objective: string;
  // Opcional: para cerrarlo automáticamente desde el nivel cuando el usuario empiece a jugar
  isMinimizedProp?: boolean; 
}

export default function LevelInstructions({ 
  title, 
  description, 
  objective,
  isMinimizedProp = false
}: LevelInstructionsProps) {
  const [isMinimized, setIsMinimized] = useState(isMinimizedProp);

  return (
    <div className="w-full bg-neutral-900/90 backdrop-blur-md border border-neutral-700 md:rounded-2xl rounded-xl overflow-hidden mb-4 shadow-lg z-30">
      
      {/* CABECERA CLICKABLE: Siempre visible, sirve como botón para abrir/cerrar */}
      <button 
  onClick={() => setIsMinimized(!isMinimized)}
  className="w-full flex items-center justify-between p-4 text-left focus:outline-none relative z-50 touch-manipulation cursor-pointer"
>
        <div className="flex items-center gap-3">
          <div className="bg-emerald-500/20 p-2 rounded-lg">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-emerald-400 stroke-2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 16v-4M12 8h.01" strokeLinecap="round"/>
            </svg>
          </div>
          <h2 className="text-white font-bold text-lg">{title}</h2>
        </div>
        
        <motion.div
          animate={{ rotate: isMinimized ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="stroke-neutral-400 stroke-2">
            <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </button>

      {/* CUERPO COLAPSABLE: Contiene la carnita de las instrucciones */}
      <AnimatePresence>
        {!isMinimized && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-4 pb-4 pt-2 border-t border-neutral-800">
              <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-3">
                {description}
              </p>
              
              {/* Bloque de "Misión/Objetivo" con alto contraste */}
              <div className="bg-neutral-950 p-3 rounded-lg border border-neutral-800 flex items-start gap-3">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="stroke-amber-400 stroke-2 shrink-0 mt-0.5">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p className="text-amber-200 text-sm font-medium">
                  <span className="text-amber-400 font-bold block mb-1">Tu Objetivo:</span>
                  {objective}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}