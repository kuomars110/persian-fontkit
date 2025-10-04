/**
 * Core font optimization engine
 * Handles font subsetting, conversion, and optimization
 */

import * as path from "path";
import subsetFont from "subset-font";
import {
  readFileBuffer,
  writeFileBuffer,
  generateHash,
  generateOptimizedFilename,
  getFontMetadata,
  formatFileSize,
  calculateReduction,
  type FontFileMetadata,
} from "./utils/file";
import { getSubsetCharacters, DEFAULT_SUBSETS } from "./utils/subsetConfig";
import {
  generateFontFace,
  generateCSSFile,
  type FontFaceOptions,
} from "./utils/css";
import { FontOptimizationError } from "./errors";
import { validateOptimizationOptions, validateFontFile } from "./validation";
import { getGlobalCache, disableCache } from "./utils/cache";

export interface OptimizationOptions {
  /** Input font file path */
  inputPath: string;

  /** Output directory */
  outputDir: string;

  /** Font family name */
  fontFamily?: string;

  /** Font weight */
  fontWeight?: number;

  /** Font style */
  fontStyle?: "normal" | "italic";

  /** Subsets to include */
  subsets?: string[];

  /** Target format (default: woff2) */
  format?: "woff2" | "woff" | "ttf";

  /** Font display property */
  fontDisplay?: "auto" | "block" | "swap" | "fallback" | "optional";

  /** Generate hashed filename */
  useHash?: boolean;

  /** Enable caching (default: true) */
  cache?: boolean;

  /** Cache directory (default: .persian-fontkit-cache) */
  cacheDir?: string;
}

export interface OptimizationResult {
  /** Original font metadata */
  original: FontFileMetadata;

  /** Optimized font metadata */
  optimized: FontFileMetadata;

  /** Size reduction percentage */
  reduction: string;

  /** Generated CSS */
  css: string;

  /** Font family name */
  fontFamily: string;

  /** Font weight */
  fontWeight: number;
}

/**
 * Optimize a single font file
 */
export async function optimizeFont(
  options: OptimizationOptions
): Promise<OptimizationResult> {
  // Validate input options
  try {
    validateOptimizationOptions(options);
    validateFontFile(options.inputPath);
  } catch (error) {
    if (
      error instanceof Error &&
      (error.name === "ValidationError" ||
        error.name === "UnsupportedFormatError" ||
        error.name === "InvalidFontError")
    ) {
      throw error;
    }
    throw new FontOptimizationError(
      `Validation failed: ${(error as Error).message}`,
      options.inputPath,
      error as Error
    );
  }

  const {
    inputPath,
    outputDir,
    fontFamily,
    fontWeight = 400,
    fontStyle = "normal",
    subsets = DEFAULT_SUBSETS,
    format = "woff2",
    fontDisplay = "swap",
    useHash = true,
    cache = true,
    cacheDir,
  } = options;

  // Check cache if enabled
  if (cache) {
    const fontCache = getGlobalCache(cacheDir);
    const cached = await fontCache.get(inputPath);

    if (cached) {
      return cached;
    }
  }

  try {
    // Get original font metadata
    const originalMeta = await getFontMetadata(inputPath);

    // Determine font family name
    const family =
      fontFamily || path.basename(inputPath, path.extname(inputPath));

    // Read font file
    const fontBuffer = await readFileBuffer(inputPath);

    // Validate buffer is not empty
    if (fontBuffer.length === 0) {
      throw new FontOptimizationError(
        `Font file is empty or could not be read`,
        inputPath
      );
    }

    // Get character set for subsetting
    const characters = getSubsetCharacters(subsets);
    const text = characters.join("");

    // Validate character set
    if (text.length === 0) {
      throw new FontOptimizationError(
        `No characters to subset. Check subset configuration.`,
        inputPath
      );
    }

    // Subset the font
    let subsetBuffer: Buffer;
    try {
      // Map format to subset-font format
      const targetFormat = format === "ttf" ? "truetype" : format;

      subsetBuffer = await subsetFont(fontBuffer, text, {
        targetFormat,
      });
    } catch (error: any) {
      throw new FontOptimizationError(
        `Failed to subset font: ${error.message}`,
        inputPath,
        error
      );
    }

    // Validate subset result
    if (!subsetBuffer || subsetBuffer.length === 0) {
      throw new FontOptimizationError(
        `Font subsetting produced empty result`,
        inputPath
      );
    }

    // Generate output filename
    const hash = useHash ? generateHash(subsetBuffer) : "";
    const outputFilename = useHash
      ? generateOptimizedFilename(originalMeta.name, hash, `.${format}`)
      : `${path.basename(
          originalMeta.name,
          path.extname(originalMeta.name)
        )}.${format}`;

    const outputPath = path.join(outputDir, outputFilename);

    // Write optimized font
    await writeFileBuffer(outputPath, subsetBuffer);

    // Get optimized font metadata
    const optimizedMeta = await getFontMetadata(outputPath);

    // Calculate reduction
    const reduction = calculateReduction(originalMeta.size, optimizedMeta.size);

    // Generate CSS
    const fontFaceOptions: FontFaceOptions = {
      fontFamily: family,
      fontPath: `./${outputFilename}`,
      fontWeight,
      fontStyle,
      fontDisplay,
    };

    const css = generateFontFace(fontFaceOptions);

    const result: OptimizationResult = {
      original: originalMeta,
      optimized: optimizedMeta,
      reduction,
      css,
      fontFamily: family,
      fontWeight,
    };

    // Store in cache if enabled
    if (cache) {
      const fontCache = getGlobalCache(cacheDir);
      await fontCache.set(inputPath, result);
    }

    return result;
  } catch (error) {
    // Re-throw our custom errors
    if (error instanceof FontOptimizationError) {
      throw error;
    }

    // Wrap other errors
    throw new FontOptimizationError(
      `Font optimization failed: ${(error as Error).message}`,
      inputPath,
      error as Error
    );
  }
}

