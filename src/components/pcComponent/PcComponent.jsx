import React, { useState } from 'react';
import './PcComponent.css';
import PcScreen from '../PcScreen/PcScreen.jsx';

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
        src="/src/objetos-img/pc.png" 
        alt="pc" 
        className="map-object" 
        id="pc" 
        onClick={handlePcClick} 
        
      />
      {showScreen && (
        <div className={`screen-overlay ${showScreen ? 'show' : ''}`} onClick={handleCloseScreen}>
          <div className="screen-content" onClick={(e) => e.stopPropagation()}>
            <PcScreen /> 
            <button className="close-button" onClick={handleCloseScreen}>Cerrar</button>
          </div>
        </div>
      )}
    </>
  );
};

export default PcComponent;






