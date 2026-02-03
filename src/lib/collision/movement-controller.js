// src/lib/collision/movement-controller.js
import * as SAT from 'sat';
import { canMoveTo } from './manager.js';

export class MovementController {

    constructor() {
        // Hitbox de pies (pequeño y preciso)
        this.HITBOX_SIZE = 3;

        // Offset fino: pies reales del sprite
        this.BASE_OFFSET_X = -8;
        this.BASE_OFFSET_Y = -5;

        // Hitbox persistente para debug
        this.characterHitbox = null;

        // 🔑 Cantidad de subpasos por frame
        // Más = más preciso | Menos = más rendimiento
        this.SUB_STEPS = 4;
    }

    /**
     * Crea el hitbox SAT del personaje
     */
    createCharacterHitbox(position) {
        return new SAT.Polygon(
            new SAT.Vector(
                position.x + this.BASE_OFFSET_X,
                position.y + this.BASE_OFFSET_Y
            ),
            [
                new SAT.Vector(0, 0),
                new SAT.Vector(this.HITBOX_SIZE, 0),
                new SAT.Vector(this.HITBOX_SIZE, this.HITBOX_SIZE),
                new SAT.Vector(0, this.HITBOX_SIZE)
            ]
        );
    }

    /**
     * 
     * - Divide el movimiento en micro pasos
     * - Valida TODO el recorrido
     * - Corta en el primer contacto
     */
    isValidPosition(targetPos, currentPos = null) {
        // Si no tengo posición actual, valido directo (fallback seguro)
        if (!currentPos) {
            const hitbox = this.createCharacterHitbox(targetPos);
            this.characterHitbox = hitbox;
            return canMoveTo(hitbox);
        }

        const dx = targetPos.x - currentPos.x;
        const dy = targetPos.y - currentPos.y;

        for (let i = 1; i <= this.SUB_STEPS; i++) {
            const stepPos = {
                x: currentPos.x + (dx * i) / this.SUB_STEPS,
                y: currentPos.y + (dy * i) / this.SUB_STEPS
            };

            const hitbox = this.createCharacterHitbox(stepPos);
            this.characterHitbox = hitbox;

            if (!canMoveTo(hitbox)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Exposición controlada para debugger
     */
    getHitbox() {
        return this.characterHitbox;
    }
}
