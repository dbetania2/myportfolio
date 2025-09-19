// src/components/sections/aboutme/AboutMeContent.jsx
import React from 'react';
import './AboutMe.css';
import { normalizeStrapiUrl } from '../../../utils/utils';


export default function AboutMeContent({ data }) {
  if (!data) return <p>No se pudo cargar la información</p>;

  const { attributes } = data;
  if (!attributes) return <p>Sin atributos</p>;

  // Campos según Strapi
  const { name, biography, profile_picture, contact_mail, SocialLink, skills } = attributes;

  const baseUrl = import.meta.env.PUBLIC_STRAPI_BASE_URL;

 const pictureUrl = profile_picture?.data?.attributes?.url
  ? normalizeStrapiUrl(baseUrl, profile_picture.data.attributes.url)
  : null;

  return (
    <div className="about-me-page">
      {/* Cabecera */}
      <div className="about-me-header">
        {pictureUrl && (
          <img
            src={pictureUrl}
            alt={`Foto de perfil de ${name || 'yo'}`}
            className="profile-picture"
          />
        )}
        {name && <h1>{name}</h1>}
      </div>

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

      {/* Biografía */}
      {biography && (
        <div className="about-me-bio">
          <h2>Sobre mí</h2>
          <p>{biography}</p>
        </div>
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
  );
}
