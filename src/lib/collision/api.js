// src/lib/api.js

const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;

export async function getAboutMe() {
  const res = await fetch(`${API_URL}/about-me`);
  const data = await res.json();
  return data.data; // retorna solo el contenido
}

export async function getProjects() {
  const res = await fetch(`${API_URL}/projects`);
  const data = await res.json();
  return data.data; // retorna un array de proyectos
}
  