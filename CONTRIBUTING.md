# Contributing to Persian FontKit

Thank you for your interest in contributing to Persian FontKit! 🎉

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/persian-fontkit.git
   cd persian-fontkit
   ```
3. **Install dependencies:**
   ```bash
   npm install
   ```
4. **Build the project:**
   ```bash
   npm run build
   ```

## Development Workflow

### Making Changes

1. **Create a new branch:**

   ```bash
   git checkout -b feature/my-new-feature
   ```

2. **Make your changes** in the `src/` directory

3. **Test your changes:**

   ```bash
   npm run build
   npm test
   ```

4. **Test with the example:**
   ```bash
   cd examples/nextjs-demo
   npm install
   npm run dev
   ```

### Code Style

- Write TypeScript with full type definitions
- Follow existing code formatting
- Add JSDoc comments for public APIs
- Keep functions focused and modular

### Commit Messages

Use clear and descriptive commit messages:

```
feat: add support for variable fonts
fix: resolve unicode range parsing issue
docs: update CLI usage examples
refactor: simplify CSS generation logic
```

## Pull Request Process

1. **Update documentation** if needed (README.md, JSDoc comments)
2. **Add tests** for new features
3. **Ensure all tests pass:** `npm test`
4. **Update CHANGELOG.md** with your changes
5. **Submit a pull request** with a clear description

## Reporting Issues

### Bug Reports

When reporting bugs, please include:

- **Description:** What went wrong?
- **Steps to reproduce:** How can we recreate the issue?
- **Expected behavior:** What should happen?
- **Actual behavior:** What actually happened?
- **Environment:** OS, Node version, package version
- **Font files:** If relevant, share the font that caused issues

### Feature Requests

When suggesting features:

- **Use case:** Why is this feature needed?
- **Proposed solution:** How should it work?
- **Alternatives:** What other approaches did you consider?

## Areas for Contribution

### High Priority

- [ ] Add comprehensive test suite (Jest)
- [ ] Support for variable fonts
- [ ] GUI dashboard for font preview
- [ ] Automatic subset analysis from HTML files
- [ ] Performance benchmarking tools

### Medium Priority

- [ ] CDN integration (jsDelivr, Cloudflare)
- [ ] More font format conversions
- [ ] Font optimization report generation
- [ ] Webpack/Vite plugin versions
- [ ] Better error messages

### Documentation

- [ ] Video tutorials
- [ ] More usage examples
- [ ] Integration guides for other frameworks
- [ ] Blog posts about performance improvements

## Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers
- Provide constructive feedback
- Focus on what's best for the community

### Unacceptable Behavior

- Harassment or discrimination
- Trolling or insulting comments
- Publishing others' private information
- Other unprofessional conduct

## Questions?

Feel free to:

- Open an issue for discussion
- Join our community discussions
- Reach out to maintainers

Thank you for making Persian FontKit better! 🙏
