import React from 'react';
import Link from 'next/link';
import { 
  Zap, 
  RotateCw, 
  Crosshair, 
  Palette, 
  ListTree, 
  BatteryMedium, 
  Calculator, 
  Braces, 
  Cpu, 
  FileCode2,
  Play
} from 'lucide-react';
// Definimos la lista de niveles basada en tu progresión
const ARCADE_LEVELS = [
  { 
    id: 0, 
    title: 'Conceptos Abstractos', 
    description: 'Un LED y una resistencia abstractos. Arrastra y se acomodan solos.', 
    icon: Zap,
    color: 'text-yellow-400',
    bg: 'bg-yellow-400/10'
  },
  { 
    id: 1, 
    title: 'Polaridad', 
    description: 'El diodo se puede rotar. Descubre y respeta la polaridad correcta para encenderlo.', 
    icon: RotateCw,
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10'
  },
  { 
    id: 2, 
    title: 'Posición Estricta', 
    description: 'Se acabó el auto-acomodo. Debes colocar la resistencia estrictamente antes del diodo.', 
    icon: Crosshair,
    color: 'text-blue-400',
    bg: 'bg-blue-400/10'
  },
  { 
    id: 3, 
    title: 'Distractores: Color', 
    description: 'Aparecen LEDs de otros colores. Sigue la instrucción para elegir el correcto.', 
    icon: Palette,
    color: 'text-purple-400',
    bg: 'bg-purple-400/10'
  },
  { 
    id: 4, 
    title: 'Distractores: Resistencias', 
    description: 'Aprende el código de colores. Encuentra la resistencia correcta entre varios distractores.', 
    icon: ListTree,
    color: 'text-pink-400',
    bg: 'bg-pink-400/10'
  },
  { 
    id: 5, 
    title: 'Cambio de Fuente', 
    description: 'El voltaje de la fuente cambia. Deduzce qué nueva resistencia necesitas para no quemar el LED.', 
    icon: BatteryMedium,
    color: 'text-orange-400',
    bg: 'bg-orange-400/10'
  },
  { 
    id: 6, 
    title: 'La Ley de Ohm', 
    description: 'Te presentamos la fórmula. Usa las matemáticas para encontrar la resistencia exacta por su valor.', 
    icon: Calculator,
    color: 'text-indigo-400',
    bg: 'bg-indigo-400/10'
  },
  { 
    id: 7, 
    title: 'Cálculo + Colores', 
    description: 'Calcula con la Ley de Ohm, pero ahora elige la resistencia leyendo solo sus bandas de colores.', 
    icon: Braces,
    color: 'text-teal-400',
    bg: 'bg-teal-400/10'
  },
  { 
    id: 8, 
    title: 'Componentes Físicos', 
    description: 'Dejamos la simbología atrás. Arma el circuito utilizando puros iconos de componentes fotorrealistas.', 
    icon: Cpu,
    color: 'text-cyan-400',
    bg: 'bg-cyan-400/10'
  },
  { 
    id: 9, 
    title: 'Lectura de Diagramas', 
    description: 'Transición profesional: El menú de insumos ahora utiliza símbolos esquemáticos reales (Diodo, Resistor).', 
    icon: FileCode2,
    color: 'text-rose-400',
    bg: 'bg-rose-400/10'
  }
];

export default function ArcadeMenuPage() {
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans p-8 md:p-12">
      {/* Encabezado */}
      <div className="max-w-6xl mx-auto mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-emerald-400 to-blue-500 text-transparent bg-clip-text">
          Arcade de Circuitos
        </h1>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Aprende electrónica jugando. Supera los niveles, domina la Ley de Ohm y pasa de conectar dibujos abstractos a leer diagramas profesionales.
        </p>
      </div>

      
      {/* Grid de Mosaicos */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {ARCADE_LEVELS.map((level) => {
          const IconComponent = level.icon;
          
          return (
            <Link 
              href={`/arcade/minigames/${level.id}`} 
              key={level.id}
              className="group relative flex flex-col bg-neutral-900 border-2 border-neutral-800 rounded-2xl p-6 hover:border-emerald-500/50 hover:bg-neutral-800/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-900/20"
            >
              {/* Etiqueta de Nivel */}
              <div className="flex justify-between items-start mb-4">
                <span className="text-xs font-bold tracking-wider text-neutral-500 uppercase bg-neutral-950 px-3 py-1 rounded-full border border-neutral-800 group-hover:border-neutral-700 transition-colors">
                  Nivel {level.id}
                </span>
                <div className={`p-2 rounded-lg ${level.bg} transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                  <IconComponent className={`w-6 h-6 ${level.color}`} />
                </div>
              </div>

              {/* Título y Descripción */}
              <h2 className="text-xl font-bold mb-2 text-neutral-100 group-hover:text-emerald-400 transition-colors">
                {level.title}
              </h2>
              <p className="text-sm text-neutral-500 flex-grow mb-6 group-hover:text-neutral-300 transition-colors">
                {level.description}
              </p>

              {/* Botón de Jugar Oculto que aparece en Hover */}
              <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-800/50 group-hover:border-emerald-500/20">
                <span className="text-sm font-semibold text-neutral-600 group-hover:text-emerald-500 transition-colors">
                  Iniciar desafío
                </span>
                <Play className="w-5 h-5 text-neutral-600 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" fill="currentColor" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}