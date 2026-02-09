import React, { useState, useMemo } from "react";
import "./Projects.css";
import { groupProjectsBySection } from "../../../utils/groupProjectsBySection";
import TagsBar from "./TagsBar.jsx";

export default function ProjectsContent({
  projectsData = [],
  sections = [],
  onSelectProject,
}) {
  if (!Array.isArray(projectsData) || projectsData.length === 0) {
    return <p>No hay proyectos disponibles</p>;
  }

  const baseUrl = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  const projectsBySection = useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      return groupProjectsBySection(sections, projectsData);
    }
    return { Todos: projectsData };
  }, [sections, projectsData]);

  const [selectedTag, setSelectedTag] = useState("Todos");

  const activeTags = useMemo(() => {
    const tagsSet = new Set();
    projectsData.forEach((project) => {
      const tagsData = project?.attributes?.tags?.data;
      if (Array.isArray(tagsData)) {
        tagsData.forEach((tag) => {
          const tagName = tag?.attributes?.name;
          if (tagName) tagsSet.add(tagName);
        });
      }
    });
    return ["Todos", ...Array.from(tagsSet)];
  }, [projectsData]);

  const filteredProjectsBySection = useMemo(() => {
    const result = {};
    Object.entries(projectsBySection).forEach(
      ([sectionName, projects]) => {
        result[sectionName] =
          selectedTag === "Todos"
            ? projects
            : projects.filter((project) => {
                const tagsData = project?.attributes?.tags?.data;
                if (!Array.isArray(tagsData)) return false;
                return tagsData.some(
                  (tag) => tag?.attributes?.name === selectedTag
                );
              });
      }
    );
    return result;
  }, [projectsBySection, selectedTag]);

  return (
    <section className="projects-grid" aria-label="Listado de proyectos">
      <TagsBar
        tags={activeTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />

      {Object.entries(filteredProjectsBySection).map(
        ([sectionName, projects]) => {
          if (!projects || projects.length === 0) return null;

          return (
            <section
              key={sectionName}
              className="project-section"
              aria-labelledby={`section-${sectionName}`}
            >
              <h3 id={`section-${sectionName}`} className="section-title">
                {sectionName}
              </h3>

              {projects.map((project) => {
                const { id, attributes } = project || {};
                if (!attributes) return null;

                const { title, intro, featured_image } = attributes;

                const imagePath = featured_image?.data?.attributes?.url;
                const mainImageUrl = imagePath
                  ? `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`
                  : null;

                return (
                  //  onClick está en el padre (article)
                  <article 
                    key={id} 
                    className="project-card"
                    onClick={() => onSelectProject?.(project)}
                    // Añadimos cursor pointer para indicar que es clickeable
                    style={{ cursor: 'pointer' }} 
                  >
                    {mainImageUrl && (
                      <div className="project-image-container">
                        <img
                          src={mainImageUrl}
                          alt={`Imagen del proyecto ${title || "sin título"}`}
                          className="project-image"
                          loading="lazy"
                        />
                      </div>
                    )}

                    <div className="project-text-container">
                      {title && <h2>{title}</h2>}
                      {intro && <p>{intro}</p>}
                    </div>

                    <div className="project-button-container">
                      {/* El botón ya no necesita onClick propio, 
                          el evento sube (burbujea) al article */}
                      <button
                        className="view-project"
                        aria-label={`Ver detalle del proyecto ${title}`}
                        // Opcional: pointer-events-none hace que el click 
                        // atraviese el botón y le pegue directo a la tarjeta
                        style={{ pointerEvents: 'none' }}
                      >
                        Ver Proyecto
                      </button>
                    </div>
                  </article>
                );
              })}
            </section>
          );
        }
      )}
    </section>
  );
}