import * as SAT from 'sat';

// Offset técnico previo (si lo seguís usando)
import {
  GLOBAL_COLLISION_OFFSET_X,
  GLOBAL_COLLISION_OFFSET_Y
} from './config.js';

/**
 * ======================================================
 * AJUSTE VISUAL DEL MAPA DE COLISIONES (A OJO)
 * ------------------------------------------------------
 * Estas variables se piensan en PANTALLA:
 *  - X: izquierda (-) / derecha (+)
 *  - Y: arriba (-) / abajo (+)
 *
 * NO pensar en isométrico.
 * NO tocar lógica.
 * SOLO acomodar visualmente.
 * ======================================================
 */
export const AJUSTE_MAPA_X = 0;
export const AJUSTE_MAPA_Y = 20;

/**
 * Convierte el ajuste visual (pantalla)
 * a desplazamiento real isométrico (mundo)
 */
function obtenerOffsetIsometrico() {
  return {
    x: (AJUSTE_MAPA_X + AJUSTE_MAPA_Y) / 2,
    y: (AJUSTE_MAPA_Y - AJUSTE_MAPA_X) / 2
  };
}

let obstacles = [];
let interactables = [];
let walkables = [];
let loadingPromise = null;

/**
 * Carga el archivo JSON de colisiones
 * Se ejecuta UNA sola vez
 */
export async function loadCollisionData() {
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    try {
      const res = await fetch('/maps/colisionesNUEVAS.json');
      const data = await res.json();

      obstacles = [];
      interactables = [];
      walkables = [];

      // 🔑 Offset visual convertido a mundo isométrico
      const ajusteIso = obtenerOffsetIsometrico();

      // =========================
      // INTERACTABLES
      // =========================
      const interactiveLayer = data.layers.find(
        l => l.name === 'InteractiveObjects'
      );

      if (interactiveLayer?.objects) {
        for (const obj of interactiveLayer.objects) {
          if (!obj.polygon) continue;

          const points = obj.polygon.map(
            p => new SAT.Vector(p.x, p.y)
          );

          const typeProp = obj.properties?.find(
            p => p.name === 'type'
          );

          if (!typeProp?.value) continue;

          interactables.push({
            satShape: new SAT.Polygon(
              new SAT.Vector(
                obj.x
                  + GLOBAL_COLLISION_OFFSET_X
                  + ajusteIso.x,
                obj.y
                  + GLOBAL_COLLISION_OFFSET_Y
                  + ajusteIso.y
              ),
              points
            ),
            type: typeProp.value
          });
        }
      }

      // =========================
      // WALKABLE AREAS (PISO)
      // =========================
      const walkableLayer = data.layers.find(
        l => l.name === 'WalkableAreas'
      );

      if (walkableLayer?.objects) {
        for (const obj of walkableLayer.objects) {
          if (!obj.polygon) continue;

          const points = obj.polygon.map(
            p => new SAT.Vector(p.x, p.y)
          );

          walkables.push({
            satShape: new SAT.Polygon(
              new SAT.Vector(
                obj.x
                  + GLOBAL_COLLISION_OFFSET_X
                  + ajusteIso.x,
                obj.y
                  + GLOBAL_COLLISION_OFFSET_Y
                  + ajusteIso.y
              ),
              points
            )
          });
        }
      }

      console.log(`🟩 Walkables: ${walkables.length}`);
      console.log(`🟣 Interactables: ${interactables.length}`);

      return { obstacles, interactables, walkables };

    } catch (err) {
      console.error('❌ Error al cargar colisiones:', err);
      return {
        obstacles: [],
        interactables: [],
        walkables: []
      };
    }
  })();

  return loadingPromise;
}
