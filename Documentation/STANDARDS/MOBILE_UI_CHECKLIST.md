# Mobile UI Implementation Checklist & Quick Reference
## Practical Guide for Touch-Friendly Interface Development

> **Purpose**: This actionable checklist helps developers ensure their interfaces are mobile-ready, touch-friendly, and follow industry standards. Use this during development and code reviews.

**Last Updated**: November 18, 2025

---

## 🎯 Quick Decision Trees

### "Should I Use Multiple Buttons Side-by-Side?"

```
START: Do you have multiple buttons?
  ↓
  ├─ YES → Are they both equally important?
  │         ↓
  │         ├─ YES → Stack them vertically ✅
  │         │         [Primary]
  │         │         [Secondary]
  │         │
  │         └─ NO → Use visual hierarchy:
  │                  [Primary Filled] [Secondary Plain]
  │
  └─ NO → Single button is fine ✅
```

### "What Size Should My Button Be?"

```
Is it a primary action (Submit, Continue, Buy)?
  ├─ YES → Full-width, 48-50pt tall ✅
  │
  └─ NO → Is it an icon-only button?
            ├─ YES → 44×44pt minimum, 60×60pt recommended ✅
            │
            └─ NO → Text button: 44pt tall, auto-width + 16pt padding ✅
```

### "How Do I Handle Screen Transitions?"

```
Is it a temporary task/modal action?
  ├─ YES → Use modal/sheet (slides up from bottom) ✅
  │         [Cancel] [Done] at top
  │
  └─ NO → Going deeper in hierarchy?
            ├─ YES → Push navigation (slides from right) ✅
            │         Show back button
            │
            └─ NO → Switching between sections?
                      Use tab bar or cross-fade ✅
```

---

## ✅ Pre-Development Checklist

### Before You Start Coding

- [ ] **Review design mockups** for touch target sizes
- [ ] **Identify all interactive elements** (buttons, links, inputs)
- [ ] **Plan button hierarchy** (primary, secondary, tertiary)
- [ ] **Design for smallest screen first** (iPhone SE: 375pt width)
- [ ] **Consider one-handed use** (thumb zone)
- [ ] **Plan loading states** for all async actions
- [ ] **Design error states** and validation feedback

---

## 📋 Element-by-Element Checklist

### Buttons

#### Size Requirements
- [ ] All buttons are **at least 44×44 pt**
- [ ] Primary buttons are **48-50 pt tall** (larger = better)
- [ ] Icon-only buttons are **60×60 pt** (recommended)
- [ ] Full-width buttons have **16-20pt margins** from edges

#### Spacing
- [ ] **8-16pt minimum** between adjacent buttons
- [ ] Buttons don't overlap or touch
- [ ] Adequate spacing from screen edges (16-20pt)
- [ ] Vertical button stacks have **12-16pt** gaps

#### Visual Hierarchy
- [ ] Primary action uses **prominent style** (filled/tinted)
- [ ] Secondary actions use **subtle style** (outlined/plain)
- [ ] Destructive actions are **clearly marked** (red color)
- [ ] Only **1-2 prominent buttons** per screen

#### Content
- [ ] Button labels are **clear and concise** (2-3 words max)
- [ ] Icon buttons have **accessibility labels**
- [ ] Loading states show **activity indicators**
- [ ] Disabled states are **visually distinct**

#### Avoid These Button Mistakes
- [ ] ❌ Not using tiny buttons (< 44×44pt)
- [ ] ❌ Not cramming 3+ buttons horizontally
- [ ] ❌ Not making all buttons look equally important
- [ ] ❌ Not using system fonts/icons (unless brand requires)

### Forms & Inputs

#### Touch Targets
- [ ] Input fields are **at least 44pt tall**
- [ ] Recommended: **50-56pt tall** for better UX
- [ ] Labels are **separate from inputs** (not inside)
- [ ] Tap targets extend to **full field area**

#### Keyboard Handling
- [ ] Keyboard **doesn't hide** submit button
- [ ] Form **scrolls** when keyboard appears
- [ ] "Next" button moves between fields
- [ ] "Done" button dismisses keyboard

