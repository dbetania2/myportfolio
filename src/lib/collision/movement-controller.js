// src/lib/collision/movement-controller.js
import * as SAT from 'sat';
import { canMoveTo } from './manager.js';

export class MovementController {

    constructor() {
        // Hitbox de los pies
        this.HITBOX_SIZE = 10;

        // Offset fino para que el hitbox quede en los pies reales
        this.BASE_OFFSET_X = -10;
        this.BASE_OFFSET_Y = 3;
    }

    /**
     * Crea el hitbox SAT del personaje en una posición cartesiana
     */
    createCharacterHitbox(targetPos) {
        return new SAT.Polygon(
            new SAT.Vector(
                targetPos.x + this.BASE_OFFSET_X,
                targetPos.y + this.BASE_OFFSET_Y
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
     * Determina si el personaje puede moverse a esa posición
     * - Debe estar sobre piso
     * - No debe chocar con obstáculos
     */
    isValidPosition(targetPos) {
        const hitbox = this.createCharacterHitbox(targetPos);
        return canMoveTo(hitbox);
    }
}
