// src/components/WindowController.jsx
import React, { useState, useEffect } from 'react';
import PcComponent from './pc/pcComponent/PcComponent.jsx';
import AboutMeContent from './sections/aboutme/AboutMeContent.jsx';
import IconWindow from '../layouts/iconwindow/IconWindow.jsx';


// controlador principal para el manejo de las ventanas y pantallas de la interfaz
export default function WindowController({ aboutMeData }) {
 // estado para la interaccion activa: 'aboutme', 'projects', etc.
 const [activeInteraction, setActiveInteraction] = useState(null);
 // estado para mostrar la pantalla de la pc
 const [showPcScreen, setShowPcScreen] = useState(false);


 // efecto que escucha el evento de interaccion para cambiar el estado
 useEffect(() => {
   const handleInteraction = (event) => {
     const { type } = event.detail;
     // si la interaccion es con la pc, se muestra la pantalla de la pc
     if (type === 'pc') {
       setShowPcScreen(true);
       setActiveInteraction(null);
     } else {
       // si es otra interaccion, se muestra la ventana correspondiente
       setActiveInteraction(type);
       setShowPcScreen(false);
     }
   };


   // se agrega un oyente de eventos al montar el componente
   document.addEventListener('object-interacted', handleInteraction);
   // se remueve el oyente al desmontar para evitar fugas de memoria
   return () => document.removeEventListener('object-interacted', handleInteraction);
 }, []);


 // funcion para cerrar la ventana actual y volver a la pantalla de la pc
 const closeWindow = () => {
   setActiveInteraction(null);
   setShowPcScreen(true);
 };


 // funcion para cerrar la pantalla de la pc y volver al mapa principal
 const closePcScreen = () => {
   setShowPcScreen(false);
   setActiveInteraction(null);
 };


 // funcion para renderizar el contenido de la ventana segun la interaccion activa
 const renderContent = () => {
   switch (activeInteraction) {
     case 'aboutme':
       return <AboutMeContent data={aboutMeData} />;
     default:
       return null;
   }
 };


 // renderizado condicional de los componentes de la interfaz
 return (
   <>
     {/* se muestra la pantalla de la pc si el estado es verdadero */}
     {showPcScreen && (
       <div className="screen-overlay" onClick={closePcScreen}>
         <div className="screen-content" onClick={(e) => e.stopPropagation()}>
           <PcComponent onNavigate={setActiveInteraction} />
         </div>
       </div>
     )}


     {/* se muestra la ventana de icono si hay una interaccion activa y no es la pc */}
     {activeInteraction && activeInteraction !== 'pc' && (
       <IconWindow
         title={activeInteraction === 'aboutme' ? 'Sobre mí' : ''}
         onClose={closeWindow}
       >
         {renderContent()}
       </IconWindow>
     )}
   </>
 );
}