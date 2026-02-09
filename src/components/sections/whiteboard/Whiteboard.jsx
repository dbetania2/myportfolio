import React, { useMemo, useState, useEffect } from 'react'; // 1. Importar useEffect
import './Whiteboard.css';
import ExitHint from '../../ui/ExitHint.jsx';
import GalleryLightbox from '../../ui/GalleryLightbox.jsx'; 

export default function Whiteboard({ items = [], onClose, baseUrl }) {
  
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // --- 1. PROCESAMIENTO DE DATOS (Igual que antes) ---
  const processedItems = useMemo(() => {
    /* ... (Tu lógica de mapeo intacta) ... */
    const safeItems = items || [];
    const pinColors = ['#4caf50', '#e53935', '#ffeb3b'];

    return safeItems.map((item) => {
      const top = (Math.floor(Math.random() * 12) * 5) + 10; 
      const left = (Math.floor(Math.random() * 14) * 5) + 5; 
      const rotation = Math.floor(Math.random() * 6) - 3; 
      const randomColor = pinColors[Math.floor(Math.random() * pinColors.length)];
      const attrs = item.attributes;
      let imageUrl = null;
      if (attrs.image?.data?.attributes?.url) {
        const rawUrl = attrs.image.data.attributes.url;
        imageUrl = rawUrl.startsWith('http') ? rawUrl : `${baseUrl.replace(/\/$/, "")}${rawUrl}`;
      }
      return {
        id: item.id,
        type: attrs.type,
        title: attrs.title,
        style: { top: `${top}%`, left: `${left}%`, transform: `rotate(${rotation}deg)` },
        pinColor: randomColor,
        url: imageUrl,             
        content: attrs.contentNote, 
        caption: attrs.contentNote  
      };
    });
  }, [items, baseUrl]);

  // Función para abrir la foto/nota
  const openItem = (index) => {
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  // --- 🔥 2. CEREBRO PARA LA TECLA ESCAPE (NUEVO) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Solo cerramos el pizarrón si la tecla es ESCAPE
      if (e.key === 'Escape') {
        // PERO: Si la galería está abierta, NO cerramos el pizarrón.
        // Dejamos que la galería maneje su propio cierre.
        if (lightboxOpen) return;

        onClose(); // Cerramos el pizarrón
      }
    };

    // Activamos el "oído"
    window.addEventListener('keydown', handleKeyDown);
    
    // Limpiamos el "oído" al salir
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, lightboxOpen]); // Dependemos de lightboxOpen para saber si bloquear o no

  return (
    <>
      {/* CAPA 1: EL PIZARRÓN */}
      <div className="whiteboard-overlay" onClick={onClose}>
        
        {/* Solo mostramos el cartel si la galería está cerrada */}
        {!lightboxOpen && <ExitHint />}

        <div 
            className="whiteboard-container" 
            onClick={(e) => e.stopPropagation()} 
        >
          <button className="close-board-btn" onClick={onClose}>X</button>
          <h2 className="board-title">Ideas</h2>
          
          <div className="board-surface">
            {processedItems.length === 0 && (
              <div className="empty-message"><h3>NO DATA</h3></div>
            )}

            {processedItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`sticky-note type-${item.type} clickable-image`}
                style={item.style}
                title={item.title}
                onClick={(e) => { 
                  e.stopPropagation(); 
                  openItem(index); 
                }}
              >
                <div className="pixel-pin" style={{ '--pin-color': item.pinColor }}></div>

                {item.type === 'image' && item.url && (
                  <div className="note-image-wrapper">
                    <img src={item.url} alt="mini" draggable="false" />
                  </div>
                )}

                {item.type === 'note' && (
                  <div className="note-content">
                    {item.content?.split('\n').slice(0, 3).map((l, i) => <p key={i}>{l}</p>)}
                    {item.content?.length > 50 && <p>...</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CAPA 2: EL VISOR */}
      <GalleryLightbox 
        isOpen={lightboxOpen}
        items={processedItems}
        initialIndex={selectedIndex}
        onClose={() => setLightboxOpen(false)} 
      />
    </>
  );
}