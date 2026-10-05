export interface BarbershopInfo {
  name: string;
  slogan: string;
  description: string;
  foundedYear: number;
  story: string;
  address: string;
  neighborhood: string;
  city: string;
  phone: string;
  whatsapp: string;
  instagram: string;
  googleMapsUrl: string;
  googleReviewUrl: string;
  rating: number;
  reviewCount: number;
  openingHours: { days: string; hours: string }[];
  logoUrl: string;
  heroImageUrl: string;
  storyImageUrl: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  description: string;
  price: number;
  durationMinutes: number;
  imageUrl: string;
  badge?: string;
  active: boolean;
}

export interface BookingRecord {
  id: string;
  customerName: string;
  customerPhone?: string;
  date: string;
  time: string;
  people: number;
  service: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface BookingSettings {
  whatsappNumber: string;
  maxPeople: number;
  intervalMinutes: number;
  openingTime: string;
  closingTime: string;
  daysOpen: string[];
  messageTemplate: string;
}

export interface ThemeConfig {
  presetName: string;
  backgroundColor: string;
  surfaceColor: string;
  surfaceCard: string;
  accentColor: string;
  textPrimary: string;
  textSecondary: string;
  borderColor: string;
  borderRadius: number;
  buttonRadius: number;
  fontFamily: string;
  animationSpeed: 'smooth' | 'normal' | 'fast';
  isDark: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  date: string;
  rating: number;
  comment: string;
  verified: boolean;
}

export interface MetricStats {
  views: number;
  whatsappClicks: number;
  bookingsInitiated: number;
  instagramClicks: number;
  mapsClicks: number;
}

export type ButtonType =
  | 'whatsapp'
  | 'instagram'
  | 'booking'
  | 'location'
  | 'reviews'
  | 'call'
  | 'wifi'
  | 'pix'
  | 'custom_url';

export type ButtonStyle =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'minimal'
  | 'glass'
  | 'custom';

export interface ButtonItem {
  id: string;
  label: string;
  subtitle?: string;
  url?: string;
  icon: string;
  type: ButtonType;
  style: ButtonStyle;
  active: boolean;
  order: number;
  badge?: string;
  customColor?: string;
  wifiConfig?: {
    networkName: string;
    password: string;
  };
  pixConfig?: {
    key: string;
    description: string;
    recipientName?: string;
  };
}

export type SectionType =
  | 'hero'
  | 'quick_links'
  | 'services'
  | 'gallery'
  | 'story'
  | 'location'
  | 'contact'
  | 'instagram_feed'
  | 'google_reviews'
  | 'custom';

export interface PageSection {
  id: string;
  type: SectionType;
  title: string;
  order: number;
  visible: boolean;
  canDelete?: boolean;
  settings?: {
    subtitle?: string;
    description?: string;
    imageUrl?: string;
    buttonText?: string;
    buttonUrl?: string;
    backgroundColor?: string;
  };
}

export interface InstagramPost {
  id: string;
  imageUrl: string;
  caption?: string;
  url: string;
  likes?: number;
}

export type InstagramLayout =
  | 'grid_2_columns'
  | 'grid_3_columns'
  | 'horizontal_carousel'
  | 'large_featured_post'
  | 'mixed_editorial';

export interface InstagramConfig {
  enabled: boolean;
  username: string;
  profileUrl: string;
  title: string;
  subtitle: string;
  buttonLabel: string;
  layout: InstagramLayout;
  postsLimit: number;
  autoplay: boolean;
  autoplayInterval: number;
  posts: InstagramPost[];
}

export interface WifiConfig {
  enabled: boolean;
  networkName: string;
  password: string;
}

export interface PixConfig {
  enabled: boolean;
  key: string;
  description: string;
  recipientName?: string;
}

// Media Manager Types
export type MediaCategory =
  | 'Logo'
  | 'Foto de Perfil'
  | 'Banner Principal'
  | 'Cortes'
  | 'Barba'
  | 'Equipe'
  | 'Barbearia'
  | 'Serviços'
  | 'Instagram'
  | 'Galeria'
  | 'Outras';

export interface MediaItem {
  id: string;
  fileUrl: string;
  thumbnailUrl?: string;
  fileName: string;
  category: MediaCategory;
  altText?: string;
  fileSize?: string;
  createdAt: string;
}

// Hero Carousel Types
export interface HeroSlide {
  id: string;
  imageUrl: string;
  order: number;
  visible: boolean;
  overlayEnabled: boolean;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface HeroCarouselSettings {
  enabled: boolean;
  autoplay: boolean;
  interval: number; // 3000, 4000, 5000, 6000, 8000, 10000
  transition: 'fade' | 'slide' | 'zoom' | 'smooth';
  showDots: boolean;
  showArrows: boolean;
  pauseOnInteraction: boolean;
}

// Gallery Types
export interface GalleryItem {
  id: string;
  imageUrl: string;
  title?: string;
  category?: string;
  order: number;
  visible: boolean;
}

export interface GallerySettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  layout: 'masonry' | 'grid' | 'carousel' | 'horizontal_scroll';
  columnsMobile: number;
  columnsDesktop: number;
  items: GalleryItem[];
}

// Business Hours & Automatic Status Types
export interface TimePeriod {
  opening: string; // e.g. "09:00"
  closing: string; // e.g. "20:00"
}

export interface DaySchedule {
  dayIndex: number; // 0: Domingo, 1: Segunda, ..., 6: Sábado
  dayName: string; // "Segunda-feira", etc.
  shortName: string; // "Seg"
  enabled: boolean;
  closedAllDay: boolean;
  periods: TimePeriod[];
}

export interface ClosedPopupConfig {
  enabled: boolean;
  title: string;
  message: string;
  buttonText: string;
  imageUrl?: string;
  showAutomatically: boolean;
  showStatusIndicator: boolean;
  openLabel: string;
  closedLabel: string;
}

// Cloud Backend & Supabase Types
export interface SupabaseConfig {
  url: string;
  anonKey: string;
  connected: boolean;
  lastTestedAt?: string;
  realtimeEnabled: boolean;
}

export type CloudSyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export interface CloudBackendState {
  barbershop: BarbershopInfo;
  services: ServiceItem[];
  bookingSettings: BookingSettings;
  theme: ThemeConfig;
  bookings: BookingRecord[];
  metrics: MetricStats;
  buttons: ButtonItem[];
  sections: PageSection[];
  instagram: InstagramConfig;
  wifi: WifiConfig;
  pix: PixConfig;
  mediaItems: MediaItem[];
  heroSlides: HeroSlide[];
  heroSettings: HeroCarouselSettings;
  gallery: GallerySettings;
  weeklySchedule: DaySchedule[];
  closedPopup: ClosedPopupConfig;
  supabaseConfig?: SupabaseConfig;
  lastUpdated?: string;
}
