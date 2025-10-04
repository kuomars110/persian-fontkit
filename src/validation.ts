/**
 * Input validation utilities
 */

import * as fs from "fs";
import * as path from "path";
import {
  ValidationError,
  UnsupportedFormatError,
  InvalidFontError,
} from "./errors";
import type { OptimizationOptions } from "./optimizer";

/**
 * Supported font formats
 */
export const SUPPORTED_FORMATS = [".ttf", ".otf", ".woff", ".woff2"] as const;

/**
 * Supported output formats
 */
export const SUPPORTED_OUTPUT_FORMATS = ["woff2", "woff", "ttf"] as const;

/**
 * Maximum recommended font file size (10MB)
 */
export const MAX_RECOMMENDED_SIZE = 10 * 1024 * 1024;

/**
 * Validate optimization options
 */
export function validateOptimizationOptions(
  options: OptimizationOptions
): void {
  // Validate input path
  if (!options.inputPath) {
    throw new ValidationError(
      "Input path is required",
      "inputPath",
      options.inputPath
    );
  }

  if (typeof options.inputPath !== "string") {
    throw new ValidationError(
      "Input path must be a string",
      "inputPath",
      options.inputPath
    );
  }

  // Check if file exists
  if (!fs.existsSync(options.inputPath)) {
    throw new ValidationError(
      `Font file not found: ${options.inputPath}`,
      "inputPath",
      options.inputPath
    );
  }

  // Validate file format
  const ext = path.extname(options.inputPath).toLowerCase();
  if (!SUPPORTED_FORMATS.includes(ext as any)) {
    throw new UnsupportedFormatError(`Unsupported font format: ${ext}`, ext, [
      ...SUPPORTED_FORMATS,
    ]);
  }

  // Check if it's a file (not directory)
  const stats = fs.statSync(options.inputPath);
  if (!stats.isFile()) {
    throw new ValidationError(
      `Input path is not a file: ${options.inputPath}`,
      "inputPath",
      options.inputPath
    );
  }

  // Check file size
  if (stats.size === 0) {
    throw new InvalidFontError(
      `Font file is empty: ${options.inputPath}`,
      options.inputPath,
      "File size is 0 bytes"
    );
  }

  // Warn about large files
  if (stats.size > MAX_RECOMMENDED_SIZE) {
    console.warn(
      `⚠️  Warning: Large font file detected (${formatBytes(
        stats.size
      )}). This may take a while to optimize.`
    );
  }

  // Validate output directory
  if (!options.outputDir) {
    throw new ValidationError(
      "Output directory is required",
      "outputDir",
      options.outputDir
    );
  }

  if (typeof options.outputDir !== "string") {
    throw new ValidationError(
      "Output directory must be a string",
      "outputDir",
      options.outputDir
    );
  }

  // Validate output format
  if (
    options.format &&
    !SUPPORTED_OUTPUT_FORMATS.includes(options.format as any)
  ) {
    throw new UnsupportedFormatError(
      `Unsupported output format: ${options.format}`,
      options.format,
      [...SUPPORTED_OUTPUT_FORMATS]
    );
  }

  // Validate font weight
  if (
    options.fontWeight !== undefined &&
    (options.fontWeight < 100 || options.fontWeight > 900)
  ) {
    throw new ValidationError(
      `Font weight must be between 100 and 900, got: ${options.fontWeight}`,
      "fontWeight",
      options.fontWeight
    );
  }

  // Validate font style
  if (options.fontStyle && !["normal", "italic"].includes(options.fontStyle)) {
    throw new ValidationError(
      `Font style must be "normal" or "italic", got: ${options.fontStyle}`,
      "fontStyle",
      options.fontStyle
    );
  }

  // Validate font display
  const validDisplayValues = ["auto", "block", "swap", "fallback", "optional"];
  if (
    options.fontDisplay &&
    !validDisplayValues.includes(options.fontDisplay)
  ) {
    throw new ValidationError(
      `Font display must be one of: ${validDisplayValues.join(", ")}`,
      "fontDisplay",
      options.fontDisplay
    );
  }

  // Validate subsets
  if (options.subsets && !Array.isArray(options.subsets)) {
    throw new ValidationError(
      "Subsets must be an array",
      "subsets",
      options.subsets
    );
  }
}

/**
 * Validate font file integrity (basic check)
 */
export function validateFontFile(filePath: string): void {
  const buffer = fs.readFileSync(filePath);

  // Check for common font file signatures
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".ttf":
      // TTF files start with 0x00 0x01 0x00 0x00 or "true"
      if (
        !(
          (buffer[0] === 0x00 &&
            buffer[1] === 0x01 &&
            buffer[2] === 0x00 &&
            buffer[3] === 0x00) ||
          (buffer[0] === 0x74 &&
            buffer[1] === 0x72 &&
            buffer[2] === 0x75 &&
            buffer[3] === 0x65)
        )
      ) {
        throw new InvalidFontError(
          `Invalid TTF file signature: ${filePath}`,
          filePath,
          "File does not start with expected TTF header"
        );
      }
      break;

    case ".otf":
      // OTF files start with "OTTO"
      if (
        !(
          buffer[0] === 0x4f &&
          buffer[1] === 0x54 &&
          buffer[2] === 0x54 &&
          buffer[3] === 0x4f
        )
      ) {
        throw new InvalidFontError(
          `Invalid OTF file signature: ${filePath}`,
          filePath,
          "File does not start with 'OTTO' header"
        );
      }
      break;

    case ".woff":
      // WOFF files start with "wOFF"
      if (
        !(
          buffer[0] === 0x77 &&
          buffer[1] === 0x4f &&
          buffer[2] === 0x46 &&
          buffer[3] === 0x46
        )
      ) {
        throw new InvalidFontError(
          `Invalid WOFF file signature: ${filePath}`,
          filePath,
          "File does not start with 'wOFF' header"
        );
      }
      break;

    case ".woff2":
      // WOFF2 files start with "wOF2"
      if (
        !(
          buffer[0] === 0x77 &&
          buffer[1] === 0x4f &&
          buffer[2] === 0x46 &&
          buffer[3] === 0x32
        )
      ) {
        throw new InvalidFontError(
          `Invalid WOFF2 file signature: ${filePath}`,
          filePath,
          "File does not start with 'wOF2' header"
        );
      }
      break;
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Validate directory path
 */
export function validateDirectory(dirPath: string): void {
  if (!dirPath) {
    throw new ValidationError("Directory path is required", "dirPath", dirPath);
  }

  if (typeof dirPath !== "string") {
    throw new ValidationError(
      "Directory path must be a string",
      "dirPath",
      dirPath
    );
  }

  // If directory exists, ensure it's actually a directory
  if (fs.existsSync(dirPath)) {
    const stats = fs.statSync(dirPath);
    if (!stats.isDirectory()) {
      throw new ValidationError(
        `Path exists but is not a directory: ${dirPath}`,
        "dirPath",
        dirPath
      );
    }
  }
}
