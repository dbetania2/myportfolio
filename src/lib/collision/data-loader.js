import * as SAT from 'sat';

let obstacles = [];
let interactables = [];
let walkables = [];
let loadingPromise = null;

export async function loadCollisionData() {
    if (loadingPromise) return loadingPromise;

    loadingPromise = (async () => {
        try {
            const res = await fetch('/maps/colisionesNUEVAS.json');
            const data = await res.json();

            obstacles = [];
            interactables = [];
            walkables = [];

            // Procesar capas de objetos
            data.layers.forEach(layer => {
                if (!layer.objects) return;

                layer.objects.forEach(obj => {
                    if (!obj.polygon) return;

                    // Puntos relativos al objeto
                    const points = obj.polygon.map(p => new SAT.Vector(p.x, p.y));
                    
                    // Posicion pura de Tiled sin offsets visuales
                    const pos = new SAT.Vector(obj.x, obj.y);
                    const satShape = new SAT.Polygon(pos, points);

                    if (layer.name === 'InteractiveObjects') {
                        const typeProp = obj.properties?.find(p => p.name === 'type');
                        interactables.push({
                            satShape: satShape,
                            type: typeProp ? typeProp.value : "default"
                        });
                    } else if (layer.name === 'WalkableAreas') {
                        walkables.push({ satShape });
                    }
                });
            });

            return { obstacles, interactables, walkables };
        } catch (err) {
            console.error('Error al cargar datos:', err);
            return { obstacles: [], interactables: [], walkables: [] };
        }
    })();

    return loadingPromise;
}