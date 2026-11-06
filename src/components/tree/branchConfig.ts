export interface BranchConfig {
  id: string;
  src: string;
  left: number;
  top: number;
  width: number;
  scale: number;
  rot: number;
  flipX: boolean;
  z: number;
  opacity: number;
  stemOrigin: string;
  breezeClass: string;
}

// Configuración exacta 1:1 calibrada por el usuario en tree-preview.html
// stemOrigin apunta al corte exacto del leño en contacto con el tronco (0px de movimiento)
export const CALIBRATED_BRANCHES: BranchConfig[] = [
  {
    id: 'rama_1_7013',
    src: 'rama_1',
    left: 62.5,
    top: 19.5,
    width: 36,
    scale: 0.66,
    rot: 0,
    flipX: false,
    z: 15,
    opacity: 1,
    stemOrigin: '3% 95%', // Corte del leño inferior izquierdo
    breezeClass: 'breeze-sway-1',
  },
  {
    id: 'rama_1_7946',
    src: 'rama_1',
    left: 33,
    top: 17,
    width: 36,
    scale: 0.56,
    rot: 0,
    flipX: true,
    z: 15,
    opacity: 1,
    stemOrigin: '3% 95%',
    breezeClass: 'breeze-sway-2',
  },
  {
    id: 'rama_4_8968',
    src: 'rama_4',
    left: 12,
    top: 12.5,
    width: 52,
    scale: 1,
    rot: 0,
    flipX: false,
    z: 15,
    opacity: 1,
    stemOrigin: '94% 8%', // Corte superior derecho del leño pegado al tronco
    breezeClass: 'breeze-sway-3',
  },
  {
    id: 'rama_3_6132',
    src: 'rama_3',
    left: 22,
    top: 14.5,
    width: 32,
    scale: 0.9,
    rot: 4,
    flipX: false,
    z: 15,
    opacity: 1,
    stemOrigin: '97% 52%', // Borde extremo derecho del leño en contacto con el tronco
    breezeClass: 'breeze-sway-1',
  },
  {
    id: 'rama_4_5896',
    src: 'rama_4',
    left: 10.5,
    top: -10.5,
    width: 52,
    scale: 1,
    rot: 35,
    flipX: false,
    z: 15,
    opacity: 1,
    stemOrigin: '94% 8%',
    breezeClass: 'breeze-sway-4',
  },
  {
    id: 'rama_2_4776',
    src: 'rama_2',
    left: 40,
    top: -4,
    width: 18,
    scale: 1,
    rot: 91,
    flipX: false,
    z: 14,
    opacity: 1,
    stemOrigin: '96% 3%', // Borde superior derecho del leño
    breezeClass: 'breeze-sway-2',
  },
  {
    id: 'rama_4_5438',
    src: 'rama_4',
    left: 54,
    top: -22,
    width: 52,
    scale: 0.58,
    rot: 55,
    flipX: true,
    z: 15,
    opacity: 1,
    stemOrigin: '94% 8%',
    breezeClass: 'breeze-sway-3',
  },
  {
    id: 'rama_2_3918',
    src: 'rama_2',
    left: 50,
    top: -8,
    width: 18,
    scale: 1,
    rot: 80,
    flipX: false,
    z: 14,
    opacity: 1,
    stemOrigin: '96% 3%',
    breezeClass: 'breeze-sway-4',
  },
];
