export interface EmployeeSignature {
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  photoUrl: string; // Base64 data URI or image URL
  mapsUrl?: string; // Optional Google Maps link
}

export interface SignatureDimensions {
  width: number;  // Range 300px - 600px
  height: number; // Range 100px - 250px
}

export type SignatureTemplate = 'classic' | 'modern' | 'executive' | 'compact' | 'creative' | 'luxe';

export interface SocialLinks {
  linkedin: string;
  instagram: string;
  facebook: string;
  youtube: string;
}

export interface FooterFeature {
  id: string;
  title: string;
  subtitle: string;
  iconSvg: string; // SVG code or Base64 URI
}

export interface FooterConfig {
  heading: string;
  description: string;
  features: FooterFeature[];
}

export interface BrandConfig {
  companyName: string;
  companySubtext: string;
  logoSvg: string; // Clean vector SVG or data URL
  logoPngBase64: string; // High-res PNG data URI for maximum email client compatibility
  primaryColor: string; // DMHCA Navy Blue (#062B67)
  secondaryColor: string; // DMHCA Red (#D31016)
  accentColor: string; // Bright Blue (#1D4ED8)
  website: string;
  socialLinks: SocialLinks;
  socialIconsBase64: {
    linkedin: string;
    instagram: string;
    facebook: string;
    youtube: string;
  };
  contactIconsBase64: {
    phone: string;
    email: string;
    website: string;
    location: string;
  };
  footer: FooterConfig;
}

export interface TemplateDefinition {
  id: SignatureTemplate;
  name: string;
  description: string;
  recommendedFor: string;
  thumbnailBadge: string;
}

export interface ValidationWarning {
  field: keyof EmployeeSignature;
  message: string;
  type: 'warning' | 'error';
}

export interface QualityScore {
  score: number; // 0-100
  checks: {
    label: string;
    passed: boolean;
    importance: 'high' | 'medium' | 'low';
    message: string;
  }[];
}
