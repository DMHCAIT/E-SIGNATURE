'use client';

import React from 'react';
import { CheckCircle2, LayoutTemplate } from 'lucide-react';
import { TEMPLATE_DEFINITIONS } from '@/config/brand';
import { SignatureTemplate } from '@/types/signature';

interface TemplateSelectorProps {
  selectedTemplate: SignatureTemplate;
  onSelect: (template: SignatureTemplate) => void;
}

export const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelect,
}) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-blue-400" />
          <span>Select Signature Template</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {TEMPLATE_DEFINITIONS.map((tpl) => {
          const isSelected = selectedTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl.id)}
              className={`relative text-left p-3 rounded-xl border transition-all flex flex-col justify-between ${isSelected
                ? 'bg-gradient-to-br from-[#062B67]/90 to-blue-900/60 border-blue-400 shadow-lg shadow-blue-950/40 ring-1 ring-blue-400/50'
                : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 text-slate-300'
                }`}
            >
              {/* Badge Top Right */}
              <div className="flex items-center justify-between w-full mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${isSelected
                  ? 'bg-red-500 text-white shadow-sm'
                  : 'bg-slate-700 text-slate-300'
                  }`}>
                  {tpl.thumbnailBadge}
                </span>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-bold text-xs text-white tracking-wide">{tpl.name}</h4>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{tpl.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