/**
 * Optimize multiple font files
 */
export async function optimizeFonts(
  inputPaths: string[],
  outputDir: string,
  options: Partial<OptimizationOptions> = {}
): Promise<OptimizationResult[]> {
  const results: OptimizationResult[] = [];

  for (const inputPath of inputPaths) {
    try {
      const result = await optimizeFont({
        inputPath,
        outputDir,
        ...options,
      });
      results.push(result);
    } catch (error: any) {
      console.error(`Error optimizing ${inputPath}:`, error.message);
    }
  }

  return results;
}

/**
 * Generate CSS file from optimization results
 */
export async function generateOptimizedCSS(
  results: OptimizationResult[],
  outputPath: string
): Promise<void> {
  const fontFaces: FontFaceOptions[] = results.map((result) => ({
    fontFamily: result.fontFamily,
    fontPath: `./${path.basename(result.optimized.path)}`,
    fontWeight: result.fontWeight,
    fontDisplay: "swap",
  }));

  const comments = [
    `Total fonts: ${results.length}`,
    `Average size reduction: ${calculateAverageReduction(results)}%`,
  ];

  const css = generateCSSFile(fontFaces, comments);
  await writeFileBuffer(outputPath, Buffer.from(css, "utf-8"));
}

/**
 * Calculate average size reduction
 */
function calculateAverageReduction(results: OptimizationResult[]): string {
  const totalOriginal = results.reduce((sum, r) => sum + r.original.size, 0);
  const totalOptimized = results.reduce((sum, r) => sum + r.optimized.size, 0);

  return calculateReduction(totalOriginal, totalOptimized);
}

/**
 * Parse font weight from filename
 * Examples: vazir-bold.ttf -> 700, iransans-light.ttf -> 300
 */
export function parseFontWeight(filename: string): number {
  const lower = filename.toLowerCase();

  const weightMap: Record<string, number> = {
    thin: 100,
    extralight: 200,
    ultralight: 200,
    light: 300,
    regular: 400,
    normal: 400,
    medium: 500,
    semibold: 600,
    demibold: 600,
    bold: 700,
    extrabold: 800,
    ultrabold: 800,
    black: 900,
    heavy: 900,
  };

  for (const [key, weight] of Object.entries(weightMap)) {
    if (lower.includes(key)) {
      return weight;
    }
  }

  return 400; // Default to regular
}

/**
 * Parse font style from filename
 */
export function parseFontStyle(filename: string): "normal" | "italic" {
  const lower = filename.toLowerCase();
  return lower.includes("italic") || lower.includes("oblique")
    ? "italic"
    : "normal";
}
