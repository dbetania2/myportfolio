// src/components/ui/GalleryLightbox.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ExitHint from './ExitHint.jsx';
import './GalleryLightbox.css';

export default function GalleryLightbox({ 
  items = [],       
  initialIndex = 0, 
  onClose,          
  isOpen            
}) {
  
  // 1. TODOS LOS HOOKS PRIMERO (Siempre deben ejecutarse)
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Hook de Sincronización
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setZoomLevel(1);
    }
  }, [isOpen, initialIndex]);

  // Hook de Navegación (useCallback)
  // Nota: Lo declaramos ANTES del return, aunque no se use si está cerrado.
  const navigate = useCallback((direction) => {
    if (items.length === 0) return;
    
    let newIndex = currentIndex + direction;
    if (newIndex >= items.length) newIndex = 0;
    if (newIndex < 0) newIndex = items.length - 1;
    
    setCurrentIndex(newIndex);
    setZoomLevel(1);
  }, [currentIndex, items.length]);

  // Hook de Teclado (useEffect)
  useEffect(() => {
    if (!isOpen) return; // Podemos salir DENTRO del hook, pero el hook DEBE existir.

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, navigate, onClose]); // Agregamos isOpen a dependencias

  // 
  // Si está cerrado o no hay items, no renderizamos nada visualmente.
  if (!isOpen || items.length === 0) return null;

  // VALIDACIÓN DE SEGURIDAD (Para evitar crash por undefined)
  const currentItem = items[currentIndex];
  if (!currentItem) return null; 

  // Función auxiliar (no es hook, puede ir aquí)
  const handleZoom = (e, delta) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  // 4. RENDERIZADO (JSX)
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      
      {items.length > 1 && (
        <>
          <button className="nav-arrow left" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>&lt;</button>
          <button className="nav-arrow right" onClick={(e) => { e.stopPropagation(); navigate(1); }}>&gt;</button>
        </>
      )}

      <div 
        className="lightbox-content-wrapper" 
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* LÓGICA DE IMAGEN */}
        {(typeof currentItem === 'string' || currentItem.type === 'image' || currentItem.image) && (
          <>
            <div className="lightbox-scroll-area">
              <img 
                src={typeof currentItem === 'string' ? currentItem : currentItem.url} 
                alt="Gallery" 
                draggable="false"
                style={{ transform: `scale(${zoomLevel})` }} 
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            
            <div className="zoom-controls" onClick={(e) => e.stopPropagation()}>
              <button onClick={(e) => handleZoom(e, -0.5)}>-</button>
              <span>{Math.round(zoomLevel * 100)}%</span>
              <button onClick={(e) => handleZoom(e, 0.5)}>+</button>
            </div>
            
            {currentItem.caption && <p className="lightbox-caption">{currentItem.caption}</p>}
          </>
        )}

        {/* LÓGICA DE NOTA */}
        {currentItem.type === 'note' && (
           <div 
             className="lightbox-note-container"
             onClick={(e) => e.stopPropagation()}
           >
              <div className="pixel-pin" style={{ '--pin-color': currentItem.pinColor || 'red' }}></div>
              <div className="lightbox-note-content">
                {currentItem.content?.split('\n').map((line, i) => (
                  <p key={i}>&gt; {line}</p> 
                ))}
              </div>
           </div>
        )}

      </div>

      <ExitHint />

    </div>
  );
}