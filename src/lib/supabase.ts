import { createClient, SupabaseClient } from '@supabase/supabase-js';
import {
  BarbershopInfo,
  ServiceItem,
  BookingRecord,
  BookingSettings,
  ThemeConfig,
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
  ClosedPopupConfig,
  MetricStats,
  CloudBackendState
} from '../types';

// Credenciais dinâmicas ou variáveis de ambiente Vite
const ENV_SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || '';
const ENV_SUPABASE_ANON_KEY = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '';

let dynamicSupabaseUrl = ENV_SUPABASE_URL;
let dynamicSupabaseKey = ENV_SUPABASE_ANON_KEY;
let supabaseInstance: SupabaseClient | null = null;

export function initSupabase(url?: string, key?: string): SupabaseClient | null {
  const targetUrl = url || dynamicSupabaseUrl;
  const targetKey = key || dynamicSupabaseKey;

  if (!targetUrl || !targetKey || targetUrl === 'https://your-project.supabase.co') {
    supabaseInstance = null;
    return null;
  }

  try {
    supabaseInstance = createClient(targetUrl, targetKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true
      },
      realtime: {
        params: {
          eventsPerSecond: 10
        }
      }
    });
    dynamicSupabaseUrl = targetUrl;
    dynamicSupabaseKey = targetKey;
    return supabaseInstance;
  } catch (err) {
    console.error('Erro ao inicializar Supabase client:', err);
    supabaseInstance = null;
    return null;
  }
}

// Inicializa na carga caso haja env vars
initSupabase();

export function getSupabaseClient(): SupabaseClient | null {
  if (!supabaseInstance && dynamicSupabaseUrl && dynamicSupabaseKey) {
    return initSupabase(dynamicSupabaseUrl, dynamicSupabaseKey);
  }
  return supabaseInstance;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(
    dynamicSupabaseUrl &&
    dynamicSupabaseKey &&
    dynamicSupabaseUrl !== 'https://your-project.supabase.co'
  );
}

export function getSupabaseCredentials(): { url: string; key: string } {
  return {
    url: dynamicSupabaseUrl,
    key: dynamicSupabaseKey
  };
}

export async function testSupabaseConnection(url?: string, key?: string): Promise<{ success: boolean; message: string; tablesFound?: string[] }> {
  const testUrl = url || dynamicSupabaseUrl;
  const testKey = key || dynamicSupabaseKey;

  if (!testUrl || !testKey) {
    return { success: false, message: 'URL ou Chave Anon do Supabase não informadas.' };
  }

  try {
    const client = createClient(testUrl, testKey);
    // Testa consulta a tabela barbershop_settings ou health check simples
    const { data, error } = await client
      .from('barbershop_settings')
      .select('id, name')
      .limit(1);

    if (error) {
      // Se der erro de tabela inexistente (código 42P01 ou mensagem relation does not exist)
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        return {
          success: true,
          message: 'Conectado com sucesso ao Supabase! As tabelas ainda precisam ser criadas via Script SQL.',
          tablesFound: []
        };
      }
      return {
        success: false,
        message: `Erro do Supabase: ${error.message || 'Código ' + error.code}`
      };
    }

    return {
      success: true,
      message: 'Conexão estabelecida com sucesso com o banco PostgreSQL no Supabase!',
      tablesFound: ['barbershop_settings']
    };
  } catch (err: any) {
    return {
      success: false,
      message: `Falha de rede ou URL inválida: ${err?.message || err}`
    };
  }
}

// ====================================================================
// Sincronização Completa com Tabelas do Supabase
// ====================================================================

