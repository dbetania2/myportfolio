import React from 'react';
import './ExitHint.css';

const ExitHint = () => {
  return (
    <div className="exit-hint-container">
      <span className="exit-hint-icon">↩</span>
      <span className="exit-hint-text">Click fuera para cerrar</span>
    </div>
  );
};

export default ExitHint;