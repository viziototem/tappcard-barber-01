import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  BarbershopInfo,
  ServiceItem,
  BookingRecord,
  BookingSettings,
  ThemeConfig,
  MetricStats,
  ButtonItem,
  PageSection,
  InstagramConfig,
  WifiConfig,
  PixConfig,
  MediaItem,
  HeroSlide,
  HeroCarouselSettings,
  GallerySettings,
  GalleryItem,
  DaySchedule,
  ClosedPopupConfig
} from '../types';
import {
  DEFAULT_BARBERSHOP,
  DEFAULT_SERVICES,
  DEFAULT_BOOKING_SETTINGS,
  DEFAULT_THEME_PRESETS,
  INITIAL_BOOKINGS,
  DEFAULT_BUTTONS,
  DEFAULT_SECTIONS,
  DEFAULT_INSTAGRAM,
  DEFAULT_WIFI,
  DEFAULT_PIX,
  DEFAULT_MEDIA_ITEMS,
  DEFAULT_HERO_SLIDES,
  DEFAULT_HERO_SETTINGS,
  DEFAULT_GALLERY,
  DEFAULT_WEEKLY_SCHEDULE,
  DEFAULT_CLOSED_POPUP
} from '../data/defaultData';
import { calculateBusinessStatus } from '../utils/scheduleUtils';

interface AppContextType {
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

  // Media Manager & Hero Carousel & Gallery
  mediaItems: MediaItem[];
  heroSlides: HeroSlide[];
  heroSettings: HeroCarouselSettings;
  gallery: GallerySettings;

  // Business Schedule & Closed Status
  weeklySchedule: DaySchedule[];
  closedPopup: ClosedPopupConfig;
  isBusinessOpen: boolean;
  statusBadgeText: string;
  nextOpeningInfo: string;
  isClosedPopupDismissed: boolean;

  isAdminLoggedIn: boolean;
  currentView: 'public' | 'admin' | 'admin-login';
  isBookingModalOpen: boolean;
  selectedServiceForBooking: string;

  // Special Modals (Wi-Fi, PIX, Media Picker)
  activeSpecialModal: 'wifi' | 'pix' | null;
  activeSpecialData: any;
  openSpecialModal: (type: 'wifi' | 'pix', data?: any) => void;
  closeSpecialModal: () => void;

  isMediaPickerOpen: boolean;
  openMediaPicker: (callback: (url: string) => void) => void;
  closeMediaPicker: () => void;
  onSelectMediaFromPicker: (url: string) => void;

  dismissClosedPopup: () => void;

  // Navigation & Public / Admin Controls
  setCurrentView: (view: 'public' | 'admin' | 'admin-login') => void;
  openBookingModal: (serviceName?: string) => void;
  closeBookingModal: () => void;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  trackMetric: (key: keyof MetricStats) => void;

  // Barbershop Info & Theme
  updateBarbershop: (info: Partial<BarbershopInfo>) => void;
  updateTheme: (updates: Partial<ThemeConfig>) => void;
  setThemePreset: (presetName: string) => void;

  // Services CRUD
  addService: (service: Omit<ServiceItem, 'id'>) => void;
  updateService: (id: string, updates: Partial<ServiceItem>) => void;
  deleteService: (id: string) => void;

  // Bookings CRUD
  updateBookingSettings: (settings: Partial<BookingSettings>) => void;
  createBooking: (booking: {
    customerName: string;
    customerPhone?: string;
    date: string;
    time: string;
    people: number;
    service: string;
    notes?: string;
  }) => BookingRecord;
  updateBookingStatus: (id: string, status: BookingRecord['status']) => void;
  deleteBooking: (id: string) => void;

  // Buttons & Links Manager
  addButton: (button: Omit<ButtonItem, 'id' | 'order'>) => void;
  updateButton: (id: string, updates: Partial<ButtonItem>) => void;
  deleteButton: (id: string) => void;
  duplicateButton: (id: string) => void;
  toggleButtonVisibility: (id: string) => void;
  reorderButtons: (startIndex: number, endIndex: number) => void;
  setButtons: (buttons: ButtonItem[]) => void;