export async function syncFullStateToSupabase(state: CloudBackendState): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase não configurado' };
  }

  try {
    // 1. Barbershop Settings
    const { error: errBarbershop } = await client
      .from('barbershop_settings')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        name: state.barbershop.name,
        slogan: state.barbershop.slogan,
        description: state.barbershop.description,
        founded_year: state.barbershop.foundedYear,
        story: state.barbershop.story,
        address: state.barbershop.address,
        neighborhood: state.barbershop.neighborhood,
        city: state.barbershop.city,
        phone: state.barbershop.phone,
        whatsapp: state.barbershop.whatsapp,
        instagram: state.barbershop.instagram,
        google_maps_url: state.barbershop.googleMapsUrl,
        google_review_url: state.barbershop.googleReviewUrl,
        rating: state.barbershop.rating,
        review_count: state.barbershop.reviewCount,
        opening_hours: state.barbershop.openingHours,
        logo_url: state.barbershop.logoUrl,
        hero_image_url: state.barbershop.heroImageUrl,
        story_image_url: state.barbershop.storyImageUrl,
        updated_at: new Date().toISOString()
      });
    if (errBarbershop) console.warn('Erro ao sincronizar barbershop_settings:', errBarbershop.message);

    // 2. Theme Settings
    const { error: errTheme } = await client
      .from('theme_settings')
      .upsert({
        id: '00000000-0000-0000-0000-000000000001',
        preset_name: state.theme.presetName,
        background_color: state.theme.backgroundColor,
        surface_color: state.theme.surfaceColor,
        surface_card: state.theme.surfaceCard,
        accent_color: state.theme.accentColor,
        text_primary: state.theme.textPrimary,
        text_secondary: state.theme.textSecondary,
        border_color: state.theme.borderColor,
        border_radius: state.theme.borderRadius,
        button_radius: state.theme.buttonRadius,
        font_family: state.theme.fontFamily,
        animation_speed: state.theme.animationSpeed,
        is_dark: state.theme.isDark,
        updated_at: new Date().toISOString()
      });
    if (errTheme) console.warn('Erro ao sincronizar theme_settings:', errTheme.message);

    // 3. Services
    if (state.services?.length) {
      const servicesPayload = state.services.map((s, idx) => ({
        id: s.id,
        name: s.name,
        description: s.description,
        price: s.price,
        duration_minutes: s.durationMinutes,
        image_url: s.imageUrl,
        badge: s.badge || null,
        active: s.active,
        order_index: idx,
        updated_at: new Date().toISOString()
      }));
      await client.from('services').upsert(servicesPayload);
    }

    // 4. Buttons
    if (state.buttons?.length) {
      const buttonsPayload = state.buttons.map((b, idx) => ({
        id: b.id,
        label: b.label || '',
        subtitle: b.subtitle || null,
        url: b.url || null,
        icon: b.icon || 'link',
        type: b.type || 'custom_url',
        style: b.style || 'secondary',
        active: b.active ?? true,
        order_index: idx,
        badge: b.badge || null,
        custom_color: b.customColor || null,
        wifi_config: b.wifiConfig || null,
        pix_config: b.pixConfig || null,
        updated_at: new Date().toISOString()
      }));
      await client.from('buttons').upsert(buttonsPayload);
    }

    // 5. Page Sections
    if (state.sections?.length) {
      const sectionsPayload = state.sections.map((sec, idx) => ({
        id: sec.id,
        type: sec.type,
        title: sec.title,
        order_index: idx,
        visible: sec.visible ?? true,
        can_delete: sec.canDelete ?? true,
        settings: sec.settings || null,
        updated_at: new Date().toISOString()
      }));
      await client.from('page_sections').upsert(sectionsPayload);
    }

    // 6. Booking Settings
    await client.from('booking_settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      whatsapp_number: state.bookingSettings.whatsappNumber,
      max_people: state.bookingSettings.maxPeople,
      interval_minutes: state.bookingSettings.intervalMinutes,
      opening_time: state.bookingSettings.openingTime,
      closing_time: state.bookingSettings.closingTime,
      days_open: state.bookingSettings.daysOpen,
      message_template: state.bookingSettings.messageTemplate,
      updated_at: new Date().toISOString()
    });

    // 7. Weekly Schedule
    if (state.weeklySchedule?.length) {
      const schedulePayload = state.weeklySchedule.map(day => ({
        day_index: day.dayIndex,
        day_name: day.dayName,
        short_name: day.shortName,
        enabled: day.enabled,
        closed_all_day: day.closedAllDay,
        periods: day.periods,
        updated_at: new Date().toISOString()
      }));
      await client.from('weekly_schedule').upsert(schedulePayload);
    }

    // 8. Closed Popup Settings
    await client.from('closed_popup_settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      enabled: state.closedPopup.enabled,
      title: state.closedPopup.title,
      message: state.closedPopup.message,
      button_text: state.closedPopup.buttonText,
      image_url: state.closedPopup.imageUrl || null,
      show_automatically: state.closedPopup.showAutomatically,
      show_status_indicator: state.closedPopup.showStatusIndicator,
      open_label: state.closedPopup.openLabel,
      closed_label: state.closedPopup.closedLabel,
      updated_at: new Date().toISOString()
    });

    // 9. Integrations (Wi-Fi & PIX)
    await client.from('integrations').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      wifi_enabled: state.wifi.enabled,
      wifi_network: state.wifi.networkName,
      wifi_password: state.wifi.password,
      pix_enabled: state.pix.enabled,
      pix_key: state.pix.key,
      pix_description: state.pix.description,
      pix_recipient: state.pix.recipientName || null,
      updated_at: new Date().toISOString()
    });

    // 10. Instagram Settings
    await client.from('instagram_settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      enabled: state.instagram.enabled,
      username: state.instagram.username,
      title: state.instagram.title,
      profile_url: state.instagram.profileUrl,
      posts: state.instagram.posts,
      updated_at: new Date().toISOString()
    });

    // 11. Hero Settings & Slides
    await client.from('hero_settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      enabled: state.heroSettings.enabled,
      autoplay: state.heroSettings.autoplay,
      interval_ms: state.heroSettings.interval,
      transition: state.heroSettings.transition,
      show_dots: state.heroSettings.showDots,
      show_arrows: state.heroSettings.showArrows,
      pause_on_interaction: state.heroSettings.pauseOnInteraction,
      updated_at: new Date().toISOString()
    });

    if (state.heroSlides?.length) {
      const slidesPayload = state.heroSlides.map((s, idx) => ({
        id: s.id,
        image_url: s.imageUrl,
        order_index: idx,
        visible: s.visible,
        overlay_enabled: s.overlayEnabled,
        title: s.title || null,
        subtitle: s.subtitle || null,
        button_text: s.buttonText || null,
        button_link: s.buttonLink || null
      }));
      await client.from('hero_slides').upsert(slidesPayload);
    }

    // 12. Gallery Settings & Items
    await client.from('gallery_settings').upsert({
      id: '00000000-0000-0000-0000-000000000001',
      enabled: state.gallery.enabled,
      title: state.gallery.title,
      subtitle: state.gallery.subtitle,
      layout: state.gallery.layout,
      columns_mobile: state.gallery.columnsMobile,
      columns_desktop: state.gallery.columnsDesktop,
      items: state.gallery.items,
      updated_at: new Date().toISOString()
    });

    return { success: true };
  } catch (err: any) {
    console.error('Erro na sincronização completa com Supabase:', err);
    return { success: false, error: err?.message || String(err) };
  }
}

