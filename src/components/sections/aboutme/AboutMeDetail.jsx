// src/components/sections/aboutme/AboutMeDetail.jsx
// src/components/sections/aboutme/AboutMeDetail.jsx
import React from "react";
import IconWindow from "../../../layouts/iconwindow/IconWindow.jsx";
import { normalizeStrapiUrl } from "../../../utils/utils.js";
import "./AboutMe.css";

export default function AboutMeDetail({ data, baseUrl, onClose }) {
  if (!data) return <p>No se pudo cargar la información</p>;

  const { attributes } = data;
  if (!attributes) return <p>Sin atributos</p>;

  const {
    name,
    profile_picture,
    contact_mail,
    SocialLink,
    skills,
    biography_blocks, // 👈 nuevo campo desde Strapi
  } = attributes;

  const pictureUrl = profile_picture?.data?.attributes?.url
    ? normalizeStrapiUrl(baseUrl, profile_picture.data.attributes.url)
    : null;

  return (
    <IconWindow title="Sobre mí" onClose={onClose}>
      <div className="about-me-page">
        {/* Cabecera */}
        <div className="about-me-header-top">
          {pictureUrl && (
            <img
              src={pictureUrl}
              alt={`Foto de perfil de ${name || "yo"}`}
              className="profile-picture-top pixel-hover"
            />
          )}
          <div className="about-me-header-info">
            {name && (
              <h1 className="about-me-name" data-text={name}>
                {name}
              </h1>
            )}
            <div className="contact-social">
              {contact_mail && <a href={`mailto:${contact_mail}`}>{contact_mail}</a>}
              {SocialLink &&
                SocialLink.length > 0 &&
                SocialLink.map((link) => (
                  <React.Fragment key={link.id}>
                    <span> | </span>
                    <a href={link.platform_url} target="_blank" rel="noopener noreferrer">
                      {link.platform}
                    </a>
                  </React.Fragment>
                ))}
            </div>
          </div>
        </div>

        {/* Biografía Blocks */}
        {biography_blocks && biography_blocks.length > 0 && (
          <div className="about-me-bio">
            {biography_blocks.map((block, idx) => {
              const text = block.text;
              const imgUrl = block.image?.data?.attributes?.url
                ? normalizeStrapiUrl(baseUrl, block.image.data.attributes.url)
                : null;
              const position = block.image_position || "none";

              return (
                <div key={idx} className={`bio-block position-${position}`}>
                  {position === "left" && imgUrl && (
                    <img src={imgUrl} alt={`bio-img-${idx}`} className="side-image left pixel-hover" />
                  )}
                  {position === "top" && imgUrl && (
                    <img src={imgUrl} alt={`bio-img-${idx}`} className="side-image top pixel-hover" />
                  )}
                  <p>{text}</p>
                  {position === "right" && imgUrl && (
                    <img src={imgUrl} alt={`bio-img-${idx}`} className="side-image right pixel-hover" />
                  )}
                  {position === "bottom" && imgUrl && (
                    <img src={imgUrl} alt={`bio-img-${idx}`} className="side-image bottom pixel-hover" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Skills */}
        {skills?.data?.length > 0 && (
          <div className="about-me-skills">
            <h2>Skills</h2>
            <ul>
              {skills.data.map((skill) => (
                <li key={skill.id}>{skill.attributes?.name}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </IconWindow>
  );
}