  // Page Sections Manager (Builder)
  addSection: (section: Omit<PageSection, 'id' | 'order'>) => void;
  updateSection: (id: string, updates: Partial<PageSection>) => void;
  deleteSection: (id: string) => void;
  duplicateSection: (id: string) => void;
  toggleSectionVisibility: (id: string) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  setSections: (sections: PageSection[]) => void;

  // Instagram Configuration & Posts
  updateInstagram: (updates: Partial<InstagramConfig>) => void;
  addInstagramPost: (post: { imageUrl: string; caption?: string; url: string }) => void;
  deleteInstagramPost: (id: string) => void;

  // Wi-Fi & PIX
  updateWifi: (updates: Partial<WifiConfig>) => void;
  updatePix: (updates: Partial<PixConfig>) => void;

  // Media Manager Actions
  addMediaItem: (item: Omit<MediaItem, 'id' | 'createdAt'>) => MediaItem;
  deleteMediaItem: (id: string) => void;
  updateMediaItem: (id: string, updates: Partial<MediaItem>) => void;
  assignMediaTo: (imageUrl: string, target: 'profile' | 'hero' | 'story' | 'gallery') => void;

  // Hero Carousel Actions
  addHeroSlide: (slide: Omit<HeroSlide, 'id' | 'order'>) => void;
  updateHeroSlide: (id: string, updates: Partial<HeroSlide>) => void;
  deleteHeroSlide: (id: string) => void;
  toggleHeroSlideVisibility: (id: string) => void;
  reorderHeroSlides: (startIndex: number, endIndex: number) => void;
  updateHeroSettings: (settings: Partial<HeroCarouselSettings>) => void;

