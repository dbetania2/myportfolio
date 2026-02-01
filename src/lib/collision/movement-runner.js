//movement-runner.js
import { toIsometric } from './coords.js';
import {
    GLOBAL_COLLISION_OFFSET_X,
    GLOBAL_COLLISION_OFFSET_Y,
    CHAR_SPRITE_WIDTH,
    CHAR_SPRITE_HEIGHT
} from './config.js';

// esta clase se encarga de ejecutar el bucle de movimiento visual de mi personaje, actualizando su posicion cuadro por cuadro y verificando colisiones en tiempo real
export class MovementRunner {
    constructor(movementController) {
        this.movementController = movementController;
        this.isMoving = false;
        // defino la velocidad, una velocidad mas baja hace que la animacion sea mas fluida
        this.speed = 0.6; 
    }

    move(character, startPos, targetPos, renderParams) {
        // si ya me estoy moviendo ignoro la orden para evitar conflictos
        if (this.isMoving) return;
        this.isMoving = true;

        let currentPos = { ...startPos };

        const step = () => {
            // calculo la distancia restante hacia mi objetivo
            const dx = targetPos.x - currentPos.x;
            const dy = targetPos.y - currentPos.y;

            const dist = Math.hypot(dx, dy);

            // si estoy lo suficientemente cerca del destino me detengo y pongo el estado de reposo
            if (dist < this.speed) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            // determino la direccion principal del movimiento para asignar la clase css correcta
            const direction =
                Math.abs(dx) > Math.abs(dy)
                    ? dx > 0 ? 'right' : 'left'
                    : dy > 0 ? 'down' : 'up';

            character.className = `character ${direction}`;

            // calculo cual sera mi siguiente posicion logica basada en la velocidad
            const nextPos = {
                x: currentPos.x + (dx / dist) * this.speed,
                y: currentPos.y + (dy / dist) * this.speed
            };

            // consulto al controlador si la siguiente posicion es valida, si choco con algo me detengo
            if (!this.movementController.isValidPosition(nextPos)) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            currentPos = nextPos;

            // aqui comienza el proceso de renderizado en pantalla
            const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

            // convierto mi posicion logica a coordenadas isometricas para la pantalla
            const iso = toIsometric(currentPos);
            const screenX = (iso.x + horizontalIsoOffset) * scale;
            const screenY = (iso.y + verticalIsoOffset) * scale;

            // calculo las dimensiones visuales del sprite escaladas
            const visualWidth = CHAR_SPRITE_WIDTH * scale;
            const visualHeight = CHAR_SPRITE_HEIGHT * scale;
            const FOOT_ADJUSTMENT = visualHeight * 0.1;

            // posiciono el elemento en el dom ajustando el centro y los offsets globales
            character.style.left =
                `${screenX - visualWidth / 2 + GLOBAL_COLLISION_OFFSET_X * scale}px`;

            character.style.top =
                `${screenY - visualHeight + FOOT_ADJUSTMENT + GLOBAL_COLLISION_OFFSET_Y * scale}px`;

            // ajusto el indice z para que la profundidad visual sea correcta segun mi posicion y
            character.style.zIndex = Math.floor(screenY);

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }
}