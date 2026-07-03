'use client';
import React, { useState } from 'react';
import { Wrench, Calculator, Diamond } from 'lucide-react';
import ResistorCalculatorWidget from '../Widgets/ResistorCalculatorWidget';
import WidgetModalWrapper from '../Widgets/WidgetModalWrapper';

export default function ArcadeToolbox() {
  const [isCalcOpen, setIsCalcOpen] = useState(false);

  return (
    <div className="max-w-6xl mx-auto mb-12">
      {/* Diseño del "Cofre" */}
      <div className="relative bg-gradient-to-br from-amber-950 via-neutral-900 to-neutral-950 border-2 border-amber-700/50 rounded-2xl p-6 shadow-[0_0_40px_rgba(217,119,6,0.1)] overflow-hidden group hover:border-amber-500/80 transition-colors duration-500">
        
        {/* Efecto de brillo de fondo */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none transform translate-x-1/2 -translate-y-1/2" />

        <div className="flex flex-col md:flex-row items-center justify-between relative z-10 gap-6">
          
          {/* Título y Descripción */}
          <div className="flex items-center gap-5 w-full md:w-auto">
            <div className="p-4 bg-amber-950/50 rounded-xl border border-amber-600/30 shadow-inner group-hover:scale-105 transition-transform">
              <Wrench className="w-8 h-8 text-amber-400" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 flex items-center gap-2 mb-1">
                Inventario de Apoyo
                <Diamond className="w-4 h-4 text-amber-300" fill="currentColor" />
              </h2>
              <p className="text-neutral-400 text-sm">
                Herramientas valiosas para calcular y resolver los circuitos con precisión.
              </p>
            </div>
          </div>

          {/* Botones de herramientas */}
          <div className="flex gap-3 w-full md:w-auto">
            <button
              onClick={() => setIsCalcOpen(true)}
              className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-500 text-white rounded-xl font-bold shadow-lg shadow-amber-900/40 transition-all hover:-translate-y-1 active:scale-95 border border-amber-400"
            >
              <Calculator size={20} />
              Calculadora de Resistencias
            </button>
          </div>
        </div>
      </div>

      {/* Modal Independiente */}
      <WidgetModalWrapper 
        isOpen={isCalcOpen} 
        onClose={() => setIsCalcOpen(false)} 
        isModal={true}
      >
        <ResistorCalculatorWidget />
      </WidgetModalWrapper>
    </div>
  );
}