export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  tags: string[];
  link?: string;
  github?: string;
  featured?: boolean;
  architecture?: string[];
  metrics?: string[];
  longDescription?: string;
  image?: string;
  badge?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  period: string;
  description: string;
  highlights: string[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  alias: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  skills: string[];
  socialLinks: SocialLink[];
}
