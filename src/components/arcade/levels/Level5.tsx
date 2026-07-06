'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CircuitComponent, LedComponent, SimulationState } from '../types';
import CircuitBoard from '../ui/CircuitBoard';
import ArcadeToolbox from '../ArcadeToolbox';
import ProtoboardBackground from '../ui/ProtoboardBackground';

// ---------- TIPOS ----------
type PlacedComponent = CircuitComponent & { x: number; y: number };
type PlacedLed = LedComponent & { x: number; y: number };

// ---------- CONSTANTES ----------
const BOARD_WIDTH = 800;
const BOARD_HEIGHT = 400;
const POS = {
  battery: { x: 50, y: 195 },
  resistor: { x: 260, y: 198 },
  led: { x: 452.5, y: 305 },
};

// NUEVA BATERÍA DE 5V (en lugar de 9V)
const BATTERY: CircuitComponent = { id: 'bat-0', type: 'battery', value: 5, label: '5V' };
const LED: LedComponent = { id: 'led-0', type: 'led', polarity: 'correct', color: 'red' };

// Mapeo de colores a códigos hexadecimales
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

// Resistencias: incluir la de 150Ω y distractores
const RESISTORS = [
  {
    id: 'res-150',
    type: 'resistor' as const,
    value: 150,
    label: '150Ω',
    bands: ['marrón', 'verde', 'marrón', 'dorado'], // 15×10 = 150
  },
  {
    id: 'res-330',
    type: 'resistor' as const,
    value: 330,
    label: '330Ω',
    bands: ['naranja', 'naranja', 'marrón', 'dorado'], // 33×10 = 330
  },
  {
    id: 'res-100',
    type: 'resistor' as const,
    value: 100,
    label: '100Ω',
    bands: ['marrón', 'negro', 'marrón', 'dorado'], // 10×10 = 100
  },
  {
    id: 'res-1k',
    type: 'resistor' as const,
    value: 1000,
    label: '1kΩ',
    bands: ['marrón', 'negro', 'rojo', 'dorado'], // 10×100 = 1000
  },
];

// Datos para el modal de ayuda (igual que antes)
const COLOR_INFO: Record<string, { digit?: number; multiplier?: number; tolerance?: number }> = {
  negro: { digit: 0, multiplier: 1 },
  marrón: { digit: 1, multiplier: 10 },
  rojo: { digit: 2, multiplier: 100 },
  naranja: { digit: 3, multiplier: 1000 },
  amarillo: { digit: 4, multiplier: 10000 },
  verde: { digit: 5, multiplier: 100000 },
  azul: { digit: 6, multiplier: 1000000 },
  violeta: { digit: 7, multiplier: 10000000 },
  gris: { digit: 8, multiplier: 100000000 },
  blanco: { digit: 9, multiplier: 1000000000 },
  dorado: { multiplier: 0.1, tolerance: 5 },
  plateado: { multiplier: 0.01, tolerance: 10 },
};

