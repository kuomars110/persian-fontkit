# Persian FontKit - Next.js 15 Integration Guide

Complete guide for integrating persian-fontkit with Next.js 15 and the App Router.

## 📋 Table of Contents

- [Installation](#installation)
- [Method 1: Static Font Loading (Recommended)](#method-1-static-font-loading-recommended)
- [Method 2: Dynamic Font Loading with React Hook](#method-2-dynamic-font-loading-with-react-hook)
- [Method 3: Automatic Build-Time Optimization](#method-3-automatic-build-time-optimization)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Installation

```bash
npm install persian-fontkit
```

## Method 1: Static Font Loading (Recommended)

Best for: SEO, SSR, optimal performance

### Step 1: Optimize Fonts

```bash
npx persian-fontkit optimize ./public/fonts --output ./public/fonts/optimized
```

### Step 2: Update Your Layout

```tsx
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "My Persian App",
  description: "Built with Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preload Persian fonts for better performance */}
        <link
          rel="preload"
          href="/fonts/optimized/vazir-400.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/optimized/vazir-700.woff2"
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

### Step 3: Import Font CSS

```css
/* app/globals.css */

/* Import optimized fonts */
@font-face {
  font-family: "Vazir";
  src: url("/fonts/optimized/vazir-400.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "Vazir";
  src: url("/fonts/optimized/vazir-700.woff2") format("woff2");
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}

body {
  font-family: "Vazir", Tahoma, Arial, sans-serif;
}
```

### Step 4: Use in Components

```tsx
// app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1 style={{ fontWeight: 700 }}>سلام دنیا</h1>
      <p style={{ fontWeight: 400 }}>این یک متن نمونه است</p>
    </main>
  );
}
```

---

## Method 2: Dynamic Font Loading with React Hook

Best for: Client-side apps, dynamic font changes

### Client Component

```tsx
// app/components/PersianText.tsx
"use client";

import { usePersianFont } from "persian-fontkit/hooks";

export default function PersianText() {
  // Dynamically load font
  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
    subsets: ["farsi", "latin"],
    basePath: "/fonts/optimized",
    preload: true,
  });

  return (
    <div style={{ fontFamily: "Vazir" }}>
      <h1>عنوان فارسی</h1>
      <p>این متن به صورت پویا با فونت بهینه شده نمایش داده می‌شود.</p>
    </div>
  );
}
```

### Use in Page

```tsx
// app/page.tsx
import PersianText from "./components/PersianText";

export default function HomePage() {
  return (
    <main>
      <PersianText />
    </main>
  );
}
```

---

## Method 3: Automatic Build-Time Optimization

Best for: Automated workflows, CI/CD

### Step 1: Create Font Config

```js
// persian-fonts.config.js
module.exports = {
  fonts: [
    {
      family: "Vazir",
      weights: [400, 700],
      subsets: ["farsi", "latin", "numbers"],
    },
  ],
  sourceDir: "./public/fonts",
  outputDir: "./public/fonts/optimized",
  format: "woff2",
  verbose: true,
};
```

### Step 2: Update Next Config

```js
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer, dev }) => {
    // Optimize fonts during production build
    if (!isServer && !dev) {
      const { optimizeNextJSFonts } = require("persian-fontkit");
      optimizeNextJSFonts("./persian-fonts.config.js").catch(console.error);
    }
    return config;
  },
};

module.exports = nextConfig;
```

### Step 3: Add Build Script

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "persian-fontkit optimize ./public/fonts --output ./public/fonts/optimized && next build",
    "start": "next start"
  }
}
```

---

## Best Practices

### 1. Font Loading Strategy

```tsx
// app/layout.tsx - Recommended approach
export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* Critical fonts: preload */}
        <link
          rel="preload"
          href="/fonts/vazir-400.woff2"
          as="font"
          crossOrigin="anonymous"
        />

        {/* Non-critical fonts: prefetch */}
        <link rel="prefetch" href="/fonts/vazir-700.woff2" as="font" />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

### 2. Font Display Strategy

```css
@font-face {
  font-family: "Vazir";
  src: url("/fonts/vazir-400.woff2") format("woff2");
  font-display: swap; /* Recommended for Persian fonts */
}

/* Alternative strategies:
   - block: Show invisible text until font loads
   - swap: Show fallback immediately, swap when loaded (recommended)
   - fallback: 100ms invisible, 3s fallback, then swap
   - optional: 100ms invisible, then no swap
*/
```

### 3. Fallback Fonts

```css
body {
  font-family: "Vazir", "Tahoma", /* Persian-compatible */ "Arial", /* Fallback */
      sans-serif; /* System fallback */
}
```

### 4. Subset Selection

```bash
# Include only what you need:

# Persian sites with English
npx persian-fontkit optimize ./fonts --subsets farsi latin

# Persian only (smallest size)
npx persian-fontkit optimize ./fonts --subsets farsi

# Full support (recommended)
npx persian-fontkit optimize ./fonts --subsets farsi latin numbers punctuation
```

---

## Troubleshooting

### Fonts Not Loading

**Issue:** Fonts appear as fallback

**Solutions:**

1. Check font file path in DevTools Network tab
2. Verify CORS headers for external fonts
3. Ensure fonts are in `public/` directory
4. Check for typos in font-family name

### Build Errors

**Issue:** TypeScript errors with react types

**Solution:** The package has React as optional peer dependency. Errors will resolve when you install React:

```bash
npm install react react-dom
```

### Performance Issues

**Issue:** Fonts loading slowly

**Solutions:**

1. Use `font-display: swap`
2. Preload critical fonts
3. Use smaller subsets
4. Enable HTTP/2 server push
5. Use CDN for font delivery

### FOUT (Flash of Unstyled Text)

**Issue:** Text appears in fallback font first

**Solution:** Use font-display strategy:

```css
@font-face {
  font-family: "Vazir";
  font-display: block; /* or optional */
}
```

---

## Advanced: Custom Font Loading Strategy

```tsx
// app/components/FontLoader.tsx
"use client";

import { useEffect, useState } from "react";
import { usePersianFont } from "persian-fontkit/hooks";

export default function FontLoader() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
  });

  useEffect(() => {
    // Check if fonts are loaded
    document.fonts.ready.then(() => {
      setFontsLoaded(true);
    });
  }, []);

  return (
    <div className={fontsLoaded ? "fonts-loaded" : "fonts-loading"}>
      {/* Your content */}
    </div>
  );
}
```

---

## Performance Checklist

- [ ] Fonts optimized with persian-fontkit
- [ ] Using woff2 format
- [ ] Critical fonts preloaded
- [ ] font-display: swap applied
- [ ] Proper fallback fonts configured
- [ ] Subsets minimized to needed characters
- [ ] Fonts hosted on same domain (or CDN with CORS)
- [ ] HTTP/2 enabled on server
- [ ] Lighthouse score > 90

---

## Need Help?

- [Full Documentation](../README.md)
- [GitHub Issues](https://github.com/kuomars110/persian-fontkit/issues)
- [Examples](../examples/nextjs-demo)

---

**Made with ❤️ for Next.js and Persian developers**
