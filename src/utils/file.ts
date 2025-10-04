import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from "crypto";

/**
 * Check if a file exists
 */
export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Ensure directory exists, create if it doesn't
 */
export async function ensureDir(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error: any) {
    if (error.code !== "EEXIST") {
      throw error;
    }
  }
}

/**
 * Read file as buffer
 */
export async function readFileBuffer(filePath: string): Promise<Buffer> {
  return await fs.readFile(filePath);
}

/**
 * Write buffer to file
 */
export async function writeFileBuffer(
  filePath: string,
  buffer: Buffer
): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await fs.writeFile(filePath, buffer);
}

/**
 * Get all font files from a directory
 */
export async function getFontFiles(dirPath: string): Promise<string[]> {
  const exists = await fileExists(dirPath);
  if (!exists) {
    throw new Error(`Directory not found: ${dirPath}`);
  }

  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const fontFiles: string[] = [];

  for (const entry of entries) {
    if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if ([".ttf", ".otf", ".woff", ".woff2"].includes(ext)) {
        fontFiles.push(path.join(dirPath, entry.name));
      }
    }
  }

  return fontFiles;
}

/**
 * Generate hash for cache busting
 */
export function generateHash(content: Buffer, length: number = 8): string {
  return createHash("md5").update(content).digest("hex").substring(0, length);
}

/**
 * Generate optimized filename with hash
 */
export function generateOptimizedFilename(
  originalName: string,
  hash: string,
  extension: string = ".woff2"
): string {
  const baseName = path.basename(originalName, path.extname(originalName));
  return `${baseName}-${hash}${extension}`;
}

/**
 * Get file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Calculate size reduction percentage
 */
export function calculateReduction(
  original: number,
  optimized: number
): string {
  const reduction = ((original - optimized) / original) * 100;
  return reduction.toFixed(1);
}

/**
 * Copy file from source to destination
 */
export async function copyFile(src: string, dest: string): Promise<void> {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

/**
 * Get font file metadata
 */
export interface FontFileMetadata {
  path: string;
  name: string;
  extension: string;
  size: number;
  sizeFormatted: string;
}

export async function getFontMetadata(
  filePath: string
): Promise<FontFileMetadata> {
  const stats = await fs.stat(filePath);
  const name = path.basename(filePath);
  const extension = path.extname(filePath);

  return {
    path: filePath,
    name,
    extension,
    size: stats.size,
    sizeFormatted: formatFileSize(stats.size),
  };
}
