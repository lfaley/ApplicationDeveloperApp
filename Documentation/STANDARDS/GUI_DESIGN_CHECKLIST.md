# GUI Design Checklist
## Pre-Launch Validation for Amazing User Interfaces

> **Purpose**: Use this actionable checklist before launching your application to ensure it meets professional GUI/UX standards. This checklist is based on WCAG 2.1, Microsoft Fluent Design, and industry best practices.

**How to Use**: Check each item as you verify it. Items marked ⚠️ are critical and must be addressed before launch.

---

## 📋 Table of Contents

1. [Visual Design](#visual-design)
2. [Accessibility (WCAG 2.1)](#accessibility-wcag-21)
3. [Keyboard Navigation](#keyboard-navigation)
4. [Responsive Design](#responsive-design)
5. [Interactive Elements](#interactive-elements)
6. [Forms & Input](#forms--input)
7. [Content & Typography](#content--typography)
8. [Performance](#performance)
9. [Error Handling](#error-handling)
10. [Cross-Browser Testing](#cross-browser-testing)

---

## Visual Design

### Color & Contrast
- [ ] ⚠️ Regular text has 4.5:1 minimum contrast ratio
- [ ] ⚠️ Large text (18pt+) has 3:1 minimum contrast ratio
- [ ] ⚠️ UI components (buttons, borders) have 3:1 minimum contrast
- [ ] ⚠️ Focus indicators have 3:1 contrast against background
- [ ] Information isn't conveyed by color alone (text/icons included)
- [ ] Both light and dark modes are supported (if applicable)
- [ ] High-contrast mode is functional (Windows High Contrast)
- [ ] Semantic colors are used consistently (green=success, red=error)

**Tools**: WebAIM Contrast Checker, axe DevTools

### Layout & Hierarchy
- [ ] Clear visual hierarchy (primary → secondary → tertiary)
- [ ] Consistent spacing using 8px base unit (4px, 8px, 16px, 24px, 32px)
- [ ] Alignment is consistent throughout interface
- [ ] White space is used effectively (not cluttered)
- [ ] Primary actions are most prominent
- [ ] Related elements are grouped together
- [ ] Grid system is consistent (12-column or 16-column)

### Typography
- [ ] Font sizes follow type scale (H1, H2, H3, Body, Caption)
- [ ] Body text is minimum 16px (12px absolute minimum)
- [ ] Line length is 50-70 characters (maximum 80)
- [ ] Line height is 1.5-1.6 for body text
- [ ] Text is left-aligned (or right-aligned for RTL languages)
- [ ] Font weights are consistent (regular, medium, bold only)
- [ ] Text is readable at 200% zoom

### Icons & Images
- [ ] Icons are consistent style (all outline or all filled)
- [ ] Icon sizes are standardized (16px, 24px, 32px, 48px)
- [ ] All icons have text labels or aria-labels
- [ ] Images have appropriate alt text
- [ ] Decorative images have empty alt attribute (`alt=""`)
- [ ] Icons use universal metaphors (magnifying glass = search)
- [ ] SVG is used for scalable graphics

---

## Accessibility (WCAG 2.1)

### Screen Reader Compatibility
- [ ] ⚠️ All images have descriptive alt text (150-250 characters)
- [ ] ⚠️ Semantic HTML is used (`<button>`, `<nav>`, `<main>`, `<header>`)
- [ ] ⚠️ ARIA landmarks define page regions (`role="navigation"`, `role="main"`)
- [ ] ⚠️ Form inputs have associated labels (`<label>` or `aria-label`)
- [ ] ⚠️ Dynamic content changes are announced (`aria-live="polite"`)
- [ ] Link text is descriptive ("Read more about X" vs "Click here")
- [ ] Page has descriptive `<title>` tag
- [ ] Headings are hierarchical (H1 → H2 → H3, no skipping)
- [ ] Tables have `<th>` headers with proper scope
- [ ] Custom controls have appropriate ARIA roles

**Test With**: NVDA (Windows), JAWS (Windows), VoiceOver (macOS/iOS)

### Keyboard Accessibility
- [ ] ⚠️ All functionality is accessible via keyboard only
- [ ] ⚠️ Tab order is logical and sequential
- [ ] ⚠️ Focus indicators are clearly visible (3:1 contrast minimum)
- [ ] ⚠️ No keyboard traps (user can navigate away from all elements)
- [ ] "Skip to main content" link is present
- [ ] Dropdown menus navigate with arrow keys
- [ ] Modals trap focus and restore focus on close
- [ ] Custom keyboard shortcuts are documented
- [ ] Escape key closes dialogs and dropdowns

**Test**: Unplug mouse, navigate entire app with keyboard

### Perceivable
- [ ] ⚠️ Video has captions
- [ ] ⚠️ Audio has transcripts
- [ ] Content is adaptable (doesn't lose information when resized)
- [ ] Text can be resized up to 200% without breaking layout
- [ ] Content reflows without horizontal scrolling at 400% zoom
- [ ] UI doesn't rely solely on sensory characteristics (shape, color, position)

### Operable
- [ ] ⚠️ No content flashes more than 3 times per second
- [ ] Users have sufficient time to complete actions (or can extend time)
- [ ] Auto-playing content can be paused/stopped
- [ ] No time limits on user input (or limits can be extended)
- [ ] Multiple navigation methods available (menu, search, sitemap)

### Understandable
- [ ] Language is declared in HTML (`<html lang="en">`)
- [ ] Jargon is explained or avoided
- [ ] Navigation is consistent across pages
- [ ] Interactive elements behave predictably
- [ ] Context changes are initiated by user (no surprise redirects)
- [ ] Error messages are clear and actionable

### Robust
- [ ] HTML is valid (no major errors)
- [ ] ARIA attributes are used correctly
- [ ] Works with assistive technologies (screen readers, magnifiers)

**Tools**: axe DevTools, Lighthouse Accessibility Audit, WAVE

---

## Keyboard Navigation

### Tab Order
- [ ] ⚠️ Tab order follows visual flow (left-to-right, top-to-bottom)
- [ ] ⚠️ All interactive elements are keyboard accessible
- [ ] Hidden elements are removed from tab order (`tabindex="-1"` or `display:none`)
- [ ] Tab order makes logical sense for task completion

### Focus Management
- [ ] ⚠️ Focus indicator is visible (3:1 contrast against all backgrounds)
- [ ] Focus indicator is not hidden by CSS (`outline: none` without replacement)
- [ ] Focus is trapped in modal dialogs
- [ ] Focus returns to trigger element after modal closes
- [ ] Focus is managed when content changes dynamically
- [ ] Custom focus styles match design system

### Keyboard Shortcuts
- [ ] Common shortcuts work (Enter to submit, Escape to cancel)
- [ ] Arrow keys navigate dropdowns, tabs, and menus
- [ ] Spacebar activates buttons and checkboxes
- [ ] Custom shortcuts are documented
- [ ] Shortcuts don't conflict with browser/screen reader shortcuts

**Test**: Tab through entire interface, interact with all elements using keyboard only

---

## Responsive Design

### Screen Sizes
- [ ] ⚠️ Tested on mobile (375px width minimum)
- [ ] ⚠️ Tested on tablet (768px-1024px)
- [ ] ⚠️ Tested on desktop (1024px-1440px)
- [ ] ⚠️ Tested on large screens (>1440px)
- [ ] No horizontal scrolling on any screen size
- [ ] Content reflows appropriately
- [ ] Images scale correctly

### Touch Targets (Mobile)
- [ ] ⚠️ All touch targets are minimum 44x44px
- [ ] Touch targets have 8px spacing between them
- [ ] Critical actions are within thumb reach (bottom of screen)
- [ ] Gestures have non-gesture alternatives

### Breakpoints
- [ ] Mobile-first approach used (base styles for mobile)
- [ ] Layout uses flexible units (%, fr) not fixed pixels
- [ ] Media queries handle breakpoints (768px, 1024px, 1440px)
- [ ] Content adapts gracefully between breakpoints

### Device Testing
- [ ] Tested on iOS (Safari)
- [ ] Tested on Android (Chrome)
- [ ] Tested in landscape and portrait orientations
- [ ] Tested with touch, mouse, and keyboard inputs

**Tools**: Chrome DevTools Device Emulation, BrowserStack

---

## Interactive Elements

### Buttons
- [ ] ⚠️ Primary action is most prominent (one per section)
- [ ] All buttons have clear, action-oriented labels ("Save Changes" not "Submit")
- [ ] Disabled buttons are visually distinct (reduced opacity)
- [ ] Loading state is shown for async actions
- [ ] Minimum size 32px height (44px for touch)

### Button States
- [ ] Default state
- [ ] Hover state (subtle color change)
- [ ] Focus state (visible outline)
- [ ] Active/Pressed state (darker or scaled)
- [ ] Disabled state (reduced opacity, no hover)
- [ ] Loading state (spinner or progress indicator)

### Links
- [ ] Links are underlined or otherwise visually distinct
- [ ] Link text describes destination ("Documentation" not "Click here")
- [ ] External links open in new tab with warning (`target="_blank"`)
- [ ] Links have :hover and :focus states

### Dropdowns & Menus
- [ ] Current selection is clearly visible
- [ ] Open state is visually distinct
- [ ] Arrow keys navigate options
- [ ] Enter key selects option
- [ ] Escape key closes dropdown
- [ ] Search/filter available for >10 items

### Modals & Dialogs
- [ ] ⚠️ Background is dimmed (40-60% opacity overlay)
- [ ] ⚠️ Focus is trapped within modal
- [ ] ⚠️ Focus returns to trigger element on close
- [ ] Click outside or Escape key closes modal
- [ ] Modal has clear title and purpose
- [ ] Primary action is on right, cancel on left

### Tooltips & Popovers
- [ ] Appear on hover and focus (keyboard accessible)
- [ ] Disappear when no longer hovered/focused
- [ ] Don't obscure critical content
- [ ] Delay before appearing (500ms)

---

## Forms & Input

### Form Labels
- [ ] ⚠️ Every input has a visible label
- [ ] Labels are associated with inputs (`<label for="id">`)
- [ ] Required fields are clearly marked (not just asterisk)
- [ ] Helper text provides additional guidance
- [ ] Placeholders don't replace labels

### Input States
- [ ] Default state
- [ ] Focus state (clear border or outline)
- [ ] Error state (red border + descriptive message)
- [ ] Success state (green checkmark if appropriate)
- [ ] Disabled state (grayed out, not interactive)

### Input Validation
- [ ] ⚠️ Client-side validation provides immediate feedback
- [ ] ⚠️ Error messages are specific and actionable
- [ ] ⚠️ Errors appear near the input field
- [ ] Validation triggered on blur, not on every keystroke
- [ ] Form can't be submitted with errors
- [ ] Success confirmation shown after submission

### Error Messages
- [ ] Clear explanation of what's wrong
- [ ] Specific guidance on how to fix
- [ ] Example of correct format (if applicable)
- [ ] Polite tone ("Please enter..." not "Error!")

**Example**:
```
❌ "Invalid email"
✅ "Please enter a valid email address (example: user@domain.com)"
```

### Form Design
- [ ] Related fields are grouped together
- [ ] Logical tab order through form
- [ ] Submit button is at bottom-right
- [ ] Cancel/Reset button is secondary style
- [ ] Multi-step forms show progress indicator
- [ ] Sensitive data (passwords) can be shown/hidden

### Checkboxes & Radio Buttons
- [ ] Minimum size 20x20px (visible control)
- [ ] Touch target 44x44px (including padding)
- [ ] Labels are clickable
- [ ] Related options are grouped with fieldset + legend
- [ ] Radio buttons have exactly one selected (default)

---

## Content & Typography

### Readability
- [ ] Body text is 16px minimum
- [ ] Line length is 50-70 characters
- [ ] Line height is 1.5-1.6 for body text
- [ ] Text is left-aligned (not justified)
- [ ] Sufficient contrast (4.5:1 for text)

### Headings
- [ ] Hierarchical structure (H1 → H2 → H3)
- [ ] Only one H1 per page
- [ ] Headings describe content below them
- [ ] Consistent styling across pages

### Content Quality
- [ ] Clear, concise language
- [ ] Active voice preferred
- [ ] Jargon is explained or avoided
- [ ] Consistent terminology throughout
- [ ] No spelling or grammar errors

### Microcopy
- [ ] Button labels are action-oriented
- [ ] Error messages are helpful
- [ ] Empty states provide guidance
- [ ] Loading messages keep users informed
- [ ] Success messages confirm completion

---

## Performance

### Load Time
- [ ] ⚠️ Initial page load <3 seconds
- [ ] ⚠️ Time to Interactive (TTI) <5 seconds
- [ ] Images are optimized (WebP format when supported)
- [ ] Fonts are preloaded or use font-display: swap
- [ ] JavaScript is minified and bundled

### Animations
- [ ] ⚠️ Animations run at 60fps (smooth)
- [ ] ⚠️ Respect prefers-reduced-motion preference
- [ ] Animation duration 200-400ms (most UI animations)
- [ ] No layout shift during page load (CLS < 0.1)

### Network Performance
- [ ] Lazy loading for images below fold
- [ ] API calls are debounced/throttled
- [ ] Loading indicators for slow operations
- [ ] Offline functionality (if applicable)

**Tools**: Lighthouse, WebPageTest, Chrome DevTools Performance Tab

---

## Error Handling

### Error States
- [ ] ⚠️ All error scenarios are handled gracefully
- [ ] Error messages are user-friendly (not technical)
- [ ] Clear instructions for recovery
- [ ] Option to retry failed actions
- [ ] Support contact info for unrecoverable errors

### Error Message Structure
- [ ] Title describing what went wrong
- [ ] Explanation of why it happened
- [ ] Instructions for how to fix
- [ ] Action buttons (Retry, Cancel, Contact Support)

### Form Errors
- [ ] Inline validation on blur
- [ ] Error summary at top of form
- [ ] Focus moves to first error field
- [ ] Errors persist until fixed
- [ ] Success message after correction

### Network Errors
- [ ] Handle timeout gracefully
- [ ] Offline message if no connectivity
- [ ] Retry mechanism for failed requests
- [ ] Data saved locally (avoid data loss)

### 404 / Error Pages
- [ ] Custom 404 page (not default)
- [ ] Search box to find content
- [ ] Links to main sections
- [ ] Consistent branding/navigation

---

## Cross-Browser Testing

### Desktop Browsers
- [ ] ⚠️ Chrome/Edge (Chromium) - latest version
- [ ] ⚠️ Firefox - latest version
- [ ] ⚠️ Safari - latest version (macOS)
- [ ] Older browsers (if required by audience)

### Mobile Browsers
- [ ] ⚠️ iOS Safari - latest version
- [ ] ⚠️ Chrome (Android) - latest version
- [ ] Samsung Internet (if targeting Android)

### Browser Features
- [ ] CSS Grid/Flexbox fallbacks (if needed)
- [ ] JavaScript fallbacks for critical features
- [ ] Progressive enhancement approach
- [ ] Graceful degradation for older browsers

### Device Testing
- [ ] iPhone (multiple sizes)
- [ ] iPad
- [ ] Android phone (multiple sizes)
- [ ] Android tablet
- [ ] Windows desktop (1080p, 1440p, 4K)
- [ ] macOS desktop (Retina and non-Retina)

**Tools**: BrowserStack, LambdaTest, Sauce Labs

---

## Additional Checks

### Search Engine Optimization (SEO)
- [ ] Page titles are descriptive and unique
- [ ] Meta descriptions are present
- [ ] Headings use semantic HTML
- [ ] URLs are descriptive and clean
- [ ] Images have alt text
- [ ] Sitemap exists (sitemap.xml)

### Analytics & Monitoring
- [ ] Analytics tracking is implemented
- [ ] Key user actions are tracked
- [ ] Error logging is in place
- [ ] Performance monitoring is active

### Legal & Compliance
- [ ] Privacy policy is accessible
- [ ] Cookie consent (if applicable)
- [ ] Terms of service are linked
- [ ] GDPR compliance (if applicable)
- [ ] Copyright notices are present

### Security
- [ ] HTTPS is enforced
- [ ] Sensitive data is encrypted
- [ ] Authentication is secure
- [ ] Input is sanitized (XSS protection)
- [ ] CSRF protection is implemented

---

## Final Review

### Usability Testing
- [ ] ⚠️ Users can complete key tasks successfully
- [ ] Task completion time is reasonable
- [ ] Error rate is low (<5%)
- [ ] User satisfaction is high (>4/5)
- [ ] Feedback has been incorporated

### Quality Assurance
- [ ] No console errors
- [ ] No broken links
- [ ] All images load correctly
- [ ] All features work as expected
- [ ] Edge cases are handled

### Documentation
- [ ] User guide is available
- [ ] Help/FAQ section exists
- [ ] Contact/support information is clear
- [ ] Changelog is maintained (for updates)

---

## Sign-Off

**Project Name**: _______________________

**Date**: _______________________

**Reviewed By**: _______________________

### Critical Issues Found
_List any critical (⚠️) items that failed_

1. 
2. 
3. 

### Notes
_Additional observations or context_

---

---

## Quick Reference: Must-Fix Before Launch

These items are ⚠️ **CRITICAL** and must be addressed:

1. **Accessibility**
   - Text contrast 4.5:1 minimum
   - Keyboard navigation works
   - Screen reader compatible
   - Focus indicators visible

2. **Responsive**
   - Works on mobile (375px)
   - Touch targets 44x44px
   - No horizontal scroll

3. **Performance**
   - Page load <3 seconds
   - Animations at 60fps
   - Respect reduced motion

4. **Core Functionality**
   - All features work
   - Error handling present
   - Cross-browser tested
   - Users can complete tasks

---

## Tools Summary

### Accessibility
- **axe DevTools**: Browser extension for accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Chrome DevTools auditing
- **NVDA**: Free screen reader (Windows)
- **VoiceOver**: Built-in screen reader (macOS/iOS)

### Color & Contrast
- **WebAIM Contrast Checker**: https://webaim.org/resources/contrastchecker/
- **Colorable**: https://colorable.jxnblk.com/

### Performance
- **Lighthouse**: Chrome DevTools
- **WebPageTest**: https://webpagetest.org/
- **GTmetrix**: https://gtmetrix.com/

### Cross-Browser Testing
- **BrowserStack**: https://browserstack.com/
- **LambdaTest**: https://lambdatest.com/

---

**Document Version**: 1.0  
**Last Updated**: November 2025  
**Companion Document**: `GUI_DESIGN_STANDARDS.md`
