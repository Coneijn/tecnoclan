'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, X, Calculator } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import CircuitBoard from '../ui/CircuitBoard';
import ArcadeToolbox from '../ArcadeToolbox';
import ProtoboardBackground from '../ui/ProtoboardBackground';

type PlacedComponent = CircuitComponent & { x: number; y: number };
type PlacedLed = LedComponent & { x: number; y: number };

const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 400;
const POS = {
  battery: { x: 50, y: 195 },
  resistor: { x: 260, y: 198 },
  led: { x: 452.5, y: 305 },
};

// Componentes fijos
const BATTERY: CircuitComponent = { id: 'bat-0', type: 'battery', value: 9, label: '9V' };
const LED: LedComponent = { id: 'led-0', type: 'led', polarity: 'correct', color: 'red' };

// Datos del LED para la fórmula
const LED_VOLTAGE = 2; // Vf
const LED_CURRENT = 0.02; // 20mA
const SOURCE_VOLTAGE = 9;

// Valor calculado: R = (9-2)/0.02 = 350Ω
const TARGET_RESISTANCE = 350;

// Opciones de resistencia (incluyendo la correcta 330Ω y otras)
const RESISTORS = [
  { id: 'res-100', type: 'resistor' as const, value: 100, label: '100Ω', bands: ['marrón', 'negro', 'marrón', 'dorado'] },
  { id: 'res-220', type: 'resistor' as const, value: 220, label: '220Ω', bands: ['rojo', 'rojo', 'marrón', 'dorado'] },
  { id: 'res-330', type: 'resistor' as const, value: 330, label: '330Ω', bands: ['naranja', 'naranja', 'marrón', 'dorado'] },
  { id: 'res-470', type: 'resistor' as const, value: 470, label: '470Ω', bands: ['amarillo', 'violeta', 'marrón', 'dorado'] },
  { id: 'res-1k', type: 'resistor' as const, value: 1000, label: '1kΩ', bands: ['marrón', 'negro', 'rojo', 'dorado'] },
];

// Mapeo de colores (para las bandas)
const COLOR_MAP: Record<string, string> = {
  negro: '#000000',
  marrón: '#8B4513',
  rojo: '#FF0000',
  naranja: '#FFA500',
  amarillo: '#FFFF00',
  verde: '#008000',
  azul: '#0000FF',
  violeta: '#8A2BE2',
  gris: '#808080',
  blanco: '#FFFFFF',
  dorado: '#D4AF37',
  plateado: '#C0C0C0',
};

