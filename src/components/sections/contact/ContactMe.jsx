// src/components/sections/contact/ContactMe.jsx
import React, { useState } from 'react';
import IconWindow from "../../../layouts/iconwindow/IconWindow.jsx";
import './ContacMe.css';

export default function ContactMe({ aboutMeData, onClose }) {
  const [status, setStatus] = useState("");

  const FORM_ENDPOINT = import.meta.env.PUBLIC_CONTACT_FORM_ENDPOINT;

  // Datos de Strapi
  const socialLinks = aboutMeData?.attributes?.SocialLink || [];
  const myEmail = aboutMeData?.attributes?.contact_mail;
  const myName = aboutMeData?.attributes?.name || "User"; 

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!FORM_ENDPOINT) {
      console.error("Falta PUBLIC_CONTACT_FORM_ENDPOINT en .env");
      setStatus("error");
      return;
    }
    const form = e.target;
    const data = new FormData(form);

    try {
      setStatus("sending");
      const response = await fetch(FORM_ENDPOINT, {
        method: "POST",
        body: data,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <IconWindow title="Contact.html" onClose={onClose}>
      <div className="contact-layout">
        
        {/* BARRA LATERAL */}
        <aside className="contact-sidebar">
          
          {/* NUEVO: Tu perfil (Integrado con estilo visual anterior) */}
          <div className="profile-header">
            <h2 className="profile-name">{myName}</h2>
            <p className="profile-role">Full Stack Developer</p>
          </div>

          <div className="separator-line"></div>

          <h3>Mis Redes</h3>
          <ul className="social-links-list">
            {socialLinks.map((link) => (
              <li key={link.id}>
                <a 
                  href={link.platform_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  ➤ {link.platform}
                </a>
              </li>
            ))}
          </ul>
          
          {myEmail && (
            <div className="direct-email-box">
              <small>Email directo:</small>
              <a href={`mailto:${myEmail}`}>{myEmail}</a>
            </div>
          )}
        </aside>

        {/* FORMULARIO */}
        <main className="contact-main">
          <h3>Escríbeme un mensaje</h3>
          
          {status === "success" ? (
            <div className="success-msg">
              <p>:D ¡Mensaje enviado correctamente!</p>
              <p>Gracias por contactarme.</p>
              <button onClick={() => setStatus("")}>Enviar otro</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="pixel-form">
              <div className="form-row">
                <label>Tu Email:</label>
                <input 
                  type="email" 
                  name="email" 
                  placeholder="nombre@ejemplo.com" 
                  required 
                />
              </div>
              
              <div className="form-row">
                <label>Asunto:</label>
                <input 
                  type="text" 
                  name="subject" 
                  placeholder="Propuesta..." 
                  required 
                />
              </div>

              <div className="form-row">
                <label>Mensaje:</label>
                <textarea 
                  name="message" 
                  rows="6" 
                  placeholder="Hola, me gustaría hablar sobre..."
                  required
                ></textarea>
              </div>

              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Enviando..." : "Enviar Mensaje"}
              </button>
              
              {status === "error" && (
                <p className="error-text"> :C Error al enviar. Por favor intenta por mail.</p>
              )}
            </form>
          )}
        </main>

      </div>
    </IconWindow>
  );
}