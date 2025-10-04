/**
 * Tests for cache system
 */

import * as fs from "fs/promises";
import * as path from "path";
import { FontCache, getGlobalCache, disableCache } from "../src/utils/cache";
import type { OptimizationResult } from "../src/optimizer";
import { createTempDir, cleanupTempDir, writeMockFont } from "./test-utils";

describe("FontCache", () => {
  let tempDir: string;
  let cacheDir: string;
  let cache: FontCache;
  let testFontPath: string;

  beforeEach(async () => {
    tempDir = await createTempDir();
    cacheDir = path.join(tempDir, ".cache");
    cache = new FontCache(cacheDir);
    testFontPath = path.join(tempDir, "test.ttf");
    await writeMockFont(testFontPath, "ttf");
  });

  afterEach(async () => {
    await cleanupTempDir(tempDir);
  });

  describe("get and set", () => {
    it("should return null for non-existent cache", async () => {
      const result = await cache.get(testFontPath);
      expect(result).toBeNull();
    });

    it("should store and retrieve optimization result", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      // Create the output file
      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));

      await cache.set(testFontPath, mockResult);
      const cached = await cache.get(testFontPath);

      expect(cached).not.toBeNull();
      expect(cached?.fontFamily).toBe("Test");
      expect(cached?.fontWeight).toBe(400);
      expect(cached?.reduction).toBe("70.00");
    });

    it("should invalidate cache when input file changes", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      // Modify the input file by appending data
      const currentData = await fs.readFile(testFontPath);
      await fs.writeFile(
        testFontPath,
        Buffer.concat([currentData, Buffer.from("modified")])
      );

      const cached = await cache.get(testFontPath);
      expect(cached).toBeNull();
    });

    it("should invalidate cache when output file is missing", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      // Delete the output file
      await fs.unlink(mockResult.optimized.path);

      const cached = await cache.get(testFontPath);
      expect(cached).toBeNull();
    });
  });

  describe("delete", () => {
    it("should delete cache entry", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      let cached = await cache.get(testFontPath);
      expect(cached).not.toBeNull();

      await cache.delete(testFontPath);

      cached = await cache.get(testFontPath);
      expect(cached).toBeNull();
    });

    it("should not throw when deleting non-existent entry", async () => {
      await expect(cache.delete(testFontPath)).resolves.not.toThrow();
    });
  });

  describe("clear", () => {
    it("should clear all cache entries", async () => {
      const mockResult1: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test1.woff2"),
          name: "test1.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test1'; }",
        fontFamily: "Test1",
        fontWeight: 400,
      };

      const testFont2Path = path.join(tempDir, "test2.ttf");
      await writeMockFont(testFont2Path, "ttf");

      const mockResult2: OptimizationResult = {
        original: {
          path: testFont2Path,
          name: "test2.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test2.woff2"),
          name: "test2.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test2'; }",
        fontFamily: "Test2",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult1.optimized.path, Buffer.from("test1"));
      await fs.writeFile(mockResult2.optimized.path, Buffer.from("test2"));

      await cache.set(testFontPath, mockResult1);
      await cache.set(testFont2Path, mockResult2);

      await cache.clear();

      const cached1 = await cache.get(testFontPath);
      const cached2 = await cache.get(testFont2Path);

      expect(cached1).toBeNull();
      expect(cached2).toBeNull();
    });

    it("should not throw when clearing empty cache", async () => {
      await expect(cache.clear()).resolves.not.toThrow();
    });
  });

  describe("getStats", () => {
    it("should return empty stats for non-existent cache", async () => {
      const stats = await cache.getStats();
      expect(stats.entries).toBe(0);
      expect(stats.totalSize).toBe(0);
      expect(stats.oldestEntry).toBeNull();
      expect(stats.newestEntry).toBeNull();
    });

    it("should return correct stats", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      const stats = await cache.getStats();
      expect(stats.entries).toBe(1);
      expect(stats.totalSize).toBeGreaterThan(0);
      expect(stats.oldestEntry).not.toBeNull();
      expect(stats.newestEntry).not.toBeNull();
    });
  });

  describe("cleanOld", () => {
    it("should remove old cache entries", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      // Clean entries older than 0ms (all entries)
      const deletedCount = await cache.cleanOld(0);
      expect(deletedCount).toBe(1);

      const cached = await cache.get(testFontPath);
      expect(cached).toBeNull();
    });

    it("should not remove recent cache entries", async () => {
      const mockResult: OptimizationResult = {
        original: {
          path: testFontPath,
          name: "test.ttf",
          extension: ".ttf",
          size: 1000,
          sizeFormatted: "1 KB",
        },
        optimized: {
          path: path.join(tempDir, "test.woff2"),
          name: "test.woff2",
          extension: ".woff2",
          size: 300,
          sizeFormatted: "300 B",
        },
        reduction: "70.00",
        css: "@font-face { font-family: 'Test'; }",
        fontFamily: "Test",
        fontWeight: 400,
      };

      await fs.writeFile(mockResult.optimized.path, Buffer.from("test"));
      await cache.set(testFontPath, mockResult);

      // Clean entries older than 1 day
      const deletedCount = await cache.cleanOld(24 * 60 * 60 * 1000);
      expect(deletedCount).toBe(0);

      const cached = await cache.get(testFontPath);
      expect(cached).not.toBeNull();
    });
  });

  describe("global cache", () => {
    afterEach(() => {
      disableCache();
    });

    it("should return same instance for same cache dir", () => {
      const cache1 = getGlobalCache(cacheDir);
      const cache2 = getGlobalCache(cacheDir);
      expect(cache1).toBe(cache2);
    });

    it("should return new instance for different cache dir", () => {
      const cache1 = getGlobalCache(cacheDir);
      const cache2 = getGlobalCache(path.join(tempDir, ".other"));
      expect(cache1).not.toBe(cache2);
    });

    it("should disable global cache", () => {
      const cache1 = getGlobalCache(cacheDir);
      disableCache();
      const cache2 = getGlobalCache(cacheDir);
      expect(cache1).not.toBe(cache2);
    });
  });
});
