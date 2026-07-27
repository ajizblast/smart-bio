export interface Socials {
  instagram: string;
  tiktok: string;
  threads: string;
  facebook: string;
  youtube: string;
  whatsapp: string;
}

export interface Profile {
  name: string;
  bio: string;
  avatar: string;
  socials: Socials;
}

export type AnimationType = 'none' | 'bounce' | 'pulse' | 'wobble' | 'shake' | 'glow';

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon: string;
  animation: AnimationType;
  active: boolean;
}

export interface HotelItem {
  id: string;
  name: string;
  rating: string;
  location: string;
  price: string;
  image: string;
  badge: string;
  city: string;
  bookingUrl: string;
}

export type PageType = 'hotel' | 'custom';

export interface CustomPage {
  id: string;
  title: string;
  type: PageType;
  filterCity?: string;
  description?: string;
  customImg?: string;
  customText?: string;
}

export type ThemeKey =
  | 'solid-light'
  | 'solid-dark'
  | 'gradient-sunset'
  | 'gradient-oceanic'
  | 'gradient-cosmic'
  | 'minimalist-border'
  | 'theme-forest'
  | 'theme-sea'
  | 'theme-desert'
  | 'theme-nebula'
  | 'theme-sakura';

export interface ThemeStyles {
  bg: string;
  bgStyle?: string;
  card: string;
  subText: string;
  avatarBorder: string;
  badge: string;
  tag: string;
}

export interface AppState {
  profile: Profile;
  theme: ThemeKey;
  links: LinkItem[];
  hotels: HotelItem[];
  pages: CustomPage[];
}
