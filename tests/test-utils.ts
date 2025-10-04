/**
 * Test utilities and helpers
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

/**
 * Create a temporary directory for tests
 */
export function createTempDir(prefix = "persian-fontkit-test-"): string {
  const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  return tempDir;
}

/**
 * Clean up temporary directory
 */
export function cleanupTempDir(dirPath: string): void {
  if (fs.existsSync(dirPath)) {
    fs.rmSync(dirPath, { recursive: true, force: true });
  }
}

/**
 * Create a minimal valid TTF font file for testing
 * This creates a very simple font with just a few tables
 */
export function createMockTTFFont(): Buffer {
  // TTF file signature: 0x00010000 (version 1.0)
  const header = Buffer.from([0x00, 0x01, 0x00, 0x00]);

  // Number of tables (we'll include minimal tables)
  const numTables = Buffer.from([0x00, 0x04]); // 4 tables

  // Search range, entry selector, range shift (calculated for 4 tables)
  const searchRange = Buffer.from([0x00, 0x40]); // 64
  const entrySelector = Buffer.from([0x00, 0x02]); // 2
  const rangeShift = Buffer.from([0x00, 0x00]); // 0

  // Table directory entries (tag, checksum, offset, length)
  // We need: head, hhea, hmtx, maxp (minimal)

  // 'head' table entry
  const headTag = Buffer.from("head", "ascii");
  const headChecksum = Buffer.from([0x00, 0x00, 0x00, 0x00]);
  const headOffset = Buffer.from([0x00, 0x00, 0x00, 0x6c]); // After table directory
  const headLength = Buffer.from([0x00, 0x00, 0x00, 0x36]); // 54 bytes

  // Combine all parts
  return Buffer.concat([
    header,
    numTables,
    searchRange,
    entrySelector,
    rangeShift,
    headTag,
    headChecksum,
    headOffset,
    headLength,
    // Add padding and minimal table data
    Buffer.alloc(200), // Simplified - real font would have actual table data
  ]);
}

/**
 * Create a mock WOFF2 font file
 */
export function createMockWOFF2Font(): Buffer {
  // WOFF2 signature: 'wOF2'
  const signature = Buffer.from([0x77, 0x4f, 0x46, 0x32]);
  // Minimal WOFF2 structure
  const restOfHeader = Buffer.alloc(40); // Simplified header
  const tableData = Buffer.alloc(100); // Simplified table data

  return Buffer.concat([signature, restOfHeader, tableData]);
}

/**
 * Create a mock OTF font file
 */
export function createMockOTFFont(): Buffer {
  // OTF signature: 'OTTO'
  const signature = Buffer.from([0x4f, 0x54, 0x54, 0x4f]);
  const restOfFont = Buffer.alloc(200); // Simplified

  return Buffer.concat([signature, restOfFont]);
}

/**
 * Create a mock WOFF font file
 */
export function createMockWOFFFont(): Buffer {
  // WOFF signature: 'wOFF'
  const signature = Buffer.from([0x77, 0x4f, 0x46, 0x46]);
  const restOfFont = Buffer.alloc(200); // Simplified

  return Buffer.concat([signature, restOfFont]);
}

/**
 * Create an invalid font file (corrupted)
 */
export function createInvalidFont(): Buffer {
  return Buffer.from([0x00, 0x00, 0x00, 0x00]); // Invalid signature
}

/**
 * Write mock font to file
 */
export function writeMockFont(
  filePath: string,
  type: "ttf" | "otf" | "woff" | "woff2" | "invalid" = "ttf"
): void {
  let buffer: Buffer;

  switch (type) {
    case "ttf":
      buffer = createMockTTFFont();
      break;
    case "otf":
      buffer = createMockOTFFont();
      break;
    case "woff":
      buffer = createMockWOFFFont();
      break;
    case "woff2":
      buffer = createMockWOFF2Font();
      break;
    case "invalid":
      buffer = createInvalidFont();
      break;
  }

  fs.writeFileSync(filePath, buffer);
}

/**
 * Get fixture file path
 */
export function getFixturePath(filename: string): string {
  return path.join(__dirname, "fixtures", filename);
}

/**
 * Assert file exists
 */
export function assertFileExists(filePath: string): void {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Expected file to exist: ${filePath}`);
  }
}

/**
 * Assert file does not exist
 */
export function assertFileNotExists(filePath: string): void {
  if (fs.existsSync(filePath)) {
    throw new Error(`Expected file to not exist: ${filePath}`);
  }
}

/**
 * Get file size
 */
export function getFileSize(filePath: string): number {
  return fs.statSync(filePath).size;
}

/**
 * Mock console methods for testing
 */
export function mockConsole() {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  const logs: string[] = [];
  const warnings: string[] = [];
  const errors: string[] = [];

  console.log = (...args: any[]) => {
    logs.push(args.join(" "));
  };

  console.warn = (...args: any[]) => {
    warnings.push(args.join(" "));
  };

  console.error = (...args: any[]) => {
    errors.push(args.join(" "));
  };

  return {
    logs,
    warnings,
    errors,
    restore: () => {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    },
  };
}