export default function Level6() {
  const [boardBattery, setBoardBattery] = useState<PlacedComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<PlacedComponent | null>(null);
  const [boardLed, setBoardLed] = useState<PlacedLed | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [tutorialMsg, setTutorialMsg] = useState('');
  const [showFormula, setShowFormula] = useState(true); // para colapsar la fórmula
  const dropZoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTutorialMsg(
      `🧮 Usa la Ley de Ohm: R = (V_fuente - V_LED) / I_LED. Calcula la resistencia necesaria para el LED rojo (Vf=${LED_VOLTAGE}V, I=${LED_CURRENT*1000}mA) con una batería de ${SOURCE_VOLTAGE}V. Luego elige la resistencia correcta.`
    );
    const timer = setTimeout(() => setTutorialMsg(''), 6000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTutorial = () => setTutorialMsg('');

  const handleDragEnd = (e: any, info: any, item: CircuitComponent | LedComponent) => {
    if (!dropZoneRef.current) return;
    const rect = dropZoneRef.current.getBoundingClientRect();
    const { x, y } = info.point;
    const inside = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
    if (!inside) return;

    if (item.type === 'battery') {
      setBoardBattery({ ...item, x: POS.battery.x, y: POS.battery.y } as PlacedComponent);
    } else if (item.type === 'resistor') {
      setBoardResistor({ ...item, x: POS.resistor.x, y: POS.resistor.y } as PlacedComponent);
    } else if (item.type === 'led') {
      setBoardLed({ ...item, x: POS.led.x, y: POS.led.y } as PlacedLed);
    }

    setIsSimulating(false);
    setSimulationState('idle');
    setFeedbackMsg('');
    setTutorialMsg('');
  };

  const handlePlay = () => {
    if (!boardLed || !boardBattery) {
      setFeedbackMsg('Necesitas la batería y el LED.');
      return;
    }
    if (!boardResistor) {
      setFeedbackMsg('Coloca una resistencia.');
      return;
    }

    // Verificar que la resistencia sea la correcta (330Ω es la más cercana a 350Ω)
    // Podríamos permitir un margen de ±5%, pero para simplificar, exigimos exactamente 330Ω.
    if (boardResistor.value !== 330) {
      setFeedbackMsg(`❌ Resistencia de ${boardResistor.value}Ω no es la correcta. Debes usar 330Ω (el valor comercial más cercano a 350Ω).`);
      return;
    }

    setIsSimulating(true);
    setSimulationState('idle');
    setFeedbackMsg('');

    setTimeout(() => {
      if (boardLed.polarity === 'reversed') {
        setSimulationState('idle');
        setFeedbackMsg('🔴 LED invertido. Haz clic en él para girarlo.');
        return;
      }
      setSimulationState('perfect');
      setFeedbackMsg(`✅ ¡Correcto! Has calculado y elegido la resistencia de 330Ω. El LED recibe ${((SOURCE_VOLTAGE - LED_VOLTAGE) / 330 * 1000).toFixed(1)}mA.`);
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
    !boardBattery && BATTERY,
    ...(boardResistor ? [] : RESISTORS),
    !boardLed && LED,
  ].filter(Boolean) as (CircuitComponent | LedComponent)[];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      <h2 className="text-lg font-bold text-white/90 text-center">🧮 Nivel 6 – Ley de Ohm</h2>
      <p className="text-xs text-neutral-500 text-center mb-2">
        Calcula la resistencia necesaria para el LED rojo con una batería de 9V.
      </p>

      {/* Panel de la fórmula (colapsable) */}
      <div className="mb-4 bg-neutral-900/90 border border-neutral-700 rounded-xl overflow-hidden">
        <button
          onClick={() => setShowFormula(!showFormula)}
          className="w-full flex items-center justify-between p-3 text-left"
        >
          <span className="text-amber-400 font-mono font-bold flex items-center gap-2">
            <Calculator size={18} /> Fórmula: R = (V_fuente - V_LED) / I_LED
          </span>
          <motion.div animate={{ rotate: showFormula ? 180 : 0 }} transition={{ duration: 0.3 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </motion.div>
        </button>
        <AnimatePresence>
          {showFormula && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-4 border-t border-neutral-800"
            >
              <div className="mt-3 p-3 bg-neutral-800/50 rounded-lg">
                <p className="text-sm text-neutral-300">
                  <span className="text-white font-medium">Datos:</span>
                  <br />
                  V_fuente = {SOURCE_VOLTAGE}V &nbsp;|&nbsp; V_LED = {LED_VOLTAGE}V &nbsp;|&nbsp; I_LED = {LED_CURRENT * 1000}mA
                </p>
                <p className="text-sm text-neutral-300 mt-2">
                  <span className="text-white font-medium">Cálculo:</span>
                  <br />
                  R = ({SOURCE_VOLTAGE} - {LED_VOLTAGE}) / {LED_CURRENT} = {((SOURCE_VOLTAGE - LED_VOLTAGE) / LED_CURRENT).toFixed(0)}Ω
                  <br />
                  <span className="text-amber-400">→ Elige la resistencia comercial más cercana: 330Ω</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <CircuitBoard
        dropZoneRef={dropZoneRef}
        isSimulating={isSimulating}
        simulationState={simulationState}
        ledPolarity={boardLed?.polarity}
      >
        <div className="absolute inset-0 z-0">
          <ProtoboardBackground
            batteryPos={POS.battery}
            resistorPos={POS.resistor}
            ledPos={POS.led}
            showConnections={true}
          />
        </div>

        {/* Componentes colocados (código SVG igual que en niveles anteriores, omitido por brevedad) */}
        {/* ... (batería, resistencia, LED) ... */}
        {/* Usa el mismo código que en Level4 para los SVG, pero asegúrate de que la resistencia dibuje bandas dinámicas */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
          <div className="relative w-full h-full">
            {/* Batería */}
            <div
              className="absolute pointer-events-none transition-all duration-300 ease-out"
              style={{
                left: `${(POS.battery.x / BOARD_WIDTH) * 100}%`,
                top: `${(POS.battery.y / BOARD_HEIGHT) * 100}%`,
                width: '9%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence>
                {boardBattery && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="drop-shadow-2xl w-full">
                    <svg viewBox="0 0 100 160" className="w-full h-auto">
                      <rect x="10" y="10" width="80" height="140" rx="10" fill="#222" stroke="#111" strokeWidth="4" />
                      <rect x="25" y="20" width="50" height="120" rx="5" fill="#444" />
                      <circle cx="50" cy="35" r="8" fill="silver" />
                      <circle cx="50" cy="125" r="8" fill="silver" />
                      <text x="50" y="85" fill="#fbbf24" fontSize="16" fontWeight="bold" textAnchor="middle" transform="rotate(-90 50 85)">
                        {boardBattery.label}
                      </text>
                      <text x="50" y="25" fill="#ef4444" fontSize="20" fontWeight="bold" textAnchor="middle">+</text>
                      <text x="50" y="145" fill="#3b82f6" fontSize="24" fontWeight="bold" textAnchor="middle">-</text>
                    </svg>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Resistencia */}
            <div
              className="absolute pointer-events-none transition-all duration-300 ease-out flex flex-col items-center justify-center"
              style={{
                left: `${(POS.resistor.x / BOARD_WIDTH) * 100}%`,
                top: `${(POS.resistor.y / BOARD_HEIGHT) * 100}%`,
                width: `${(175 / BOARD_WIDTH) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence>
                {boardResistor && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="relative drop-shadow-xl w-full mt-2">
                    <svg viewBox="0 0 175 100" className="w-full h-auto">
                      <line x1="0" y1="50" x2="175" y2="50" stroke="silver" strokeWidth="6" />
                      <rect x="57.5" y="35" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2" />
                      {boardResistor.bands &&
                        boardResistor.bands.map((color, idx) => {
                          const hex = COLOR_MAP[color] || '#888';
                          const xPos = 65.5 + idx * 10;
                          return <rect key={idx} x={xPos} y="35" width="5" height="30" fill={hex} />;
                        })}
                    </svg>
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full text-[10px] md:text-xs font-bold text-amber-200 bg-black/80 px-2 py-0.5 rounded whitespace-nowrap">
                      {boardResistor.label}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* LED */}
            <div
              className="absolute pointer-events-none transition-all duration-300 ease-out flex items-center justify-center"
              style={{
                left: `${(POS.led.x / BOARD_WIDTH) * 100}%`,
                top: `${(POS.led.y / BOARD_HEIGHT) * 100}%`,
                width: `${(210 / BOARD_WIDTH) * 100}%`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <AnimatePresence>
                {boardLed && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="relative w-full h-auto cursor-pointer pointer-events-auto"
                    onClick={() => {
                      if (!isSimulating) {
                        setBoardLed({
                          ...boardLed,
                          polarity: boardLed.polarity === 'correct' ? 'reversed' : 'correct',
                        });
                        setSimulationState('idle');
                        setFeedbackMsg('');
                      }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div
                      className={`relative w-full h-auto transition-all duration-300 ${
                        simulationState === 'perfect'
                          ? 'drop-shadow-[0_0_25px_rgba(239,68,68,1)]'
                          : simulationState === 'exploded'
                          ? 'opacity-0 scale-150'
                          : 'drop-shadow-lg'
                      }`}
                    >
                      <svg viewBox="0 0 210 100" className="w-full h-auto">
                        <g transform={`rotate(${boardLed.polarity === 'reversed' ? 180 : 0} 105 50)`}>
                          <line x1="0" y1="50" x2="210" y2="50" stroke="silver" strokeWidth="6" />
                          <text x="15" y="45" fill="#ef4444" fontSize="18" fontWeight="bold" textAnchor="middle">+</text>
                          <text x="195" y="45" fill="#3b82f6" fontSize="18" fontWeight="bold" textAnchor="middle">−</text>
                          <g transform="translate(55, 0)">
                            <g transform="rotate(0 50 50)">
                              <path
                                d="M 85 25 A 40 40 0 1 0 85 75 Z"
                                fill={
                                  simulationState === 'exploded'
                                    ? '#000'
                                    : simulationState === 'perfect'
                                    ? '#ef4444'
                                    : '#7f1d1d'
                                }
                                stroke="#450a0a"
                                strokeWidth="4"
                              />
                              <rect x="40" y="30" width="20" height="40" fill="rgba(0,0,0,0.3)" rx="2" />
                              <rect x="48" y="20" width="4" height="20" fill="rgba(0,0,0,0.5)" />
                            </g>
                          </g>
                        </g>
                      </svg>
                    </div>
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
                <p className="text-sm md:text-base font-medium leading-relaxed">{tutorialMsg}</p>
              </div>
              <button onClick={dismissTutorial} className="text-blue-400 hover:text-blue-200 transition-colors">
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
                simulationState === 'exploded'
                  ? 'bg-red-950/90 text-red-300 border-red-800/50'
                  : simulationState === 'perfect'
                  ? 'bg-emerald-950/90 text-emerald-300 border-emerald-800/50'
                  : 'bg-neutral-800/90 text-neutral-300 border-neutral-700'
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