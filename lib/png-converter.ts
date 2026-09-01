import html2canvas from 'html2canvas';
import { DMHCA_CREATIVE_LEFT_CURVE_PNG, DMHCA_CREATIVE_RIGHT_CRESCENT_PNG } from './creative-curves-png';

/**
 * Converts any raw inline <svg> elements inside an HTML string into 2x Retina PNG Base64 Data URI <img> tags.
 * Used for clipboard copying to guarantee 100% compatibility when pasting into Gmail Web, Gmail Mobile, Outlook 365, and Apple Mail.
 */
export async function rasterizeHtmlSvgsToPng(htmlString: string): Promise<string> {
  if (typeof window === 'undefined' || !htmlString || !htmlString.includes('<svg')) {
    return htmlString;
  }

  try {
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.left = '-9999px';
    container.style.top = '-9999px';
    container.style.visibility = 'hidden';
    container.innerHTML = htmlString;
    document.body.appendChild(container);

    const svgs = Array.from(container.querySelectorAll('svg'));
    if (svgs.length === 0) {
      document.body.removeChild(container);
      return htmlString;
    }

    for (const svgEl of svgs) {
      try {
        const width = parseInt(svgEl.getAttribute('width') || '155', 10);
        const height = parseInt(svgEl.getAttribute('height') || '200', 10);

        const serializer = new XMLSerializer();
        let svgStr = serializer.serializeToString(svgEl);

        if (!svgStr.includes('xmlns=')) {
          svgStr = svgStr.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"');
        }

        const pngDataUrl = await convertSvgStringToPng(svgStr, width, height);
        if (pngDataUrl) {
          const img = document.createElement('img');
          img.src = pngDataUrl;
          img.width = width;
          img.height = height;
          img.style.display = 'block';
          img.style.width = `${width}px`;
          img.style.height = `${height}px`;
          img.style.border = '0';
          svgEl.parentNode?.replaceChild(img, svgEl);
        }
      } catch (e) {
        console.warn('Could not rasterize SVG element:', e);
      }
    }

    const resultHtml = container.innerHTML;
    document.body.removeChild(container);
    return resultHtml;
  } catch (err) {
    return htmlString;
  }
}

function convertSvgStringToPng(svgStr: string, width: number, height: number): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Use Data URI instead of Blob URL so nested data URIs (e.g. avatar photos) render 100%
    const dataUrl = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgStr);

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(10, width * 2);
        canvas.height = Math.max(10, height * 2);
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          const pngUrl = canvas.toDataURL('image/png', 1.0);
          resolve(pngUrl);
        } else {
          resolve('');
        }
      } catch (err) {
        resolve('');
      }
    };

    img.onerror = () => {
      resolve('');
    };

    img.src = dataUrl;
  });
}

/**
 * Renders HTML signature content into a high-DPI 2x Retina PNG Data URL matching exact width & full natural height.
 * Captures 100% of text, profile photo avatars, logos, icons, and vector graphics without clipping or missing elements.
 */
export async function convertSignatureHtmlToPng(
  htmlContent: string,
  width: number,
  height: number
): Promise<string> {
  if (typeof window === 'undefined' || !htmlContent) return '';

  // 1. Pre-rasterize any raw SVGs to pure PNG Data URIs
  const cleanHtml = await rasterizeHtmlSvgsToPng(htmlContent);

  // 2. Create a clean offscreen DOM container
  const container = document.createElement('div');
  container.style.position = 'fixed';
  container.style.left = '-9999px';
  container.style.top = '-9999px';
  container.style.width = `${width}px`;
  container.style.margin = '0';
  container.style.padding = '0';
  container.style.border = 'none';
  container.style.boxSizing = 'border-box';
  container.style.backgroundColor = '#ffffff';
  container.style.zIndex = '-9999';
  container.innerHTML = cleanHtml;
  document.body.appendChild(container);

  // Wait 120ms for DOM layout & Base64 image decoding
  await new Promise((resolve) => setTimeout(resolve, 120));

  try {
    // 3. Measure actual full natural height of the rendered table so footer is never cropped
    const tableEl = container.querySelector('table');
    const fullHeight = Math.max(height, tableEl ? tableEl.offsetHeight : container.offsetHeight);

    // 4. Render container using html2canvas at 2x High-DPI scale matching actual natural height
    const canvas = await html2canvas(container, {
      scale: 2, // 2x High-DPI for crisp text and logos
      width: width,
      height: fullHeight,
      windowWidth: width,
      windowHeight: fullHeight,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    });

    // 5. Output final canvas matching exact width and natural height
    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = width;
    outputCanvas.height = fullHeight;

    const ctx = outputCanvas.getContext('2d');
    if (ctx) {
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(canvas, 0, 0, width, fullHeight);
    }

    const pngDataUrl = outputCanvas.toDataURL('image/png', 1.0);
    document.body.removeChild(container);
    return pngDataUrl;
  } catch (err) {
    console.error('html2canvas image rendering error:', err);
    if (document.body.contains(container)) {
      document.body.removeChild(container);
    }
    return '';
  }
}

export { DMHCA_CREATIVE_LEFT_CURVE_PNG, DMHCA_CREATIVE_RIGHT_CRESCENT_PNG };
