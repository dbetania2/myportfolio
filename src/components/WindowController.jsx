import React, { useState, useEffect } from "react";
import PcComponent from "./pc/pcComponent/PcComponent.jsx";
import ProjectsContent from "./sections/projects/ProjectsContent.jsx";
import IconWindow from "../layouts/iconwindow/IconWindow.jsx";
import ProjectDetail from "./sections/projects/ProjectDetail.jsx"; 
import AboutMeDetail from "./sections/aboutme/AboutMeDetail.jsx";
// 1. Importamos el nuevo componente
import Whiteboard from "./sections/whiteboard/Whiteboard.jsx";

// 2. Recibimos 'whiteboardData' en las props
export default function WindowController({ aboutMeData, projectsData, sectionsData, whiteboardData }) {
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [showPcScreen, setShowPcScreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  const BASE_URL = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  // Logs iniciales (Agregamos whiteboardData para depurar)
  useEffect(() => {
    console.log("AboutMeData recibido:", aboutMeData);
    console.log("ProjectsData recibido:", projectsData);
    console.log("SectionsData recibido:", sectionsData);
    console.log("WhiteboardData recibido:", whiteboardData);
  }, [aboutMeData, projectsData, sectionsData, whiteboardData]);

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
        // Aquí entrará type === "whiteboard"
        setActiveInteraction(type);
        setShowPcScreen(false);
        setSelectedProject(null);
      }
    };
    document.addEventListener("object-interacted", handleInteraction);
    return () =>
      document.removeEventListener("object-interacted", handleInteraction);
  }, []);

  // Cierra ventanas "virtuales" y vuelve a la PC
  const closeWindow = () => {
    console.log("Cerrando ventana general");
    setActiveInteraction(null);
    setSelectedProject(null);
    setShowPcScreen(true);
  };

  // NUEVO: Cierra objetos "físicos" (como el Pizarrón) y vuelve al juego/habitación
  const closeDirectInteraction = () => {
    console.log("Cerrando interacción física");
    setActiveInteraction(null); // Vuelve a null (se ve el juego de fondo)
    setShowPcScreen(false);     // Asegura que la PC no salte
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

  // Mapa de ventanas (Strategy Pattern)
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
          sections={sectionsData} 
          onSelectProject={openProject}
        />
      </IconWindow>
    ),
    // 3. NUEVA ENTRADA: El Pizarrón
    // Usamos 'whiteboard' porque ese es el "type" que pusiste en el polígono
    whiteboard: (
      <Whiteboard 
        items={whiteboardData}    // Pasamos los datos de Strapi
        baseUrl={BASE_URL}        // Para armar la URL de las imágenes
        onClose={closeDirectInteraction} // Usamos la nueva función de cerrar
      />
    )
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

      {/* Ventana activa (Aquí se pintará el Whiteboard si type es 'whiteboard') */}
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