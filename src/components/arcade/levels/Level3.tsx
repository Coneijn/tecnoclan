'use client';

import React, { useState, useRef } from 'react';
import { Play, RotateCw, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import DraggableItem from '../ui/DraggableItem';
import CircuitBoard from '../ui/CircuitBoard';

const LEVEL_BATTERY: CircuitComponent = { id: 'bat-3', type: 'battery', value: 9, label: '9V' };
const LEVEL_RESISTOR: CircuitComponent = { id: 'res-3', type: 'resistor', value: 330, label: '330Ω' };

// Distractores (El objetivo es el VERDE)
const LED_TARGET: LedComponent = { id: 'led-green', type: 'led', polarity: 'correct', color: 'green' }; 
const LED_DISTRACTOR_1: LedComponent = { id: 'led-red', type: 'led', polarity: 'correct', color: 'red' }; 
const LED_DISTRACTOR_2: LedComponent = { id: 'led-blue-rev', type: 'led', polarity: 'reversed', color: 'blue' }; 

export default function Level3() {
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
      if (boardLed.color !== 'green') {
        setSimulationState('wrong_color');
        setFeedbackMsg('¡El circuito funciona, pero instalaste el color equivocado! Se solicitó un LED VERDE.');
      } else if (boardLed.polarity === 'reversed') {
        setSimulationState('blocked');
        setFeedbackMsg('El LED verde es el correcto, pero está al revés. La energía está bloqueada.');
      } else {
        setSimulationState('perfect');
        setFeedbackMsg('¡Excelente trabajo! Ignoraste los distractores e instalaste el componente correcto.');
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
    if (!isSimulatingAction) {
      // Colores apagados (oscuros) según el color del LED
      if (color === 'green') return '#14532d';
      if (color === 'blue') return '#1e3a8a';
      if (color === 'yellow') return '#713f12';
      if (color === 'orange') return '#7c2d12';
      if (color === 'white') return '#4b5563';
      return '#7f1d1d'; // default dark red
    }
    // Colores encendidos (brillantes)
    if (color === 'green') return '#22c55e';
    if (color === 'blue') return '#3b82f6';
    if (color === 'yellow') return '#eab308';
    if (color === 'orange') return '#f97316';
    if (color === 'white') return '#f3f4f6';
    return '#ef4444'; // default red
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">

        {/* CAJA DE HERRAMIENTAS */}
        <div className={`col-span-1 bg-neutral-900 border-2 rounded-xl p-6 shadow-xl transition-all duration-500 ${isSimulating ? 'opacity-50 pointer-events-none border-neutral-800' : 'border-neutral-700'}`}>
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-700 pb-2">
            <h2 className="text-xl font-semibold">Instrucciones</h2>
          </div>
          
          <div className="bg-blue-950/50 border border-blue-900 p-4 rounded-lg mb-6 flex gap-3">
            <Info className="text-blue-400 shrink-0" />
            <p className="text-sm text-blue-200">
              Instala un <strong>LED VERDE</strong> en el circuito. Ten cuidado con los componentes falsos y recuerda verificar la polaridad.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              {!boardBattery && <DraggableItem item={LEVEL_BATTERY} onDragEnd={handleDragEnd} />}
              {!boardResistor && <DraggableItem item={LEVEL_RESISTOR} onDragEnd={handleDragEnd} />}
            </div>
            
            {!boardLed && (
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-wider">Caja de LEDs</h3>
                <div className="flex flex-wrap gap-4">
                  <DraggableItem item={LED_DISTRACTOR_1} onDragEnd={handleDragEnd} />
                  <DraggableItem item={LED_TARGET} onDragEnd={handleDragEnd} />
                  <DraggableItem item={LED_DISTRACTOR_2} onDragEnd={handleDragEnd} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLERO */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <CircuitBoard
            dropZoneRef={dummyBoardRef}
            isSimulating={isSimulating}
            simulationState={simulationState}
            ledPolarity={boardLed?.polarity}
          >
            {/* ZONA DE LA BATERÍA */}
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

            {/* ZONA DE LA RESISTENCIA */}
            <div ref={resZoneRef} className={`absolute top-[2%] left-1/2 -translate-x-1/2 w-36 h-20 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardResistor ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
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

            {/* ZONA DEL LED */}
            <div ref={ledZoneRef} className={`absolute right-[4%] top-1/2 -translate-y-1/2 w-24 h-24 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardLed ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardLed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <div 
                      className={`relative w-20 h-20 transition-all duration-300 z-10 ${simulationState === 'idle' ? 'drop-shadow-lg' : ''}`}
                      style={{
                        filter: (simulationState === 'perfect' || simulationState === 'wrong_color') 
                          ? `drop-shadow(0px 0px 20px ${getLedFillColor(boardLed.color, true)})` 
                          : 'none'
                      }}
                    >
                      <svg viewBox="0 0 100 100" width="100%" height="100%" className={`${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
                        <g transform="rotate(90 50 50)">
                          <path d="M 85 25 A 40 40 0 1 0 85 75 Z" 
                            fill={getLedFillColor(boardLed.color, simulationState === 'perfect' || simulationState === 'wrong_color')} 
                            stroke="#111" strokeWidth="4"
                          />
                          <rect x="40" y="30" width="20" height="40" fill="rgba(0,0,0,0.3)" rx="2"/>
                          <rect x="48" y="20" width="4" height="20" fill="rgba(0,0,0,0.5)"/>
                        </g>
                      </svg>
                    </div>

                       {simulationState === 'blocked' && (
                         <motion.div initial={{ opacity: 0, scale: 0.5, x: -20 }} animate={{ opacity: 1, scale: 1, x: 0 }}
                           className="absolute top-1/2 right-full mr-4 -translate-y-1/2 bg-red-600 text-white text-xs font-bold px-3 py-2 rounded-lg whitespace-nowrap shadow-lg flex items-center gap-1"
                         >
                           <AlertCircle size={14} /> ¡Sentido contrario!
                         </motion.div>
                       )}
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
                    simulationState === 'blocked' || simulationState === 'wrong_color' ? 'bg-amber-950/80 text-amber-300 border-amber-800' :
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