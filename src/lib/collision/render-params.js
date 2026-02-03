// src/lib/collision/render-params.js
import { 
    VISUAL_SCALE, 
    VIEWPORT_WIDTH 
} from './config.js';

export function getRenderParams() {
    return {
        // La escala que usará todo el sistema de colisiones
        scale: VISUAL_SCALE, 
        
        // SOLO centramos la cámara. 
       
        horizontalIsoOffset: (VIEWPORT_WIDTH / 2) / VISUAL_SCALE, 
        
        verticalIsoOffset: 0 
    };
}