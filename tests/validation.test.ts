/**
 * Tests for validation utilities
 */

import * as path from "path";
import * as fs from "fs";
import {
  validateOptimizationOptions,
  validateFontFile,
  validateDirectory,
  SUPPORTED_FORMATS,
  SUPPORTED_OUTPUT_FORMATS,
} from "../src/validation";
import {
  ValidationError,
  UnsupportedFormatError,
  InvalidFontError,
} from "../src/errors";
import { createTempDir, cleanupTempDir, writeMockFont } from "./test-utils";

describe("Validation", () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = createTempDir();
  });

  afterEach(() => {
    cleanupTempDir(tempDir);
  });

  describe("validateOptimizationOptions", () => {
    it("should pass with valid options", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).not.toThrow();
    });

    it("should throw ValidationError when inputPath is missing", () => {
      const options = {
        inputPath: "",
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when inputPath is not a string", () => {
      const options = {
        inputPath: 123 as any,
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when file does not exist", () => {
      const options = {
        inputPath: path.join(tempDir, "nonexistent.ttf"),
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw UnsupportedFormatError for unsupported format", () => {
      const fontPath = path.join(tempDir, "test.txt");
      fs.writeFileSync(fontPath, "not a font");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        UnsupportedFormatError
      );
    });

    it("should throw ValidationError when file is empty", () => {
      const fontPath = path.join(tempDir, "empty.ttf");
      fs.writeFileSync(fontPath, "");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        InvalidFontError
      );
    });

    it("should throw error when inputPath is a directory", () => {
      const options = {
        inputPath: tempDir,
        outputDir: tempDir,
      };

      // Directory has no extension, so it throws UnsupportedFormatError
      expect(() => validateOptimizationOptions(options)).toThrow();
    });

    it("should throw ValidationError when outputDir is missing", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: "",
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw UnsupportedFormatError for invalid output format", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
        format: "invalid" as any,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        UnsupportedFormatError
      );
    });

    it("should throw ValidationError for invalid font weight", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
        fontWeight: 1000, // Invalid: > 900
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError for invalid font style", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
        fontStyle: "oblique" as any, // Invalid
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError for invalid font display", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
        fontDisplay: "invalid" as any,
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });

    it("should throw ValidationError when subsets is not an array", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      const options = {
        inputPath: fontPath,
        outputDir: tempDir,
        subsets: "farsi" as any, // Should be array
      };

      expect(() => validateOptimizationOptions(options)).toThrow(
        ValidationError
      );
    });
  });

  describe("validateFontFile", () => {
    it("should pass for valid TTF file", () => {
      const fontPath = path.join(tempDir, "test.ttf");
      writeMockFont(fontPath, "ttf");

      expect(() => validateFontFile(fontPath)).not.toThrow();
    });

    it("should pass for valid OTF file", () => {
      const fontPath = path.join(tempDir, "test.otf");
      writeMockFont(fontPath, "otf");

      expect(() => validateFontFile(fontPath)).not.toThrow();
    });

    it("should pass for valid WOFF file", () => {
      const fontPath = path.join(tempDir, "test.woff");
      writeMockFont(fontPath, "woff");

      expect(() => validateFontFile(fontPath)).not.toThrow();
    });

    it("should pass for valid WOFF2 file", () => {
      const fontPath = path.join(tempDir, "test.woff2");
      writeMockFont(fontPath, "woff2");

      expect(() => validateFontFile(fontPath)).not.toThrow();
    });

    it("should throw InvalidFontError for corrupted TTF file", () => {
      const fontPath = path.join(tempDir, "invalid.ttf");
      writeMockFont(fontPath, "invalid");

      expect(() => validateFontFile(fontPath)).toThrow(InvalidFontError);
    });
  });

  describe("validateDirectory", () => {
    it("should pass for valid directory path", () => {
      expect(() => validateDirectory(tempDir)).not.toThrow();
    });

    it("should pass for non-existent directory", () => {
      const newDir = path.join(tempDir, "new-dir");
      expect(() => validateDirectory(newDir)).not.toThrow();
    });

    it("should throw ValidationError when path is empty", () => {
      expect(() => validateDirectory("")).toThrow(ValidationError);
    });

    it("should throw ValidationError when path is not a string", () => {
      expect(() => validateDirectory(123 as any)).toThrow(ValidationError);
    });

    it("should throw ValidationError when path is a file", () => {
      const filePath = path.join(tempDir, "file.txt");
      fs.writeFileSync(filePath, "test");

      expect(() => validateDirectory(filePath)).toThrow(ValidationError);
    });
  });

  describe("Constants", () => {
    it("should export SUPPORTED_FORMATS", () => {
      expect(SUPPORTED_FORMATS).toEqual([".ttf", ".otf", ".woff", ".woff2"]);
    });

    it("should export SUPPORTED_OUTPUT_FORMATS", () => {
      expect(SUPPORTED_OUTPUT_FORMATS).toEqual(["woff2", "woff", "ttf"]);
    });
  });
});
