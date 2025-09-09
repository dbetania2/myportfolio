// src/components/iconWindow/IconWindow.jsx
import React from 'react';
import './IconWindow.css';


// componente de ventana generico que recibe un titulo, una funcion para cerrar y contenido
export default function IconWindow({ title, onClose, children }) {
 // contenedor principal de la ventana
 return (
   <div className="iconwindow-overlay show">
     {/* contenido de la ventana: cabecera y cuerpo */}
     <div className="iconwindow-content">
       {/* cabecera de la ventana con titulo y boton para cerrar */}
       <div className="iconwindow-header">
         {/* muestra el titulo de la ventana */}
         <div className="iconwindow-title">{title}</div>
         {/* boton para cerrar que ejecuta la funcion onClose */}
         <button className="iconwindow-close-button" onClick={onClose}>X</button>
       </div>
       {/* cuerpo de la ventana donde se muestra el contenido pasado por props */}
       <div className="iconwindow-body">{children}</div>
     </div>
   </div>
 );
}