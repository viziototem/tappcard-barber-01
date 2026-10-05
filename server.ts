import express from 'express';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
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
} from './src/data/defaultData';
import { CloudBackendState } from './src/types';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const IS_PROD = process.env.NODE_ENV === 'production';
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'app_state.json');
const UPLOADS_DIR = path.resolve(process.cwd(), 'public', 'uploads');

// Assegurar que os diretórios de dados e uploads existem
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function getInitialState(): CloudBackendState {
  const envSupabaseUrl = process.env.VITE_SUPABASE_URL || '';
  const envSupabaseKey = process.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    barbershop: DEFAULT_BARBERSHOP,
    services: DEFAULT_SERVICES,
    bookingSettings: DEFAULT_BOOKING_SETTINGS,
    theme: DEFAULT_THEME_PRESETS['Dark Premium'],
    bookings: INITIAL_BOOKINGS,
    metrics: { views: 1420, whatsappClicks: 320, bookingsInitiated: 185, instagramClicks: 410, mapsClicks: 215 },
    buttons: DEFAULT_BUTTONS,
    sections: DEFAULT_SECTIONS,
    instagram: DEFAULT_INSTAGRAM,
    wifi: DEFAULT_WIFI,
    pix: DEFAULT_PIX,
    mediaItems: DEFAULT_MEDIA_ITEMS,
    heroSlides: DEFAULT_HERO_SLIDES,
    heroSettings: DEFAULT_HERO_SETTINGS,
    gallery: DEFAULT_GALLERY,
    weeklySchedule: DEFAULT_WEEKLY_SCHEDULE,
    closedPopup: DEFAULT_CLOSED_POPUP,
    supabaseConfig: {
      url: envSupabaseUrl,
      anonKey: envSupabaseKey,
      connected: Boolean(envSupabaseUrl && envSupabaseKey && envSupabaseUrl !== 'https://your-project.supabase.co'),
      realtimeEnabled: true
    },
    lastUpdated: new Date().toISOString()
  };
}

// Carregar ou inicializar o banco de dados persistente
let appState: CloudBackendState = (() => {
  if (fs.existsSync(DB_FILE)) {
    try {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(content);
      // Garantir compatibilidade com novos campos
      return {
        ...getInitialState(),
        ...parsed,
        lastUpdated: parsed.lastUpdated || new Date().toISOString()
      };
    } catch (e) {
      console.error('Falha ao ler db persistente, recriando inicial:', e);
    }
  }
  const initial = getInitialState();
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao escrever arquivo inicial de dados:', err);
  }
  return initial;
})();

function saveStateToDisk() {
  try {
    appState.lastUpdated = new Date().toISOString();
    fs.writeFileSync(DB_FILE, JSON.stringify(appState, null, 2), 'utf-8');
  } catch (err) {
    console.error('Erro ao salvar estado persistente em disco:', err);
  }
}

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Servir uploads públicos
app.use('/uploads', express.static(UPLOADS_DIR));

// ====================================================================
// Rotas de API Cloud Backend & Persistência Multi-Dispositivo
// ====================================================================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    serverTime: new Date().toISOString(),
    persistentStorage: 'active',
    lastUpdated: appState.lastUpdated
  });
});

// Obter estado completo sincronizado
app.get('/api/state', (req, res) => {
  res.json(appState);
});

// Atualizar estado (completo ou mesclado)
app.post('/api/state', (req, res) => {
  const updates = req.body;
  if (!updates || typeof updates !== 'object') {
    return res.status(400).json({ error: 'Corpo da requisição inválido' });
  }

  appState = {
    ...appState,
    ...updates,
    lastUpdated: new Date().toISOString()
  };
  saveStateToDisk();

  res.json({ success: true, lastUpdated: appState.lastUpdated, state: appState });
});

// Atualizar fatia específica do estado (ex: /api/state/services, /api/state/theme)
app.patch('/api/state/:slice', (req, res) => {
  const { slice } = req.params;
  const payload = req.body;

  if (slice in appState) {
    (appState as any)[slice] = payload;
    saveStateToDisk();
    return res.json({ success: true, slice, data: payload, lastUpdated: appState.lastUpdated });
  }

  res.status(404).json({ error: `Fatia '${slice}' não encontrada no estado do banco de dados.` });
});

