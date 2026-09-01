'use client';

import React from 'react';
import { ShieldCheck, HelpCircle } from 'lucide-react';
import { DMHCA_TITLE_LOGO_BASE64 } from '@/lib/brand-logos';

interface HeaderProps {
  onOpenGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenGuide }) => {
  return (
    <header className="sticky top-0 z-40 bg-[#062B67]/95 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
      <div className="max-w-[1440px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 3xl:px-12 4xl:px-16 h-16 3xl:h-20 4xl:h-24 flex items-center justify-between transition-all">
        {/* Brand Left using Official titlelogo.webp */}
        <div className="flex items-center gap-3.5">
          <div className="p-1 rounded-xl bg-white/10 border border-white/15 shadow-md flex items-center justify-center overflow-hidden">
            <img
              src={DMHCA_TITLE_LOGO_BASE64}
              alt="DMHCA Logo"
              className="h-9 3xl:h-11 4xl:h-14 w-auto object-contain filter brightness-0 invert"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg 3xl:text-xl 4xl:text-2xl tracking-wide text-white font-sans">DMHCA</span>
              <span className="text-[10px] 3xl:text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-200 border border-red-400/30 font-medium">
                Official Signature Generator
              </span>
            </div>
            <p className="text-[11px] 3xl:text-xs 4xl:text-sm text-blue-200/80 font-medium hidden sm:block">
              Unit of New Delhi Medical Healthcare Pvt Ltd
            </p>
          </div>
        </div>

        {/* Badges & Actions Right */}
        <div className="flex items-center gap-3.5">
          <button
            type="button"
            onClick={onOpenGuide}
            className="flex items-center gap-2 text-xs 3xl:text-sm font-semibold px-3.5 py-2 3xl:py-2.5 rounded-lg bg-white/10 hover:bg-white/20 transition-all text-white border border-white/15 active:scale-95"
          >
            <HelpCircle className="w-4 h-4 3xl:w-5 3xl:h-5 text-amber-300" />
            <span className="hidden sm:inline">Setup Instructions</span>
          </button>
        </div>
      </div>
    </header>
  );
};
