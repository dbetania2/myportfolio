// components/pc/pcComponent/PcComponent.jsx
import React from 'react';
import PcScreen from '../PcScreen/PcScreen';
import './PcComponent.css';


// componente que representa la estructura principal de la pc
const PcComponent = ({ onNavigate }) => {
 // el contenedor principal de la pc
 return (
   <div className="pc-container">
     {/* el componente que muestra la pantalla de la pc y maneja la navegacion */}
     <PcScreen onNavigate={onNavigate} />
   </div>
 );
};


// exporta el componente para ser usado en otras partes de la aplicacion
export default PcComponent;