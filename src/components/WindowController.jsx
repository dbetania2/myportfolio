import React, { useState, useEffect } from "react";
import PcComponent from "./pc/pcComponent/PcComponent.jsx";
import ProjectsContent from "./sections/projects/ProjectsContent.jsx";
import IconWindow from "../layouts/iconwindow/IconWindow.jsx";
import ProjectDetail from "./sections/projects/ProjectDetail.jsx"; 
import AboutMeDetail from "./sections/aboutme/AboutMeDetail.jsx";

export default function WindowController({ aboutMeData, projectsData, sectionsData }) {
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [showPcScreen, setShowPcScreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const BASE_URL = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  // Logs iniciales
  useEffect(() => {
    console.log("AboutMeData recibido:", aboutMeData);
    console.log("ProjectsData recibido:", projectsData);
    console.log("SectionsData recibido:", sectionsData);
  }, [aboutMeData, projectsData, sectionsData]);

  // Detecta interacciones con objetos
  useEffect(() => {
    const handleInteraction = (event) => {
      const { type } = event.detail;
      console.log("Interacción detectada:", type);
      if (type === "pc") {
        setShowPcScreen(true);
        setActiveInteraction(null);
        setSelectedProject(null);
      } else {
        setActiveInteraction(type);
        setShowPcScreen(false);
        setSelectedProject(null);
      }
    };
    document.addEventListener("object-interacted", handleInteraction);
    return () =>
      document.removeEventListener("object-interacted", handleInteraction);
  }, []);

  const closeWindow = () => {
    console.log("Cerrando ventana general");
    setActiveInteraction(null);
    setSelectedProject(null);
    setShowPcScreen(true);
  };

  const closePcScreen = () => {
    console.log("Cerrando pantalla PC");
    setShowPcScreen(false);
    setActiveInteraction(null);
    setSelectedProject(null);
  };

  const openProject = (project) => {
    console.log("Proyecto seleccionado:", project);
    setSelectedProject(project);
  };

  const closeProjectDetail = () => {
    console.log("Cerrando detalle de proyecto");
    setSelectedProject(null);
  };

  // Mapa de ventanas para simplificar render
  const windowMap = {
    aboutme: (
      <AboutMeDetail
        data={aboutMeData}
        baseUrl={BASE_URL}
        onClose={closeWindow}
      />
    ),
    projects: (
      <IconWindow title="Proyectos" onClose={closeWindow}>
        <ProjectsContent
          projectsData={projectsData}
          sections={sectionsData} // ✅ ahora pasamos las secciones
          onSelectProject={openProject}
        />
      </IconWindow>
    ),
    // Podés agregar más ventanas aquí simplemente registrando otra key
  };

  return (
    <>
      {/* Pantalla PC */}
      {showPcScreen && (
        <div className="screen-overlay" onClick={closePcScreen}>
          <div
            className="screen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <PcComponent onNavigate={setActiveInteraction} />
          </div>
        </div>
      )}

      {/* Ventana activa */}
      {!selectedProject && activeInteraction && windowMap[activeInteraction]}

      {/* Ventana de detalle de proyecto */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          baseUrl={BASE_URL}
          onClose={closeProjectDetail}
        />
      )}
    </>
  );
}
