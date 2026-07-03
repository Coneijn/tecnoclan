export type ComponentType = 'battery' | 'resistor' | 'led';

export interface CircuitComponent {
  id: string;
  type: ComponentType;
  value: number;
  label: string;
bands?: [string, string, string, string]; // Colores de las bandas
}

export interface LedComponent {
  id: string;
  type: 'led';
  polarity: 'correct' | 'reversed';
  color: 'red' | 'green' | 'blue' | 'yellow' | 'orange' | 'white';
}

export type SimulationState = 'idle' | 'off' | 'perfect' | 'overdrive' | 'burned' | 'exploded' | 'blocked' | 'wrong_color';