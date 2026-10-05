import {
  BarbershopInfo,
  ServiceItem,
  BookingSettings,
  ThemeConfig,
  Testimonial,
  BookingRecord,
  ButtonItem,
  PageSection,
  InstagramConfig,
  WifiConfig,
  PixConfig,
  MediaItem,
  HeroSlide,
  HeroCarouselSettings,
  GallerySettings,
  DaySchedule,
  ClosedPopupConfig
} from '../types';

export const DEFAULT_THEME_PRESETS: Record<string, ThemeConfig> = {
  'Dark Premium': {
    presetName: 'Dark Premium',
    backgroundColor: '#080808',
    surfaceColor: '#151515',
    surfaceCard: '#1d1d1d',
    accentColor: '#A8FF3E',
    textPrimary: '#FFFFFF',
    textSecondary: '#A8A8A8',
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 22,
    buttonRadius: 9999,
    fontFamily: "'Outfit', sans-serif",
    animationSpeed: 'smooth',
    isDark: true,
  },
  'Black & Gold': {
    presetName: 'Black & Gold',
    backgroundColor: '#0A0A0A',
    surfaceColor: '#161616',
    surfaceCard: '#201d17',
    accentColor: '#D4AF37',
    textPrimary: '#FAF8F5',
    textSecondary: '#A8A196',
    borderColor: 'rgba(212, 175, 55, 0.22)',
    borderRadius: 20,
    buttonRadius: 9999,
    fontFamily: "'Montserrat', sans-serif",
    animationSpeed: 'smooth',
    isDark: true,
  },
  'Classic Barber': {
    presetName: 'Classic Barber',
    backgroundColor: '#0F141C',
    surfaceColor: '#161F2E',
    surfaceCard: '#1C273A',
    accentColor: '#E63946',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    borderColor: 'rgba(255, 255, 255, 0.10)',
    borderRadius: 18,
    buttonRadius: 18,
    fontFamily: "'DM Sans', sans-serif",
    animationSpeed: 'normal',
    isDark: true,
  },
  'Modern Green': {
    presetName: 'Modern Green',
    backgroundColor: '#0A120E',
    surfaceColor: '#121F18',
    surfaceCard: '#192C23',
    accentColor: '#10B981',
    textPrimary: '#F0FDF4',
    textSecondary: '#86BFA2',
    borderColor: 'rgba(16, 185, 129, 0.22)',
    borderRadius: 22,
    buttonRadius: 9999,
    fontFamily: "'Manrope', sans-serif",
    animationSpeed: 'smooth',
    isDark: true,
  },
  'Minimal Light': {
    presetName: 'Minimal Light',
    backgroundColor: '#F3F4F6',
    surfaceColor: '#FFFFFF',
    surfaceCard: '#F9FAFB',
    accentColor: '#111827',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    borderColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 24,
    buttonRadius: 9999,
    fontFamily: "'Inter', sans-serif",
    animationSpeed: 'fast',
    isDark: false,
  },
  'Luxury Indigo': {
    presetName: 'Luxury Indigo',
    backgroundColor: '#090B16',
    surfaceColor: '#12162B',
    surfaceCard: '#1B2142',
    accentColor: '#818CF8',
    textPrimary: '#FFFFFF',
    textSecondary: '#9CA3AF',
    borderColor: 'rgba(129, 140, 248, 0.22)',
    borderRadius: 22,
    buttonRadius: 9999,
    fontFamily: "'Space Grotesk', sans-serif",
    animationSpeed: 'smooth',
    isDark: true,
  }
};

