import React, { useMemo, useState, useEffect, useCallback } from 'react';
import './Whiteboard.css';

export default function Whiteboard({ items = [], onClose, baseUrl }) {
  
  // 🔥 NUEVO: Estado ahora guarda { type: 'image'|'note', index: 0 }
  const [focusedItem, setFocusedItem] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // 1. Procesamos los items y agregamos posiciones
  const processedItems = useMemo(() => {
    const safeItems = items || [];
    const pinColors = ['#4caf50', '#e53935', '#ffeb3b'];

    return safeItems.map((item) => {
      const top = (Math.floor(Math.random() * 12) * 5) + 10; 
      const left = (Math.floor(Math.random() * 14) * 5) + 5; 
      const rotation = Math.floor(Math.random() * 6) - 3; 
      const randomColor = pinColors[Math.floor(Math.random() * pinColors.length)];
      
      return {
        ...item,
        pinColor: randomColor,
        style: { top: `${top}%`, left: `${left}%`, transform: `rotate(${rotation}deg)` }
      };
    });
  }, [items]);

  // 🔥 NUEVO: Filtramos listas separadas para poder navegar
  const imagesList = useMemo(() => processedItems.filter(i => i.attributes.type === 'image'), [processedItems]);
  const notesList = useMemo(() => processedItems.filter(i => i.attributes.type === 'note'), [processedItems]);

  // Helper de URL (Igual que antes)
  const getSafeImageUrl = (imageData) => {
    if (!imageData || !imageData.data) return null;
    let imgAttributes;
    if (Array.isArray(imageData.data)) {
      if (imageData.data.length === 0) return null;
      imgAttributes = imageData.data[0].attributes;
    } else { imgAttributes = imageData.data.attributes; }
    if (!imgAttributes?.url) return null;
    const imagePath = imgAttributes.url;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanBaseUrl = baseUrl ? baseUrl.replace(/\/$/, "") : "";
    return `${cleanBaseUrl}${imagePath}`;
  };

  // 🔥 NUEVO: Función para abrir un ítem específico
  const openItem = (item) => {
    const type = item.attributes.type;
    const list = type === 'image' ? imagesList : notesList;
    // Buscamos en qué posición de SU lista está
    const index = list.findIndex(i => i.id === item.id);
    
    setZoomLevel(1); // Reset zoom
    setFocusedItem({ type, index, data: list[index] });
  };

  // 🔥 NUEVO: Lógica de navegación (Siguiente / Anterior)
  const navigate = useCallback((direction) => {
    if (!focusedItem) return;

    const list = focusedItem.type === 'image' ? imagesList : notesList;
    let newIndex = focusedItem.index + direction;

    // Loop infinito (Si llegas al final, vuelve al principio)
    if (newIndex >= list.length) newIndex = 0;
    if (newIndex < 0) newIndex = list.length - 1;

    setZoomLevel(1);
    setFocusedItem({ 
      type: focusedItem.type, 
      index: newIndex, 
      data: list[newIndex] 
    });
  }, [focusedItem, imagesList, notesList]);

  // 🔥 NUEVO: Escuchar teclas del teclado (Flechas)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!focusedItem) return;
      if (e.key === 'ArrowRight') navigate(1);
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'Escape') setFocusedItem(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedItem, navigate]);


  // Zoom handler (Igual que antes)
  const handleZoom = (e, delta) => {
    e.stopPropagation();
    setZoomLevel(prev => Math.min(Math.max(prev + delta, 0.5), 5));
  };

  return (
    <>
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="pixel-edges" x="-20%" y="-20%" width="140%" height="140%">
            <feMorphology operator="dilate" radius="2" in="SourceGraphic" result="dilated"/>
            <feComponentTransfer in="dilated">
              <feFuncA type="discrete" tableValues="0 1"/>
            </feComponentTransfer>
          </filter>
        </defs>
      </svg>

      {/* === VISOR / LIGHTBOX === */}
      {focusedItem && (
        <div className="lightbox-overlay" onClick={() => setFocusedItem(null)}>
          
          {/* BOTONES DE NAVEGACIÓN */}
          <button className="nav-arrow left" onClick={(e) => { e.stopPropagation(); navigate(-1); }}>&lt;</button>
          <button className="nav-arrow right" onClick={(e) => { e.stopPropagation(); navigate(1); }}>&gt;</button>

          {/* CASO 1: ES UNA IMAGEN */}
          {focusedItem.type === 'image' && (
            <>
              <div className="lightbox-scroll-area">
                <img 
                  src={getSafeImageUrl(focusedItem.data.attributes.image)} 
                  alt="Visor" 
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
            </>
          )}

          {/* CASO 2: ES UNA NOTA (🔥 NUEVO) */}
          {focusedItem.type === 'note' && (
            <div 
              className="lightbox-note-container" 
              onClick={(e) => e.stopPropagation()} // Para que click en la nota no cierre
            >
              {/* Pin decorativo dentro de la nota grande */}
              <div className="pixel-pin" style={{ top: '-10px', left: '50%', '--pin-color': focusedItem.data.pinColor }}></div>
              
              <div className="lightbox-note-content">
                {focusedItem.data.attributes.contentNote?.split('\n').map((line, i) => (
                  <p key={i}>&gt; {line}</p> 
                ))}
              </div>
            </div>
          )}

          <p className="lightbox-hint">Click fuera o ESC para cerrar</p>
        </div>
      )}

      {/* === PIZARRÓN (FONDO) === */}
      <div className="whiteboard-overlay" onClick={onClose}>
        <div className="whiteboard-container" onClick={(e) => e.stopPropagation()}>
          <button className="close-board-btn" onClick={onClose}>X</button>
          <h2 className="board-title">Ideas</h2>
          
          <div className="board-surface">
            {(!processedItems || processedItems.length === 0) && (
              <div className="empty-message"><h3>SYSTEM ERROR: 404</h3><p>NO DATA</p></div>
            )}

            {processedItems.map((item) => {
              const { type, contentNote, image, title } = item.attributes;
              const imageUrl = getSafeImageUrl(image);

              return (
                <div 
                  key={item.id} 
                  className={`sticky-note type-${type} clickable-image`} // Agregamos clickable a TODO
                  style={item.style}
                  title={title}
                  // 🔥 NUEVO: Al hacer click, llamamos a openItem
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    openItem(item); 
                  }}
                >
                  <div className="pixel-pin" style={{ '--pin-color': item.pinColor }}></div>

                  {type === 'image' ? (
                    imageUrl ? (
                      <div className="note-image-wrapper">
                        <img 
                          src={imageUrl} 
                          alt={title} 
                          draggable="false"
                          onError={(e) => console.error("Fallo", imageUrl)}
                        />
                        {contentNote && <p className="image-caption">{contentNote}</p>}
                      </div>
                    ) : <div style={{color:'red'}}>[IMG ERROR]</div>
                  ) : null}

                  {type === 'note' && (
                    <div className="note-content">
                      {contentNote?.split('\n').slice(0, 5).map((line, i) => (
                        <p key={i}>&gt; {line}</p> 
                      ))}
                      {/* Indicador de que hay más texto */}
                      {contentNote?.split('\n').length > 5 && <p>...</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}