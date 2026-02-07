// character-behavior.js
// esta clase controla el comportamiento de mi personaje, inicializa el sistema de colisiones y maneja el movimiento cuando hago click en el mapa

import { initCollisionSystem } from '../../lib/collision/manager.js';
import { toCartesian } from '../../lib/collision/coords.js';
import { initInteractionManager } from '../character/interaction-manager.js';
import { MovementController } from '../../lib/collision/movement-controller.js';
import { MovementRunner } from '../../lib/collision/movement-runner.js';

// instancio los controladores necesarios para gestionar el movimiento
const movementController = new MovementController();
const movementRunner = new MovementRunner(movementController);
export function getCharacterPosition() {
    return logicalPosition;
}
// defino mi posicion logica inicial en 0,0
let logicalPosition = { x: 0, y: 0 };

export async function initCharacterMovement(mapContainer) {
    // obtengo la referencia al elemento del personaje
    const character = document.getElementById('character');
    
    // si no encuentro el personaje o el contenedor, no hago nada
    if (!character || !mapContainer) return;

    // inicializo el sistema de colisiones y guardo los parametros de renderizado
    const renderParams = await initCollisionSystem(mapContainer);
    
    // inicio el gestor de interacciones pasandole los parametros necesarios
    initInteractionManager(mapContainer, renderParams);

    // escucho los clicks en el contenedor del mapa
    mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        
        // calculo las coordenadas del click relativas al contenedor
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;

        const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

        // normalizo las coordenadas aplicando la escala y el offset isometrico
        const isoX = (clickX / scale) - horizontalIsoOffset;
        const isoY = (clickY / scale) - verticalIsoOffset;

        // convierto las coordenadas a cartesianas para obtener el destino
        const targetPos = toCartesian({ isoX, isoY });

        // ejecuto el movimiento progresivo hacia la posicion destino
        movementRunner.move(
            character,
            logicalPosition,
            targetPos,
            renderParams
        );

        // actualizo mi posicion logica actual al nuevo destino
        logicalPosition = targetPos;
    });
}