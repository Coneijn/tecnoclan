'use client';

import React, { useState, useRef } from 'react';
import { Play, RotateCw, BookOpen, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import DraggableItem from '../ui/DraggableItem';
import CircuitBoard from '../ui/CircuitBoard';

const LEVEL_BATTERY: CircuitComponent = { id: 'bat-9v', type: 'battery', value: 9, label: '9V' };
const LEVEL_RESISTOR: CircuitComponent = { id: 'res-330', type: 'resistor', value: 330, label: '330Ω' };
const LED_CORRECT: LedComponent = { id: 'led-correct', type: 'led', polarity: 'correct', color: 'red' }; 
const LED_REVERSED: LedComponent = { id: 'led-reversed', type: 'led', polarity: 'reversed', color: 'red' }; 

export default function Level8() {
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
      setFeedbackMsg('Completa el diagrama esquemático.');
      return;
    }

    setIsSimulating(true);
    setSimulationState('idle');
    setFeedbackMsg('');

    setTimeout(() => {
      if (boardLed.polarity === 'reversed') {
        setSimulationState('blocked');
        setFeedbackMsg('El símbolo del diodo tiene una línea recta que representa el cátodo (-). ¡Lo conectaste al revés!');
      } else {
        setSimulationState('perfect');
        setFeedbackMsg('¡Perfecto! Ya estás leyendo diagramas como todo un profesional.');
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
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-700 pb-2">
            <h2 className="text-xl font-semibold">De lo Físico al Papel</h2>
          </div>
          
          <div className="bg-cyan-950/50 border border-cyan-900 p-4 rounded-lg mb-6 flex flex-col gap-3">
            <div className="flex items-center gap-2 text-cyan-300 font-bold border-b border-cyan-800/50 pb-2">
              <BookOpen size={18} /> Diagramas Esquemáticos
            </div>
            <p className="text-sm text-cyan-200">
              En la electrónica profesional usamos símbolos abstractos para diseñar circuitos rápidamente. <br/><br/>
              Arrastra tus componentes físicos hacia el tablero para descubrir cómo se dibujan en un diagrama real.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              {!boardBattery && <DraggableItem item={LEVEL_BATTERY} onDragEnd={handleDragEnd} />}
              {!boardResistor && <DraggableItem item={LEVEL_RESISTOR} onDragEnd={handleDragEnd} />}
            </div>
            
            {!boardLed && (
              <div className="pt-4 border-t border-neutral-800">
                <h3 className="text-xs font-bold text-neutral-500 mb-4 uppercase tracking-wider">LEDs (Cuida la polaridad)</h3>
                <div className="flex flex-wrap gap-4">
                  <DraggableItem item={LED_CORRECT} onDragEnd={handleDragEnd} />
                  <DraggableItem item={LED_REVERSED} onDragEnd={handleDragEnd} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLERO (MODO ESQUEMÁTICO) */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <CircuitBoard dropZoneRef={dummyBoardRef} isSimulating={isSimulating} simulationState={simulationState} ledPolarity={boardLed?.polarity}>
            
            {/* ZONA BATERÍA (Símbolo Esquemático) */}
            <div ref={batZoneRef} className={`absolute left-[2%] top-1/2 -translate-y-1/2 w-24 h-32 z-10 flex flex-col items-center justify-center rounded-xl transition-colors ${!boardBattery ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardBattery && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center bg-neutral-900/50 p-2 rounded">
                     <div className="text-blue-400 font-bold mb-1 text-sm">{boardBattery.label}</div>
                     <svg viewBox="0 0 100 100" className="w-8 h-8 stroke-blue-500 mb-12">
                       <line x1="50" y1="100" x2="50" y2="20" strokeWidth="8"/>
                       <polygon points="50,0 20,40 80,40" fill="currentColor"/>
                     </svg>
                     <svg viewBox="0 0 100 100" className="w-10 h-10 stroke-blue-500">
                       <line x1="50" y1="0" x2="50" y2="60" strokeWidth="6"/>
                       <line x1="20" y1="60" x2="80" y2="60" strokeWidth="6"/>
                       <line x1="30" y1="75" x2="70" y2="75" strokeWidth="6"/>
                       <line x1="42" y1="90" x2="58" y2="90" strokeWidth="6"/>
                     </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ZONA RESISTENCIA (Símbolo Esquemático) */}
            <div ref={resZoneRef} className={`absolute top-[2%] left-1/2 -translate-x-1/2 w-36 h-20 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardResistor ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardResistor && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center bg-neutral-900 px-4 py-1 rounded">
                     <div className="text-amber-400 font-bold mb-1 text-xs">{boardResistor.label}</div>
                     <svg width="60" height="30" viewBox="0 0 40 20" className="stroke-amber-500 stroke-[3px] fill-none">
                       <path d="M0 10 L5 10 L8 4 L14 16 L20 4 L26 16 L32 4 L35 10 L40 10" />
                     </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ZONA LED (Símbolo Esquemático) */}
            <div ref={ledZoneRef} className={`absolute right-[4%] top-1/2 -translate-y-1/2 w-24 h-24 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardLed ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardLed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-neutral-900 p-2 relative rounded">
                    <svg width="40" height="40" viewBox="0 0 24 24" className={`stroke-red-500 stroke-2 fill-none z-10 relative ${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
                      <path d="M12 2v20M8 8h8l-4 8zM17 5l3 -3M21 7l3 -3" />
                    </svg>
                    <div className={`absolute inset-0 transition-all duration-300 pointer-events-none rounded-full
                      ${simulationState === 'perfect' ? 'shadow-[0_0_30px_rgba(239,68,68,1)] bg-red-500/20' : ''}
                    `} />
                    
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
                    simulationState === 'blocked' ? 'bg-red-950/80 text-red-300 border-red-800' :
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