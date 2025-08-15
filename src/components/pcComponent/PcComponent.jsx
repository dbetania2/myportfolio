import React from 'react';
import './PcComponent.css';
import PcScreen from '../PcScreen/PcScreen.jsx';

/**
 * Componente para mostrar la PC con pantalla y cerrar.
 * @param {{onClose: () => void, onNavigate: (section: string) => void}} props
 */
const PcComponent = ({ onClose, onNavigate }) => {
    return (
        <div className="screen-overlay show" onClick={onClose}>
            <div className="screen-content" onClick={e => e.stopPropagation()}>
                {/* Pasamos onNavigate a PcScreen */}
                <PcScreen onNavigate={onNavigate} /> 
                <button className="close-button" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default PcComponent;