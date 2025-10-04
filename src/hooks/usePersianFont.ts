/**
 * React hook for dynamically loading Persian fonts
 * SSR-safe and supports Next.js
 */

import { useEffect } from "react";

export interface UsePersianFontOptions {
  /** Font family name */
  family: string;

  /** Font weights to load */
  weight?: number | number[];

  /** Font subsets */
  subsets?: string[];

  /** Base path for fonts */
  basePath?: string;

  /** Font display strategy */
  display?: "auto" | "block" | "swap" | "fallback" | "optional";

  /** Preload fonts */
  preload?: boolean;

  /** Fallback fonts */
  fallback?: string[];
}

/**
 * Hook to dynamically load Persian fonts in React/Next.js
 *
 * @example
 * ```tsx
 * import { usePersianFont } from 'persian-fontkit/hooks';
 *
 * function MyComponent() {
 *   usePersianFont({
 *     family: 'Vazir',
 *     weight: [400, 700],
 *     subsets: ['farsi', 'latin'],
 *   });
 *
 *   return <div style={{ fontFamily: 'Vazir' }}>سلام دنیا</div>;
 * }
 * ```
 */
export function usePersianFont(options: UsePersianFontOptions): void {
  const {
    family,
    weight = 400,
    subsets = ["farsi", "latin"],
    basePath = "/fonts",
    display = "swap",
    preload = true,
    fallback = ["Tahoma", "Arial", "sans-serif"],
  } = options;

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const weights = Array.isArray(weight) ? weight : [weight];
    const fontId = `persian-font-${family.toLowerCase().replace(/\s+/g, "-")}`;

    // Check if font is already loaded
    if (document.getElementById(fontId)) return;

    // Create style element
    const styleEl = document.createElement("style");
    styleEl.id = fontId;

    // Generate @font-face rules
    const fontFaces = weights
      .map((w) => {
        const fileName = `${family.toLowerCase()}-${w}.woff2`;
        const fontPath = `${basePath}/${fileName}`;

        return `
        @font-face {
          font-family: '${family}';
          src: url('${fontPath}') format('woff2');
          font-weight: ${w};
          font-style: normal;
          font-display: ${display};
        }
      `;
      })
      .join("\n");

    styleEl.textContent = fontFaces;
    document.head.appendChild(styleEl);

    // Add preload links
    if (preload) {
      weights.forEach((w) => {
        const fileName = `${family.toLowerCase()}-${w}.woff2`;
        const fontPath = `${basePath}/${fileName}`;

        // Check if preload already exists
        const existingPreload = document.querySelector(
          `link[rel="preload"][href="${fontPath}"]`
        );

        if (!existingPreload) {
          const linkEl = document.createElement("link");
          linkEl.rel = "preload";
          linkEl.as = "font";
          linkEl.type = "font/woff2";
          linkEl.href = fontPath;
          linkEl.crossOrigin = "anonymous";
          document.head.appendChild(linkEl);
        }
      });
    }

    // Cleanup function
    return () => {
      const el = document.getElementById(fontId);
      if (el) {
        el.remove();
      }
    };
  }, [family, JSON.stringify(weight), basePath, display, preload]);
}

/**
 * Generate font family CSS value with fallbacks
 */
export function getFontFamily(
  family: string,
  fallback: string[] = ["Tahoma", "Arial", "sans-serif"]
): string {
  return `'${family}', ${fallback.join(", ")}`;
}

/**
 * Generate preload link tags for server-side rendering (Next.js App Router)
 * Returns HTML string that can be inserted in <head>
 *
 * @example
 * ```tsx
 * import { generatePreloadLinks } from 'persian-fontkit/hooks';
 *
 * export default function RootLayout({ children }) {
 *   const preloadLinks = generatePreloadLinks({
 *     family: 'Vazir',
 *     weight: [400, 700],
 *   });
 *
 *   return (
 *     <html>
 *       <head dangerouslySetInnerHTML={{ __html: preloadLinks }} />
 *       <body>{children}</body>
 *     </html>
 *   );
 * }
 * ```
 */
export function generatePreloadLinks(options: UsePersianFontOptions): string {
  const { family, weight = 400, basePath = "/fonts" } = options;

  const weights = Array.isArray(weight) ? weight : [weight];

  return weights
    .map((w) => {
      const fileName = `${family.toLowerCase()}-${w}.woff2`;
      const fontPath = `${basePath}/${fileName}`;

      return `<link rel="preload" href="${fontPath}" as="font" type="font/woff2" crossorigin="anonymous">`;
    })
    .join("\n");
}

/**
 * Generate @font-face CSS for Persian fonts (Server-side)
 * Use this to generate CSS strings for Next.js or SSR
 *
 * @example
 * ```tsx
 * import { generateFontFaceCSS } from 'persian-fontkit/hooks';
 *
 * const fontCSS = generateFontFaceCSS({
 *   family: 'Vazir',
 *   weight: [400, 700],
 * });
 * ```
 */
export function generateFontFaceCSS(options: UsePersianFontOptions): string {
  const {
    family,
    weight = 400,
    basePath = "/fonts",
    display = "swap",
  } = options;

  const weights = Array.isArray(weight) ? weight : [weight];

  return weights
    .map((w) => {
      const fileName = `${family.toLowerCase()}-${w}.woff2`;
      const fontPath = `${basePath}/${fileName}`;

      return `
      @font-face {
        font-family: '${family}';
        src: url('${fontPath}') format('woff2');
        font-weight: ${w};
        font-style: normal;
        font-display: ${display};
      }
    `;
    })
    .join("\n");
}
