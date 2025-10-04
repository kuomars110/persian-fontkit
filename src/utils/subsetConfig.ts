/**
 * Persian character ranges and subset configuration
 * Includes Persian, Arabic, and essential Latin characters
 */

export interface SubsetConfig {
  name: string;
  unicodeRanges: string[];
  description: string;
}

/**
 * Predefined subset configurations for Persian fonts
 */
export const SUBSET_CONFIGS: Record<string, SubsetConfig> = {
  farsi: {
    name: "farsi",
    unicodeRanges: [
      "U+0600-06FF", // Arabic (includes Persian)
      "U+0750-077F", // Arabic Supplement
      "U+FB50-FDFF", // Arabic Presentation Forms-A
      "U+FE70-FEFF", // Arabic Presentation Forms-B
      "U+200C-200E", // Zero Width Non-Joiner, etc.
      "U+2010-2019", // Dashes and quotes
      "U+00AB", // Left-pointing double angle quotation mark
      "U+00BB", // Right-pointing double angle quotation mark
    ],
    description: "Persian and Arabic characters",
  },
  latin: {
    name: "latin",
    unicodeRanges: [
      "U+0020-007E", // Basic Latin
      "U+00A0-00FF", // Latin-1 Supplement
    ],
    description: "Basic Latin characters",
  },
  numbers: {
    name: "numbers",
    unicodeRanges: [
      "U+0030-0039", // ASCII digits
      "U+06F0-06F9", // Persian digits
      "U+0660-0669", // Arabic-Indic digits
    ],
    description: "Latin and Persian numbers",
  },
  punctuation: {
    name: "punctuation",
    unicodeRanges: [
      "U+0020-002F", // Space and basic punctuation
      "U+003A-0040", // Colon to @
      "U+005B-0060", // Brackets and backtick
      "U+007B-007E", // Braces and tilde
      "U+060C", // Arabic comma
      "U+061B", // Arabic semicolon
      "U+061F", // Arabic question mark
    ],
    description: "Punctuation marks",
  },
};

/**
 * Converts subset configuration to character set for subset-font
 */
export function getCharacterSet(subsets: string[]): string {
  const ranges: string[] = [];

  for (const subset of subsets) {
    const config = SUBSET_CONFIGS[subset];
    if (config) {
      ranges.push(...config.unicodeRanges);
    }
  }

  // Convert unicode ranges to character set
  // subset-font accepts unicode ranges as-is
  return ranges.join(",");
}

/**
 * Get all characters from specified subsets
 */
export function getSubsetCharacters(subsets: string[]): string[] {
  const characters: string[] = [];

  for (const subset of subsets) {
    const config = SUBSET_CONFIGS[subset];
    if (config) {
      for (const range of config.unicodeRanges) {
        // Parse unicode range like U+0600-06FF
        const match = range.match(/U\+([0-9A-F]+)(?:-([0-9A-F]+))?/);
        if (match) {
          const start = parseInt(match[1], 16);
          const end = match[2] ? parseInt(match[2], 16) : start;

          for (let code = start; code <= end; code++) {
            characters.push(String.fromCodePoint(code));
          }
        }
      }
    }
  }

  return characters;
}

/**
 * Default subset configuration for Persian fonts
 */
export const DEFAULT_SUBSETS = ["farsi", "latin", "numbers", "punctuation"];

/**
 * Popular Persian font families
 */
export const PERSIAN_FONTS = [
  "Vazir",
  "IRANSans",
  "Shabnam",
  "Yekan",
  "Kalameh",
  "Samim",
  "Sahel",
  "Tanha",
  "Parastoo",
  "Gandom",
];
