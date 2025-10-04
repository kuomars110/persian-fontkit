# 🎨 Persian FontKit

<div align="center">

[![npm version](https://img.shields.io/npm/v/persian-fontkit.svg)](https://www.npmjs.com/package/persian-fontkit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)

**Automatic Persian (Farsi) web font optimizer for Next.js and React**

Reduce font file sizes by 60-80% • Improve Core Web Vitals • SSR-Safe • Zero Config

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [Examples](#-examples) • [API](#-api)

</div>

---

## 🧩 Problem this Solves

Persian fonts like **Vazir**, **IRANSans**, **Shabnam**, **Yekan**, and **Kalameh** are typically **2-4 MB** in size, causing:

- ⏱️ Slow page load times
- 📉 Poor Core Web Vitals scores
- 💸 Higher bandwidth costs
- 😞 Bad user experience

**persian-fontkit** automatically:

✅ Subsets unused glyphs (60-80% size reduction)  
✅ Generates optimized `.woff2` files  
✅ Creates CSS with `font-display: swap`  
✅ Adds preload tags for faster loading  
✅ Provides React hooks for dynamic loading  
✅ Integrates seamlessly with Next.js

---

## ⚡ Features

### 🔧 CLI Tool

- Optimize entire font directories with one command
- Support for `.ttf`, `.otf`, `.woff`, `.woff2` formats
- Automatic subset generation (Persian + Latin + Numbers)
- Hash-based cache-busting filenames
- Beautiful CLI output with progress tracking

### ⚛️ React Integration

- `usePersianFont` hook for dynamic font loading
- SSR-safe (works with Next.js server components)
- Automatic `<link rel="preload">` injection
- TypeScript support with full type definitions

### 🚀 Next.js Plugin

- Automatic font optimization during build
- Zero-config setup for Next.js 13, 14, and 15
- App Router and Pages Router support
- Works with `next/font/local` patterns

---

## 📦 Installation

```bash
npm install persian-fontkit
# or
yarn add persian-fontkit
# or
pnpm add persian-fontkit
```

---

## 🚀 Quick Start

### 1. CLI Usage

Optimize all fonts in a directory:

```bash
npx persian-fontkit optimize ./public/fonts --output ./dist/fonts
```

**Output:**

```
🚀 Persian FontKit Optimizer

Input:  /path/to/public/fonts
Output: /path/to/dist/fonts

📁 Scanning for font files...
✓ Found 2 font file(s)

[1/2] Optimizing vazir-regular.ttf...
  Original:  2.4 MB
  Optimized: 580 KB
  ✓ Reduced by 75.8%

[2/2] Optimizing vazir-bold.ttf...
  Original:  2.5 MB
  Optimized: 620 KB
  ✓ Reduced by 75.2%

✨ Optimization complete!

📊 Summary:
  Total fonts processed: 2
  Original size:  4.9 MB
  Optimized size: 1.2 MB
  Total saved:    3.7 MB
  Size reduction: 75.5%
```

### 2. React Hook Usage

```tsx
"use client";

import { usePersianFont } from "persian-fontkit/hooks";

export default function MyComponent() {
  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
    subsets: ["farsi", "latin"],
    basePath: "/fonts",
  });

  return (
    <div style={{ fontFamily: "Vazir" }}>
      <h1>سلام دنیا</h1>
      <p>Hello World</p>
    </div>
  );
}
```

### 3. Next.js Integration

#### Option A: Manual Preload (Recommended)

```tsx
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <link
          rel="preload"
          href="/fonts/vazir-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

#### Option B: Next.js Plugin

```js
// next.config.js
const { withPersianFonts } = require("persian-fontkit/plugin");

module.exports = withPersianFonts({
  fonts: [{ family: "Vazir", weights: [400, 700], subsets: ["farsi"] }],
});
```

---

## 📚 Usage Examples

### CLI Options

```bash
# Basic usage
npx persian-fontkit optimize ./fonts --output ./dist

# Custom subsets
npx persian-fontkit optimize ./fonts --subsets farsi latin numbers

# Different format
npx persian-fontkit optimize ./fonts --format woff

# Disable hash in filenames
npx persian-fontkit optimize ./fonts --no-hash

# Custom CSS filename
npx persian-fontkit optimize ./fonts --css custom-fonts.css

# Show help
npx persian-fontkit --help
```

### React Hook Options

```tsx
import { usePersianFont } from "persian-fontkit/hooks";

function MyComponent() {
  usePersianFont({
    family: "Vazir", // Font family name
    weight: [400, 700], // Font weights to load
    subsets: ["farsi", "latin"], // Character subsets
    basePath: "/fonts", // Base path for font files
    display: "swap", // font-display property
    preload: true, // Add preload links
    fallback: ["Tahoma", "Arial"], // Fallback fonts
  });

  return <div>Your content</div>;
}
```

### Programmatic API

```typescript
import { optimizeFont, optimizeFonts } from "persian-fontkit";

// Optimize a single font
const result = await optimizeFont({
  inputPath: "./fonts/vazir-regular.ttf",
  outputDir: "./dist/fonts",
  fontFamily: "Vazir",
  fontWeight: 400,
  subsets: ["farsi", "latin"],
  format: "woff2",
});

console.log(`Reduced by ${result.reduction}%`);

// Optimize multiple fonts
const results = await optimizeFonts(
  ["./fonts/vazir-400.ttf", "./fonts/vazir-700.ttf"],
  "./dist/fonts",
  { subsets: ["farsi", "latin"] }
);
```

---

## 🎯 Supported Subsets

| Subset        | Unicode Range            | Description                 |
| ------------- | ------------------------ | --------------------------- |
| `farsi`       | U+0600-06FF, U+FB50-FDFF | Persian & Arabic characters |
| `latin`       | U+0020-007E, U+00A0-00FF | Basic Latin characters      |
| `numbers`     | U+0030-0039, U+06F0-06F9 | Latin & Persian digits      |
| `punctuation` | U+0020-002F, U+060C-061F | Common punctuation          |

**Default:** All subsets are included by default.

---

## 🎨 Popular Persian Fonts

Persian FontKit works with all Persian fonts, including:

- **Vazir** (Vazirmatn)
- **IRANSans** (IRANSansX)
- **Shabnam**
- **Yekan**
- **Kalameh**
- **Samim**
- **Sahel**
- **Tanha**
- **Parastoo**
- **Gandom**

---

## 📊 Performance Comparison

### Before Optimization

```
vazir-regular.ttf: 2.4 MB
vazir-bold.ttf:    2.5 MB
Total:             4.9 MB
Load time:         ~3.2s (3G)
```

### After Optimization

```
vazir-regular.woff2: 580 KB ⚡
vazir-bold.woff2:    620 KB ⚡
Total:               1.2 MB
Load time:           ~0.8s (3G)
```

**Result:** 75% smaller, 4x faster! 🚀

---

## 🔧 Configuration

### CLI Config File

Create `persian-fonts.config.js`:

```js
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
      subsets: ["farsi"],
      src: "iransans/*.ttf", // Optional: specific files
    },
  ],
  sourceDir: "./public/fonts",
  outputDir: "./public/fonts/optimized",
  format: "woff2",
  verbose: true,
};
```

Then run:

```bash
npx persian-fontkit optimize
```

---

## 📖 API Reference

### `optimizeFont(options)`

Optimize a single font file.

**Options:**

- `inputPath` (string): Path to input font file
- `outputDir` (string): Output directory
- `fontFamily` (string, optional): Font family name
- `fontWeight` (number, optional): Font weight (default: 400)
- `fontStyle` ('normal' | 'italic', optional): Font style
- `subsets` (string[], optional): Character subsets to include
- `format` ('woff2' | 'woff' | 'ttf', optional): Output format
- `fontDisplay` (string, optional): CSS font-display property
- `useHash` (boolean, optional): Add hash to filename

**Returns:** `Promise<OptimizationResult>`

### `usePersianFont(options)`

React hook for dynamic font loading.

**Options:**

- `family` (string): Font family name
- `weight` (number | number[]): Font weights
- `subsets` (string[], optional): Character subsets
- `basePath` (string, optional): Base path for fonts
- `display` (string, optional): font-display property
- `preload` (boolean, optional): Add preload links
- `fallback` (string[], optional): Fallback fonts

### `withPersianFonts(config, nextConfig)`

Next.js plugin wrapper.

**Config:**

- `fonts` (FontConfig[]): Array of font configurations
- `sourceDir` (string, optional): Source directory
- `outputDir` (string, optional): Output directory
- `format` (string, optional): Output format
- `verbose` (boolean, optional): Enable logging

---

## 🏗️ Project Structure

```
persian-fontkit/
├── src/
│   ├── cli.ts                 # CLI implementation
│   ├── optimizer.ts           # Core optimization logic
│   ├── next-plugin.ts         # Next.js plugin
│   ├── index.ts               # Main entry point
│   ├── hooks/
│   │   └── usePersianFont.ts  # React hook
│   └── utils/
│       ├── css.ts             # CSS generation
│       ├── file.ts            # File operations
│       └── subsetConfig.ts    # Subset definitions
├── examples/
│   └── nextjs-demo/           # Next.js example
├── package.json
├── tsconfig.json
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

### Development Setup

```bash
# Clone repository
git clone https://github.com/kuomars110/persian-fontkit.git
cd persian-fontkit

# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

---

## 📝 License

MIT © [Your Name](https://github.com/kuomars110)

---

## 🙏 Acknowledgments

- [subset-font](https://github.com/papandreou/subset-font) - Font subsetting library
- [Commander.js](https://github.com/tj/commander.js) - CLI framework
- Persian font designers for creating beautiful fonts

---

## 📮 Support

- 🐛 [Report a bug](https://github.com/kuomars110/persian-fontkit/issues)
- 💡 [Request a feature](https://github.com/kuomars110/persian-fontkit/issues)
- 📖 [Read the docs](https://github.com/kuomars110/persian-fontkit/wiki)
- 💬 [Join discussions](https://github.com/kuomars110/persian-fontkit/discussions)

---

<div align="center">

**Made with ❤️ for the Persian web community**

[⭐ Star on GitHub](https://github.com/kuomars110/persian-fontkit) • [📦 npm Package](https://www.npmjs.com/package/persian-fontkit)

</div>
