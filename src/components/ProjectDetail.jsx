import React from "react";
import IconWindow from "../layouts/iconwindow/IconWindow.jsx";
import "./sections/projects/Projects.css";

export default function ProjectDetail({ project, baseUrl, onClose }) {
  if (!project) return null;

  const attrs = project.attributes;

  const mainImageUrl = attrs.featured_image?.data?.attributes?.url
    ? `${baseUrl.replace(/\/$/, "")}/${attrs.featured_image.data.attributes.url.replace(/^\//, "")}`
    : null;

  const galleryImages = attrs.gallery?.data?.map(img =>
    img?.attributes?.url
      ? `${baseUrl.replace(/\/$/, "")}/${img.attributes.url.replace(/^\//, "")}`
      : null
  ) ?? [];

  return (
    <IconWindow title={attrs.title} onClose={onClose}>
      <div className="project-detail-page">
        {/* Imagen principal */}
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={`Imagen de ${attrs.title}`}
            className="project-main-image"
          />
        ) : (
          <p>No hay imagen destacada</p>
        )}

        {/* Título y descripción */}
        <h1>{attrs.title}</h1>
        <p>{attrs.description}</p>

        {/* URLs */}
        <div className="project-links">
          {attrs.github_url && (
            <a
              href={attrs.github_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          )}
          {attrs.project_url && (
            <a
              href={`https://${attrs.project_url}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Proyecto
            </a>
          )}
        </div>

        {/* Tags */}
        {Array.isArray(attrs.tags?.data) && attrs.tags.data.length > 0 ? (
          <ul className="project-tags">
            {attrs.tags.data.map((tag) => (
              <li key={tag.id}>{tag.attributes?.name}</li>
            ))}
          </ul>
        ) : (
          <p>No hay tags</p>
        )}

        {/* Galería */}
        {galleryImages.length > 0 ? (
          <div className="project-gallery">
            {galleryImages.map((url, index) =>
              url ? (
                <img
                  key={index}
                  src={url}
                  alt={`Galería ${attrs.title} ${index + 1}`}
                />
              ) : (
                <p key={index}>Imagen {index + 1} ausente</p>
              )
            )}
          </div>
        ) : (
          <p>No hay imágenes en la galería</p>
        )}
      </div>
    </IconWindow>
  );
}
