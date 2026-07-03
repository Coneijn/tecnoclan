'use client';

import React, { useState, useRef } from 'react';
import { Play, RotateCw, Calculator, EyeOff, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import DraggableItem from '../ui/DraggableItem';
import CircuitBoard from '../ui/CircuitBoard';

// Importamos AMBOS Widgets
import WidgetModalWrapper from '../../Widgets/WidgetModalWrapper';
import ResistorCalculatorWidget from '../../Widgets/ResistorCalculatorWidget';
import CalculatorWidget from '../../Widgets/CalculatorWidget';

const LEVEL_BATTERY: CircuitComponent = { id: 'bat-9v', type: 'battery', value: 9, label: '9V' };
const LEVEL_LED: LedComponent = { id: 'led-7', type: 'led', polarity: 'correct', color: 'red' }; 

// Resistencias SIN valor numérico en la etiqueta
const RES_TARGET: CircuitComponent = { 
  id: 'res-330', type: 'resistor', value: 330, label: '???', 
  bands: ['#f97316', '#f97316', '#795548', '#ffd700'] // Naranja, Naranja, Marrón
};
const RES_DISTRACTOR_1: CircuitComponent = { 
  id: 'res-100', type: 'resistor', value: 100, label: '???', 
  bands: ['#795548', '#000000', '#795548', '#ffd700'] // Marrón, Negro, Marrón
};
const RES_DISTRACTOR_2: CircuitComponent = { 
  id: 'res-1k', type: 'resistor', value: 1000, label: '???', 
  bands: ['#795548', '#000000', '#ef4444', '#ffd700'] // Marrón, Negro, Rojo
};

export default function Level7() {
  const [boardBattery, setBoardBattery] = useState<CircuitComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<CircuitComponent | null>(null);
  const [boardLed, setBoardLed] = useState<LedComponent | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  
  // Estados para el modal de herramientas
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<'math' | 'resistor'>('math'); // Controla qué calculadora se muestra

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
      if (boardResistor.value === 100) {
        setSimulationState('exploded');
        setFeedbackMsg('¡BOOM! Elegiste Marrón-Negro-Marrón (100Ω). Demasiada corriente (70mA).');
      } else if (boardResistor.value === 1000) {
        setSimulationState('off');
        setFeedbackMsg('Elegiste Marrón-Negro-Rojo (1kΩ). Poca corriente (7mA), el LED no brilla bien.');
      } else {
        setSimulationState('perfect');
        setFeedbackMsg('¡Maestría pura! Calculaste 350Ω y elegiste la Naranja-Naranja-Marrón (330Ω) solo viéndola.');
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
    return '#ef4444'; 
  };

  return (
    <div className="p-4 md:p-8 flex flex-col items-center relative">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-6xl">

        {/* CAJA DE HERRAMIENTAS */}
        <div className={`col-span-1 bg-neutral-900 border-2 rounded-xl p-6 shadow-xl transition-all duration-500 ${isSimulating ? 'opacity-50 pointer-events-none border-neutral-800' : 'border-neutral-700'}`}>
          <div className="flex items-center gap-2 mb-2 border-b border-neutral-700 pb-2">
            <h2 className="text-xl font-semibold">El Reto Final Físico</h2>
          </div>
          
          <div className="bg-teal-950/50 border border-teal-900 p-4 rounded-lg mb-6 flex flex-col gap-4">
            
            {/* Fórmula estilo Fracción */}
            <div className="flex items-center gap-3 text-teal-300 font-bold border-b border-teal-800/50 pb-3">
              <EyeOff size={20} /> 
              <div className="flex items-center gap-2 text-lg">
                <span>R =</span>
                <div className="flex flex-col items-center leading-none">
                  <span className="border-b-2 border-teal-400 px-2 pb-1">V - V_led</span>
                  <span className="pt-1">I</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-teal-200">
              Ya conoces la fórmula y los valores: <br/><br/>
              • V = 9V, V_led = 2V, I = 0.02A.<br/><br/>
              Calcula el valor ideal y encuentra la resistencia correcta <strong>leyendo solo sus bandas de colores</strong>.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex gap-4 items-start">
              {!boardBattery && <DraggableItem item={LEVEL_BATTERY} onDragEnd={handleDragEnd} />}
              {!boardLed && <DraggableItem item={LEVEL_LED} onDragEnd={handleDragEnd} />}
            </div>
            
            {!boardResistor && (
              <div className="pt-4 border-t border-neutral-800">
                
                {/* Título de Caja de Resistencias + Triangulito Multiherramienta */}
                <div className="flex items-center gap-3 mb-4">
                  <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-0">Caja de Resistencias</h3>
                  
                  <button 
                    onClick={() => setIsCalcOpen(true)}
                    className="group relative flex items-center justify-center text-neutral-500 hover:text-teal-400 transition-colors"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transform rotate-90">
                      <polygon points="5 3 19 12 5 21 5 3"></polygon>
                    </svg>
                    {/* Tooltip Hover actualizado */}
                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-max bg-neutral-800 text-xs text-white px-2 py-1 rounded shadow-lg border border-neutral-700 z-50">
                      Abrir Herramientas de Cálculo
                    </span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-4">
                  <DraggableItem item={RES_TARGET} onDragEnd={handleDragEnd} />
                  <DraggableItem item={RES_DISTRACTOR_2} onDragEnd={handleDragEnd} />
                  <DraggableItem item={RES_DISTRACTOR_1} onDragEnd={handleDragEnd} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* TABLERO */}
        <div className="col-span-1 lg:col-span-2 flex flex-col">
          <CircuitBoard dropZoneRef={dummyBoardRef} isSimulating={isSimulating} simulationState={simulationState} ledPolarity={boardLed?.polarity}>
            
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

            <div ref={ledZoneRef} className={`absolute right-[4%] top-1/2 -translate-y-1/2 w-24 h-24 z-10 flex items-center justify-center rounded-xl transition-colors ${!boardLed ? 'border-2 border-dashed border-neutral-600 bg-neutral-800/30' : ''}`}>
              <AnimatePresence>
                {boardLed && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative">
                    <div 
                      className={`relative w-20 h-20 transition-all duration-300 z-10 ${simulationState === 'idle' || simulationState === 'off' ? 'drop-shadow-lg' : ''} ${simulationState === 'exploded' ? 'scale-150 opacity-0' : ''}`}
                      style={{
                        filter: simulationState === 'perfect' 
                          ? `drop-shadow(0px 0px 20px ${getLedFillColor(boardLed.color, true)})` 
                          : 'none'
                      }}
                    >
                      <svg viewBox="0 0 100 100" width="100%" height="100%" className={`${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
                        <g transform="rotate(90 50 50)">
                          <path d="M 85 25 A 40 40 0 1 0 85 75 Z" 
                            fill={simulationState === 'exploded' ? '#000' : getLedFillColor(boardLed.color, simulationState === 'perfect')} 
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

      {/* Modal Multiherramienta */}
      <WidgetModalWrapper isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} isModal={true}>
        
        {/* Selector de Pestañas (Tabs) */}
        <div className="flex justify-center mb-6">
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
            <button 
              onClick={() => setActiveTool('math')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTool === 'math' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Calculator size={16} /> Matemática
            </button>
            <button 
              onClick={() => setActiveTool('resistor')}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTool === 'resistor' ? 'bg-white shadow text-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Palette size={16} /> Colores
            </button>
          </div>
        </div>

        {/* Cabecera inyectada en el modal (siempre visible para ayudar como referencia) */}
        <div className="mb-4 p-4 bg-teal-50 border border-teal-100 rounded-xl text-center shadow-sm">
          <p className="text-xs font-bold text-teal-600 uppercase tracking-wider mb-2">Valores del circuito actual</p>
          <div className="flex items-center justify-center gap-3 font-mono text-xl text-teal-900 font-bold">
            <span>R =</span>
            <div className="flex flex-col items-center leading-none">
              <span className="border-b-2 border-teal-900 px-3 pb-1">9 - 2</span>
              <span className="pt-1">0.02</span>
            </div>
          </div>
        </div>
        
        {/* Renderizado condicional del Widget según la pestaña seleccionada */}
        <div className="transition-all duration-300">
          {activeTool === 'math' ? <CalculatorWidget /> : <ResistorCalculatorWidget />}
        </div>

      </WidgetModalWrapper>

    </div>
  );
}