#### Validation
- [ ] Inline validation after field blur
- [ ] Error messages appear **below field**
- [ ] Error states have **red border + icon**
- [ ] Success states have **green checkmark**

### Navigation

#### Navigation Bar (Top)
- [ ] Height is **44pt minimum**
- [ ] Back button in **top-left corner**
- [ ] Title is **centered** (or left-aligned)
- [ ] Action buttons in **top-right** (max 2)

#### Tab Bar (Bottom)
- [ ] Height is **49pt** (iOS standard)
- [ ] **3-5 tabs maximum**
- [ ] Each tab has **icon + label**
- [ ] Active tab is **clearly highlighted**
- [ ] Tab bar **above safe area** (not hidden by home indicator)

#### Modal/Sheet Presentation
- [ ] Modal has **clear dismiss action** (Cancel/Close/Done)
- [ ] Sheet has **drag indicator** at top
- [ ] Background is **dimmed** (70-80% opacity)
- [ ] Avoid **nesting modals** more than 1 level

### Screen Transitions

#### Animation Standards
- [ ] Screen transitions: **0.3-0.35s**
- [ ] Modal present/dismiss: **0.3-0.4s**
- [ ] Button press feedback: **0.1-0.15s**
- [ ] Animations use **ease-in-out** curve

#### Loading States
- [ ] Show feedback within **0.5 seconds**
- [ ] Use skeleton screens for **content loading**
- [ ] Use spinners for **button actions**
- [ ] Use progress bars for **known duration tasks**

#### Gestures
- [ ] Swipe from left edge → **Back navigation**
- [ ] Pull down → **Refresh** (when appropriate)
- [ ] Swipe between screens (tabs/pages) **works smoothly**

---

## 📱 iOS-Specific Checklist

### Safe Areas & Layout
- [ ] Content respects **safe area insets**
- [ ] No buttons in **notch/Dynamic Island area**
- [ ] No buttons **over home indicator** (bottom 34pt)
- [ ] Full-width buttons account for **rounded corners**
- [ ] Test on **notched** and **non-notched** devices

### Typography
- [ ] Using **system text styles** (not fixed sizes)
- [ ] Support **Dynamic Type** (text scaling)
- [ ] Test at **largest text size** (Accessibility)
- [ ] Labels don't **truncate** at large sizes

### Platform Components
- [ ] Using **native UI components** when possible
- [ ] System buttons for standard actions
- [ ] SF Symbols for icons
- [ ] Native alerts/action sheets

### Orientation Support
- [ ] App works in **portrait mode**
- [ ] Landscape mode (if supported) maintains **usability**
- [ ] Buttons remain **reachable** in both orientations
- [ ] Layout adapts gracefully

---

## ♿ Accessibility Checklist

### Touch Targets
- [ ] All interactive elements **44×44 pt minimum**
- [ ] Adequate spacing between targets (**8pt+**)
- [ ] Touch targets **don't overlap**
- [ ] Visual size matches touch target size

### Color & Contrast
- [ ] Text contrast **4.5:1** (WCAG AA)
- [ ] Large text contrast **3:1** (WCAG AA)
- [ ] UI components contrast **3:1**
- [ ] Don't rely on **color alone** to convey info
- [ ] Test in **high contrast** mode

### Screen Reader Support
- [ ] All buttons have **accessibility labels**
- [ ] Images have **alt text**
- [ ] Form inputs have **labels**
- [ ] Error messages are **announced**
- [ ] Test with **VoiceOver** enabled

### Reduce Motion
- [ ] Disable **parallax effects** when Reduce Motion enabled
- [ ] Use **fade** instead of slide animations
- [ ] Minimize **animation distance**
- [ ] Test with Reduce Motion **ON**

### Focus Indicators
- [ ] Focus state is **visually distinct**
- [ ] Focus order is **logical** (top→bottom, left→right)
- [ ] No **keyboard traps**
- [ ] Custom controls have **proper focus management**

---

## 🧪 Testing Checklist

### Device Testing
- [ ] Test on **iPhone SE** (smallest screen)
- [ ] Test on **iPhone Pro Max** (largest screen)
- [ ] Test on **iPad** (regular width)
- [ ] Test in **portrait** orientation
- [ ] Test in **landscape** orientation (if supported)

