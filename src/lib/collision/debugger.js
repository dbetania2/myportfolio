/*debugger.js*/ 
import { toIsometric } from './coords.js';
import { DEBUG_MODE } from './config.js';

let debugSvgElement = null;
let characterHitboxSvgElement = null;

/**
 * Dibuja un conjunto de polígonos en el SVG de depuración.
 */
function drawPolygons(polygons, color, strokeColor, renderParams) {
    if (!polygons || polygons.length === 0 || !debugSvgElement) return;

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    polygons.forEach(p => {
        const satPolygon = p.satShape;
        if (!satPolygon || !satPolygon.points) return;

        const polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

        const svgPoints = satPolygon.points.map(point => {
            const iso = toIsometric({
                x: satPolygon.pos.x + point.x,
                y: satPolygon.pos.y + point.y
            });
            const transformedX = (iso.x + horizontalIsoOffset) * scale;
            const transformedY = (iso.y + verticalIsoOffset) * scale;
            return `${transformedX},${transformedY}`;
        }).join(' ');

        polygonElement.setAttribute('points', svgPoints);
        polygonElement.setAttribute('fill', color);
        polygonElement.setAttribute('stroke', strokeColor);
        polygonElement.setAttribute('stroke-width', '1');

        debugSvgElement.appendChild(polygonElement);
    });
}

/**
 * Renderiza los polígonos de depuración para obstáculos e interactivos.
 */
export function renderDebugPolygons(mapContainer, obstacles, interactables, renderParams) {
    if (!mapContainer || !DEBUG_MODE) return;

    if (debugSvgElement) {
        mapContainer.removeChild(debugSvgElement);
    }

    debugSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    debugSvgElement.style.position = 'absolute';
    debugSvgElement.style.left = '0';
    debugSvgElement.style.top = '0';
    debugSvgElement.style.width = '100%';
    debugSvgElement.style.height = '100%';
    debugSvgElement.style.pointerEvents = 'none';
    debugSvgElement.style.zIndex = '2';
    debugSvgElement.setAttribute('width', '100%');
    debugSvgElement.setAttribute('height', '100%');
    debugSvgElement.setAttribute('data-debug-type', 'polygons');

    mapContainer.appendChild(debugSvgElement);

    drawPolygons(obstacles, 'rgba(0, 255, 255, 0.4)', 'blue', renderParams);
    drawPolygons(interactables, 'rgba(255, 0, 255, 0.4)', 'purple', renderParams);
}

/**
 * Dibuja la caja de colisión del personaje (pies) para depuración (caja roja).
 */
export function drawCharacterHitbox(charPoly, mapContainer, renderParams) {
    if (!mapContainer || !charPoly || !renderParams || !DEBUG_MODE) return;

    if (characterHitboxSvgElement) {
        mapContainer.removeChild(characterHitboxSvgElement);
    }

    characterHitboxSvgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    characterHitboxSvgElement.style.position = 'absolute';
    characterHitboxSvgElement.style.left = '0';
    characterHitboxSvgElement.style.top = '0';
    characterHitboxSvgElement.style.width = '100%';
    characterHitboxSvgElement.style.height = '100%';
    characterHitboxSvgElement.style.pointerEvents = 'none';
    characterHitboxSvgElement.style.zIndex = '3';
    characterHitboxSvgElement.setAttribute('width', '100%');
    characterHitboxSvgElement.setAttribute('height', '100%');
    characterHitboxSvgElement.setAttribute('data-debug-type', 'character-hitbox');

    mapContainer.appendChild(characterHitboxSvgElement);

    const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

    const polygonElement = document.createElementNS("http://www.w3.org/2000/svg", "polygon");

    const svgPoints = charPoly.points.map(p => {
        const iso = toIsometric({
            x: charPoly.pos.x + p.x,
            y: charPoly.pos.y + p.y
        });
        const transformedX = (iso.x + horizontalIsoOffset) * scale;
        const transformedY = (iso.y + verticalIsoOffset) * scale;
        return `${transformedX},${transformedY}`;
    }).join(' ');

    polygonElement.setAttribute('points', svgPoints);
    polygonElement.setAttribute('fill', 'rgba(255, 0, 0, 0.6)');
    polygonElement.setAttribute('stroke', 'darkred');
    polygonElement.setAttribute('stroke-width', '1');

    characterHitboxSvgElement.appendChild(polygonElement);
}
