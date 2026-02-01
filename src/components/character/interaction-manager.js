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

    // agrego el evento de click usando la fase de captura para interceptarlo antes de que llegue al sistema de movimiento
    mapContainerElement.addEventListener('click', handleClick, true);
}

function handleClick(event) {
    if (!mapContainerElement) return;

    const rect = mapContainerElement.getBoundingClientRect();
    
    // calculo la posicion del click relativa al contenedor del mapa
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    // ajusto las coordenadas segun la escala y el desplazamiento isometrico
    const isoX = (clickX / scale) - horizontalIsoOffset;
    const isoY = (clickY / scale) - verticalIsoOffset;

    // convierto el punto final a coordenadas cartesianas de mi mundo
    const worldPoint = toCartesian({ isoX, isoY });

    // creo una hitbox cuadrada muy pequeña justo donde hice click para detectar colisiones precisas
    const hitbox = new SAT.Polygon(
        new SAT.Vector(worldPoint.x, worldPoint.y),
        [
            new SAT.Vector(0, 0),
            new SAT.Vector(1, 0),
            new SAT.Vector(1, 1),
            new SAT.Vector(0, 1),
        ]
    );

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