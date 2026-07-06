'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CircuitComponent, LedComponent } from '../types';

interface DraggableItemProps {
  item: CircuitComponent | LedComponent;
  onDragEnd: (e: any, info: any, item: CircuitComponent | LedComponent) => void;
  disabled?: boolean;
  mode?: 'physical' | 'schematic';
}

export default function DraggableItem({ item, onDragEnd, disabled = false, mode = 'physical' }: DraggableItemProps) {
  
  const ledColor = (item.type === 'led' && 'color' in item ? item.color : 'red') as 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'white';
  
  const ledStyles = {
    red: { fill: '#ef4444', border: 'border-red-500/50', bg: 'bg-red-900/40' },
    green: { fill: '#22c55e', border: 'border-green-500/50', bg: 'bg-green-900/40' },
    blue: { fill: '#3b82f6', border: 'border-blue-500/50', bg: 'bg-blue-900/40' },
    yellow: { fill: '#eab308', border: 'border-yellow-500/50', bg: 'bg-yellow-900/40' },
    orange: { fill: '#f97316', border: 'border-orange-500/50', bg: 'bg-orange-900/40' },
    white: { fill: '#f3f4f6', border: 'border-neutral-300/50', bg: 'bg-neutral-900/40' }
  };

  const currentStyle = ledStyles[ledColor];

  return (
    <motion.div 
  drag={!disabled}
  dragSnapToOrigin
  dragElastic={0} // Elimina la resistencia elástica, mejora el rendimiento táctil
  whileDrag={{ scale: 1.2, zIndex: 999 }} // Manda la pieza por encima de TODO al moverse
  onDragEnd={(e, info) => onDragEnd(e, info, item)}
  // ... el resto de tu código
      /* FIX MÓVIL 1: Feedback visual al tocar la pantalla (escala y eleva el z-index) */
      whileTap={!disabled ? { scale: 1.15, zIndex: 50, cursor: 'grabbing' } : {}}
      /* FIX MÓVIL 2: Previene que el navegador haga scroll cuando se arrastra la pieza */
      style={{ touchAction: 'none' }}
      /* FIX MÓVIL 3: Aumentamos el padding (p-4) y aseguramos un tamaño mínimo para el Touch Target */
      className={`relative flex flex-col items-center justify-center z-10 transition-colors rounded-xl p-4 min-w-[64px] min-h-[64px]
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-grab hover:bg-white/10'}
        ${item.type === 'battery' ? 'bg-blue-900/40 border border-blue-500/50 w-24 h-28' : ''}
        ${item.type === 'resistor' ? 'bg-amber-900/40 border border-amber-500/50 w-28 h-20' : ''}
        ${item.type === 'led' ? `${currentStyle.bg} border ${currentStyle.border} w-24 h-24` : ''}
      `}
    >
      {/* BATERÍA */}
      {item.type === 'battery' && 'label' in item && (
        mode === 'schematic' ? (
          <div className="flex flex-col items-center">
            <div className="text-blue-400 font-bold mb-1 text-xs">{item.label}</div>
            <svg viewBox="0 0 100 100" className="w-5 h-5 stroke-blue-500 mb-2">
              <line x1="50" y1="100" x2="50" y2="20" strokeWidth="12"/>
              <polygon points="50,0 20,40 80,40" fill="currentColor"/>
            </svg>
            <svg viewBox="0 0 100 100" className="w-6 h-6 stroke-blue-500">
              <line x1="50" y1="0" x2="50" y2="60" strokeWidth="8"/>
              <line x1="20" y1="60" x2="80" y2="60" strokeWidth="8"/>
              <line x1="30" y1="75" x2="70" y2="75" strokeWidth="8"/>
              <line x1="42" y1="90" x2="58" y2="90" strokeWidth="8"/>
            </svg>
          </div>
        ) : (
          <svg viewBox="0 0 100 160" width="45" height="70" className="drop-shadow-lg pointer-events-none">
            <rect x="10" y="10" width="80" height="140" rx="10" fill="#222" stroke="#111" strokeWidth="4"/>
            <rect x="25" y="20" width="50" height="120" rx="5" fill="#444" />
            <circle cx="50" cy="35" r="8" fill="silver"/>
            <circle cx="50" cy="125" r="8" fill="silver"/>
            <text x="50" y="85" fill="#fbbf24" fontSize="16" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 85)">{item.label}</text>
            <text x="50" y="25" fill="#ef4444" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
            <text x="50" y="145" fill="#3b82f6" fontSize="24" fontWeight="bold" textAnchor="middle">-</text>
          </svg>
        )
      )}

      {/* RESISTENCIA */}
      {item.type === 'resistor' && 'label' in item && (
        mode === 'schematic' ? (
          <div className="flex flex-col items-center px-1">
            <div className="text-amber-400 font-bold mb-1 text-[10px]">{item.label}</div>
            <svg width="40" height="20" viewBox="0 0 40 20" className="stroke-amber-500 stroke-[3px] fill-none">
              <path d="M0 10 L5 10 L8 4 L14 16 L20 4 L26 16 L32 4 L35 10 L40 10" />
            </svg>
          </div>
        ) : (
          <>
            <div className="absolute -top-4 text-[10px] font-bold text-amber-200 bg-black/80 px-2 py-0.5 rounded pointer-events-none">{item.label}</div>
            <svg viewBox="0 0 100 100" width="75" height="75" className="drop-shadow-lg pointer-events-none">
              <line x1="0" y1="50" x2="100" y2="50" stroke="silver" strokeWidth="6"/>
              <rect x="20" y="35" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2"/>
              <rect x="28" y="35" width="5" height="30" fill={(item.bands && item.bands[0]) || "#f44336"}/> 
              <rect x="40" y="35" width="5" height="30" fill={(item.bands && item.bands[1]) || "#9c27b0"}/> 
              <rect x="52" y="35" width="5" height="30" fill={(item.bands && item.bands[2]) || "#795548"}/> 
              <rect x="68" y="35" width="5" height="30" fill={(item.bands && item.bands[3]) || "#ffd700"}/> 
            </svg>
          </>
        )
      )}

{/* LED */}
{item.type === 'led' && 'polarity' in item && (
  mode === 'schematic' ? (
    <div className="p-1">
      <svg width="30" height="30" viewBox="0 0 24 24" className={`stroke-red-500 stroke-2 fill-none transition-transform duration-300 ${item.polarity === 'reversed' ? 'rotate-180' : ''}`}>
        <path d="M12 2v20M8 8h8l-4 8zM17 5l3 -3M21 7l3 -3" />
      </svg>
    </div>
  ) : (
    <>
    
      
      <svg 
        viewBox="0 0 100 100" 
        width="50" 
        height="50" 
        /* -rotate-90: Lo gira 90° antihorario (apunta hacia arriba)
          rotate-90: Lo gira 90° horario (apunta hacia abajo si está invertido)
        */
        className={`mt-2 drop-shadow-md pointer-events-none transition-transform duration-300 ${item.polarity === 'reversed' ? 'rotate-90' : '-rotate-90'}`}
      >
        <g transform="rotate(90 50 50)">
          <path d="M 85 25 A 40 40 0 1 0 85 75 Z" fill={currentStyle.fill} stroke="#111" strokeWidth="4" />
          <rect x="40" y="30" width="20" height="40" fill="rgba(0,0,0,0.3)" rx="2"/>
          <rect x="48" y="20" width="4" height="20" fill="rgba(0,0,0,0.5)"/>
        </g>
      </svg>

      
    </>
  )
)}
    </motion.div>
  );
}