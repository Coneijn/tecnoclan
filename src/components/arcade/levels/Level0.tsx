'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import CircuitBoard from '../ui/CircuitBoard';
import ArcadeToolbox from '../ArcadeToolbox';
import ProtoboardBackground from '../ui/ProtoboardBackground';

// ------------------ TIPOS EXTENDIDOS PARA POSICIÓN ------------------
type PlacedComponent = CircuitComponent & { x: number; y: number };
type PlacedLed = LedComponent & { x: number; y: number };

// ------------------ PARÁMETROS DE LA PROTOBOARD ------------------
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 400;

// Posiciones exactas alineadas a la nueva cuadrícula de la Mini Protoboard
const POS = {
  battery: { x: 50, y: 195 },    
  resistor: { x: 260, y: 198 },  // Centro exacto entre A2 (172.5) y A7 (347.5)
  led: { x: 452.5, y: 305 },     // Centro exacto entre D7 (347.5) y D13 (557.5)
};

// ------------------ COMPONENTES DISPONIBLES ------------------
const LEVEL_BATTERY: CircuitComponent = { id: 'bat-0', type: 'battery', value: 9, label: '9V' };
const LEVEL_RESISTOR: CircuitComponent = { id: 'res-0', type: 'resistor', value: 330, label: '330Ω' };
const LEVEL_LED: LedComponent = { id: 'led-0', type: 'led', polarity: 'correct', color: 'red' };

