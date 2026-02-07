// src/components/pc/pcScreen/PcScreen.jsx

import React, { useState, useEffect } from 'react';
import './PcScreen.css';

// Recibimos 'closePc' como prop (necesitarás pasarlo desde WindowController)
const PcScreen = ({ onNavigate, closePc }) => {
  const [time, setTime] = useState(new Date());
  
  //  Estado para mostrar/ocultar el menú inicio
  const [showStartMenu, setShowStartMenu] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const icons = [
    // iconos
    { name: 'aboutme', label: 'SobreMi.txt', src: '/src/objetos-img/archivospc/aboutme.png' },
    { name: 'projects', label: 'Proyectos_Dir', src: '/src/objetos-img/archivospc/aboutme.png' },
    { name: 'contact', label: 'Mail_Me.exe', src: '/src/objetos-img/archivospc/aboutme.png' }
  ];

  // Función para manejar clicks del menú
  const handleMenuClick = (action) => {
    setShowStartMenu(false); // Cerrar menú siempre
    
    if (action === 'shutdown') {
      if (closePc) closePc(); // Llamar a la función de cerrar si existe
    } else {
      onNavigate(action);
    }
  };

  return (
    <div className="monitor-casing" onClick={() => setShowStartMenu(false)}>
      <div className="crt-screen">
        
        {/* Escritorio */}
        <div className="desktop-area">
          {icons.map(icon => (
            <div 
              key={icon.name} 
              className="desktop-icon-wrapper"
              onClick={(e) => {
                e.stopPropagation(); // Evita cerrar el menú si clickeas un icono
                onNavigate(icon.name);
              }}
            >
              <div className="icon-img-box">
                <img src={icon.src} alt={icon.label} />
              </div>
              <span className="icon-label">{icon.label}</span>
            </div>
          ))}
        </div>

        {/* === MENÚ INICIO (START MENU) === */}
        {showStartMenu && (
          <div className="start-menu" onClick={(e) => e.stopPropagation()}>
            <div className="start-sidebar">
              <span className="vertical-text">DAIANA</span>
            </div>
            <div className="start-options">
              <button onClick={() => handleMenuClick('aboutme')}>📂 Sobre Mí</button>
              <button onClick={() => handleMenuClick('projects')}>🚀 Proyectos</button>
              <button onClick={() => handleMenuClick('contact')}>📧 Contacto</button>
              <div className="menu-divider"></div>
              <button onClick={() => handleMenuClick('shutdown')}>🛑 Apagar Sistema</button>
            </div>
          </div>
        )}

        {/* Barra de Tareas */}
        <div className="taskbar" onClick={(e) => e.stopPropagation()}>
          <button 
            className={`start-btn ${showStartMenu ? 'active' : ''}`}
            onClick={() => setShowStartMenu(!showStartMenu)}
          >
            <span className="heart-icon">♥</span> INICIO
          </button>
          
          <div className="taskbar-divider"></div>

          <div className="taskbar-tray">
             <span className="tray-time">{formatTime(time)}</span>
          </div>
        </div>

      </div>
      <div className="monitor-logo">DAIANA-OS</div>
      <div className="power-indicator"></div>
    </div>
  );
};

export default PcScreen;