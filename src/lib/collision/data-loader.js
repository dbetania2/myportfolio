// src/lib/collision/data-loader.js
import * as SAT from 'sat';

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
      const res = await fetch('/maps/nuevascolisiones.json');
      const data = await res.json();

      obstacles = [];
      interactables = [];
      walkables = [];

      // ---- INTERACTABLES ----
      const interactiveLayer = data.layers.find(l => l.name === 'InteractiveObjects');
      if (interactiveLayer?.objects) {
        for (const obj of interactiveLayer.objects) {
          if (!obj.polygon) continue;

          const points = obj.polygon.map(p => new SAT.Vector(p.x, p.y));
          const typeProp = obj.properties?.find(p => p.name === 'type');

          if (typeProp?.value) {
            interactables.push({
              satShape: new SAT.Polygon(
                new SAT.Vector(obj.x, obj.y),
                points
              ),
              type: typeProp.value
            });
          }
        }
      }

      // ---- WALKABLE AREAS (PISO) ----
      const walkableLayer = data.layers.find(l => l.name === 'WalkableAreas');
      if (walkableLayer?.objects) {
        for (const obj of walkableLayer.objects) {
          if (!obj.polygon) continue;

          const points = obj.polygon.map(p => new SAT.Vector(p.x, p.y));

          walkables.push({
            satShape: new SAT.Polygon(
              new SAT.Vector(obj.x, obj.y),
              points
            )
          });
        }
      }

      console.log(`🟩 Walkables: ${walkables.length}`);
      console.log(`🟥 Obstacles: ${obstacles.length}`);
      console.log(`🟣 Interactables: ${interactables.length}`);

      return { obstacles, interactables, walkables };

    } catch (err) {
      console.error('❌ Error al cargar colisiones:', err);
      return { obstacles: [], interactables: [], walkables: [] };
    }
  })();

  return loadingPromise;
}
