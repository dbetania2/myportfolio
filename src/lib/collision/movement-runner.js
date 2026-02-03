import { toIsometric } from './coords.js';
import {
    GLOBAL_COLLISION_OFFSET_X,
    GLOBAL_COLLISION_OFFSET_Y,
    CHAR_SPRITE_WIDTH,
    CHAR_SPRITE_HEIGHT
} from './config.js';

import { drawCharacterHitbox } from './manager.js';

export class MovementRunner {
    constructor(movementController) {
        this.movementController = movementController;
        this.isMoving = false;
        this.speed = 0.6;
    }

    move(character, startPos, targetPos, renderParams) {
        if (this.isMoving) return;
        this.isMoving = true;

        let currentPos = { ...startPos };
        let lastDistance = Infinity; // 🔑 anti-bug deslizamiento

        const step = () => {
            const dx = targetPos.x - currentPos.x;
            const dy = targetPos.y - currentPos.y;
            const dist = Math.hypot(dx, dy);

            if (dist < this.speed) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            // Dirección visual
            const isoMove = toIsometric({ x: dx, y: dy });
            const direction =
                Math.abs(isoMove.x) > Math.abs(isoMove.y)
                    ? isoMove.x > 0 ? 'right' : 'left'
                    : isoMove.y > 0 ? 'down' : 'up';

            character.className = `character ${direction}`;

            // Próximo paso lógico
            const stepX = (dx / dist) * this.speed;
            const stepY = (dy / dist) * this.speed;

            const tryX = { x: currentPos.x + stepX, y: currentPos.y };
            const tryY = { x: currentPos.x, y: currentPos.y + stepY };

            let moved = false;

            if (this.movementController.isValidPosition(tryX)) {
                currentPos.x = tryX.x;
                moved = true;
            }

            if (this.movementController.isValidPosition(tryY)) {
                currentPos.y = tryY.y;
                moved = true;
            }

            //  No se pudo mover → cortar
            if (!moved) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            //  Anti sliding infinito
            const newDx = targetPos.x - currentPos.x;
            const newDy = targetPos.y - currentPos.y;
            const newDistance = Math.hypot(newDx, newDy);

            if (newDistance >= lastDistance - 0.01) {
                character.className = 'character idle';
                this.isMoving = false;
                return;
            }

            lastDistance = newDistance;

            // -------------------------
            // RENDER VISUAL
            // -------------------------
            const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

            const iso = toIsometric(currentPos);
            const screenX = (iso.x + horizontalIsoOffset) * scale;
            const screenY = (iso.y + verticalIsoOffset) * scale;

            const visualWidth = CHAR_SPRITE_WIDTH * scale;
            const visualHeight = CHAR_SPRITE_HEIGHT * scale;
            const FOOT_ADJUSTMENT = visualHeight * 0.1;

            character.style.left =
                `${screenX - visualWidth / 2 + GLOBAL_COLLISION_OFFSET_X * scale}px`;

            character.style.top =
                `${screenY - visualHeight + FOOT_ADJUSTMENT + GLOBAL_COLLISION_OFFSET_Y * scale}px`;

            character.style.zIndex = Math.floor(screenY);

            // Debug hitbox
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
