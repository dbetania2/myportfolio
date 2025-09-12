const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;

export async function getAboutMe() {
  const res = await fetch(
    `${API_URL}/about-me?populate=profile_picture,SocialLink,skills`
  );
  const data = await res.json();
  console.log("About Me Data:", data); // log de depuración
  return data.data;
}

export async function getProjects() {
  const res = await fetch(
    `${API_URL}/projects?populate[featured_image]=*&populate[gallery]=*&populate[tags]=*`
  );
  const data = await res.json();
  console.log("All Projects Data RAW:", data); // <-- log completo
  return data.data;
}



export async function fetchProjectBySlug(slug: string) {
  const res = await fetch(
    `${API_URL}/projects?filters[slug][$eq]=${slug}&populate[featured_image]=*&populate[gallery]=*&populate[tags]=*`
  );
  const data = await res.json();
  console.log("Project by Slug:", data); // log de depuración
  return data?.data?.[0] ?? null;
}

