import React, { useState } from 'react';
import './PcComponent.css';
import PcScreen from '../../pages/PcScreen/PcScreen.jsx';  // Importa la nueva página para la PC

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
        src="src/objetos-img/pc.png" // Ajusta la ruta de la imagen 
        alt="pc" 
        className="map-object" 
        id="pc" 
        onClick={handlePcClick} 
      />
      {showScreen && (
        <div className="screen-overlay" onClick={handleCloseScreen}>
          <PcScreen /> {/* Muestra el contenido de la pantalla */}
          <button className="close-button" onClick={handleCloseScreen}>Cerrar</button>
        </div>
      )}
    </>
  );
};

export default PcComponent;