  // Gallery Actions
  updateGallery: (settings: Partial<GallerySettings>) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'order'>) => void;
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => void;
  deleteGalleryItem: (id: string) => void;
  toggleGalleryItemVisibility: (id: string) => void;
  reorderGalleryItems: (startIndex: number, endIndex: number) => void;

  // Schedule & Closed Popup Actions
  updateWeeklySchedule: (schedule: DaySchedule[]) => void;
  updateDaySchedule: (dayIndex: number, updates: Partial<DaySchedule>) => void;
  updateClosedPopup: (config: Partial<ClosedPopupConfig>) => void;

  // Backup & Restore
  resetToDefaults: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonStr: string) => boolean;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  BARBERSHOP: 'tapp_barbershop_info',
  SERVICES: 'tapp_barbershop_services',
  BOOKING_SETTINGS: 'tapp_barbershop_booking_settings',
  THEME: 'tapp_barbershop_theme',
  BOOKINGS: 'tapp_barbershop_bookings',
  METRICS: 'tapp_barbershop_metrics',
  ADMIN_AUTH: 'tapp_barbershop_admin_auth',
  BUTTONS: 'tapp_barbershop_buttons_v2',
  SECTIONS: 'tapp_barbershop_sections_v2',
  INSTAGRAM: 'tapp_barbershop_instagram_v2',
  WIFI: 'tapp_barbershop_wifi_v2',
  PIX: 'tapp_barbershop_pix_v2',
  MEDIA: 'tapp_barbershop_media_v1',
  HERO_SLIDES: 'tapp_barbershop_hero_slides_v1',
  HERO_SETTINGS: 'tapp_barbershop_hero_settings_v1',
  GALLERY: 'tapp_barbershop_gallery_v1',
  SCHEDULE: 'tapp_barbershop_schedule_v1',
  CLOSED_POPUP: 'tapp_barbershop_closed_popup_v1'
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Barbershop Info
  const [barbershop, setBarbershop] = useState<BarbershopInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BARBERSHOP);
      return saved ? JSON.parse(saved) : DEFAULT_BARBERSHOP;
    } catch {
      return DEFAULT_BARBERSHOP;
    }
  });

  // 2. Services
  const [services, setServices] = useState<ServiceItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SERVICES);
      return saved ? JSON.parse(saved) : DEFAULT_SERVICES;
    } catch {
      return DEFAULT_SERVICES;
    }
  });

  // 3. Booking Settings
  const [bookingSettings, setBookingSettings] = useState<BookingSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKING_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_BOOKING_SETTINGS;
    } catch {
      return DEFAULT_BOOKING_SETTINGS;
    }
  });

  // 4. Theme
  const [theme, setTheme] = useState<ThemeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved ? JSON.parse(saved) : DEFAULT_THEME_PRESETS['Dark Premium'];
    } catch {
      return DEFAULT_THEME_PRESETS['Dark Premium'];
    }
  });

  // 5. Bookings
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // 6. Metrics
  const [metrics, setMetrics] = useState<MetricStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.METRICS);
      return saved ? JSON.parse(saved) : { views: 1420, whatsappClicks: 320, bookingsInitiated: 185, instagramClicks: 410, mapsClicks: 215 };
    } catch {
      return { views: 1420, whatsappClicks: 320, bookingsInitiated: 185, instagramClicks: 410, mapsClicks: 215 };
    }
  });

  // 7. Buttons & Links Manager
  const [buttons, setButtons] = useState<ButtonItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BUTTONS);
      return saved ? JSON.parse(saved) : DEFAULT_BUTTONS;
    } catch {
      return DEFAULT_BUTTONS;
    }
  });

  // 8. Sections Manager
  const [sections, setSections] = useState<PageSection[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SECTIONS);
      return saved ? JSON.parse(saved) : DEFAULT_SECTIONS;
    } catch {
      return DEFAULT_SECTIONS;
    }
  });

  // 9. Instagram
  const [instagram, setInstagram] = useState<InstagramConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.INSTAGRAM);
      return saved ? JSON.parse(saved) : DEFAULT_INSTAGRAM;
    } catch {
      return DEFAULT_INSTAGRAM;
    }
  });

  // 10. Wi-Fi
  const [wifi, setWifi] = useState<WifiConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WIFI);
      return saved ? JSON.parse(saved) : DEFAULT_WIFI;
    } catch {
      return DEFAULT_WIFI;
    }
  });

  // 11. PIX
  const [pix, setPix] = useState<PixConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PIX);
      return saved ? JSON.parse(saved) : DEFAULT_PIX;
    } catch {
      return DEFAULT_PIX;
    }
  });

  // 12. Media Items Library
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEDIA);
      return saved ? JSON.parse(saved) : DEFAULT_MEDIA_ITEMS;
    } catch {
      return DEFAULT_MEDIA_ITEMS;
    }
  });

  // 13. Hero Slides (Max 10)
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_SLIDES);
      return saved ? JSON.parse(saved) : DEFAULT_HERO_SLIDES;
    } catch {
      return DEFAULT_HERO_SLIDES;
    }
  });

  // 14. Hero Settings
  const [heroSettings, setHeroSettings] = useState<HeroCarouselSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HERO_SETTINGS);
      return saved ? JSON.parse(saved) : DEFAULT_HERO_SETTINGS;
    } catch {
      return DEFAULT_HERO_SETTINGS;
    }
  });

  // 15. Gallery
  const [gallery, setGallery] = useState<GallerySettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : DEFAULT_GALLERY;
    } catch {
      return DEFAULT_GALLERY;
    }
  });

  // 16. Weekly Schedule
  const [weeklySchedule, setWeeklySchedule] = useState<DaySchedule[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
      return saved ? JSON.parse(saved) : DEFAULT_WEEKLY_SCHEDULE;
    } catch {
      return DEFAULT_WEEKLY_SCHEDULE;
    }
  });

  // 17. Closed Popup
  const [closedPopup, setClosedPopup] = useState<ClosedPopupConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLOSED_POPUP);
      return saved ? JSON.parse(saved) : DEFAULT_CLOSED_POPUP;
    } catch {
      return DEFAULT_CLOSED_POPUP;
    }
  });

  // 18. Admin Auth
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return sessionStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  });

  // 19. UI Navigation & Modals
  const [currentView, setCurrentView] = useState<'public' | 'admin' | 'admin-login'>('public');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState('');
  const [activeSpecialModal, setActiveSpecialModal] = useState<'wifi' | 'pix' | null>(null);
  const [activeSpecialData, setActiveSpecialData] = useState<any>(null);

  // Closed popup dismissed state (session based so it won't repeatedly annoy the visitor)
  const [isClosedPopupDismissed, setIsClosedPopupDismissed] = useState<boolean>(() => {
    return sessionStorage.getItem('tapp_closed_popup_dismissed') === 'true';
  });

  // Media Picker callback state
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [mediaPickerCallback, setMediaPickerCallback] = useState<((url: string) => void) | null>(null);

  // Calculate live business status
  const businessStatusResult = useMemo(() => {
    return calculateBusinessStatus(weeklySchedule);
  }, [weeklySchedule]);

  const isBusinessOpen = businessStatusResult.isOpen;
  const statusBadgeText = isBusinessOpen ? closedPopup.openLabel : closedPopup.closedLabel;
  const nextOpeningInfo = businessStatusResult.detailText;

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BARBERSHOP, JSON.stringify(barbershop));
  }, [barbershop]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
  }, [services]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKING_SETTINGS, JSON.stringify(bookingSettings));
  }, [bookingSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, JSON.stringify(theme));
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.METRICS, JSON.stringify(metrics));
  }, [metrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BUTTONS, JSON.stringify(buttons));
  }, [buttons]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SECTIONS, JSON.stringify(sections));
  }, [sections]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INSTAGRAM, JSON.stringify(instagram));
  }, [instagram]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.WIFI, JSON.stringify(wifi));
  }, [wifi]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PIX, JSON.stringify(pix));
  }, [pix]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_SLIDES, JSON.stringify(heroSlides));
  }, [heroSlides]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HERO_SETTINGS, JSON.stringify(heroSettings));
  }, [heroSettings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(weeklySchedule));
  }, [weeklySchedule]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CLOSED_POPUP, JSON.stringify(closedPopup));
  }, [closedPopup]);

  // Inject CSS Variables
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-color', theme.backgroundColor);
    root.style.setProperty('--surface-color', theme.surfaceColor);
    root.style.setProperty('--surface-card', theme.surfaceCard || '#1b1b1b');
    root.style.setProperty('--accent-color', theme.accentColor);
    root.style.setProperty('--text-primary', theme.textPrimary);
    root.style.setProperty('--text-secondary', theme.textSecondary);
    root.style.setProperty('--border-color', theme.borderColor);
    root.style.setProperty('--border-radius', `${theme.borderRadius}px`);
    root.style.setProperty('--button-radius', `${theme.buttonRadius}px`);
    root.style.setProperty('--font-family', theme.fontFamily);

    if (theme.isDark) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [theme]);

  // Initial visit metric
  useEffect(() => {
    setMetrics(prev => ({ ...prev, views: prev.views + 1 }));
  }, []);

  const updateBarbershop = (info: Partial<BarbershopInfo>) => {
    setBarbershop(prev => ({ ...prev, ...info }));
  };

  const updateTheme = (updates: Partial<ThemeConfig>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  const setThemePreset = (presetName: string) => {
    if (DEFAULT_THEME_PRESETS[presetName]) {
      setTheme(DEFAULT_THEME_PRESETS[presetName]);
    }
  };

  const addService = (serviceData: Omit<ServiceItem, 'id'>) => {
    const newService: ServiceItem = {
      ...serviceData,
      id: `srv-${Date.now()}`
    };
    setServices(prev => [...prev, newService]);
  };

  const updateService = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const updateBookingSettings = (settings: Partial<BookingSettings>) => {
    setBookingSettings(prev => ({ ...prev, ...settings }));
  };

  const createBooking = (bookingData: {
    customerName: string;
    customerPhone?: string;
    date: string;
    time: string;
    people: number;
    service: string;
    notes?: string;
  }): BookingRecord => {
    const newBooking: BookingRecord = {
      id: `bk-${Date.now()}`,
      ...bookingData,
      status: 'pending',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setBookings(prev => [newBooking, ...prev]);
    setMetrics(prev => ({ ...prev, bookingsInitiated: prev.bookingsInitiated + 1 }));
    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingRecord['status']) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  const trackMetric = (key: keyof MetricStats) => {
    setMetrics(prev => ({ ...prev, [key]: (prev[key] || 0) + 1 }));
  };

  const loginAdmin = (password: string): boolean => {
    if (password === 'adm012026') {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    setCurrentView('public');
  };

  const openBookingModal = (serviceName?: string) => {
    setSelectedServiceForBooking(serviceName || '');
    setIsBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setIsBookingModalOpen(false);
  };

  const openSpecialModal = (type: 'wifi' | 'pix', data?: any) => {
    setActiveSpecialModal(type);
    setActiveSpecialData(data);
  };

  const closeSpecialModal = () => {
    setActiveSpecialModal(null);
    setActiveSpecialData(null);
  };

  const dismissClosedPopup = () => {
    setIsClosedPopupDismissed(true);
    sessionStorage.setItem('tapp_closed_popup_dismissed', 'true');
  };

  // Media Picker Dialog
  const openMediaPicker = (callback: (url: string) => void) => {
    setMediaPickerCallback(() => callback);
    setIsMediaPickerOpen(true);
  };

  const closeMediaPicker = () => {
    setIsMediaPickerOpen(false);
    setMediaPickerCallback(null);
  };

  const onSelectMediaFromPicker = (url: string) => {
    if (mediaPickerCallback) {
      mediaPickerCallback(url);
    }
    closeMediaPicker();
  };

  // Buttons CRUD & Reordering
  const addButton = (btnData: Omit<ButtonItem, 'id' | 'order'>) => {
    const newBtn: ButtonItem = {
      ...btnData,
      id: `btn-${Date.now()}`,
      order: buttons.length
    };
    setButtons(prev => [...prev, newBtn]);
  };

  const updateButton = (id: string, updates: Partial<ButtonItem>) => {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, ...updates } : b));
  };

  const deleteButton = (id: string) => {
    setButtons(prev => prev.filter(b => b.id !== id));
  };

  const duplicateButton = (id: string) => {
    const target = buttons.find(b => b.id === id);
    if (!target) return;
    const duplicated: ButtonItem = {
      ...target,
      id: `btn-${Date.now()}`,
      label: `${target.label} (Cópia)`,
      order: buttons.length
    };
    setButtons(prev => [...prev, duplicated]);
  };

  const toggleButtonVisibility = (id: string) => {
    setButtons(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const reorderButtons = (startIndex: number, endIndex: number) => {
    setButtons(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  // Sections CRUD & Reordering
  const addSection = (secData: Omit<PageSection, 'id' | 'order'>) => {
    const newSec: PageSection = {
      ...secData,
      id: `sec-${Date.now()}`,
      order: sections.length,
      canDelete: true
    };
    setSections(prev => [...prev, newSec]);
  };

  const updateSection = (id: string, updates: Partial<PageSection>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSection = (id: string) => {
    setSections(prev => prev.filter(s => s.id !== id));
  };

  const duplicateSection = (id: string) => {
    const target = sections.find(s => s.id === id);
    if (!target) return;
    const duplicated: PageSection = {
      ...target,
      id: `sec-${Date.now()}`,
      title: `${target.title} (Cópia)`,
      order: sections.length,
      canDelete: true
    };
    setSections(prev => [...prev, duplicated]);
  };

  const toggleSectionVisibility = (id: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const reorderSections = (startIndex: number, endIndex: number) => {
    setSections(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  // Instagram
  const updateInstagram = (updates: Partial<InstagramConfig>) => {
    setInstagram(prev => ({ ...prev, ...updates }));
  };

  const addInstagramPost = (post: { imageUrl: string; caption?: string; url: string }) => {
    const newPost = {
      id: `ig-${Date.now()}`,
      ...post,
      likes: Math.floor(Math.random() * 150) + 50
    };
    setInstagram(prev => ({
      ...prev,
      posts: [newPost, ...prev.posts]
    }));
  };

  const deleteInstagramPost = (id: string) => {
    setInstagram(prev => ({
      ...prev,
      posts: prev.posts.filter(p => p.id !== id)
    }));
  };

  // Wi-Fi & PIX
  const updateWifi = (updates: Partial<WifiConfig>) => {
    setWifi(prev => ({ ...prev, ...updates }));
  };

  const updatePix = (updates: Partial<PixConfig>) => {
    setPix(prev => ({ ...prev, ...updates }));
  };

  // Media Items Actions
  const addMediaItem = (itemData: Omit<MediaItem, 'id' | 'createdAt'>): MediaItem => {
    const newItem: MediaItem = {
      ...itemData,
      id: `med-${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10)
    };
    setMediaItems(prev => [newItem, ...prev]);
    return newItem;
  };

  const deleteMediaItem = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  const updateMediaItem = (id: string, updates: Partial<MediaItem>) => {
    setMediaItems(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
  };

  const assignMediaTo = (imageUrl: string, target: 'profile' | 'hero' | 'story' | 'gallery') => {
    switch (target) {
      case 'profile':
        updateBarbershop({ logoUrl: imageUrl });
        break;
      case 'hero':
        updateBarbershop({ heroImageUrl: imageUrl });
        if (heroSlides.length > 0) {
          updateHeroSlide(heroSlides[0].id, { imageUrl });
        }
        break;
      case 'story':
        updateBarbershop({ storyImageUrl: imageUrl });
        break;
      case 'gallery':
        addGalleryItem({
          imageUrl,
          title: 'Novo Estilo',
          category: 'Cortes',
          visible: true
        });
        break;
    }
  };

  // Hero Carousel Actions
  const addHeroSlide = (slideData: Omit<HeroSlide, 'id' | 'order'>) => {
    if (heroSlides.length >= 10) return;
    const newSlide: HeroSlide = {
      ...slideData,
      id: `slide-${Date.now()}`,
      order: heroSlides.length
    };
    setHeroSlides(prev => [...prev, newSlide]);
  };

  const updateHeroSlide = (id: string, updates: Partial<HeroSlide>) => {
    setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteHeroSlide = (id: string) => {
    setHeroSlides(prev => prev.filter(s => s.id !== id));
  };

  const toggleHeroSlideVisibility = (id: string) => {
    setHeroSlides(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s));
  };

  const reorderHeroSlides = (startIndex: number, endIndex: number) => {
    setHeroSlides(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result.map((item, idx) => ({ ...item, order: idx }));
    });
  };

  const updateHeroSettings = (settings: Partial<HeroCarouselSettings>) => {
    setHeroSettings(prev => ({ ...prev, ...settings }));
  };

  // Gallery Actions
  const updateGallery = (settings: Partial<GallerySettings>) => {
    setGallery(prev => ({ ...prev, ...settings }));
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id' | 'order'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`,
      order: gallery.items.length
    };
    setGallery(prev => ({ ...prev, items: [...prev.items, newItem] }));
  };

  const updateGalleryItem = (id: string, updates: Partial<GalleryItem>) => {
    setGallery(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === id ? { ...it, ...updates } : it)
    }));
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => ({
      ...prev,
      items: prev.items.filter(it => it.id !== id)
    }));
  };

  const toggleGalleryItemVisibility = (id: string) => {
    setGallery(prev => ({
      ...prev,
      items: prev.items.map(it => it.id === id ? { ...it, visible: !it.visible } : it)
    }));
  };

  const reorderGalleryItems = (startIndex: number, endIndex: number) => {
    setGallery(prev => {
      const result = Array.from(prev.items);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return {
        ...prev,
        items: result.map((it, idx) => ({ ...it, order: idx }))
      };
    });
  };

  // Schedule & Closed Popup Actions
  const updateWeeklySchedule = (newSchedule: DaySchedule[]) => {
    setWeeklySchedule(newSchedule);
  };

  const updateDaySchedule = (dayIndex: number, updates: Partial<DaySchedule>) => {
    setWeeklySchedule(prev => prev.map(d => d.dayIndex === dayIndex ? { ...d, ...updates } : d));
  };

  const updateClosedPopup = (config: Partial<ClosedPopupConfig>) => {
    setClosedPopup(prev => ({ ...prev, ...config }));
  };

  const resetToDefaults = () => {
    setBarbershop(DEFAULT_BARBERSHOP);
    setServices(DEFAULT_SERVICES);
    setBookingSettings(DEFAULT_BOOKING_SETTINGS);
    setTheme(DEFAULT_THEME_PRESETS['Dark Premium']);
    setBookings(INITIAL_BOOKINGS);
    setButtons(DEFAULT_BUTTONS);
    setSections(DEFAULT_SECTIONS);
    setInstagram(DEFAULT_INSTAGRAM);
    setWifi(DEFAULT_WIFI);
    setPix(DEFAULT_PIX);
    setMediaItems(DEFAULT_MEDIA_ITEMS);
    setHeroSlides(DEFAULT_HERO_SLIDES);
    setHeroSettings(DEFAULT_HERO_SETTINGS);
    setGallery(DEFAULT_GALLERY);
    setWeeklySchedule(DEFAULT_WEEKLY_SCHEDULE);
    setClosedPopup(DEFAULT_CLOSED_POPUP);

    Object.values(STORAGE_KEYS).forEach(k => localStorage.removeItem(k));
    sessionStorage.removeItem('tapp_closed_popup_dismissed');
  };

  const exportDataJSON = (): string => {
    const data = {
      barbershop,
      services,
      bookingSettings,
      theme,
      buttons,
      sections,
      instagram,
      wifi,
      pix,
      mediaItems,
      heroSlides,
      heroSettings,
      gallery,
      weeklySchedule,
      closedPopup,
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonStr: string): boolean => {
    try {
      const data = JSON.parse(jsonStr);
      if (data.barbershop) setBarbershop(data.barbershop);
      if (data.services) setServices(data.services);
      if (data.bookingSettings) setBookingSettings(data.bookingSettings);
      if (data.theme) setTheme(data.theme);
      if (data.buttons) setButtons(data.buttons);
      if (data.sections) setSections(data.sections);
      if (data.instagram) setInstagram(data.instagram);
      if (data.wifi) setWifi(data.wifi);
      if (data.pix) setPix(data.pix);
      if (data.mediaItems) setMediaItems(data.mediaItems);
      if (data.heroSlides) setHeroSlides(data.heroSlides);
      if (data.heroSettings) setHeroSettings(data.heroSettings);
      if (data.gallery) setGallery(data.gallery);
      if (data.weeklySchedule) setWeeklySchedule(data.weeklySchedule);
      if (data.closedPopup) setClosedPopup(data.closedPopup);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <AppContext.Provider
      value={{
        barbershop,
        services,
        bookingSettings,
        theme,
        bookings,
        metrics,
        buttons,
        sections,
        instagram,
        wifi,
        pix,
        mediaItems,
        heroSlides,
        heroSettings,
        gallery,
        weeklySchedule,
        closedPopup,
        isBusinessOpen,
        statusBadgeText,
        nextOpeningInfo,
        isClosedPopupDismissed,
        isAdminLoggedIn,
        currentView,
        isBookingModalOpen,
        selectedServiceForBooking,
        activeSpecialModal,
        activeSpecialData,
        isMediaPickerOpen,
        openSpecialModal,
        closeSpecialModal,
        openMediaPicker,
        closeMediaPicker,
        onSelectMediaFromPicker,
        dismissClosedPopup,
        setCurrentView,
        openBookingModal,
        closeBookingModal,
        loginAdmin,
        logoutAdmin,
        trackMetric,
        updateBarbershop,
        updateTheme,
        setThemePreset,
        addService,
        updateService,
        deleteService,
        updateBookingSettings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        addButton,
        updateButton,
        deleteButton,
        duplicateButton,
        toggleButtonVisibility,
        reorderButtons,
        setButtons,
        addSection,
        updateSection,
        deleteSection,
        duplicateSection,
        toggleSectionVisibility,
        reorderSections,
        setSections,
        updateInstagram,
        addInstagramPost,
        deleteInstagramPost,
        updateWifi,
        updatePix,
        addMediaItem,
        deleteMediaItem,
        updateMediaItem,
        assignMediaTo,
        addHeroSlide,
        updateHeroSlide,
        deleteHeroSlide,
        toggleHeroSlideVisibility,
        reorderHeroSlides,
        updateHeroSettings,
        updateGallery,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        toggleGalleryItemVisibility,
        reorderGalleryItems,
        updateWeeklySchedule,
        updateDaySchedule,
        updateClosedPopup,
        resetToDefaults,
        exportDataJSON,
        importDataJSON
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
