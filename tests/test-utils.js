"use strict";
/**
 * Test utilities and helpers
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTempDir = createTempDir;
exports.cleanupTempDir = cleanupTempDir;
exports.createMockTTFFont = createMockTTFFont;
exports.createMockWOFF2Font = createMockWOFF2Font;
exports.createMockOTFFont = createMockOTFFont;
exports.createMockWOFFFont = createMockWOFFFont;
exports.createInvalidFont = createInvalidFont;
exports.writeMockFont = writeMockFont;
exports.getFixturePath = getFixturePath;
exports.assertFileExists = assertFileExists;
exports.assertFileNotExists = assertFileNotExists;
exports.getFileSize = getFileSize;
exports.mockConsole = mockConsole;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const os = __importStar(require("os"));
/**
 * Create a temporary directory for tests
 */
function createTempDir(prefix = "persian-fontkit-test-") {
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
    return tempDir;
}
/**
 * Clean up temporary directory
 */
function cleanupTempDir(dirPath) {
    if (fs.existsSync(dirPath)) {
        fs.rmSync(dirPath, { recursive: true, force: true });
    }
}
/**
 * Create a minimal valid TTF font file for testing
 * This creates a very simple font with just a few tables
 */
function createMockTTFFont() {
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
function createMockWOFF2Font() {
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
function createMockOTFFont() {
    // OTF signature: 'OTTO'
    const signature = Buffer.from([0x4f, 0x54, 0x54, 0x4f]);
    const restOfFont = Buffer.alloc(200); // Simplified
    return Buffer.concat([signature, restOfFont]);
}
/**
 * Create a mock WOFF font file
 */
function createMockWOFFFont() {
    // WOFF signature: 'wOFF'
    const signature = Buffer.from([0x77, 0x4f, 0x46, 0x46]);
    const restOfFont = Buffer.alloc(200); // Simplified
    return Buffer.concat([signature, restOfFont]);
}
/**
 * Create an invalid font file (corrupted)
 */
function createInvalidFont() {
    return Buffer.from([0x00, 0x00, 0x00, 0x00]); // Invalid signature
}
/**
 * Write mock font to file
 */
function writeMockFont(filePath, type = "ttf") {
    let buffer;
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
function getFixturePath(filename) {
    return path.join(__dirname, "fixtures", filename);
}
/**
 * Assert file exists
 */
function assertFileExists(filePath) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Expected file to exist: ${filePath}`);
    }
}
/**
 * Assert file does not exist
 */
function assertFileNotExists(filePath) {
    if (fs.existsSync(filePath)) {
        throw new Error(`Expected file to not exist: ${filePath}`);
    }
}
/**
 * Get file size
 */
function getFileSize(filePath) {
    return fs.statSync(filePath).size;
}
/**
 * Mock console methods for testing
 */
function mockConsole() {
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;
    const logs = [];
    const warnings = [];
    const errors = [];
    console.log = (...args) => {
        logs.push(args.join(" "));
    };
    console.warn = (...args) => {
        warnings.push(args.join(" "));
    };
    console.error = (...args) => {
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
//# sourceMappingURL=test-utils.js.map