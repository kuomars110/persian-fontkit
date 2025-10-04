/**
 * Font optimization cache system
 * Caches optimization results to avoid re-processing unchanged fonts
 */

import * as fs from "fs/promises";
import * as path from "path";
import { createHash } from "crypto";
import { fileExists, ensureDir } from "./file";
import type { OptimizationResult } from "../optimizer";

export interface CacheEntry {
  /** MD5 hash of input file */
  inputHash: string;

  /** Timestamp when cached */
  timestamp: number;

  /** Cache version for invalidation */
  version: string;

  /** Optimization result */
  result: {
    originalSize: number;
    optimizedSize: number;
    reduction: string;
    fontFamily: string;
    fontWeight: number;
    outputPath: string;
    cssContent: string;
  };
}

/**
 * Font optimization cache
 * Stores results in .persian-fontkit-cache directory
 */
export class FontCache {
  private cacheDir: string;
  private cacheVersion = "1.0.0"; // Increment to invalidate all cache

  constructor(cacheDir = "./.persian-fontkit-cache") {
    this.cacheDir = cacheDir;
  }

  /**
   * Get cached optimization result
   */
  async get(inputPath: string): Promise<OptimizationResult | null> {
    try {
      // Generate cache key
      const cacheKey = await this.getCacheKey(inputPath);
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

      // Check if cache file exists
      if (!(await fileExists(cachePath))) {
        return null;
      }

      // Read cache entry
      const data = await fs.readFile(cachePath, "utf-8");
      const entry: CacheEntry = JSON.parse(data);

      // Validate cache version
      if (entry.version !== this.cacheVersion) {
        await this.delete(inputPath);
        return null;
      }

      // Check if input file has changed
      const currentHash = await this.getFileHash(inputPath);
      if (entry.inputHash !== currentHash) {
        await this.delete(inputPath);
        return null;
      }

      // Check if output file still exists
      if (!(await fileExists(entry.result.outputPath))) {
        await this.delete(inputPath);
        return null;
      }

      // Reconstruct OptimizationResult
      return this.entryToResult(entry, inputPath);
    } catch (error) {
      // If any error, return null (cache miss)
      return null;
    }
  }

  /**
   * Store optimization result in cache
   */
  async set(inputPath: string, result: OptimizationResult): Promise<void> {
    try {
      await ensureDir(this.cacheDir);

      const cacheKey = await this.getCacheKey(inputPath);
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

      const entry: CacheEntry = {
        inputHash: await this.getFileHash(inputPath),
        timestamp: Date.now(),
        version: this.cacheVersion,
        result: {
          originalSize: result.original.size,
          optimizedSize: result.optimized.size,
          reduction: result.reduction,
          fontFamily: result.fontFamily,
          fontWeight: result.fontWeight,
          outputPath: result.optimized.path,
          cssContent: result.css,
        },
      };

      await fs.writeFile(cachePath, JSON.stringify(entry, null, 2), "utf-8");
    } catch (error) {
      // Silently fail - caching is not critical
      console.warn("Failed to write cache:", (error as Error).message);
    }
  }

  /**
   * Delete cache entry for a file
   */
  async delete(inputPath: string): Promise<void> {
    try {
      const cacheKey = await this.getCacheKey(inputPath);
      const cachePath = path.join(this.cacheDir, `${cacheKey}.json`);

      if (await fileExists(cachePath)) {
        await fs.unlink(cachePath);
      }
    } catch (error) {
      // Ignore errors
    }
  }

