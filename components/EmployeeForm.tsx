'use client';

import React from 'react';
import { User, Briefcase, Phone, Mail, Globe, MapPin, AlertTriangle } from 'lucide-react';
import { EmployeeSignature, ValidationWarning } from '@/types/signature';

interface EmployeeFormProps {
  employee: EmployeeSignature;
  onChange: (updated: Partial<EmployeeSignature>) => void;
  warnings: ValidationWarning[];
}

export const EmployeeForm: React.FC<EmployeeFormProps> = ({
  employee,
  onChange,
  warnings,
}) => {
  const getWarning = (field: keyof EmployeeSignature) =>
    warnings.find((w) => w.field === field);

  return (
    <div className="space-y-4">
      {/* Full Name */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-blue-400" />
            <span>Full Name *</span>
          </label>
          <span className="text-[10px] text-slate-500">{employee.fullName.length}/30</span>
        </div>
        <input
          type="text"
          value={employee.fullName}
          onChange={(e) => onChange({ fullName: e.target.value })}
          placeholder="e.g. Ravi Kanth"
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
        />
        {getWarning('fullName') && (
          <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>{getWarning('fullName')?.message}</span>
          </p>
        )}
      </div>

      {/* Designation */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-red-400" />
            <span>Designation / Role *</span>
          </label>
          <span className="text-[10px] text-slate-500">{employee.designation.length}/35</span>
        </div>
        <input
          type="text"
          value={employee.designation}
          onChange={(e) => onChange({ designation: e.target.value })}
          placeholder="e.g. Sales Team Lead"
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
        />
        {getWarning('designation') && (
          <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>{getWarning('designation')?.message}</span>
          </p>
        )}
      </div>

      {/* Phone & Email side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Phone */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-emerald-400" />
            <span>Phone Number *</span>
          </label>
          <input
            type="text"
            value={employee.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            placeholder="+91 92818 87047"
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
          />
          {getWarning('phone') && (
            <p className="mt-1 text-[11px] text-red-400">{getWarning('phone')?.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-red-400" />
            <span>Email Address *</span>
          </label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) => onChange({ email: e.target.value })}
            placeholder="ravikanth@dmhca.in"
            className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
          />
          {getWarning('email') && (
            <p className="mt-1 text-[11px] text-red-400">{getWarning('email')?.message}</p>
          )}
        </div>
      </div>

      {/* Website */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span>Website URL *</span>
        </label>
        <input
          type="text"
          value={employee.website}
          onChange={(e) => onChange({ website: e.target.value })}
          placeholder="www.dmhca.in"
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium"
        />
        {getWarning('website') && (
          <p className="mt-1 text-[11px] text-red-400">{getWarning('website')?.message}</p>
        )}
      </div>

      {/* Office Address */}
      <div>
        <div className="flex justify-between items-center mb-1">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>Office Address *</span>
          </label>
          <span className="text-[10px] text-slate-500">{employee.address.length}/80</span>
        </div>
        <textarea
          rows={2}
          value={employee.address}
          onChange={(e) => onChange({ address: e.target.value })}
          placeholder="Green Valley, Banjara Hills, Hyderabad, India"
          className="w-full px-3 py-2 bg-slate-900/90 border border-slate-700/80 rounded-lg text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 font-medium resize-none"
        />
        {getWarning('address') && (
          <p className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3 flex-shrink-0" />
            <span>{getWarning('address')?.message}</span>
          </p>
        )}
      </div>
    </div>
  );
};
