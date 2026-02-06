// src/lib/interaction/interaction-manager.js
// este modulo se encarga de gestionar mis interacciones con los objetos del mapa, detectando si hago click sobre algo importante antes de procesar el movimiento

import * as SAT from 'sat';
import { toCartesian } from '../../lib/collision/coords.js';
import { getInteractedObject } from '../../lib/collision/manager.js';

let mapContainerElement = null;
let renderParams = null;

export function initInteractionManager(mapContainer, params) {
    // verifico si tengo los elementos necesarios para trabajar, sino aviso del error
    if (!mapContainer || !params) {
        console.error('❌ InteractionManager no inicializado');
        return;
    }

    mapContainerElement = mapContainer;
    renderParams = params;

    // agrego el evento de click usando la fase de captura
    mapContainerElement.addEventListener('click', handleClick, true);
    
    // NUEVO: evento para detectar movimiento y cambiar el cursor
    mapContainerElement.addEventListener('mousemove', handleMouseMove);
}

// NUEVA FUNCIÓN AUXILIAR: Reutilizamos esta lógica para no escribirla dos veces
function createHitbox(event) {
    const rect = mapContainerElement.getBoundingClientRect();
    
    // calculo la posicion relativa al contenedor
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    // ajusto las coordenadas segun la escala y el desplazamiento isometrico
    const isoX = (x / scale) - horizontalIsoOffset;
    const isoY = (y / scale) - verticalIsoOffset;

    // convierto el punto final a coordenadas cartesianas de mi mundo
    const worldPoint = toCartesian({ isoX, isoY });

    // creo una hitbox cuadrada muy pequeña para detectar colisiones precisas
    return new SAT.Polygon(
        new SAT.Vector(worldPoint.x, worldPoint.y),
        [
            new SAT.Vector(0, 0),
            new SAT.Vector(1, 0),
            new SAT.Vector(1, 1),
            new SAT.Vector(0, 1),
        ]
    );
}

// NUEVA FUNCIÓN: Gestiona el cambio visual del cursor
function handleMouseMove(event) {
    if (!mapContainerElement) return;

    const hitbox = createHitbox(event);
    const interactedObject = getInteractedObject(hitbox);

    if (interactedObject) {
        mapContainerElement.style.cursor = 'pointer'; // Manito
    } else {
        mapContainerElement.style.cursor = 'default'; // Cursor normal
    }
}

function handleClick(event) {
    if (!mapContainerElement) return;

    // Uso la función auxiliar para obtener la hitbox
    const hitbox = createHitbox(event);

    // consulto al sistema de colisiones si mi hitbox toca algun objeto interactuable
    const interactedObject = getInteractedObject(hitbox);

    if (interactedObject) {
        // si toque un objeto detengo la propagacion para no caminar hacia el y lanzo el evento de interaccion
        event.stopImmediatePropagation();

        document.dispatchEvent(
            new CustomEvent('object-interacted', {
                detail: { type: interactedObject.type },
                bubbles: true,
            })
        );

        return;
    }
}