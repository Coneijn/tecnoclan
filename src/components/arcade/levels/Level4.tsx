'use client';

import React, { useState, useRef } from 'react';
import { Play, RotateCw, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import DraggableItem from '../ui/DraggableItem';
import CircuitBoard from '../ui/CircuitBoard';

const LEVEL_BATTERY: CircuitComponent = { id: 'bat-4', type: 'battery', value: 9, label: '9V' };
const LEVEL_LED: LedComponent = { id: 'led-4', type: 'led', polarity: 'correct', color: 'red' }; 

// Resistencias con su código de colores
const RES_TARGET: CircuitComponent = { 
  id: 'res-330', type: 'resistor', value: 330, label: '330Ω', 
  bands: ['#f97316', '#f97316', '#795548', '#ffd700'] // Naranja, Naranja, Marrón, Oro
};
const RES_DISTRACTOR_1: CircuitComponent = { 
  id: 'res-220', type: 'resistor', value: 220, label: '220Ω', 
  bands: ['#ef4444', '#ef4444', '#795548', '#ffd700'] // Rojo, Rojo, Marrón, Oro
};
const RES_DISTRACTOR_2: CircuitComponent = { 
  id: 'res-1k', type: 'resistor', value: 1000, label: '1kΩ', 
  bands: ['#795548', '#000000', '#ef4444', '#ffd700'] // Marrón, Negro, Rojo, Oro
};

export default function Level4() {
  const [boardBattery, setBoardBattery] = useState<CircuitComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<CircuitComponent | null>(null);
  const [boardLed, setBoardLed] = useState<LedComponent | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const dummyBoardRef = useRef<HTMLDivElement>(null);
  const batZoneRef = useRef<HTMLDivElement>(null);
  const resZoneRef = useRef<HTMLDivElement>(null);
  const ledZoneRef = useRef<HTMLDivElement>(null);

  const handleDragEnd = (e: any, info: any, item: CircuitComponent | LedComponent) => {
    const checkInside = (ref: React.RefObject<HTMLDivElement | null>) => {
      if (!ref.current) return false;
      const rect = ref.current.getBoundingClientRect();
      return info.point.x >= rect.left && info.point.x <= rect.right &&
             info.point.y >= rect.top && info.point.y <= rect.bottom;
    };

    let placed = false;

    if (item.type === 'battery' && checkInside(batZoneRef)) {
      setBoardBattery(item as CircuitComponent);
      placed = true;
    } else if (item.type === 'resistor' && checkInside(resZoneRef)) {
      setBoardResistor(item as CircuitComponent);
      placed = true;
    } else if (item.type === 'led' && checkInside(ledZoneRef)) {
      setBoardLed(item as LedComponent);
      placed = true;
    }

    if (placed) {
      setIsSimulating(false);
      setSimulationState('idle');
      setFeedbackMsg('');
    }
  };

  const handlePlay = () => {
    if (!boardLed || !boardBattery || !boardResistor) {
      setFeedbackMsg('Completa el circuito en las zonas marcadas.');
      return;
    }

    setIsSimulating(true);
    setSimulationState('idle');
    setFeedbackMsg('');

    setTimeout(() => {
      if (boardResistor.value === 220) {
        setSimulationState('burned');
        setFeedbackMsg('Esa era de 220Ω (Rojo, Rojo, Marrón). Es muy poca resistencia para los 9V y el LED se quemó.');
      } else if (boardResistor.value === 1000) {
        setSimulationState('off');
        setFeedbackMsg('Esa era de 1kΩ (Marrón, Negro, Rojo). Es demasiada resistencia, el LED apenas enciende. ¡Buscamos 330Ω!');
      } else {
        setSimulationState('perfect');
        setFeedbackMsg('¡Excelente! Identificaste correctamente el Naranja, Naranja, Marrón (330Ω).');
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

  const getLedFillColor = (color: string | undefined, isSimulatingAction: boolean) => {
    if (!isSimulatingAction) return '#7f1d1d'; 
    if (color === 'red') return '#ef4444';
    return '#ef4444'; 
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">

        {/* CAJA DE HERRAMIENTAS */}
        <div className={`col-span-1 bg-neutral-900 border-2 rounded-xl p-6 shadow-xl transition-all duration-500 ${isSimulating ? 'opacity-50 pointer-events-none border-neutral-800' : 'border-neutral-700'}`}>
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-700 pb-2">
            <h2 className="text-xl font-semibold">Instrucciones</h2>
          </div>
          
          <div className="bg-pink-950/50 border border-pink-900 p-4 rounded-lg mb-6 flex gap-3">
            <Info className="text-pink-400 shrink-0" />
            <p className="text-sm text-pink-200">
              Necesitamos proteger este circuito de 9V con una resistencia de <strong>330Ω</strong>. <br/><br/>
              Código de colores: <br/>
              <span className="text-orange-400 font-bold">Naranja (3)</span>, <span className="text-orange-400 font-bold">Naranja (3)</span>, <span className="text-amber-600 font-bold">Marrón (x10)</span>.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              {!boardBattery && <DraggableItem item={LEVEL_BATTERY} onDragEnd={handleDragEnd} />}
              {!boardLed && <DraggableItem item={LEVEL_LED} onDragEnd={handleDragEnd} />}
            </div>
            
            {!boardResistor && (
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-wider">Caja de Resistencias</h3>
                <div className="flex flex-wrap gap-4">
                  <DraggableItem item={RES_DISTRACTOR_2} onDragEnd={handleDragEnd} />
                  <DraggableItem item={RES_TARGET} onDragEnd={handleDragEnd} />
                  <DraggableItem item={RES_DISTRACTOR_1} onDragEnd={handleDragEnd} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLERO */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <CircuitBoard dropZoneRef={dummyBoardRef} isSimulating={isSimulating} simulationState={simulationState} ledPolarity={boardLed?.polarity}>
            
            {/* ZONA BATERÍA */}
            <div ref={batZoneRef} className={`absolute left-[2%] top-1/2 -translate-y-1/2 w-24 h-32 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardBattery ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
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

            {/* ZONA RESISTENCIA */}
            <div ref={resZoneRef} className={`absolute top-[2%] left-1/2 -translate-x-1/2 w-36 h-20 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardResistor ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardResistor && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative drop-shadow-xl">
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="120" height="120" className="transform -translate-y-4">
                        <line x1="0" y1="50" x2="100" y2="50" stroke="silver" strokeWidth="6"/>
                        <rect x="20" y="35" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2"/>
                        <rect x="28" y="35" width="5" height="30" fill={boardResistor.bands?.[0] || "#f44336"}/> 
                        <rect x="40" y="35" width="5" height="30" fill={boardResistor.bands?.[1] || "#9c27b0"}/> 
                        <rect x="52" y="35" width="5" height="30" fill={boardResistor.bands?.[2] || "#795548"}/> 
                        <rect x="68" y="35" width="5" height="30" fill={boardResistor.bands?.[3] || "#ffd700"}/> 
                     </svg>
                     <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-amber-200 bg-black/80 px-2 py-1 rounded">{boardResistor.label}</div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ZONA LED */}
            <div ref={ledZoneRef} className={`absolute right-[4%] top-1/2 -translate-y-1/2 w-24 h-24 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardLed ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardLed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <div 
                      className={`relative w-20 h-20 transition-all duration-300 z-10 ${simulationState === 'idle' || simulationState === 'off' ? 'drop-shadow-lg' : ''}`}
                      style={{
                        filter: (simulationState === 'perfect' || simulationState === 'burned') 
                          ? `drop-shadow(0px 0px ${simulationState === 'perfect' ? '20px' : '40px'} ${getLedFillColor(boardLed.color, true)})` 
                          : 'none'
                      }}
                    >
                      <svg viewBox="0 0 100 100" width="100%" height="100%" className={`${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
                        <g transform="rotate(90 50 50)">
                          <path d="M 85 25 A 40 40 0 1 0 85 75 Z" 
                            fill={simulationState === 'burned' ? '#fbbf24' : getLedFillColor(boardLed.color, simulationState === 'perfect')} 
                            stroke="#111" strokeWidth="4"
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
                    simulationState === 'burned' ? 'bg-red-950/80 text-red-300 border-red-800' :
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