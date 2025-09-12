import React from 'react';
import './Projects.css';

export default function ProjectsContent({ data, onSelectProject }) {
  if (!data || data.length === 0) return <p>No hay proyectos disponibles</p>;

  const baseUrl = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  return (
    <div className="projects-grid">
      {data.map((project) => {
        const { id, attributes } = project || {};
        const { title, description, featured_image } = attributes || {};

        const mainImageUrl = featured_image?.data?.attributes?.url
          ? `${baseUrl.replace(/\/$/, '')}/${featured_image.data.attributes.url.replace(/^\//, '')}`
          : null;

        return (
          <div key={id} className="project-card">
            {/* Contenedor de imagen */}
            {mainImageUrl && (
              <div className="project-image-container">
                <img
                  src={mainImageUrl}
                  alt={`Imagen de ${title}`}
                  className="project-image"
                />
              </div>
            )}

            {/* Contenedor de texto */}
            <div className="project-text-container">
              {title && <h2>{title}</h2>}
              {description && <p>{description}</p>}
            </div>

            {/* Contenedor del botón */}
            <div className="project-button-container">
              <button
                className="view-project"
                onClick={() => onSelectProject(project)}
              >
                Ver Proyecto
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
