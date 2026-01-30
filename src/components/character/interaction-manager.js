//interaction-manager.js
import * as SAT from 'sat';
import { toCartesian } from '../../lib/collision/coords.js';
import { SCALE, MAP_WIDTH, MAP_HEIGHT } from '../../lib/collision/config.js';
import { getInteractedObject } from '../../lib/collision/manager.js';

let mapContainerElement = null;
let debugRenderParams = null;

const baseOffsetX = MAP_WIDTH / (2 * SCALE);
const baseOffsetY = MAP_HEIGHT / (4 * SCALE);
const horizontalIsoOffset = baseOffsetX + (89 - baseOffsetX);
const verticalIsoOffset = baseOffsetY + (-73 - baseOffsetY);

/**
 * Funcion que maneja el clic del usuario en el mapa.
 * @param {MouseEvent} event
 */
function handleClick(event) {
    if (!mapContainerElement) return;
    
    const rect = mapContainerElement.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const isoX = (clickX / SCALE) - horizontalIsoOffset;
    const isoY = (clickY / SCALE) - verticalIsoOffset;
    
    const clickPoint = toCartesian({ isoX, isoY });
    
    const clickPolygon = new SAT.Polygon(new SAT.Vector(clickPoint.x, clickPoint.y), [
        new SAT.Vector(0, 0),
        new SAT.Vector(1, 0),
        new SAT.Vector(1, 1),
        new SAT.Vector(0, 1),
    ]);

    const clickedObject = getInteractedObject(clickPolygon);

    if (clickedObject) {
        event.stopImmediatePropagation();
        
        const interactionEvent = new CustomEvent('object-interacted', {
            detail: {
                type: clickedObject.type
            },
            bubbles: true
        });
        document.dispatchEvent(interactionEvent);
        
        return true;
    }
    
    return false;
}

/**
 * Inicializa el gestor de interacciones.
 * @param {HTMLElement} mapContainer - El contenedor principal del mapa.
 */
export function initInteractionManager(mapContainer) {
    if (!mapContainer) {
        console.error(" El contenedor del mapa no se encontró. No se puede inicializar el gestor de interacciones.");
        return;
    }
    
    mapContainerElement = mapContainer;
    mapContainerElement.addEventListener('click', handleClick, true);
}