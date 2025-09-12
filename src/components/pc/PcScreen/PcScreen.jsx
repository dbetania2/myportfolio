// src/components/pc/pcScreen/PcScreen.jsx

import React from 'react';
import './PcScreen.css';

// componente que representa la pantalla de escritorio de la pc
const PcScreen = ({ onNavigate }) => {
  // arreglo de objetos que define los iconos del escritorio
  const icons = [
    { 
      name: 'aboutme', 
      alt: 'Información sobre mí', 
      src: '/src/objetos-img/archivospc/aboutme.png',
      label: 'AboutMe.lnk'
    },
    { 
      name: 'projects', 
      alt: 'Mis Proyectos', 
      src: '/src/objetos-img/archivospc/projects.png',
      label: 'Projects.lnk'
    },

  ];

  return (
    // contenedor principal de la pantalla de escritorio
    <div className="pc-screen-content">
      {/* titulo del escritorio */}
      <h2 style={{color: 'white', marginBottom: '20px'}}>Desktop</h2>
      
      {/* contenedor de los iconos del escritorio */}
      <div style={{display: 'flex', gap: '30px', flexWrap: 'wrap'}}>
        {/* se mapea el arreglo de iconos para renderizar cada uno */}
        {icons.map(icon => (
          // contenedor de un solo icono y su etiqueta
          <div key={icon.name} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            {/* boton que actua como icono y maneja el evento de clic */}
            <button
              className="screen-icon"
              // al hacer clic, se llama a la funcion onNavigate con el nombre del icono
              onClick={() => {
                if (onNavigate) {
                  onNavigate(icon.name);
                }
              }}
            >
              {/* imagen del icono */}
              <img 
                src={icon.src} 
                alt={icon.alt}
                // el ancho y alto se ajustan a la imagen
                style={{width: '64px', height: '64px'}}
              />
            </button>
            {/* etiqueta de texto para el icono */}
            <span style={{color: 'white', marginTop: '10px', fontSize: '12px'}}>
              {icon.label}
            </span>
          </div>
        ))}
      </div>

      {/* boton de prueba para la navegacion */}
      <button
        onClick={() => {
          if (onNavigate) onNavigate('aboutme');
        }}
        style={{
          marginTop: '20px',
          padding: '10px',
          background: 'green',
          color: 'white',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        TEST BUTTON (Sin imagen)
      </button>

      {/* boton y barra de tareas */}
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