// ---------- COMPONENTE PRINCIPAL ----------
export default function Level5() {
  const [boardBattery, setBoardBattery] = useState<PlacedComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<PlacedComponent | null>(null);
  const [boardLed, setBoardLed] = useState<PlacedLed | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [tutorialMsg, setTutorialMsg] = useState('');
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const [selectedResistor, setSelectedResistor] = useState<typeof RESISTORS[0] | null>(null);

  useEffect(() => {
    setTutorialMsg(
      '🔋 La batería ahora es de 5V. El LED rojo necesita 2V y 20mA. ' +
      'Calcula la resistencia necesaria y elige la correcta (pista: 150Ω).'
    );
    const timer = setTimeout(() => setTutorialMsg(''), 6000);
    return () => clearTimeout(timer);
  }, []);

  const dismissTutorial = () => setTutorialMsg('');

  // Manejo de arrastre
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

  const handleResistorClick = (item: CircuitComponent | LedComponent) => {
    if (item.type === 'resistor') {
      const found = RESISTORS.find(r => r.id === item.id);
      if (found) setSelectedResistor(found);
    }
  };

  // Simulación
  const handlePlay = () => {
    if (!boardLed || !boardBattery) {
      setFeedbackMsg('Necesitas la batería y el LED.');
      return;
    }
    if (!boardResistor) {
      setFeedbackMsg('Coloca una resistencia.');
      return;
    }

    // La resistencia correcta ahora es 150Ω (para 5V)
    if (boardResistor.value !== 150) {
      setFeedbackMsg(
        `❌ Resistencia de ${boardResistor.value}Ω no es la correcta. ` +
        `Con 5V necesitas 150Ω (cálculo: (5V - 2V) / 0.02A = 150Ω).`
      );
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
      setFeedbackMsg('✅ ¡Correcto! La resistencia de 150Ω es la adecuada para 5V.');
    }, 1500);
  };

  const handleReset = () => {
    setBoardBattery(null);
    setBoardResistor(null);
    setBoardLed(null);
    setIsSimulating(false);
    setSimulationState('idle');
    setFeedbackMsg('');
    setSelectedResistor(null);
  };

  const availableItems = [
    !boardBattery && BATTERY,
    ...(boardResistor ? [] : RESISTORS),
    !boardLed && LED,
  ].filter(Boolean) as (CircuitComponent | LedComponent)[];

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      <h2 className="text-lg font-bold text-white/90 text-center">🔋 Nivel 5 – Cambio de voltaje</h2>
      <p className="text-xs text-neutral-500 text-center mb-2">
        Batería de 5V. Encuentra la resistencia correcta (150Ω).
      </p>

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

        {/* Componentes colocados (igual que en niveles anteriores) */}
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

      {/* Botones y feedback */}
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

      {/* Caja de herramientas */}
      <ArcadeToolbox
        availableItems={availableItems}
        onDragEnd={handleDragEnd}
        onItemClick={handleResistorClick}
        disabled={isSimulating}
      />

      {/* MODAL DE AYUDA PARA RESISTENCIA (igual que en Nivel 4) */}
      <AnimatePresence>
        {selectedResistor && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={() => setSelectedResistor(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-neutral-900 rounded-2xl p-6 max-w-md w-full border border-neutral-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-white">Código de colores</h3>
                <button onClick={() => setSelectedResistor(null)} className="text-neutral-400 hover:text-white">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-neutral-300 text-sm">
                  <span className="font-semibold text-white">Resistencia:</span> {selectedResistor.label}
                </p>
                <p className="text-neutral-300 text-sm">
                  <span className="font-semibold text-white">Bandas:</span>
                </p>
              </div>

              <div className="bg-neutral-800 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-700">
                      <th className="p-2 text-left text-neutral-400">Color</th>
                      <th className="p-2 text-center text-neutral-400">Dígito</th>
                      <th className="p-2 text-center text-neutral-400">Multiplicador</th>
                      <th className="p-2 text-center text-neutral-400">Tolerancia</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResistor.bands.map((color, idx) => {
                      const info = COLOR_INFO[color];
                      return (
                        <tr key={idx} className="border-b border-neutral-700/50 last:border-0">
                          <td className="p-2 flex items-center gap-2">
                            <span
                              className="inline-block w-4 h-4 rounded-full border border-neutral-600"
                              style={{ backgroundColor: COLOR_MAP[color] }}
                            />
                            <span className="capitalize text-white">{color}</span>
                          </td>
                          <td className="p-2 text-center text-neutral-300">{info.digit !== undefined ? info.digit : '—'}</td>
                          <td className="p-2 text-center text-neutral-300">{info.multiplier !== undefined ? info.multiplier : '—'}</td>
                          <td className="p-2 text-center text-neutral-300">{info.tolerance !== undefined ? `${info.tolerance}%` : '—'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-3 bg-emerald-900/30 border border-emerald-800/50 rounded-lg">
                <p className="text-emerald-300 text-sm font-mono">
                  Valor = ({selectedResistor.bands[0] === 'dorado' ? '0' : COLOR_INFO[selectedResistor.bands[0]]?.digit}
                  {selectedResistor.bands[1] === 'dorado' ? '0' : COLOR_INFO[selectedResistor.bands[1]]?.digit}
                  {selectedResistor.bands[2] && selectedResistor.bands[2] !== 'dorado' && COLOR_INFO[selectedResistor.bands[2]]?.digit !== undefined
                    ? COLOR_INFO[selectedResistor.bands[2]]?.digit
                    : ''}) × {COLOR_INFO[selectedResistor.bands[selectedResistor.bands.length - 2]]?.multiplier} = {selectedResistor.label}
                </p>
                <p className="text-emerald-400 text-xs mt-1">
                  Tolerancia: ±{COLOR_INFO[selectedResistor.bands[selectedResistor.bands.length - 1]]?.tolerance || 0}%
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}