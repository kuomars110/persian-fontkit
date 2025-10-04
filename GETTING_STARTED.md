# 🚀 Getting Started with Persian FontKit

Welcome to **persian-fontkit**! This guide will help you get up and running in just a few minutes.

## ⚡ Quick Installation

```bash
npm install persian-fontkit
```

## 📝 Quick Start Guide

### Step 1: Prepare Your Fonts

Place your Persian font files in a directory:

```
your-project/
├── public/
│   └── fonts/
│       ├── vazir-regular.ttf
│       └── vazir-bold.ttf
```

### Step 2: Optimize Your Fonts

Run the CLI optimizer:

```bash
npx persian-fontkit optimize ./public/fonts --output ./public/fonts/optimized
```

**Result:**

```
🚀 Persian FontKit Optimizer
✓ Found 2 font file(s)

[1/2] Optimizing vazir-regular.ttf...
  Original:  2.4 MB
  Optimized: 580 KB
  ✓ Reduced by 75.8%

✨ Optimization complete!
```

### Step 3: Use in Your Project

#### For React/Next.js:

```tsx
"use client";

import { usePersianFont } from "persian-fontkit/hooks";

export default function MyComponent() {
  usePersianFont({
    family: "Vazir",
    weight: [400, 700],
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

#### For Static Sites:

Import the generated CSS:

```css
@import url("./fonts/optimized/fonts.css");

body {
  font-family: "Vazir", Tahoma, Arial, sans-serif;
}
```

## 📖 What's Next?

### Learn More:

- [Full Documentation](README.md)
- [CLI Reference](README.md#-usage-examples)
- [React Hook API](README.md#usepersianfontoptions)
- [Next.js Integration](README.md#3-nextjs-integration)

### Explore Examples:

- [Next.js 15 Demo](examples/nextjs-demo/)
- [Configuration Options](persian-fonts.config.example.js)

### Common Use Cases:

#### Optimize Multiple Font Families:

```bash
npx persian-fontkit optimize ./fonts --subsets farsi latin
```

#### Use Different Output Format:

```bash
npx persian-fontkit optimize ./fonts --format woff
```

#### Customize Subsets:

```bash
npx persian-fontkit optimize ./fonts --subsets farsi numbers
```

## 🎯 Popular Persian Fonts

You can download these fonts and optimize them with persian-fontkit:

- **Vazir** - [Download](https://github.com/rastikerdar/vazir-font)
- **IRANSans** - [Download](https://github.com/rastikerdar/iransans)
- **Shabnam** - [Download](https://github.com/rastikerdar/shabnam-font)
- **Yekan** - [Download](https://github.com/rastikerdar/yekan-font)

## 💡 Tips

1. **Always optimize fonts** before deploying to production
2. **Use woff2 format** for best compression (default)
3. **Preload critical fonts** in your HTML `<head>`
4. **Use subset selection** to include only needed characters
5. **Test performance** with Lighthouse or PageSpeed Insights

## 🆘 Need Help?

- 📖 [Full README](README.md)
- 🐛 [Report Issues](https://github.com/kuomars110/persian-fontkit/issues)
- 💬 [Discussions](https://github.com/kuomars110/persian-fontkit/discussions)

## 🎉 You're Ready!

You've successfully set up persian-fontkit! Your Persian fonts are now:

- ✅ 60-80% smaller
- ✅ Loading faster
- ✅ Optimized for performance

Happy coding! 🚀
