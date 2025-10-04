# Contributing to MoodTracker Pro 🤝

First off, thank you for considering contributing to MoodTracker Pro! It's people like you that make this project such a great tool for mental wellness tracking.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Submitting Changes](#submitting-changes)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Documentation](#documentation)
- [Community](#community)

---

## 📜 Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code. Please report unacceptable behavior to 3679044152@qq.com.

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable behavior includes:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

---

## 🎯 How Can I Contribute?

### Reporting Bugs 🐛

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

**Bug Report Template:**
```markdown
**Describe the bug**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

**Expected behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g. Windows 10, macOS 12.0, Android 11]
- Browser: [e.g. Chrome 96, Firefox 95]
- Version: [e.g. 2.0.0]

**Additional context**
Add any other context about the problem here.
```

### Suggesting Features 💡

We love new ideas! Before suggesting a feature:

1. **Check existing suggestions** in [GitHub Discussions](https://github.com/moodtracker-pro/moodtracker-pro/discussions)
2. **Search closed issues** to see if it was previously discussed
3. **Create a detailed proposal** explaining:
   - What problem does it solve?
   - How would it work?
   - Any alternative solutions considered?
   - Mockups or examples (if applicable)

**Feature Request Template:**
```markdown
**Is your feature request related to a problem?**
A clear description of the problem. Ex. I'm always frustrated when [...]

**Describe the solution you'd like**
A clear and concise description of what you want to happen.

**Describe alternatives you've considered**
Any alternative solutions or features you've considered.

**Additional context**
Add any other context or screenshots about the feature request here.
```

### Improving Documentation 📚

Documentation improvements are always welcome! This includes:

- Fixing typos or grammatical errors
- Adding examples or clarifications
- Translating documentation
- Creating tutorials or guides
- Improving API documentation

### Contributing Code 💻

We accept pull requests for:
- Bug fixes
- New features
- Performance improvements
- Code refactoring
- Test coverage improvements

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 14 or higher
- **npm** 6 or higher
- **Git** for version control
- A code editor (VS Code recommended)

### Fork and Clone

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/moodtracker-pro.git
   cd moodtracker-pro
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/moodtracker-pro/moodtracker-pro.git
   ```

4. **Install dependencies** (optional):
   ```bash
   npm install
   ```

5. **Start local server**:
   ```bash
   npm start
   # Open http://localhost:8080
   ```

### Project Structure

```
moodtracker-pro/
├── index.html              # Main HTML file
├── script.js               # Main application logic
├── styles.css              # Main styles
├── manifest.json           # PWA manifest
├── sw.js                   # Service Worker
├── i18n.js                 # Internationalization
├── wellness-tips.js        # Wellness tips data
├── help-panels.js          # Help system
├── *.css                   # Feature-specific styles
├── build-scripts/          # APK build scripts
├── example-plugins/        # Plugin examples
└── docs/                   # Documentation files
```

---

## 🔄 Development Workflow

### 1. Create a Branch

Always create a new branch for your work:

```bash
# Update your local main branch
git checkout main
git pull upstream main

# Create a new branch
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

**Branch naming conventions:**
- `feature/feature-name` - New features
- `fix/bug-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/what-refactored` - Code refactoring
- `test/what-tested` - Test improvements

### 2. Make Your Changes

- Write clean, readable code
- Follow the existing code style
- Add comments for complex logic
- Keep commits small and focused
- Test your changes thoroughly

### 3. Commit Your Changes

Write meaningful commit messages following this format:

```bash
git commit -m "type: brief description

Detailed explanation of what changed and why.

Fixes #123"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Formatting, missing semicolons, etc.
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

**Examples:**
```bash
git commit -m "feat: add dark mode toggle"
git commit -m "fix: resolve mood chart rendering issue on mobile"
git commit -m "docs: update APK generation guide"
```

### 4. Keep Your Branch Updated

Regularly sync with upstream:

```bash
git fetch upstream
git rebase upstream/main
```

### 5. Push Your Changes

```bash
git push origin feature/your-feature-name
```

---

## 📤 Submitting Changes

### Creating a Pull Request

1. **Push your branch** to your fork on GitHub
2. **Open a Pull Request** against the `main` branch
3. **Fill out the PR template** completely
4. **Link related issues** using keywords like "Fixes #123"
5. **Wait for review** - be patient and responsive to feedback

### Pull Request Template

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update

## Related Issues
Fixes #(issue number)

## How Has This Been Tested?
Describe the tests you ran and how to reproduce them.

## Screenshots (if applicable)
Add screenshots to help explain your changes.

## Checklist
- [ ] My code follows the project's style guidelines
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings or errors
- [ ] I have tested on multiple browsers (Chrome, Firefox, Safari)
- [ ] I have tested on mobile devices
- [ ] Any dependent changes have been merged and published
```

### Review Process

1. **Automated checks** will run (if configured)
2. **Maintainers will review** your code
3. **Address feedback** by pushing new commits
4. **Once approved**, your PR will be merged

**What reviewers look for:**
- Code quality and readability
- Adherence to coding standards
- Test coverage
- Documentation updates
- No breaking changes (unless discussed)
- Performance implications

---

## 📐 Coding Standards

### JavaScript Style Guide

**General Principles:**
- Use vanilla JavaScript (ES6+)
- No frameworks or heavy dependencies
- Keep code simple and readable
- Optimize for performance

**Formatting:**
```javascript
// Use 4 spaces for indentation
function trackMood(mood, note, tags) {
    // Clear, descriptive variable names
    const timestamp = Date.now();
    const entry = {
        id: timestamp,
        date: new Date().toISOString(),
        mood: mood,
        note: note,
        tags: tags || [],
        timestamp: timestamp
    };
    
    // Use const/let, not var
    const entries = getMoodEntries();
    entries.push(entry);
    saveMoodEntries(entries);
    
    return entry;
}

// Use arrow functions where appropriate
const filterByTag = (entries, tag) => {
    return entries.filter(entry => entry.tags.includes(tag));
};

// Use template literals
console.log(`Mood entry created: ${entry.id}`);
```

**Best Practices:**
- ✅ Use meaningful variable and function names
- ✅ Add JSDoc comments for complex functions
- ✅ Handle errors gracefully
- ✅ Avoid global variables
- ✅ Use localStorage API correctly
- ✅ Implement proper event listeners cleanup
- ❌ Don't use `eval()` or `with`
- ❌ Avoid excessive DOM manipulation
- ❌ Don't pollute the global namespace

### CSS Style Guide

**Naming Conventions:**
```css
/* Use BEM-like naming */
.mood-tracker { }
.mood-tracker__header { }
.mood-tracker__button--primary { }

/* Keep selectors simple */
.card { } /* Good */
.container .card .header .title { } /* Avoid deep nesting */

/* Use CSS custom properties */
:root {
    --primary-green: #00ff88;
    --background-dark: #0a0a0a;
}

.button {
    background-color: var(--primary-green);
}
```

**Organization:**
```css
/* Group related styles */
/* 1. Layout */
.container {
    display: flex;
    flex-direction: column;
}

/* 2. Visual */
.button {
    background: var(--primary-green);
    border: 1px solid var(--primary-green);
    border-radius: 8px;
}

/* 3. Typography */
.title {
    font-size: 1.5rem;
    font-weight: 600;
}

/* 4. Interactions */
.button:hover {
    opacity: 0.9;
}
```

### HTML Guidelines

```html
<!-- Use semantic HTML -->
<header>
    <nav aria-label="Main navigation">
        <a href="#dashboard" aria-current="page">Dashboard</a>
    </nav>
</header>

<main id="main-content" role="main">
    <section aria-label="Mood tracking">
        <!-- Content -->
    </section>
</main>

<!-- Include accessibility attributes -->
<button 
    aria-label="Save mood entry"
    title="Save your mood entry"
    type="button">
    Save
</button>

<!-- Use proper form elements -->
<label for="mood-note">Note</label>
<textarea id="mood-note" name="note"></textarea>
```

---

## 🧪 Testing Guidelines

### Manual Testing Checklist

Before submitting your PR, test:

**Browser Compatibility:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Device Testing:**
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)

**Feature Testing:**
- [ ] All buttons and links work
- [ ] Forms validate properly
- [ ] Data persists correctly
- [ ] Service Worker functions offline
- [ ] Export features work
- [ ] Notifications work (if applicable)

**Accessibility Testing:**
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Sufficient color contrast
- [ ] Focus indicators visible
- [ ] ARIA labels present

### Performance Testing

- Check load time (should be < 3 seconds)
- Monitor memory usage
- Test with throttled network
- Verify smooth animations (60fps)

### Tools

Use these tools to test:
- **Chrome DevTools** - Lighthouse, Network, Performance
- **Firefox DevTools** - Accessibility inspector
- **Wave** - Web accessibility evaluation tool
- **axe DevTools** - Accessibility testing

---

## 📝 Documentation

### Code Documentation

Add JSDoc comments for functions:

```javascript
/**
 * Calculates the average mood value from entries
 * @param {Array<Object>} entries - Array of mood entries
 * @param {number} days - Number of days to calculate from
 * @returns {number} Average mood value (1-5)
 */
function calculateAverageMood(entries, days = 7) {
    // Implementation
}
```

### README Updates

When adding new features, update:
- Feature list in README.md
- Usage guide section
- Any relevant screenshots

### API Documentation

If adding new public functions, document in `API使用文档.md`:

```markdown
## `functionName(param1, param2)`

**Description:** What the function does

**Parameters:**
- `param1` (Type): Description
- `param2` (Type): Description

**Returns:** Type - Description

**Example:**
\```javascript
const result = functionName('value1', 'value2');
\```
```

---

## 💬 Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - Questions and ideas
- **Email** - 3679044152@qq.com

### Getting Help

- Check existing documentation first
- Search closed issues
- Ask in GitHub Discussions
- Be patient and respectful

### Recognition

Contributors will be:
- Listed in the project README
- Mentioned in release notes
- Credited in commit history

---

## 🎯 Good First Issues

New to the project? Look for issues labeled:
- `good first issue` - Simple tasks for newcomers
- `help wanted` - Issues we need help with
- `documentation` - Documentation improvements

---

## 🏆 Types of Contributions We Need

### Code Contributions
- Bug fixes
- New features
- Performance improvements
- Code refactoring
- Test coverage

### Non-Code Contributions
- Documentation improvements
- Translation to other languages
- Design improvements
- User experience feedback
- Tutorial creation
- Community support

---

## 📋 Checklist Before Submitting

- [ ] Code follows project style guidelines
- [ ] Self-reviewed the code
- [ ] Added comments for complex logic
- [ ] Updated documentation
- [ ] Tested on multiple browsers
- [ ] Tested on mobile devices
- [ ] No console errors or warnings
- [ ] Commits have meaningful messages
- [ ] PR description is complete

---

## 🙏 Thank You!

Your contributions help make MoodTracker Pro better for everyone. Whether it's a bug report, feature suggestion, documentation improvement, or code contribution - every bit helps!

---

## 📞 Questions?

If you have questions about contributing:
- Open a discussion on GitHub
- Email us at 3679044152@qq.com
- Check existing documentation

---

<div align="center">
  <sub>Built with ❤️ by the community</sub>
</div>
