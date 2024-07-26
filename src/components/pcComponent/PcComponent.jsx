import React, { useState } from 'react';
import './PcComponent.css';

const PcComponent = () => {
  const [showScreen, setShowScreen] = useState(false);

  const handlePcClick = () => {
    setShowScreen(true);
  };

  const handleCloseScreen = () => {
    setShowScreen(false);
  };

  return (
    <>
      <img 
        src="src/objetos-img/pc.png" 
        alt="pc" 
        className="map-object" 
        id="pc" 
        onClick={handlePcClick} 
      />
      {showScreen && (
        <div className="screen-overlay" onClick={handleCloseScreen}>
          <div className="screen-content" onClick={e => e.stopPropagation()}>
            {/* Aquí puedes personalizar el contenido de la pantalla de la PC */}
            <h2>Pantalla de la PC</h2>
            <p>Bienvenido a mi portafolio en estilo pixel art. Aquí puedes encontrar información sobre mí y mis proyectos.</p>
            <button className="close-button" onClick={handleCloseScreen}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PcComponent;