### Interaction Testing
- [ ] All buttons **respond to tap**
- [ ] No **accidental double-taps**
- [ ] **Swipe gestures** work correctly
- [ ] **Pinch-to-zoom** disabled for UI (enabled for content)
- [ ] **Long press** shows context menu (if applicable)

### Edge Cases
- [ ] Keyboard doesn't **hide critical buttons**
- [ ] Long text **doesn't break layout**
- [ ] Empty states **display correctly**
- [ ] Error states **show proper messages**
- [ ] Loading states **provide feedback**

### Performance
- [ ] Animations are **smooth** (60 FPS)
- [ ] Transitions complete in **< 0.5s**
- [ ] No **jank** during scrolling
- [ ] No **lag** on button press

### Accessibility Testing
- [ ] VoiceOver **announces all elements**
- [ ] Navigation order is **logical**
- [ ] All interactive elements **reachable**
- [ ] Text readable at **largest size**
- [ ] Works with **Reduce Motion** enabled

---

## 🚨 Common Anti-Patterns & Fixes

### Anti-Pattern #1: Desktop-First Design

**❌ Problem**: Buttons sized for mouse clicks
```
[20×20] [20×20] [20×20]  ← Too small for fingers!
```

**✅ Solution**: Design for touch first
```
[ 44×44 ] [ 44×44 ] [ 44×44 ]
```

**How to Fix**:
1. Increase all touch targets to 44×44pt minimum
2. Add spacing between interactive elements
3. Test on actual device (not just desktop browser)

---

### Anti-Pattern #2: Cramped Button Groups

**❌ Problem**: No spacing between buttons
```
[Cancel][OK][Submit]  ← Buttons touching
```

**✅ Solution**: Adequate spacing
```
[Cancel]    [OK]    [Submit]  ← 12-16pt gaps
```

**How to Fix**:
```swift
HStack(spacing: 12) {  // iOS SwiftUI
    Button("Cancel") { }
    Button("OK") { }
    Button("Submit") { }
}
```

---

### Anti-Pattern #3: Hidden Primary Action

**❌ Problem**: Can't tell which button to tap
```
[Submit]  [Cancel]  ← Both look the same
```

**✅ Solution**: Clear visual hierarchy
```
[Submit]  Cancel  ← Primary filled, secondary plain
   ↑         ↑
 Filled    Text-only
```

**How to Fix**:
```swift
Button("Submit") { }
    .buttonStyle(.borderedProminent)  // Primary

Button("Cancel") { }
    .buttonStyle(.plain)  // Secondary
```

---

### Anti-Pattern #4: Ignoring Safe Areas

**❌ Problem**: Button hidden by notch or home indicator
```
┌──────────────┐
│ 🎵 Notch    │
│ [Button] ❌ │ ← Hidden!
└──────────────┘
```

**✅ Solution**: Respect safe area insets
```
┌──────────────┐
│   (notch)    │
│ [Button] ✅  │ ← Visible
└──────────────┘
```

**How to Fix**:
```swift
VStack {
    Text("Content")
    Spacer()
    Button("Action") { }
}
.padding(.horizontal)  // Side margins
.safeAreaInset(edge: .bottom) {  // Respect home indicator
    Color.clear.frame(height: 16)
}
```

---

### Anti-Pattern #5: No Loading Feedback

**❌ Problem**: Button seems unresponsive
```
User taps [Submit]
  ↓
Nothing happens for 3 seconds...
  ↓
User taps again (duplicate submission!)
```

**✅ Solution**: Immediate feedback
```
User taps [Submit]
  ↓
[Submitting... ⭕]  ← Instant feedback
  ↓
Button disabled during load
```

**How to Fix**:
```swift
@State private var isLoading = false

Button(action: {
    isLoading = true
    submitForm()
}) {
    if isLoading {
        ProgressView()
        Text("Submitting...")
    } else {
        Text("Submit")
    }
}
.disabled(isLoading)
```

---

### Anti-Pattern #6: Too Many Buttons

