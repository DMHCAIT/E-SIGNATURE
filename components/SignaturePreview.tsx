'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Monitor, Smartphone, ZoomIn, ZoomOut, RotateCcw, Sliders } from 'lucide-react';

interface SignaturePreviewProps {
  htmlContent: string;
  viewMode: 'desktop' | 'mobile';
  onViewModeChange: (mode: 'desktop' | 'mobile') => void;
  customWidth: number;
  customHeight: number;
  onWidthChange: (width: number) => void;
  onHeightChange: (height: number) => void;
}

export const SignaturePreview: React.FC<SignaturePreviewProps> = ({
  htmlContent,
  viewMode,
  onViewModeChange,
  customWidth,
  customHeight,
  onWidthChange,
  onHeightChange,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [autoScale, setAutoScale] = useState<number>(1);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 15, 150));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 15, 60));
  const handleResetZoom = () => setZoomLevel(100);

  const containerWidth = customWidth + 32;

  // Auto-calculate responsive fit scale factor for small screen mobile viewports
  useEffect(() => {
    const calculateResponsiveFit = () => {
      if (canvasWrapperRef.current) {
        const availableWidth = canvasWrapperRef.current.clientWidth - 24;
        const targetWidth = containerWidth;
        if (availableWidth > 0 && availableWidth < targetWidth) {
          setAutoScale(availableWidth / targetWidth);
        } else {
          setAutoScale(1);
        }
      }
    };

    calculateResponsiveFit();
    window.addEventListener('resize', calculateResponsiveFit);
    return () => window.removeEventListener('resize', calculateResponsiveFit);
  }, [containerWidth, viewMode]);

  return (
    <div className="flex flex-col h-full bg-slate-950/80 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
      {/* Top Preview Controls Header Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-3.5 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Viewport Switcher (Desktop / Mobile 375px) */}
        <div className="flex items-center justify-between sm:justify-start gap-2">
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onViewModeChange('desktop')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'desktop'
                  ? 'bg-[#062B67] text-white shadow-sm border border-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Desktop</span>
            </button>

            <button
              type="button"
              onClick={() => onViewModeChange('mobile')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-[#062B67] text-white shadow-sm border border-blue-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          <span className="text-[11px] text-slate-400 sm:hidden">Zoom:</span>
          <div className="flex items-center bg-slate-950 rounded-xl p-1 border border-slate-800">
            <button
              type="button"
              onClick={handleZoomOut}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-200 min-w-[40px] text-center font-bold">
              {zoomLevel}%
            </span>
            <button
              type="button"
              onClick={handleZoomIn}
              className="p-1.5 text-slate-400 hover:text-white transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white transition-colors border-l border-slate-800 ml-0.5"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Modern High-End Dimension Sliders & Presets Control Strip */}
      <div className="bg-slate-900/80 border-b border-slate-800 px-3.5 sm:px-5 py-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs">
        {/* Sliders Group */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-5 flex-1">
          {/* Width Slider */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[180px] max-w-[260px]">
            <div className="flex items-center gap-1.5 min-w-[90px] shrink-0">
              <Sliders className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-slate-300 font-semibold text-xs">Width:</span>
              <span className="text-blue-400 font-mono font-bold text-xs">{customWidth}px</span>
            </div>
            <input
              type="range"
              min={300}
              max={600}
              step={10}
              value={customWidth}
              onChange={(e) => onWidthChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg border border-slate-700/60 hover:border-blue-500/50 transition-all"
            />
          </div>

          {/* Height Slider */}
          <div className="flex items-center gap-2.5 flex-1 min-w-[170px] max-w-[240px]">
            <div className="flex items-center gap-1.5 min-w-[85px] shrink-0">
              <span className="text-slate-300 font-semibold text-xs">Height:</span>
              <span className="text-blue-400 font-mono font-bold text-xs">{customHeight}px</span>
            </div>
            <input
              type="range"
              min={100}
              max={250}
              step={5}
              value={customHeight}
              onChange={(e) => onHeightChange(Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg border border-slate-700/60 hover:border-blue-500/50 transition-all"
            />
          </div>
        </div>

        {/* Quick Dimension Presets */}
        <div className="flex items-center gap-1.5 flex-nowrap overflow-x-auto no-scrollbar shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 sm:border-l border-slate-800/80 sm:pl-4">
          <span className="text-slate-400 text-xs font-semibold shrink-0 mr-1">Presets:</span>
          <button
            type="button"
            onClick={() => { onWidthChange(600); onHeightChange(200); }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all border whitespace-nowrap shrink-0 ${
              customWidth === 600 && customHeight === 200
                ? 'bg-blue-600 text-white border-blue-400/50 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            600×200
          </button>
          <button
            type="button"
            onClick={() => { onWidthChange(500); onHeightChange(180); }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all border whitespace-nowrap shrink-0 ${
              customWidth === 500 && customHeight === 180
                ? 'bg-blue-600 text-white border-blue-400/50 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            500×180
          </button>
          <button
            type="button"
            onClick={() => { onWidthChange(420); onHeightChange(230); }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all border whitespace-nowrap shrink-0 ${
              customWidth === 420 && customHeight === 230
                ? 'bg-blue-600 text-white border-blue-400/50 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            420×230
          </button>
          <button
            type="button"
            onClick={() => { onWidthChange(400); onHeightChange(150); }}
            className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all border whitespace-nowrap shrink-0 ${
              customWidth === 400 && customHeight === 150
                ? 'bg-blue-600 text-white border-blue-400/50 shadow-sm'
                : 'bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white'
            }`}
          >
            400×150
          </button>
        </div>
      </div>

      {/* Main Interactive Signature Canvas Area */}
      <div
        ref={canvasWrapperRef}
        className="flex-1 p-3 sm:p-6 overflow-x-auto flex items-center justify-center bg-[#0B132B] min-h-[380px] sm:min-h-[440px]"
      >
        {viewMode === 'desktop' ? (
          /* Desktop Frame (Custom Dimensions Zoomed & Scaled to Fit Screen) */
          <div className="w-full flex justify-center items-center py-2 animate-fadeIn overflow-hidden">
            <div
              style={{
                zoom: (zoomLevel / 100) * autoScale,
                width: `${containerWidth}px`,
                margin: '0 auto',
              }}
              className="bg-white rounded-xl p-3 sm:p-4 shadow-2xl border border-slate-200/80 select-text transition-all max-w-full"
            >
              <div className="text-[10px] font-mono text-slate-400 mb-2 border-b pb-1.5 flex justify-between items-center">
                <span className="font-semibold text-slate-600 truncate mr-2">
                  Gmail / Outlook Web Mail Preview
                </span>
                <span className="text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  {customWidth}px × {customHeight}px Canvas
                </span>
              </div>

              {/* Render Signature HTML Container */}
              <div
                style={{
                  width: `${customWidth}px`,
                  margin: '0 auto',
                }}
                className="select-text"
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            </div>
          </div>
        ) : (
          /* Mobile Viewport Simulation (375px) */
          <div className="flex flex-col items-center animate-fadeIn py-2 max-w-full">
            <div className="text-xs text-slate-300 mb-2 flex items-center gap-2 text-center">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-[11px] sm:text-xs">
                Scaled Mobile Canvas (375px Viewport) — {customWidth}px Canvas
              </span>
            </div>

            {/* Mobile Device Frame */}
            <div className="w-full max-w-[395px] bg-slate-900 p-2.5 sm:p-3 rounded-[32px] sm:rounded-[36px] border-4 border-slate-700 shadow-2xl">
              <div className="w-16 sm:w-20 h-3.5 sm:h-4 bg-slate-800 rounded-full mx-auto mb-2.5"></div>

              <div className="w-full bg-white rounded-2xl p-2.5 min-h-[340px] overflow-y-auto max-h-[560px]">
                <div className="text-[9px] font-mono text-slate-400 border-b pb-1 mb-2.5 flex justify-between">
                  <span>iPhone / Android Email App</span>
                  <span className="text-blue-600 font-bold">
                    Scaled {Math.round((351 / customWidth) * 100)}%
                  </span>
                </div>

                {/* Proportional Scaling Container */}
                <div className="w-full flex justify-center py-1 overflow-hidden">
                  <div
                    style={{
                      zoom: (351 / customWidth) * (zoomLevel / 100) * autoScale,
                      width: `${customWidth}px`,
                    }}
                    className="select-text"
                    dangerouslySetInnerHTML={{ __html: htmlContent }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
