// src/helpers/utils.js

/**
 * Normaliza una URL de Strapi combinando baseUrl + ruta relativa
 * @param {string} baseUrl - URL base de Strapi (import.meta.env.PUBLIC_STRAPI_BASE_URL)
 * @param {string} path - Ruta relativa de la imagen/archivo desde Strapi
 * @returns {string} - URL completa sin doble barra
 */
export function normalizeStrapiUrl(baseUrl, path) {
  if (!baseUrl || !path) return null;
  return `${baseUrl.replace(/\/$/, '')}/${path.replace(/^\//, '')}`;
}
