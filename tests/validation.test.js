"use strict";
/**
 * Tests for validation utilities
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
const validation_1 = require("../src/validation");
const errors_1 = require("../src/errors");
const test_utils_1 = require("./test-utils");
describe("Validation", () => {
    let tempDir;
    beforeEach(() => {
        tempDir = (0, test_utils_1.createTempDir)();
    });
    afterEach(() => {
        (0, test_utils_1.cleanupTempDir)(tempDir);
    });
    describe("validateOptimizationOptions", () => {
        it("should pass with valid options", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).not.toThrow();
        });
        it("should throw ValidationError when inputPath is missing", () => {
            const options = {
                inputPath: "",
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError when inputPath is not a string", () => {
            const options = {
                inputPath: 123,
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError when file does not exist", () => {
            const options = {
                inputPath: path.join(tempDir, "nonexistent.ttf"),
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw UnsupportedFormatError for unsupported format", () => {
            const fontPath = path.join(tempDir, "test.txt");
            fs.writeFileSync(fontPath, "not a font");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.UnsupportedFormatError);
        });
        it("should throw ValidationError when file is empty", () => {
            const fontPath = path.join(tempDir, "empty.ttf");
            fs.writeFileSync(fontPath, "");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.InvalidFontError);
        });
        it("should throw error when inputPath is a directory", () => {
            const options = {
                inputPath: tempDir,
                outputDir: tempDir,
            };
            // Directory has no extension, so it throws UnsupportedFormatError
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow();
        });
        it("should throw ValidationError when outputDir is missing", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: "",
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw UnsupportedFormatError for invalid output format", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
                format: "invalid",
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.UnsupportedFormatError);
        });
        it("should throw ValidationError for invalid font weight", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
                fontWeight: 1000, // Invalid: > 900
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError for invalid font style", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
                fontStyle: "oblique", // Invalid
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError for invalid font display", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
                fontDisplay: "invalid",
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError when subsets is not an array", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            const options = {
                inputPath: fontPath,
                outputDir: tempDir,
                subsets: "farsi", // Should be array
            };
            expect(() => (0, validation_1.validateOptimizationOptions)(options)).toThrow(errors_1.ValidationError);
        });
    });
    describe("validateFontFile", () => {
        it("should pass for valid TTF file", () => {
            const fontPath = path.join(tempDir, "test.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "ttf");
            expect(() => (0, validation_1.validateFontFile)(fontPath)).not.toThrow();
        });
        it("should pass for valid OTF file", () => {
            const fontPath = path.join(tempDir, "test.otf");
            (0, test_utils_1.writeMockFont)(fontPath, "otf");
            expect(() => (0, validation_1.validateFontFile)(fontPath)).not.toThrow();
        });
        it("should pass for valid WOFF file", () => {
            const fontPath = path.join(tempDir, "test.woff");
            (0, test_utils_1.writeMockFont)(fontPath, "woff");
            expect(() => (0, validation_1.validateFontFile)(fontPath)).not.toThrow();
        });
        it("should pass for valid WOFF2 file", () => {
            const fontPath = path.join(tempDir, "test.woff2");
            (0, test_utils_1.writeMockFont)(fontPath, "woff2");
            expect(() => (0, validation_1.validateFontFile)(fontPath)).not.toThrow();
        });
        it("should throw InvalidFontError for corrupted TTF file", () => {
            const fontPath = path.join(tempDir, "invalid.ttf");
            (0, test_utils_1.writeMockFont)(fontPath, "invalid");
            expect(() => (0, validation_1.validateFontFile)(fontPath)).toThrow(errors_1.InvalidFontError);
        });
    });
    describe("validateDirectory", () => {
        it("should pass for valid directory path", () => {
            expect(() => (0, validation_1.validateDirectory)(tempDir)).not.toThrow();
        });
        it("should pass for non-existent directory", () => {
            const newDir = path.join(tempDir, "new-dir");
            expect(() => (0, validation_1.validateDirectory)(newDir)).not.toThrow();
        });
        it("should throw ValidationError when path is empty", () => {
            expect(() => (0, validation_1.validateDirectory)("")).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError when path is not a string", () => {
            expect(() => (0, validation_1.validateDirectory)(123)).toThrow(errors_1.ValidationError);
        });
        it("should throw ValidationError when path is a file", () => {
            const filePath = path.join(tempDir, "file.txt");
            fs.writeFileSync(filePath, "test");
            expect(() => (0, validation_1.validateDirectory)(filePath)).toThrow(errors_1.ValidationError);
        });
    });
    describe("Constants", () => {
        it("should export SUPPORTED_FORMATS", () => {
            expect(validation_1.SUPPORTED_FORMATS).toEqual([".ttf", ".otf", ".woff", ".woff2"]);
        });
        it("should export SUPPORTED_OUTPUT_FORMATS", () => {
            expect(validation_1.SUPPORTED_OUTPUT_FORMATS).toEqual(["woff2", "woff", "ttf"]);
        });
    });
});
//# sourceMappingURL=validation.test.js.map