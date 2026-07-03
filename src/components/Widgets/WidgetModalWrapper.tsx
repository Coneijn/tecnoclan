'use client';
import { ReactNode } from 'react';

interface WidgetModalWrapperProps {
  isOpen: boolean;
  onClose: () => void;
  isModal?: boolean; // Define si actúa como modal o como componente estático
  children: ReactNode;
}

export default function WidgetModalWrapper({ 
  isOpen, 
  onClose, 
  isModal = true, 
  children 
}: WidgetModalWrapperProps) {
  
  // Si no es modal, simplemente renderiza el contenido (modo independiente)
  if (!isModal) {
    return <div className="w-full h-full">{children}</div>;
  }

  // Si es modal y no está abierto, no renderiza nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 bg-white rounded-2xl shadow-xl">
        {/* Botón de cerrar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          ✕
        </button>
        
        {/* Contenido inyectado del widget */}
        {children}
      </div>
    </div>
  );
}