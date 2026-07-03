'use client';
import { useState, useMemo } from 'react';

const BAND_DATA = [
  { name: 'Negro', digit: 0, mult: 1, tol: null, hex: '#000000', text: 'white' },
  { name: 'Marrón', digit: 1, mult: 10, tol: 1, hex: '#8B4513', text: 'white' },
  { name: 'Rojo', digit: 2, mult: 100, tol: 2, hex: '#FF0000', text: 'white' },
  { name: 'Naranja', digit: 3, mult: 1000, tol: null, hex: '#FFA500', text: 'black' },
  { name: 'Amarillo', digit: 4, mult: 10000, tol: null, hex: '#FFFF00', text: 'black' },
  { name: 'Verde', digit: 5, mult: 100000, tol: 0.5, hex: '#008000', text: 'white' },
  { name: 'Azul', digit: 6, mult: 1000000, tol: 0.25, hex: '#0000FF', text: 'white' },
  { name: 'Violeta', digit: 7, mult: 10000000, tol: 0.1, hex: '#8A2BE2', text: 'white' },
  { name: 'Gris', digit: 8, mult: 100000000, tol: 0.05, hex: '#808080', text: 'white' },
  { name: 'Blanco', digit: 9, mult: 1000000000, tol: null, hex: '#FFFFFF', text: 'black' },
  { name: 'Oro', digit: null, mult: 0.1, tol: 5, hex: '#D4AF37', text: 'black' },
  { name: 'Plata', digit: null, mult: 0.01, tol: 10, hex: '#C0C0C0', text: 'black' },
];

