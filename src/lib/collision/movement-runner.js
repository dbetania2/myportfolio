import { toIsometric } from './coords.js';
import {
    CHAR_SPRITE_WIDTH,
    CHAR_SPRITE_HEIGHT
} from './config.js';

import { drawCharacterHitbox } from './manager.js';

export class MovementRunner {
    constructor(movementController) {
        this.movementController = movementController;
        this.isMoving = false;
        this.speed = 0.6; // Velocidad en unidades logicas
    }

    move(character, startPos, targetPos, renderParams) {
        if (this.isMoving) return;
        this.isMoving = true;

        let currentPos = { ...startPos };
        let lastDistance = Infinity;

        const step = () => {
            const dx = targetPos.x - currentPos.x;
            const dy = targetPos.y - currentPos.y;
            const dist = Math.hypot(dx, dy);

            // Condicion de parada: llegada al destino
            if (dist < this.speed) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            // Calculo de direccion visual para animacion
            const isoMove = toIsometric({ x: dx, y: dy });
            const direction =
                Math.abs(isoMove.x) > Math.abs(isoMove.y)
                    ? isoMove.x > 0 ? 'right' : 'left'
                    : isoMove.y > 0 ? 'down' : 'up';

            character.className = `character ${direction}`;

            // Calculo de proximo paso logico
            const stepX = (dx / dist) * this.speed;
            const stepY = (dy / dist) * this.speed;

            const tryX = { x: currentPos.x + stepX, y: currentPos.y };
            const tryY = { x: currentPos.x, y: currentPos.y + stepY };

            let moved = false;

            // Validacion de colisiones en el mundo logico (Capa 1)
            if (this.movementController.isValidPosition(tryX)) {
                currentPos.x = tryX.x;
                moved = true;
            }

            if (this.movementController.isValidPosition(tryY)) {
                currentPos.y = tryY.y;
                moved = true;
            }

            // Si se bloquea contra una pared, detener movimiento
            if (!moved) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            // Prevencion de deslizamiento infinito
            const newDistance = Math.hypot(targetPos.x - currentPos.x, targetPos.y - currentPos.y);
            if (newDistance >= lastDistance - 0.01) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }
            lastDistance = newDistance;

            // ------------------------------------------------------
            // RENDER VISUAL DESACOPLADO (Capa 3)
            // ------------------------------------------------------
            const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

            // Convertimos posicion logica actual a isometrica
            const iso = toIsometric(currentPos);

            // Aplicamos unicamente los offsets de renderizado centralizados
            const screenX = (iso.x + horizontalIsoOffset) * scale;
            const screenY = (iso.y + verticalIsoOffset) * scale;

            // Calculo de dimensiones escaladas del sprite
            const visualWidth = CHAR_SPRITE_WIDTH * scale;
            const visualHeight = CHAR_SPRITE_HEIGHT * scale;
            
            // Ajuste para que el punto de colision este en los pies del sprite
            const FOOT_ADJUSTMENT = visualHeight * 0.1;

            // Posicionamiento final en el DOM
            character.style.left = `${screenX - (visualWidth / 2)}px`;
            character.style.top = `${screenY - visualHeight + FOOT_ADJUSTMENT}px`;

            // El z-index se basa en la profundidad isometrica
            character.style.zIndex = Math.floor(screenY);

            // Dibujar hitbox de debug si el modo esta activo
            const hitbox = this.movementController.getHitbox?.();
            if (hitbox) {
                drawCharacterHitbox(
                    hitbox,
                    character.parentElement,
                    renderParams
                );
            }

            requestAnimationFrame(step);
        };

        requestAnimationFrame(step);
    }
}