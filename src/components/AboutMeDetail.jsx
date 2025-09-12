// src/components/AboutMeDetail.jsx
import React from "react";
import IconWindow from "../layouts/iconwindow/IconWindow.jsx";
import { normalizeStrapiUrl } from "../utils/utils.js"; 
import "./sections/aboutme/AboutMe.css";

export default function AboutMeDetail({ data, baseUrl, onClose }) {
  if (!data) return <p>No se pudo cargar la información</p>;
  const { attributes } = data;
  if (!attributes) return <p>Sin atributos</p>;

  const { name, biography, profile_picture, contact_mail, SocialLink, skills } = attributes;

  const pictureUrl = profile_picture?.data?.attributes?.url
    ? normalizeStrapiUrl(baseUrl, profile_picture.data.attributes.url)
    : null;

  return (
    <IconWindow title="Sobre mí" onClose={onClose}>
      <div className="about-me-page">
        {/* Cabecera */}
        <div className="about-me-header">
          {pictureUrl && (
            <img
              src={pictureUrl}
              alt={`Foto de perfil de ${name || "yo"}`}
              className="profile-picture"
            />
          )}
          {name && <h1>{name}</h1>}
        </div>

        {/* Biografía */}
        {biography && (
          <div className="about-me-bio">
            <h2>Sobre mí</h2>
            <p>{biography}</p>
          </div>
        )}

        {/* Contacto */}
        {contact_mail && (
          <div className="about-me-contact">
            <h2>Contacto</h2>
            <p>
              📧 <a href={`mailto:${contact_mail}`}>{contact_mail}</a>
            </p>
          </div>
        )}

        {/* Redes Sociales */}
        {SocialLink && SocialLink.length > 0 ? (
          <div className="about-me-social">
            <h2>Redes Sociales</h2>
            <ul>
              {SocialLink.map((link) => (
                <li key={link.id}>
                  <a href={link.platform_url} target="_blank" rel="noopener noreferrer">
                    {link.platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No hay redes sociales disponibles</p>
        )}

        {/* Skills */}
        {skills?.data?.length > 0 ? (
          <div className="about-me-skills">
            <h2>Skills</h2>
            <ul>
              {skills.data.map((skill) => (
                <li key={skill.id}>{skill.attributes?.name}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No hay skills disponibles</p>
        )}
      </div>
    </IconWindow>
  );
}
