// manager.js
import * as SAT from 'sat';
import { loadCollisionData } from './data-loader.js';
import {
    renderDebugPolygons,
    drawCharacterHitbox as realDrawCharacterHitbox
} from './debugger.js';
import { DEBUG_MODE } from './config.js';
import { getRenderParams } from './render-params.js';

let obstacles = [];
let interactables = [];
let walkables = [];

/**
 * Inicializa el sistema de colisiones
 */
export async function initCollisionSystem(mapContainer) {
    try {
        const data = await loadCollisionData();

        obstacles = data.obstacles || [];
        interactables = data.interactables || [];
        walkables = data.walkables || [];

        const renderParams = getRenderParams();

        if (DEBUG_MODE && mapContainer) {
            renderDebugPolygons(
                mapContainer,
                obstacles,
                interactables,
                walkables,
                renderParams
            );
        }

        return renderParams;
    } catch (error) {
        console.error('❌ Error al inicializar colisiones:', error);
        return getRenderParams();
    }
}

/**
 * 🟥 Colisión dura
 * Devuelve TRUE si el personaje choca con un obstáculo
 */
export function hasHardCollision(charPolygon) {
    for (const obstacle of obstacles) {
        if (SAT.testPolygonPolygon(charPolygon, obstacle.satShape)) {
            return true;
        }
    }
    return false;
}

/**
 * 🟩 Piso caminable
 * Devuelve TRUE si el personaje está sobre un área caminable
 */
export function isOnWalkable(charPolygon) {
    for (const floor of walkables) {
        if (SAT.testPolygonPolygon(charPolygon, floor.satShape)) {
            return true;
        }
    }
    return false;
}

/**
 * ✅ Validación final de movimiento
 * - NO debe chocar con obstáculos
 * - SÍ debe estar sobre piso
 */
export function canMoveTo(charPolygon) {
    if (hasHardCollision(charPolygon)) return false;
    if (!isOnWalkable(charPolygon)) return false;
    return true;
}

/**
 * 🟣 Interacciones
 */
export function getInteractedObject(charPolygon) {
    for (const interactable of interactables) {
        if (SAT.testPolygonPolygon(charPolygon, interactable.satShape)) {
            return interactable;
        }
    }
    return null;
}

/**
 * Debug seguro del hitbox del personaje
 */
export function drawCharacterHitbox(charPoly, mapContainer, renderParams) {
    if (DEBUG_MODE) {
        realDrawCharacterHitbox(charPoly, mapContainer, renderParams);
    }
}