export const DEFAULT_BARBERSHOP: BarbershopInfo = {
  name: 'BarberShop Imperial',
  slogan: 'Seu estilo começa aqui.',
  description: 'Corte, barba e experiência em um só lugar. Atendimento premium e técnica refinada para o homem contemporâneo.',
  foundedYear: 2018,
  story: 'Nascida da paixão pelo clássico ofício de barbeiro e do desejo de oferecer um refúgio sofisticado na correria da cidade. Cada corte é esculpido com precisão milimétrica, ouvindo atentamente o estilo individual de cada cliente. Utilizamos toalhas quentes aromáticas, navalhas afiadas com perfeição e produtos de alta linha internacional.',
  address: 'Rua Oscar Freire, 1420',
  neighborhood: 'Jardins',
  city: 'São Paulo - SP',
  phone: '(11) 98765-4321',
  whatsapp: '5511987654321',
  instagram: 'barbershop.imperial',
  googleMapsUrl: 'https://maps.google.com/?q=Rua+Oscar+Freire+1420+Jardins+Sao+Paulo',
  googleReviewUrl: 'https://search.google.com/local/writereview',
  rating: 4.9,
  reviewCount: 384,
  openingHours: [
    { days: 'Segunda a Sexta', hours: '09:00 às 20:00' },
    { days: 'Sábado', hours: '08:30 às 19:30' },
    { days: 'Domingo', hours: 'Fechado' }
  ],
  logoUrl: '',
  heroImageUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
  storyImageUrl: '/src/assets/images/barber_craftsman_story_1791211108272.jpg'
};

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    id: 'srv-1',
    name: 'Corte Masculino Signature',
    description: 'Degradê impecável, tesoura personalizada no topo, lavagem revigorante com shampoo mentolado e finalização com pomada matte importada.',
    price: 75,
    durationMinutes: 45,
    imageUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
    badge: 'Mais pedido',
    active: true
  },
  {
    id: 'srv-2',
    name: 'Barba Terapia com Toalha Quente',
    description: 'Ritual clássico de barbearia com toalhas vaporizadas aromatizadas, hidratação profunda com óleos naturais e contorno esculpido na navalha.',
    price: 55,
    durationMinutes: 35,
    imageUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
    badge: 'Relaxante',
    active: true
  },
  {
    id: 'srv-3',
    name: 'Combo Imperial (Corte + Barba)',
    description: 'A experiência definitiva. Corte completo estilizado + barba terapia com toalha quente, alinhamento de sobrancelha e café expresso ou chopp.',
    price: 115,
    durationMinutes: 70,
    imageUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
    badge: 'Melhor Custo-Benefício',
    active: true
  },
  {
    id: 'srv-4',
    name: 'Camuflagem de Fios Grisalhos',
    description: 'Tonalização sutil e discreta para atenuar fios brancos mantendo total naturalidade, sem deixar o cabelo avermelhado ou manchado.',
    price: 60,
    durationMinutes: 30,
    imageUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
    active: true
  },
  {
    id: 'srv-5',
    name: 'Acabamento & Pezinho na Navalha',
    description: 'Manutenção do contorno das orelhas, costeletas e linha da nuca, perfeito para prolongar a vida útil do seu corte.',
    price: 35,
    durationMinutes: 20,
    imageUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
    active: true
  }
];

export const DEFAULT_BOOKING_SETTINGS: BookingSettings = {
  whatsappNumber: '5511987654321',
  maxPeople: 5,
  intervalMinutes: 30,
  openingTime: '09:00',
  closingTime: '20:00',
  daysOpen: ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  messageTemplate: 'Olá! Gostaria de agendar um horário na {barbershop_name}.\n\n👤 Nome: {customer_name}\n📅 Data: {date}\n⏰ Horário: {time}\n👥 Pessoas: {people}\n💈 Serviço: {service}\n📝 Observação: {notes}\n\nPoderia confirmar a disponibilidade?'
};

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    name: 'Rodrigo Silveira',
    date: 'Há 3 dias',
    rating: 5,
    comment: 'Ambiente sensacional e atendimento de primeiro nível. O degradê ficou perfeito, recomendo muito o ritual da toalha quente na barba!',
    verified: true
  },
  {
    id: 't-2',
    name: 'Lucas Mendes',
    date: 'Há 1 semana',
    rating: 5,
    comment: 'Melhor barbearia da região! Pontualidade britânica, café expresso gelado e os caras entendem de verdade de estilo e visagismo.',
    verified: true
  },
  {
    id: 't-3',
    name: 'Guilherme Castro',
    date: 'Há 2 semanas',
    rating: 5,
    comment: 'Agendei pelo WhatsApp em menos de 1 minuto. Cheguei e já fui atendido na hora. Experiência 10/10.',
    verified: true
  }
];

