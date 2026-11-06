'use client';

import React, { useState } from 'react';
import { Copy, Download, Code, Check, Image as ImageIcon, Loader2 } from 'lucide-react';
import {
  copyRichHtmlSignatureToClipboard,
  copyTextToClipboard,
  downloadHtmlFile,
  downloadSignatureImagePng,
} from '@/lib/clipboard';
import { CustomModal, ModalConfig } from './CustomModal';

interface CopyButtonProps {
  htmlContent: string;
  plainText: string;
  employeeName: string;
  companyName?: string;
  customWidth?: number;
  customHeight?: number;
}

export const CopyButton: React.FC<CopyButtonProps> = ({
  htmlContent,
  plainText,
  employeeName,
  companyName = 'DMHCA',
  customWidth = 600,
  customHeight = 200,
}) => {
  const [copiedRich, setCopiedRich] = useState(false);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
  });

  const safeName = (employeeName || 'employee')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  const safeCompanyName = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  const handleCopyRich = async () => {
    const success = await copyRichHtmlSignatureToClipboard(htmlContent, plainText);
    if (success) {
      setCopiedRich(true);
      setTimeout(() => setCopiedRich(false), 3500);
    } else {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        variant: 'warning',
        title: 'Clipboard Action Notice',
        message: 'Could not copy the rendered signature automatically due to browser permission settings. You can download the signature image, HTML file, or copy raw HTML code instead.',
        confirmText: 'Got It',
      });
    }
  };

  const handleCopyRaw = async () => {
    const success = await copyTextToClipboard(htmlContent);
    if (success) {
      setCopiedRaw(true);
      setTimeout(() => setCopiedRaw(false), 3000);
    }
  };

  const handleDownloadHtml = () => {
    downloadHtmlFile(htmlContent, `${safeCompanyName}-signature-${safeName}.html`);
  };

  const handleDownloadImage = async () => {
    setIsGeneratingImage(true);
    try {
      const success = await downloadSignatureImagePng(
        htmlContent,
        customWidth,
        customHeight,
        `${safeCompanyName}-signature-${safeName}-${customWidth}x${customHeight}.png`
      );

      if (!success) {
        setModalConfig({
          isOpen: true,
          type: 'alert',
          variant: 'danger',
          title: 'Image Generation Failed',
          message: 'Could not render signature PNG image. Please try again or download the HTML file instead.',
          confirmText: 'Dismiss',
        });
      }
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Custom Modal Alert */}
      <CustomModal
        config={modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Main Copy Primary Action CTA */}
      <button
        type="button"
        onClick={handleCopyRich}
        className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 text-white ${
          copiedRich
            ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40 ring-2 ring-emerald-400'
            : 'bg-gradient-to-r from-[#062B67] via-blue-900 to-[#D31016] hover:brightness-110 shadow-blue-950/60 active:scale-[0.99]'
        }`}
      >
        {copiedRich ? (
          <>
            <Check className="w-5 h-5 text-white" />
            <span>Copied to Clipboard! Ready to paste into Gmail / Outlook</span>
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            <span>Copy Signature</span>
          </>
        )}
      </button>

      {/* Secondary CTAs Grid (Download PNG Image, Download HTML File, Copy Source Code) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* Download PNG Image CTA */}
        <button
          type="button"
          onClick={handleDownloadImage}
          disabled={isGeneratingImage}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          title={`Download crisp PNG image (${customWidth}px × ${customHeight}px)`}
        >
          {isGeneratingImage ? (
            <>
              <Loader2 className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Generating PNG...</span>
            </>
          ) : (
            <>
              <ImageIcon className="w-4 h-4 text-emerald-400" />
              <span>Download Image (PNG)</span>
            </>
          )}
        </button>

        {/* Download HTML File CTA */}
        <button
          type="button"
          onClick={handleDownloadHtml}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4 text-blue-400" />
          <span>Download HTML File</span>
        </button>

        {/* Copy Raw HTML Code CTA */}
        <button
          type="button"
          onClick={handleCopyRaw}
          className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-all flex items-center justify-center gap-2"
        >
          {copiedRaw ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-300">Raw HTML Copied!</span>
            </>
          ) : (
            <>
              <Code className="w-4 h-4 text-amber-400" />
              <span>Copy Raw HTML Code</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
