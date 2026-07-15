'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCw, X, Calculator, HelpCircle } from 'lucide-react';
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

// Tabla de colores para el modal
const COLOR_TABLE = [
  { color: 'negro', value: 0, multiplier: 1 },
  { color: 'marrón', value: 1, multiplier: 10 },
  { color: 'rojo', value: 2, multiplier: 100 },
  { color: 'naranja', value: 3, multiplier: 1000 },
  { color: 'amarillo', value: 4, multiplier: 10000 },
  { color: 'verde', value: 5, multiplier: 100000 },
  { color: 'azul', value: 6, multiplier: 1000000 },
  { color: 'violeta', value: 7, multiplier: 10000000 },
  { color: 'gris', value: 8, multiplier: 100000000 },
  { color: 'blanco', value: 9, multiplier: 1000000000 },
  { color: 'dorado', value: -1, multiplier: 0.1 },
  { color: 'plateado', value: -2, multiplier: 0.01 },
];

export default function Level6() {
  const [boardBattery, setBoardBattery] = useState<PlacedComponent | null>(null);
  const [boardResistor, setBoardResistor] = useState<PlacedComponent | null>(null);
  const [boardLed, setBoardLed] = useState<PlacedLed | null>(null);

  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationState, setSimulationState] = useState<SimulationState>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const [tutorialMsg, setTutorialMsg] = useState('');
  const [showHelpModal, setShowHelpModal] = useState(false); // Nuevo estado para el modal

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
      {/* Cabecera con título y botón de ayuda */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-lg font-bold text-white/90">🧮 Nivel 6 – Ley de Ohm</h2>
          <p className="text-xs text-neutral-500">Calcula la resistencia necesaria para el LED rojo con una batería de 9V.</p>
        </div>
        <button
          onClick={() => setShowHelpModal(true)}
          className="p-2 rounded-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
          aria-label="Ayuda"
        >
          <HelpCircle size={22} />
        </button>
      </div>

      {/* Contenido principal (sin el panel colapsable) */}

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

        {/* Componentes colocados (código SVG igual que antes) */}
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

      {/* Botones y feedback (igual que antes) */}
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

      {/* Modal de ayuda */}
      <AnimatePresence>
        {showHelpModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
            onClick={() => setShowHelpModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative bg-neutral-900 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 border border-neutral-700 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowHelpModal(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                <Calculator className="text-amber-400" /> Ayuda – Ley de Ohm y Código de Colores
              </h3>

              <div className="space-y-6 text-neutral-300">
                {/* Sección 1: Cálculo de la resistencia */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">📐 Cálculo de la resistencia necesaria</h4>
                  <div className="bg-neutral-800/50 rounded-lg p-4 space-y-2 font-mono text-sm">
                    <p>Datos del LED rojo:</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      <li>V<sub>fuente</sub> = {SOURCE_VOLTAGE} V</li>
                      <li>V<sub>LED</sub> (tensión directa) = {LED_VOLTAGE} V</li>
                      <li>I<sub>LED</sub> (corriente nominal) = {LED_CURRENT * 1000} mA = {LED_CURRENT} A</li>
                    </ul>
                    <p className="mt-2">Aplicamos la Ley de Ohm:</p>
                    <div className="bg-black/40 p-3 rounded border border-neutral-700">
                      <p>R = (V<sub>fuente</sub> – V<sub>LED</sub>) / I<sub>LED</sub></p>
                      <p>R = ({SOURCE_VOLTAGE} – {LED_VOLTAGE}) / {LED_CURRENT}</p>
                      <p>R = {SOURCE_VOLTAGE - LED_VOLTAGE} / {LED_CURRENT} = <span className="text-amber-400 font-bold">{((SOURCE_VOLTAGE - LED_VOLTAGE) / LED_CURRENT).toFixed(0)} Ω</span></p>
                    </div>
                    <p className="mt-2 text-amber-300">
                      ⚡ El valor calculado es 350 Ω, pero no es un valor comercial estándar. El más cercano es <strong>330 Ω</strong> (serie E24).
                    </p>
                  </div>
                </div>

                {/* Sección 2: Código de colores de la resistencia 330Ω */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">🎨 Código de colores (330 Ω)</h4>
                  <div className="bg-neutral-800/50 rounded-lg p-4">
                    <div className="flex justify-center mb-4">
                      <svg viewBox="0 0 175 80" className="w-64 h-auto">
                        <line x1="0" y1="40" x2="175" y2="40" stroke="silver" strokeWidth="6" />
                        <rect x="57.5" y="25" width="60" height="30" rx="8" fill="#d2b48c" stroke="black" strokeWidth="2" />
                        {/* Bandas: naranja, naranja, marrón, dorado */}
                        <rect x="62" y="25" width="5" height="30" fill="#FFA500" />
                        <rect x="72" y="25" width="5" height="30" fill="#FFA500" />
                        <rect x="82" y="25" width="5" height="30" fill="#8B4513" />
                        <rect x="92" y="25" width="5" height="30" fill="#D4AF37" />
                      </svg>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="border-b border-neutral-700">
                            <th className="text-left py-1 px-2">Banda</th>
                            <th className="text-left py-1 px-2">Color</th>
                            <th className="text-left py-1 px-2">Valor / Multiplicador</th>
                            <th className="text-left py-1 px-2">Significado</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-neutral-800">
                            <td className="py-1 px-2">1ª</td>
                            <td className="py-1 px-2 flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#FFA500' }}></span> Naranja</td>
                            <td className="py-1 px-2">3</td>
                            <td className="py-1 px-2">Primer dígito</td>
                          </tr>
                          <tr className="border-b border-neutral-800">
                            <td className="py-1 px-2">2ª</td>
                            <td className="py-1 px-2 flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#FFA500' }}></span> Naranja</td>
                            <td className="py-1 px-2">3</td>
                            <td className="py-1 px-2">Segundo dígito</td>
                          </tr>
                          <tr className="border-b border-neutral-800">
                            <td className="py-1 px-2">3ª (multiplicador)</td>
                            <td className="py-1 px-2 flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#8B4513' }}></span> Marrón</td>
                            <td className="py-1 px-2">×10</td>
                            <td className="py-1 px-2">Multiplicador (10¹)</td>
                          </tr>
                          <tr>
                            <td className="py-1 px-2">4ª (tolerancia)</td>
                            <td className="py-1 px-2 flex items-center gap-2"><span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: '#D4AF37' }}></span> Dorado</td>
                            <td className="py-1 px-2">±5%</td>
                            <td className="py-1 px-2">Tolerancia</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-3 text-sm text-neutral-400">
                      <strong>Interpretación:</strong> 33 × 10 = 330 Ω, con tolerancia del ±5%.
                    </p>
                  </div>
                </div>

                {/* Sección 3: Tabla de colores completa (opcional) */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-2">📊 Tabla de colores – valores</h4>
                  <div className="bg-neutral-800/50 rounded-lg p-4 overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-neutral-700">
                          <th className="text-left py-1 px-2">Color</th>
                          <th className="text-left py-1 px-2">Valor</th>
                          <th className="text-left py-1 px-2">Multiplicador</th>
                        </tr>
                      </thead>
                      <tbody>
                        {COLOR_TABLE.map(({ color, value, multiplier }) => (
                          <tr key={color} className="border-b border-neutral-800/50">
                            <td className="py-1 px-2 flex items-center gap-2">
                              <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: COLOR_MAP[color] || '#888' }}></span>
                              {color.charAt(0).toUpperCase() + color.slice(1)}
                            </td>
                            <td className="py-1 px-2">{value >= 0 ? value : '—'}</td>
                            <td className="py-1 px-2">{multiplier === 1 ? '×1' : multiplier >= 1 ? `×${multiplier}` : `×${multiplier}`}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-xs text-neutral-500 border-t border-neutral-700 pt-4 mt-2">
                  💡 Recuerda: la resistencia correcta para este circuito es <strong className="text-amber-300">330 Ω</strong>.
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}