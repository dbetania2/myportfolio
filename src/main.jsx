// importar la funcion para iniciar el movimiento del personaje
import { initCharacterMovement } from './components/character/character-behavior.js';
// importar la funcion para gestionar las interacciones
import { initInteractionManager } from './components/character/interaction-manager.js';
// importar la funcion para inicializar el sistema de colisiones
import { initCollisionSystem } from './lib/collision/manager.js';

// esperar a que el documento este completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    // obtener el elemento contenedor del mapa
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        // registrar un error si el contenedor no existe
        console.error("no encontrar el contenedor del mapa.");
        return;
    }

    // inicializar el sistema de colisiones de forma asincrona
    await initCollisionSystem(mapContainer);

    // inicializar el comportamiento de movimiento del personaje
    initCharacterMovement(mapContainer);
    // inicializar el gestor de interacciones
    initInteractionManager(mapContainer);

    // obtener el boton para cerrar la ventana del icono
    const closeButton = document.getElementById('closeIconWindow');
    if (closeButton) {
        // añadir un evento de click para cerrar la ventana
        closeButton.addEventListener('click', closeIconWindow);
    }

    // obtener la ruta actual de la ventana
    const path = window.location.pathname;
    // definir un objeto para mapear rutas a ventanas
    const autoOpen = {
        '/aboutme': 'aboutMeWindow',
        '/projects': 'projectsWindow',
        '/contact': 'contactWindow'
    };
    // verificar si la ruta coincide con una ventana para abrirla automaticamente
    if (autoOpen[path]) {
        toggleWindow(autoOpen[path]);
    }
});