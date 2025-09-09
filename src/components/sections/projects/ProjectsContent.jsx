import React from 'react';
import './Projects.css'; // tu CSS para los proyectos
import '../section.css'; // estilos generales para todas las secciones
import IconWindow from '../../layouts/iconwindow/IconWindow.astro'; // Importa el marco de la ventana

const ProjectsContent = ({ data, onClose }) => {
  if (!data || data.length === 0) {
    return (
      <IconWindow client:only title="Error" onClose={onClose}>
        <p>No projects available.</p>
      </IconWindow>
    );
  }

  return (
    <IconWindow client:only title="My Projects" onClose={onClose}>
      <div className="section-container">
        <div className="projects-list">
          {data.map((project) => (
            <div key={project.id} className="project-card">
              {project.attributes.featured_image.data && (
                <img
                  src={project.attributes.featured_image.data.attributes.url}
                  alt={project.attributes.title}
                  className="project-image"
                />
              )}
              <h4>{project.attributes.title}</h4>
              <p dangerouslySetInnerHTML={{ __html: project.attributes.description }}></p>
              {project.attributes.tags.data && project.attributes.tags.data.length > 0 && (
                <div className="project-tags">
                  {project.attributes.tags.data.map((tag) => (
                    <span key={tag.id} className="project-tag">
                      {tag.attributes.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </IconWindow>
  );
};

export default ProjectsContent;