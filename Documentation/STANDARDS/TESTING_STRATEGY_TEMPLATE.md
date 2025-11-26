# Testing Strategy Template for AI-Driven Projects

> **Purpose**: Comprehensive testing framework that enables AI agents to design and maintain high-quality tests by analyzing requirements and applying human-centered thinking. Tests validate functionality, prevent regressions, and ensure user experience quality throughout the development lifecycle.

> **Context**: Tests are not shipped in the final product but are critical components of the development and CI/CD pipeline. They run automatically during builds/deployments and can be executed manually during development for rapid feedback.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Testing Philosophy & Principles](#testing-philosophy--principles)
3. [The Test Pyramid](#the-test-pyramid)
4. [Seven Test Categories](#seven-test-categories)
5. [Six-Phase Implementation Roadmap](#six-phase-implementation-roadmap)
6. [AI-Driven Test Design](#ai-driven-test-design)
7. [Test Structure & Organization](#test-structure--organization)
8. [CI/CD Integration](#cicd-integration)
9. [Manual Test Execution](#manual-test-execution)
10. [Test Maintenance & Growth](#test-maintenance--growth)
11. [Tools & Frameworks](#tools--frameworks)
12. [Example Test Suites](#example-test-suites)
13. [Best Practices Checklist](#best-practices-checklist)

---

## Quick Start

### For AI Agents

When asked to create tests for a project:

1. **Read the PRD/Requirements**: Understand features, user flows, data models, business rules
2. **Apply Human Mentality**: Think like an end-user, QA engineer, and developer simultaneously
3. **Use this template**: Follow the 7 test categories and design tests for each
4. **Start with User Flow Tests**: These validate the most critical business value
5. **Grow incrementally**: Follow the 6-phase roadmap, don't try to write all tests at once
6. **Integrate with CI/CD**: Ensure tests run automatically on every commit/deployment

### Quick Command Reference

```bash
# Run all tests
npm test

# Run specific category
npm test -- --grep "User Flow"

# Run with coverage
npm test -- --coverage

# Watch mode (development)
npm test -- --watch

# Manual execution with logging
npm run test:manual
```

---

## Testing Philosophy & Principles

### The Golden Rule: Design for Lean Testing

> "Testing code should be short, dead-simple, flat, and delightful to work with. One should look at a test and get the intent instantly."

**Key Principles:**

1. **Tests Are Documentation**: Every test tells a story about what the application should do
2. **Fast Feedback Loops**: Tests should run quickly and provide immediate feedback
3. **Human Mentality**: Design tests the way users think, not just how developers code
4. **Confidence Over Coverage**: Aim for meaningful tests, not arbitrary coverage numbers
5. **Fail Fast, Fail Clear**: When tests fail, it should be immediately obvious why
6. **Grow With the Project**: Tests should evolve as features are added and refined

### What Makes a Good Test?

✅ **GOOD Test Characteristics:**
- Tests one specific behavior/scenario
- Has a clear name: "When X happens, Y should occur"
- Is independent (doesn't rely on other tests)
- Uses realistic data (not "foo", "bar")
- Follows AAA pattern (Arrange, Act, Assert)
- Fails for the right reason
- Is easy to understand and maintain

❌ **BAD Test Characteristics:**
- Tests multiple unrelated things
- Has vague name like "test1" or "it works"
- Depends on execution order
- Uses unrealistic data
- Has complex setup/mocking
- Fails randomly or for unclear reasons
- Requires deep code knowledge to understand

---

## The Test Pyramid

The Test Pyramid is a foundational strategy for balancing test types:

```
       /\
      /  \      E2E Tests (UI/Integration)
     /____\     ~10% of tests
    /      \    
   /  API   \   Service/API Tests  
  /__________\  ~20% of tests
 /            \
/______________\ Unit Tests
                 ~70% of tests
```

### Why This Structure?

| **Test Type** | **Speed** | **Cost** | **Reliability** | **Coverage** | **Purpose** |
|--------------|-----------|----------|----------------|--------------|-------------|
| **Unit Tests** | Fast (ms) | Low | High | Narrow | Test individual functions/components |
| **Integration Tests** | Medium (100ms) | Medium | Medium | Wide | Test component interactions |
| **E2E Tests** | Slow (seconds) | High | Low | Full | Test complete user workflows |

**Key Insight**: Write tests at the lowest level possible. If a unit test can catch a bug, don't write an E2E test for it.

### Ice-Cream Cone Anti-Pattern (AVOID)

```
 ______________
 \            /  Too many E2E tests
  \__________/   (slow, brittle, expensive)
   \        /    
    \______/     Few integration tests
     \    /      
      \__/       Almost no unit tests
```

This is problematic because:
- Test suite is slow (minutes instead of seconds)
- Tests are brittle (break with UI changes)
- Hard to identify root cause of failures
- Expensive to write and maintain

---

## Seven Test Categories

These categories cover the full spectrum of testing needs. AI agents should design tests across all categories, with emphasis based on project requirements.

### 1. User Flow Tests (High Priority)

**Purpose**: Validate complete user journeys from start to finish

**What to Test**:
- Critical business workflows (login → action → result)
- Multi-step processes (e.g., checkout, form submission)
- Happy path scenarios
- Authentication/authorization flows
- Data persistence across steps

**Example Scenarios**:
```
✓ User can register → login → view dashboard
✓ User can create item → edit item → delete item
✓ User can add to cart → checkout → receive confirmation
✓ User can search → filter → view results
✓ User can upload file → process → download result
```

**Test Structure**:
```javascript
describe('User Flow: Complete Purchase Journey', () => {
  it('should allow user to browse products, add to cart, and complete checkout', async () => {
    // Arrange: Set up user and products
    const user = await createTestUser();
    const products = await seedProducts(3);
    
    // Act: Execute complete flow
    await loginAs(user);
    await navigateTo('/products');
    await addToCart(products[0]);
    await addToCart(products[1]);
    await navigateTo('/cart');
    await clickCheckout();
    await fillPaymentInfo({ card: '4111111111111111' });
    await submitOrder();
    
    // Assert: Verify outcome
    expect(await getOrderConfirmation()).toBeTruthy();
    expect(await getUserOrders(user.id)).toHaveLength(1);
    expect(await getCartItems(user.id)).toHaveLength(0);
  });
});
```

**Estimated Tests**: 60-80 tests (Phase 1-2)

---

### 2. Component Integration Tests (High Priority)

**Purpose**: Test how components/services work together

**What to Test**:
- API calls between frontend/backend
- Database operations (CRUD)
- Service-to-service communication
- Data transformations
- State management

**Example Scenarios**:
```
✓ API endpoint receives request → queries DB → returns formatted data
✓ Frontend component calls API → receives data → updates UI
✓ Service A calls Service B → processes response → saves to DB
✓ File upload → validation → storage → thumbnail generation
✓ User action → state update → UI re-render
```

**Test Structure**:
```javascript
describe('Integration: Product API with Database', () => {
  it('should create product in DB and return formatted response', async () => {
    // Arrange
    const productData = {
      name: 'Test Product',
      price: 29.99,
      category: 'Electronics'
    };
    
    // Act
    const response = await request(app)
      .post('/api/products')
      .send(productData)
      .expect(201);
    
    // Assert
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      name: 'Test Product',
      price: 29.99,
      category: 'Electronics',
      createdAt: expect.any(String)
    });
    
    // Verify database
    const dbProduct = await db.products.findById(response.body.id);
    expect(dbProduct.name).toBe('Test Product');
  });
});
```

**Estimated Tests**: 80-120 tests (Phase 1-3)

---

### 3. Edge Case & Boundary Tests (Medium Priority)

**Purpose**: Test behavior at limits and unusual conditions

**What to Test**:
- Empty/null/undefined inputs
- Maximum/minimum values
- Boundary conditions
- Unusual but valid inputs
- Data type mismatches
- Concurrent operations
- Network failures
- Permission boundaries

**Example Scenarios**:
```
✓ Empty string input → appropriate error handling
✓ Array with 0 items → handles gracefully
✓ Array with 10,000 items → performs adequately
✓ Number at MIN_SAFE_INTEGER/MAX_SAFE_INTEGER → handles correctly
✓ Date in past/future → validates appropriately
✓ Special characters in input → sanitizes correctly
✓ Duplicate entries → prevents or handles
✓ Concurrent updates → race condition handling
```

**Test Structure**:
```javascript
describe('Edge Cases: User Input Validation', () => {
  it('should handle empty username gracefully', async () => {
    const result = await createUser({ username: '', email: 'test@example.com' });
    expect(result.error).toBe('Username cannot be empty');
  });
  
  it('should handle extremely long username', async () => {
    const longUsername = 'a'.repeat(1000);
    const result = await createUser({ username: longUsername, email: 'test@example.com' });
    expect(result.error).toContain('Username too long');
  });
  
  it('should handle special characters in username', async () => {
    const result = await createUser({ username: '<script>alert("xss")</script>', email: 'test@example.com' });
    expect(result.username).not.toContain('<script>');
  });
  
  it('should prevent duplicate usernames', async () => {
    await createUser({ username: 'john', email: 'john@example.com' });
    const result = await createUser({ username: 'john', email: 'john2@example.com' });
    expect(result.error).toContain('Username already exists');
  });
});
```

**Estimated Tests**: 60-90 tests (Phase 2-4)

---

### 4. Accessibility Tests (Medium Priority)

**Purpose**: Ensure application is usable by all users, including those with disabilities

**What to Test**:
- Keyboard navigation
- Screen reader compatibility
- Color contrast ratios
- Focus management
- ARIA attributes
- Alternative text for images
- Form labels and error messages
- Semantic HTML structure

**Example Scenarios**:
```
✓ User can navigate entire site with keyboard only
✓ Screen reader announces page changes
✓ Focus indicators are visible
✓ Color contrast meets WCAG AA standards
✓ Forms have proper labels and error messages
✓ Images have descriptive alt text
✓ Interactive elements have appropriate ARIA attributes
✓ Modal dialogs trap focus correctly
```

**Test Structure**:
```javascript
describe('Accessibility: Keyboard Navigation', () => {
  it('should allow tab navigation through all interactive elements', () => {
    render(<ProductForm />);
    
    const interactiveElements = screen.getAllByRole(/(button|textbox|combobox)/i);
    
    interactiveElements.forEach((element, index) => {
      userEvent.tab();
      expect(element).toHaveFocus();
    });
  });
  
  it('should have sufficient color contrast', () => {
    const { container } = render(<Button>Click Me</Button>);
    const button = container.querySelector('button');
    
    const contrast = getColorContrast(
      getComputedStyle(button).color,
      getComputedStyle(button).backgroundColor
    );
    
    expect(contrast).toBeGreaterThanOrEqual(4.5); // WCAG AA standard
  });
});

// Using automated tools
import { axe, toHaveNoViolations } from 'jest-axe';
expect.extend(toHaveNoViolations);

describe('Accessibility: Automated Checks', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

**Tools**: jest-axe, axe-core, pa11y, Lighthouse

**Estimated Tests**: 40-60 tests (Phase 3-5)

---

### 5. Scrolling & UI Behavior Tests (Medium Priority)

**Purpose**: Ensure UI behaves correctly during user interactions

**What to Test**:
- Infinite scroll/pagination
- Lazy loading
- Sticky headers/footers
- Scroll position restoration
- Smooth scrolling
- Responsive breakpoints
- Animations/transitions
- Loading states
- Error states

**Example Scenarios**:
```
✓ Infinite scroll loads more items as user scrolls
✓ Lazy loaded images appear when scrolled into view
✓ Sticky header remains visible during scroll
✓ Scroll position is restored on back navigation
✓ Loading spinner appears during async operations
✓ Error message displays when operation fails
✓ UI adapts correctly at mobile/tablet/desktop breakpoints
✓ Animations are smooth and performant
```

**Test Structure**:
```javascript
describe('UI Behavior: Infinite Scroll', () => {
  it('should load more items when scrolled to bottom', async () => {
    render(<ProductList />);
    
    // Initial load
    expect(screen.getAllByRole('article')).toHaveLength(20);
    
    // Scroll to bottom
    const scrollContainer = screen.getByTestId('product-list');
    fireEvent.scroll(scrollContainer, { target: { scrollY: 1000 } });
    
    // Wait for new items
    await waitFor(() => {
      expect(screen.getAllByRole('article')).toHaveLength(40);
    });
  });
  
  it('should display loading state during fetch', async () => {
    render(<ProductList />);
    
    const scrollContainer = screen.getByTestId('product-list');
    fireEvent.scroll(scrollContainer, { target: { scrollY: 1000 } });
    
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});

describe('UI Behavior: Responsive Layout', () => {
  it('should display mobile menu on small screens', () => {
    global.innerWidth = 375;
    render(<Navigation />);
    
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
    expect(screen.queryByRole('navigation')).not.toBeVisible();
  });
  
  it('should display full navigation on large screens', () => {
    global.innerWidth = 1024;
    render(<Navigation />);
    
    expect(screen.queryByLabelText('Open menu')).not.toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeVisible();
  });
});
```

**Estimated Tests**: 40-60 tests (Phase 4-5)

---

### 6. Unit Tests (Ongoing Priority)

**Purpose**: Test individual functions, components, and modules in isolation

**What to Test**:
- Pure functions (input → output)
- Utility functions
- Data transformations
- Business logic
- Validation functions
- Component rendering (snapshots)
- State management logic

**Example Scenarios**:
```
✓ calculateTotal([items]) returns correct sum
✓ formatDate(timestamp) returns formatted string
✓ validateEmail(email) correctly identifies valid/invalid emails
✓ Component renders with props correctly
✓ State updates when action is dispatched
✓ Error is thrown for invalid input
✓ Data is transformed to correct format
```

**Test Structure**:
```javascript
describe('Unit: Price Calculation', () => {
  describe('calculateTotal', () => {
    it('should calculate total for single item', () => {
      const items = [{ price: 10, quantity: 2 }];
      expect(calculateTotal(items)).toBe(20);
    });
    
    it('should calculate total for multiple items', () => {
      const items = [
        { price: 10, quantity: 2 },
        { price: 5, quantity: 3 }
      ];
      expect(calculateTotal(items)).toBe(35);
    });
    
    it('should apply discount if provided', () => {
      const items = [{ price: 100, quantity: 1 }];
      expect(calculateTotal(items, 0.1)).toBe(90); // 10% discount
    });
    
    it('should handle empty array', () => {
      expect(calculateTotal([])).toBe(0);
    });
    
    it('should throw error for negative prices', () => {
      const items = [{ price: -10, quantity: 1 }];
      expect(() => calculateTotal(items)).toThrow('Price cannot be negative');
    });
  });
});

describe('Unit: React Component', () => {
  it('should render product with correct props', () => {
    const product = { name: 'Test Product', price: 29.99 };
    render(<ProductCard product={product} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$29.99')).toBeInTheDocument();
  });
  
  it('should call onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();
    const product = { id: 1, name: 'Test Product' };
    
    render(<ProductCard product={product} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByText('Add to Cart'));
    expect(onAddToCart).toHaveBeenCalledWith(product);
  });
});
```

**Estimated Tests**: 150-200 tests (All Phases)

---

### 7. Real User Scenario Tests (High Priority)

**Purpose**: Test actual workflows that real users will perform

**What to Test**:
- Common user tasks
- Business-critical workflows
- Customer journey scenarios
- Cross-feature interactions
- Realistic data scenarios

**Example Scenarios** (Meal Planner Example):
```
✓ User creates meal plan for the week
✓ User generates shopping list from meal plan
✓ User marks meals as completed
✓ User shares meal plan with family member
✓ User searches for recipes by ingredients on hand
✓ User adjusts serving sizes for recipes
✓ User saves favorite recipes to collection
✓ User views nutritional information for meal plan
✓ User exports meal plan as PDF
✓ User sets dietary restrictions and gets relevant recipes
```

**Test Structure**:
```javascript
describe('Real User Scenario: Weekly Meal Planning', () => {
  it('should allow user to create complete weekly meal plan and generate shopping list', async () => {
    // Arrange: Set up user with preferences
    const user = await createTestUser({
      preferences: { diet: 'vegetarian', allergies: ['peanuts'] }
    });
    await loginAs(user);
    
    // Act: User flow
    // Step 1: Navigate to meal planner
    await navigateTo('/meal-planner');
    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
    
    // Step 2: Add meals for each day
    await selectDay('Monday');
    await searchRecipe('vegetarian pasta');
    await addRecipeToDay(recipes[0]);
    
    await selectDay('Tuesday');
    await searchRecipe('veggie stir fry');
    await addRecipeToDay(recipes[1]);
    
    // ... repeat for other days
    
    // Step 3: Generate shopping list
    await clickButton('Generate Shopping List');
    
    // Assert: Verify outcomes
    // 1. Meal plan is saved
    const savedPlan = await getUserMealPlan(user.id);
    expect(savedPlan.meals).toHaveLength(7);
    
    // 2. Shopping list is generated
    expect(screen.getByText('Shopping List')).toBeInTheDocument();
    const ingredients = screen.getAllByTestId('ingredient-item');
    expect(ingredients.length).toBeGreaterThan(0);
    
    // 3. No peanut recipes (allergy constraint)
    ingredients.forEach(ingredient => {
      expect(ingredient.textContent).not.toContain('peanut');
    });
    
    // 4. User can check off items
    await clickCheckbox(ingredients[0]);
    expect(ingredients[0]).toHaveClass('checked');
  });
});
```

**Estimated Tests**: 40-50 tests (Phase 2-6)

---

## Six-Phase Implementation Roadmap

This phased approach ensures tests are added incrementally, with focus on high-value tests first.

### Phase 1: Foundation (Weeks 1-2) — ~80 Tests

**Goal**: Establish testing infrastructure and cover critical functionality

**Activities**:
- Set up testing framework (Jest, Vitest, Cypress)
- Configure CI/CD pipeline
- **Set up UI mocking infrastructure** (CRITICAL for user flow tests)
  - Create `test-utils/render-with-providers.tsx` for context mocking
  - Install and configure MSW (Mock Service Worker) for API mocking
  - Mock browser APIs (localStorage, matchMedia, IntersectionObserver)
  - **Mock external services** (AI/LLM APIs, toast notifications, analytics, payment services, file uploads)
  - **Create helper functions** (renderApp, waitForLoadingToFinish, setupMockData, createMockEntity factories)
  - Create mock data fixtures (`tests/fixtures/`)
  - **Define simplified test approach** (focus on testable behavior: data display, search/filter, persistence, navigation; avoid complex dialogs, multi-step wizards, real-time features)
- Write test utilities and helpers
- Create test data factories

**Test Focus**:
- ✅ **30-40 Unit Tests**: Core functions, utilities, validators
- ✅ **30-40 Integration Tests**: Critical API endpoints, database operations
- ✅ **10-15 User Flow Tests**: Main authentication/authorization flows

**Deliverables**:
- `tests/` directory structure
- `jest.config.js` or `vitest.config.js`
- `.github/workflows/test.yml` (CI configuration)
- `tests/helpers/` (factories, utilities)

**Exit Criteria**:
- ✓ All tests passing
- ✓ CI pipeline running tests on every commit
- ✓ Test coverage > 40%

---

### Phase 2: Core Features (Weeks 3-4) — ~110 Tests (+190 Total)

**Goal**: Cover all major features with comprehensive tests

**Test Focus**:
- ✅ **25-30 User Flow Tests**: Complete user journeys for core features
- ✅ **40-50 Integration Tests**: All major API endpoints, service interactions
- ✅ **20-30 Unit Tests**: Business logic, data transformations
- ✅ **15-20 Real User Scenario Tests**: Critical customer workflows

**Deliverables**:
- User flow test suites for each major feature
- API integration test coverage > 80%
- Component test coverage > 60%

**Exit Criteria**:
- ✓ All critical user flows tested
- ✓ Test coverage > 60%
- ✓ Manual QA team has test suite to reference

---

### Phase 3: Edge Cases & Quality (Weeks 5-6) — ~90 Tests (+280 Total)

**Goal**: Increase robustness with edge case coverage

**Test Focus**:
- ✅ **40-50 Edge Case Tests**: Boundary conditions, error handling, edge scenarios
- ✅ **20-25 Accessibility Tests**: Keyboard navigation, screen reader, WCAG
- ✅ **20-30 Unit Tests**: Additional coverage of utility functions
- ✅ **10-15 Real User Scenario Tests**: Additional customer workflows

**Deliverables**:
- Edge case test suites
- Accessibility testing with jest-axe
- Error handling test coverage

**Exit Criteria**:
- ✓ Test coverage > 75%
- ✓ Accessibility violations = 0 (critical)
- ✓ Edge case coverage documented

---

### Phase 4: UI & Behavior (Weeks 7-8) — ~80 Tests (+360 Total)

**Goal**: Ensure excellent user experience through UI testing

**Test Focus**:
- ✅ **30-40 Scrolling & UI Tests**: Infinite scroll, lazy loading, responsive design
- ✅ **25-30 Integration Tests**: Additional cross-component scenarios
- ✅ **15-20 Accessibility Tests**: Complete WCAG AA compliance
- ✅ **10-15 Real User Scenario Tests**: Complex multi-step workflows

**Deliverables**:
- UI behavior test suites
- Responsive design test coverage
- Visual regression testing (optional)

**Exit Criteria**:
- ✓ Test coverage > 80%
- ✓ All UI interactions tested
- ✓ No visual regressions detected

---

### Phase 5: Polish & Performance (Weeks 9-10) — ~60 Tests (+420 Total)

**Goal**: Optimize test suite and add performance tests

**Test Focus**:
- ✅ **20-25 Performance Tests**: Load times, rendering performance, API response times
- ✅ **15-20 Edge Case Tests**: Additional boundary conditions discovered during usage
- ✅ **10-15 Accessibility Tests**: Fine-tuning and advanced scenarios
- ✅ **10-15 UI Tests**: Additional responsive and interaction scenarios

**Activities**:
- Refactor slow tests
- Parallelize test execution
- Add mutation testing
- Performance benchmarking

**Deliverables**:
- Performance test suite
- Optimized test execution (< 2 minutes for all tests)
- Mutation testing report

**Exit Criteria**:
- ✓ Test coverage > 85%
- ✓ Test suite runs in < 2 minutes
- ✓ Performance benchmarks documented

---

### Phase 6: Continuous Improvement (Ongoing) — ~30-50 Tests/Quarter (+450-500 Total)

**Goal**: Maintain and grow test suite as features evolve

**Test Focus**:
- ✅ **New Feature Tests**: Every new feature gets comprehensive tests before merge
- ✅ **Regression Tests**: Any bug fix gets a test to prevent recurrence
- ✅ **Refactoring Tests**: Tests updated as code evolves
- ✅ **Additional Scenarios**: Customer-reported edge cases

**Activities**:
- Regular test maintenance
- Coverage gap analysis
- Flaky test fixes
- Test suite optimization

**Deliverables**:
- Updated test documentation
- Quarterly test health report
- Test suite performance metrics

**Exit Criteria**:
- ✓ Test coverage maintained > 80%
- ✓ No flaky tests
- ✓ New features don't merge without tests

---

## AI-Driven Test Design

This section provides guidance for AI agents on designing tests using human-centered thinking.

### Step 1: Analyze Requirements/Features

**Input Sources**:
- Product Requirements Document (PRD)
- User stories
- Feature specifications
- Database schema (DATABASE_DDL.md)
- API documentation
- Architecture decisions (ADR documents)

**Questions to Ask**:
1. What problem is this feature solving?
2. Who are the users? What are their goals?
3. What are the happy path scenarios?
4. What could go wrong?
5. What are the edge cases?
6. What are the performance requirements?
7. What are the security requirements?
8. How does this feature interact with other features?

**Example Analysis** (Adding Shopping Cart Feature):

```
Feature: Add items to shopping cart

User Goal: Quickly save products for later purchase

Happy Path:
- User clicks "Add to Cart" on product
- Item appears in cart
- Cart count updates
- User can view cart
- User can checkout

Potential Issues:
- Adding duplicate items
- Adding out-of-stock items
- Cart persistence (logged in vs guest)
- Cart synchronization (multiple devices)
- Performance with many items

Edge Cases:
- Adding item while cart is loading
- Adding item with quantity = 0
- Adding item with quantity > stock
- Cart overflow (1000+ items)
- Network failure during add
```

### Step 2: Apply Human Mentality

Think like three different personas:

**1. End User**:
- "Can I easily accomplish my goal?"
- "What if I make a mistake?"
- "Is the feedback clear?"
- "Does it work on my phone?"

**2. QA Engineer**:
- "What are all the ways this could break?"
- "What happens at the boundaries?"
- "How does it handle errors?"
- "Is it performant under load?"

**3. Developer**:
- "Is the code testable?"
- "Are components properly isolated?"
- "Is error handling comprehensive?"
- "Is the API contract clear?"

**Example Test Design** (Using Human Mentality):

```javascript
// End User Perspective: "I want to add items easily"
describe('User Perspective: Adding to Cart', () => {
  it('should add item immediately when button clicked', async () => {
    await clickAddToCart(product);
    expect(await getCartCount()).toBe(1);
    expect(await showSuccessMessage()).toContain('Added to cart');
  });
  
  it('should show cart icon pulsing animation on add', async () => {
    await clickAddToCart(product);
    expect(await getCartIcon()).toHaveClass('pulse-animation');
  });
});

// QA Engineer Perspective: "What could break?"
describe('QA Perspective: Edge Cases', () => {
  it('should prevent adding out-of-stock items', async () => {
    const outOfStockProduct = { ...product, stock: 0 };
    await clickAddToCart(outOfStockProduct);
    expect(await getErrorMessage()).toContain('Out of stock');
  });
  
  it('should handle rapid clicks gracefully', async () => {
    await Promise.all([
      clickAddToCart(product),
      clickAddToCart(product),
      clickAddToCart(product)
    ]);
    expect(await getCartItemQuantity(product.id)).toBe(3);
  });
});

// Developer Perspective: "Is the implementation solid?"
describe('Developer Perspective: Implementation', () => {
  it('should call cart API with correct payload', async () => {
    const apiSpy = jest.spyOn(cartApi, 'addItem');
    await clickAddToCart(product);
    expect(apiSpy).toHaveBeenCalledWith({
      productId: product.id,
      quantity: 1,
      userId: currentUser.id
    });
  });
  
  it('should update cart state optimistically', async () => {
    const cartBefore = await getCartState();
    const promise = clickAddToCart(product);
    const cartDuring = await getCartState();
    await promise;
    
    expect(cartDuring.items.length).toBe(cartBefore.items.length + 1);
  });
});
```

### Step 3: Generate Test Scenarios

Use these templates to generate comprehensive test scenarios:

**Template 1: Feature Test Matrix**

| Feature | Happy Path | Error Case | Edge Case | Accessibility | Performance |
|---------|-----------|------------|-----------|---------------|-------------|
| Add to Cart | ✓ Add single item | ✓ Out of stock | ✓ Quantity = MAX_INT | ✓ Keyboard shortcut | ✓ Large cart (1000 items) |
| Remove from Cart | ✓ Remove single item | ✓ Item doesn't exist | ✓ Remove last item | ✓ Focus management | ✓ Batch removal |

**Template 2: User Journey Map**

```
User Goal: Purchase products

Step 1: Browse → Tests: Product display, filtering, sorting, search
Step 2: Select → Tests: Product details, images, reviews, variants
Step 3: Add to Cart → Tests: Cart operations, quantity, updates
Step 4: Checkout → Tests: Forms, validation, payment, confirmation
Step 5: Confirmation → Tests: Email, order tracking, receipt
```

**Template 3: CRUD Operations**

For any data entity, test all CRUD operations:

```javascript
describe('Product CRUD Operations', () => {
  // Create
  it('should create new product with valid data');
  it('should reject product with missing required fields');
  it('should reject product with duplicate SKU');
  
  // Read
  it('should retrieve product by ID');
  it('should return 404 for non-existent product');
  it('should list all products with pagination');
  
  // Update
  it('should update product with valid data');
  it('should return 404 when updating non-existent product');
  it('should prevent unauthorized updates');
  
  // Delete
  it('should delete product by ID');
  it('should return 404 when deleting non-existent product');
  it('should soft-delete product if has orders');
});
```

### Step 4: Prioritize Tests

Use this prioritization matrix:

| Priority | Criteria | Examples |
|----------|----------|----------|
| **Critical (P0)** | - User cannot complete primary goal<br>- Data loss/corruption<br>- Security vulnerability<br>- Payment/financial operations | - Login/Registration<br>- Checkout process<br>- Payment processing<br>- Data persistence |
| **High (P1)** | - Major feature broken<br>- Poor user experience<br>- Performance degradation | - Search functionality<br>- Navigation<br>- Forms validation<br>- API response times |
| **Medium (P2)** | - Minor feature broken<br>- Cosmetic issues<br>- Edge cases | - Sorting/filtering<br>- Tooltips<br>- Animations<br>- Rare edge cases |
| **Low (P3)** | - Nice to have<br>- Very rare scenarios<br>- Minor optimizations | - Specific browser quirks<br>- Extreme edge cases<br>- Easter eggs |

**Test Order**:
1. Write P0 tests first (Week 1-2)
2. Add P1 tests (Week 3-4)
3. Fill in P2 tests (Week 5-8)
4. Add P3 tests if time/budget allows

---

## Test Structure & Organization

### Directory Structure

```
project-root/
├── src/
│   ├── components/
│   ├── services/
│   ├── utils/
│   └── ...
├── tests/
│   ├── unit/
│   │   ├── components/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── api/
│   │   ├── database/
│   │   └── services/
│   ├── e2e/
│   │   ├── user-flows/
│   │   ├── real-scenarios/
│   │   └── smoke/
│   ├── accessibility/
│   ├── ui-behavior/
│   ├── helpers/
│   │   ├── factories/
│   │   ├── fixtures/
│   │   └── utilities/
│   └── config/
│       ├── jest.config.js
│       └── test-setup.js
└── package.json
```

### Naming Conventions

**Test Files**:
```
{name}.test.js       // Unit tests
{name}.spec.js       // Integration/E2E tests
{name}.a11y.test.js  // Accessibility tests
```

**Test Suites** (describe blocks):
```javascript
// Pattern: "{Category}: {What is being tested}"
describe('User Flow: Purchase Journey', () => {});
describe('Integration: Product API', () => {});
describe('Unit: Price Calculator', () => {});
describe('Edge Case: Empty Input Handling', () => {});
describe('Accessibility: Keyboard Navigation', () => {});
```

**Test Cases** (it/test blocks):
```javascript
// Pattern: "should {expected behavior} when {condition}"
it('should display error message when email is invalid', () => {});
it('should save product successfully when all fields are valid', () => {});
it('should disable submit button when form is incomplete', () => {});
```

### Test Organization (AAA Pattern)

Every test should follow **Arrange-Act-Assert**:

```javascript
it('should calculate total price with discount', () => {
  // ARRANGE: Set up test data and preconditions
  const items = [
    { price: 100, quantity: 2 },
    { price: 50, quantity: 1 }
  ];
  const discount = 0.1; // 10% discount
  
  // ACT: Execute the function/action being tested
  const total = calculateTotal(items, discount);
  
  // ASSERT: Verify the outcome
  expect(total).toBe(225); // (100*2 + 50*1) * 0.9 = 225
});
```

### Test Data Management

**Use Test Factories**:

```javascript
// tests/helpers/factories/user.factory.js
export const createTestUser = (overrides = {}) => ({
  id: faker.datatype.uuid(),
  name: faker.name.fullName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  createdAt: faker.date.past(),
  ...overrides
});

// Usage
const user = createTestUser({ email: 'specific@example.com' });
```

**Use Realistic Data**:
```javascript
// ❌ BAD: Unrealistic data
const product = { name: 'foo', price: 1 };

// ✅ GOOD: Realistic data
const product = {
  name: 'Samsung Galaxy S21 Ultra 5G',
  price: 1199.99,
  sku: 'SAMS21U-BLK-256',
  category: 'Electronics',
  inStock: true
};
```

---

## CI/CD Integration

### Continuous Integration Pipeline

**GitHub Actions Example**:

```yaml
# .github/workflows/test.yml
name: Test Suite

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x, 20.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: ${{ secrets.TEST_DATABASE_URL }}
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Generate coverage report
        run: npm run test:coverage
      
      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/coverage-final.json
      
      - name: Check coverage threshold
        run: npm run test:coverage:check
```

### Test Execution Stages

**Stage 1: Pre-commit (Local)**
```bash
# Runs via Husky/lint-staged
- Linting (< 5 seconds)
- Unit tests for changed files (< 30 seconds)
```

**Stage 2: PR Build (CI)**
```bash
- Linting (< 10 seconds)
- Unit tests (< 1 minute)
- Integration tests (< 2 minutes)
- Code coverage check (< 30 seconds)
Total: ~4 minutes
```

**Stage 3: Main Branch (CI)**
```bash
- All tests from Stage 2
- E2E tests (< 5 minutes)
- Accessibility tests (< 2 minutes)
- Performance tests (< 3 minutes)
Total: ~15 minutes
```

**Stage 4: Pre-deployment (Staging)**
```bash
- Smoke tests (< 1 minute)
- Critical user flow tests (< 5 minutes)
Total: ~6 minutes
```

**Stage 5: Post-deployment (Production)**
```bash
- Smoke tests (< 1 minute)
- Health checks (< 30 seconds)
Total: ~2 minutes
```

### Coverage Requirements

**package.json** configuration:

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      },
      "./src/services/payment/": {
        "branches": 95,
        "functions": 95,
        "lines": 95,
        "statements": 95
      }
    }
  }
}
```

---

## Manual Test Execution

### Development Workflow

**During Feature Development**:

```bash
# Watch mode for rapid feedback
npm run test:watch

# Run specific test file
npm test -- path/to/test.spec.js

# Run tests matching pattern
npm test -- --grep "User Flow"

# Run with detailed output
npm test -- --verbose
```

**Before Committing**:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run linter
npm run lint

# Run all quality checks
npm run quality
```

### Test Logging & Debugging

**Enable Detailed Logging**:

```javascript
// tests/config/test-setup.js
if (process.env.DEBUG_TESTS) {
  // Log all API calls
  global.beforeEach(() => {
    console.log('\n--- Test Starting ---');
  });
  
  global.afterEach((done) => {
    console.log('--- Test Complete ---\n');
    done();
  });
}
```

**Usage**:
```bash
DEBUG_TESTS=true npm test
```

### Copying Test Logs

**Generate Test Report**:

```javascript
// jest.config.js
module.exports = {
  reporters: [
    'default',
    ['jest-html-reporter', {
      pageTitle: 'Test Report',
      outputPath: './test-reports/index.html',
      includeFailureMsg: true,
      includeConsoleLog: true,
    }]
  ]
};
```

**Copy Logs to Clipboard** (Windows):

```powershell
# PowerShell script
npm test 2>&1 | Tee-Object -FilePath test-output.log
Get-Content test-output.log | Set-Clipboard
```

**Copy Logs to Clipboard** (Mac/Linux):

```bash
npm test 2>&1 | tee test-output.log
cat test-output.log | pbcopy  # Mac
cat test-output.log | xclip -selection clipboard  # Linux
```

---

## Test Maintenance & Growth

### When to Add Tests

**1. Before Writing Code (TDD)**:
```
Write test → Watch it fail → Write code → Watch it pass → Refactor
```

**2. When Fixing Bugs**:
```
Reproduce bug with test → Fix bug → Test passes → Bug won't recur
```

**3. When Adding Features**:
```
Feature requirements → Write tests → Implement feature → Tests pass
```

**4. When Refactoring**:
```
Existing tests protect against regressions during refactor
```

### Test Maintenance Schedule

**Daily**:
- Fix any failing tests immediately
- Run test suite before commits

**Weekly**:
- Review test execution times
- Fix any flaky tests
- Update test data/fixtures

**Monthly**:
- Review coverage reports
- Identify untested areas
- Refactor slow tests
- Update testing dependencies

**Quarterly**:
- Comprehensive test suite audit
- Remove redundant tests
- Add missing coverage
- Performance optimization
- Test documentation update

### Handling Flaky Tests

**Identify Flaky Tests**:
```bash
# Run tests multiple times
for i in {1..10}; do npm test; done

# Use dedicated tools
npm install -D jest-repeat
```

**Common Causes & Fixes**:

1. **Timing Issues**:
```javascript
// ❌ BAD: Hard-coded delays
await sleep(1000);

// ✅ GOOD: Wait for specific condition
await waitFor(() => expect(element).toBeInTheDocument());
```

2. **Test Interdependence**:
```javascript
// ❌ BAD: Tests share state
let sharedUser;
beforeAll(() => { sharedUser = createUser(); });

// ✅ GOOD: Each test creates own data
beforeEach(() => { user = createUser(); });
```

3. **Non-Deterministic Data**:
```javascript
// ❌ BAD: Random data causes failures
expect(result).toBe(Math.random());

// ✅ GOOD: Predictable assertions
expect(result).toBeGreaterThan(0);
expect(result).toBeLessThan(1);
```

### Growing Test Suite Over Time

**Growth Strategy**:

```
Initial Setup (Phase 1)
  ↓
Core Coverage (Phase 2-3)
  ↓
Edge Cases (Phase 4)
  ↓
Polish (Phase 5)
  ↓
Continuous Addition (Phase 6) → Maintain 80%+ coverage
  ↓
Refactor & Optimize
  ↓
Repeat
```

**Test Growth Metrics**:

| Metric | Target | Frequency |
|--------|--------|-----------|
| Total Tests | 450-500 by end of Phase 5 | Track weekly |
| Coverage | 80%+ | Track daily |
| Execution Time | < 2 minutes for all tests | Track weekly |
| Flaky Test Rate | < 1% | Track daily |
| Test/Code Ratio | ~1:1 (lines) | Track monthly |

---

## Tools & Frameworks

### Recommended Testing Stack

**Unit & Integration Testing**:
- [Jest](https://jestjs.io/) - Full-featured testing framework
- [Vitest](https://vitest.dev/) - Fast Vite-native testing
- [Mocha](https://mochajs.org/) + [Chai](https://www.chaijs.com/) - Flexible testing combo

**React Testing**:
- [React Testing Library](https://testing-library.com/react) - User-centric component testing
- [Jest](https://jestjs.io/) - Test runner and assertions

**E2E Testing**:
- [Cypress](https://www.cypress.io/) - Modern E2E testing (recommended)
- [Playwright](https://playwright.dev/) - Cross-browser E2E testing
- [Puppeteer](https://pptr.dev/) - Headless Chrome automation

**Accessibility Testing**:
- [jest-axe](https://github.com/nickcolley/jest-axe) - Automated a11y testing
- [axe-core](https://github.com/dequelabs/axe-core) - Accessibility engine
- [pa11y](https://pa11y.org/) - Automated accessibility checker

**Visual Testing**:
- [Percy](https://percy.io/) - Visual regression testing (commercial)
- [Chromatic](https://www.chromatic.com/) - Storybook visual testing
- [BackstopJS](https://github.com/garris/BackstopJS) - Open-source visual regression

**API Testing**:
- [Supertest](https://github.com/visionmedia/supertest) - HTTP assertion library
- [MSW (Mock Service Worker)](https://mswjs.io/) - API mocking
- [Nock](https://github.com/nock/nock) - HTTP server mocking

**Test Data**:
- [Faker.js](https://fakerjs.dev/) - Generate realistic test data
- [Factory Bot](https://github.com/aexmachina/factory-bot) - Test data factories
- [Chance.js](https://chancejs.com/) - Random generator helper

**Code Quality**:
- [ESLint](https://eslint.org/) + [eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest) - Linting for tests
- [Prettier](https://prettier.io/) - Code formatting
- [Husky](https://typicode.github.io/husky/) - Git hooks

### Framework Setup Examples

**Jest Configuration**:

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/tests/config/test-setup.js'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],
  transform: {
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { configFile: './babel.config.test.js' }]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  }
};
```

**Cypress Configuration**:

```javascript
// cypress.config.js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'tests/e2e/**/*.spec.{js,jsx,ts,tsx}',
    supportFile: 'tests/config/cypress-support.js',
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

---

## Example Test Suites

### Example 1: User Authentication Flow

```javascript
// tests/e2e/user-flows/authentication.spec.js
describe('User Flow: Authentication', () => {
  describe('Registration', () => {
    it('should allow new user to register with valid credentials', async () => {
      // Arrange
      const newUser = {
        email: faker.internet.email(),
        password: 'SecureP@ss123',
        name: faker.name.fullName()
      };
      
      // Act
      await visit('/register');
      await fillInput('email', newUser.email);
      await fillInput('password', newUser.password);
      await fillInput('name', newUser.name);
      await clickButton('Create Account');
      
      // Assert
      expect(await getCurrentUrl()).toBe('/dashboard');
      expect(await getWelcomeMessage()).toContain(newUser.name);
      expect(await isUserLoggedIn()).toBe(true);
    });
    
    it('should reject registration with existing email', async () => {
      const existingUser = await createUser();
      
      await visit('/register');
      await fillInput('email', existingUser.email);
      await fillInput('password', 'SecureP@ss123');
      await fillInput('name', 'John Doe');
      await clickButton('Create Account');
      
      expect(await getErrorMessage()).toContain('Email already registered');
      expect(await isUserLoggedIn()).toBe(false);
    });
  });
  
  describe('Login', () => {
    it('should allow existing user to login', async () => {
      const user = await createUser({ password: 'KnownPass123' });
      
      await visit('/login');
      await fillInput('email', user.email);
      await fillInput('password', 'KnownPass123');
      await clickButton('Sign In');
      
      expect(await getCurrentUrl()).toBe('/dashboard');
      expect(await isUserLoggedIn()).toBe(true);
    });
    
    it('should reject login with incorrect password', async () => {
      const user = await createUser();
      
      await visit('/login');
      await fillInput('email', user.email);
      await fillInput('password', 'WrongPassword');
      await clickButton('Sign In');
      
      expect(await getErrorMessage()).toContain('Invalid credentials');
      expect(await isUserLoggedIn()).toBe(false);
    });
  });
  
  describe('Logout', () => {
    it('should successfully logout user', async () => {
      const user = await createUser();
      await loginAs(user);
      
      await clickButton('Logout');
      
      expect(await getCurrentUrl()).toBe('/');
      expect(await isUserLoggedIn()).toBe(false);
    });
  });
});
```

### Example 2: API Integration Tests

```javascript
// tests/integration/api/products.spec.js
import request from 'supertest';
import app from '@/app';
import { createTestProduct, clearDatabase } from '@/tests/helpers';

describe('Integration: Product API', () => {
  beforeEach(async () => {
    await clearDatabase();
  });
  
  describe('POST /api/products', () => {
    it('should create new product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99,
        category: 'Electronics',
        description: 'A test product'
      };
      
      const response = await request(app)
        .post('/api/products')
        .send(productData)
        .expect(201);
      
      expect(response.body).toMatchObject({
        id: expect.any(Number),
        ...productData,
        createdAt: expect.any(String)
      });
    });
    
    it('should reject product with missing required fields', async () => {
      const response = await request(app)
        .post('/api/products')
        .send({ name: 'Incomplete Product' })
        .expect(400);
      
      expect(response.body.error).toContain('price is required');
    });
  });
  
  describe('GET /api/products/:id', () => {
    it('should retrieve product by ID', async () => {
      const product = await createTestProduct();
      
      const response = await request(app)
        .get(`/api/products/${product.id}`)
        .expect(200);
      
      expect(response.body).toMatchObject({
        id: product.id,
        name: product.name,
        price: product.price
      });
    });
    
    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/99999')
        .expect(404);
      
      expect(response.body.error).toContain('Product not found');
    });
  });
});
```

### Example 3: Accessibility Tests

```javascript
// tests/accessibility/navigation.a11y.test.js
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe, toHaveNoViolations } from 'jest-axe';
import Navigation from '@/components/Navigation';

expect.extend(toHaveNoViolations);

describe('Accessibility: Navigation', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Navigation />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard navigable', () => {
    render(<Navigation />);
    
    const links = screen.getAllByRole('link');
    
    // Tab through all links
    links.forEach((link) => {
      userEvent.tab();
      expect(link).toHaveFocus();
    });
  });
  
  it('should have proper ARIA labels', () => {
    render(<Navigation />);
    
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label', 'Main navigation');
    expect(screen.getByRole('link', { name: /home/i })).toHaveAttribute('aria-label', 'Navigate to home page');
  });
  
  it('should announce page changes to screen readers', async () => {
    render(<Navigation />);
    
    const homeLink = screen.getByRole('link', { name: /home/i });
    userEvent.click(homeLink);
    
    const announcement = await screen.findByRole('status');
    expect(announcement).toHaveTextContent('Navigated to Home page');
  });
});
```

---

## Best Practices Checklist

### Test Writing

- [ ] Follow AAA pattern (Arrange, Act, Assert)
- [ ] Use descriptive test names (should...when...)
- [ ] One assertion per test (when possible)
- [ ] Use realistic test data (not "foo", "bar")
- [ ] Avoid test interdependence
- [ ] Test behavior, not implementation
- [ ] Keep tests simple and readable
- [ ] Use test factories for data creation
- [ ] Mock external dependencies appropriately
- [ ] Test both happy and sad paths

### Test Organization

- [ ] Organize by feature/category
- [ ] Use consistent naming conventions
- [ ] Group related tests with describe blocks
- [ ] Place tests near related code
- [ ] Separate unit/integration/e2e tests
- [ ] Document complex test setups
- [ ] Use helpers for repeated operations
- [ ] Keep test files focused and concise

### Test Coverage

- [ ] Achieve 80%+ code coverage
- [ ] Cover all critical user flows
- [ ] Test edge cases and boundaries
- [ ] Include accessibility tests
- [ ] Test error handling
- [ ] Cover all API endpoints
- [ ] Test state management
- [ ] Include performance tests for critical paths

### CI/CD Integration

- [ ] Tests run on every commit
- [ ] Fast feedback (< 5 minutes for PR builds)
- [ ] Fail builds on test failures
- [ ] Generate coverage reports
- [ ] Enforce coverage thresholds
- [ ] Run different test suites at different stages
- [ ] Parallelize test execution
- [ ] Store test artifacts (reports, screenshots)

### Maintenance

- [ ] Fix flaky tests immediately
- [ ] Refactor slow tests
- [ ] Update tests when code changes
- [ ] Remove obsolete tests
- [ ] Regular test suite audits
- [ ] Monitor test execution times
- [ ] Keep dependencies updated
- [ ] Document testing patterns

### Quality

- [ ] No hardcoded waits/sleeps
- [ ] No tests marked as .skip
- [ ] No console.log statements
- [ ] Proper async/await usage
- [ ] Clean up test data after tests
- [ ] Use appropriate matchers
- [ ] Meaningful error messages
- [ ] Tests are deterministic

---

## Summary

This testing strategy provides a comprehensive framework for building robust, maintainable test suites. Key takeaways:

1. **Follow the Test Pyramid**: Most tests should be fast unit tests, fewer integration tests, and minimal E2E tests

2. **Cover 7 Categories**: User Flows, Integration, Edge Cases, Accessibility, UI Behavior, Unit Tests, Real User Scenarios

3. **Implement in 6 Phases**: Start with foundation, build core coverage, add edge cases, polish UI, optimize performance, then continuously improve

4. **Apply AI-Driven Design**: Analyze requirements, think like users/QA/developers, generate comprehensive scenarios

5. **Integrate with CI/CD**: Automate test execution, enforce coverage, provide fast feedback

6. **Maintain Continuously**: Fix flaky tests, refactor slow tests, grow suite with features, regular audits

**Target Metrics**:
- 450-500 total tests by end of Phase 5
- 80%+ code coverage
- < 2 minutes total execution time
- < 1% flaky test rate
- All critical user flows covered

**Next Steps**:
1. Review this template with the team
2. Set up testing framework and CI/CD pipeline
3. Start Phase 1 implementation (foundation tests)
4. Follow the roadmap incrementally
5. Use AI_TEST_GENERATION_GUIDE.md for test creation

---

*This testing strategy template is designed to work seamlessly with other ProjectPlanner templates. Reference TOKEN_EFFICIENT_KICKOFF.md for project planning and QUICK_START_GUIDE.md for implementation workflows.*