export const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'bk-101',
    customerName: 'Matheus Prado',
    customerPhone: '(11) 99123-4567',
    date: '2026-10-06',
    time: '14:30',
    people: 1,
    service: 'Combo Imperial (Corte + Barba)',
    notes: 'Preferência pelo barbeiro Carlos',
    status: 'confirmed',
    createdAt: '2026-10-05 09:12'
  },
  {
    id: 'bk-102',
    customerName: 'Felipe Alencar',
    customerPhone: '(11) 98844-2211',
    date: '2026-10-06',
    time: '16:00',
    people: 2,
    service: 'Corte Masculino Signature',
    notes: 'Pai e filho',
    status: 'pending',
    createdAt: '2026-10-05 10:45'
  },
  {
    id: 'bk-103',
    customerName: 'Bernardo Costa',
    customerPhone: '(11) 97722-3344',
    date: '2026-10-07',
    time: '11:00',
    people: 1,
    service: 'Barba Terapia com Toalha Quente',
    notes: '',
    status: 'completed',
    createdAt: '2026-10-04 15:20'
  }
];

// 1. Default Buttons & Links Manager
export const DEFAULT_BUTTONS: ButtonItem[] = [
  {
    id: 'btn-whatsapp',
    label: 'WhatsApp',
    subtitle: 'Atendimento direto',
    icon: 'whatsapp',
    type: 'whatsapp',
    style: 'glass',
    active: true,
    order: 0,
    badge: 'Online'
  },
  {
    id: 'btn-booking',
    label: 'Agendamento',
    subtitle: 'Escolha dia & hora',
    icon: 'calendar',
    type: 'booking',
    style: 'primary',
    active: true,
    order: 1,
    badge: 'Rápido'
  },
  {
    id: 'btn-instagram',
    label: 'Instagram',
    subtitle: '@barbershop.imperial',
    icon: 'instagram',
    type: 'instagram',
    style: 'glass',
    active: true,
    order: 2
  },
  {
    id: 'btn-location',
    label: 'Localização',
    subtitle: 'Jardins - SP',
    icon: 'location',
    type: 'location',
    style: 'glass',
    active: true,
    order: 3
  },
  {
    id: 'btn-reviews',
    label: 'Avalie no Google',
    subtitle: '4.9 ★ Google',
    icon: 'star',
    type: 'reviews',
    style: 'glass',
    active: true,
    order: 4
  },
  {
    id: 'btn-contact',
    label: 'Ligue Agora',
    subtitle: '(11) 98765-4321',
    icon: 'phone',
    type: 'call',
    style: 'glass',
    active: true,
    order: 5
  },
  {
    id: 'btn-wifi',
    label: 'Wi-Fi da Barbearia',
    subtitle: 'Conectar à rede',
    icon: 'wifi',
    type: 'wifi',
    style: 'secondary',
    active: true,
    order: 6,
    wifiConfig: {
      networkName: 'BarberShop_Imperial_5G',
      password: 'navalhaeestilo'
    }
  },
  {
    id: 'btn-pix',
    label: 'Chave PIX',
    subtitle: 'Pague com agilidade',
    icon: 'pix',
    type: 'pix',
    style: 'secondary',
    active: true,
    order: 7,
    pixConfig: {
      key: '11987654321',
      description: 'Chave Celular BarberShop Imperial',
      recipientName: 'BarberShop Imperial LTDA'
    }
  }
];

// 2. Default Page Sections Manager
export const DEFAULT_SECTIONS: PageSection[] = [
  {
    id: 'hero',
    type: 'hero',
    title: 'Banner Principal (Carrossel)',
    order: 0,
    visible: true,
    canDelete: false
  },
  {
    id: 'quick_links',
    type: 'quick_links',
    title: 'Botões de Links',
    order: 1,
    visible: true,
    canDelete: false
  },
  {
    id: 'services',
    type: 'services',
    title: 'Nossos Serviços',
    order: 2,
    visible: true,
    canDelete: false
  },
  {
    id: 'gallery',
    type: 'gallery',
    title: 'Galeria de Cortes',
    order: 3,
    visible: true,
    canDelete: false
  },
  {
    id: 'instagram_feed',
    type: 'instagram_feed',
    title: 'Instagram da Barbearia',
    order: 4,
    visible: true,
    canDelete: false
  },
  {
    id: 'story',
    type: 'story',
    title: 'Nossa História',
    order: 5,
    visible: true,
    canDelete: false
  },
  {
    id: 'location',
    type: 'location',
    title: 'Localização & Horários',
    order: 6,
    visible: true,
    canDelete: false
  },
  {
    id: 'google_reviews',
    type: 'google_reviews',
    title: 'Avaliações do Google',
    order: 7,
    visible: true,
    canDelete: false
  }
];

