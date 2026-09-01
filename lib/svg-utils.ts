/**
 * Safely converts raw SVG code or utf8 data URLs into clean Base64 Data URIs (data:image/svg+xml;base64,...).
 * Safely passes through raster images (JPEG/PNG/WebP), base64 URLs, and HTTP image links.
 */
export function encodeSvgToBase64DataUrl(svgContentOrDataUrl: string): string {
  if (!svgContentOrDataUrl) return '';

  // 1. Instantly return if it is already a Base64 data URL, HTTP/HTTPS link, or raster image (JPEG, PNG, WebP)
  if (
    svgContentOrDataUrl.includes(';base64,') ||
    svgContentOrDataUrl.startsWith('http://') ||
    svgContentOrDataUrl.startsWith('https://') ||
    svgContentOrDataUrl.startsWith('blob:') ||
    svgContentOrDataUrl.startsWith('data:image/jpeg') ||
    svgContentOrDataUrl.startsWith('data:image/png') ||
    svgContentOrDataUrl.startsWith('data:image/webp')
  ) {
    return svgContentOrDataUrl;
  }

  // 2. Extract SVG content if it is a data:image/svg+xml;utf8, URI
  let cleanSvg = svgContentOrDataUrl;
  if (cleanSvg.startsWith('data:image/svg+xml;utf8,')) {
    const rawContent = cleanSvg.replace('data:image/svg+xml;utf8,', '');
    try {
      cleanSvg = decodeURIComponent(rawContent);
    } catch (err) {
      // Fallback if decodeURIComponent fails on malformed URI sequences
      cleanSvg = rawContent;
    }
  }

  // 3. Base64 encode the SVG string safely
  try {
    const base64 = typeof window !== 'undefined'
      ? window.btoa(unescape(encodeURIComponent(cleanSvg)))
      : Buffer.from(cleanSvg).toString('base64');
    return `data:image/svg+xml;base64,${base64}`;
  } catch (e) {
    return svgContentOrDataUrl;
  }
}
