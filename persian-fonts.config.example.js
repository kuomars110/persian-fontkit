# Example Configuration for Persian FontKit

This file demonstrates how to configure persian-fontkit for your project.

## Configuration Object

```javascript
module.exports = {
  // Array of fonts to optimize
  fonts: [
    {
      // Font family name (required)
      family: 'Vazir',
      
      // Font weights to optimize (optional)
      // Default: [400]
      weights: [400, 700],
      
      // Character subsets to include (optional)
      // Options: 'farsi', 'latin', 'numbers', 'punctuation'
      // Default: all subsets
      subsets: ['farsi', 'latin', 'numbers'],
      
      // Specific source files (optional)
      // If not provided, will search for files matching the family name
      src: 'vazir/*.ttf',
    },
    {
      family: 'IRANSans',
      weights: [400, 500, 700],
      subsets: ['farsi'],
    },
  ],

  // Source directory containing original fonts (optional)
  // Default: './public/fonts'
  sourceDir: './public/fonts',

  // Output directory for optimized fonts (optional)
  // Default: './public/fonts/optimized'
  outputDir: './public/fonts/optimized',

  // Output format (optional)
  // Options: 'woff2', 'woff', 'ttf'
  // Default: 'woff2'
  format: 'woff2',

  // Enable verbose logging (optional)
  // Default: false
  verbose: true,
};
```

## Usage

### With CLI

```bash
npx persian-fontkit optimize --config persian-fonts.config.js
```

### With Next.js Plugin

```javascript
// next.config.js
const { withPersianFonts } = require('persian-fontkit/plugin');
const fontConfig = require('./persian-fonts.config.js');

module.exports = withPersianFonts(fontConfig);
```

### Programmatically

```javascript
const { optimizeNextJSFonts } = require('persian-fontkit');

optimizeNextJSFonts('./persian-fonts.config.js')
  .then(() => console.log('Fonts optimized!'))
  .catch(console.error);
```
