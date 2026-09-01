'use client';

import React, { useRef, useState } from 'react';
import { Upload, Camera, RefreshCw, Link as LinkIcon, CheckCircle2 } from 'lucide-react';
import { cropImageToSquareDataUrl } from '@/lib/image-utils';
import { CustomModal, ModalConfig } from './CustomModal';

interface PhotoUploaderProps {
  photoUrl: string;
  onPhotoChange: (url: string) => void;
  onResetDefault: () => void;
}

// Preset avatars Base64 encoded as 240x240 PNG Data URIs
const PRESET_MALE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAADwCAYAAAA+Vvi8AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA_PRESET_MALE_PLACEHOLDER';

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  photoUrl,
  onPhotoChange,
  onResetDefault,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [customUrl, setCustomUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
  });

  const processFile = async (file: File) => {
    try {
      setIsProcessing(true);
      const croppedBase64 = await cropImageToSquareDataUrl(file, 240);
      onPhotoChange(croppedBase64);
    } catch (err) {
      setModalConfig({
        isOpen: true,
        type: 'alert',
        variant: 'danger',
        title: 'Image Upload Error',
        message: 'Could not process the selected image. Please upload a valid JPG, PNG, or WebP photo file.',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customUrl.trim()) {
      onPhotoChange(customUrl.trim());
      setShowUrlInput(false);
      setCustomUrl('');
    }
  };

  return (
    <div className="space-y-4">
      {/* Custom Alert Modal */}
      <CustomModal
        config={modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Title Header */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-4 h-4 text-blue-400" />
          <span>Profile Photo / Avatar</span>
        </label>
        <span className="text-[11px] text-slate-400">1:1 Square Ratio</span>
      </div>

      {/* Photo Preview & Main Actions */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
        {/* Avatar Display */}
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500/60 shadow-lg bg-slate-900 flex items-center justify-center">
            {photoUrl ? (
              <img
                src={photoUrl}
                alt="Profile Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-slate-500" />
            )}
          </div>
          {isProcessing && (
            <div className="absolute inset-0 bg-slate-950/80 rounded-full flex items-center justify-center">
              <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-2.5 w-full">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-blue-400 bg-blue-500/10'
                : 'border-slate-700 hover:border-slate-500 bg-slate-900/50'
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-200">
              <Upload className="w-4 h-4 text-blue-400" />
              <span>Upload Photo (Auto-Crop)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP up to 5MB</p>
          </div>

          <div className="flex items-center justify-between gap-2 text-xs">
            <button
              type="button"
              onClick={() => setShowUrlInput(!showUrlInput)}
              className="text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <LinkIcon className="w-3 h-3" />
              <span>{showUrlInput ? 'Hide URL Input' : 'Use Image URL'}</span>
            </button>

            <button
              type="button"
              onClick={onResetDefault}
              className="text-slate-400 hover:text-amber-400 transition-colors flex items-center gap-1 text-[11px]"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Default Avatar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Image URL Form */}
      {showUrlInput && (
        <form onSubmit={handleUrlSubmit} className="flex gap-2 animate-fadeIn">
          <input
            type="url"
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Apply
          </button>
        </form>
      )}
    </div>
  );
};
