// src/components/WindowController.jsx
import React, { useState, useEffect } from "react";
import PcComponent from "./pc/pcComponent/PcComponent.jsx";
import ProjectsContent from "./sections/projects/ProjectsContent.jsx";
import IconWindow from "../layouts/iconwindow/IconWindow.jsx";
import ProjectDetail from "./sections/projects/ProjectDetail.jsx"; 
import AboutMeDetail from "./sections/aboutme/AboutMeDetail.jsx";
import Whiteboard from "./sections/whiteboard/Whiteboard.jsx";
import ContactMe from "./sections/contact/ContactMe.jsx";
import ExitHint from "./ui/ExitHint.jsx";
import DialogueBox from "./ui/DialogueBox.jsx"; 

// RECIBIMOS 'introDialogues' (Viene desde Astro)
export default function WindowController({ 
  aboutMeData, 
  projectsData, 
  sectionsData, 
  whiteboardData, 
  introDialogues 
}) {
  
  // --- ESTADOS ---
  const [activeInteraction, setActiveInteraction] = useState(null);
  const [showPcScreen, setShowPcScreen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  //  estado para el diálogo
  const [showDialogue, setShowDialogue] = useState(false);

  const BASE_URL = import.meta.env.PUBLIC_STRAPI_BASE_URL;

  // --- LOGICA DE DATOS ---
  // Transformamos los datos complejos de Strapi a una lista simple de textos
  const dialogueLines = introDialogues && introDialogues.length > 0
    ? introDialogues.map(d => d.attributes.message)
    : [
        // Texto de respaldo por si Strapi falla
        "¡Hola! 👋 Bienvenido a mi portfolio.",
        "Soy Desarrolladora Full Stack.",
        "Explora la habitación para ver mis proyectos."
      ];

  // --- DETECTOR DE INTERACCIONES (Eventos del Juego) ---
  useEffect(() => {
    const handleInteraction = (event) => {
      const { type } = event.detail;
      console.log("Interacción detectada:", type);
      
      if (type === "pc") {
        setShowPcScreen(true);
        setActiveInteraction(null);
        setSelectedProject(null);
        setShowDialogue(false); // Cierra diálogo si abres PC
      } 
      //  DETECTAR CLICK EN PERSONAJE
      else if (type === "character") {
        setShowDialogue(true);
        setShowPcScreen(false);
        setActiveInteraction(null);
      } 
      else {
        // Para Whiteboard u otros objetos
        setActiveInteraction(type);
        setShowPcScreen(false);
        setSelectedProject(null);
        setShowDialogue(false);
      }
    };
    
    document.addEventListener("object-interacted", handleInteraction);
    return () => document.removeEventListener("object-interacted", handleInteraction);
  }, []);

  // --- FUNCIONES DE CIERRE ---
  const closeWindow = () => {
    setActiveInteraction(null);
    setSelectedProject(null);
    // IMPORTANTE: Al cerrar una ventana interna, volvemos a ver la PC (si estábamos en ella)
    // Pero como IconWindow tiene fondo transparente ahora, la PC siempre se ve de fondo.
    // Mantenemos showPcScreen true.
  };

  const closeDirectInteraction = () => {
    setActiveInteraction(null);
    setShowPcScreen(false);
  };

  const closePcScreen = () => {
    setShowPcScreen(false);
    setActiveInteraction(null);
    setSelectedProject(null);
  };

  const openProject = (project) => {
    setSelectedProject(project);
  };

  const closeProjectDetail = () => {
    setSelectedProject(null);
  };

  // --- MAPA DE VENTANAS (Contenido de la PC) ---
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
    // Objetos físicos fuera de la PC
    whiteboard: (
      <Whiteboard 
        items={whiteboardData} 
        baseUrl={BASE_URL} 
        onClose={closeDirectInteraction} 
      />
    ),
    contact: (
        <ContactMe 
          aboutMeData={aboutMeData} 
          onClose={closeWindow} 
        />
      )
  };

  return (
    <>
      {/*  PANTALLA PC (MONITOR GIGANTE) */}
      {showPcScreen && (
        <div className="screen-overlay" onClick={closePcScreen}>
          <div
            className="screen-content"
            onClick={(e) => e.stopPropagation()}
          >
            <PcComponent onNavigate={setActiveInteraction} closePc={closePcScreen}/>
          </div>
          {/* USARLO AQUÍ (Fuera del screen-content pero dentro del overlay) */}
          <ExitHint />
        </div>
      )}

      {/* VENTANAS FLOTANTES (Dentro de la PC o Whiteboard) */}
      {!selectedProject && activeInteraction && windowMap[activeInteraction]}

      {/* DETALLE DE PROYECTO (Nivel más profundo) */}
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          baseUrl={BASE_URL}
          onClose={closeProjectDetail}
        />
      )}

      {/*  CAJA DE DIÁLOGO (RPG STYLE)  */}
      {/* Se muestra solo si showDialogue es true (click en personaje) */}
      <DialogueBox 
        isOpen={showDialogue} 
        onClose={() => setShowDialogue(false)} 
        messages={dialogueLines}
      />
    </>
  );
}