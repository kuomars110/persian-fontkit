/**
 * Tests for errors.ts
 */

import {
  PersianFontKitError,
  FontOptimizationError,
  ValidationError,
  FileOperationError,
  UnsupportedFormatError,
  InvalidFontError,
} from "../src/errors";

describe("Custom Errors", () => {
  describe("PersianFontKitError", () => {
    it("should create error with message", () => {
      const error = new PersianFontKitError("Test error");

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Test error");
      expect(error.name).toBe("PersianFontKitError");
    });

    it("should include error code", () => {
      const error = new PersianFontKitError("Test error", "TEST_CODE");

      expect(error.code).toBe("TEST_CODE");
    });
  });

  describe("FontOptimizationError", () => {
    it("should include font path", () => {
      const error = new FontOptimizationError(
        "Optimization failed",
        "/path/to/font.ttf"
      );

      expect(error.message).toBe("Optimization failed");
      expect(error.fontPath).toBe("/path/to/font.ttf");
      expect(error.name).toBe("FontOptimizationError");
      expect(error.code).toBe("FONT_OPTIMIZATION_ERROR");
    });

    it("should include original error", () => {
      const originalError = new Error("Original error");
      const error = new FontOptimizationError(
        "Wrapper",
        "/font.ttf",
        originalError
      );

      expect(error.originalError).toBe(originalError);
    });
  });

  describe("ValidationError", () => {
    it("should include field and value", () => {
      const error = new ValidationError("Invalid input", "fontWeight", 1000);

      expect(error.message).toBe("Invalid input");
      expect(error.field).toBe("fontWeight");
      expect(error.value).toBe(1000);
      expect(error.name).toBe("ValidationError");
    });
  });

  describe("FileOperationError", () => {
    it("should include file path and operation", () => {
      const error = new FileOperationError(
        "Cannot read file",
        "/path/to/file",
        "read"
      );

      expect(error.message).toBe("Cannot read file");
      expect(error.filePath).toBe("/path/to/file");
      expect(error.operation).toBe("read");
      expect(error.name).toBe("FileOperationError");
    });
  });

  describe("UnsupportedFormatError", () => {
    it("should include format and supported formats", () => {
      const error = new UnsupportedFormatError("Unsupported format", ".svg", [
        ".ttf",
        ".otf",
      ]);

      expect(error.message).toBe("Unsupported format");
      expect(error.format).toBe(".svg");
      expect(error.supportedFormats).toEqual([".ttf", ".otf"]);
      expect(error.name).toBe("UnsupportedFormatError");
    });
  });

  describe("InvalidFontError", () => {
    it("should include font path and reason", () => {
      const error = new InvalidFontError(
        "Invalid font",
        "/font.ttf",
        "Corrupted header"
      );

      expect(error.message).toBe("Invalid font");
      expect(error.fontPath).toBe("/font.ttf");
      expect(error.reason).toBe("Corrupted header");
      expect(error.name).toBe("InvalidFontError");
    });
  });
});
