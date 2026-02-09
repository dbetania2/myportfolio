import React, { useState } from "react";
import IconWindow from "../../../layouts/iconwindow/IconWindow.jsx";
import GalleryLightbox from "../../ui/GalleryLightbox.jsx";
import "./Projects.css";

export default function ProjectDetail({ project, baseUrl, onClose }) {
  if (!project) return null;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const attrs = project.attributes;
  const skillsData = attrs.skills?.data || [];

  // --- PREPARACIÓN DE DATOS ---
  const getSafeUrl = (urlData) => {
    if (!urlData) return null;
    return urlData.startsWith('http') 
      ? urlData 
      : `${baseUrl.replace(/\/$/, "")}/${urlData.replace(/^\//, "")}`;
  };

  const allImages = [];

  // A. Imagen Principal
  if (attrs.featured_image?.data?.attributes?.url) {
    allImages.push(getSafeUrl(attrs.featured_image.data.attributes.url));
  }

  // B. Galería
  if (attrs.gallery?.data) {
    attrs.gallery.data.forEach(img => {
      if (img.attributes.url) {
        allImages.push(getSafeUrl(img.attributes.url));
      }
    });
  }

  const openGallery = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <>
      <IconWindow title={attrs.title} onClose={onClose}>
        {/* 🔥 EL FIX DEL BUG ESTÁ AQUÍ ABAJO */}
        <div 
          className="project-detail-page"
          // stopPropagation evita que el click "suba" y cierre la PC
          onClick={(e) => e.stopPropagation()} 
          // El cursor default evita que parezca que vas a clickear el fondo
          style={{ cursor: 'default' }} 
        >
          
          {/* FOTO PRINCIPAL */}
          {allImages.length > 0 ? (
            <div 
              className="main-image-wrapper pixel-border" 
              onClick={() => openGallery(0)} 
            >
              <img
                src={allImages[0]} 
                alt={`Imagen de ${attrs.title}`}
                className="project-main-image"
              />
              <div className="hover-hint">VER +</div>
            </div>
          ) : (
            <div className="no-image-placeholder pixel-border">
              <p>NO SIGNAL</p>
            </div>
          )}

          {/* TÍTULO Y DESCRIPCIÓN */}
          <h1 className="pixel-title">{attrs.title}</h1>
          <p className="pixel-text">{attrs.description}</p>

          {/* BOTONES */}
          <div className="project-links">
            {attrs.github_url && (
              <a href={attrs.github_url} target="_blank" rel="noopener noreferrer" className="pixel-btn">
                <span className="icon">code</span> GitHub
              </a>
            )}
            {attrs.project_url && (
              <a href={`https://${attrs.project_url}`} target="_blank" rel="noopener noreferrer" className="pixel-btn primary">
                <span className="icon">▶</span> Demo
              </a>
            )}
          </div>

          {/* === ZONA DE INFORMACIÓN TÉCNICA === */}
          <div className="tech-info-container">
            
            {/* 1. Categoría General */}
            {Array.isArray(attrs.tags?.data) && attrs.tags.data.length > 0 && (
              <div className="info-group">
                <span className="info-label">CATEGORÍA:</span>
                <div className="tags-list">
                  {attrs.tags.data.map((tag) => (
                    <span key={tag.id} className="pixel-tag text-only">
                      {tag.attributes?.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Skills (CORREGIDO PARA USAR skill_image) */}
            {skillsData.length > 0 && (
              <div className="info-group">
                <span className="info-label">BUILT WITH:</span>
                <div className="skills-grid">
                  {skillsData.map((skill) => {
                    
                    // 
                    const rawIconUrl = skill.attributes?.skill_image?.data?.attributes?.url;
                    
                    const iconUrl = rawIconUrl ? getSafeUrl(rawIconUrl) : null;
                    const skillName = skill.attributes.name;
                    
                    return (
                      <div key={skill.id} className="skill-badge pixel-tooltip" data-tooltip={skillName}>
                        {iconUrl ? (
                          <img src={iconUrl} alt={skillName} className="skill-icon" />
                        ) : (
                          <span className="skill-text-fallback">{skillName}</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* THUMBNAILS DE GALERÍA */}
          {allImages.length > 1 && (
            <div className="gallery-section">
              <h3 className="pixel-subtitle">GALERÍA</h3>
              <div className="project-gallery">
                {allImages.slice(1).map((url, index) => (
                  <div 
                    key={index} 
                    className="gallery-thumb pixel-border"
                    onClick={() => openGallery(index + 1)}
                  >
                    <img src={url} alt={`Captura ${index + 1}`} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </IconWindow>

      <GalleryLightbox 
        isOpen={lightboxOpen}
        items={allImages} 
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />
    </>
  );
}