**❌ Problem**: Crowded interface
```
[Edit] [Share] [Delete] [More] [Copy]  ← 5 buttons!
```

**✅ Solution**: Use overflow menu
```
[Edit]  [Share]  [⋮ More]  ← 3 buttons + menu
                   ↓
              [Delete]
              [Copy]
              [Archive]
```

**How to Fix**:
```swift
HStack {
    Button("Edit") { }
    Button("Share") { }
    Menu("More") {
        Button("Delete") { }
        Button("Copy") { }
        Button("Archive") { }
    }
}
```

---

### Anti-Pattern #7: Fixed Font Sizes

**❌ Problem**: Text doesn't scale
```swift
Text("Title")
    .font(.system(size: 20))  // Won't scale!
```

**✅ Solution**: Use Dynamic Type
```swift
Text("Title")
    .font(.title)  // Scales automatically
```

**How to Fix**:
1. Replace all `.font(.system(size: X))` with semantic styles
2. Use `.title`, `.body`, `.caption`, etc.
3. Test with largest text size in Settings

---

### Anti-Pattern #8: Bottom Button Under Keyboard

**❌ Problem**: Submit button hidden
```
┌──────────────┐
│ Form inputs  │
├──────────────┤
│  ⌨️ Keyboard │
│ [Submit] ❌  │ ← Hidden!
└──────────────┘
```

**✅ Solution**: Adjust layout for keyboard
```
┌──────────────┐
│ Form inputs  │
│ [Submit] ✅  │ ← Above keyboard
├──────────────┤
│  ⌨️ Keyboard │
└──────────────┘
```

**How to Fix**:
```swift
ScrollView {
    VStack {
        TextField("Email", text: $email)
        TextField("Password", text: $password)
        
        Button("Submit") { }
            .padding(.bottom, 300)  // Space for keyboard
    }
}
.ignoresSafeArea(.keyboard, edges: .bottom)
```

---

## 📊 Quick Reference Table

### Touch Target Sizes

| Element | Minimum | Recommended | Notes |
|---------|---------|-------------|-------|
| Button | 44×44 pt | 48×48 pt | iOS standard |
| Icon button | 44×44 pt | 60×60 pt | Larger is better |
| Text button height | 44 pt | 48-50 pt | Width: auto |
| Input field | 44 pt tall | 50-56 pt tall | Full width |
| Tab bar icon | 49 pt | 49 pt | Fixed height |

### Spacing Standards

| Context | Spacing | Notes |
|---------|---------|-------|
| Between buttons | 8-16 pt | 12pt is ideal |
| Screen margins | 16-20 pt | iOS standard: 16pt |
| Section spacing | 24-32 pt | Visual grouping |
| Vertical stack gap | 12-16 pt | Between related items |
| Button padding | 16pt H, 12pt V | Internal padding |

### Animation Timing

| Type | Duration | Easing |
|------|----------|--------|
| Screen push/pop | 0.3-0.35s | Ease-in-out |
| Modal present/dismiss | 0.3-0.4s | Spring |
| Tab switch | 0.2s | Ease-in |
| Button press | 0.1-0.15s | Ease-out |
| Fade | 0.2-0.3s | Linear |

### Color Contrast (WCAG 2.1 AA)

| Element | Contrast Ratio | Example |
|---------|----------------|---------|
| Normal text (< 24px) | 4.5:1 | #333 on #FFF |
| Large text (≥ 24px) | 3:1 | #666 on #FFF |
| UI components | 3:1 | Border vs background |
| Active state | 3:1 | Selected tab vs inactive |

---

## 🛠️ Implementation Code Snippets

### iOS SwiftUI: Responsive Button Group

```swift
// Primary + Secondary button layout
VStack(spacing: 16) {
    // Primary action (full-width, prominent)
    Button("Continue") {
        performPrimaryAction()
    }
    .frame(maxWidth: .infinity)
    .frame(height: 50)
    .buttonStyle(.borderedProminent)
    
    // Secondary action (full-width, subtle)
    Button("Cancel") {
        performSecondaryAction()
    }
    .frame(maxWidth: .infinity)
    .frame(height: 50)
    .buttonStyle(.bordered)
}
.padding(.horizontal, 16)
```

