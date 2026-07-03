'use client';

import React, { useState, useRef } from 'react';
import { Play, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import DraggableItem from '../ui/DraggableItem';
import CircuitBoard from '../ui/CircuitBoard';

const LEVEL_BATTERY: CircuitComponent = { id: 'bat-0', type: 'battery', value: 9, label: '9V' };
const LEVEL_RESISTOR: CircuitComponent = { id: 'res-0', type: 'resistor', value: 330, label: '330Ω' };
const LEVEL_LED: LedComponent = { id: 'led-0', type: 'led', polarity: 'correct' }; 

export default function Level0() {
  const [boardBattery, setBoardBattery] = useState<CircuitComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<CircuitComponent | null>(null);
  const [boardLed, setBoardLed] = useState<LedComponent | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const dropZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (e: any, info: any, item: CircuitComponent | LedComponent) => {
    if (!dropZoneRef.current) return;
    const rect = dropZoneRef.current.getBoundingClientRect();
    const isInside = info.point.x >= rect.left && info.point.x <= rect.right &&
                     info.point.y >= rect.top && info.point.y <= rect.bottom;

    if (isInside) {
      if (item.type === 'led') setBoardLed(item as LedComponent);
      else if (item.type === 'battery') setBoardBattery(item as CircuitComponent);
      else if (item.type === 'resistor') setBoardResistor(item as CircuitComponent);

      setIsSimulating(false);
      setSimulationState('idle');
      setFeedbackMsg('');
    }
  };

  const handlePlay = () => {
    if (!boardLed || !boardBattery) {
      setFeedbackMsg('Necesitas al menos la Energía y el LED para cerrar el circuito.');
      return;
    }

    setIsSimulating(true);
    setSimulationState('idle');
    setFeedbackMsg('');

    setTimeout(() => {
      if (!boardResistor) {
        setSimulationState('exploded');
        setFeedbackMsg('¡BOOM! Sin resistencia, la energía destruyó el LED. ¡Limpia el tablero e intenta colocarla!');
      } else {
        setSimulationState('perfect');
        setFeedbackMsg('¡Excelente! La resistencia protegió el LED y el circuito funciona perfectamente.');
      }
    }, 1500); 
  };

  const handleReset = () => {
    setBoardBattery(null);
    setBoardResistor(null);
    setBoardLed(null);
    setIsSimulating(false);
    setSimulationState('idle');
    setFeedbackMsg('');
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">

        {/* CAJA DE HERRAMIENTAS */}
        <div className={`col-span-1 bg-neutral-900 border-2 rounded-xl p-6 shadow-xl transition-all duration-500 ${isSimulating ? 'opacity-50 pointer-events-none border-neutral-800' : 'border-neutral-700'}`}>
          <h2 className="text-xl font-semibold mb-4 border-b border-neutral-700 pb-2">Componentes</h2>
          <p className="text-sm text-neutral-400 mb-6">Arrastra los componentes físicos hacia el circuito.</p>

          <div className="space-y-4">
            <div className="flex flex-col gap-4 items-start">
              {!boardBattery && <DraggableItem item={LEVEL_BATTERY} onDragEnd={handleDragEnd} />}
              {!boardResistor && <DraggableItem item={LEVEL_RESISTOR} onDragEnd={handleDragEnd} />}
              {!boardLed && <DraggableItem item={LEVEL_LED} onDragEnd={handleDragEnd} />}
            </div>
          </div>
        </div>

        {/* TABLERO */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <CircuitBoard
            dropZoneRef={dropZoneRef}
            isSimulating={isSimulating}
            simulationState={simulationState}
            ledPolarity={boardLed?.polarity}
          >
            {/* Portapilas (Izquierda) */}
            <div className="absolute left-[2%] top-1/2 -translate-y-1/2 z-10">
              <AnimatePresence>
                {boardBattery && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="drop-shadow-2xl">
                     <svg viewBox="0 0 100 160" width="70" height="110">
                        <rect x="10" y="10" width="80" height="140" rx="10" fill="#222" stroke="#111" strokeWidth="4"/>
                        <rect x="25" y="20" width="50" height="120" rx="5" fill="#444" />
                        <circle cx="50" cy="35" r="8" fill="silver"/>
                        <circle cx="50" cy="125" r="8" fill="silver"/>
                        <text x="50" y="85" fill="#fbbf24" fontSize="16" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 85)">{boardBattery.label}</text>
                        <text x="50" y="25" fill="#ef4444" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
                        <text x="50" y="145" fill="#3b82f6" fontSize="24" fontWeight="bold" textAnchor="middle">-</text>
                     </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resistencia (Arriba) */}
            <div className="absolute top-[2%] left-1/2 -translate-x-1/2 z-10">
              <AnimatePresence>
                {boardResistor && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative drop-shadow-xl">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120" className="transform -translate-y-4">
                        <line x1="0" y1="50" x2="100" y2="50" stroke="silver" strokeWidth="6"/>
                        <rect x="20" y="35" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2"/>
                        <rect x="28" y="35" width="5" height="30" fill="#f44336"/> 
                        <rect x="40" y="35" width="5" height="30" fill="#9c27b0"/> 
                        <rect x="52" y="35" width="5" height="30" fill="#795548"/> 
                        <rect x="68" y="35" width="5" height="30" fill="#ffd700"/> 
                     </svg>
                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-200 bg-black/80 px-2 py-1 rounded">{boardResistor.label}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LED (Derecha) */}
            <div className="absolute right-[4%] top-1/2 -translate-y-1/2 z-10">
              <AnimatePresence>
                {boardLed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <div className={`relative w-20 h-20 transition-all duration-300 z-10 ${
                         simulationState === 'perfect' ? 'drop-shadow-[0_0_25px_rgba(239,68,68,1)]' :
                         simulationState === 'exploded' ? 'opacity-0 scale-150 transition-all duration-100' : 'drop-shadow-lg'
                       }`}>
                          <svg viewBox="0 0 100 100" width="100%" height="100%" className={`${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
                            <g transform="rotate(90 50 50)">
                              <path d="M 85 25 A 40 40 0 1 0 85 75 Z" 
                                fill={
                                  simulationState === 'exploded' ? '#000' : 
                                  simulationState === 'perfect' ? '#ef4444' : '#7f1d1d'
                                } 
                                stroke="#450a0a" strokeWidth="4"
                              />
                              <rect x="40" y="30" width="20" height="40" fill="rgba(0,0,0,0.3)" rx="2"/>
                              <rect x="48" y="20" width="4" height="20" fill="rgba(0,0,0,0.5)"/>
                            </g>
                          </svg>
                       </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </CircuitBoard>

          {/* CONTROLES */}
          <div className="mt-8 flex flex-col items-center gap-4 z-20">
            <div className="flex gap-4">
              <button onClick={handlePlay} disabled={isSimulating && simulationState === 'idle'} className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full font-bold shadow-lg shadow-emerald-900/50 transition-all active:scale-95 disabled:opacity-50">
                <Play size={20} fill="currentColor" /> Simular Circuito
              </button>
              <button onClick={handleReset} className="flex items-center gap-2 px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-full font-semibold transition-all border border-neutral-700">
                <RotateCw size={18} /> Limpiar Tablero
              </button>
            </div>

            <AnimatePresence>
              {feedbackMsg && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`max-w-md text-center p-4 rounded-xl font-medium border shadow-2xl ${
                    simulationState === 'exploded' ? 'bg-red-950/80 text-red-300 border-red-800' :
                    simulationState === 'perfect' ? 'bg-emerald-950/80 text-emerald-300 border-emerald-800' :
                    'bg-neutral-800 text-neutral-300 border-neutral-700'
                  }`}
                >
                  {feedbackMsg}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}