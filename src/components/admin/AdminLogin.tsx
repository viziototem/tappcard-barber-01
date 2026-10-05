import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Lock, ArrowLeft, Shield, AlertCircle, KeyRound, User } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { loginAdmin, setCurrentView } = useApp();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // User specifies: login: adm012026, password: adm012026
      if (username.trim() === 'adm012026' && password === 'adm012026') {
        const success = loginAdmin(password);
        if (success) {
          setCurrentView('admin');
        } else {
          setError('Credenciais incorretas.');
        }
      } else {
        setError('Usuário ou senha incorretos.');
      }
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#080808] flex items-center justify-center p-4 selection:bg-[#A8FF3E] selection:text-black">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />

      <div className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-[26px] p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Back to Public Card */}
        <button
          onClick={() => setCurrentView('public')}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Cartão Virtual</span>
        </button>

        {/* Lock Icon & Branding */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl mx-auto flex items-center justify-center bg-white/[0.05] border border-white/10 text-white">
            <Shield className="w-7 h-7 text-[#A8FF3E]" />
          </div>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Acesso do Proprietário
          </h2>
          <p className="text-xs text-stone-400">
            Painel de controle master para gerenciamento do cartão digital e agendamentos.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              Usuário Master
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                placeholder="Insira seu usuário"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full py-3 pl-10 pr-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:border-[#A8FF3E] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              Senha de Segurança
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-500">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                placeholder="Insira sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 pl-10 pr-3 rounded-xl bg-stone-900 border border-white/15 text-white text-xs placeholder:text-stone-600 focus:border-[#A8FF3E] focus:outline-none transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-bold text-sm text-black bg-[#A8FF3E] hover:bg-[#97f02d] active:scale-[0.98] transition-all shadow-lg shadow-[#A8FF3E]/10 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span>Autenticando...</span>
            ) : (
              <>
                <Lock className="w-4 h-4 text-black" />
                <span>Entrar no Painel Master</span>
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-[11px] text-stone-500">
            TappCard Security · Sistema criptografado para proprietários
          </p>
        </div>
      </div>
    </div>
  );
};
