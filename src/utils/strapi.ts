// src/utils/strapi.ts

/**
 * =====================================================================
 * INTERFACES ATÓMICAS
 * =====================================================================
 */

export interface StrapiImage {
  data: {
    id: number;
    attributes: {
      url: string;
      width?: number;
      height?: number;
      alternativeText?: string;
    };
  } | null;
}

export interface SocialLink {
  id: number;
  platform: string;
  platform_url: string; 
}

export interface Skill {
  id: number;
  attributes: {
    name: string;
    type?: string; 
    skill_image?: StrapiImage; 
  };
}

export interface Tag {
  id: number;
  attributes: {
    name: string;
  };
}

export interface BioBlock {
  id: number;
  text: string;
  image_position: 'left' | 'right' | 'top' | 'bottom' | 'none';
  image: StrapiImage;
}

/**
 * =====================================================================
 * INTERFACES DE COLECCIONES
 * =====================================================================
 */

export interface AboutAttributes {
  name: string;
  short_description: string;
  contact_mail: string;
  profile_picture: StrapiImage;
  SocialLink: SocialLink[];
  biography_blocks: BioBlock[];
  skills: {
    data: Skill[];
  };
}

export interface ProjectAttributes {
  title: string;
  description: string;
  intro?: string;
  github_url?: string;
  project_url?: string;
  featured_image?: StrapiImage;
  
  tags?: {
    data: Tag[];
  };
  
  // 🔥 AGREGADO: La relación con Skills
  skills?: {
    data: Skill[];
  };

  gallery?: {
    data: StrapiImage['data'][];
  };
}

export interface SectionAttributes {
  title: string;
}

// INTERFAZ PARA EL PIZARRÓN
export interface WhiteboardItemAttributes {
  title: string;
  type: 'image' | 'note'; 
  contentNote?: string;   
  image?: StrapiImage;    
}

// INTERFAZ PARA DIÁLOGOS
export interface GameDialogAttributes {
  section: string;
  speaker: string;
  message: string;
  order: number;
}

/**
 * =====================================================================
 * SERVICIO DE FETCHING (Singleton Logic)
 * =====================================================================
 */

export async function getPortfolioData() {
  const API_URL = import.meta.env.PUBLIC_STRAPI_API_URL;

  try {
    // 
    const [resAbout, resProjects, resSections, resWhiteboard, resDialogues] = await Promise.all([
      fetch(`${API_URL}/about-me?populate=profile_picture,SocialLink,skills,biography_blocks,biography_blocks.image`),
      
      fetch(`${API_URL}/projects?populate=featured_image,tags,gallery,skills.skill_image`),      
      fetch(`${API_URL}/project-sections?populate=tags`),
      fetch(`${API_URL}/whiteboard-items?populate=image`),
      fetch(`${API_URL}/game-dialogs?filters[section][$eq]=intro&sort=order:asc`)
    ]);

    // Parseo seguro de JSON
    const aboutJson = resAbout.ok ? await resAbout.json() : null;
    const projectsJson = resProjects.ok ? await resProjects.json() : null;
    const sectionsJson = resSections.ok ? await resSections.json() : null;
    const whiteboardJson = resWhiteboard.ok ? await resWhiteboard.json() : null;
    const dialoguesJson = resDialogues.ok ? await resDialogues.json() : null;

    // Retorno normalizado
    return {
      aboutMe: (aboutJson?.data as { id: number; attributes: AboutAttributes }) || null,
      
      projects: (Array.isArray(projectsJson?.data) 
        ? projectsJson.data 
        : []) as { id: number; attributes: ProjectAttributes }[],
      
      sections: (Array.isArray(sectionsJson?.data) 
        ? sectionsJson.data 
        : []) as { id: number; attributes: SectionAttributes }[],

      whiteboardItems: (Array.isArray(whiteboardJson?.data)
        ? whiteboardJson.data
        : []) as { id: number; attributes: WhiteboardItemAttributes }[],

      introDialogues: (Array.isArray(dialoguesJson?.data)
        ? dialoguesJson.data
        : []) as { id: number; attributes: GameDialogAttributes }[]
    };

  } catch (error) {
    console.error("Error crítico obteniendo datos de Strapi:", error);
    return { 
      aboutMe: null, 
      projects: [], 
      sections: [],
      whiteboardItems: [],
      introDialogues: []
    };
  }
}