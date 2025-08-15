// src/lib/collision/data-loader.js

import * as SAT from 'sat';
import {
  GLOBAL_COLLISION_OFFSET_X,
  GLOBAL_COLLISION_OFFSET_Y
} from './config.js';

let obstacles = [];
let interactables = [];
let loadingPromise = null;

/**
 * Carga el archivo JSON de colisiones, lo procesa y devuelve los polígonos.
 * Esta función está diseñada para ser llamada una sola vez.
 * @returns {Promise<{obstacles: SAT.Polygon[], interactables: Array<{satShape: SAT.Polygon, type: string}>}>}
 */
export async function loadCollisionData() {
  if (loadingPromise) {
    return loadingPromise;
  }

  loadingPromise = (async () => {
    try {
      const res = await fetch('/maps/nuevascolisiones.json');
      const data = await res.json();

      const interactiveLayer = data.layers.find(l => l.name === 'InteractiveObjects');
      if (interactiveLayer?.objects) {
        for (const obj of interactiveLayer.objects) {
          if (!obj.polygon) continue;
          const points = obj.polygon.map(p => new SAT.Vector(p.x, p.y));
          const objectTypeProp = obj.properties?.find(p => p.name === 'type');

          if (objectTypeProp?.value) {
            interactables.push({
              satShape: new SAT.Polygon(
                new SAT.Vector(obj.x + GLOBAL_COLLISION_OFFSET_X, obj.y + GLOBAL_COLLISION_OFFSET_Y),
                points
              ),
              type: objectTypeProp.value
            });
          }
        }
      }

      const walkableLayer = data.layers.find(l => l.name === 'WalkableAreas');
      if (walkableLayer?.objects) {
        for (const obj of walkableLayer.objects) {
          if (!obj.polygon) continue;
          const points = obj.polygon.map(p => new SAT.Vector(p.x, p.y));
          obstacles.push({
            satShape: new SAT.Polygon(
              new SAT.Vector(obj.x + GLOBAL_COLLISION_OFFSET_X, obj.y + GLOBAL_COLLISION_OFFSET_Y),
              points
            )
          });
        }
      }

      console.log('✅ Obstáculos cargados:', obstacles);
      console.log('✅ Objetos interactivos cargados:', interactables);

      return { obstacles, interactables };
    } catch (err) {
      console.error('❌ Error al cargar colisiones:', err);
      return { obstacles: [], interactables: [] };
    }
  })();

  return loadingPromise;
}