export default function ResistorCalculatorWidget() {
  const [bandMode, setBandMode] = useState<4 | 5>(4);
  
  // Guardamos estados separados para no perder la configuración al cambiar de modo
  const [bands4, setBands4] = useState([3, 3, 1, 10]); // Naranja, Naranja, Marrón, Oro (330Ω ±5%)
  const [bands5, setBands5] = useState([2, 2, 0, 1, 10]); // Rojo, Rojo, Negro, Marrón, Oro (2200Ω ±5%)
  
  const [activeBandIndex, setActiveBandIndex] = useState(0);
  const [showToleranceTip, setShowToleranceTip] = useState(false);

  // Selecciona el array de bandas activo según el modo
  const currentBands = bandMode === 4 ? bands4 : bands5;

  const calculateResistor = useMemo(() => {
    let ohms = 0;
    let tolerance = 0;
    
    if (bandMode === 4) {
      const val1 = BAND_DATA[currentBands[0]].digit ?? 0;
      const val2 = BAND_DATA[currentBands[1]].digit ?? 0;
      const multiplier = BAND_DATA[currentBands[2]].mult;
      tolerance = BAND_DATA[currentBands[3]].tol ?? 0;
      ohms = (val1 * 10 + val2) * multiplier;
    } else {
      const val1 = BAND_DATA[currentBands[0]].digit ?? 0;
      const val2 = BAND_DATA[currentBands[1]].digit ?? 0;
      const val3 = BAND_DATA[currentBands[2]].digit ?? 0;
      const multiplier = BAND_DATA[currentBands[3]].mult;
      tolerance = BAND_DATA[currentBands[4]].tol ?? 0;
      ohms = (val1 * 100 + val2 * 10 + val3) * multiplier;
    }

    // Formateo dinámico e inteligente para Kilo-ohms y Mega-ohms
    let formatted = `${parseFloat(ohms.toFixed(2))} Ω`;
    if (ohms >= 1000000) {
      formatted = `${parseFloat((ohms / 1000000).toFixed(2))} MΩ`;
    } else if (ohms >= 1000) {
      formatted = `${parseFloat((ohms / 1000).toFixed(2))} kΩ`;
    }
    
    return { formatted, ohms, tolerance };
  }, [currentBands, bandMode]);

  const changeBandColor = (colorIndex: number) => {
    if (bandMode === 4) {
      const newBands = [...bands4];
      newBands[activeBandIndex] = colorIndex;
      setBands4(newBands);
    } else {
      const newBands = [...bands5];
      newBands[activeBandIndex] = colorIndex;
      setBands5(newBands);
    }
  };

  const handleModeSwitch = (mode: 4 | 5) => {
    setBandMode(mode);
    setActiveBandIndex(0); // Reiniciar el índice activo al cambiar
    setShowToleranceTip(false);
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      
      {/* Selector de Modos (4 o 5 bandas) */}
      <div className="flex justify-center mb-6">
        <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
          <button 
            onClick={() => handleModeSwitch(4)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bandMode === 4 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            4 Bandas
          </button>
          <button 
            onClick={() => handleModeSwitch(5)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bandMode === 5 ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
          >
            5 Bandas
          </button>
        </div>
      </div>

      {/* Visualización de la Resistencia (Diseño Cacahuatito 3D) */}
      <div className="flex items-center justify-center w-full mb-8 mt-2 px-2">
        {/* Alambre metálico izquierdo */}
        <div className="w-8 h-2.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-l-md shadow-sm border-y border-l border-gray-400 z-0"></div>
        
        {/* Cuerpo de la resistencia (Cacahuatito) */}
        <div className="relative w-full h-24 flex items-center justify-center z-10">
          
          {/* Fondo 3D del Cacahuatito (Compuesto por 3 piezas superpuestas) */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none drop-shadow-md">
            {/* Extremo Izquierdo (Bulbo) */}
            <div className="w-[30%] h-24 bg-gradient-to-b from-[#e8c690] via-[#F5DEB3] to-[#c29c60] rounded-l-[40px] rounded-r-[12px] border border-[#b38b4d] shadow-[inset_0_-10px_12px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.7)] z-10"></div>
            {/* Centro (Cintura más delgada) */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[55%] h-[76px] bg-gradient-to-b from-[#e8c690] via-[#F5DEB3] to-[#c29c60] border-y border-[#b38b4d] shadow-[inset_0_-8px_10px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.7)] z-0"></div>
            {/* Extremo Derecho (Bulbo) */}
            <div className="w-[30%] h-24 bg-gradient-to-b from-[#e8c690] via-[#F5DEB3] to-[#c29c60] rounded-r-[40px] rounded-l-[12px] border border-[#b38b4d] shadow-[inset_0_-10px_12px_rgba(0,0,0,0.2),inset_0_4px_8px_rgba(255,255,255,0.7)] z-10"></div>
          </div>

          {/* Bandas de colores */}
          <div className="relative flex items-center justify-around w-full px-5 z-20">
            {currentBands.map((colorIdx, i) => {
              // Si la banda es la primera o la última, va sobre el bulbo (más alta). Si no, va en la cintura.
              const isEdge = i === 0 || i === currentBands.length - 1;
              return (
                <div 
                  key={i} 
                  onClick={() => setActiveBandIndex(i)}
                  className={`w-6 cursor-pointer transition-all relative ${
                    isEdge ? 'h-[94px] rounded-[6px]' : 'h-[76px] rounded-[3px]'
                  } ${
                    i === activeBandIndex 
                      ? 'ring-4 ring-blue-400 scale-110 shadow-xl z-30' 
                      : 'hover:brightness-110 shadow-sm z-20'
                  }`}
                  style={{ 
                    backgroundColor: BAND_DATA[colorIdx].hex,
                    // Gradiente agresivo para el brillo superior (charolazo) y sombra profunda inferior
                    backgroundImage: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 15%, rgba(0,0,0,0) 40%, rgba(0,0,0,0.15) 75%, rgba(0,0,0,0.6) 100%)'
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Alambre metálico derecho */}
        <div className="w-8 h-2.5 bg-gradient-to-b from-gray-300 via-gray-400 to-gray-500 rounded-r-md shadow-sm border-y border-r border-gray-400 z-0"></div>
      </div>

      {/* Tira adaptativa */}
      <div className="bg-gray-800 p-3 rounded-xl text-white mb-6 shadow-md">
        <div className="flex justify-between text-xs opacity-70 mb-1 px-1">
          {currentBands.map((c, i) => <span key={i}>{BAND_DATA[c].name}</span>)}
        </div>
        <div className="flex justify-between font-mono text-lg font-bold px-1 items-center">
          {bandMode === 4 ? (
            <>
              <span>{BAND_DATA[currentBands[0]].digit ?? '-'}</span>
              <span>{BAND_DATA[currentBands[1]].digit ?? '-'}</span>
              <span>x{BAND_DATA[currentBands[2]].mult}</span>
              <button onClick={() => setShowToleranceTip(!showToleranceTip)} className="text-yellow-400 hover:text-yellow-300">
                ±{BAND_DATA[currentBands[3]].tol ?? '-'}%
              </button>
            </>
          ) : (
            <>
              <span>{BAND_DATA[currentBands[0]].digit ?? '-'}</span>
              <span>{BAND_DATA[currentBands[1]].digit ?? '-'}</span>
              <span>{BAND_DATA[currentBands[2]].digit ?? '-'}</span>
              <span>x{BAND_DATA[currentBands[3]].mult}</span>
              <button onClick={() => setShowToleranceTip(!showToleranceTip)} className="text-yellow-400 hover:text-yellow-300">
                ±{BAND_DATA[currentBands[4]].tol ?? '-'}%
              </button>
            </>
          )}
        </div>
      </div>

      {/* Resultado Principal */}
      <div className="text-center mb-6">
        <div className="text-4xl font-extrabold text-gray-800 tracking-tight">
          {calculateResistor.formatted}
        </div>
      </div>

      {/* Rango de Tolerancia Expandible */}
      {showToleranceTip && (
        <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800 border border-blue-200 mb-6 flex justify-between font-mono">
          <span className="opacity-70">Rango:</span>
          <span className="font-semibold">
            {(calculateResistor.ohms * (1 - calculateResistor.tolerance / 100)).toFixed(1)}Ω 
            {" - "} 
            {(calculateResistor.ohms * (1 + calculateResistor.tolerance / 100)).toFixed(1)}Ω
          </span>
        </div>
      )}

      {/* Paleta de Colores */}
      <div className="grid grid-cols-6 gap-3">
        {BAND_DATA.map((c, idx) => {
          const isInvalidForDigit = (bandMode === 4 && activeBandIndex < 2) || (bandMode === 5 && activeBandIndex < 3);
          const isDisabled = isInvalidForDigit && c.digit === null;
          
          return (
            <button
              key={idx}
              onClick={() => !isDisabled && changeBandColor(idx)}
              disabled={isDisabled}
              className={`w-full aspect-square rounded-full border-2 transition-transform ${isDisabled ? 'opacity-20 cursor-not-allowed' : 'hover:scale-110 cursor-pointer shadow-sm border-gray-300'}`}
              style={{ backgroundColor: c.hex }}
              title={c.name}
            />
          );
        })}
      </div>
    </div>
  );
}