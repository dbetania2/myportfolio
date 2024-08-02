import React, { useEffect } from 'react';
import './PcScreen.css';

const PcScreen = () => {
  // useEffect se ejecuta cuando el componente se monta y se limpia cuando se desmonta
  useEffect(() => {
    // Función que maneja los clics en los iconos
    const handleIconClick = (event) => {
      // Obtiene el ID de la ventana del atributo data-window-id del icono clicado
      const windowId = event.target.dataset.windowId;
      if (windowId) {
        // Crea un evento personalizado con el ID de la ventana como detalle
        const toggleEvent = new CustomEvent('toggleWindow', { detail: windowId });
        // Despacha el evento al objeto window
        window.dispatchEvent(toggleEvent);
      }
    };

    // Agrega el manejador de clics a todos los elementos con la clase 'screen-icon'
    document.querySelectorAll('.screen-icon').forEach(icon => {
      icon.addEventListener('click', handleIconClick);
    });

    // Función de limpieza que elimina el manejador de clics cuando el componente se desmonta
    return () => {
      document.querySelectorAll('.screen-icon').forEach(icon => {
        icon.removeEventListener('click', handleIconClick);
      });
    };
  }, []); // El array vacío asegura que el useEffect se ejecute solo una vez, al montar el componente

  return (
    <div className="pc-screen-content">
      <img 
        src="src/objetos-img/archivospc/aboutme.png"
        alt="Información sobre mí"
        className="screen-icon"
        data-window-id="aboutMeWindow" // Asegúrate que el data-window-id coincide con el id del div correspondiente
      />
      <img 
        src="src/objetos-img/archivospc/aboutme.png"
        alt="Mis Proyectos"
        className="screen-icon"
        data-window-id="projectsWindow" 
      />
      <img 
        src="src/objetos-img/archivospc/aboutme.png"
        alt="Contacto"
        className="screen-icon"
        data-window-id="contactWindow" 
      />
      <div className="power-button"></div>
      <div className="taskbar">
        <div className="taskbar-left">
          <button className="start-button">Inicio</button>
        </div>
      </div>
    </div>
  );
};

export default PcScreen;



















