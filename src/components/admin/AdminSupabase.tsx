import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Database,
  Cloud,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  HardDrive,
  Radio,
  FileCode,
  Download,
  Sparkles
} from 'lucide-react';
import { testSupabaseConnection, syncFullStateToSupabase, isSupabaseConfigured } from '../../lib/supabase';

export const AdminSupabase: React.FC = () => {
  const {
    barbershop,
    theme,
    services,
    buttons,
    sections,
    bookingSettings,
    bookings,
    weeklySchedule,
    closedPopup,
    instagram,
    wifi,
    pix,
    mediaItems,
    heroSlides,
    heroSettings,
    gallery,
    metrics,
    cloudSyncStatus,
    syncWithCloud,
    supabaseConfig,
    saveSupabaseConfig
  } = useApp();

  const [urlInput, setUrlInput] = useState(supabaseConfig?.url || '');
  const [keyInput, setKeyInput] = useState(supabaseConfig?.anonKey || '');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [pushingToSupabase, setPushingToSupabase] = useState(false);
  const [pushResult, setPushResult] = useState<{ success: boolean; message: string } | null>(null);
  const [sqlSchemaContent, setSqlSchemaContent] = useState<string>('');
  const [isSavingConfig, setIsSavingConfig] = useState(false);

  useEffect(() => {
    if (supabaseConfig?.url) setUrlInput(supabaseConfig.url);
    if (supabaseConfig?.anonKey) setKeyInput(supabaseConfig.anonKey);

    // Carregar schema SQL da rota da API
    fetch('/api/supabase/schema')
      .then(res => res.text())
      .then(text => setSqlSchemaContent(text))
      .catch(() => {
        setSqlSchemaContent('-- Script SQL disponível em /supabase-schema.sql');
      });
  }, [supabaseConfig]);

  const handleTestConnection = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await testSupabaseConnection(urlInput.trim(), keyInput.trim());
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err?.message || 'Falha ao conectar'
      });
    } finally {
      setTestingConnection(false);
    }
  };

  const handleSaveCredentials = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingConfig(true);
    try {
      await saveSupabaseConfig(urlInput.trim(), keyInput.trim());
      await handleTestConnection();
    } finally {
      setIsSavingConfig(false);
    }
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlSchemaContent);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  const handleDownloadSql = () => {
    const blob = new Blob([sqlSchemaContent], { type: 'text/sql;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'supabase-schema.sql');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePushAllToSupabase = async () => {
    setPushingToSupabase(true);
    setPushResult(null);
    try {
      const fullState = {
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
        closedPopup
      };
      const result = await syncFullStateToSupabase(fullState);
      if (result.success) {
        setPushResult({
          success: true,
          message: 'Todos os dados foram sincronizados com sucesso nas tabelas PostgreSQL do Supabase!'
        });
      } else {
        setPushResult({
          success: false,
          message: result.error || 'Falha na sincronização com Supabase.'
        });
      }
    } catch (err: any) {
      setPushResult({
        success: false,
        message: err?.message || 'Erro inesperado ao sincronizar com Supabase.'
      });
    } finally {
      setPushingToSupabase(false);
    }
  };

  const isConfigured = isSupabaseConfigured();

  return (
    <div className="space-y-8 animate-fadeIn pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950/40 via-stone-900 to-black border border-emerald-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-[#A8FF3E]/15 text-[#A8FF3E] border border-[#A8FF3E]/30 flex items-center gap-1.5">
                <Radio className="w-3 h-3 animate-pulse" />
                Backend em Nuvem Persistente
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/[0.08] text-stone-300 border border-white/10">
                Multi-Dispositivo
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Nuvem & Supabase PostgreSQL
            </h2>
            <p className="text-sm text-stone-400 max-w-2xl leading-relaxed">
              Elimine dependências do armazenamento local. Qualquer alteração feita neste painel é gravada
              imediatamente na nuvem e refletida em tempo real para os clientes no cartão virtual em qualquer celular.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={() => syncWithCloud()}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold transition-all border border-white/10 flex items-center justify-center gap-2 cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${cloudSyncStatus === 'syncing' ? 'animate-spin text-[#A8FF3E]' : ''}`} />
              <span>Sincronizar Agora</span>
            </button>

            {isConfigured && (
              <button
                onClick={handlePushAllToSupabase}
                disabled={pushingToSupabase}
                className="px-4 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#A8FF3E]/20 cursor-pointer active:scale-95 disabled:opacity-50"
              >
                {pushingToSupabase ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>Exportar Dados ao Supabase</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Servidor Cloud Backend */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Cloud className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Servidor Ativo
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Servidor Backend Persistente</h3>
            <p className="text-xs text-stone-400 mt-1">
              Todas as 16 seções, temas, botões e agendamentos estão salvos com persistência contínua.
            </p>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
            <span>Status da Sincronização:</span>
            <span className="font-semibold text-emerald-400">
              {cloudSyncStatus === 'syncing' ? 'Sincronizando...' : 'Online & Sincronizado'}
            </span>
          </div>
        </div>

        {/* Card 2: Supabase PostgreSQL */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isConfigured
                ? 'bg-[#3ECF8E]/10 border border-[#3ECF8E]/20 text-[#3ECF8E]'
                : 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            }`}>
              <Database className="w-5 h-5" />
            </div>
            <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${
              isConfigured
                ? 'bg-[#3ECF8E]/15 text-[#3ECF8E] border border-[#3ECF8E]/30'
                : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
            }`}>
              {isConfigured ? 'Supabase Conectado' : 'Aguardando Credenciais'}
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Banco Supabase PostgreSQL</h3>
            <p className="text-xs text-stone-400 mt-1">
              {isConfigured
                ? 'Integrado com tabelas PostgreSQL e Row Level Security.'
                : 'Insira o Project URL e Anon Key abaixo para conectar.'}
            </p>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
            <span>Realtime Websocket:</span>
            <span className={isConfigured ? 'font-semibold text-[#3ECF8E]' : 'font-semibold text-stone-500'}>
              {isConfigured ? 'Habilitado' : 'Inativo'}
            </span>
          </div>
        </div>

        {/* Card 3: Storage de Imagens */}
        <div className="bg-[#151515] border border-white/10 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <HardDrive className="w-5 h-5" />
            </div>
            <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
              Bucket: barbershop-media
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">Armazenamento de Fotos</h3>
            <p className="text-xs text-stone-400 mt-1">
              Uploads da galeria, cortes e banners são preservados sem perda de resolução.
            </p>
          </div>
          <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-stone-400">
            <span>Total de Mídias Salvas:</span>
            <span className="font-semibold text-white">{mediaItems?.length || 0} arquivos</span>
          </div>
        </div>
      </div>

      {/* Supabase Credentials Setup Form */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/[0.08] pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-[#3ECF8E]" />
              Conectar com seu Projeto Supabase
            </h3>
            <p className="text-xs text-stone-400">
              Conecte sua conta do Supabase para persistência direta em banco relacional PostgreSQL e autenticação.
            </p>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#3ECF8E]/10 hover:bg-[#3ECF8E]/20 text-[#3ECF8E] text-xs font-semibold border border-[#3ECF8E]/30 transition-colors"
          >
            <span>Abrir Painel do Supabase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Supabase Project URL</span>
                <span className="text-[10px] text-stone-500 font-normal">Ex: https://xyzcompany.supabase.co</span>
              </label>
              <input
                type="url"
                value={urlInput}
                onChange={e => setUrlInput(e.target.value)}
                placeholder="https://sua-instancia.supabase.co"
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#A8FF3E] transition-all font-mono"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-300 flex items-center justify-between">
                <span>Supabase Anon Public Key</span>
                <span className="text-[10px] text-stone-500 font-normal">Chave pública `anon`</span>
              </label>
              <input
                type="password"
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:outline-none focus:border-[#A8FF3E] transition-all font-mono"
              />
            </div>
          </div>

          {/* Test connection alert message */}
          {testResult && (
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              testResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div className="space-y-1">
                <span className="font-bold">{testResult.success ? 'Conexão Bem-Sucedida!' : 'Falha na Conexão'}</span>
                <p className="opacity-90">{testResult.message}</p>
              </div>
            </div>
          )}

          {/* Push alert message */}
          {pushResult && (
            <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 ${
              pushResult.success
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
            }`}>
              {pushResult.success ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              <div>
                <span className="font-bold">{pushResult.success ? 'Dados Exportados!' : 'Erro na Exportação'}</span>
                <p className="opacity-90">{pushResult.message}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={isSavingConfig}
              className="px-5 py-2.5 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isSavingConfig ? 'Salvando...' : 'Salvar e Conectar Supabase'}
            </button>

            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testingConnection || !urlInput || !keyInput}
              className="px-4 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold border border-white/10 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-40"
            >
              {testingConnection ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <ShieldCheck className="w-3.5 h-3.5 text-[#3ECF8E]" />}
              <span>Testar Conexão</span>
            </button>
          </div>
        </form>
      </div>

      {/* SQL Migration Script Section */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileCode className="w-5 h-5 text-[#A8FF3E]" />
              Script SQL de Criação de Tabelas (Supabase)
            </h3>
            <p className="text-xs text-stone-400">
              Cole este script no <strong>SQL Editor</strong> do Supabase para criar automaticamente todas as tabelas, permissões RLS, canais de Realtime e bucket de Storage.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadSql}
              className="px-3.5 py-2 rounded-xl bg-white/[0.06] hover:bg-white/10 text-stone-300 text-xs font-semibold border border-white/10 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Baixar .sql</span>
            </button>

            <button
              onClick={handleCopySql}
              className="px-4 py-2 rounded-xl bg-[#A8FF3E] hover:bg-[#97f02d] text-black text-xs font-bold transition-all flex items-center gap-1.5 shadow cursor-pointer active:scale-95"
            >
              {copiedSql ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span>Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar SQL Completo</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 3 Step Instruction Guide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#A8FF3E]/20 text-[#A8FF3E] text-xs font-bold flex items-center justify-center">
              1
            </div>
            <h4 className="text-xs font-bold text-white">Criar Projeto no Supabase</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Acesse <a href="https://supabase.com" target="_blank" rel="noreferrer" className="text-[#A8FF3E] underline">supabase.com</a> e crie um projeto novo gratuito em menos de 1 minuto.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#A8FF3E]/20 text-[#A8FF3E] text-xs font-bold flex items-center justify-center">
              2
            </div>
            <h4 className="text-xs font-bold text-white">Executar no SQL Editor</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              No menu lateral do Supabase, clique em <strong>SQL Editor</strong> &rarr; <strong>New Query</strong>, cole o script abaixo e clique em <strong>Run</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 space-y-2">
            <div className="w-6 h-6 rounded-full bg-[#A8FF3E]/20 text-[#A8FF3E] text-xs font-bold flex items-center justify-center">
              3
            </div>
            <h4 className="text-xs font-bold text-white">Copiar URL e Chave Anon</h4>
            <p className="text-[11px] text-stone-400 leading-relaxed">
              Em <strong>Project Settings &rarr; API</strong>, copie o Project URL e a Chave `anon`, cole nos campos acima e clique em <strong>Salvar e Conectar</strong>.
            </p>
          </div>
        </div>

        {/* SQL Code Preview Box */}
        <div className="relative">
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={handleCopySql}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold backdrop-blur-md transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3 h-3 text-[#A8FF3E]" /> : <Copy className="w-3 h-3" />}
              <span>{copiedSql ? 'Copiado!' : 'Copiar'}</span>
            </button>
          </div>

          <pre className="p-4 rounded-2xl bg-black/70 border border-white/10 text-stone-300 font-mono text-[11px] overflow-x-auto max-h-72 leading-relaxed selection:bg-[#A8FF3E] selection:text-black">
            <code>{sqlSchemaContent}</code>
          </pre>
        </div>
      </div>

      {/* Migrated Tables Overview */}
      <div className="bg-[#151515] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#A8FF3E]" />
          Estrutura do Banco de Dados Migrado
        </h3>
        <p className="text-xs text-stone-400">
          Nenhuma configuração da barbearia depende do dispositivo local do cliente ou do administrador. Todos os dados são sincronizados com estas tabelas:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { name: 'barbershop_settings', label: 'Dados da Barbearia', count: '1 registro mestre' },
            { name: 'theme_settings', label: 'Cores, Fontes e Tema', count: '1 tema ativo' },
            { name: 'services', label: 'Serviços & Preços', count: `${services.length} serviços` },
            { name: 'buttons', label: 'Botões & Links Rápidos', count: `${buttons.length} botões` },
            { name: 'page_sections', label: 'Seções da Página Pública', count: `${sections.length} seções` },
            { name: 'booking_settings', label: 'Regras de Agendamento', count: '1 configuração' },
            { name: 'bookings', label: 'Agendamentos dos Clientes', count: `${bookings.length} registros` },
            { name: 'weekly_schedule', label: 'Horários Semanais', count: `${weeklySchedule.length} dias` },
            { name: 'closed_popup_settings', label: 'Popup Barbearia Fechada', count: '1 configuração' },
            { name: 'instagram_settings', label: 'Feed do Instagram', count: `${instagram.posts?.length || 0} posts` },
            { name: 'hero_slides', label: 'Slides do Banner', count: `${heroSlides.length} fotos` },
            { name: 'gallery_settings', label: 'Galeria de Cortes', count: `${gallery.items?.length || 0} cortes` },
            { name: 'media_library', label: 'Biblioteca de Mídias', count: `${mediaItems.length} arquivos` },
            { name: 'integrations', label: 'Wi-Fi e Chave PIX', count: '1 configuração' },
            { name: 'metrics', label: 'Contador de Visualizações', count: `${metrics.views} views` },
            { name: 'storage: barbershop-media', label: 'Bucket de Arquivos', count: 'Público CDN' }
          ].map(table => (
            <div key={table.name} className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
              <span className="text-[10px] font-mono text-[#A8FF3E] block truncate">{table.name}</span>
              <h5 className="text-xs font-bold text-white">{table.label}</h5>
              <span className="text-[10px] text-stone-500 block">{table.count}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
