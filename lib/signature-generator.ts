import { DEFAULT_BRAND_CONFIG } from '@/config/brand';
import { encodeSvgToBase64DataUrl } from '@/lib/svg-utils';
import { BrandConfig, EmployeeSignature, SignatureTemplate } from '@/types/signature';

function escapeHtml(str: string): string {
  return (str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function cleanPhoneUrl(phone: string): string {
  return phone.replace(/[^0-9+]/g, '');
}

function ensureUrl(url: string): string {
  const trimmed = url.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

/**
 * Clean up address lines to prevent double commas (,,) or trailing commas before separators.
 */
function formatAddressLines(rawAddress: string): string[] {
  return (rawAddress || '')
    .split('\n')
    .map((line) => escapeHtml(line.trim()).replace(/[,.\s]+$/, ''))
    .filter(Boolean);
}

export interface DimensionOptions {
  width?: number;  // 300 to 600
  height?: number; // 100 to 250
}

/**
 * TEMPLATE 01 — DMHCA Classic (With Full Subtitles Restored)
 */
function renderClassicTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  // Proportional Scaled Layout Dimensions
  const innerW = W - 36;
  const col1W = Math.max(70, Math.round(134 * scaleW));
  const col2W = Math.max(130, Math.round(256 * scaleW));
  const col3W = Math.max(90, innerW - col1W - col2W);

  const photoSize = Math.max(45, Math.round(110 * scale));
  const logoW = Math.max(65, Math.round(150 * scale));
  const socialIconSize = Math.max(16, Math.round(30 * scale));
  const contactIconSize = Math.max(12, Math.round(22 * scale));

  const nameFontSize = Math.max(12, Math.round(23 * scale));
  const titleFontSize = Math.max(9, Math.round(14 * scale));
  const contactFontSize = Math.max(8, Math.round(12 * scale));
  const footerHeadingSize = Math.max(10, Math.round(16 * scale));
  const footerDescSize = Math.max(7.5, Math.round(11 * scale));
  const featTitleSize = Math.max(7.5, Math.round(11 * scale));
  const featSubSize = Math.max(6.5, Math.round(9 * scale));

  const topPadY = Math.max(6, Math.round(22 * scaleH));
  const footerPadY = Math.max(6, Math.round(16 * scaleH));

  return `
<!-- DMHCA Email Signature - Template 01: Classic (${W}px x ${H}px) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; margin: 0 auto; table-layout: fixed;">
  <!-- Top Main Section -->
  <tr>
    <td width="${W}" style="width: ${W}px; padding: ${topPadY}px 18px ${Math.max(4, Math.round(topPadY * 0.8))}px 18px; background-color: #ffffff; vertical-align: middle;">
      <table width="${innerW}" cellpadding="0" cellspacing="0" border="0" style="width: ${innerW}px; border-collapse: collapse; table-layout: fixed;">
        <tr>
          <!-- Col 1: Circular Employee Photo -->
          <td width="${col1W}" style="width: ${col1W}px; vertical-align: middle; padding-right: 8px;">
            <table width="${col1W - 8}" cellpadding="0" cellspacing="0" border="0" style="width: ${col1W - 8}px;">
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  <img src="${photo}" alt="${name}" width="${photoSize}" height="${photoSize}" style="width: ${photoSize}px; height: ${photoSize}px; border-radius: 50%; border: 3px solid #062B67; object-fit: cover; display: block; margin: 0 auto;" />
                </td>
              </tr>
            </table>
          </td>

          <!-- Col 2: Employee Details & Contact Icons -->
          <td width="${col2W}" style="width: ${col2W}px; vertical-align: middle; padding-right: 8px;">
            <div style="font-size: ${nameFontSize}px; font-weight: 800; color: #062B67; line-height: 1.2; font-family: Arial, Helvetica, sans-serif; letter-spacing: -0.3px;">
              ${name}
            </div>
            <div style="font-size: ${titleFontSize}px; font-weight: 500; color: #4b5563; margin-top: 2px; font-family: Arial, Helvetica, sans-serif;">
              ${designation}
            </div>

            <!-- Horizontal Divider Accent -->
            <div style="border-bottom: 2px solid #062B67; width: 100%; margin-top: 4px; margin-bottom: 6px; font-size: 0; line-height: 0;">&nbsp;</div>

            <!-- Contact List Table -->
            <table width="${col2W}" cellpadding="0" cellspacing="0" border="0" style="width: ${col2W}px; font-size: ${contactFontSize}px; line-height: 1.3; table-layout: fixed;">
              <!-- Phone -->
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.phone}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Phone" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${phoneUrl}" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif; white-space: nowrap;">
                    ${phone}
                  </a>
                </td>
              </tr>
              <!-- Email -->
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.email}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Email" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${emailUrl}" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif; white-space: nowrap;">
                    ${email}
                  </a>
                </td>
              </tr>
              <!-- Website -->
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.website}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Website" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${webUrl}" target="_blank" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif; white-space: nowrap;">
                    ${website}
                  </a>
                </td>
              </tr>
              <!-- Location Address -->
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; vertical-align: top; padding-top: 1px;">
                  <img src="${brand.contactIconsBase64.location}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Address" />
                </td>
                <td style="vertical-align: top; padding-left: 4px; color: #4b5563; font-weight: 500; font-family: Arial, Helvetica, sans-serif;">
                  ${addressLines.join('<br />')}
                </td>
              </tr>
            </table>
          </td>

          <!-- Col 3: Centered DMHCA Logo & 4 Social Icons -->
          <td width="${col3W}" style="width: ${col3W}px; vertical-align: middle; text-align: center; border-left: 1px solid #d1d5db; padding: 4px 4px;">
            <table width="${col3W - 8}" cellpadding="0" cellspacing="0" border="0" style="width: ${col3W - 8}px; margin: 0 auto;">
              <tr>
                <td style="padding-bottom: 8px; text-align: center; vertical-align: middle;">
                  <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; margin: 0 auto; border: 0;" alt="DMHCA Logo" />
                </td>
              </tr>
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 2px; vertical-align: middle;">
                        <a href="${brand.socialLinks.linkedin}" target="_blank" style="text-decoration: none;">
                          <img src="${brand.socialIconsBase64.linkedin}" width="${socialIconSize}" height="${socialIconSize}" style="width: ${socialIconSize}px; height: ${socialIconSize}px; display: block; border: 0;" alt="LinkedIn" />
                        </a>
                      </td>
                      <td style="padding: 0 2px; vertical-align: middle;">
                        <a href="${brand.socialLinks.instagram}" target="_blank" style="text-decoration: none;">
                          <img src="${brand.socialIconsBase64.instagram}" width="${socialIconSize}" height="${socialIconSize}" style="width: ${socialIconSize}px; height: ${socialIconSize}px; display: block; border: 0;" alt="Instagram" />
                        </a>
                      </td>
                      <td style="padding: 0 2px; vertical-align: middle;">
                        <a href="${brand.socialLinks.facebook}" target="_blank" style="text-decoration: none;">
                          <img src="${brand.socialIconsBase64.facebook}" width="${socialIconSize}" height="${socialIconSize}" style="width: ${socialIconSize}px; height: ${socialIconSize}px; display: block; border: 0;" alt="Facebook" />
                        </a>
                      </td>
                      <td style="padding: 0 2px; vertical-align: middle;">
                        <a href="${brand.socialLinks.youtube}" target="_blank" style="text-decoration: none;">
                          <img src="${brand.socialIconsBase64.youtube}" width="${socialIconSize}" height="${socialIconSize}" style="width: ${socialIconSize}px; height: ${socialIconSize}px; display: block; border: 0;" alt="YouTube" />
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom Dark Blue Footer with Subtitles -->
  <tr>
    <td width="${W}" style="width: ${W}px; background-color: #062B67; padding: ${footerPadY}px 12px ${Math.max(4, Math.round(footerPadY * 0.8))}px 12px; color: #ffffff;">
      <div style="font-size: ${footerHeadingSize}px; font-weight: 700; text-align: center; color: #ffffff; letter-spacing: 0.2px; font-family: Arial, Helvetica, sans-serif; margin-bottom: 3px;">
        ${brand.footer.heading}
      </div>
      <div style="font-size: ${footerDescSize}px; text-align: center; color: #e0e7ff; margin-bottom: 6px; font-family: Arial, Helvetica, sans-serif;">
        ${brand.footer.description}
      </div>

      <table width="${innerW}" cellpadding="0" cellspacing="0" border="0" style="width: ${innerW}px; border-collapse: collapse; margin: 0 auto; table-layout: fixed;">
        <tr>
          ${brand.footer.features
      .map((feat, index) => {
        const isLast = index === brand.footer.features.length - 1;
        const borderStyle = isLast ? '' : 'border-right: 1px solid rgba(255, 255, 255, 0.25);';
        const featColW = Math.floor(innerW / brand.footer.features.length);
        const featIconSize = Math.max(14, Math.round(22 * scale));
        return `
              <td width="${featColW}" style="width: ${featColW}px; vertical-align: top; padding: 0 3px; ${borderStyle} text-align: left;">
                <table width="${featColW - 6}" cellpadding="0" cellspacing="0" border="0" style="width: ${featColW - 6}px;">
                  <tr>
                    <td width="${featIconSize + 4}" style="width: ${featIconSize + 4}px; vertical-align: top; padding-top: 1px;">
                      <img src="${feat.iconSvg}" width="${featIconSize}" height="${featIconSize}" style="width: ${featIconSize}px; height: ${featIconSize}px; display: block; border: 0;" alt="${feat.title}" />
                    </td>
                    <td style="vertical-align: top; padding-left: 3px;">
                      <div style="font-size: ${featTitleSize}px; font-weight: 700; color: #ffffff; line-height: 1.2; font-family: Arial, Helvetica, sans-serif;">
                        ${feat.title}
                      </div>
                      <div style="font-size: ${featSubSize}px; color: #cbd5e1; line-height: 1.2; margin-top: 2px; font-family: Arial, Helvetica, sans-serif;">
                        ${feat.subtitle}
                      </div>
                    </td>
                  </tr>
                </table>
              </td>
              `;
      })
      .join('')}
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * TEMPLATE 02 — DMHCA Modern (With Full Subtitles Restored)
 */
function renderModernTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  const photoSize = Math.max(45, Math.round(100 * scale));
  const logoW = Math.max(65, Math.round(135 * scale));
  const iconSize = Math.max(12, Math.round(18 * scale));

  return `
<!-- DMHCA Email Signature - Template 02: Modern (${W}px x ${H}px) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; margin: 0 auto; table-layout: fixed;">
  <tr>
    <td style="padding: ${Math.max(8, Math.round(16 * scaleH))}px; background-color: #ffffff;">
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0" style="width: ${W - 32}px; table-layout: fixed;">
        <tr>
          <!-- Left Column: Photo -->
          <td width="${Math.round(120 * scaleW)}" style="width: ${Math.round(120 * scaleW)}px; vertical-align: top; padding-right: 10px;">
            <img src="${photo}" alt="${name}" width="${photoSize}" height="${photoSize}" style="width: ${photoSize}px; height: ${photoSize}px; border-radius: 12px; object-fit: cover; border: 3px solid #062B67; display: block;" />
          </td>

          <!-- Center Column: Details -->
          <td style="vertical-align: top; padding-right: 10px;">
            <div style="font-size: ${Math.max(12, Math.round(20 * scale))}px; font-weight: 800; color: #062B67; line-height: 1.2;">${name}</div>
            <div style="font-size: ${Math.max(8.5, Math.round(12 * scale))}px; font-weight: 700; color: #D31016; margin-top: 2px;">${designation}</div>
            <div style="height: 2px; background-color: #062B67; margin: 4px 0; width: 100%;">&nbsp;</div>

            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: ${Math.max(8, Math.round(11 * scale))}px; color: #334155; line-height: 1.3;">
              <tr>
                <td width="${iconSize + 4}" style="padding-bottom: 3px;"><img src="${brand.contactIconsBase64.phone}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                <td style="padding-bottom: 3px; white-space: nowrap;"><a href="${phoneUrl}" style="color:#062B67; text-decoration:none; font-weight:700;">${phone}</a></td>
              </tr>
              <tr>
                <td width="${iconSize + 4}" style="padding-bottom: 3px;"><img src="${brand.contactIconsBase64.email}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                <td style="padding-bottom: 3px; white-space: nowrap;"><a href="${emailUrl}" style="color:#062B67; text-decoration:none; font-weight:700;">${email}</a></td>
              </tr>
              <tr>
                <td width="${iconSize + 4}" style="padding-bottom: 3px;"><img src="${brand.contactIconsBase64.website}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                <td style="padding-bottom: 3px; white-space: nowrap;"><a href="${webUrl}" target="_blank" style="color:#062B67; text-decoration:none; font-weight:700;">${website}</a></td>
              </tr>
              <tr>
                <td width="${iconSize + 4}" style="vertical-align:top;"><img src="${brand.contactIconsBase64.location}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                <td style="vertical-align:top; color:#475569; font-weight:500;">${addressLines.join(', ')}</td>
              </tr>
            </table>
          </td>

          <!-- Right Column: Logo & Socials -->
          <td width="${Math.round(135 * scaleW)}" style="width: ${Math.round(135 * scaleW)}px; vertical-align: middle; text-align: center; border-left: 1px solid #e2e8f0; padding-left: 8px;">
            <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; margin: 0 auto 8px auto;" alt="DMHCA Logo" />
            <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; margin: 0 auto;">
              <tr>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.linkedin}" target="_blank"><img src="${brand.socialIconsBase64.linkedin}" width="${Math.max(14, Math.round(24 * scale))}" height="${Math.max(14, Math.round(24 * scale))}" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.instagram}" target="_blank"><img src="${brand.socialIconsBase64.instagram}" width="${Math.max(14, Math.round(24 * scale))}" height="${Math.max(14, Math.round(24 * scale))}" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.facebook}" target="_blank"><img src="${brand.socialIconsBase64.facebook}" width="${Math.max(14, Math.round(24 * scale))}" height="${Math.max(14, Math.round(24 * scale))}" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.youtube}" target="_blank"><img src="${brand.socialIconsBase64.youtube}" width="${Math.max(14, Math.round(24 * scale))}" height="${Math.max(14, Math.round(24 * scale))}" /></a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Dark Footer -->
  <tr>
    <td style="background-color: #062B67; padding: ${Math.max(6, Math.round(12 * scaleH))}px 14px; color: #ffffff;">
      <div style="font-size: ${Math.max(10, Math.round(14 * scale))}px; font-weight: 700; text-align: center;">${brand.footer.heading}</div>
      <div style="font-size: ${Math.max(7.5, Math.round(10 * scale))}px; text-align: center; color: #cbd5e1; margin: 2px 0 6px 0;">${brand.footer.description}</div>
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0" style="width: ${W - 32}px; margin: 0 auto;">
        <tr>
          ${brand.footer.features
      .map((feat, idx) => `
            <td width="${Math.floor((W - 32) / 4)}" style="vertical-align: top; ${idx < 3 ? 'border-right: 1px solid rgba(255,255,255,0.2);' : ''} padding: 0 3px;">
              <div style="font-size: ${Math.max(7.5, Math.round(9 * scale))}px; font-weight: 700; color: #fff; text-align: left;">${feat.title}</div>
              <div style="font-size: ${Math.max(6.5, Math.round(8 * scale))}px; color: #cbd5e1; text-align: left; margin-top: 1px;">${feat.subtitle}</div>
            </td>
          `).join('')}
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * TEMPLATE 03 — DMHCA Executive Lead (With Full Subtitles Restored)
 */
function renderExecutiveTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  const photoSize = Math.max(45, Math.round(90 * scale));
  const logoW = Math.max(65, Math.round(130 * scale));

  return `
<!-- DMHCA Email Signature - Template 03: Executive (${W}px x ${H}px) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; margin: 0 auto; table-layout: fixed;">
  <!-- Executive Top Header Banner -->
  <tr>
    <td style="background-color: #ffffff; padding: ${Math.max(5, Math.round(10 * scaleH))}px 16px; border-top: 4px solid #062B67; border-bottom: 2px solid #062B67;">
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align: middle;">
            <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; border: 0;" alt="DMHCA Logo" />
          </td>
          <td style="text-align: right; vertical-align: middle;">
            <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
              <tr>
                <td style="padding-left: 4px;"><a href="${brand.socialLinks.linkedin}" target="_blank"><img src="${brand.socialIconsBase64.linkedin}" width="${Math.max(14, Math.round(22 * scale))}" height="${Math.max(14, Math.round(22 * scale))}" /></a></td>
                <td style="padding-left: 4px;"><a href="${brand.socialLinks.instagram}" target="_blank"><img src="${brand.socialIconsBase64.instagram}" width="${Math.max(14, Math.round(22 * scale))}" height="${Math.max(14, Math.round(22 * scale))}" /></a></td>
                <td style="padding-left: 4px;"><a href="${brand.socialLinks.facebook}" target="_blank"><img src="${brand.socialIconsBase64.facebook}" width="${Math.max(14, Math.round(22 * scale))}" height="${Math.max(14, Math.round(22 * scale))}" /></a></td>
                <td style="padding-left: 4px;"><a href="${brand.socialLinks.youtube}" target="_blank"><img src="${brand.socialIconsBase64.youtube}" width="${Math.max(14, Math.round(22 * scale))}" height="${Math.max(14, Math.round(22 * scale))}" /></a></td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Main Body -->
  <tr>
    <td style="padding: ${Math.max(8, Math.round(14 * scaleH))}px 16px; background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="${photoSize + 12}" style="vertical-align: top; padding-right: 12px;">
            <img src="${photo}" alt="${name}" width="${photoSize}" height="${photoSize}" style="width: ${photoSize}px; height: ${photoSize}px; border-radius: 50%; border: 3px solid #D31016; object-fit: cover;" />
          </td>
          <td style="vertical-align: top;">
            <div style="font-size: ${Math.max(13, Math.round(20 * scale))}px; font-weight: 900; color: #062B67;">${name}</div>
            <div style="font-size: ${Math.max(8.5, Math.round(12 * scale))}px; font-weight: 700; text-transform: uppercase; color: #D31016; margin-top: 1px;">${designation}</div>
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top: 6px; font-size: ${Math.max(8, Math.round(11 * scale))}px; color: #334155;">
              <tr>
                <td style="padding-bottom: 3px;"><strong>Direct:</strong> <a href="${phoneUrl}" style="color:#062B67; text-decoration:none; white-space: nowrap;">${phone}</a> &nbsp;|&nbsp; <strong>Email:</strong> <a href="${emailUrl}" style="color:#062B67; text-decoration:none; white-space: nowrap;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding-bottom: 3px;"><strong>Web:</strong> <a href="${webUrl}" target="_blank" style="color:#062B67; text-decoration:none; white-space: nowrap;">${website}</a></td>
              </tr>
              <tr>
                <td style="color: #64748b;">${addressLines.join(', ')}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Dark Footer -->
  <tr>
    <td style="background-color: #062B67; padding: ${Math.max(5, Math.round(10 * scaleH))}px 14px; color: #ffffff;">
      <div style="font-size: ${Math.max(9.5, Math.round(13 * scale))}px; font-weight: 700; text-align: center;">${brand.footer.heading}</div>
      <div style="font-size: ${Math.max(7.5, Math.round(9 * scale))}px; text-align: center; color: #93c5fd; margin-top: 1px; margin-bottom: 4px;">${brand.footer.description}</div>
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0" style="width: ${W - 32}px; margin: 0 auto;">
        <tr>
          ${brand.footer.features
      .map((feat, idx) => `
            <td width="${Math.floor((W - 32) / 4)}" style="vertical-align: top; ${idx < 3 ? 'border-right: 1px solid rgba(255,255,255,0.2);' : ''} padding: 0 2px;">
              <div style="font-size: ${Math.max(7.5, Math.round(9 * scale))}px; font-weight: 700; color: #fff; text-align: left;">${feat.title}</div>
              <div style="font-size: ${Math.max(6.5, Math.round(8 * scale))}px; color: #94a3b8; text-align: left; margin-top: 1px;">${feat.subtitle}</div>
            </td>
          `).join('')}
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * TEMPLATE 04 — DMHCA Minimal & Sleek (With Full Subtitles Restored)
 */
function renderCompactTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  const photoSize = Math.max(40, Math.round(80 * scale));
  const logoW = Math.max(60, Math.round(125 * scale));
  const iconSize = Math.max(12, Math.round(16 * scale));

  return `
<!-- DMHCA Email Signature - Template 04: Minimal & Sleek (${W}px x ${H}px) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; margin: 0 auto; table-layout: fixed;">
  <!-- Top Accent Stripe -->
  <tr>
    <td width="${W}" style="width: ${W}px; height: 4px; background-color: #062B67; font-size: 0; line-height: 0;">&nbsp;</td>
  </tr>

  <!-- Main Card Body -->
  <tr>
    <td width="${W}" style="width: ${W}px; padding: ${Math.max(8, Math.round(14 * scaleH))}px 16px; background-color: #ffffff;">
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0" style="width: ${W - 32}px; table-layout: fixed;">
        <tr>
          <!-- Left: Photo & Name Card -->
          <td width="${Math.round((W - 32) * 0.42)}" style="vertical-align: middle; padding-right: 10px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td width="${photoSize + 8}" style="vertical-align: middle;">
                  <img src="${photo}" alt="${name}" width="${photoSize}" height="${photoSize}" style="width: ${photoSize}px; height: ${photoSize}px; border-radius: 50%; border: 3px solid #062B67; object-fit: cover; display: block;" />
                </td>
                <td style="vertical-align: middle; padding-left: 8px;">
                  <div style="font-size: ${Math.max(12, Math.round(18 * scale))}px; font-weight: 800; color: #062B67; line-height: 1.2;">${name}</div>
                  <div style="font-size: ${Math.max(8.5, Math.round(11 * scale))}px; font-weight: 600; color: #D31016; margin-top: 2px;">${designation}</div>
                </td>
              </tr>
            </table>
          </td>

          <!-- Vertical Divider -->
          <td width="1" style="width: 1px; background-color: #cbd5e1; padding: 0;">&nbsp;</td>

          <!-- Right: Logo & Contact Row -->
          <td style="vertical-align: middle; padding-left: 12px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0">
              <!-- DMHCA Logo & Social Icons Header -->
              <tr>
                <td style="padding-bottom: 6px;">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="vertical-align: middle;">
                        <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; border: 0;" alt="DMHCA Logo" />
                      </td>
                      <td style="text-align: right; vertical-align: middle;">
                        <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block;">
                          <tr>
                            <td style="padding-left: 3px;"><a href="${brand.socialLinks.linkedin}" target="_blank"><img src="${brand.socialIconsBase64.linkedin}" width="${iconSize + 3}" height="${iconSize + 3}" style="display:block; border:0;" /></a></td>
                            <td style="padding-left: 3px;"><a href="${brand.socialLinks.instagram}" target="_blank"><img src="${brand.socialIconsBase64.instagram}" width="${iconSize + 3}" height="${iconSize + 3}" style="display:block; border:0;" /></a></td>
                            <td style="padding-left: 3px;"><a href="${brand.socialLinks.facebook}" target="_blank"><img src="${brand.socialIconsBase64.facebook}" width="${iconSize + 3}" height="${iconSize + 3}" style="display:block; border:0;" /></a></td>
                            <td style="padding-left: 3px;"><a href="${brand.socialLinks.youtube}" target="_blank"><img src="${brand.socialIconsBase64.youtube}" width="${iconSize + 3}" height="${iconSize + 3}" style="display:block; border:0;" /></a></td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Contact Grid -->
              <tr>
                <td>
                  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: ${Math.max(8, Math.round(10.5 * scale))}px; color: #334155; line-height: 1.3;">
                    <tr>
                      <td width="${iconSize + 4}" style="padding-bottom: 3px; vertical-align: middle;"><img src="${brand.contactIconsBase64.phone}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                      <td style="padding-bottom: 3px; padding-right: 6px; vertical-align: middle; white-space: nowrap;"><a href="${phoneUrl}" style="color:#062B67; text-decoration:none; font-weight:700;">${phone}</a></td>
                      <td width="${iconSize + 4}" style="padding-bottom: 3px; vertical-align: middle;"><img src="${brand.contactIconsBase64.email}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                      <td style="padding-bottom: 3px; vertical-align: middle; white-space: nowrap;"><a href="${emailUrl}" style="color:#062B67; text-decoration:none; font-weight:700;">${email}</a></td>
                    </tr>
                    <tr>
                      <td width="${iconSize + 4}" style="vertical-align: middle;"><img src="${brand.contactIconsBase64.website}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                      <td style="padding-right: 6px; vertical-align: middle; white-space: nowrap;"><a href="${webUrl}" target="_blank" style="color:#062B67; text-decoration:none; font-weight:700;">${website}</a></td>
                      <td width="${iconSize + 4}" style="vertical-align: top; padding-top: 1px;"><img src="${brand.contactIconsBase64.location}" width="${iconSize}" height="${iconSize}" style="display:block;" /></td>
                      <td style="vertical-align: top; color:#475569; font-weight:500;">${addressLines.join(', ')}</td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Full Dark Blue Footer -->
  <tr>
    <td width="${W}" style="width: ${W}px; background-color: #062B67; padding: ${Math.max(5, Math.round(10 * scaleH))}px 12px; color: #ffffff;">
      <div style="font-size: ${Math.max(10, Math.round(14 * scale))}px; font-weight: 700; text-align: center; color: #ffffff;">${brand.footer.heading}</div>
      <div style="font-size: ${Math.max(7.5, Math.round(9 * scale))}px; text-align: center; color: #e0e7ff; margin: 2px 0 5px 0;">${brand.footer.description}</div>
      <table width="${W - 32}" cellpadding="0" cellspacing="0" border="0" style="width: ${W - 32}px; margin: 0 auto;">
        <tr>
          ${brand.footer.features
      .map((feat, idx) => `
            <td width="${Math.floor((W - 32) / 4)}" style="vertical-align: top; ${idx < 3 ? 'border-right: 1px solid rgba(255,255,255,0.25);' : ''} padding: 0 3px;">
              <div style="font-size: ${Math.max(7.5, Math.round(9 * scale))}px; font-weight: 700; color: #fff; text-align: center;">${feat.title}</div>
              <div style="font-size: ${Math.max(6.5, Math.round(8 * scale))}px; color: #cbd5e1; text-align: center; margin-top: 1px;">${feat.subtitle}</div>
            </td>
          `).join('')}
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * TEMPLATE 05 — DMHCA Creative Curve (Synchronized Vector Scaling — Preserves 1:1 Circle & Aspect Ratios)
 */
function renderCreativeTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');
  const formattedName = lastName
    ? `${firstName} <span style="color: #062B67;">${lastName}</span>`
    : firstName;

  // Synchronized Layout Dimensions
  const leftColW = Math.round(155 * scaleW);
  const rightColW = Math.round(22 * scaleW);

  // Scaled Content Sizes
  const nameFontSize = Math.max(12, Math.round(21 * scale));
  const titleFontSize = Math.max(8.5, Math.round(13 * scale));
  const contactFontSize = Math.max(7.5, Math.round(11 * scale));
  const iconSize = Math.max(11, Math.round(17 * scale));
  const logoW = Math.max(60, Math.round(125 * scale));
  const subtextSize = Math.max(6, Math.round(8 * scale));
  const socialIconSize = Math.max(13, Math.round(20 * scale));
  const cardPadY = Math.max(4, Math.round(12 * scaleH));

  const clipId = `creativeAvatarClip_${Math.random().toString(36).substring(2, 7)}`;

  return `
<!-- DMHCA Email Signature - Template 05: Creative Curve (${W}px x ${H}px - Synchronized Scaling) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; margin: 0 auto; table-layout: fixed;">
  <tr>
    <td width="${W}" style="width: ${W}px; padding: 0; background-color: #ffffff; vertical-align: middle;">
      <table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; table-layout: fixed;">
        <tr>
          <!-- Col 1: Left Sweeping Curve & Avatar Ring (Preserves Perfect 1:1 Aspect Circle Ratio at any H) -->
          <td width="${leftColW}" style="width: ${leftColW}px; vertical-align: middle; padding: 0;">
            <svg width="${leftColW}" height="${H}" viewBox="0 0 155 200" preserveAspectRatio="xMinYMid meet" xmlns="http://www.w3.org/2000/svg" style="display: block; width: ${leftColW}px; height: ${H}px;">
              <defs>
                <clipPath id="${clipId}">
                  <circle cx="85" cy="100" r="50" />
                </clipPath>
              </defs>
              <!-- Refined Sweeping Left Backdrop Path in DMHCA Navy Blue -->
              <path d="M 0 0 H 16 C 16 28, 52 46, 85 46 A 54 54 0 1 1 85 154 C 52 154, 16 172, 16 200 H 0 Z" fill="#062B67" />
              <!-- Outer Blue Circular Frame -->
              <circle cx="85" cy="100" r="56" fill="#062B67" />
              <!-- White Inner Circular Border Ring -->
              <circle cx="85" cy="100" r="54" fill="#ffffff" stroke="#062B67" stroke-width="3" />
              <!-- Profile Avatar Photo -->
              <image href="${photo}" x="35" y="50" width="100" height="100" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clipId})" />
            </svg>
          </td>

          <!-- Col 2: Employee Details & Contact List (Synchronized Font & Icon Scaling) -->
          <td style="vertical-align: middle; padding: ${cardPadY}px 6px ${cardPadY}px 12px;">
            <div style="font-size: ${nameFontSize}px; font-weight: 800; color: #1e293b; line-height: 1.2; font-family: Arial, Helvetica, sans-serif;">
              ${formattedName}
            </div>
            <div style="font-size: ${titleFontSize}px; font-weight: 600; color: #4b5563; margin-top: 2px; margin-bottom: ${Math.max(3, Math.round(8 * scale))}px; font-family: Arial, Helvetica, sans-serif;">
              ${designation}
            </div>

            <!-- Contact List -->
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="font-size: ${contactFontSize}px; color: #334155; line-height: 1.35; font-family: Arial, Helvetica, sans-serif;">
              <tr>
                <td width="${iconSize + 5}" style="padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.phone}" width="${iconSize}" height="${iconSize}" style="display:block; border:0;" alt="Phone" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${phoneUrl}" style="color: #062B67; text-decoration: none; font-weight: 700;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td width="${iconSize + 5}" style="padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.email}" width="${iconSize}" height="${iconSize}" style="display:block; border:0;" alt="Email" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${emailUrl}" style="color: #062B67; text-decoration: none; font-weight: 700;">${email}</a>
                </td>
              </tr>
              <tr>
                <td width="${iconSize + 5}" style="padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.website}" width="${iconSize}" height="${iconSize}" style="display:block; border:0;" alt="Website" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${webUrl}" target="_blank" style="color: #062B67; text-decoration: none; font-weight: 700;">${website}</a>
                </td>
              </tr>
              <tr>
                <td width="${iconSize + 5}" style="vertical-align: top; padding-top: 1px;">
                  <img src="${brand.contactIconsBase64.location}" width="${iconSize}" height="${iconSize}" style="display:block; border:0;" alt="Address" />
                </td>
                <td style="vertical-align: top; padding-left: 4px; color: #475569; font-weight: 500;">
                  ${addressLines.join('<br />')}
                </td>
              </tr>
            </table>
          </td>

          <!-- Col 3: Logo & Social Media Icons (Synchronized Logo & Social Scaling) -->
          <td width="${Math.round(140 * scaleW)}" style="width: ${Math.round(140 * scaleW)}px; vertical-align: middle; text-align: center; padding: ${cardPadY}px 6px;">
            <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; margin: 0 auto 5px auto; border: 0;" alt="DMHCA Logo" />
            <div style="font-size: ${subtextSize}px; font-weight: 700; color: #4b5563; margin-bottom: ${Math.max(3, Math.round(8 * scale))}px; font-family: Arial, Helvetica, sans-serif;">
              ${brand.companySubtext}
            </div>
            <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; margin: 0 auto;">
              <tr>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.linkedin}" target="_blank"><img src="${brand.socialIconsBase64.linkedin}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.instagram}" target="_blank"><img src="${brand.socialIconsBase64.instagram}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.facebook}" target="_blank"><img src="${brand.socialIconsBase64.facebook}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                <td style="padding: 0 2px;"><a href="${brand.socialLinks.youtube}" target="_blank"><img src="${brand.socialIconsBase64.youtube}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
              </tr>
            </table>
          </td>

          <!-- Col 4: Slimmer Right Crescent Arch Graphic (Preserves Vertical Centered Arch Ratio at any H) -->
          <td width="${rightColW}" style="width: ${rightColW}px; vertical-align: middle; padding: 0;">
            <svg width="${rightColW}" height="${H}" viewBox="0 0 22 200" preserveAspectRatio="xMaxYMid meet" xmlns="http://www.w3.org/2000/svg" style="display: block; width: ${rightColW}px; height: ${H}px;">
              <!-- Slimmer Sweeping Right Crescent Shape in DMHCA Navy Blue -->
              <path d="M 22 0 H 12 Q 0 45 0 100 Q 0 155 12 200 H 22 Z" fill="#062B67" />
            </svg>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
}

/**
 * TEMPLATE 06 — DMHCA Simplified (No-Footer Standout with clean design)
 */
function renderLuxeTemplate(emp: EmployeeSignature, brand: BrandConfig, dim?: DimensionOptions): string {
  const W = Math.min(600, Math.max(300, dim?.width ?? 600));
  const H = Math.min(250, Math.max(100, dim?.height ?? 200));

  const scaleW = W / 600;
  const scaleH = H / 200;
  const scale = Math.min(scaleW, scaleH);

  const name = escapeHtml(emp.fullName);
  const designation = escapeHtml(emp.designation);
  const phone = escapeHtml(emp.phone);
  const email = escapeHtml(emp.email);
  const website = escapeHtml(emp.website);
  const addressLines = formatAddressLines(emp.address);
  const photo = encodeSvgToBase64DataUrl(emp.photoUrl || brand.logoPngBase64);

  const phoneUrl = `tel:${cleanPhoneUrl(emp.phone)}`;
  const emailUrl = `mailto:${emp.email.trim()}`;
  const webUrl = ensureUrl(emp.website);

  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ');
  const formattedName = lastName
    ? `${firstName} <span style="color: #D31016;">${lastName}</span>`
    : firstName;

  // Proportional Scaled Layout Dimensions
  const innerW = W - 28;
  const col1W = Math.max(75, Math.round(125 * scaleW));
  const col2W = Math.max(130, Math.round(260 * scaleW));
  const col3W = Math.max(95, innerW - col1W - col2W);

  const photoSize = Math.max(48, Math.round(100 * scale));
  const logoW = Math.max(65, Math.round(145 * scale));
  const socialIconSize = Math.max(14, Math.round(24 * scale));
  const contactIconSize = Math.max(12, Math.round(19 * scale));

  const nameFontSize = Math.max(13, Math.round(22 * scale));
  const titleFontSize = Math.max(8.5, Math.round(11 * scale));
  const contactFontSize = Math.max(8, Math.round(11.5 * scale));
  const cardPadY = Math.max(6, Math.round(16 * scaleH));

  return `
<!-- DMHCA Email Signature - Template 06: DMHCA Simplified (Creative No-Footer Standout Design) -->
<table width="${W}" cellpadding="0" cellspacing="0" border="0" style="width: ${W}px; max-width: ${W}px; min-width: ${W}px; border-collapse: collapse; font-family: Arial, Helvetica, sans-serif; background-color: #ffffff; color: #1e293b; margin: 0 auto; table-layout: fixed;">
  <!-- Top Accent Bar: Split Gradient Header Stripe -->
  <tr>
    <td width="${W}" style="width: ${W}px; height: 4px; background-color: #062B67; font-size: 0; line-height: 0;">
      <table width="100%" cellpadding="0" cellspacing="0" border="0" style="height: 4px;">
        <tr>
          <td width="70%" style="background-color: #062B67; height: 4px;"></td>
          <td width="30%" style="background-color: #D31016; height: 4px;"></td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Main Card Body (NO FOOTER) -->
  <tr>
    <td width="${W}" style="width: ${W}px; padding: ${cardPadY}px 14px; background-color: #ffffff; vertical-align: middle;">
      <table width="${innerW}" cellpadding="0" cellspacing="0" border="0" style="width: ${innerW}px; border-collapse: collapse; table-layout: fixed;">
        <tr>
          <!-- Col 1: Circular Avatar with Gradient Ring Accent -->
          <td width="${col1W}" style="width: ${col1W}px; vertical-align: middle; padding-right: 8px;">
            <table width="${col1W - 8}" cellpadding="0" cellspacing="0" border="0" style="width: ${col1W - 8}px; margin: 0 auto;">
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  <div style="display: inline-block; padding: 3px; border-radius: 50%; background: linear-gradient(135deg, #062B67 0%, #D31016 100%);">
                    <img src="${photo}" alt="${name}" width="${photoSize}" height="${photoSize}" style="width: ${photoSize}px; height: ${photoSize}px; border-radius: 50%; object-fit: cover; display: block; border: 2px solid #ffffff;" />
                  </div>
                </td>
              </tr>
            </table>
          </td>

          <!-- Col 2: Name, Crimson Floating Badge & Contact List -->
          <td width="${col2W}" style="width: ${col2W}px; vertical-align: middle; padding-right: 8px;">
            <!-- Employee Name -->
            <div style="font-size: ${nameFontSize}px; font-weight: 900; color: #062B67; line-height: 1.15; font-family: Arial, Helvetica, sans-serif; letter-spacing: -0.2px;">
              ${formattedName}
            </div>

            <!-- Crimson Ribbon Designation Tag Pill -->
            <div style="margin-top: 4px; margin-bottom: 8px;">
              <span style="display: inline-block; background-color: #D31016; color: #ffffff; font-size: ${titleFontSize}px; font-weight: 700; font-family: Arial, Helvetica, sans-serif; text-transform: uppercase; letter-spacing: 0.4px; padding: 2.5px 10px; border-radius: 12px; line-height: 1;">
                ${designation}
              </span>
            </div>

            <!-- Contact List Table -->
            <table width="${col2W}" cellpadding="0" cellspacing="0" border="0" style="width: ${col2W}px; font-size: ${contactFontSize}px; line-height: 1.35; table-layout: fixed;">
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.phone}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Phone" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${phoneUrl}" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${phone}</a>
                </td>
              </tr>
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.email}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Email" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${emailUrl}" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${email}</a>
                </td>
              </tr>
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; padding-bottom: 3px; vertical-align: middle;">
                  <img src="${brand.contactIconsBase64.website}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Website" />
                </td>
                <td style="padding-bottom: 3px; vertical-align: middle; padding-left: 4px; white-space: nowrap;">
                  <a href="${webUrl}" target="_blank" style="color: #062B67; text-decoration: none; font-weight: 700; font-family: Arial, Helvetica, sans-serif;">${website}</a>
                </td>
              </tr>
              <tr>
                <td width="${contactIconSize + 6}" style="width: ${contactIconSize + 6}px; vertical-align: top; padding-top: 1px;">
                  <img src="${brand.contactIconsBase64.location}" width="${contactIconSize}" height="${contactIconSize}" style="width: ${contactIconSize}px; height: ${contactIconSize}px; display: block; border: 0;" alt="Address" />
                </td>
                <td style="vertical-align: top; padding-left: 4px; color: #475569; font-weight: 500; font-family: Arial, Helvetica, sans-serif;">
                  ${addressLines.join('<br />')}
                </td>
              </tr>
            </table>
          </td>

          <!-- Col 3: Brand Pillar with Crimson Vertical Divider (No Footer Needed) -->
          <td width="${col3W}" style="width: ${col3W}px; vertical-align: middle; text-align: center; border-left: 2px solid #D31016; padding-left: 10px;">
            <table width="${col3W - 10}" cellpadding="0" cellspacing="0" border="0" style="width: ${col3W - 10}px; margin: 0 auto;">
              <tr>
                <td style="padding-bottom: 6px; text-align: center; vertical-align: middle;">
                  <img src="${brand.logoSvg}" width="${logoW}" style="width: ${logoW}px; height: auto; display: block; margin: 0 auto; border: 0;" alt="DMHCA Logo" />
                </td>
              </tr>
              <tr>
                <td style="font-size: ${Math.max(6.5, Math.round(8.5 * scale))}px; font-weight: 700; color: #4b5563; padding-bottom: 8px; text-align: center; font-family: Arial, Helvetica, sans-serif;">
                  ${brand.companySubtext}
                </td>
              </tr>
              <tr>
                <td style="text-align: center; vertical-align: middle;">
                  <table cellpadding="0" cellspacing="0" border="0" style="display: inline-block; margin: 0 auto;">
                    <tr>
                      <td style="padding: 0 2px;"><a href="${brand.socialLinks.linkedin}" target="_blank"><img src="${brand.socialIconsBase64.linkedin}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                      <td style="padding: 0 2px;"><a href="${brand.socialLinks.instagram}" target="_blank"><img src="${brand.socialIconsBase64.instagram}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                      <td style="padding: 0 2px;"><a href="${brand.socialLinks.facebook}" target="_blank"><img src="${brand.socialIconsBase64.facebook}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                      <td style="padding: 0 2px;"><a href="${brand.socialLinks.youtube}" target="_blank"><img src="${brand.socialIconsBase64.youtube}" width="${socialIconSize}" height="${socialIconSize}" style="display:block; border:0;" /></a></td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Bottom Accent Stripe Bar -->
  <tr>
    <td width="${W}" style="width: ${W}px; height: 3px; background-color: #062B67; font-size: 0; line-height: 0;">&nbsp;</td>
  </tr>
</table>
`.trim();
}

export function generateSignatureHTML(
  employee: EmployeeSignature,
  templateId: SignatureTemplate = 'classic',
  brand: BrandConfig = DEFAULT_BRAND_CONFIG,
  dimensions?: DimensionOptions
): string {
  switch (templateId) {
    case 'luxe':
      return renderLuxeTemplate(employee, brand, dimensions);
    case 'modern':
      return renderModernTemplate(employee, brand, dimensions);
    case 'executive':
      return renderExecutiveTemplate(employee, brand, dimensions);
    case 'compact':
      return renderCompactTemplate(employee, brand, dimensions);
    case 'creative':
      return renderCreativeTemplate(employee, brand, dimensions);
    case 'classic':
    default:
      return renderClassicTemplate(employee, brand, dimensions);
  }
}

export function generatePlainTextSignature(employee: EmployeeSignature): string {
  return `
${employee.fullName} | ${employee.designation}
Phone: ${employee.phone}
Email: ${employee.email}
Website: ${employee.website}
Address: ${employee.address.replace(/\n/g, ', ')}

DMHCA - Empowering Healthcare Through Excellence
www.dmhca.in
`.trim();
}