export default function Level0() {
  const [boardBattery, setBoardBattery] = useState<PlacedComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<PlacedComponent | null>(null);
  const [boardLed, setBoardLed] = useState<PlacedLed | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [tutorialMsg, setTutorialMsg] = useState('');
  const [tutorialDismissed, setTutorialDismissed] = useState(false);
  const [hasStartedPlaying, setHasStartedPlaying] = useState(false);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const showTimer = setTimeout(() => {
      setTutorialMsg(
        '🧩 Arrastra la batería, el LED y la resistencia al tablero. ' +
        '¡Si olvidas la resistencia el LED explotará!'
      );
    }, 300);

    const hideTimer = setTimeout(() => {
      setTutorialMsg('');
      setTutorialDismissed(true);
    }, 5300);

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const dismissTutorial = () => {
    setTutorialMsg('');
    setTutorialDismissed(true);
  };

  const handleDragEnd = (e: any, info: any, item: CircuitComponent | LedComponent) => {
    if (!dropZoneRef.current) return;

    const boardRect = dropZoneRef.current.getBoundingClientRect();
    const pointerX = info.point.x;
    const pointerY = info.point.y;

    const isInsideDropZone =
      pointerX >= boardRect.left &&
      pointerX <= boardRect.right &&
      pointerY >= boardRect.top &&
      pointerY <= boardRect.bottom;

    if (isInsideDropZone) {
      if (item.type === 'led') {
        setBoardLed({ ...item, x: POS.led.x, y: POS.led.y } as PlacedLed);
      } else if (item.type === 'battery') {
        setBoardBattery({ ...item, x: POS.battery.x, y: POS.battery.y } as PlacedComponent);
      } else if (item.type === 'resistor') {
        setBoardResistor({ ...item, x: POS.resistor.x, y: POS.resistor.y } as PlacedComponent);
      }

      setIsSimulating(false);
      setSimulationState('idle');
      setFeedbackMsg('');
      setHasStartedPlaying(true);
      setTutorialMsg('');
      setTutorialDismissed(true);
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
        setFeedbackMsg(
          '¡BOOM! Sin resistencia, la energía destruyó el LED. ¡Limpia el tablero e intenta colocarla!'
        );
      } else {
        setSimulationState('perfect');
        setFeedbackMsg(
          '¡Excelente! La resistencia protegió el LED y el circuito funciona perfectamente.'
        );
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

  const availableItems = [
    !boardBattery && LEVEL_BATTERY,
    !boardResistor && LEVEL_RESISTOR,
    !boardLed && LEVEL_LED,
  ].filter(Boolean) as (CircuitComponent | LedComponent)[];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      <div className="w-full mb-2 mt-1 text-center">
        <h2 className="text-lg md:text-xl font-bold text-white/90 tracking-tight">
          ⚡ Circuito Básico
        </h2>
        <p className="text-xs text-neutral-500 mt-1">
          Arrastra los componentes al tablero y presiona Simular
        </p>
      </div>

      <CircuitBoard
        dropZoneRef={dropZoneRef}
        isSimulating={isSimulating}
        simulationState={simulationState}
        ledPolarity={boardLed?.polarity}
      >
        {/* FONDO: z-0 */}
        <div className="absolute inset-0 z-0">
          <ProtoboardBackground
            batteryPos={POS.battery}
            resistorPos={POS.resistor}
            ledPos={POS.led}
            showConnections={true}
          />
        </div>

    {/* COMPONENTES: z-50 para garantizar que estén encima del fondo */}
<div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
  
  {/* Contenedor relativo que copia el tamaño de la protoboard */}
  <div className="relative w-full h-full">
    
    {/* Batería */}
    <div
      className="absolute pointer-events-none transition-all duration-300 ease-out"
      style={{
        left: `${(POS.battery.x / BOARD_WIDTH) * 100}%`,
        top: `${(POS.battery.y / BOARD_HEIGHT) * 100}%`,
        width: '9%', // Ancho relativo fluido, sin clases fijas
        transform: 'translate(-50%, -50%)'
      }}
    >
      <AnimatePresence>
        {boardBattery && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="drop-shadow-2xl w-full">
            <svg viewBox="0 0 100 160" className="w-full h-auto">
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

    {/* Resistencia (A2 a A7) */}
    <div
      className="absolute pointer-events-none transition-all duration-300 ease-out flex flex-col items-center justify-center"
      style={{
        left: `${(POS.resistor.x / BOARD_WIDTH) * 100}%`,
        top: `${(POS.resistor.y / BOARD_HEIGHT) * 100}%`,
        width: `${(175 / BOARD_WIDTH) * 100}%`, // 175 unidades exactas físicas
        transform: 'translate(-50%, -50%)'
      }}
    >
      <AnimatePresence>
        {boardResistor && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative drop-shadow-xl w-full mt-2">
            {/* viewBox ancho=175. Las patitas tocan exactamente x=0 y x=175 */}
            <svg viewBox="0 0 175 100" className="w-full h-auto">
              <line x1="0" y1="50" x2="175" y2="50" stroke="silver" strokeWidth="6"/>
              {/* Cuerpo centrado matemáticamente */}
              <rect x="57.5" y="35" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2"/>
              <rect x="65.5" y="35" width="5" height="30" fill="#f44336"/> 
              <rect x="77.5" y="35" width="5" height="30" fill="#9c27b0"/> 
              <rect x="89.5" y="35" width="5" height="30" fill="#795548"/> 
              <rect x="105.5" y="35" width="5" height="30" fill="#ffd700"/> 
            </svg>
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-[10px] md:text-xs font-bold text-amber-200 bg-black/80 px-2 py-0.5 rounded whitespace-nowrap">
              {boardResistor.label}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

    {/* LED (D7 a D13) */}
    <div
      className="absolute pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
      style={{
        left: `${(POS.led.x / BOARD_WIDTH) * 100}%`,
        top: `${(POS.led.y / BOARD_HEIGHT) * 100}%`,
        width: `${(210 / BOARD_WIDTH) * 100}%`, // 210 unidades exactas físicas
        transform: 'translate(-50%, -50%)'
      }}
    >
      <AnimatePresence>
        {boardLed && (
          <motion.div 
            initial={{ scale: 0 }} 
            animate={{ scale: 1 }} 
            exit={{ scale: 0 }}
            className={`relative w-full h-auto transition-all duration-300 ${
              simulationState === 'perfect' ? 'drop-shadow-[0_0_25px_rgba(239,68,68,1)]' :
              simulationState === 'exploded' ? 'opacity-0 scale-150 transition-all duration-100' : 'drop-shadow-lg'
            }`}
          >
            {/* viewBox ancho=210. Se agregan patitas al LED para que toque visiblemente los huecos */}
            <svg viewBox="0 0 210 100" className={`w-full h-auto ${boardLed.polarity === 'reversed' ? 'transform rotate-180' : ''}`}>
              <line x1="0" y1="50" x2="210" y2="50" stroke="silver" strokeWidth="6"/>
              
              <g transform="translate(55, 0)">
                <g transform="rotate(0 50 50)">
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
              </g>
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>

  </div>
</div>
      </CircuitBoard>

      <div className="mt-4 flex flex-col items-center gap-3 z-50 shrink-0 relative">
        <div className="flex gap-3 w-full justify-center">
          <button 
            onClick={handlePlay} 
            disabled={isSimulating && simulationState === 'idle'} 
            className="flex-1 max-w-[200px] flex justify-center items-center gap-2 px-4 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold shadow-lg shadow-emerald-900/20 transition-all active:scale-95 disabled:opacity-50 text-sm md:text-base"
          >
            <Play size={18} fill="currentColor" /> Simular
          </button>
          
          <button 
            onClick={handleReset} 
            className="flex justify-center items-center px-4 py-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-xl font-semibold transition-all border border-neutral-700 active:scale-95"
            aria-label="Limpiar tablero"
          >
            <RotateCw size={18} />
          </button>
        </div>

        <AnimatePresence>
          {tutorialMsg ? (
            <motion.div
              key="tutorial"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md p-3 md:p-4 rounded-xl bg-blue-950/90 text-blue-200 border border-blue-700/50 shadow-2xl flex items-start gap-3"
            >
              <span className="text-2xl">💡</span>
              <div className="flex-1">
                <p className="text-sm md:text-base font-medium leading-relaxed">
                  {tutorialMsg}
                </p>
              </div>
              <button
                onClick={dismissTutorial}
                className="text-blue-400 hover:text-blue-200 transition-colors"
                aria-label="Cerrar instrucciones"
              >
                <X size={18} />
              </button>
            </motion.div>
          ) : feedbackMsg ? (
            <motion.div
              key="feedback"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`w-full max-w-md text-center p-3 md:p-4 rounded-xl text-sm md:text-base font-medium border shadow-2xl ${
                simulationState === 'exploded' ? 'bg-red-950/90 text-red-300 border-red-800/50' :
                simulationState === 'perfect' ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/50' :
                'bg-neutral-800/90 text-neutral-300 border-neutral-700'
              }`}
            >
              {feedbackMsg}
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ArcadeToolbox 
        availableItems={availableItems} 
        onDragEnd={handleDragEnd}
        disabled={isSimulating}
      />
    </div>
  );
}