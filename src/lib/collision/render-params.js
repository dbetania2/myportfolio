//render-params.js
import { 
    VISUAL_SCALE, 
    VIEWPORT_WIDTH, 
    MAP_OFFSET_X, 
    MAP_OFFSET_Y 
} from './config.js';

export function getRenderParams() {
    return {
        // La escala que usará todo el sistema de colisiones
        scale: VISUAL_SCALE, 
        
        // FÓRMULA HORIZONTAL 
        horizontalIsoOffset: ((VIEWPORT_WIDTH / 2) + MAP_OFFSET_X) / VISUAL_SCALE, 
        
        // FÓRMULA VERTICAL 
        verticalIsoOffset: MAP_OFFSET_Y 
    };
}
