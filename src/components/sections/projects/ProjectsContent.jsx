import React, { useState, useMemo } from "react";
import "./Projects.css";
import { groupProjectsBySection } from "../../../utils/groupProjectsBySection";
import TagsBar from "./TagsBar.jsx";

export default function ProjectsContent({
  projectsData = [],
  sections = [],
  onSelectProject,
}) {
  // Guard clause clara y segura
  if (!Array.isArray(projectsData) || projectsData.length === 0) {
    return <p>No hay proyectos disponibles</p>;
  }

  const baseUrl = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  /**
   * ============================
   * AGRUPACIÓN POR SECCIONES
   * ============================
   * - Si hay secciones: agrupamos
   * - Si no: todo cae en "Todos"
   */
  const projectsBySection = useMemo(() => {
    if (Array.isArray(sections) && sections.length > 0) {
      return groupProjectsBySection(sections, projectsData);
    }
    return { Todos: projectsData };
  }, [sections, projectsData]);

  /**
   * ============================
   * ESTADO DE TAG ACTIVO
   * ============================
   */
  const [selectedTag, setSelectedTag] = useState("Todos");

  /**
   * ============================
   * TAGS ÚNICOS (DEFENSIVO)
   * ============================
   * Nunca asumimos que tags existen
   */
  const activeTags = useMemo(() => {
    const tagsSet = new Set();

    projectsData.forEach((project) => {
      const tagsData =
        project?.attributes?.tags?.data;

      if (Array.isArray(tagsData)) {
        tagsData.forEach((tag) => {
          const tagName = tag?.attributes?.name;
          if (tagName) tagsSet.add(tagName);
        });
      }
    });

    return ["Todos", ...Array.from(tagsSet)];
  }, [projectsData]);

  /**
   * ============================
   * FILTRADO POR TAG
   * ============================
   */
  const filteredProjectsBySection = useMemo(() => {
    const result = {};

    Object.entries(projectsBySection).forEach(
      ([sectionName, projects]) => {
        result[sectionName] =
          selectedTag === "Todos"
            ? projects
            : projects.filter((project) => {
                const tagsData =
                  project?.attributes?.tags?.data;

                if (!Array.isArray(tagsData)) return false;

                return tagsData.some(
                  (tag) =>
                    tag?.attributes?.name === selectedTag
                );
              });
      }
    );

    return result;
  }, [projectsBySection, selectedTag]);

  /**
   * ============================
   * RENDER
   * ============================
   */
  return (
    <section className="projects-grid" aria-label="Listado de proyectos">
      {/* Barra de filtros */}
      <TagsBar
        tags={activeTags}
        selectedTag={selectedTag}
        onSelectTag={setSelectedTag}
      />

      {/* Secciones */}
      {Object.entries(filteredProjectsBySection).map(
        ([sectionName, projects]) => {
          if (!projects || projects.length === 0) return null;

          return (
            <section
              key={sectionName}
              className="project-section"
              aria-labelledby={`section-${sectionName}`}
            >
              <h3
                id={`section-${sectionName}`}
                className="section-title"
              >
                {sectionName}
              </h3>

              {projects.map((project) => {
                const { id, attributes } = project || {};
                if (!attributes) return null;

                const { title, intro, featured_image } = attributes;

                const imagePath =
                  featured_image?.data?.attributes?.url;

                const mainImageUrl = imagePath
                  ? `${baseUrl.replace(/\/$/, "")}/${imagePath.replace(/^\//, "")}`
                  : null;

                return (
                  <article key={id} className="project-card">
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
                      <button
                        className="view-project"
                        onClick={() =>
                          onSelectProject?.(project)
                        }
                        aria-label={`Ver detalle del proyecto ${title}`}
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
