'use client';

import React from 'react';
import DraggableItem from './ui/DraggableItem';
import { CircuitComponent, LedComponent } from './types'; // Ajusta la ruta a tus tipos

interface ArcadeToolboxProps {
  availableItems: (CircuitComponent | LedComponent)[];
  onDragEnd: (e: any, info: any, item: CircuitComponent | LedComponent) => void;
  disabled?: boolean;
}

export default function ArcadeToolbox({ 
  availableItems, 
  onDragEnd,
  disabled = false
}: ArcadeToolboxProps) {
  return (
    /* CONTENEDOR PRINCIPAL:
       Se posiciona con un borde superior sutil y un fondo semitransparente.
       En pantallas grandes (md) podemos darle bordes redondeados y separarlo del fondo,
       pero en móvil ocupará todo el ancho de borde a borde.
    */
    <div className="w-full bg-neutral-900/90 backdrop-blur-md border-t border-neutral-700/50 md:border md:rounded-2xl md:mb-4 p-4 md:p-6 mt-4 z-20">
      
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-neutral-400 font-medium text-xs tracking-wider uppercase">Inventario</h3>
        <span className="text-neutral-600 text-xs">{availableItems.length} componentes</span>
      </div>

      
      <div className="flex flex-wrap justify-center items-center gap-4 py-4 px-2">
        {/* CSS in-line para ocultar el scrollbar en Webkit (Chrome/Safari/iOS) */}
        <style dangerouslySetInnerHTML={{__html: `
          .overflow-x-auto::-webkit-scrollbar { display: none; }
        `}} />

        {availableItems.length === 0 ? (
          <div className="w-full text-center text-neutral-600 text-sm py-4 italic">
            No hay más componentes disponibles.
          </div>
        ) : (
          availableItems.map((item) => (
            <div 
              key={item.id} 
              className="snap-center shrink-0"
            >
              <DraggableItem 
                item={item} 
                onDragEnd={onDragEnd}
                disabled={disabled}
              />
            </div>
          ))
        )}
      </div>
      
    </div>
  );
}