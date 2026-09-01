'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, Info, HelpCircle, CheckCircle2, X } from 'lucide-react';

export interface ModalConfig {
  isOpen: boolean;
  type?: 'confirm' | 'alert';
  variant?: 'danger' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface CustomModalProps {
  config: ModalConfig;
  onClose: () => void;
}

export const CustomModal: React.FC<CustomModalProps> = ({ config, onClose }) => {
  const {
    isOpen,
    type = 'alert',
    variant = 'info',
    title,
    message,
    confirmText = type === 'confirm' ? 'Confirm' : 'OK',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
  } = config;

  // Listen to Escape key press to dismiss modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        if (onCancel) onCancel();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  const renderIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-amber-400" />;
      case 'success':
        return <CheckCircle2 className="w-6 h-6 text-emerald-400" />;
      case 'info':
      default:
        return type === 'confirm' ? (
          <HelpCircle className="w-6 h-6 text-blue-400" />
        ) : (
          <Info className="w-6 h-6 text-blue-400" />
        );
    }
  };

  const renderIconBg = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-500/10 border-red-500/20';
      case 'warning':
        return 'bg-amber-500/10 border-amber-500/20';
      case 'success':
        return 'bg-emerald-500/10 border-emerald-500/20';
      case 'info':
      default:
        return 'bg-blue-500/10 border-blue-500/20';
    }
  };

  const renderConfirmButtonClass = () => {
    switch (variant) {
      case 'danger':
        return 'bg-red-600 hover:bg-red-500 shadow-red-950/40 text-white';
      case 'warning':
        return 'bg-amber-600 hover:bg-amber-500 shadow-amber-950/40 text-white';
      case 'success':
        return 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-950/40 text-white';
      case 'info':
      default:
        return 'bg-gradient-to-r from-[#062B67] to-[#D31016] hover:brightness-110 shadow-blue-950/40 text-white';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0"
        onClick={type === 'alert' ? handleConfirm : handleCancel}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl space-y-5 animate-scaleUp z-10">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleCancel}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border ${renderIconBg()}`}>
            {renderIcon()}
          </div>

          <div className="space-y-1 pr-4">
            <h3 className="font-bold text-lg text-white tracking-wide">{title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{message}</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          {type === 'confirm' && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl border border-slate-700 transition-all"
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={handleConfirm}
            className={`px-5 py-2 text-xs font-bold rounded-xl shadow-lg transition-all ${renderConfirmButtonClass()}`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
