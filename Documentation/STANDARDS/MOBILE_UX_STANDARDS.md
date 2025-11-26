# Mobile UX Standards - iPhone & Touch Interface Design
## Industry-Leading Standards for Mobile Application Development

> **Purpose**: This comprehensive guide provides research-backed standards for creating exceptional mobile user experiences, with special focus on iPhone/iOS interfaces. Based on Apple Human Interface Guidelines, Microsoft touch interaction standards, and industry best practices.

**Last Updated**: November 18, 2025

---

## Table of Contents

1. [Core Mobile Design Principles](#core-mobile-design-principles)
2. [Touch Target Standards](#touch-target-standards)
3. [Button Layout & Spacing](#button-layout--spacing)
4. [Screen Transitions & Navigation](#screen-transitions--navigation)
5. [iOS-Specific Guidelines](#ios-specific-guidelines)
6. [Responsive Design Patterns](#responsive-design-patterns)
7. [Accessibility Requirements](#accessibility-requirements)
8. [Common Anti-Patterns to Avoid](#common-anti-patterns-to-avoid)
9. [Testing & Validation](#testing--validation)
10. [Implementation Checklist](#implementation-checklist)

---

## Core Mobile Design Principles

### Design for Thumbs, Not Mice

Mobile interfaces must account for the **thumb zone** - the comfortable reach area when holding a device:

```
┌─────────────────────────┐
│  ❌ HARD TO REACH       │  Top corners/edges
│                         │
│  ⚠️  MODERATE           │  Upper middle
│     EFFORT              │
│                         │
│  ✅ EASY REACH          │  Bottom third (thumb zone)
│     (Optimal)           │  Center area
└─────────────────────────┘
```

**Key Principles**:
1. **One-Handed Use**: Primary actions should be reachable with one thumb
2. **Thumb-Friendly Zones**: Place frequently used controls in bottom 1/3 of screen
3. **Large Touch Targets**: Minimum 44×44 points (iOS) / 48×48 dp (Android)
4. **Adequate Spacing**: Prevent accidental taps with proper spacing between interactive elements

### The 3-Second Rule

Users decide whether to continue using your app within **3 seconds**:
- ✅ Instant feedback for all interactions
- ✅ Clear visual hierarchy
- ✅ Obvious primary action
- ✅ Minimal cognitive load

### Progressive Disclosure

Don't overwhelm users with all options at once:
- Show only what users need NOW
- Reveal additional options as needed
- Use steppers, wizards, or collapsible sections
- Keep complex decisions simple

---

## Touch Target Standards

### Minimum Touch Target Sizes

#### iOS / iPhone Standards (Apple HIG)

| Device Type | Minimum Size | Recommended | Optimal |
|-------------|-------------|-------------|---------|
| **iPhone** | 44×44 pt | 48×48 pt | 60×60 pt |
| **iPad** | 44×44 pt | 50×50 pt | 60×60 pt |
| **visionOS** | 60×60 pt | 75×75 pt | 90×90 pt |

**Points (pt) vs Pixels**:
- iPhone standard resolution: @2x (1 pt = 2 px)
- iPhone Retina HD: @3x (1 pt = 3 px)
- Example: 44pt = 88px (@2x) or 132px (@3x)

#### Cross-Platform Standards

| Platform | Minimum Touch Target |
|----------|---------------------|
| iOS (Apple HIG) | 44×44 pt |
| Android (Material Design) | 48×48 dp |
| Windows (Fluent Design) | 40×40 epx (standard)<br>44×44 epx (touch-optimized) |
| Web (WCAG 2.1) | 44×44 CSS pixels |

### Touch Target Best Practices

#### 1. Match Visual Size to Touch Target

❌ **Bad**: Small visual with large invisible touch area
```
[  •  ]  ← 44×44 touch target
   ↑
Tiny 10×10 icon (confusing!)
```

✅ **Good**: Visual fills most of touch area
```
[  ⚫  ]  ← 44×44 touch target
   ↑
Clear 32×32 icon (obvious!)
```

#### 2. Icon-Only Buttons

When using icons without text labels:
- **Minimum**: 44×44 pt touch target
- **Icon size**: 24-32 pt (leaves 12-20 pt padding)
- **Always provide tooltip** or label for accessibility

#### 3. Text Buttons

For text-only buttons:
- **Minimum height**: 44 pt
- **Minimum width**: 44 pt (short text) or auto-width with 16pt padding
- **Padding**: 16pt horizontal, 12pt vertical (minimum)

#### 4. Full-Width Buttons

Primary action buttons (Submit, Continue, Save):
```
┌─────────────────────────────────────┐
│                                     │
│  ┌───────────────────────────────┐ │
│  │      Continue (44pt tall)     │ │  ← Full width minus 16pt margins
│  └───────────────────────────────┘ │
│                                     │
└─────────────────────────────────────┘
```

- Use 16-20pt margins from screen edges
- Height: 44-50pt
- Respect safe areas (notch, home indicator)

---

## Button Layout & Spacing

### Multiple Buttons Side-by-Side

#### Two Buttons (Most Common)

**Horizontal Layout** (iOS standard):
```
┌─────────────────────────────────────┐
│  ┌──────────────┐  ┌──────────────┐ │
│  │   Cancel     │  │   Confirm    │ │  ← 44pt tall each
│  └──────────────┘  └──────────────┘ │
│         ↑               ↑            │
│         └───── 8-16pt gap ─────┘    │
└─────────────────────────────────────┘
      Margin: 16pt          Margin: 16pt
```

**Spacing Standards**:
- **Minimum gap**: 8 pt (prevents accidental taps)
- **Recommended gap**: 12 pt (comfortable)
- **Optimal gap**: 16 pt (very comfortable)
- **Side margins**: 16-20 pt from screen edges

**Button Sizing**:
- ✅ **Equal width**: Each button takes 50% minus spacing
- ✅ **Content-based**: Size based on text length (with minimums)
- ❌ **Avoid**: Making one button much larger unless it's the primary action

#### Stacked Buttons (Vertical)

When horizontal space is limited:
```
┌─────────────────────────┐
│  ┌───────────────────┐  │
│  │   Primary Action  │  │  ← 44-50pt tall
│  └───────────────────┘  │
│           ↓              │
│        12-16pt gap       │
│           ↓              │
│  ┌───────────────────┐  │
│  │  Secondary Action │  │  ← 44-50pt tall
│  └───────────────────┘  │
└─────────────────────────┘
```

**Vertical Spacing**:
- **Between buttons**: 12-16 pt
- **Primary on top**: Most important action first
- **Destructive on bottom**: "Delete" or "Cancel" lower

#### Three or More Buttons

**❌ Avoid This Pattern**:
```
[Btn1] [Btn2] [Btn3]  ← Too crowded horizontally
```

**✅ Better Alternatives**:

**Option 1**: Primary + Menu
```
┌────────────────────────────┐
│  [Primary Action]  [⋮ More]│  ← Overflow menu for secondary actions
└────────────────────────────┘
```

**Option 2**: Segmented Control (related options)
```
┌────────────────────────────┐
│  [View 1] [View 2] [View 3]│  ← Only for switching views/modes
└────────────────────────────┘
```

**Option 3**: Action Sheet (iOS)
```
User taps button → Sheet slides up with all options
```

### Visual Hierarchy for Multiple Buttons

#### Style Differentiation

Use different button styles to communicate priority:

```
┌──────────────────────────────────────┐
│                                      │
│  ┌────────────────────────────────┐ │
│  │     Continue (Filled/Tinted)   │ │  ← PRIMARY: Most prominent
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │
│  │     Save Draft (Outlined)      │ │  ← SECONDARY: Less prominent
│  └────────────────────────────────┘ │
│                                      │
│  [Cancel]  ← Text-only              │  ← TERTIARY: Minimal style
│                                      │
└──────────────────────────────────────┘
```

**iOS Button Hierarchy**:
1. **Primary**: `.filled` or `.tinted` style (accent color background)
2. **Secondary**: `.bordered` or `.gray` style (subtle outline)
3. **Tertiary**: `.plain` or `.borderless` style (text only)

### Safe Areas & Margins

#### iPhone Screen Zones

```
┌─────────────────────────────────────┐
│  ⚠️  NOTCH / DYNAMIC ISLAND         │  ← Avoid placing buttons here
├─────────────────────────────────────┤
│  Safe Area Top: 20-50pt            │
│                                     │
│  Content Area                      │
│  (Most of your UI goes here)       │
│                                     │
│  Safe Area Bottom: 34pt (w/ notch) │
├─────────────────────────────────────┤
│  ⚠️  HOME INDICATOR AREA            │  ← Avoid placing buttons here
└─────────────────────────────────────┘
```

**Critical Rules**:
- ✅ Use `safe Area Insets` / `safe Area Layout Guide`
- ✅ Keep buttons **34pt** above bottom on notched iPhones
- ✅ Account for status bar and notch at top
- ❌ Never place buttons in notch area or over home indicator

---

## Screen Transitions & Navigation

### Types of Transitions

#### 1. Push/Pop (Hierarchical Navigation)

**Use When**: Moving deeper into a hierarchy (Settings → Account → Edit Profile)

```
Screen A  →  Screen B  →  Screen C
  [List]  →  [Detail]  →  [Edit]
  
← Back button always in top-left
```

**Animation**: Slide from right (push), slide to right (pop)
**Duration**: 0.3-0.35 seconds (iOS standard)

**Best Practices**:
- ✅ Include back button or swipe-from-edge gesture
- ✅ Show clear title in navigation bar
- ✅ Maintain context (breadcrumb trail)
- ❌ Don't go more than 4-5 levels deep

#### 2. Modal Presentation (Sheets/Cards)

**Use When**: Temporary task, focus needed, or getting information

```
┌─────────────────────────────┐
│  Main Screen                │
│                             │
│  ┌───────────────────────┐ │
│  │  Modal Sheet          │ │  ← Slides up from bottom
│  │  [Cancel]     [Done]  │ │
│  │                       │ │
│  │  Content...           │ │
│  └───────────────────────┘ │
└─────────────────────────────┘
```

**Animation**: Slide up from bottom (present), slide down (dismiss)
**Duration**: 0.3-0.4 seconds

**Modal Types**:
- **Sheet**: Covers most of screen, shows context behind
- **Full Screen**: Covers entire screen (use sparingly)
- **Popover (iPad)**: Floating window anchored to button

**Best Practices**:
- ✅ Always provide clear way to dismiss (Cancel, Close, Done)
- ✅ Use for tasks that should complete before returning
- ✅ Keep modals focused on single task
- ❌ Don't nest modals more than 1 level deep

#### 3. Tab Switching

**Use When**: Switching between peer screens/sections

```
[Home]    [Search]    [Profile]
   ↑         ↑           ↑
 Active   Inactive   Inactive
```

**Animation**: Cross-fade or instant (no slide)
**Duration**: 0.2 seconds (subtle)

**Best Practices**:
- ✅ Limit to 5 tabs maximum (iOS standard)
- ✅ Use clear icons + labels
- ✅ Highlight active tab
- ✅ Remember scroll position in each tab

### Transition Best Practices

#### Loading & Feedback During Transitions

**❌ Bad**: Screen goes blank during load
```
Screen A  →  [⚪ Blank]  →  Screen B
```

**✅ Good**: Skeleton screens or progressive loading
```
Screen A  →  [Structure + Spinner]  →  Screen B
```

**Loading Patterns**:
1. **Inline Spinner**: Small task, button shows spinner
2. **Full-Screen Spinner**: Major navigation, overlay with spinner
3. **Skeleton Screen**: Show layout structure while loading
4. **Progressive Load**: Show content as it arrives

#### Gesture-Driven Transitions

**Swipe to Go Back** (iOS standard):
- Swipe from left edge → Navigate back
- Works in any navigation view
- Provides instant visual feedback

**Pull to Refresh**:
- Pull down from top → Refresh content
- Shows spinner/progress indicator
- Haptic feedback on trigger

**Swipe Between Screens**:
- Swipe left/right between peer views (tabs, pages)
- Use page indicators for multi-page views

#### Preventing Accidental Navigation

**Confirmation for Unsaved Changes**:
```
User taps Back with unsaved data
  ↓
[Alert] Discard Changes?
  [Cancel]  [Discard]
```

**Destructive Action Confirmation**:
```
User taps Delete
  ↓
[Action Sheet] Are you sure?
  [Delete] (red)
  [Cancel]
```

### Animation Timing Guidelines

| Transition Type | Duration | Easing |
|----------------|----------|--------|
| Screen push/pop | 0.3-0.35s | Ease-in-out |
| Modal present/dismiss | 0.3-0.4s | Spring (iOS) |
| Tab switch | 0.2s | Ease-in |
| Fade in/out | 0.2-0.3s | Linear or ease |
| Button press | 0.1-0.15s | Ease-out |
| Micro-interactions | 0.15-0.2s | Spring |

**General Rules**:
- ✅ Fast for small changes (< 0.2s)
- ✅ Standard for screen transitions (0.3-0.4s)
- ✅ Never exceed 0.5s (feels sluggish)
- ✅ Match system animation speed

---

## iOS-Specific Guidelines

### Screen Size Classes (Size Classes)

iOS uses **size classes** to define layouts for different screen configurations:

| Device | Portrait | Landscape |
|--------|----------|-----------|
| iPhone (standard) | Compact width, Regular height | Compact width, Compact height |
| iPhone Plus/Max | Compact width, Regular height | **Regular width**, Compact height |
| iPad | Regular width, Regular height | Regular width, Regular height |

**Responsive Strategies**:
1. **Compact Width**: Stack elements vertically, single column
2. **Regular Width**: Use multi-column layouts, sidebars
3. **Compact Height**: Reduce vertical spacing, minimize chrome

### Navigation Patterns

#### 1. Navigation Bar (Top Bar)

```
┌────────────────────────────────────┐
│  [< Back]  Title        [Action]   │  ← 44pt tall
├────────────────────────────────────┤
│                                    │
│  Content                           │
```

**Components**:
- **Left**: Back button (< arrow + previous title)
- **Center**: Current screen title
- **Right**: Primary action or menu

**Best Practices**:
- ✅ Keep titles short (1-2 words)
- ✅ Use icons for actions (with labels for accessibility)
- ✅ Don't overload with too many buttons

#### 2. Tab Bar (Bottom Navigation)

```
┌────────────────────────────────────┐
│                                    │
│  Content                           │
│                                    │
├────────────────────────────────────┤
│  [Home]  [Search]  [Profile]  [More]│  ← 49pt tall
└────────────────────────────────────┘
```

**Best Practices**:
- ✅ 3-5 tabs maximum
- ✅ Icon + label for each tab
- ✅ Highlight active tab with accent color
- ❌ Don't use for actions (use toolbar instead)

#### 3. Toolbar (Action Bar)

```
┌────────────────────────────────────┐
│  [Share] [Edit] [Delete]     [More]│  ← 44pt tall
└────────────────────────────────────┘
```

**Best Practices**:
- Use for contextual actions on current screen
- Combine with navigation bar or tab bar
- Group related actions

### iOS UI Components

#### System Buttons

```swift
// Filled button (primary)
Button("Continue") { }
    .buttonStyle(.borderedProminent)

// Bordered button (secondary)
Button("Cancel") { }
    .buttonStyle(.bordered)

// Plain button (tertiary)
Button("Learn More") { }
    .buttonStyle(.plain)
```

#### Activity Indicator in Button

iOS allows showing a spinner inside a button:
```
[Submitting...  ⭕]  ← Button with activity indicator
```

Useful for:
- Form submissions
- Loading next screen
- Processing actions

---

## Responsive Design Patterns

### Designing for Multiple Screen Sizes

#### iPhone Screen Sizes (2025)

| Device | Screen Size (pt) | Notes |
|--------|------------------|-------|
| iPhone SE | 375 × 667 | Smallest current iPhone |
| iPhone 17 | 402 × 874 | Standard size |
| iPhone 17 Plus | 430 × 932 | Large size |
| iPhone 17 Pro Max | 440 × 956 | Largest iPhone |

**Key Breakpoints**:
- **Compact**: < 400pt width → Single column, stacked buttons
- **Regular**: ≥ 400pt width → More flexible layouts

### Layout Strategies

#### 1. Fluid Layouts

**Scale proportionally** with screen size:
```
┌─────────────┐  ┌─────────────────┐  ┌──────────────────┐
│   Header    │  │    Header       │  │     Header       │
├─────────────┤  ├─────────────────┤  ├──────────────────┤
│  Content    │  │   Content       │  │    Content       │
│             │  │                 │  │                  │
└─────────────┘  └─────────────────┘  └──────────────────┘
  iPhone SE        iPhone 17           iPhone Pro Max
```

#### 2. Stacking & Reflow

**Rearrange elements** for different sizes:
```
Desktop/iPad:         iPhone:
┌─────────┬─────┐    ┌──────────┐
│ Content │Side │    │ Content  │
│         │bar  │    ├──────────┤
└─────────┴─────┘    │ Sidebar  │
                     └──────────┘
```

#### 3. Progressive Disclosure

**Hide/show features** based on space:
```
Large Screen:              Small Screen:
[Edit] [Share] [Delete]    [⋮ More]
```

### Typography Scaling

#### Dynamic Type Support

iOS **Dynamic Type** lets users choose their preferred text size:

| Style | Default Size | Accessible Sizes |
|-------|--------------|------------------|
| Large Title | 34pt | 44-84pt |
| Title 1 | 28pt | 38-76pt |
| Body | 17pt | 23-53pt |
| Caption | 12pt | 18-37pt |

**Implementation**:
```swift
Text("Welcome")
    .font(.largeTitle)  // Automatically scales
```

**Best Practices**:
- ✅ Use system text styles (they scale automatically)
- ✅ Test at largest text size (Accessibility settings)
- ✅ Ensure layouts don't break with large text
- ❌ Don't use fixed font sizes for UI text

### Testing Different Sizes

**Xcode Simulators** to test:
- iPhone SE (smallest)
- iPhone 17 (standard)
- iPhone 17 Pro Max (largest)
- iPad (regular width)

**Accessibility Testing**:
- Largest Dynamic Type size
- VoiceOver enabled
- Reduce Motion enabled
- High Contrast enabled

---

## Accessibility Requirements

### Touch Target Accessibility

#### WCAG 2.1 Standards

**Level AA** (Required):
- **Minimum touch target**: 44×44 CSS pixels (equivalent to 44pt)
- **Spacing**: At least 8px between targets

**Level AAA** (Recommended):
- **Minimum touch target**: 44×44 CSS pixels
- **Spacing**: At least 24px between targets OR targets not adjacent

#### VoiceOver Support

Every interactive element must:
- Have an **accessibility label** (describes purpose)
- Have an **accessibility hint** (optional, explains what happens)
- Have an **accessibility trait** (button, link, etc.)

```swift
Button("Submit") { }
    .accessibilityLabel("Submit form")
    .accessibilityHint("Sends your information to the server")
```

### Color & Contrast

#### Contrast Ratios (WCAG 2.1 AA)

- **Normal text** (< 24px): 4.5:1 contrast minimum
- **Large text** (≥ 24px): 3:1 contrast minimum
- **UI components**: 3:1 contrast against background

#### Color Independence

**❌ Bad**: Using only color to convey information
```
[Green button] Success
[Red button] Error
```

**✅ Good**: Color + icon/text
```
[Green button ✓] Success
[Red button ✗] Error
```

### Reduce Motion

Some users enable **Reduce Motion** (Settings → Accessibility):
- Disable parallax effects
- Use fade transitions instead of slides
- Minimize animation distance

```swift
@Environment(\.accessibilityReduceMotion) var reduceMotion

if reduceMotion {
    // Use fade instead of slide
} else {
    // Use standard slide animation
}
```

---

## Common Anti-Patterns to Avoid

### ❌ Anti-Pattern #1: Tiny Touch Targets

**Problem**:
```
[🔍] [✏️] [🗑️]  ← 20×20pt icons (too small!)
```

**Solution**:
```
[ 🔍 ] [ ✏️ ] [ 🗑️ ]  ← 44×44pt touch targets
```

**Why It's Bad**: Users miss taps, get frustrated, make errors

---

### ❌ Anti-Pattern #2: Cramped Button Layout

**Problem**:
```
[Cancel][OK][Submit]  ← No spacing, buttons touch
```

**Solution**:
```
[Cancel]    [OK]    [Submit]  ← 12-16pt spacing
```

**Why It's Bad**: Accidental taps, fat-finger errors

---

### ❌ Anti-Pattern #3: Unclear Primary Action

**Problem**:
```
[Submit]  [Cancel]  ← Both look the same
```

**Solution**:
```
[Submit]  Cancel  ← Primary styled, secondary plain
   ↑         ↑
 Filled    Text-only
```

**Why It's Bad**: Users don't know which button to press

---

### ❌ Anti-Pattern #4: Bottom Button Under Keyboard

**Problem**:
```
┌──────────────┐
│ Form fields  │
│ [Input]      │
├──────────────┤ ← Keyboard covers button
│  ⌨️ Keyboard │
│ [Submit] ←❌ │ Hidden!
└──────────────┘
```

**Solution**:
```
┌──────────────┐
│ Form fields  │
│ [Input]      │
│ [Submit] ✅  │ ← Above keyboard
├──────────────┤
│  ⌨️ Keyboard │
└──────────────┘
```

**Why It's Bad**: Users can't access the button

---

### ❌ Anti-Pattern #5: No Loading Feedback

**Problem**:
```
User taps [Submit]
  ↓
Nothing happens... (user taps again and again)
```

**Solution**:
```
User taps [Submit]
  ↓
[Submitting... ⭕]  ← Immediate feedback
```

**Why It's Bad**: Feels unresponsive, causes duplicate submissions

---

### ❌ Anti-Pattern #6: Ignoring Safe Areas

**Problem**:
```
┌──────────────┐
│ 🎵 Notch    │ ← Button hidden behind notch
│ [Button]    │
└──────────────┘
```

**Solution**:
```
┌──────────────┐
│              │ ← Safe area respected
│ [Button]     │ ← Button fully visible
└──────────────┘
```

**Why It's Bad**: Buttons inaccessible, looks unprofessional

---

### ❌ Anti-Pattern #7: Too Many Modal Dialogs

**Problem**:
```
Screen 1 → [Modal 1] → [Modal 2] → [Modal 3]
         (nested modals, can't escape)
```

**Solution**:
```
Screen 1 → Screen 2 → Screen 3
         (proper navigation hierarchy)
```

**Why It's Bad**: Users feel trapped, confusion about navigation

---

### ❌ Anti-Pattern #8: Fixed Font Sizes

**Problem**:
```swift
Text("Title")
    .font(.system(size: 20))  // Won't scale!
```

**Solution**:
```swift
Text("Title")
    .font(.title)  // Scales with Dynamic Type
```

**Why It's Bad**: Accessibility failure, text too small for some users

---

## Testing & Validation

### Manual Testing Checklist

#### Touch Target Testing
- [ ] All buttons are at least 44×44 pt
- [ ] Spacing between buttons is at least 8 pt
- [ ] Important buttons are 48×48 pt or larger
- [ ] No buttons overlap or are too close to screen edges

#### Layout Testing
- [ ] Test on smallest device (iPhone SE)
- [ ] Test on largest device (iPhone Pro Max)
- [ ] Test in portrait and landscape orientations
- [ ] Test with largest Dynamic Type size
- [ ] Check safe area insets (notch, home indicator)

#### Navigation Testing
- [ ] Back button works from every screen
- [ ] Modal dismissal is clear (Cancel/Done buttons)
- [ ] Loading states show feedback
- [ ] Transitions feel smooth (0.3-0.4s)
- [ ] No navigation dead ends

#### Accessibility Testing
- [ ] VoiceOver announces all buttons correctly
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Works with Reduce Motion enabled
- [ ] All interactive elements have accessibility labels
- [ ] Keyboard doesn't hide important buttons

### Automated Testing Tools

#### Xcode Accessibility Inspector
```
Xcode → Developer Tools → Accessibility Inspector
```
- Check contrast ratios
- Verify touch target sizes
- Test VoiceOver announcements

#### SwiftUI Preview Testing
```swift
struct ContentView_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            ContentView()
                .previewDevice("iPhone SE (3rd generation)")
            ContentView()
                .previewDevice("iPhone 15 Pro Max")
            ContentView()
                .environment(\.dynamicTypeSize, .xxxLarge)
        }
    }
}
```

### User Testing Methods

1. **Thumb Reach Test**: Can users reach all buttons with one hand?
2. **Fat Finger Test**: Use a stylus cap to simulate imprecise taps
3. **Speed Test**: Can users complete tasks in < 10 taps?
4. **Elderly User Test**: Test with users 60+ years old
5. **One-Handed Test**: Use app while holding phone in one hand only

---

## Implementation Checklist

### Essential Requirements

#### ✅ Touch Targets
- [ ] All interactive elements are minimum 44×44 pt
- [ ] Icon buttons have at least 24pt icon size
- [ ] Full-width buttons use 16-20pt margins
- [ ] Spacing between buttons is 8-16pt minimum

#### ✅ Button Layout
- [ ] Primary action uses prominent visual style
- [ ] Maximum 2 buttons side-by-side
- [ ] Destructive actions require confirmation
- [ ] Loading states show activity indicators

#### ✅ Screen Transitions
- [ ] Animations are 0.3-0.4s duration
- [ ] Loading feedback for delays > 0.5s
- [ ] Back navigation always available
- [ ] Modal dismissal is clear and obvious

#### ✅ iOS Guidelines
- [ ] Respect safe area insets
- [ ] Support Dynamic Type
- [ ] Provide VoiceOver labels
- [ ] Test on multiple device sizes

#### ✅ Accessibility
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Don't rely on color alone
- [ ] Support Reduce Motion
- [ ] Test with VoiceOver enabled

### Nice-to-Have Enhancements

- [ ] Haptic feedback for button presses
- [ ] Pull-to-refresh for list views
- [ ] Swipe gestures for navigation
- [ ] Skeleton screens for loading
- [ ] Progressive disclosure for complex forms
- [ ] Context menus for secondary actions

---

## Real-World Examples

### Example 1: Login Screen (iOS Best Practices)

```
┌──────────────────────────────────────┐
│  [< Back]    Login                   │  ← Navigation bar (44pt)
├──────────────────────────────────────┤
│                                      │
│  Welcome Back                        │  ← Large title
│                                      │
│  [Email input field (50pt tall)]     │  ← Larger than 44pt
│                                      │
│  [Password input field (50pt tall)]  │
│                                      │
│  [Forgot Password?]                  │  ← Tertiary button
│                                      │
│  ┌────────────────────────────────┐ │
│  │    Login (50pt tall)           │ │  ← Primary, full-width
│  └────────────────────────────────┘ │
│                                      │
│  Don't have an account? [Sign Up]   │  ← Text link
│                                      │
└──────────────────────────────────────┘
```

**Key Features**:
- Input fields are 50pt (taller than minimum)
- Primary button is full-width, prominent style
- Secondary actions use text-link style
- Plenty of vertical spacing (16-24pt between elements)

### Example 2: Confirmation Dialog

```
┌──────────────────────────────────────┐
│                                      │
│  Delete Item?                        │  ← Title
│                                      │
│  This action cannot be undone.       │  ← Description
│  Are you sure you want to delete     │
│  this item?                          │
│                                      │
│  ┌────────────────────────────────┐ │
│  │    Cancel (44pt)               │ │  ← Secondary, full-width
│  └────────────────────────────────┘ │
│           16pt spacing                │
│  ┌────────────────────────────────┐ │
│  │    Delete (44pt, RED)          │ │  ← Destructive, full-width
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
```

**Key Features**:
- Stacked buttons (safer than side-by-side)
- Destructive action uses red color
- Cancel button is easier to reach (on top)
- Both buttons are full-width

---

## Quick Reference Card

### Touch Targets
| Element | Minimum | Recommended |
|---------|---------|-------------|
| Button | 44×44 pt | 48×48 pt |
| Icon button | 44×44 pt | 60×60 pt |
| Text button height | 44 pt | 48-50 pt |

### Spacing
| Context | Spacing |
|---------|---------|
| Between buttons | 8-16 pt |
| Screen margins | 16-20 pt |
| Section spacing | 24-32 pt |
| Vertical stack gap | 12-16 pt |

### Animations
| Type | Duration |
|------|----------|
| Screen transition | 0.3-0.35s |
| Modal present/dismiss | 0.3-0.4s |
| Button press | 0.1-0.15s |
| Fade | 0.2-0.3s |

### Accessibility
| Standard | Requirement |
|----------|-------------|
| Touch target | 44×44 pt minimum |
| Text contrast | 4.5:1 (AA) |
| Large text contrast | 3:1 (AA) |
| UI component contrast | 3:1 |

---

## Resources

### Apple Official Documentation
- [Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/)
- [iOS Layout Guidelines](https://developer.apple.com/design/human-interface-guidelines/layout)
- [iOS Buttons](https://developer.apple.com/design/human-interface-guidelines/buttons)
- [Touch Interactions](https://developer.apple.com/design/human-interface-guidelines/touch-interactions)

### Microsoft Documentation
- [Touch Interaction Guidelines](https://learn.microsoft.com/en-us/windows/apps/design/input/touch-interactions)
- [Guidelines for Touch Targets](https://learn.microsoft.com/en-us/windows/apps/design/input/guidelines-for-targeting)

### Design Systems
- [Apple Design Resources](https://developer.apple.com/design/resources/) - Templates and UI kits
- [SF Symbols](https://developer.apple.com/sf-symbols/) - Icon library
- [Material Design (Android)](https://m3.material.io/)

### Testing Tools
- Xcode Accessibility Inspector
- [Color Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | November 18, 2025 | Initial comprehensive mobile UX standards document |

---

**Document Maintainer**: ProjectPlanner Standards Team  
**Last Review**: November 18, 2025  
**Next Review**: February 2026
