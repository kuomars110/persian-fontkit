"use strict";
/**
 * Tests for utils/file.ts
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
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const file_1 = require("../src/utils/file");
const test_utils_1 = require("./test-utils");
describe("File Utils", () => {
    let tempDir;
    beforeEach(() => {
        tempDir = (0, test_utils_1.createTempDir)();
    });
    afterEach(() => {
        (0, test_utils_1.cleanupTempDir)(tempDir);
    });
    describe("fileExists", () => {
        it("should return true for existing file", async () => {
            const filePath = path.join(tempDir, "test.txt");
            fs.writeFileSync(filePath, "test");
            const exists = await (0, file_1.fileExists)(filePath);
            expect(exists).toBe(true);
        });
        it("should return false for non-existent file", async () => {
            const filePath = path.join(tempDir, "nonexistent.txt");
            const exists = await (0, file_1.fileExists)(filePath);
            expect(exists).toBe(false);
        });
    });
    describe("ensureDir", () => {
        it("should create directory if it does not exist", async () => {
            const dirPath = path.join(tempDir, "new-dir");
            await (0, file_1.ensureDir)(dirPath);
            expect(fs.existsSync(dirPath)).toBe(true);
            expect(fs.statSync(dirPath).isDirectory()).toBe(true);
        });
        it("should create nested directories", async () => {
            const dirPath = path.join(tempDir, "level1", "level2", "level3");
            await (0, file_1.ensureDir)(dirPath);
            expect(fs.existsSync(dirPath)).toBe(true);
        });
        it("should not fail if directory already exists", async () => {
            await (0, file_1.ensureDir)(tempDir);
            // Should not throw
            await expect((0, file_1.ensureDir)(tempDir)).resolves.not.toThrow();
        });
    });
    describe("readFileBuffer and writeFileBuffer", () => {
        it("should write and read buffer correctly", async () => {
            const filePath = path.join(tempDir, "buffer-test.bin");
            const testBuffer = Buffer.from([0x01, 0x02, 0x03, 0x04]);
            await (0, file_1.writeFileBuffer)(filePath, testBuffer);
            const readBuffer = await (0, file_1.readFileBuffer)(filePath);
            expect(readBuffer).toEqual(testBuffer);
        });
        it("should create directory when writing file", async () => {
            const filePath = path.join(tempDir, "subdir", "file.bin");
            const testBuffer = Buffer.from("test");
            await (0, file_1.writeFileBuffer)(filePath, testBuffer);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });
    describe("getFontFiles", () => {
        it("should find all font files in directory", async () => {
            (0, test_utils_1.writeMockFont)(path.join(tempDir, "font1.ttf"), "ttf");
            (0, test_utils_1.writeMockFont)(path.join(tempDir, "font2.otf"), "otf");
            (0, test_utils_1.writeMockFont)(path.join(tempDir, "font3.woff"), "woff");
            (0, test_utils_1.writeMockFont)(path.join(tempDir, "font4.woff2"), "woff2");
            fs.writeFileSync(path.join(tempDir, "not-font.txt"), "test");
            const fonts = await (0, file_1.getFontFiles)(tempDir);
            expect(fonts).toHaveLength(4);
            expect(fonts.map((f) => path.basename(f)).sort()).toEqual([
                "font1.ttf",
                "font2.otf",
                "font3.woff",
                "font4.woff2",
            ]);
        });
        it("should return empty array for directory with no fonts", async () => {
            const fonts = await (0, file_1.getFontFiles)(tempDir);
            expect(fonts).toEqual([]);
        });
        it("should throw error for non-existent directory", async () => {
            const nonExistentDir = path.join(tempDir, "nonexistent");
            await expect((0, file_1.getFontFiles)(nonExistentDir)).rejects.toThrow();
        });
    });
    describe("generateHash", () => {
        it("should generate consistent hash for same content", () => {
            const buffer = Buffer.from("test content");
            const hash1 = (0, file_1.generateHash)(buffer);
            const hash2 = (0, file_1.generateHash)(buffer);
            expect(hash1).toBe(hash2);
        });
        it("should generate different hash for different content", () => {
            const buffer1 = Buffer.from("content1");
            const buffer2 = Buffer.from("content2");
            const hash1 = (0, file_1.generateHash)(buffer1);
            const hash2 = (0, file_1.generateHash)(buffer2);
            expect(hash1).not.toBe(hash2);
        });
        it("should respect length parameter", () => {
            const buffer = Buffer.from("test");
            const hash4 = (0, file_1.generateHash)(buffer, 4);
            const hash8 = (0, file_1.generateHash)(buffer, 8);
            expect(hash4).toHaveLength(4);
            expect(hash8).toHaveLength(8);
        });
    });
    describe("generateOptimizedFilename", () => {
        it("should generate filename with hash", () => {
            const filename = (0, file_1.generateOptimizedFilename)("vazir-regular.ttf", "abc123", ".woff2");
            expect(filename).toBe("vazir-regular-abc123.woff2");
        });
        it("should remove original extension", () => {
            const filename = (0, file_1.generateOptimizedFilename)("font.ttf", "hash", ".woff2");
            expect(filename).not.toContain(".ttf");
            expect(filename).toContain(".woff2");
        });
    });
    describe("formatFileSize", () => {
        it("should format bytes correctly", () => {
            expect((0, file_1.formatFileSize)(0)).toBe("0 B");
            expect((0, file_1.formatFileSize)(500)).toBe("500 B");
            expect((0, file_1.formatFileSize)(1024)).toBe("1 KB");
            expect((0, file_1.formatFileSize)(1536)).toBe("1.5 KB");
            expect((0, file_1.formatFileSize)(1048576)).toBe("1 MB");
            expect((0, file_1.formatFileSize)(1073741824)).toBe("1 GB");
        });
    });
    describe("calculateReduction", () => {
        it("should calculate percentage correctly", () => {
            expect((0, file_1.calculateReduction)(1000, 500)).toBe("50.0");
            expect((0, file_1.calculateReduction)(1000, 750)).toBe("25.0");
            expect((0, file_1.calculateReduction)(1000, 250)).toBe("75.0");
        });
        it("should handle zero reduction", () => {
            expect((0, file_1.calculateReduction)(1000, 1000)).toBe("0.0");
        });
    });
    describe("getFontMetadata", () => {
        it("should return correct metadata", async () => {
            const fontPath = path.join(tempDir, "test-font.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const metadata = await (0, file_1.getFontMetadata)(fontPath);
            expect(metadata.path).toBe(fontPath);
            expect(metadata.name).toBe("test-font.ttf");
            expect(metadata.extension).toBe(".ttf");
            expect(metadata.size).toBeGreaterThan(0);
            expect(metadata.sizeFormatted).toContain("B");
        });
    });
});
//# sourceMappingURL=file.test.js.map