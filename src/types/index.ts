export interface ThemeColors {
  bg: string;
  card: string;
  border: string;
  accent: string;
  featured: string;
  textMain: string;
  textDim: string;
}

export interface ParticlesConfig {
  color: string;
  lineOpacity: number;
  count: number;
}

export interface ProfileConfig {
  username: string;
  pageTitle: string;
  description: string;
  tagFilter: string;
  defaultImage: string;
}

export interface AppConfig {
  profile: ProfileConfig;
  theme: {
    colors: ThemeColors;
    particles: ParticlesConfig;
  };
}

export interface Repository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  topics: string[];
  language: string | null;
}