// ====================================================================
// Buscar dados do Supabase
// ====================================================================

export async function fetchFullStateFromSupabase(): Promise<Partial<CloudBackendState> | null> {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const result: Partial<CloudBackendState> = {};

    // 1. Barbershop
    const { data: bData } = await client.from('barbershop_settings').select('*').limit(1).maybeSingle();
    if (bData) {
      result.barbershop = {
        name: bData.name,
        slogan: bData.slogan || '',
        description: bData.description || '',
        foundedYear: bData.founded_year || 2018,
        story: bData.story || '',
        address: bData.address || '',
        neighborhood: bData.neighborhood || '',
        city: bData.city || '',
        phone: bData.phone || '',
        whatsapp: bData.whatsapp || '',
        instagram: bData.instagram || '',
        googleMapsUrl: bData.google_maps_url || '',
        googleReviewUrl: bData.google_review_url || '',
        rating: Number(bData.rating) || 4.9,
        reviewCount: Number(bData.review_count) || 180,
        openingHours: bData.opening_hours || [],
        logoUrl: bData.logo_url || '',
        heroImageUrl: bData.hero_image_url || '',
        storyImageUrl: bData.story_image_url || ''
      };
    }

    // 2. Theme
    const { data: tData } = await client.from('theme_settings').select('*').limit(1).maybeSingle();
    if (tData) {
      result.theme = {
        presetName: tData.preset_name || 'Dark Premium',
        backgroundColor: tData.background_color || '#080808',
        surfaceColor: tData.surface_color || '#151515',
        surfaceCard: tData.surface_card || '#1c1c1c',
        accentColor: tData.accent_color || '#A8FF3E',
        textPrimary: tData.text_primary || '#FFFFFF',
        textSecondary: tData.text_secondary || '#A8A8A8',
        borderColor: tData.border_color || 'rgba(255, 255, 255, 0.12)',
        borderRadius: Number(tData.border_radius) || 22,
        buttonRadius: Number(tData.button_radius) || 999,
        fontFamily: tData.font_family || 'Outfit',
        animationSpeed: tData.animation_speed || 'smooth',
        isDark: Boolean(tData.is_dark)
      };
    }

    // 3. Services
    const { data: sData } = await client.from('services').select('*').order('order_index');
    if (sData && sData.length > 0) {
      result.services = sData.map(s => ({
        id: s.id,
        name: s.name,
        description: s.description || '',
        price: Number(s.price),
        durationMinutes: Number(s.duration_minutes) || 30,
        imageUrl: s.image_url || '',
        badge: s.badge || undefined,
        active: Boolean(s.active)
      }));
    }

    // 4. Buttons
    const { data: btnData } = await client.from('buttons').select('*').order('order_index');
    if (btnData && btnData.length > 0) {
      result.buttons = btnData.map((b, idx) => ({
        id: b.id,
        label: b.label || 'Botão',
        subtitle: b.subtitle || undefined,
        url: b.url || undefined,
        icon: b.icon || 'link',
        type: b.type || 'custom_url',
        style: b.style || 'secondary',
        active: Boolean(b.active),
        order: idx,
        badge: b.badge || undefined,
        customColor: b.custom_color || undefined,
        wifiConfig: b.wifi_config || undefined,
        pixConfig: b.pix_config || undefined
      }));
    }

    // 5. Sections
    const { data: secData } = await client.from('page_sections').select('*').order('order_index');
    if (secData && secData.length > 0) {
      result.sections = secData.map((sec, idx) => ({
        id: sec.id,
        type: sec.type || 'custom',
        title: sec.title,
        order: idx,
        visible: Boolean(sec.visible),
        canDelete: Boolean(sec.can_delete ?? true),
        settings: sec.settings || undefined
      }));
    }

    // 6. Booking Settings
    const { data: bkData } = await client.from('booking_settings').select('*').limit(1).maybeSingle();
    if (bkData) {
      result.bookingSettings = {
        whatsappNumber: bkData.whatsapp_number || '5511987654321',
        maxPeople: Number(bkData.max_people) || 4,
        intervalMinutes: Number(bkData.interval_minutes) || 30,
        openingTime: bkData.opening_time || '09:00',
        closingTime: bkData.closing_time || '20:00',
        daysOpen: bkData.days_open || ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'],
        messageTemplate: bkData.message_template || ''
      };
    }

    // 7. Weekly Schedule
    const { data: schedData } = await client.from('weekly_schedule').select('*').order('day_index');
    if (schedData && schedData.length > 0) {
      result.weeklySchedule = schedData.map(d => ({
        dayIndex: d.day_index,
        dayName: d.day_name,
        shortName: d.short_name,
        enabled: Boolean(d.enabled),
        closedAllDay: Boolean(d.closed_all_day),
        periods: d.periods || []
      }));
    }

    // 8. Closed popup
    const { data: popData } = await client.from('closed_popup_settings').select('*').limit(1).maybeSingle();
    if (popData) {
      result.closedPopup = {
        enabled: Boolean(popData.enabled),
        title: popData.title || '',
        message: popData.message || '',
        buttonText: popData.button_text || 'Agendar Horário',
        imageUrl: popData.image_url || undefined,
        showAutomatically: Boolean(popData.show_automatically),
        showStatusIndicator: Boolean(popData.show_status_indicator),
        openLabel: popData.open_label || 'Aberto Agora',
        closedLabel: popData.closed_label || 'Fechado Agora'
      };
    }

    return result;
  } catch (err) {
    console.error('Falha ao consultar tabelas do Supabase:', err);
    return null;
  }
}

// ====================================================================
// Upload para Supabase Storage (Bucket: barbershop-media)
// ====================================================================

export async function uploadToSupabaseStorage(
  file: File | Blob,
  fileName: string
): Promise<{ success: boolean; url?: string; error?: string }> {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, error: 'Supabase não conectado' };
  }

  try {
    const cleanFileName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const filePath = `uploads/${cleanFileName}`;

    const { error: uploadError } = await client.storage
      .from('barbershop-media')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) {
      return { success: false, error: uploadError.message };
    }

    const { data: publicUrlData } = client.storage
      .from('barbershop-media')
      .getPublicUrl(filePath);

    return {
      success: true,
      url: publicUrlData.publicUrl
    };
  } catch (err: any) {
    return {
      success: false,
      error: err?.message || 'Falha no upload'
    };
  }
}

// ====================================================================
// Supabase Realtime Listener
// ====================================================================

export function subscribeToSupabaseRealtime(onDataChanged: () => void): (() => void) | null {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const channel = client
      .channel('barbershop_cloud_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        () => {
          onDataChanged();
        }
      )
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  } catch (err) {
    console.warn('Erro ao registrar canal Realtime do Supabase:', err);
    return null;
  }
}
