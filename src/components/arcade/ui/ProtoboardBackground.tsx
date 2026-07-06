'use client';
import React from 'react';

interface ProtoboardBackgroundProps {
  batteryPos: { x: number; y: number };
  resistorPos: { x: number; y: number };
  ledPos: { x: number; y: number };
  showConnections?: boolean;
}

export default function ProtoboardBackground({
  batteryPos,
  resistorPos,
  ledPos,
  showConnections = true,
}: ProtoboardBackgroundProps) {
  const viewWidth = 800;
  const viewHeight = 400;
  
  // Parámetros de la cuadrícula
  const totalCols = 16; 
  const spacing = 35;   
  const startX = 137.5; 
  const holeRadius = 6; 

  // Coordenadas Y
  const redLineY = 70;
  const redHoleY = 95;
  const blueHoleY = 130;
  const blueLineY = 155;
  
  // A=200, B=235, C=270, D=305, E=340
  const terminalStartY = 200; 

  // 1. Puntos de alimentación
  const powerPoints = [];
  for (let c = 0; c < totalCols; c++) {
    const x = startX + c * spacing;
    powerPoints.push({ x, y: redHoleY });
    powerPoints.push({ x, y: blueHoleY });
  }

  // 2. Puntos de trabajo (5 por columna: A, B, C, D, E)
  const terminalPoints = [];
  for (let c = 0; c < totalCols; c++) {
    const x = startX + c * spacing;
    for (let r = 0; r < 5; r++) { 
      terminalPoints.push({ x, y: terminalStartY + r * spacing });
    }
  }

  // Coordenadas matemáticas para los JUMPERS
  // Columna 2 = startX + (1 * 35) = 172.5
  // Columna 13 = startX + (12 * 35) = 557.5
  const col2X = 172.5;
  const col13X = 557.5;
  const rowA_Y = terminalStartY;       // 200
  const rowB_Y = terminalStartY + 35;  // 235

  return (
    <svg
      viewBox={`0 0 ${viewWidth} ${viewHeight}`}
      className="w-full h-full pointer-events-none drop-shadow-xl"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Plástico base */}
      <rect x="70" y="40" width="660" height="320" fill="#f8fafc" rx="16" stroke="#cbd5e1" strokeWidth="3" />

      {/* Líneas de alimentación */}
      <line x1={startX - 15} y1={redLineY} x2={startX + (totalCols - 1) * spacing + 15} y2={redLineY} stroke="#ef4444" strokeWidth="6" opacity="0.8" strokeLinecap="round"/>
      <line x1={startX - 15} y1={blueLineY} x2={startX + (totalCols - 1) * spacing + 15} y2={blueLineY} stroke="#3b82f6" strokeWidth="6" opacity="0.8" strokeLinecap="round"/>
      
      {/* Símbolos + y - */}
      <text x="95" y={redLineY + 6} fill="#ef4444" fontSize="24" fontWeight="bold" textAnchor="middle">+</text>
      <text x="95" y={blueLineY + 6} fill="#3b82f6" fontSize="28" fontWeight="bold" textAnchor="middle">-</text>

      {/* Agujeros */}
      <g id="breadboard-holes">
        {powerPoints.map((p, i) => (
          <circle key={`pwr-${i}`} cx={p.x} cy={p.y} r={holeRadius} fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        ))}
        {terminalPoints.map((p, i) => (
          <circle key={`term-${i}`} cx={p.x} cy={p.y} r={holeRadius} fill="#1e293b" stroke="#0f172a" strokeWidth="1.5" />
        ))}
      </g>

      {/* =========================================
          CABLES JUMPER FÍSICOS (Curvas Bezier)
          ========================================= */}
      {showConnections && (
        <g id="jumper-wires" className="drop-shadow-md">
          {/* Jumper de V+ (+2) a B2 */}
          <path 
            d={`M ${col2X} ${redHoleY} C ${col2X - 45} ${redHoleY + 30}, ${col2X - 45} ${rowB_Y - 30}, ${col2X} ${rowB_Y}`} 
            fill="none" 
            stroke="#ef4444" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          {/* Jumper de A13 a GND (-13) */}
          <path 
            d={`M ${col13X} ${rowA_Y} C ${col13X + 45} ${rowA_Y - 20}, ${col13X + 45} ${blueHoleY + 20}, ${col13X} ${blueHoleY}`} 
            fill="none" 
            stroke="#3b82f6" 
            strokeWidth="8" 
            strokeLinecap="round" 
          />
          
          {/* Cables visuales de la batería a los pines 1 de la protoboard (opcional para justificar la conexión de la pila) */}
          <path 
            d={`M ${batteryPos.x + 30} ${batteryPos.y - 45} C 100 80, 100 95, ${startX} ${redHoleY}`} 
            fill="none" stroke="#ef4444" strokeWidth="4" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6"
          />
          <path 
            d={`M ${batteryPos.x + 30} ${batteryPos.y + 45} C 100 180, 100 130, ${startX} ${blueHoleY}`} 
            fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="6 4" strokeLinecap="round" opacity="0.6"
          />
        </g>
      )}
    </svg>
  );
}