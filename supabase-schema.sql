-- ====================================================================
-- BarberShop - Supabase PostgreSQL Schema Migration
-- TappCard - Solução em Nuvem para Cartões Virtuais Premium
-- ====================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tabela: barbershop_settings (Configurações Gerais da Barbearia)
CREATE TABLE IF NOT EXISTS public.barbershop_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL DEFAULT 'BarberShop',
    slogan TEXT DEFAULT 'Tradição, Estilo e Precisão em Cada Detalhe',
    description TEXT,
    founded_year INTEGER DEFAULT 2018,
    story TEXT,
    address TEXT DEFAULT 'Av. Paulista, 1578',
    neighborhood TEXT DEFAULT 'Bela Vista',
    city TEXT DEFAULT 'São Paulo - SP',
    phone TEXT DEFAULT '(11) 98765-4321',
    whatsapp TEXT DEFAULT '5511987654321',
    instagram TEXT DEFAULT 'barbershop.oficial',
    google_maps_url TEXT,
    google_review_url TEXT,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    review_count INTEGER DEFAULT 184,
    opening_hours JSONB DEFAULT '[]'::jsonb,
    logo_url TEXT,
    hero_image_url TEXT,
    story_image_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Tabela: theme_settings (Personalização Visual, Cores e Fontes)
