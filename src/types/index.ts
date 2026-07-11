export interface Profile {
  id: string;
  name: string;
  tagline: string | null;
  bio: string | null;
  hero_title: string | null;
  terminal_status: string | null;
  now_expires_at: string | null;
  contact_cta: string | null;
  avatar_url: string | null;
  avatar_enabled: boolean;
  location: string | null;
  location_short: string | null;
  resume_url: string | null;
  email: string | null;
  github: string | null;
  linkedin: string | null;
  twitter: string | null;
  website: string | null;
  open_to_work: boolean;
  writing_enabled: boolean;
  projects_enabled: boolean;
  resume_download_enabled: boolean;
  projects_subtitle: string | null;
  writing_subtitle: string | null;
  experience_subtitle: string | null;
  footer_tagline: string | null;
  writing_footer_note: string | null;
  skills_subtitle: string | null;
  accent_color: string | null;
  updated_at: string;
}

export interface ProfileLink {
  id: string;
  label: string;
  url: string;
  display_order: number;
  created_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  start_year: string;
  end_year: string | null;
  resume_include: boolean;
  display_order: number;
  created_at: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string | null;
  year: string | null;
  resume_include: boolean;
  display_order: number;
  created_at: string;
}

export interface Company {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string | null;
  company_id: string | null;
  company_data?: Company | null;
  role: string;
  start_date: string;
  end_date: string | null;
  org_type: 'job' | 'internship' | 'contract' | 'volunteer';
  location: string | null;
  tech_tags: string[];
  resume_include: boolean;
  display_order: number;
  created_at: string;
  experience_bullets?: ExperienceBullet[];
}

export interface ExperienceBullet {
  id: string;
  experience_id: string;
  text: string;
  visibility: 'public' | 'private';
  source: 'self' | 'work_import';
  display_order: number;
}

export interface InvolvementOrg {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  logo: string | null;
  resume_include: boolean;
  display_order: number;
  involvement_roles?: InvolvementRole[];
}

export interface InvolvementRole {
  id: string;
  org_id: string;
  role: string;
  start_date: string;
  end_date: string | null;
  highlights: string[] | null;
  metrics: Record<string, unknown>;
  display_order: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string | null;
  date: string | null;
  related_experience_id: string | null;
  related_org_id: string | null;
  evidence_url: string | null;
  visibility: 'public' | 'private';
  resume_include: boolean;
  display_order: number;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string | null;
  proficiency: number | null;
  source_experience_id: string | null;
  source: 'self' | 'work_import';
  resume_include: boolean;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  body: string | null;
  cover_image: string | null;
  tags: string[];
  repo_url: string | null;
  live_url: string | null;
  started_at: string | null;
  ended_at: string | null;
  status: 'draft' | 'published';
  featured: boolean;
  resume_include: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  body: string | null;
  excerpt: string | null;
  cover_image: string | null;
  tags: string[];
  published_at: string | null;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption: string | null;
  taken_at: string | null;
  display_order: number;
}

export interface ImportStaging {
  id: string;
  raw_payload: Record<string, unknown>;
  source_note: string | null;
  reviewed: boolean;
  created_at: string;
}

export interface PageView {
  id: string;
  ts: string;
  path: string;
  referrer: string | null;
  user_agent: string | null;
  ip_hash: string | null;
  country: string | null;
  is_bot: boolean;
  bot_name: string | null;
}

export interface BotSignature {
  id: string;
  pattern: string;
  bot_name: string;
  category: 'search' | 'ai_training' | 'other';
  created_at: string;
}

export interface SearchResult {
  kind: 'project' | 'post' | 'skill' | 'job' | 'achievement';
  label: string;
  hint: string;
  searchText: string;
  url: string;
}

export interface AdminActivity {
  id: string;
  actor: string | null;
  table_name: string | null;
  row_id: string | null;
  action: 'insert' | 'update' | 'delete';
  ts: string;
}
