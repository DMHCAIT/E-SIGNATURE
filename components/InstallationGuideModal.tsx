'use client';

import React, { useState } from 'react';
import { X, Mail, Laptop, Smartphone, CheckCircle } from 'lucide-react';

interface InstallationGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallationGuideModal: React.FC<InstallationGuideModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'gmail' | 'outlook' | 'apple'>('gmail');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#062B67] border-b border-blue-900/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-300" />
            <h3 className="font-bold text-lg text-white tracking-wide">
              How to Install Signature in Your Email Client
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6">
          <button
            type="button"
            onClick={() => setActiveTab('gmail')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'gmail'
                ? 'border-red-500 text-red-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Mail className="w-4 h-4 text-red-500" />
            <span>Gmail (Web & App)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('outlook')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'outlook'
                ? 'border-blue-500 text-blue-400 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Laptop className="w-4 h-4 text-blue-500" />
            <span>Outlook (Web & Desktop)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('apple')}
            className={`py-3 px-4 text-xs font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'apple'
                ? 'border-slate-300 text-slate-200 bg-slate-900/50'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-4 h-4 text-slate-300" />
            <span>Apple Mail (Mac & iOS)</span>
          </button>
        </div>

        {/* Instructions Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-300">
          {activeTab === 'gmail' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-950/30 border border-red-500/20 rounded-lg text-red-200 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-red-400" />
                <span>Gmail Setup Instructions</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 pl-2 text-slate-200 font-medium">
                <li>Click <strong>Copy Signature</strong> in this generator tool.</li>
                <li>Open <strong>Gmail</strong> on your browser.</li>
                <li>Click the ⚙ <strong>Settings Gear icon</strong> (top right) → <strong>See all settings</strong>.</li>
                <li>Scroll down to the <strong>Signature</strong> section in the General tab.</li>
                <li>Click <strong>+ Create new</strong>, enter a name (e.g. DMHCA Official).</li>
                <li>Click inside the signature edit box and press <strong>Ctrl+V</strong> (or <strong>Cmd+V</strong> on Mac).</li>
                <li>Under <strong>Signature defaults</strong>, select your new signature for new emails and replies.</li>
                <li>Scroll to the bottom and click <strong>Save Changes</strong>.</li>
              </ol>
            </div>
          )}

          {activeTab === 'outlook' && (
            <div className="space-y-3">
              <div className="p-3 bg-blue-950/30 border border-blue-500/20 rounded-lg text-blue-200 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span>Outlook (Web / Office 365 / Desktop)</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 pl-2 text-slate-200 font-medium">
                <li>Click <strong>Copy Signature</strong> in this generator tool.</li>
                <li>In Outlook, go to <strong>Settings</strong> (or <strong>File &gt; Options &gt; Mail &gt; Signatures</strong>).</li>
                <li>Click <strong>+ New signature</strong>.</li>
                <li>Paste the copied signature into the signature edit window using <strong>Ctrl+V</strong>.</li>
                <li>Set as default for new messages and click <strong>Save</strong>.</li>
              </ol>
            </div>
          )}

          {activeTab === 'apple' && (
            <div className="space-y-3">
              <div className="p-3 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-200 flex items-center gap-2 font-semibold">
                <CheckCircle className="w-4 h-4 text-slate-300" />
                <span>Apple Mail Instructions</span>
              </div>
              <ol className="list-decimal list-inside space-y-2 pl-2 text-slate-200 font-medium">
                <li>Click <strong>Copy Signature</strong> in this generator tool.</li>
                <li>Open <strong>Mail</strong> app &gt; <strong>Settings...</strong> &gt; <strong>Signatures</strong>.</li>
                <li>Add a new signature with <strong>+</strong>.</li>
                <li>Uncheck <em>"Always match my default message font"</em>.</li>
                <li>Paste the signature into the text box with <strong>Cmd+V</strong>.</li>
              </ol>
            </div>
          )}
        </div>

        {/* Footer Close Button */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs transition-colors"
          >
            Got it, close
          </button>
        </div>
      </div>
    </div>
  );
};
