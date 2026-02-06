import React, { useMemo } from 'react';
import './Whiteboard.css';


export default function Whiteboard({ items = [], onClose, baseUrl }) {
  
  const randomItems = useMemo(() => {
    const safeItems = items || [];
    return safeItems.map((item) => {
      // Posiciones discretas (saltos de 5%) para que se sienta más "grid" o pixelado
      const top = (Math.floor(Math.random() * 12) * 5) + 10; 
      const left = (Math.floor(Math.random() * 14) * 5) + 5; 
      // Rotaciones mínimas o nulas para estilo pixel art rígido (o mantenlo si te gusta)
      const rotation = Math.floor(Math.random() * 6) - 3; // -3 a +3 grados
      
      return {
        ...item,
        style: {
          top: `${top}%`,
          left: `${left}%`,
          transform: `rotate(${rotation}deg)`,
        }
      };
    });
  }, [items]);

  const getSafeImageUrl = (imageData) => {
    if (!imageData?.data?.attributes?.url) return null;
    const imagePath = imageData.data.attributes.url;
    
    if (imagePath.startsWith('http')) return imagePath;
    
    // Limpieza de doble slash
    const cleanBaseUrl = baseUrl ? baseUrl.replace(/\/$/, "") : "";
    return `${cleanBaseUrl}${imagePath}`;
  };

  return (
    <div className="whiteboard-overlay" onClick={onClose}>
      <div className="whiteboard-container" onClick={(e) => e.stopPropagation()}>
        
        <button className="close-board-btn" onClick={onClose}>X</button>
        <h2 className="board-title">My_Brain.exe</h2>

        <div className="board-surface">
          {(!items || items.length === 0) && (
            <div className="empty-message">
              <h3>SYSTEM ERROR: 404</h3>
              <p>NO DATA FOUND IN STRAPI</p>
            </div>
          )}

          {randomItems.map((item) => {
            const { type, contentNote, image, title } = item.attributes;
            const imageUrl = getSafeImageUrl(image);

            return (
              <div 
                key={item.id} 
                className={`sticky-note type-${type}`}
                style={item.style}
                title={title}
              >
                {/* === LOGICA DE IMAGEN === */}
                {type === 'image' ? (
                  imageUrl ? (
                    <div className="note-image-wrapper">
                      <img 
                        src={imageUrl} 
                        alt={title || "Pixel Art"} 
                        draggable="false"
                        // 1. Quitamos el display:none para que veas el icono de roto si falla
                        // 2. Imprimimos el error en consola
                        onError={(e) => console.error("Fallo cargando:", imageUrl)}
                      />
                      
                      {/* DEBUG: Si la imagen no carga, verás este texto rojo pequeño con la URL */}
                      <div style={{fontSize: '10px', color: 'red', wordBreak: 'break-all'}}>
                         {/* Descomenta abajo si sigues sin ver la imagen */}
                         {/* {imageUrl} */}
                      </div>

                      {contentNote && <p className="image-caption">{contentNote}</p>}
                    </div>
                  ) : (
                    <div style={{color: 'red', fontWeight: 'bold'}}>
                      [IMG NOT FOUND]
                    </div>
                  )
                ) : null}

                {/* === LOGICA DE NOTA === */}
                {type === 'note' && (
                  <div className="note-content">
                    {contentNote?.split('\n').map((line, i) => (
                      <p key={i}>&gt; {line}</p> 
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}