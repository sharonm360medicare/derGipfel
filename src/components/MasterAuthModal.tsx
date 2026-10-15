import React, { useState } from 'react';
import { useCompetition } from '../context/CompetitionContext';
import { User, Lock, AlertCircle, X, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { playClickSound } from '../utils/sound';

interface MasterAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (role: 'HEAD_MASTER' | 'SUB_MASTER') => void;
}

export const MasterAuthModal: React.FC<MasterAuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, language } = useCompetition();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setErrorMessage(
        language === 'de'
          ? 'Bitte geben Sie Ihre Quizmeister-ID und das Passwort ein.'
          : 'Please enter your Quiz Master ID and password.'
      );
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
        setErrorMessage(
          result.message ||
            (language === 'de'
              ? 'Ungültige Anmeldedaten. Bitte prüfen Sie ID und Passwort.'
              : 'Invalid credentials. Please verify your ID and password.')
        );
      }
    }, 250);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-neutral-200">
        {/* Header */}
        <div className="bg-[#121214] text-white p-6 relative border-b border-neutral-800">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
            aria-label="Schließen"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-widest text-red-500 font-semibold mb-2">
            <Lock className="w-3.5 h-3.5" />
            <span>{language === 'de' ? 'Geschützter Bereich' : 'Restricted Zone'}</span>
          </div>
          <h3 className="text-xl font-display font-bold text-white tracking-tight">
            {language === 'de' ? 'Quizmeister Authentifizierung' : 'Quiz Master Authentication'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {language === 'de'
              ? 'Melden Sie sich mit Ihrer Quizmeister-ID und dem autorisierten Passwort an.'
              : 'Sign in with your designated Quiz Master ID and authorized password.'}
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
              {language === 'de' ? 'Quizmeister ID / Benutzername *' : 'Quiz Master ID / Username *'}
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
                placeholder={language === 'de' ? 'z.B. sharon360 oder Sub-Master ID' : 'e.g. sharon360 or Sub-Master ID'}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white font-mono transition-all"
                autoFocus
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
              {language === 'de' ? 'Passwort *' : 'Password *'}
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
                placeholder={language === 'de' ? 'Passwort eingeben' : 'Enter password'}
                className="w-full pl-9 pr-10 py-2.5 text-sm bg-neutral-50 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:bg-white font-mono transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                title={showPassword ? (language === 'de' ? 'Passwort verbergen' : 'Hide password') : (language === 'de' ? 'Passwort anzeigen' : 'Show password')}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="pt-2 border-t border-neutral-100">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 block mb-2">
              {language === 'de' ? '⚡ 1-Klick Schnell-Login (Demo-Zugang):' : '⚡ 1-Click Quick Login (Demo Access):'}
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setUsername('sharon360');
                  setPassword('Sharon@360Medicare');
                  setIsVerifying(true);
                  setErrorMessage('');
                  setTimeout(() => {
                    const result = login('sharon360', 'Sharon@360Medicare');
                    setIsVerifying(false);
                    if (result.success && result.role) {
                      playClickSound();
                      onSuccess(result.role);
                      onClose();
                    }
                  }, 200);
                }}
                className="p-2 text-left bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg text-2xs transition-colors flex flex-col"
              >
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  {language === 'de' ? 'Oberster Quizmeister' : 'Chief Quiz Master'}
                </span>
                <span className="font-mono text-neutral-500 text-[10px]">ID: sharon360</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('sub_berlin');
                  setPassword('SubBerlin@2026');
                  setIsVerifying(true);
                  setErrorMessage('');
                  setTimeout(() => {
                    const result = login('sub_berlin', 'SubBerlin@2026');
                    setIsVerifying(false);
                    if (result.success && result.role) {
                      playClickSound();
                      onSuccess(result.role);
                      onClose();
                    }
                  }, 200);
                }}
                className="p-2 text-left bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg text-2xs transition-colors flex flex-col"
              >
                <span className="font-bold text-neutral-900 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  {language === 'de' ? 'Sub-Quizmeister' : 'Sub-Quiz Master'}
                </span>
                <span className="font-mono text-neutral-500 text-[10px]">ID: sub_berlin</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              {language === 'de' ? 'Abbrechen' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={isVerifying}
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>{isVerifying ? (language === 'de' ? 'Überprüfe...' : 'Verifying...') : (language === 'de' ? 'Anmelden' : 'Sign In')}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