// Criar Agendamento Persistente
app.post('/api/bookings', (req, res) => {
  const newBooking = req.body;
  if (!newBooking || !newBooking.customerName || !newBooking.service) {
    return res.status(400).json({ error: 'Dados do agendamento incompletos' });
  }

  const bookingRecord = {
    id: newBooking.id || `book_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
    customerName: newBooking.customerName,
    customerPhone: newBooking.customerPhone || '',
    date: newBooking.date,
    time: newBooking.time,
    people: Number(newBooking.people) || 1,
    service: newBooking.service,
    notes: newBooking.notes || '',
    status: newBooking.status || 'pending',
    createdAt: newBooking.createdAt || new Date().toISOString()
  };

  appState.bookings = [bookingRecord, ...(appState.bookings || [])];
  appState.metrics.bookingsInitiated += 1;
  saveStateToDisk();

  res.json({ success: true, booking: bookingRecord });
});

// Atualizar status de agendamento
app.patch('/api/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const booking = appState.bookings.find(b => b.id === id);
  if (!booking) {
    return res.status(404).json({ error: 'Agendamento não encontrado' });
  }

  booking.status = status;
  saveStateToDisk();

  res.json({ success: true, booking });
});

// Deletar agendamento
app.delete('/api/bookings/:id', (req, res) => {
  const { id } = req.params;
  appState.bookings = appState.bookings.filter(b => b.id !== id);
  saveStateToDisk();
  res.json({ success: true });
});

// Incrementar métricas
app.post('/api/metrics/track', (req, res) => {
  const { key } = req.body;
  if (key && key in appState.metrics) {
    (appState.metrics as any)[key] = ((appState.metrics as any)[key] || 0) + 1;
    saveStateToDisk();
    return res.json({ success: true, metrics: appState.metrics });
  }
  res.status(400).json({ error: 'Chave de métrica inválida' });
});

// Configuração do Supabase
app.get('/api/supabase/config', (req, res) => {
  res.json(appState.supabaseConfig || {
    url: '',
    anonKey: '',
    connected: false,
    realtimeEnabled: true
  });
});

app.post('/api/supabase/config', (req, res) => {
  const { url, anonKey } = req.body;
  appState.supabaseConfig = {
    url: url || '',
    anonKey: anonKey || '',
    connected: Boolean(url && anonKey && url !== 'https://your-project.supabase.co'),
    lastTestedAt: new Date().toISOString(),
    realtimeEnabled: true
  };
  saveStateToDisk();
  res.json({ success: true, config: appState.supabaseConfig });
});

// Script SQL completo para migração do Supabase
app.get('/api/supabase/schema', (req, res) => {
  const sqlPath = path.resolve(process.cwd(), 'supabase-schema.sql');
  if (fs.existsSync(sqlPath)) {
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.send(sql);
  }
  res.status(404).send('-- supabase-schema.sql não encontrado');
});

// Upload de mídia em base64 (suporte para upload imediato em nuvem)
app.post('/api/upload', (req, res) => {
  try {
    const { fileName, base64Data, category } = req.body;
    if (!fileName || !base64Data) {
      return res.status(400).json({ error: 'Parâmetros de arquivo ausentes' });
    }

    // Remover header data:image/xxx;base64,
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const buffer = matches ? Buffer.from(matches[2], 'base64') : Buffer.from(base64Data, 'base64');

    const cleanName = `${Date.now()}_${fileName.replace(/[^a-zA-Z0-9._-]/g, '')}`;
    const targetPath = path.join(UPLOADS_DIR, cleanName);

    fs.writeFileSync(targetPath, buffer);
    const publicUrl = `/uploads/${cleanName}`;

    const newMediaItem = {
      id: `media_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      fileUrl: publicUrl,
      fileName: fileName,
      category: category || 'Outras',
      fileSize: `${Math.round(buffer.length / 1024)} KB`,
      createdAt: new Date().toISOString()
    };

    appState.mediaItems = [newMediaItem as any, ...(appState.mediaItems || [])];
    saveStateToDisk();

    res.json({ success: true, mediaItem: newMediaItem, url: publicUrl });
  } catch (err: any) {
    console.error('Erro no upload local:', err);
    res.status(500).json({ error: err?.message || 'Falha no processamento do upload' });
  }
});

// ====================================================================
// Configuração do Vite e Servidor Web
// ====================================================================

async function startServer() {
  if (!IS_PROD) {
    // Modo de Desenvolvimento com Vite integrado
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Modo de Produção
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BarberShop Cloud Backend] Servidor ativo em http://0.0.0.0:${PORT}`);
    console.log(`[BarberShop Cloud Backend] Armazenamento persistente em ${DB_FILE}`);
  });
}

startServer().catch((err) => {
  console.error('Falha crítica ao iniciar servidor:', err);
  process.exit(1);
});
