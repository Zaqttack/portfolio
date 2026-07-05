export interface Project {
  id: string;
  title: string;
  tag: 'product' | 'side';
  year: string;
  stack: string[];
  blurb: string;
  link: string | null;
  linkLabel: string | null;
  published: boolean;
  sortOrder: number;
}

export interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  published: boolean;
  featured: boolean;
}

export interface WorkEntry {
  id: string;
  role: string;
  org: string;
  period: string;
  location: string;
  bullets: string[];
  accent: boolean;
  sortOrder: number;
}

export interface LeadershipEntry {
  id: string;
  role: string;
  period: string;
  desc: string;
  sortOrder: number;
}

export interface Profile {
  name: string;
  tagline: string;
  intro: string;
  now: string;
  openToWork: boolean;
  email: string;
  github: string;
  linkedin: string;
  resume: string;
}
