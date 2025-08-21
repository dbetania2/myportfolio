import { SCALE, MAP_WIDTH, MAP_HEIGHT } from './config.js';

export function getRenderParams() {
    const baseOffsetX = MAP_WIDTH / (2 * SCALE);
    const baseOffsetY = MAP_HEIGHT / (4 * SCALE);

    // Estos números "89" y "-73" son los ajustes isométricos actuales
    const horizontalIsoOffset = baseOffsetX + (89 - baseOffsetX);
    const verticalIsoOffset = baseOffsetY + (-73 - baseOffsetY);

    return {
        scale: SCALE,
        horizontalIsoOffset,
        verticalIsoOffset
    };
}