CREATE TABLE IF NOT EXISTS public.theme_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    preset_name TEXT DEFAULT 'Dark Premium',
    background_color TEXT DEFAULT '#080808',
    surface_color TEXT DEFAULT '#151515',
    surface_card TEXT DEFAULT '#1c1c1c',
    accent_color TEXT DEFAULT '#A8FF3E',
    text_primary TEXT DEFAULT '#FFFFFF',
    text_secondary TEXT DEFAULT '#A8A8A8',
    border_color TEXT DEFAULT 'rgba(255, 255, 255, 0.12)',
    border_radius INTEGER DEFAULT 22,
    button_radius INTEGER DEFAULT 999,
    font_family TEXT DEFAULT 'Outfit',
    animation_speed TEXT DEFAULT 'smooth',
    is_dark BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabela: services (Catálogo de Serviços e Preços)
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    image_url TEXT,
    badge TEXT,
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabela: buttons (Gerenciador de Links e Botões)
CREATE TABLE IF NOT EXISTS public.buttons (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    label TEXT,
    url TEXT,
    icon TEXT DEFAULT 'link',
    button_style TEXT DEFAULT 'secondary',
    active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    special_type TEXT,
    custom_color TEXT,
    custom_text_color TEXT,
    badge TEXT,
    target_blank BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabela: page_sections (Construtor de Seções da Página Pública)
CREATE TABLE IF NOT EXISTS public.page_sections (
    id TEXT PRIMARY KEY,
    section_id TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    subtitle TEXT,
    enabled BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    layout_style TEXT DEFAULT 'default',
    custom_content TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Tabela: booking_settings (Regras e Horários de Agendamento)
CREATE TABLE IF NOT EXISTS public.booking_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    whatsapp_number TEXT DEFAULT '5511987654321',
    max_people INTEGER DEFAULT 4,
    interval_minutes INTEGER DEFAULT 30,
    opening_time TEXT DEFAULT '09:00',
    closing_time TEXT DEFAULT '20:00',
    days_open JSONB DEFAULT '["Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]'::jsonb,
    message_template TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Tabela: bookings (Registros de Agendamentos dos Clientes)
CREATE TABLE IF NOT EXISTS public.bookings (
    id TEXT PRIMARY KEY,
    customer_name TEXT NOT NULL,
    customer_phone TEXT,
    service_name TEXT NOT NULL,
    booking_date TEXT NOT NULL,
    booking_time TEXT NOT NULL,
    people INTEGER DEFAULT 1,
    notes TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Tabela: weekly_schedule (Horários Semanais e Turnos)
CREATE TABLE IF NOT EXISTS public.weekly_schedule (
    day_index INTEGER PRIMARY KEY,
    day_name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    enabled BOOLEAN DEFAULT true,
    closed_all_day BOOLEAN DEFAULT false,
    periods JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. Tabela: closed_popup_settings (Aviso Automático de Barbearia Fechada)
CREATE TABLE IF NOT EXISTS public.closed_popup_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT true,
    title TEXT DEFAULT 'Estamos Fechados no Momento',
    message TEXT,
    button_text TEXT DEFAULT 'Agendar para Amanhã',
    image_url TEXT,
    show_automatically BOOLEAN DEFAULT true,
    show_status_indicator BOOLEAN DEFAULT true,
    open_label TEXT DEFAULT 'Aberto Agora',
    closed_label TEXT DEFAULT 'Fechado Agora',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. Tabela: instagram_settings (Configuração e Feed do Instagram)
CREATE TABLE IF NOT EXISTS public.instagram_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT true,
    username TEXT DEFAULT 'barbershop.oficial',
    title TEXT DEFAULT 'Siga Nosso Instagram',
    profile_url TEXT DEFAULT 'https://instagram.com/barbershop.oficial',
    posts JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. Tabela: hero_carousel (Slides e Configurações do Banner Principal)
CREATE TABLE IF NOT EXISTS public.hero_slides (
    id TEXT PRIMARY KEY,
    image_url TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    visible BOOLEAN DEFAULT true,
    overlay_enabled BOOLEAN DEFAULT true,
    title TEXT,
    subtitle TEXT,
    button_text TEXT,
    button_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.hero_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT true,
    autoplay BOOLEAN DEFAULT true,
    interval_ms INTEGER DEFAULT 5000,
    transition TEXT DEFAULT 'fade',
    show_dots BOOLEAN DEFAULT true,
    show_arrows BOOLEAN DEFAULT true,
    pause_on_interaction BOOLEAN DEFAULT true,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. Tabela: gallery (Galeria de Imagens de Cortes)
CREATE TABLE IF NOT EXISTS public.gallery_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    enabled BOOLEAN DEFAULT true,
    title TEXT DEFAULT 'Galeria de Cortes & Estilos',
    subtitle TEXT DEFAULT 'Inspire-se com os trabalhos da nossa equipe',
    layout TEXT DEFAULT 'grid',
    columns_mobile INTEGER DEFAULT 2,
    columns_desktop INTEGER DEFAULT 3,
    items JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. Tabela: media_library (Biblioteca de Mídias)
CREATE TABLE IF NOT EXISTS public.media_library (
    id TEXT PRIMARY KEY,
    file_url TEXT NOT NULL,
    thumbnail_url TEXT,
    file_name TEXT NOT NULL,
    category TEXT DEFAULT 'Outras',
    alt_text TEXT,
    file_size TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. Tabela: metrics (Contadores de Estatísticas de Visualizações e Cliques)
CREATE TABLE IF NOT EXISTS public.metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    views BIGINT DEFAULT 0,
    whatsapp_clicks BIGINT DEFAULT 0,
    bookings_initiated BIGINT DEFAULT 0,
    instagram_clicks BIGINT DEFAULT 0,
    maps_clicks BIGINT DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 15. Tabela: integrations (Wi-Fi, PIX)
CREATE TABLE IF NOT EXISTS public.integrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wifi_network TEXT DEFAULT 'BarberShop_Guest',
    wifi_password TEXT DEFAULT 'barber2026',
    wifi_encryption TEXT DEFAULT 'WPA',
    pix_key TEXT DEFAULT 'contato@barbershop.com.br',
    pix_type TEXT DEFAULT 'email',
    pix_name TEXT DEFAULT 'BarberShop Oficial',
    pix_bank TEXT DEFAULT 'Nubank',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ====================================================================
-- Habilitar Row Level Security (RLS) e Políticas de Leitura/Gravação
-- ====================================================================
ALTER TABLE public.barbershop_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.theme_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buttons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.closed_popup_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instagram_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_library ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público para leitura de configurações do cartão virtual
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public read barbershop_settings" ON public.barbershop_settings;
    CREATE POLICY "Public read barbershop_settings" ON public.barbershop_settings FOR SELECT USING (true);
    
    DROP POLICY IF EXISTS "Public write barbershop_settings" ON public.barbershop_settings;
    CREATE POLICY "Public write barbershop_settings" ON public.barbershop_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read theme_settings" ON public.theme_settings;
    CREATE POLICY "Public read theme_settings" ON public.theme_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write theme_settings" ON public.theme_settings;
    CREATE POLICY "Public write theme_settings" ON public.theme_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read services" ON public.services;
    CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write services" ON public.services;
    CREATE POLICY "Public write services" ON public.services FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read buttons" ON public.buttons;
    CREATE POLICY "Public read buttons" ON public.buttons FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write buttons" ON public.buttons;
    CREATE POLICY "Public write buttons" ON public.buttons FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read page_sections" ON public.page_sections;
    CREATE POLICY "Public read page_sections" ON public.page_sections FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write page_sections" ON public.page_sections;
    CREATE POLICY "Public write page_sections" ON public.page_sections FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read booking_settings" ON public.booking_settings;
    CREATE POLICY "Public read booking_settings" ON public.booking_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write booking_settings" ON public.booking_settings;
    CREATE POLICY "Public write booking_settings" ON public.booking_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read bookings" ON public.bookings;
    CREATE POLICY "Public read bookings" ON public.bookings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write bookings" ON public.bookings;
    CREATE POLICY "Public write bookings" ON public.bookings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read weekly_schedule" ON public.weekly_schedule;
    CREATE POLICY "Public read weekly_schedule" ON public.weekly_schedule FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write weekly_schedule" ON public.weekly_schedule;
    CREATE POLICY "Public write weekly_schedule" ON public.weekly_schedule FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read closed_popup_settings" ON public.closed_popup_settings;
    CREATE POLICY "Public read closed_popup_settings" ON public.closed_popup_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write closed_popup_settings" ON public.closed_popup_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read instagram_settings" ON public.instagram_settings;
    CREATE POLICY "Public read instagram_settings" ON public.instagram_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write instagram_settings" ON public.instagram_settings;
    CREATE POLICY "Public write instagram_settings" ON public.instagram_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read hero_slides" ON public.hero_slides;
    CREATE POLICY "Public read hero_slides" ON public.hero_slides FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write hero_slides" ON public.hero_slides;
    CREATE POLICY "Public write hero_slides" ON public.hero_slides FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read hero_settings" ON public.hero_settings;
    CREATE POLICY "Public read hero_settings" ON public.hero_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write hero_settings" ON public.hero_settings;
    CREATE POLICY "Public write hero_settings" ON public.hero_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read gallery_settings" ON public.gallery_settings;
    CREATE POLICY "Public read gallery_settings" ON public.gallery_settings FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write gallery_settings" ON public.gallery_settings FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read media_library" ON public.media_library;
    CREATE POLICY "Public read media_library" ON public.media_library FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write media_library" ON public.media_library;
    CREATE POLICY "Public write media_library" ON public.media_library FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read metrics" ON public.metrics;
    CREATE POLICY "Public read metrics" ON public.metrics FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write metrics" ON public.metrics;
    CREATE POLICY "Public write metrics" ON public.metrics FOR ALL USING (true);

    DROP POLICY IF EXISTS "Public read integrations" ON public.integrations;
    CREATE POLICY "Public read integrations" ON public.integrations FOR SELECT USING (true);
    DROP POLICY IF EXISTS "Public write integrations" ON public.integrations;
    CREATE POLICY "Public write integrations" ON public.integrations FOR ALL USING (true);
END $$;

-- ====================================================================
-- Habilitar Supabase Realtime para sincronização instantânea
-- ====================================================================
DO $$
BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.barbershop_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.theme_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.services;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.buttons;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.page_sections;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.booking_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.bookings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.weekly_schedule;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.closed_popup_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.instagram_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_slides;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.hero_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.gallery_settings;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.media_library;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.metrics;
    ALTER PUBLICATION supabase_realtime ADD TABLE public.integrations;
EXCEPTION WHEN OTHERS THEN
    -- Ignorar se já estiver na publicação
    NULL;
END $$;

-- ====================================================================
-- Configuração do Supabase Storage (Bucket para Upload de Imagens)
-- ====================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('barbershop-media', 'barbershop-media', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access to BarberShop Media" ON storage.objects;
    CREATE POLICY "Public Access to BarberShop Media" ON storage.objects FOR SELECT USING (bucket_id = 'barbershop-media');

    DROP POLICY IF EXISTS "Public Upload to BarberShop Media" ON storage.objects;
    CREATE POLICY "Public Upload to BarberShop Media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'barbershop-media');
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;
