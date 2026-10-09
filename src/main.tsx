import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in DER GIPFEL:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#FBFBFA] text-[#121214] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white border border-neutral-200 rounded-2xl p-8 shadow-xl text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto text-xl font-bold">
              !
            </div>
            <h1 className="text-xl font-bold font-display uppercase tracking-tight text-neutral-900">
              DER GIPFEL
            </h1>
            <p className="text-xs text-neutral-600">
              Ein technischer Fehler wurde abgefangen:
            </p>
            <div className="p-3 bg-neutral-100 rounded-lg text-left text-xs font-mono text-red-700 overflow-x-auto max-h-32">
              {this.state.error?.message || 'Unbekannter Initialisierungsfehler'}
            </div>
            <button
              onClick={this.handleReset}
              className="w-full py-2.5 bg-neutral-900 text-white text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Speicher Bereinigen & Neu Laden
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
