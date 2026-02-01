import { toIsometric } from './coords.js';
import {
    GLOBAL_COLLISION_OFFSET_X,
    GLOBAL_COLLISION_OFFSET_Y,
    CHAR_SPRITE_WIDTH,
    CHAR_SPRITE_HEIGHT
} from './config.js';

// esta clase se encarga de ejecutar el bucle de movimiento visual del personaje
export class MovementRunner {
    constructor(movementController) {
        this.movementController = movementController;
        this.isMoving = false;
        // velocidad del personaje
        this.speed = 0.6; 
    }

    move(character, startPos, targetPos, renderParams) {
        // si ya se esta moviendo ignora la orden
        if (this.isMoving) return;
        this.isMoving = true;

        let currentPos = { ...startPos };

        const step = () => {
            // calculo la distancia restante hacia el objetivo
            const dx = targetPos.x - currentPos.x;
            const dy = targetPos.y - currentPos.y;

            const dist = Math.hypot(dx, dy);

            // si esta cerca del destino se detiene
            if (dist < this.speed) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            // CORRECCION AQUI:
            // convertimos el vector de movimiento (dx, dy) a isometrico
            // para saber que animacion visual corresponde en pantalla
            const isoMove = toIsometric({ x: dx, y: dy });

            // usamos isoMove.x e isoMove.y para decidir la direccion visual
            const direction =
                Math.abs(isoMove.x) > Math.abs(isoMove.y)
                    ? isoMove.x > 0 ? 'right' : 'left'
                    : isoMove.y > 0 ? 'down' : 'up';

            character.className = `character ${direction}`;

            // calculo la siguiente posicion logica basada en la velocidad
            const nextPos = {
                x: currentPos.x + (dx / dist) * this.speed,
                y: currentPos.y + (dy / dist) * this.speed
            };

            // verifica colisiones
            if (!this.movementController.isValidPosition(nextPos)) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            currentPos = nextPos;

            // renderizado en pantalla
            const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

            // convierto posicion logica a coordenadas de pantalla
            const iso = toIsometric(currentPos);
            const screenX = (iso.x + horizontalIsoOffset) * scale;
            const screenY = (iso.y + verticalIsoOffset) * scale;

            const visualWidth = CHAR_SPRITE_WIDTH * scale;
            const visualHeight = CHAR_SPRITE_HEIGHT * scale;
            const FOOT_ADJUSTMENT = visualHeight * 0.1;

            // posiciono el elemento en el dom
            character.style.left =
                `${screenX - visualWidth / 2 + GLOBAL_COLLISION_OFFSET_X * scale}px`;

            character.style.top =
                `${screenY - visualHeight + FOOT_ADJUSTMENT + GLOBAL_COLLISION_OFFSET_Y * scale}px`;

            character.style.zIndex = Math.floor(screenY);

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }
}