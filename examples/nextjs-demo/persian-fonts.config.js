/**
 * Persian Fonts Configuration
 * Used by persian-fontkit for automatic optimization
 */

module.exports = {
  fonts: [
    {
      family: "Vazir",
      weights: [400, 700],
      subsets: ["farsi", "latin", "numbers"],
    },
    {
      family: "IRANSans",
      weights: [400, 500, 700],
      subsets: ["farsi", "latin"],
    },
  ],
  sourceDir: "./public/fonts",
  outputDir: "./public/fonts/optimized",
  format: "woff2",
  verbose: true,
};
