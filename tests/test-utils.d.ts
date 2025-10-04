/**
 * Test utilities and helpers
 */
/**
 * Create a temporary directory for tests
 */
export declare function createTempDir(prefix?: string): string;
/**
 * Clean up temporary directory
 */
export declare function cleanupTempDir(dirPath: string): void;
/**
 * Create a minimal valid TTF font file for testing
 * This creates a very simple font with just a few tables
 */
export declare function createMockTTFFont(): Buffer;
/**
 * Create a mock WOFF2 font file
 */
export declare function createMockWOFF2Font(): Buffer;
/**
 * Create a mock OTF font file
 */
export declare function createMockOTFFont(): Buffer;
/**
 * Create a mock WOFF font file
 */
export declare function createMockWOFFFont(): Buffer;
/**
 * Create an invalid font file (corrupted)
 */
export declare function createInvalidFont(): Buffer;
/**
 * Write mock font to file
 */
export declare function writeMockFont(filePath: string, type?: "ttf" | "otf" | "woff" | "woff2" | "invalid"): void;
/**
 * Get fixture file path
 */
export declare function getFixturePath(filename: string): string;
/**
 * Assert file exists
 */
export declare function assertFileExists(filePath: string): void;
/**
 * Assert file does not exist
 */
export declare function assertFileNotExists(filePath: string): void;
/**
 * Get file size
 */
export declare function getFileSize(filePath: string): number;
/**
 * Mock console methods for testing
 */
export declare function mockConsole(): {
    logs: string[];
    warnings: string[];
    errors: string[];
    restore: () => void;
};
//# sourceMappingURL=test-utils.d.ts.map