// src/lib/collision/coords.js

/**
 * Convierte coordenadas cartesianas (del editor Tiled) a coordenadas isométricas.
 * @param {{x: number, y: number}} cartesianCoords - Coordenadas en formato cartesiano.
 * @returns {{x: number, y: number}} - Coordenadas en formato isométrico.
 */
export function toIsometric({ x, y }) {
    return {
        x: (x - y),
        y: (x + y) / 2
    };
}

/**
 * Convierte coordenadas isométricas a coordenadas cartesianas.
 * @param {{isoX: number, isoY: number}} isometricCoords - Coordenadas en formato isométrico.
 * @returns {{x: number, y: number}} - Coordenadas en formato cartesiano.
 */
export function toCartesian({ isoX, isoY }) {
    const x = isoY + isoX / 2;
    const y = isoY - isoX / 2;
    return { x, y };
}