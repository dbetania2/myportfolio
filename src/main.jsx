import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Inicializa la aplicación React en el elemento root
const rootElement = document.getElementById('root');
if (rootElement) {
  // Usa ReactDOM para crear un root y renderiza el componente App dentro de él
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} else {
  // Si no se encuentra el elemento root, muestra un error en la consola
  console.error("No se encontró el elemento root para montar la aplicación React.");
}

// Función para mostrar u ocultar ventanas
const toggleWindow = (id) => {
  // Lista de IDs de ventanas que se deben controlar
  const windows = ['aboutMeWindow', 'projectsWindow', 'contactWindow'];
  let anyWindowVisible = false;

  // Itera sobre cada ID de ventana
  windows.forEach(windowId => {
    // Busca el elemento de la ventana por ID
    const el = document.getElementById(windowId);
    if (el) {
      // Muestra la ventana cuyo ID coincide y oculta las demás
      el.style.display = windowId === id ? 'block' : 'none';
      if (windowId === id) {
        anyWindowVisible = true; // Marca que al menos una ventana está visible
      }
    }
  });

  // Busca el contenedor de la ventana de iconos
  const iconWindowContainer = document.querySelector('.iconwindow-overlay');
  if (iconWindowContainer) {
    // Muestra u oculta el contenedor de la ventana de iconos según si alguna ventana está visible
    iconWindowContainer.classList.toggle('show', anyWindowVisible);
  }
};

// Escuchar el evento personalizado
window.addEventListener('toggleWindow', (event) => {
  // Obtiene el ID de la ventana del evento
  const windowId = event.detail;
  // Llama a la función para mostrar u ocultar la ventana
  toggleWindow(windowId);
});

// Función para cerrar la ventana
const closeIconWindow = () => {
  // Busca el contenedor de la ventana de iconos
  const iconWindowContainer = document.querySelector('.iconwindow-overlay');
  if (iconWindowContainer) {
    // Elimina la clase 'show' para ocultar la ventana de iconos
    iconWindowContainer.classList.remove('show');
  }

  // Lista de IDs de ventanas que se deben ocultar
  const windows = ['aboutMeWindow', 'projectsWindow', 'contactWindow'];
  // Itera sobre cada ID de ventana
  windows.forEach(windowId => {
    // Busca el elemento de la ventana por ID
    const el = document.getElementById(windowId);
    if (el) {
      // Oculta la ventana
      el.style.display = 'none';
    }
  });
};

// Agregar evento de clic al botón de cierre
document.addEventListener('DOMContentLoaded', () => {
  // Espera a que el DOM se cargue completamente
  const closeButton = document.getElementById('closeIconWindow');
  if (closeButton) {
    // Agrega un manejador de clics al botón de cierre
    closeButton.addEventListener('click', closeIconWindow);
  }
});






