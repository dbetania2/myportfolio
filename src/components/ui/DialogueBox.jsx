// src/components/ui/DialogueBox.jsx
import React, { useState, useEffect } from 'react';
import './DialogueBox.css';

export default function DialogueBox({ isOpen, onClose, messages }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Reiniciar el diálogo cada vez que se abre
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentIndex < messages.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose(); // Si es el último, cerramos
    }
  };

  return (
    <div className="dialogue-overlay" onClick={handleNext}>
      <div className="dialogue-box" onClick={(e) => e.stopPropagation()}>
        
        {/* Nombre del Personaje */}
        <div className="dialogue-name">Daiana</div>

        {/* Texto (con soporte para negritas simples usando HTML) */}
        <p 
          className="dialogue-text"
          dangerouslySetInnerHTML={{ __html: messages[currentIndex] }}
        />

        {/* Controles */}
        <div className="dialogue-controls">
          <button className="skip-btn" onClick={onClose}>
            SALTAR ⏭
          </button>
          
          <button className="next-btn" onClick={handleNext}>
            {currentIndex < messages.length - 1 ? 'SIGUIENTE ▼' : 'CERRAR ✖'}
          </button>
        </div>

      </div>
    </div>
  );
}