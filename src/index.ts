/**
 * Persian FontKit - Main Entry Point
 * Automatic Persian (Farsi) web font optimizer for Next.js and React
 */

// Core optimizer
export {
  optimizeFont,
  optimizeFonts,
  generateOptimizedCSS,
  parseFontWeight,
  parseFontStyle,
  type OptimizationOptions,
  type OptimizationResult,
} from "./optimizer";

// Error classes
export {
  PersianFontKitError,
  FontOptimizationError,
  ValidationError,
  FileOperationError,
  UnsupportedFormatError,
  InvalidFontError,
} from "./errors";

// Validation
export {
  validateOptimizationOptions,
  validateFontFile,
  validateDirectory,
  SUPPORTED_FORMATS,
  SUPPORTED_OUTPUT_FORMATS,
} from "./validation";

// Cache utilities
export {
  FontCache,
  getGlobalCache,
  disableCache,
  type CacheEntry,
} from "./utils/cache";

// React hooks
export {
  usePersianFont,
  getFontFamily,
  generatePreloadLinks,
  generateFontFaceCSS,
  type UsePersianFontOptions,
} from "./hooks/usePersianFont";

// Next.js plugin
export {
  withPersianFonts,
  generateNextJSFontCSS,
  optimizeNextJSFonts,
  type FontConfig,
  type PersianFontsConfig,
} from "./next-plugin";

// Utilities
export {
  SUBSET_CONFIGS,
  DEFAULT_SUBSETS,
  PERSIAN_FONTS,
  getCharacterSet,
  getSubsetCharacters,
  type SubsetConfig,
} from "./utils/subsetConfig";

export {
  generateFontFace,
  generateFontFaces,
  generatePreloadTag,
  generatePreloadTags,
  generateCSSFile,
  generateCSSVariables,
  getFontFormat,
  getFontMimeType,
  generateFontStack,
  type FontFaceOptions,
  type PreloadOptions,
} from "./utils/css";

export {
  fileExists,
  ensureDir,
  getFontFiles,
  generateHash,
  generateOptimizedFilename,
  formatFileSize,
  calculateReduction,
  getFontMetadata,
  type FontFileMetadata,
} from "./utils/file";

// Version
export const version = "1.0.0";
