# GUI Design Quick Start
## Building Your User Interface

> **For New Projects**: Use this guide alongside `GUI_DESIGN_STANDARDS.md` and `GUI_DESIGN_CHECKLIST.md` to create an amazing user interface from day one.

---

## 🚀 Getting Started (5 Minutes)

### 1. Choose Your Design System

Pick one foundation and stick with it for consistency:

| Design System | Best For | Get Started |
|--------------|----------|-------------|
| **Microsoft Fluent UI** | Windows apps, web apps, Microsoft ecosystem | [Fluent 2](https://fluent2.microsoft.design/) |
| **Google Material 3** | Android apps, web apps, Google ecosystem | [Material Design 3](https://m3.material.io/) |
| **Apple Human Interface Guidelines** | iOS, macOS, Apple platforms | [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) |

**Recommendation**: For cross-platform apps, use **Microsoft Fluent UI** - it's open-source, well-documented, and works everywhere.

### 2. Set Up Your Design Tokens

Create a CSS/SCSS file with your design variables:

```css
/* design-tokens.css */
:root {
  /* Colors */
  --color-primary: #0078D4;
  --color-secondary: #50A0E0;
  --color-success: #107C10;
  --color-error: #D83B01;
  --color-warning: #F7630C;
  
  /* Typography */
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  --font-size-base: 16px;
  --font-size-large: 20px;
  --font-size-small: 14px;
  --line-height-body: 1.5;
  
  /* Spacing (8px base unit) */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 16px;
  --space-lg: 24px;
  --space-xl: 32px;
  
  /* Borders & Shadows */
  --border-radius: 4px;
  --border-width: 1px;
  --shadow-sm: 0 1px 3px rgba(0,0,0,0.12);
  --shadow-md: 0 2px 6px rgba(0,0,0,0.15);
}
```

### 3. Install a Component Library (Optional but Recommended)

Instead of building from scratch, use pre-built accessible components:

**React:**
```bash
npm install @fluentui/react-components
# or
npm install @mui/material @emotion/react @emotion/styled
```

**Vue:**
```bash
npm install vuetify
```

**Angular:**
```bash
ng add @angular/material
```

**Vanilla JS:**
```bash
# Use Fluent Web Components
npm install @fluentui/web-components
```

---

## 📐 Layout Your First Page (10 Minutes)

### Step 1: Create the Basic Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Amazing App</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Header -->
  <header>
    <div class="container">
      <h1>My App</h1>
      <nav>
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
      </nav>
    </div>
  </header>
  
  <!-- Main Content -->
  <main>
    <div class="container">
      <h2>Welcome!</h2>
      <p>Start building your amazing application here.</p>
    </div>
  </main>
  
  <!-- Footer -->
  <footer>
    <div class="container">
      <p>&copy; 2025 My App. All rights reserved.</p>
    </div>
  </footer>
</body>
</html>
```

### Step 2: Add Basic Styling

```css
/* styles.css */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  color: #1A1A1A;
  background-color: #FFFFFF;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-md);
}

header {
  background-color: var(--color-primary);
  color: white;
  padding: var(--space-md) 0;
}

header h1 {
  display: inline-block;
  margin-right: var(--space-lg);
}

nav a {
  color: white;
  text-decoration: none;
  margin-left: var(--space-md);
  padding: var(--space-sm) var(--space-md);
}

nav a:hover {
  background-color: rgba(255,255,255,0.1);
  border-radius: var(--border-radius);
}

main {
  min-height: 70vh;
  padding: var(--space-xl) 0;
}

footer {
  background-color: #F5F5F5;
  padding: var(--space-lg) 0;
  text-align: center;
  color: #666666;
}
```

---

## 🎨 Your First Components (15 Minutes)

### Button Component

```html
<button class="btn btn-primary">Save Changes</button>
<button class="btn btn-secondary">Cancel</button>
```

```css
.btn {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  font-weight: 500;
  padding: 12px 24px;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: all 150ms ease;
  min-height: 44px; /* Touch-friendly */
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.btn:active {
  transform: translateY(0);
}

.btn:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: #005A9E;
}

.btn-secondary {
  background-color: white;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

### Card Component

```html
<div class="card">
  <div class="card-header">
    <h3>Card Title</h3>
  </div>
  <div class="card-body">
    <p>Card content goes here.</p>
  </div>
  <div class="card-footer">
    <button class="btn btn-primary">Action</button>
  </div>
</div>
```

```css
.card {
  background: white;
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.card-header {
  padding: var(--space-md);
  border-bottom: 1px solid #E0E0E0;
}

.card-header h3 {
  margin: 0;
  font-size: var(--font-size-large);
}

.card-body {
  padding: var(--space-md);
}

.card-footer {
  padding: var(--space-md);
  background-color: #F5F5F5;
  text-align: right;
}
```

### Form Input Component

```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input type="email" id="email" placeholder="user@example.com" required>
  <span class="helper-text">We'll never share your email.</span>
</div>
```

```css
.form-group {
  margin-bottom: var(--space-lg);
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: var(--space-xs);
  color: #333;
}

input, textarea, select {
  width: 100%;
  padding: 12px;
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  border: 2px solid #CCC;
  border-radius: var(--border-radius);
  transition: border-color 150ms ease;
}

input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(0, 120, 212, 0.1);
}

input:invalid:not(:placeholder-shown) {
  border-color: var(--color-error);
}

.helper-text {
  display: block;
  font-size: var(--font-size-small);
  color: #666;
  margin-top: var(--space-xs);
}
```

---

## ♿ Accessibility Essentials (10 Minutes)

### 1. Semantic HTML

```html
<!-- ❌ DON'T: Use divs for everything -->
<div class="header">
  <div class="nav">
    <div class="link">Home</div>
  </div>
</div>

<!-- ✅ DO: Use semantic elements -->
<header>
  <nav>
    <a href="/">Home</a>
  </nav>
</header>
```

### 2. ARIA Labels for Icons

```html
<!-- ❌ DON'T: Icon without label -->
<button><svg><!-- icon --></svg></button>

<!-- ✅ DO: Add aria-label -->
<button aria-label="Save document">
  <svg><!-- save icon --></svg>
</button>
```

### 3. Form Labels

```html
<!-- ❌ DON'T: Rely on placeholder -->
<input type="text" placeholder="Email">

<!-- ✅ DO: Always use labels -->
<label for="email">Email</label>
<input type="email" id="email" placeholder="user@example.com">
```

### 4. Keyboard Navigation

Test your app using **only the keyboard**:
- `Tab` through all interactive elements
- `Enter` or `Space` to activate buttons
- `Escape` to close modals
- Arrow keys for dropdowns

### 5. Color Contrast

Use the [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/):
- **Regular text**: 4.5:1 minimum
- **Large text** (18pt+): 3:1 minimum
- **UI components**: 3:1 minimum

---

## 📱 Make It Responsive (10 Minutes)

### Mobile-First CSS

```css
/* Base styles (mobile) */
.grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
}

/* Tablet (768px+) */
@media (min-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1024px+) */
@media (min-width: 1024px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .container {
    padding: 0 var(--space-xl);
  }
}
```

### Responsive Images

```css
img {
  max-width: 100%;
  height: auto;
}
```

### Touch-Friendly Targets

```css
/* Minimum 44x44px for mobile */
@media (max-width: 768px) {
  .btn, a, button {
    min-height: 44px;
    min-width: 44px;
    padding: 12px 16px;
  }
}
```

---

## ✅ Quick Validation Checklist

Before moving forward, verify:

- [ ] Page has `<title>` and `lang` attribute
- [ ] All images have `alt` text
- [ ] Forms have `<label>` elements
- [ ] Buttons have descriptive text (not just icons)
- [ ] Can navigate entire page with keyboard only
- [ ] Focus indicators are visible (3:1 contrast)
- [ ] Text contrast meets 4.5:1 minimum
- [ ] Responsive on mobile (375px width)
- [ ] Touch targets are 44x44px minimum

---

## 🎓 Next Steps

1. **Read Full Standards**: Review `GUI_DESIGN_STANDARDS.md` for comprehensive guidelines
2. **Use Checklist**: Before launch, complete `GUI_DESIGN_CHECKLIST.md`
3. **Test with Users**: Conduct usability testing early and often
4. **Iterate**: Design is never "done" - continuously improve

---

## 📚 Essential Resources

### Design Systems
- [Fluent 2 Design](https://fluent2.microsoft.design/) - Microsoft's design system
- [Material Design 3](https://m3.material.io/) - Google's design system
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines/) - Apple's guidelines

### Accessibility
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/) - Accessibility guidelines
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/) - Test color contrast
- [axe DevTools](https://www.deque.com/axe/devtools/) - Browser extension for accessibility testing

### Tools
- [Figma](https://figma.com) - Design tool (free tier available)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debug and test
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) - Audit performance & accessibility

---

**Remember**: Great design is invisible - users should accomplish their goals effortlessly without thinking about the interface.

**Start small, test often, and continuously improve!** 🚀