// 3. Default Instagram Feed Configuration
export const DEFAULT_INSTAGRAM: InstagramConfig = {
  enabled: true,
  username: 'barbershop.imperial',
  profileUrl: 'https://instagram.com/barbershop.imperial',
  title: 'Siga nosso estilo',
  subtitle: 'Confira os últimos cortes e transformações no nosso Instagram',
  buttonLabel: 'Ver perfil no Instagram',
  layout: 'horizontal_carousel',
  postsLimit: 6,
  autoplay: true,
  autoplayInterval: 4000,
  posts: [
    {
      id: 'ig-1',
      imageUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
      caption: 'Skin fade cirúrgico e finalização fosca.',
      url: 'https://instagram.com',
      likes: 142
    },
    {
      id: 'ig-2',
      imageUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
      caption: 'Barba terapia com toalha aromatizada e alinhamento navalhado.',
      url: 'https://instagram.com',
      likes: 218
    },
    {
      id: 'ig-3',
      imageUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
      caption: 'Sexta-feira de casa cheia e cerveja trincando.',
      url: 'https://instagram.com',
      likes: 310
    },
    {
      id: 'ig-4',
      imageUrl: '/src/assets/images/barber_craftsman_story_1791211108272.jpg',
      caption: 'Dedicação aos detalhes que transformam o seu visual.',
      url: 'https://instagram.com',
      likes: 189
    }
  ]
};

// 4. Default Special Configurations
export const DEFAULT_WIFI: WifiConfig = {
  enabled: true,
  networkName: 'BarberShop_Imperial_5G',
  password: 'navalhaeestilo'
};

export const DEFAULT_PIX: PixConfig = {
  enabled: true,
  key: '11987654321',
  description: 'Chave Celular Oficial da Barbearia',
  recipientName: 'BarberShop Imperial LTDA'
};

// 5. Default Media Library Items
export const DEFAULT_MEDIA_ITEMS: MediaItem[] = [
  {
    id: 'med-1',
    fileUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
    thumbnailUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
    fileName: 'barbershop_hero_luxury.jpg',
    category: 'Banner Principal',
    altText: 'Ambiente luxuoso da barbearia',
    fileSize: '480 KB',
    createdAt: '2026-10-05'
  },
  {
    id: 'med-2',
    fileUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
    thumbnailUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
    fileName: 'skin_fade_corte.jpg',
    category: 'Cortes',
    altText: 'Corte fade em execução',
    fileSize: '410 KB',
    createdAt: '2026-10-05'
  },
  {
    id: 'med-3',
    fileUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
    thumbnailUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
    fileName: 'barba_terapia_toalha.jpg',
    category: 'Barba',
    altText: 'Barba terapia com toalha quente',
    fileSize: '390 KB',
    createdAt: '2026-10-05'
  },
  {
    id: 'med-4',
    fileUrl: '/src/assets/images/barber_craftsman_story_1791211108272.jpg',
    thumbnailUrl: '/src/assets/images/barber_craftsman_story_1791211108272.jpg',
    fileName: 'mestre_barbeiro.jpg',
    category: 'Equipe',
    altText: 'Mestre barbeiro em seu estúdio',
    fileSize: '460 KB',
    createdAt: '2026-10-05'
  }
];

