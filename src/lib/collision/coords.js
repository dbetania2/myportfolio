// Convierte de Tiled (cuadrado) a Pantalla (diamante)
export function toIsometric({ x, y }) {
    return {
        x: (x - y),
        y: (x + y) / 2
    };
}

// Convierte de Pantalla (diamante) a Tiled (cuadrado)
export function toCartesian({ isoX, isoY }) {
    return {
        x: isoY + isoX / 2,
        y: isoY - isoX / 2
    };
}