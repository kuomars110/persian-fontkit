# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-XX

### Added

- Initial release of persian-fontkit 🎉
- CLI tool for font optimization
- React hook (`usePersianFont`) for dynamic font loading
- Next.js plugin for automatic font optimization
- Support for `.ttf`, `.otf`, `.woff`, `.woff2` formats
- Font subsetting for Persian, Latin, numbers, and punctuation
- Automatic CSS generation with `@font-face` rules
- Cache-busting with file hashing
- Preload link generation for faster loading
- Full TypeScript support with type definitions
- Next.js 15 App Router example
- Comprehensive documentation and README
- MIT License

### Features

- 60-80% font size reduction through smart subsetting
- SSR-safe React hooks
- Zero-config Next.js integration
- Beautiful CLI output with progress tracking
- Automatic font weight and style detection
- Support for popular Persian fonts (Vazir, IRANSans, Shabnam, etc.)
- Unicode range optimization
- font-display: swap for better performance

### Documentation

- Complete README with usage examples
- API reference documentation
- Next.js integration guide
- CLI usage guide
- Contributing guidelines

## [Unreleased]

### Planned Features

- [ ] Variable font support
- [ ] Automatic subset analysis from HTML files
- [ ] GUI dashboard for font preview
- [ ] CDN integration (jsDelivr, Cloudflare)
- [ ] Font optimization report generation
- [ ] Webpack and Vite plugins
- [ ] Test suite with Jest
- [ ] CI/CD pipeline
- [ ] More font format conversions
- [ ] Performance benchmarking tools

---

[1.0.0]: https://github.com/kuomars110/persian-fontkit/releases/tag/v1.0.0
