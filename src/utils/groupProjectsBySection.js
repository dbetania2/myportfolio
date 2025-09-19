export function groupProjectsBySection(sections, projects) {
  const result = {};

  sections
    .filter(section => section.isActive) // solo secciones activas
    .forEach(section => {
      const sectionName = section.name || "Sin sección";
      const sectionTags = section.tags?.data?.map(tag => tag.attributes.name) || [];

      const filteredProjects = projects.filter(project => {
        const projectTags = project.attributes.tags?.data?.map(t => t.attributes.name) || [];
        return projectTags.some(tag => sectionTags.includes(tag));
      });

      if (filteredProjects.length > 0) {
        result[sectionName] = filteredProjects;
      }
    });

  return result;
}
