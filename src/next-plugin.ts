/**
 * Next.js plugin for automatic Persian font optimization
 */

import * as path from "path";
import * as fs from "fs/promises";
import {
  optimizeFont,
  parseFontWeight,
  parseFontStyle,
  type OptimizationResult,
} from "./optimizer";
import { getFontFiles, ensureDir } from "./utils/file";
import { DEFAULT_SUBSETS } from "./utils/subsetConfig";

export interface FontConfig {
  /** Font family name */
  family: string;

  /** Font weights to optimize */
  weights?: number[];

  /** Subsets to include */
  subsets?: string[];

  /** Source font files */
  src?: string;
}

export interface PersianFontsConfig {
  /** Array of font configurations */
  fonts: FontConfig[];

  /** Source directory for fonts */
  sourceDir?: string;

  /** Output directory for optimized fonts */
  outputDir?: string;

  /** Output format */
  format?: "woff2" | "woff" | "ttf";

  /** Enable verbose logging */
  verbose?: boolean;
}

/**
 * Next.js plugin wrapper for Persian font optimization
 *
 * @example
 * ```js
 * // next.config.js
 * const { withPersianFonts } = require('persian-fontkit/plugin');
 *
 * module.exports = withPersianFonts({
 *   fonts: [
 *     { family: 'Vazir', weights: [400, 700], subsets: ['farsi'] },
 *   ],
 * });
 * ```
 */
export function withPersianFonts(
  fontsConfig: PersianFontsConfig,
  nextConfig: any = {}
): any {
  return {
    ...nextConfig,
    webpack(config: any, options: any) {
      // Run font optimization during build
      if (!options.isServer && !options.dev) {
        // Only run during production client build
        optimizeFontsForNextJS(fontsConfig).catch(console.error);
      }

      // Call the original webpack function if it exists
      if (typeof nextConfig.webpack === "function") {
        return nextConfig.webpack(config, options);
      }

      return config;
    },
  };
}

/**
 * Optimize fonts for Next.js project
 */
async function optimizeFontsForNextJS(
  config: PersianFontsConfig
): Promise<void> {
  const {
    fonts,
    sourceDir = "./public/fonts",
    outputDir = "./public/fonts/optimized",
    format = "woff2",
    verbose = false,
  } = config;

  if (verbose) {
    console.log("🎨 Optimizing Persian fonts...");
  }

  const sourceDirectory = path.resolve(process.cwd(), sourceDir);
  const outputDirectory = path.resolve(process.cwd(), outputDir);

  await ensureDir(outputDirectory);

  for (const fontConfig of fonts) {
    const { family, weights, subsets = DEFAULT_SUBSETS, src } = fontConfig;

    try {
      // Find font files
      let fontFiles: string[];

      if (src) {
        // Use specified source
        const srcPath = path.resolve(sourceDirectory, src);
        fontFiles = [srcPath];
      } else {
        // Find all files matching the family name
        const allFiles = await getFontFiles(sourceDirectory);
        fontFiles = allFiles.filter((file) =>
          file.toLowerCase().includes(family.toLowerCase())
        );
      }

      if (fontFiles.length === 0) {
        if (verbose) {
          console.warn(`⚠️  No files found for font: ${family}`);
        }
        continue;
      }

      // Optimize each font file
      for (const fontFile of fontFiles) {
        const fontWeight = parseFontWeight(fontFile);
        const fontStyle = parseFontStyle(fontFile);

        // Skip if weight is specified and doesn't match
        if (weights && !weights.includes(fontWeight)) {
          continue;
        }

        await optimizeFont({
          inputPath: fontFile,
          outputDir: outputDirectory,
          fontFamily: family,
          fontWeight,
          fontStyle,
          subsets,
          format,
          useHash: false, // Don't use hash for Next.js
        });

        if (verbose) {
          console.log(`✓ Optimized ${family} (${fontWeight})`);
        }
      }
    } catch (error: any) {
      console.error(`Error optimizing ${family}:`, error.message);
    }
  }

  if (verbose) {
    console.log("✨ Font optimization complete!");
  }
}

/**
 * Generate font CSS for Next.js (can be used in _document.tsx)
 */
export function generateNextJSFontCSS(fonts: FontConfig[]): string {
  let css = "/* Persian Fonts - Optimized by persian-fontkit */\n\n";

  for (const font of fonts) {
    const { family, weights = [400] } = font;

    for (const weight of weights) {
      const fileName = `${family.toLowerCase()}-${weight}.woff2`;
      css += `@font-face {
  font-family: '${family}';
  src: url('/fonts/optimized/${fileName}') format('woff2');
  font-weight: ${weight};
  font-style: normal;
  font-display: swap;
}\n\n`;
    }
  }

  return css;
}

/**
 * CLI helper for Next.js projects
 * Run this to optimize fonts manually: node optimize-fonts.js
 */
export async function optimizeNextJSFonts(
  configPath: string = "./persian-fonts.config.js"
): Promise<void> {
  try {
    const config = require(path.resolve(process.cwd(), configPath));
    await optimizeFontsForNextJS(config);
  } catch (error: any) {
    console.error("Error loading config:", error.message);
    throw error;
  }
}
