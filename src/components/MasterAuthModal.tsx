import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { ShieldCheck, User, Lock, AlertCircle, X, ChevronRight, UserCheck, Eye, EyeOff } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface MasterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'HEAD_MASTER' | 'SUB_MASTER') => void;
}

export const MasterAuthModal: React.FC<MasterAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, subMasters } = useCompetition();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage('Bitte geben Sie Ihre Quizmeister-ID und das Passwort ein.');
      return;
    }

    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      const result = login(username, password);
      setIsVerifying(false);
      if (result.success && result.role) {
        playClickSound();
        onSuccess(result.role);
        onClose();
      } else {
        setErrorMessage(result.message || 'Ungültige Anmeldedaten. Bitte prüfen Sie ID und Passwort.');
      }
    }, 250);
  };

  const fillHeadMaster = () => {
    setUsername('sharon360');
    setPassword('Sharon@360Medicare');
    setErrorMessage('');
  };

  const fillSubMaster = () => {
    const demoSub = subMasters[0] || { username: 'sub_berlin', password: 'SubBerlin@2026' };
    setUsername(demoSub.username);
    setPassword(demoSub.password || 'SubBerlin@2026');
    setErrorMessage('');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white border border-neutral-200 shadow-2xl rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-[#101014] text-white p-6 border-b border-neutral-800 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 text-neutral-400 hover:text-white transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-red-500 font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>Geschützter Bereich</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white tracking-tight">
            Quizmeister Authentifizierung
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Melden Sie sich mit Ihrer Quizmeister-ID und dem autorisierten Passwort an.
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMessage && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* ID / Username Field */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Quizmeister ID / Benutzername *
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="z.B. sharon360 oder Sub-Master ID"
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white font-mono transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              Passwort *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errorMessage) setErrorMessage('');
                }}
                placeholder="Passwort eingeben"
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                title={showPassword ? 'Passwort verbergen' : 'Passwort anzeigen'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Credentials Helpers */}
          <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200 space-y-2">
            <span className="text-2xs font-bold uppercase tracking-wider text-neutral-500 block">
              Zugangsdaten zum schnellen Testen:
            </span>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={fillHeadMaster}
                className="flex-1 text-left px-2.5 py-2 bg-white border border-neutral-200 rounded-lg hover:border-red-400 text-2xs transition-colors group"
              >
                <div className="flex items-center gap-1 font-bold text-neutral-900 group-hover:text-red-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
                  <span>sharon360</span>
                </div>
                <span className="text-neutral-500 font-mono text-[10px] block mt-0.5">
                  Oberster Quizmeister
                </span>
              </button>

              <button
                type="button"
                onClick={fillSubMaster}
                className="flex-1 text-left px-2.5 py-2 bg-white border border-neutral-200 rounded-lg hover:border-amber-400 text-2xs transition-colors group"
              >
                <div className="flex items-center gap-1 font-bold text-neutral-900 group-hover:text-amber-600">
                  <UserCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>sub_berlin</span>
                </div>
                <span className="text-neutral-500 font-mono text-[10px] block mt-0.5">
                  Sub-Quizmeister
                </span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>{isVerifying ? 'Überprüfe...' : 'Anmelden'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