// 6. Default Hero Carousel Slides (Up to 10 images)
export const DEFAULT_HERO_SLIDES: HeroSlide[] = [
  {
    id: 'slide-1',
    imageUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
    order: 0,
    visible: true,
    overlayEnabled: true,
    title: 'Seu estilo começa aqui.',
    subtitle: 'Corte, barba e experiência premium em um só lugar.',
    buttonText: 'Agendar horário agora',
    buttonLink: 'booking'
  },
  {
    id: 'slide-2',
    imageUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
    order: 1,
    visible: true,
    overlayEnabled: true,
    title: 'Precisão em cada detalhe.',
    subtitle: 'Degradê cirúrgico e visagismo masculino sob medida.',
    buttonText: 'Conhecer nossos serviços',
    buttonLink: 'services'
  },
  {
    id: 'slide-3',
    imageUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
    order: 2,
    visible: true,
    overlayEnabled: true,
    title: 'Barba Terapia Exclusiva.',
    subtitle: 'O ritual definitivo com toalhas aromatizadas e navalha afiada.',
    buttonText: 'Garantir meu horário',
    buttonLink: 'booking'
  }
];

// 7. Default Hero Carousel Settings
export const DEFAULT_HERO_SETTINGS: HeroCarouselSettings = {
  enabled: true,
  autoplay: true,
  interval: 5000,
  transition: 'fade',
  showDots: true,
  showArrows: false,
  pauseOnInteraction: true
};

// 8. Default Gallery Settings & Items
export const DEFAULT_GALLERY: GallerySettings = {
  enabled: true,
  title: 'Galeria de Cortes & Estilo',
  subtitle: 'Transformações reais executadas pelos nossos mestres barbeiros',
  layout: 'masonry',
  columnsMobile: 2,
  columnsDesktop: 3,
  items: [
    {
      id: 'gal-1',
      imageUrl: '/src/assets/images/barber_cut_service_1791211088254.jpg',
      title: 'Low Fade com Textura',
      category: 'Cortes',
      order: 0,
      visible: true
    },
    {
      id: 'gal-2',
      imageUrl: '/src/assets/images/barber_beard_service_1791211097567.jpg',
      title: 'Barba Alinhada & Toalha Quente',
      category: 'Barba',
      order: 1,
      visible: true
    },
    {
      id: 'gal-3',
      imageUrl: '/src/assets/images/barbershop_hero_1791211076060.jpg',
      title: 'Atmosfera Imperial',
      category: 'Barbearia',
      order: 2,
      visible: true
    },
    {
      id: 'gal-4',
      imageUrl: '/src/assets/images/barber_craftsman_story_1791211108272.jpg',
      title: 'Mestre da Tesoura',
      category: 'Equipe',
      order: 3,
      visible: true
    }
  ]
};

// 9. Default Weekly Schedule
export const DEFAULT_WEEKLY_SCHEDULE: DaySchedule[] = [
  {
    dayIndex: 0,
    dayName: 'Domingo',
    shortName: 'Dom',
    enabled: false,
    closedAllDay: true,
    periods: []
  },
  {
    dayIndex: 1,
    dayName: 'Segunda-feira',
    shortName: 'Seg',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '09:00', closing: '20:00' }]
  },
  {
    dayIndex: 2,
    dayName: 'Terça-feira',
    shortName: 'Ter',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '09:00', closing: '20:00' }]
  },
  {
    dayIndex: 3,
    dayName: 'Quarta-feira',
    shortName: 'Qua',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '09:00', closing: '20:00' }]
  },
  {
    dayIndex: 4,
    dayName: 'Quinta-feira',
    shortName: 'Qui',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '09:00', closing: '20:00' }]
  },
  {
    dayIndex: 5,
    dayName: 'Sexta-feira',
    shortName: 'Sex',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '09:00', closing: '20:00' }]
  },
  {
    dayIndex: 6,
    dayName: 'Sábado',
    shortName: 'Sáb',
    enabled: true,
    closedAllDay: false,
    periods: [{ opening: '08:30', closing: '19:30' }]
  }
];

// 10. Default Closed Popup Configuration
export const DEFAULT_CLOSED_POPUP: ClosedPopupConfig = {
  enabled: true,
  title: 'Barbearia fechada no momento',
  message: 'No momento estamos fechados. Você ainda pode conhecer nossos serviços e deixar seu agendamento preparado para o próximo horário disponível!',
  buttonText: 'Agendar horário mesmo assim',
  showAutomatically: true,
  showStatusIndicator: true,
  openLabel: 'Aberto agora',
  closedLabel: 'Fechado agora'
};
