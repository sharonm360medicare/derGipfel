import React from 'react';
import { ArrowUp } from 'lucide-react';
import { playClickSound } from '../utils/sound';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    playClickSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-200 bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-8">
        {/* Mountain Peak Icon */}
        <button
          onClick={scrollToTop}
          className="group focus:outline-none p-2 rounded-full hover:bg-neutral-100 transition-colors"
          title="Nach oben scrollen"
        >
          <svg
            className="w-8 h-8 text-neutral-900 group-hover:text-red-600 transition-colors mx-auto"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m2 20 7-13 4 7 3-5 6 11H2z" />
          </svg>
        </button>

        {/* Brand Display Header */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-5xl font-display font-black tracking-tight uppercase text-neutral-900">
            DER GIPFEL
          </h2>
          <p className="text-xs sm:text-sm font-semibold tracking-wider text-neutral-500 uppercase">
            The Journey to German Excellence.
          </p>
        </div>

        {/* Navigation Link Mirror matching Brochure Page 17 */}
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-2xs sm:text-xs font-mono font-bold tracking-widest text-neutral-600 uppercase">
          <a href="#" className="hover:text-neutral-900 transition-colors">HOME</a>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <a href="#wettbewerb" className="hover:text-neutral-900 transition-colors">COMPETITION</a>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <a href="#runden" className="hover:text-neutral-900 transition-colors">ROUNDS</a>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <a href="#gruppen" className="hover:text-neutral-900 transition-colors">PARTICIPANTS</a>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <a href="#zeitplan" className="hover:text-neutral-900 transition-colors">SCHEDULE</a>
          <span aria-hidden="true" className="text-neutral-300">·</span>
          <a href="#regeln" className="hover:text-neutral-900 transition-colors">RULES</a>
        </nav>

        {/* Official German Trademark Slogan */}
        <div className="pt-8 border-t border-neutral-100 w-full flex flex-col sm:flex-row items-center justify-between text-2xs text-neutral-500 font-mono gap-4">
          <span>© DER GIPFEL {new Date().getFullYear()}</span>
          <span className="uppercase tracking-widest text-neutral-700 font-semibold">
            EINE SPRACHE · EINE HERAUSFORDERUNG · EIN GIPFEL
          </span>
          <button
            onClick={scrollToTop}
            className="hover:text-neutral-900 inline-flex items-center gap-1 font-semibold"
          >
            <span>NACH OBEN</span>
            <ArrowUp className="w-3 h-3" />
          </button>
        </div>
      </div>
    </footer>
  );
};
