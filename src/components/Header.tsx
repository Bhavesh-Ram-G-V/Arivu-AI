import React from 'react';
import { RotateCcw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-[#f0e6e1] bg-[#fff8f5]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-8 px-5 py-4 sm:px-8">
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            onReset();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-xl font-bold tracking-tight text-[#1f1b18] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 rounded-lg px-1"
        >
          அறிவு AI · Arivu AI
        </a>

        <nav className="hidden md:flex items-center gap-7 text-base font-semibold text-[#58423c]">
          <a
            href="#finder"
            className="hover:text-[#a43716] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            வழிகாட்டி · Guide
          </a>
          <a
            href="#offices"
            className="hover:text-[#a43716] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            அலுவலகங்கள் · Offices
          </a>
          <a
            href="#helplines"
            className="hover:text-[#a43716] transition-colors whitespace-nowrap shrink-0 py-2"
          >
            உதவி எண்கள் · Helplines
          </a>
        </nav>

        <div className="flex items-center shrink-0">
          {showReset ? (
            <button
              type="button"
              onClick={onReset}
              className="tactile-push inline-flex min-h-[46px] items-center gap-2 rounded-full bg-[#2b8282] px-5 py-2.5 text-base font-bold text-white hover:bg-[#006a6a] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="h-5 w-5 shrink-0" aria-hidden="true" />
              <span>புதிய தேடல்</span>
            </button>
          ) : (
            <a
              href="#offices"
              className="tactile-push inline-flex min-h-[46px] items-center rounded-full bg-[#f5ebe1] px-5 py-2.5 text-base font-bold text-[#1f1b18] hover:bg-[#eae1dc] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#2b8282]/40 whitespace-nowrap shrink-0"
            >
              அரசு மையங்கள்
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
