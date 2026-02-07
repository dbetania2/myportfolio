import * as SAT from 'sat';
import { toCartesian } from '../../lib/collision/coords.js';
import { getInteractedObject } from '../../lib/collision/manager.js';

// Importamos la función para saber dónde está el personaje ahora mismo
// Asegúrate de que la ruta sea correcta según tu estructura de carpetas
import { getCharacterPosition } from '../../components/character/character-behavior.js';

let mapContainerElement = null;
let renderParams = null;

/**
 * Inicializa el gestor de interacciones.
 * @param {HTMLElement} mapContainer - El div que contiene el juego.
 * @param {Object} params - Parámetros de renderizado (scale, offsets).
 */
export function initInteractionManager(mapContainer, params) {
    if (!mapContainer || !params) {
        console.error('❌ InteractionManager: Faltan argumentos de inicialización');
        return;
    }

    mapContainerElement = mapContainer;
    renderParams = params;

    // Usamos 'true' (capture phase) para interceptar el evento antes que nadie
    mapContainerElement.addEventListener('click', handleClick, true);
    mapContainerElement.addEventListener('mousemove', handleMouseMove);
}

/**
 * Crea un polígono SAT (Hitbox) en el punto donde hizo click el mouse.
 */
function createHitbox(event) {
    const rect = mapContainerElement.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    const isoX = (x / scale) - horizontalIsoOffset;
    const isoY = (y / scale) - verticalIsoOffset;

    const worldPoint = toCartesian({ isoX, isoY });

    // Creamos un cuadrado pequeño de 1x1 en el punto del click
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

/**
 * DETECCIÓN DINÁMICA DEL PERSONAJE
 * Calcula si el click fue cerca de la posición actual de Daiana.
 */
function isClickingCharacter(event) {
    const rect = mapContainerElement.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    // Convertir click de pantalla a Coordenadas del Mundo (Cartesianas)
    const isoX = (mouseX / scale) - horizontalIsoOffset;
    const isoY = (mouseY / scale) - verticalIsoOffset;
    const clickPoint = toCartesian({ isoX, isoY });

    // Obtener posición actual del personaje (desde el otro archivo)
    const charPos = getCharacterPosition();

    if (!charPos) return false;

    //  Calcular distancia (Euclidiana)
    // d = raíz((x2-x1)² + (y2-y1)²)
    const distance = Math.sqrt(
        Math.pow(clickPoint.x - charPos.x, 2) + 
        Math.pow(clickPoint.y - charPos.y, 2)
    );

    // Si el click está a menos de 0.9 unidades del centro del personaje, es un hit.
    // Ajusta este valor si el área de click es muy chica o muy grande.
    return distance < 0.9; 
}

/**
 * SEMÁFORO DE INTERFAZ
 * Devuelve true si el mouse está encima de una ventana de React.
 */
function isHoveringInterface(event) {
    // Lista de clases que bloquean el juego
    const blockingClasses = [
        '.whiteboard-overlay',  // Pizarrón
        '.lightbox-overlay',    // Zoom de fotos
        '.screen-overlay',      // PC Pantalla negra de fondo
        '.iconwindow-overlay',  // Ventanas (Proyectos, Sobre mí)
        '.project-detail-page', // Detalle de proyecto
        '.dialogue-overlay',    // Caja de diálogo (NUEVO)
        '.dialogue-box'         // Caja de diálogo interna
    ];

    // Si el target del evento está dentro de alguna de esas clases...
    return blockingClasses.some(cls => event.target.closest(cls));
}

/**
 * MANEJO DEL CURSOR (Hover)
 */
function handleMouseMove(event) {
    if (!mapContainerElement) return;

    // Si estamos sobre interfaz, cursor normal
    if (isHoveringInterface(event)) {
        mapContainerElement.style.cursor = 'default';
        return;
    }

    const hitbox = createHitbox(event);
    const interactedObject = getInteractedObject(hitbox);

    // Si estamos sobre un objeto estático O sobre el personaje
    if (interactedObject || isClickingCharacter(event)) {
        mapContainerElement.style.cursor = 'pointer'; 
    } else {
        mapContainerElement.style.cursor = 'default'; 
    }
}

/**
 * MANEJO DEL CLICK
 */
function handleClick(event) {
    if (!mapContainerElement) return;

    // Si clickeamos una ventana abierta, ignoramos la lógica del juego
    if (isHoveringInterface(event)) {
        return; 
    }

    //  Revisar Objetos Estáticos (PC, Pizarrón)
    const hitbox = createHitbox(event);
    const interactedObject = getInteractedObject(hitbox);

    if (interactedObject) {
        // Evitamos que el personaje camine hacia el objeto
        event.stopImmediatePropagation();

        // Avisamos a React que abra la ventana correspondiente
        document.dispatchEvent(
            new CustomEvent('object-interacted', {
                detail: { type: interactedObject.type },
                bubbles: true,
            })
        );
        return;
    }

    // Revisar Personaje (Daiana)
    if (isClickingCharacter(event)) {
        console.log("💬 Click en el personaje detectado.");
        
        // Evitamos que el personaje camine hacia sí mismo
        event.stopImmediatePropagation();

        // Avisamos a React que abra el Diálogo
        document.dispatchEvent(
            new CustomEvent('object-interacted', {
                detail: { type: 'character' },
                bubbles: true,
            })
        );
        return;
    }
    
   
}