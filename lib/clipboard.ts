import { rasterizeHtmlSvgsToPng, convertSignatureHtmlToPng } from './png-converter';

/**
 * Helper to copy rich HTML to clipboard so Gmail / Outlook pastes rendered signature.
 * Automatically rasterizes any inline <svg> shapes into High-DPI 2x PNG Base64 Data URIs first.
 */
export async function copyRichHtmlSignatureToClipboard(
  htmlContent: string,
  plainTextContent: string
): Promise<boolean> {
  const cleanHtml = await rasterizeHtmlSvgsToPng(htmlContent);

  try {
    if (navigator.clipboard && typeof window.ClipboardItem !== 'undefined') {
      const blobHtml = new Blob([cleanHtml], { type: 'text/html' });
      const blobText = new Blob([plainTextContent], { type: 'text/plain' });

      const item = new window.ClipboardItem({
        'text/html': blobHtml,
        'text/plain': blobText,
      });

      await navigator.clipboard.write([item]);
      return true;
    }
  } catch (err) {
    console.warn('ClipboardItem API failed, trying document fallback:', err);
  }

  // Fallback for older browsers
  try {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.pointerEvents = 'none';
    container.style.opacity = '0';
    container.innerHTML = cleanHtml;
    document.body.appendChild(container);

    const range = document.createRange();
    range.selectNode(container);
    const selection = window.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
      const successful = document.execCommand('copy');
      selection.removeAllRanges();
      document.body.removeChild(container);
      if (successful) return true;
    }
  } catch (fallbackErr) {
    console.error('Fallback copy failed:', fallbackErr);
  }

  return false;
}

/**
 * Copy raw text or HTML source code to clipboard.
 */
export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    const cleanText = text.includes('<svg') ? await rasterizeHtmlSvgsToPng(text) : text;
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(cleanText);
      return true;
    }
  } catch (err) {
    console.error('Text copy failed:', err);
  }
  return false;
}

/**
 * Triggers client-side file download of the email signature HTML.
 */
export async function downloadHtmlFile(htmlContent: string, filename: string = 'dmhca-email-signature.html') {
  const cleanHtml = await rasterizeHtmlSvgsToPng(htmlContent);
  const blob = new Blob([cleanHtml], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Renders the signature HTML into a crisp 2x Retina PNG image matching exact width & height,
 * retaining all elements and graphics, and triggers a client-side browser download (.png).
 */
export async function downloadSignatureImagePng(
  htmlContent: string,
  width: number,
  height: number,
  filename: string = 'dmhca-email-signature.png'
): Promise<boolean> {
  try {
    const pngDataUrl = await convertSignatureHtmlToPng(htmlContent, width, height);
    if (!pngDataUrl) return false;

    const link = document.createElement('a');
    link.href = pngDataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    return true;
  } catch (err) {
    console.error('Failed to generate PNG image download:', err);
    return false;
  }
}
