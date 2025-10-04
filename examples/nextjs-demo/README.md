# 📝 Next.js Persian Font Demo

This is a demonstration of **persian-fontkit** integration with Next.js 15 and the App Router.

## 🚀 Quick Start

1. **Install dependencies:**

```bash
npm install
```

2. **Add your Persian fonts:**

Place your `.ttf`, `.otf`, `.woff`, or `.woff2` fonts in `public/fonts/`:

```
public/
└── fonts/
    ├── vazir-400.ttf
    └── vazir-700.ttf
```

3. **Optimize fonts:**

```bash
npm run optimize-fonts
```

This will create optimized versions in `public/fonts/optimized/`.

4. **Run development server:**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📚 Usage Examples

### Method 1: Using the React Hook

```tsx
"use client";

import { usePersianFont } from "persian-fontkit/hooks";

export default function MyComponent() {
  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
    subsets: ["farsi", "latin"],
    basePath: "/fonts/optimized",
  });

  return (
    <div style={{ fontFamily: "Vazir" }}>
      <h1>سلام دنیا</h1>
      <p>Hello World</p>
    </div>
  );
}
```

### Method 2: Preloading in Layout (SSR-friendly)

```tsx
// app/layout.tsx
import type { Metadata } from "next";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        {/* Preload optimized fonts */}
        <link
          rel="preload"
          href="/fonts/optimized/vazir-400.woff2"
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

### Method 3: Import CSS Directly

```tsx
// app/layout.tsx or globals.css
import "./fonts.css";
```

## 🎨 Customization

Edit `persian-fonts.config.js` to customize font optimization:

```js
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

## 📦 Build for Production

```bash
npm run build
npm start
```

## 📄 License

MIT
