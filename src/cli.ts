#!/usr/bin/env node

/**
 * CLI interface for persian-fontkit
 */

import { Command } from "commander";
import * as path from "path";
import chalk from "chalk";
import {
  optimizeFont,
  generateOptimizedCSS,
  parseFontWeight,
  parseFontStyle,
  type OptimizationResult,
} from "./optimizer";
import { getFontFiles, ensureDir, formatFileSize } from "./utils/file";
import { DEFAULT_SUBSETS } from "./utils/subsetConfig";

const program = new Command();

program
  .name("persian-fontkit")
  .description("Optimize Persian (Farsi) web fonts for better performance")
  .version("1.0.0");

program
  .command("optimize")
  .description("Optimize Persian fonts in a directory")
  .argument("<input>", "Input directory containing font files")
  .option("-o, --output <dir>", "Output directory", "./dist/fonts")
  .option(
    "-s, --subsets <subsets...>",
    "Subsets to include (farsi, latin, numbers, punctuation)",
    DEFAULT_SUBSETS
  )
  .option("-f, --format <format>", "Output format (woff2, woff, ttf)", "woff2")
  .option("--no-hash", "Disable hash in filenames")
  .option("--css <filename>", "CSS output filename", "fonts.css")
  .option("--no-cache", "Disable caching")
  .option("--cache-dir <dir>", "Cache directory", ".persian-fontkit-cache")
  .action(async (input: string, options: any) => {
    try {
      console.log(chalk.blue.bold("\n🚀 Persian FontKit Optimizer\n"));

      // Resolve paths
      const inputDir = path.resolve(input);
      const outputDir = path.resolve(options.output);

      // Validate input directory exists
      if (!require("fs").existsSync(inputDir)) {
        console.error(
          chalk.red(`\n✗ Error: Input directory not found: ${inputDir}\n`)
        );
        process.exit(1);
      }

      console.log(chalk.gray(`Input:  ${inputDir}`));
      console.log(chalk.gray(`Output: ${outputDir}\n`));

      // Ensure output directory exists
      try {
        await ensureDir(outputDir);
      } catch (error: any) {
        console.error(
          chalk.red(
            `\n✗ Error: Cannot create output directory: ${error.message}\n`
          )
        );
        process.exit(1);
      }

      // Get font files
      console.log(chalk.cyan("📁 Scanning for font files..."));
      let fontFiles: string[];
      try {
        fontFiles = await getFontFiles(inputDir);
      } catch (error: any) {
        console.error(
          chalk.red(`\n✗ Error: Failed to scan directory: ${error.message}\n`)
        );
        process.exit(1);
      }

      if (fontFiles.length === 0) {
        console.log(
          chalk.yellow("⚠️  No font files found in the input directory.")
        );
        console.log(
          chalk.gray("Supported formats: .ttf, .otf, .woff, .woff2\n")
        );
        process.exit(1);
      }

      console.log(chalk.green(`✓ Found ${fontFiles.length} font file(s)\n`));

      // Optimize fonts
      const results: OptimizationResult[] = [];

      for (let i = 0; i < fontFiles.length; i++) {
        const fontFile = fontFiles[i];
        const filename = path.basename(fontFile);

        console.log(
          chalk.cyan(`[${i + 1}/${fontFiles.length}] Optimizing ${filename}...`)
        );

        try {
          // Parse font weight and style from filename
          const fontWeight = parseFontWeight(filename);
          const fontStyle = parseFontStyle(filename);

          const result = await optimizeFont({
            inputPath: fontFile,
            outputDir,
            subsets: options.subsets,
            format: options.format,
            useHash: options.hash,
            fontWeight,
            fontStyle,
            cache: options.cache !== false,
            cacheDir: options.cacheDir,
          });

          results.push(result);

          console.log(
            chalk.gray(`  Original:  ${result.original.sizeFormatted}`)
          );
          console.log(
            chalk.gray(`  Optimized: ${result.optimized.sizeFormatted}`)
          );
          console.log(chalk.green(`  ✓ Reduced by ${result.reduction}%\n`));
        } catch (error: any) {
          // Show user-friendly error message
          let errorMessage = error.message;

          if (error.name === "ValidationError") {
            errorMessage = `Validation failed: ${error.message}`;
          } else if (error.name === "FontOptimizationError") {
            errorMessage = `Optimization failed: ${error.message}`;
          } else if (error.name === "InvalidFontError") {
            errorMessage = `Invalid font: ${error.message}`;
          }

          console.log(chalk.red(`  ✗ ${errorMessage}\n`));

          // Show original error in verbose mode
          if (process.env.DEBUG) {
            console.log(chalk.gray(`  Debug: ${error.stack}\n`));
          }
        }
      }

      if (results.length === 0) {
        console.log(chalk.red("✗ No fonts were successfully optimized.\n"));
        process.exit(1);
      }

      // Generate CSS
      const cssPath = path.join(outputDir, options.css);
      await generateOptimizedCSS(results, cssPath);

      // Summary
      console.log(chalk.green.bold("✨ Optimization complete!\n"));
      console.log(chalk.cyan("📊 Summary:"));
      console.log(chalk.gray(`  Total fonts processed: ${results.length}`));

      const totalOriginal = results.reduce(
        (sum, r) => sum + r.original.size,
        0
      );
      const totalOptimized = results.reduce(
        (sum, r) => sum + r.optimized.size,
        0
      );

      console.log(
        chalk.gray(`  Original size:  ${formatFileSize(totalOriginal)}`)
      );
      console.log(
        chalk.gray(`  Optimized size: ${formatFileSize(totalOptimized)}`)
      );
      console.log(
        chalk.gray(
          `  Total saved:    ${formatFileSize(totalOriginal - totalOptimized)}`
        )
      );

      const reduction = (
        ((totalOriginal - totalOptimized) / totalOriginal) *
        100
      ).toFixed(1);
      console.log(chalk.green(`  Size reduction: ${reduction}%`));

      console.log(
        chalk.gray(`\n  CSS file: ${path.relative(process.cwd(), cssPath)}`)
      );
      console.log(
        chalk.gray(`  Fonts:    ${path.relative(process.cwd(), outputDir)}\n`)
      );

      console.log(chalk.blue("💡 Next steps:"));
      console.log(chalk.gray("  1. Import the CSS file in your project"));
      console.log(
        chalk.gray("  2. Copy the optimized fonts to your public directory")
      );
      console.log(chalk.gray("  3. Use the fonts in your CSS or components\n"));
    } catch (error: any) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command("cache")
  .description("Manage optimization cache")
  .option("-c, --clear", "Clear the cache")
  .option("-s, --stats", "Show cache statistics")
  .option("--cache-dir <dir>", "Cache directory", ".persian-fontkit-cache")
  .action(async (options: any) => {
    try {
      const { getGlobalCache } = await import("./utils/cache");
      const cache = getGlobalCache(options.cacheDir);

      if (options.clear) {
        console.log(chalk.blue("\n🗑️  Clearing cache...\n"));
        await cache.clear();
        console.log(chalk.green("✓ Cache cleared successfully\n"));
      } else if (options.stats) {
        console.log(chalk.blue("\n📊 Cache Statistics\n"));
        const stats = await cache.getStats();

        console.log(chalk.gray(`Entries:      ${stats.entries}`));
        console.log(
          chalk.gray(`Total Size:   ${formatFileSize(stats.totalSize)}`)
        );

        if (stats.oldestEntry) {
          const oldest = new Date(stats.oldestEntry).toLocaleString();
          console.log(chalk.gray(`Oldest Entry: ${oldest}`));
        }

        if (stats.newestEntry) {
          const newest = new Date(stats.newestEntry).toLocaleString();
          console.log(chalk.gray(`Newest Entry: ${newest}`));
        }

        console.log();
      } else {
        console.log(
          chalk.yellow("\n⚠️  Please specify an action: --clear or --stats\n")
        );
      }
    } catch (error: any) {
      console.error(chalk.red(`\n✗ Error: ${error.message}\n`));
      process.exit(1);
    }
  });

program
  .command("info")
  .description("Show information about persian-fontkit")
  .action(() => {
    console.log(chalk.blue.bold("\n🎨 Persian FontKit v1.0.0\n"));
    console.log(
      chalk.cyan("A powerful tool for optimizing Persian web fonts\n")
    );

    console.log(chalk.bold("Features:"));
    console.log(chalk.gray("  • Font subsetting (reduce size by 60-80%)"));
    console.log(chalk.gray("  • Automatic CSS generation"));
    console.log(
      chalk.gray("  • Support for multiple formats (woff2, woff, ttf)")
    );
    console.log(chalk.gray("  • Cache-busting with file hashing"));
    console.log(chalk.gray("  • Smart caching system"));
    console.log(chalk.gray("  • React hooks for dynamic loading"));
    console.log(chalk.gray("  • Next.js integration\n"));

    console.log(chalk.bold("Supported Subsets:"));
    console.log(chalk.gray("  • farsi     - Persian and Arabic characters"));
    console.log(chalk.gray("  • latin     - Basic Latin characters"));
    console.log(chalk.gray("  • numbers   - Persian and Latin digits"));
    console.log(chalk.gray("  • punctuation - Common punctuation marks\n"));

    console.log(chalk.bold("Popular Persian Fonts:"));
    console.log(
      chalk.gray("  Vazir, IRANSans, Shabnam, Yekan, Kalameh, Samim\n")
    );

    console.log(
      chalk.cyan(
        "Documentation: https://github.com/kuomars110/persian-fontkit\n"
      )
    );
  });

// Parse arguments
program.parse();
