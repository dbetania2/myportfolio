/*manager.js*/ 
import * as SAT from 'sat';
import { loadCollisionData } from './data-loader.js';
import { renderDebugPolygons, drawCharacterHitbox as realDrawCharacterHitbox } from './debugger.js';
import { DEBUG_MODE } from './config.js';
import { getRenderParams } from './render-params.js';

let obstacles = [];
let interactables = [];

/**
 * Inicializa el sistema de colisión cargando los polígonos.
 * Siempre devuelve los parámetros de renderizado, aunque DEBUG_MODE sea false.
 */
export async function initCollisionSystem(mapContainer) {
    try {
        const data = await loadCollisionData();
        obstacles = data.obstacles;
        interactables = data.interactables;

        const renderParams = getRenderParams();

        if (DEBUG_MODE && mapContainer) {
            renderDebugPolygons(mapContainer, obstacles, interactables, renderParams);
        }

        return renderParams;
    } catch (error) {
        console.error('❌ Error al inicializar el sistema de colisión:', error);
        return getRenderParams(); // Siempre devolvemos algo válido
    }
}

/**
 * Verifica si un polígono del personaje colisiona con algún obstáculo.
 */
export function checkCollision(charPolygon) {
    for (const obstacle of obstacles) {
        const response = new SAT.Response();
        if (SAT.testPolygonPolygon(charPolygon, obstacle.satShape, response)) {
            return true;
        }
    }
    return false;
}

/**
 * Obtiene el objeto interactivo con el que colisiona el polígono del personaje.
 */
export function getInteractedObject(charPolygon) {
    for (const interactable of interactables) {
        const response = new SAT.Response();
        if (SAT.testPolygonPolygon(charPolygon, interactable.satShape, response)) {
            return interactable;
        }
    }
    return null;
}

/**
 * Wrapper seguro de drawCharacterHitbox.
 * Permite que character-behavior siga llamando a la función sin depender de DEBUG_MODE.
 */
export function drawCharacterHitbox(charPoly, mapContainer, renderParams) {
    if (DEBUG_MODE) {
        realDrawCharacterHitbox(charPoly, mapContainer, renderParams);
    }
}
