'use client';

import React from 'react';
import { ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';
import { EmployeeSignature } from '@/types/signature';
import { calculateQualityScore } from '@/lib/validation';

interface QualityCheckerProps {
  employee: EmployeeSignature;
}

export const QualityChecker: React.FC<QualityCheckerProps> = ({ employee }) => {
  const quality = calculateQualityScore(employee);

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-950/40';
    if (score >= 70) return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
    return 'text-red-400 border-red-500/40 bg-red-950/40';
  };

  return (
    <div className="bg-slate-900/60 p-4.5 rounded-2xl border border-slate-800 shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Signature Quality & Readiness
          </h4>
        </div>
        <div className={`px-2.5 py-0.5 rounded-full border text-xs font-extrabold ${getScoreColor(quality.score)}`}>
          {quality.score}% Ready
        </div>
      </div>

      {/* Clean list with hidden scrollbar */}
      <div className="space-y-2 text-xs [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden overflow-y-auto max-h-56 pr-0.5">
        {quality.checks.map((chk, index) => (
          <div key={index} className="flex items-center justify-between py-1 border-b border-slate-800/60 last:border-0">
            <div className="flex items-center gap-2">
              {chk.passed ? (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              )}
              <span className={chk.passed ? 'text-slate-300 font-medium' : 'text-slate-400'}>
                {chk.label}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 hidden sm:inline">{chk.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
