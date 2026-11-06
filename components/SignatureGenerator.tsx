'use client';

import React, { startTransition, useState, useEffect } from 'react';
import { RefreshCw, Trash2, Sparkles } from 'lucide-react';
import { EmployeeSignature, SignatureCompany, SignatureTemplate } from '@/types/signature';
import { DEFAULT_EMPLOYEE_DATA, DEFAULT_IBMP_EMPLOYEE_DATA, DEFAULT_SAMPLE_PHOTO } from '@/lib/sample-data';
import { BRAND_CONFIGS } from '@/config/brand';
import { generatePlainTextSignature, generateSignatureHTML } from '@/lib/signature-generator';
import { validateEmployeeData } from '@/lib/validation';
import { EmployeeForm } from './EmployeeForm';
import { PhotoUploader } from './PhotoUploader';
import { TemplateSelector } from './TemplateSelector';
import { SignaturePreview } from './SignaturePreview';
import { CopyButton } from './CopyButton';
import { QualityChecker } from './QualityChecker';
import { CustomModal, ModalConfig } from './CustomModal';

const STORAGE_KEY = 'dmhca_signature_form_data_v1';

interface SignatureGeneratorProps {
  onOpenGuide: () => void;
}

export const SignatureGenerator: React.FC<SignatureGeneratorProps> = ({ onOpenGuide }) => {
  const [employee, setEmployee] = useState<EmployeeSignature>(DEFAULT_EMPLOYEE_DATA);
  const [company, setCompany] = useState<SignatureCompany>('dmhca');
  const [template, setTemplate] = useState<SignatureTemplate>('classic');
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'details' | 'photo' | 'template'>('details');

  // Dynamic Custom Dimension States (Width 300-600px, Height 100-250px)
  const [customWidth, setCustomWidth] = useState<number>(600);
  const [customHeight, setCustomHeight] = useState<number>(200);

  // Custom Site-Themed Dialog Modal State
  const [modalConfig, setModalConfig] = useState<ModalConfig>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const savedCompany = parsed.company === 'ibmp' ? 'ibmp' : 'dmhca';
        const savedEmployee = parsed.employee || DEFAULT_EMPLOYEE_DATA;
        const legacyIbmpDefaults =
          savedCompany === 'ibmp' &&
          savedEmployee.fullName === DEFAULT_EMPLOYEE_DATA.fullName &&
          savedEmployee.designation === DEFAULT_EMPLOYEE_DATA.designation &&
          savedEmployee.phone === DEFAULT_EMPLOYEE_DATA.phone &&
          savedEmployee.email === DEFAULT_EMPLOYEE_DATA.email &&
          savedEmployee.website === DEFAULT_EMPLOYEE_DATA.website &&
          savedEmployee.address === DEFAULT_EMPLOYEE_DATA.address;

        startTransition(() => {
          setEmployee(legacyIbmpDefaults ? DEFAULT_IBMP_EMPLOYEE_DATA : savedEmployee);
          setCompany(savedCompany);
          setTemplate(parsed.template || 'classic');
          if (parsed.customWidth) setCustomWidth(parsed.customWidth);
          if (parsed.customHeight) setCustomHeight(parsed.customHeight);
        });
      }
    } catch (e) {
      console.warn('Could not read from localStorage:', e);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ employee, company, template, customWidth, customHeight }));
    } catch (e) {
      // Handle quota exceeded gracefully
    }
  }, [employee, company, template, customWidth, customHeight]);

  const handleUpdateEmployee = (updated: Partial<EmployeeSignature>) => {
    setEmployee((prev) => ({ ...prev, ...updated }));
  };

  const handleCompanyChange = (nextCompany: SignatureCompany) => {
    if (nextCompany === company) return;

    const currentDefaults = company === 'ibmp' ? DEFAULT_IBMP_EMPLOYEE_DATA : DEFAULT_EMPLOYEE_DATA;
    const nextDefaults = nextCompany === 'ibmp' ? DEFAULT_IBMP_EMPLOYEE_DATA : DEFAULT_EMPLOYEE_DATA;
    setEmployee((current) => ({
      ...current,
      fullName: current.fullName === currentDefaults.fullName ? nextDefaults.fullName : current.fullName,
      designation: current.designation === currentDefaults.designation ? nextDefaults.designation : current.designation,
      phone: current.phone === currentDefaults.phone ? nextDefaults.phone : current.phone,
      email: current.email === currentDefaults.email ? nextDefaults.email : current.email,
      website: current.website === currentDefaults.website ? nextDefaults.website : current.website,
      address: current.address === currentDefaults.address ? nextDefaults.address : current.address,
      photoUrl: current.photoUrl === currentDefaults.photoUrl ? nextDefaults.photoUrl : current.photoUrl,
      mapsUrl: current.mapsUrl === currentDefaults.mapsUrl ? nextDefaults.mapsUrl : current.mapsUrl,
    }));
    setCompany(nextCompany);
  };

  const handleResetForm = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      variant: 'warning',
      title: 'Reset Signature Form?',
      message: 'Are you sure you want to reset all employee details, photo, and layout options back to default sample data?',
      confirmText: 'Reset Form',
      cancelText: 'Cancel',
      onConfirm: () => {
        setEmployee(DEFAULT_EMPLOYEE_DATA);
        setCompany('dmhca');
        setTemplate('classic');
        setCustomWidth(600);
        setCustomHeight(200);
      },
    });
  };

  const handleClearSaved = () => {
    setModalConfig({
      isOpen: true,
      type: 'confirm',
      variant: 'danger',
      title: 'Clear Saved Local Data?',
      message: 'Are you sure you want to clear your saved signature data from local browser storage? This cannot be undone.',
      confirmText: 'Clear Data',
      cancelText: 'Cancel',
      onConfirm: () => {
        try {
          localStorage.removeItem(STORAGE_KEY);
          setEmployee(DEFAULT_EMPLOYEE_DATA);
          setCompany('dmhca');
          setTemplate('classic');
          setCustomWidth(600);
          setCustomHeight(200);
        } catch (e) {
          // ignore
        }
      },
    });
  };

  // Generate live signature HTML with dynamic custom dimensions & warnings
  const brand = BRAND_CONFIGS[company];
  const htmlContent = generateSignatureHTML(employee, template, brand, {
    width: customWidth,
    height: customHeight,
  });
  const plainText = generatePlainTextSignature(employee, brand);
  const warnings = validateEmployeeData(employee);

  return (
    <div className="max-w-[1440px] 2xl:max-w-[1720px] 3xl:max-w-[2200px] 4xl:max-w-[3200px] mx-auto px-4 sm:px-6 lg:px-8 3xl:px-12 4xl:px-16 py-4 sm:py-6 3xl:py-10 space-y-6 sm:space-y-8 pb-16 transition-all">
      {/* Site-Themed Custom Modal */}
      <CustomModal
        config={modalConfig}
        onClose={() => setModalConfig((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Grid Layout: Render Preview FIRST on Mobile (Top of Page), and Right Column on Desktop */}
      <div className="flex flex-col lg:grid lg:grid-cols-12 gap-6 2xl:gap-8 3xl:gap-10 4xl:gap-14 items-start">
        
        {/* Preview & Actions Panel (Rendered FIRST on Mobile/Tablet, 7 Columns Right on Desktop) */}
        <div className="w-full lg:col-span-7 lg:order-2 space-y-6">
          {/* Main Interactive Signature Canvas Preview with Custom Dimension Sliders */}
          <SignaturePreview
            htmlContent={htmlContent}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            customWidth={customWidth}
            customHeight={customHeight}
            onWidthChange={setCustomWidth}
            onHeightChange={setCustomHeight}
          />

          {/* Copy / Download Action CTAs */}
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-5 3xl:p-7 shadow-xl">
            <CopyButton
              htmlContent={htmlContent}
              plainText={plainText}
              employeeName={employee.fullName}
              companyName={brand.companyName}
              customWidth={customWidth}
              customHeight={customHeight}
            />
          </div>
        </div>

        {/* Form Controls Panel (Rendered SECOND on Mobile/Tablet, 5 Columns Left on Desktop) */}
        <div className="w-full lg:col-span-5 lg:order-1 space-y-6">
          <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-2xl p-4 sm:p-5 3xl:p-7 4xl:p-9 shadow-xl space-y-5">
            
            {/* Form Navigation Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 3xl:w-5 3xl:h-5 text-amber-400" />
                <h2 className="font-bold text-xs sm:text-sm 3xl:text-base 4xl:text-lg text-white tracking-wide uppercase">
                  Signature Customizer
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="px-2.5 py-1 3xl:px-3 3xl:py-1.5 text-[11px] 3xl:text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-all flex items-center gap-1"
                  title="Reset to default sample"
                >
                  <RefreshCw className="w-3 h-3 3xl:w-3.5 3xl:h-3.5" />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Company Signature
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(['dmhca', 'ibmp'] as const).map((companyOption) => {
                  const selected = company === companyOption;
                  const companyName = companyOption === 'dmhca' ? 'DMHCA' : 'IBMP';
                  return (
                    <button
                      key={companyOption}
                      type="button"
                      onClick={() => handleCompanyChange(companyOption)}
                      aria-pressed={selected}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold transition-colors ${
                        selected
                          ? 'border-blue-400 bg-[#062B67] text-white'
                          : 'border-slate-700 bg-slate-800/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {companyName}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Sub-tabs for Form Sections */}
            <div className="flex bg-slate-950 p-1 3xl:p-1.5 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`flex-1 py-1.5 3xl:py-2 px-2 text-xs 3xl:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'details'
                    ? 'bg-[#062B67] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Info
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('photo')}
                className={`flex-1 py-1.5 3xl:py-2 px-2 text-xs 3xl:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'photo'
                    ? 'bg-[#062B67] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Photo
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('template')}
                className={`flex-1 py-1.5 3xl:py-2 px-2 text-xs 3xl:text-sm font-semibold rounded-lg transition-all ${
                  activeTab === 'template'
                    ? 'bg-[#062B67] text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Design
              </button>
            </div>

            {/* Tab 1: Employee Form */}
            {activeTab === 'details' && (
              <EmployeeForm
                employee={employee}
                onChange={handleUpdateEmployee}
                warnings={warnings}
              />
            )}

            {/* Tab 2: Photo Uploader */}
            {activeTab === 'photo' && (
              <PhotoUploader
                photoUrl={employee.photoUrl}
                onPhotoChange={(url) => handleUpdateEmployee({ photoUrl: url })}
                onResetDefault={() => handleUpdateEmployee({ photoUrl: DEFAULT_SAMPLE_PHOTO })}
              />
            )}

            {/* Tab 3: Template Selector */}
            {activeTab === 'template' && (
              <TemplateSelector
                selectedTemplate={template}
                onSelect={(tpl) => setTemplate(tpl)}
                companyName={brand.companyName}
              />
            )}

            {/* Quick Next / Action Helper Footer */}
            <div className="pt-2 flex justify-between items-center border-t border-slate-800 text-[11px] 3xl:text-xs text-slate-400">
              <span>Auto-saved locally</span>
              <button
                type="button"
                onClick={handleClearSaved}
                className="text-slate-500 hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3 3xl:w-3.5 3xl:h-3.5" />
                <span>Clear Data</span>
              </button>
            </div>
          </div>

          {/* Quality Score Checker Widget */}
          <QualityChecker employee={employee} />
        </div>
      </div>
    </div>
  );
};
