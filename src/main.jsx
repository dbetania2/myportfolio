// importar la funcion para iniciar el movimiento del personaje
import { initCharacterMovement } from './components/character/character-behavior.js';
// importar la funcion para gestionar las interacciones
import { initInteractionManager } from './components/character/interaction-manager.js';
// importar la funcion para inicializar el sistema de colisiones
import { initCollisionSystem } from './lib/collision/manager.js';

// **Línea de depuración:** Verifica que el evento se está escuchando.
console.log('Main script: Listening for DOMContentLoaded.');

// esperar a que el documento este completamente cargado
document.addEventListener('DOMContentLoaded', async () => {
    // **Línea de depuración:** Verifica que el evento se ha disparado.
    console.log('DOMContentLoaded event fired. Starting initialization...');

    // obtener el elemento contenedor del mapa
    const mapContainer = document.getElementById('map-container');
    if (!mapContainer) {
        // registrar un error si el contenedor no existe
        console.error("Error: No se encontró el contenedor del mapa.");
        return;
    }

    // **Línea de depuración:** Confirma que el contenedor del mapa fue encontrado.
    console.log('Map container found. Initializing systems.');

    // inicializar el sistema de colisiones de forma asincrona
    console.log('Initializing collision system...');
    await initCollisionSystem(mapContainer);
    // **Línea de depuración:** Confirma que el sistema de colisiones se ha inicializado.
    console.log('Collision system initialized.');

    // inicializar el comportamiento de movimiento del personaje
    console.log('Initializing character movement...');
    initCharacterMovement(mapContainer);
    // **Línea de depuración:** Confirma que el movimiento del personaje se ha inicializado.
    console.log('Character movement initialized.');

    // inicializar el gestor de interacciones
    console.log('Initializing interaction manager...');
    initInteractionManager(mapContainer);
    // **Línea de depuración:** Confirma que el gestor de interacciones se ha inicializado.
    console.log('Interaction manager initialized.');

    // obtener el boton para cerrar la ventana del icono
    const closeButton = document.getElementById('closeIconWindow');
    if (closeButton) {
        console.log('Close button found. Adding click listener.');
        // añadir un evento de click para cerrar la ventana
        closeButton.addEventListener('click', closeIconWindow);
    } else {
        console.log('Close button not found.');
    }

    // obtener la ruta actual de la ventana
    const path = window.location.pathname;
    // **Línea de depuración:** Muestra la ruta actual y el estado de autoOpen.
    console.log(`Current path: ${path}`);

    // definir un objeto para mapear rutas a ventanas
    const autoOpen = {
        '/aboutme': 'aboutMeWindow',
        '/projects': 'projectsWindow',
        '/contact': 'contactWindow'
    };
    // verificar si la ruta coincide con una ventana para abrirla automaticamente
    if (autoOpen[path]) {
        // **Línea de depuración:** Confirma que se abrirá una ventana.
        console.log(`Auto-opening window for path: ${path}`);
        toggleWindow(autoOpen[path]);
    } else {
        console.log('No window to auto-open.');
    }
});