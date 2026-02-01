// src/lib/collision/config.js
// en este archivo guardo todas las constantes de configuracion de mi juego, asegurandome de que la parte visual coincida perfectamente con la logica interna

// activo esto para ver las lineas de las colisiones en pantalla mientras estoy desarrollando
export const DEBUG_MODE = true;

// defino la escala visual, este valor es importante y debe ser igual al que puse en el css para que todo cuadre
export const VISUAL_SCALE = 5; 

// establezco las dimensiones de mi contenedor visual donde se renderiza el mapa
export const VIEWPORT_WIDTH = 800; 
export const VIEWPORT_HEIGHT = 800;

// indico el tamaño original de mi sprite antes de aplicarle cualquier escalado
export const CHAR_SPRITE_WIDTH = 32;
export const CHAR_SPRITE_HEIGHT = 32;

// configuro el tamaño real de mi imagen de fondo
export const MAP_WIDTH = 800; 
export const MAP_HEIGHT = 800;

// defino las dimensiones de los tiles segun como configure mi archivo json en tiled
export const TILE_WIDTH = 64; 
export const TILE_HEIGHT = 32; 

// ajusto estos valores para centrar perfectamente mi caja de colision con el dibujo del personaje
export const GLOBAL_COLLISION_OFFSET_X = -10;
export const GLOBAL_COLLISION_OFFSET_Y = 3;

// uso este valor para calibrar la posicion vertical de las colisiones respecto al grafico del mapa
// si veo que las colisiones estan muy abajo, uso un numero negativo para subirlas
export const MAP_OFFSET_Y = -75;

// uso este valor para calibrar la posicion horizontal
// si necesito mover la logica hacia la derecha, pongo un numero positivo aqui
export const MAP_OFFSET_X = 5;

// controlo la velocidad a la que se mueve mi personaje expresada en pixeles por segundo
export const MOVEMENT_SPEED = 100;