### iOS SwiftUI: Touch-Optimized Icon Button

```swift
Button(action: {
    performAction()
}) {
    Image(systemName: "star.fill")
        .font(.title2)  // 28pt icon
        .frame(width: 60, height: 60)  // Touch target
        .background(Color.blue)
        .foregroundColor(.white)
        .clipShape(Circle())
}
.accessibilityLabel("Favorite")
```

### iOS SwiftUI: Loading Button State

```swift
@State private var isLoading = false

Button(action: {
    isLoading = true
    Task {
        await submitForm()
        isLoading = false
    }
}) {
    HStack {
        if isLoading {
            ProgressView()
                .progressViewStyle(CircularProgressViewStyle(tint: .white))
        }
        Text(isLoading ? "Submitting..." : "Submit")
    }
    .frame(maxWidth: .infinity)
    .frame(height: 50)
}
.buttonStyle(.borderedProminent)
.disabled(isLoading)
```

### iOS SwiftUI: Safe Area Aware Layout

```swift
VStack {
    // Content
    ScrollView {
        // Your content here
    }
    
    // Bottom button (respects safe area)
    Button("Continue") {
        // Action
    }
    .frame(maxWidth: .infinity)
    .frame(height: 50)
    .buttonStyle(.borderedProminent)
    .padding(.horizontal, 16)
    .padding(.bottom, 16)
}
.safeAreaInset(edge: .bottom) {
    // Adds padding for home indicator
    Color.clear.frame(height: 0)
}
```

---

## 📝 Code Review Checklist

### During Code Review, Check For:

**Touch Targets**
- [ ] All buttons are at least 44×44pt
- [ ] Adequate spacing between buttons (8-16pt)
- [ ] No overlapping touch targets
- [ ] Margins from screen edges (16-20pt)

**Visual Hierarchy**
- [ ] Primary action is visually prominent
- [ ] Max 1-2 prominent buttons per screen
- [ ] Destructive actions are clearly marked
- [ ] Consistent button styles throughout app

**Accessibility**
- [ ] All buttons have accessibility labels
- [ ] Contrast ratios meet WCAG AA (4.5:1)
- [ ] Dynamic Type support (no fixed font sizes)
- [ ] VoiceOver announcements are clear

**Layout & Responsive**
- [ ] Respects safe area insets
- [ ] Works on smallest device (iPhone SE)
- [ ] Works on largest device (iPhone Pro Max)
- [ ] Adapts to portrait and landscape

**Interactions**
- [ ] Loading states provide feedback
- [ ] Error states show clear messages
- [ ] Animations are smooth (0.3-0.4s)
- [ ] Gestures work correctly (swipe back, etc.)

---

## 🎯 Priority Levels

### Critical (Must Fix Before Ship)
- ❗ Touch targets < 44×44pt
- ❗ Buttons hidden by keyboard
- ❗ Layout breaks on iPhone SE
- ❗ No loading feedback for async actions
- ❗ Contrast ratios below WCAG AA

### High Priority (Fix in Current Sprint)
- ⚠️ Unclear button hierarchy
- ⚠️ Missing VoiceOver labels
- ⚠️ Cramped button spacing (< 8pt)
- ⚠️ Fixed font sizes (no Dynamic Type)
- ⚠️ Ignoring safe areas

### Medium Priority (Fix Soon)
- ⚡ Inconsistent spacing
- ⚡ Non-standard animations
- ⚡ Missing error states
- ⚡ Landscape mode issues

### Low Priority (Nice to Have)
- 💡 Haptic feedback
- 💡 Skeleton screens
- 💡 Advanced gestures
- 💡 Micro-interactions

---

## 📖 Related Documentation

- [Mobile UX Standards](./MOBILE_UX_STANDARDS.md) - Comprehensive mobile design guide
- [GUI Design Standards](./GUI_DESIGN_STANDARDS.md) - General UI design principles
- [Accessibility Guidelines](../ACCESSIBILITY/ACCESSIBILITY_STANDARDS.md) - Detailed accessibility requirements

---

**Last Updated**: November 18, 2025  
**Maintained By**: ProjectPlanner Standards Team
