'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { SignatureGenerator } from '@/components/SignatureGenerator';
import { InstallationGuideModal } from '@/components/InstallationGuideModal';

export default function Home() {
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 relative">
      {/* Sticky Top Header */}
      <Header onOpenGuide={() => setIsGuideOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-1 pb-12">
        <SignatureGenerator onOpenGuide={() => setIsGuideOpen(true)} />
      </main>

      {/* App Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 3xl:py-8 text-xs 3xl:text-sm text-slate-500 mt-auto">
        <div className="max-w-[1440px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 3xl:px-12 4xl:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} DMHCA - Unit of New Delhi Medical Healthcare Pvt Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-slate-400 flex-wrap justify-center">
            <button
              type="button"
              onClick={() => setIsGuideOpen(true)}
              className="hover:text-white transition-colors underline font-medium"
            >
              Setup Guide
            </button>
          </div>
        </div>
      </footer>

      {/* Setup Guide Modal Dialog */}
      <InstallationGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
};
