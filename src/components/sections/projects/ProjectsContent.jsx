import React, { useState, useMemo } from 'react';
import './Projects.css';
import { groupProjectsBySection } from '../../../utils/groupProjectsBySection';
import TagsBar from './TagsBar.jsx';

export default function ProjectsContent({ projectsData, sections = [], onSelectProject }) {
  if (!projectsData || projectsData.length === 0) {
    return <p>No hay proyectos disponibles</p>;
  }

  const baseUrl = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  // Agrupar por secciones si hay
  const projectsBySection = sections.length
    ? groupProjectsBySection(sections, projectsData)
    : { Todos: projectsData };

  // Estado de tag seleccionado
  const [selectedTag, setSelectedTag] = useState("Todos");

  // Lista de tags únicos de todos los proyectos
  const activeTags = useMemo(() => {
    const tagsSet = new Set();
    projectsData.forEach(project => {
      project.attributes.tags?.data.forEach(t => tagsSet.add(t.attributes.name));
    });
    return ["Todos", ...Array.from(tagsSet)];
  }, [projectsData]);

  // Filtrar proyectos por tag seleccionado
  const filteredProjectsBySection = useMemo(() => {
    const result = {};
    Object.entries(projectsBySection).forEach(([sectionName, projects]) => {
      result[sectionName] = selectedTag === "Todos"
        ? projects
        : projects.filter(project =>
            project.attributes.tags?.data.some(t => t.attributes.name === selectedTag)
          );
    });
    return result;
  }, [projectsBySection, selectedTag]);

  return (
    <div className="projects-grid">
      {/* Barra de tags */}
      <TagsBar
        tags={activeTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />

      {/* Secciones y proyectos */}
      {Object.entries(filteredProjectsBySection).map(([sectionName, projects]) => (
        <div key={sectionName} className="project-section">
          <h3 className="section-title">{sectionName}</h3>
          {projects.map(project => {
            const { id, attributes } = project || {};
            const { title, intro, featured_image } = attributes || {};

            const mainImageUrl = featured_image?.data?.attributes?.url
              ? `${baseUrl.replace(/\/$/, '')}/${featured_image.data.attributes.url.replace(/^\//, '')}`
              : null;

            return (
              <div key={id} className="project-card">
                {mainImageUrl && (
                  <div className="project-image-container">
                    <img
                      src={mainImageUrl}
                      alt={`Imagen de ${title}`}
                      className="project-image"
                    />
                  </div>
                )}

                <div className="project-text-container">
                  {title && <h2>{title}</h2>}
                  {intro && <p>{intro}</p>}
                </div>

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
      ))}
    </div>
  );
}
