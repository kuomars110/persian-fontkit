/**
 * Custom error classes for persian-fontkit
 */

/**
 * Base error class for all persian-fontkit errors
 */
export class PersianFontKitError extends Error {
  constructor(message: string, public readonly code?: string) {
    super(message);
    this.name = "PersianFontKitError";
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Thrown when font optimization fails
 */
export class FontOptimizationError extends PersianFontKitError {
  constructor(
    message: string,
    public readonly fontPath: string,
    public readonly originalError?: Error
  ) {
    super(message, "FONT_OPTIMIZATION_ERROR");
    this.name = "FontOptimizationError";
  }
}

/**
 * Thrown when input validation fails
 */
export class ValidationError extends PersianFontKitError {
  constructor(
    message: string,
    public readonly field?: string,
    public readonly value?: any
  ) {
    super(message, "VALIDATION_ERROR");
    this.name = "ValidationError";
  }
}

/**
 * Thrown when a file operation fails
 */
export class FileOperationError extends PersianFontKitError {
  constructor(
    message: string,
    public readonly filePath: string,
    public readonly operation: "read" | "write" | "delete" | "create",
    public readonly originalError?: Error
  ) {
    super(message, "FILE_OPERATION_ERROR");
    this.name = "FileOperationError";
  }
}

/**
 * Thrown when font file format is not supported
 */
export class UnsupportedFormatError extends PersianFontKitError {
  constructor(
    message: string,
    public readonly format: string,
    public readonly supportedFormats: string[]
  ) {
    super(message, "UNSUPPORTED_FORMAT_ERROR");
    this.name = "UnsupportedFormatError";
  }
}

/**
 * Thrown when font file is invalid or corrupted
 */
export class InvalidFontError extends PersianFontKitError {
  constructor(
    message: string,
    public readonly fontPath: string,
    public readonly reason?: string
  ) {
    super(message, "INVALID_FONT_ERROR");
    this.name = "InvalidFontError";
  }
}
