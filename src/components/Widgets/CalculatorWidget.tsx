'use client';

import { useState } from 'react';

export default function CalculatorWidget() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('');

  // Maneja la entrada de botones normales
  const handlePress = (val: string) => {
    setExpression((prev) => prev + val);
    setResult(''); // Limpia el error previo si el usuario sigue escribiendo
  };

  // Maneja la inserción de una estructura de fracción
  const handleFraction = () => {
    setExpression((prev) => prev + '(/)');
  };

  // Elimina el último caracter
  const deleteLast = () => {
    setExpression((prev) => prev.slice(0, -1));
  };

  // Limpia toda la calculadora
  const clearAll = () => {
    setExpression('');
    setResult('');
  };

  // Evalúa la expresión matemática
  const calculate = () => {
    if (!expression) return;
    
    try {
      // Reemplazamos los símbolos visuales por los operadores de JavaScript
      let sanitizedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');

      // Evaluamos la expresión de forma controlada
      // Nota: Para proyectos de alta seguridad, se recomienda usar librerías como 'mathjs'
      const evalResult = new Function('return ' + sanitizedExpression)();
      
      // Redondeamos para evitar los errores clásicos de coma flotante (ej. 0.1 + 0.2)
      if (evalResult === Infinity || Number.isNaN(evalResult)) {
        setResult('Error Matemático');
      } else {
        const finalResult = Math.round(evalResult * 100000000) / 100000000;
        setResult(String(finalResult));
      }
    } catch (error) {
      setResult('Expresión inválida');
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto bg-gray-50 rounded-xl shadow-inner border border-gray-200 overflow-hidden font-sans">
      
      {/* Pantalla de la calculadora */}
      <div className="bg-white p-6 text-right border-b border-gray-200 min-h-[120px] flex flex-col justify-end">
        <div className="text-gray-500 text-lg tracking-wider mb-1 min-h-[28px] break-all">
          {expression || '0'}
        </div>
        <div className={`text-4xl font-semibold overflow-hidden text-ellipsis ${result === 'Error Matemático' || result === 'Expresión inválida' ? 'text-red-500 text-2xl' : 'text-gray-800'}`}>
          {result || '='}
        </div>
      </div>

      {/* Teclado */}
      <div className="grid grid-cols-4 gap-[1px] bg-gray-200 p-[1px]">
        {/* Fila 1 */}
        <button onClick={clearAll} className="bg-gray-100 hover:bg-red-100 text-red-500 font-medium p-4 transition-colors">C</button>
        <button onClick={() => handlePress('(')} className="bg-gray-100 hover:bg-gray-50 text-gray-700 p-4 transition-colors">(</button>
        <button onClick={() => handlePress(')')} className="bg-gray-100 hover:bg-gray-50 text-gray-700 p-4 transition-colors">)</button>
        <button onClick={() => handlePress('÷')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-4 transition-colors">÷</button>
        
        {/* Fila 2 */}
        <button onClick={() => handlePress('7')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">7</button>
        <button onClick={() => handlePress('8')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">8</button>
        <button onClick={() => handlePress('9')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">9</button>
        <button onClick={() => handlePress('×')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-4 transition-colors">×</button>
        
        {/* Fila 3 */}
        <button onClick={() => handlePress('4')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">4</button>
        <button onClick={() => handlePress('5')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">5</button>
        <button onClick={() => handlePress('6')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">6</button>
        <button onClick={() => handlePress('-')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-4 transition-colors">-</button>
        
        {/* Fila 4 */}
        <button onClick={() => handlePress('1')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">1</button>
        <button onClick={() => handlePress('2')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">2</button>
        <button onClick={() => handlePress('3')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">3</button>
        <button onClick={() => handlePress('+')} className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium p-4 transition-colors">+</button>
        
        {/* Fila 5 */}
        <button onClick={handleFraction} title="Insertar fracción" className="bg-gray-100 hover:bg-gray-50 text-gray-700 font-medium p-4 transition-colors">a/b</button>
        <button onClick={() => handlePress('0')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">0</button>
        <button onClick={() => handlePress('.')} className="bg-white hover:bg-gray-50 text-gray-800 font-medium p-4 transition-colors">.</button>
        <button onClick={calculate} className="bg-blue-600 hover:bg-blue-700 text-white font-medium p-4 transition-colors">=</button>

        {/* Fila extra para Borrar */}
        <button onClick={deleteLast} className="col-span-4 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium p-3 transition-colors text-sm uppercase tracking-wider">
          ⌫ Borrar
        </button>
      </div>
    </div>
  );
}