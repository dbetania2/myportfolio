import { VISUAL_SCALE } from './config.js';

export function getRenderParams() {
    // El ancho del contenedor es 1406 segun tu CSS
    const containerWidth = 1406;

    return {
        scale: VISUAL_SCALE,
        // Centrado horizontal basado en el ancho del PNG
        horizontalIsoOffset: (containerWidth / 2) / VISUAL_SCALE,
        // Ajuste vertical para que el rincon del dibujo coincida
        verticalIsoOffset: 22
    };
}