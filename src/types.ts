export interface AboutData {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  education: string;
  experience: string;
  resumeUrl: string;
  logoType?: "text" | "image";
  logoText?: string;
  logoImage?: string;
}

export interface SkillData {
  id: string;
  category: "Frontend" | "Backend" | "Tools & Others" | string;
  name: string;
  progress: number;
  icon: string;
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  githubLink: string;
  liveLink: string;
  image: string;
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  date: string;
  readTime: string;
  author: string;
  tags: string[];
  image: string;
  seoKeywords?: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  facebook: string;
  twitter: string;
  youtube?: string;
  externalResume?: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  status: "unread" | "read" | "replied" | string;
}

export interface PortfolioData {
  about: AboutData;
  skills: SkillData[];
  projects: ProjectData[];
  blogs: BlogPost[];
  socialLinks: SocialLinks;
}
