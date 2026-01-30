//character-behavior.js
import * as SAT from 'sat';
import { initCollisionSystem, checkCollision, drawCharacterHitbox } from '../../lib/collision/manager.js';
import { toIsometric, toCartesian } from '../../lib/collision/coords.js';

let characterPolygon;

/**
 * Inicializa el movimiento del personaje.
 */
export async function initCharacterMovement(mapContainer) {
    const character = document.getElementById('character');
    
    if (!character || !mapContainer) {
        console.error("No se encontraron los elementos 'character' o 'map-container'.");
        return;
    }

    // Ahora siempre recibimos renderParams válidos, debug o no
    const renderParams = await initCollisionSystem(mapContainer);

    mapContainer.addEventListener('click', (e) => {
        const rect = mapContainer.getBoundingClientRect();
        const charWidth = character.offsetWidth;
        const charHeight = character.offsetHeight;

        const currentX = parseFloat(character.style.left) || 0;
        const currentY = parseFloat(character.style.top) || 0;

        const clickXRelativeToMap = e.clientX - rect.left;
        const clickYRelativeToMap = e.clientY - rect.top;

        const { scale, horizontalIsoOffset, verticalIsoOffset } = renderParams;

        const isoClickX_BeforeOffsets = (clickXRelativeToMap / scale) - horizontalIsoOffset;
        const isoClickY_BeforeOffsets = (clickYRelativeToMap / scale) - verticalIsoOffset;

        const targetTiledPos = toCartesian({ isoX: isoClickX_BeforeOffsets, isoY: isoClickY_BeforeOffsets });

        const FEET_HITBOX_WIDTH_PX = charWidth * 0.2;
        const FEET_HITBOX_HEIGHT_PX = charHeight * 0.2;
        const FEET_Y_OFFSET_FROM_SPRITE_BOTTOM = 2;

        const isoCharDisplayPos = toIsometric(targetTiledPos);

        const idealFeetBaseCSS_X = (isoCharDisplayPos.x + horizontalIsoOffset) * scale;
        const idealFeetBaseCSS_Y = (isoCharDisplayPos.y + verticalIsoOffset) * scale;

        const targetX_raw = idealFeetBaseCSS_X - (charWidth / 2);
        const targetY_raw = idealFeetBaseCSS_Y - (charHeight - (FEET_HITBOX_HEIGHT_PX + FEET_Y_OFFSET_FROM_SPRITE_BOTTOM));

        const X_VISUAL_ADJUSTMENT_PX = -50;
        const Y_VISUAL_ADJUSTMENT_PX = -100;

        let targetX = targetX_raw + X_VISUAL_ADJUSTMENT_PX;
        let targetY = targetY_raw + Y_VISUAL_ADJUSTMENT_PX;

        characterPolygon = new SAT.Box(
            new SAT.Vector(targetTiledPos.x, targetTiledPos.y),
            FEET_HITBOX_WIDTH_PX,
            FEET_HITBOX_HEIGHT_PX
        ).toPolygon();

        drawCharacterHitbox(characterPolygon, mapContainer, renderParams);

        if (!checkCollision(characterPolygon)) {
            console.log('🚧 Fuera del área caminable. Movimiento cancelado.');
            return;
        }

        const direction = Math.abs(targetX - currentX) > Math.abs(targetY - currentY)
            ? targetX > currentX ? 'right' : 'left'
            : targetY > currentY ? 'down' : 'up';

        character.className = `character ${direction}`;
        character.style.left = `${targetX}px`;
        character.style.top = `${targetY}px`;

        setTimeout(() => {
            character.className = 'character idle';
        }, 500);
    });
}
