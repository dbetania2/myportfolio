import React from 'react';
import './PcScreen.css';

/**
 * @param {{ onNavigate: (section: string) => void }} props
 */
const PcScreen = ({ onNavigate }) => {
    return (
        <div className="pc-screen-content">
            <button 
                className="screen-icon"
                onClick={() => onNavigate('aboutme')}
            >
                <img 
                    src="src/objetos-img/archivospc/aboutme.png"
                    alt="Información sobre mí"
                />
            </button>
            <button 
                className="screen-icon"
                onClick={() => onNavigate('projects')}
            >
                <img 
                    src="src/objetos-img/archivospc/aboutme.png"
                    alt="Mis Proyectos"
                />
            </button>
            <button 
                className="screen-icon"
                onClick={() => onNavigate('contact')}
            >
                <img 
                    src="src/objetos-img/archivospc/aboutme.png"
                    alt="Contacto"
                />
            </button>
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