  /**
   * Clear entire cache
   */
  async clear(): Promise<void> {
    try {
      if (await fileExists(this.cacheDir)) {
        const files = await fs.readdir(this.cacheDir);

        await Promise.all(
          files.map((file) =>
            fs.unlink(path.join(this.cacheDir, file)).catch(() => {})
          )
        );

        // Try to remove directory (may fail if not empty)
        await fs.rmdir(this.cacheDir).catch(() => {});
      }
    } catch (error) {
      console.warn("Failed to clear cache:", (error as Error).message);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    entries: number;
    totalSize: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  }> {
    try {
      if (!(await fileExists(this.cacheDir))) {
        return {
          entries: 0,
          totalSize: 0,
          oldestEntry: null,
          newestEntry: null,
        };
      }

      const files = await fs.readdir(this.cacheDir);
      let totalSize = 0;
      let oldestEntry: number | null = null;
      let newestEntry: number | null = null;

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(this.cacheDir, file);
        const stats = await fs.stat(filePath);
        totalSize += stats.size;

        try {
          const data = await fs.readFile(filePath, "utf-8");
          const entry: CacheEntry = JSON.parse(data);

          if (oldestEntry === null || entry.timestamp < oldestEntry) {
            oldestEntry = entry.timestamp;
          }
          if (newestEntry === null || entry.timestamp > newestEntry) {
            newestEntry = entry.timestamp;
          }
        } catch {
          // Skip invalid entries
        }
      }

      return {
        entries: files.filter((f) => f.endsWith(".json")).length,
        totalSize,
        oldestEntry,
        newestEntry,
      };
    } catch (error) {
      return { entries: 0, totalSize: 0, oldestEntry: null, newestEntry: null };
    }
  }

  /**
   * Clean old cache entries
   */
  async cleanOld(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): Promise<number> {
    try {
      if (!(await fileExists(this.cacheDir))) {
        return 0;
      }

      const files = await fs.readdir(this.cacheDir);
      const now = Date.now();
      let deletedCount = 0;

      for (const file of files) {
        if (!file.endsWith(".json")) continue;

        const filePath = path.join(this.cacheDir, file);

        try {
          const data = await fs.readFile(filePath, "utf-8");
          const entry: CacheEntry = JSON.parse(data);

          if (now - entry.timestamp > maxAgeMs) {
            await fs.unlink(filePath);
            deletedCount++;
          }
        } catch {
          // Skip invalid entries
        }
      }

      return deletedCount;
    } catch (error) {
      return 0;
    }
  }

  /**
   * Generate cache key from file path
   */
  private async getCacheKey(filePath: string): Promise<string> {
    // Use absolute path for consistency
    const absolutePath = path.resolve(filePath);
    return createHash("md5").update(absolutePath).digest("hex");
  }

  /**
   * Get MD5 hash of file contents
   */
  private async getFileHash(filePath: string): Promise<string> {
    const buffer = await fs.readFile(filePath);
    return createHash("md5").update(buffer).digest("hex");
  }

  /**
   * Convert cache entry back to OptimizationResult
   */
  private async entryToResult(
    entry: CacheEntry,
    inputPath: string
  ): Promise<OptimizationResult> {
    const inputStats = await fs.stat(inputPath);
    const outputStats = await fs.stat(entry.result.outputPath);

    return {
      original: {
        path: inputPath,
        name: path.basename(inputPath),
        extension: path.extname(inputPath),
        size: entry.result.originalSize,
        sizeFormatted: this.formatFileSize(entry.result.originalSize),
      },
      optimized: {
        path: entry.result.outputPath,
        name: path.basename(entry.result.outputPath),
        extension: path.extname(entry.result.outputPath),
        size: entry.result.optimizedSize,
        sizeFormatted: this.formatFileSize(entry.result.optimizedSize),
      },
      reduction: entry.result.reduction,
      css: entry.result.cssContent,
      fontFamily: entry.result.fontFamily,
      fontWeight: entry.result.fontWeight,
    };
  }

  /**
   * Format file size helper
   */
  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }
}

/**
 * Global cache instance
 */
let globalCache: FontCache | null = null;

/**
 * Get or create global cache instance
 */
export function getGlobalCache(cacheDir?: string): FontCache {
  if (!globalCache || (cacheDir && globalCache["cacheDir"] !== cacheDir)) {
    globalCache = new FontCache(cacheDir);
  }
  return globalCache;
}

/**
 * Disable global cache
 */
export function disableCache(): void {
  globalCache = null;
}
