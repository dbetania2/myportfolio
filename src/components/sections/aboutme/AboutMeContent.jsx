import React from 'react';
import './AboutMe.css'; // Asegúrate de que este archivo exista

// Este componente solo se encarga de mostrar el contenido
// La ventana (IconWindow) se renderizará desde el componente padre, WindowController
export default function AboutMeContent({ data }) {
  if (!data) return <p>No se pudo cargar la información</p>;

  const { attributes } = data; // Strapi devuelve los datos dentro de "attributes"
  if (!attributes) return <p>Sin atributos</p>;

  const { biography, profile_picture, contact_mail, SocialLink } = attributes;

  const pictureUrl = profile_picture?.data?.attributes?.url;

  return (
    <div className="about-me-container">
      {pictureUrl && (
        <img src={pictureUrl} alt="Profile" className="profile-picture" />
      )}

      {biography && <p>{biography}</p>}

      {contact_mail && (
        <p>
          📧 <a href={`mailto:${contact_mail}`}>{contact_mail}</a>
        </p>
      )}

      {SocialLink && SocialLink.length > 0 && (
        <div className="social-links">
          <h3>Conéctate conmigo</h3>
          <ul>
            {SocialLink.map((link, i) => (
              <li key={i}>
                <a href={link.platform_url} target="_blank" rel="noopener noreferrer">
                  {link.platform}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
