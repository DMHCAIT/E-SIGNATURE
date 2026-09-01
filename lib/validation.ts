import { EmployeeSignature, QualityScore, ValidationWarning } from '@/types/signature';

export function validateEmployeeData(data: EmployeeSignature): ValidationWarning[] {
  const warnings: ValidationWarning[] = [];

  // Required checks
  if (!data.fullName.trim()) {
    warnings.push({ field: 'fullName', message: 'Full name is required.', type: 'error' });
  } else if (data.fullName.length > 28) {
    warnings.push({
      field: 'fullName',
      message: '⚠ Name is long. It will auto-scale text size to maintain fixed canvas.',
      type: 'warning',
    });
  }

  if (!data.designation.trim()) {
    warnings.push({ field: 'designation', message: 'Designation is required.', type: 'error' });
  } else if (data.designation.length > 32) {
    warnings.push({
      field: 'designation',
      message: '⚠ Designation exceeds recommended length.',
      type: 'warning',
    });
  }

  if (!data.phone.trim()) {
    warnings.push({ field: 'phone', message: 'Phone number is required.', type: 'error' });
  }

  if (!data.email.trim()) {
    warnings.push({ field: 'email', message: 'Email address is required.', type: 'error' });
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
    warnings.push({ field: 'email', message: 'Please enter a valid email address.', type: 'error' });
  }

  if (!data.website.trim()) {
    warnings.push({ field: 'website', message: 'Website URL is required.', type: 'error' });
  }

  if (!data.address.trim()) {
    warnings.push({ field: 'address', message: 'Office address is required.', type: 'error' });
  } else if (data.address.length > 70) {
    warnings.push({
      field: 'address',
      message: '⚠ Address exceeds recommended length for signature height.',
      type: 'warning',
    });
  }

  if (!data.photoUrl) {
    warnings.push({ field: 'photoUrl', message: 'Profile photo is required.', type: 'error' });
  }

  return warnings;
}

export function calculateQualityScore(data: EmployeeSignature): QualityScore {
  const checks = [
    {
      label: 'Full Name Provided',
      passed: Boolean(data.fullName.trim()),
      importance: 'high' as const,
      message: 'Name is prominently displayed in DMHCA brand blue font.',
    },
    {
      label: 'Designation Specified',
      passed: Boolean(data.designation.trim()),
      importance: 'high' as const,
      message: 'Designation establishes official role authority.',
    },
    {
      label: 'Valid Email Address',
      passed: Boolean(data.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())),
      importance: 'high' as const,
      message: 'Clickable mailto link generated.',
    },
    {
      label: 'Phone Number Provided',
      passed: Boolean(data.phone.trim()),
      importance: 'high' as const,
      message: 'Clickable tel link generated.',
    },
    {
      label: 'Profile Photo Attached',
      passed: Boolean(data.photoUrl),
      importance: 'high' as const,
      message: '120px circular photo included with crisp border.',
    },
    {
      label: 'Website Specified',
      passed: Boolean(data.website.trim()),
      importance: 'medium' as const,
      message: 'Direct link to DMHCA web portal included.',
    },
    {
      label: 'Office Location Specified',
      passed: Boolean(data.address.trim()),
      importance: 'medium' as const,
      message: 'Physical office presence documented.',
    },
    {
      label: 'Text Length Optimization',
      passed: data.fullName.length <= 28 && data.address.length <= 70,
      importance: 'medium' as const,
      message: 'Content fits optimal font sizing parameters.',
    },
    {
      label: 'Email Client Safe Markup',
      passed: true,
      importance: 'high' as const,
      message: 'Generated using HTML tables with inline CSS.',
    },
  ];

  const totalChecks = checks.length;
  const passedChecks = checks.filter((c) => c.passed).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  return { score, checks };
}
