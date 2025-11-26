# AI Test Generation Guide

> **Purpose**: Step-by-step instructions for AI agents to generate comprehensive, high-quality tests by analyzing requirements and applying human-centered thinking. This guide teaches AI how to think like a user, QA engineer, and developer simultaneously.

> **Audience**: GitHub Copilot, ChatGPT, Claude, and other AI coding assistants tasked with writing tests for software projects.

---

## Table of Contents

1. [Quick Start for AI Agents](#quick-start-for-ai-agents)
2. [The AI Testing Mindset](#the-ai-testing-mindset)
3. [Step-by-Step Test Generation Process](#step-by-step-test-generation-process)
4. [Analyzing Requirements](#analyzing-requirements)
5. [Applying Human Mentality](#applying-human-mentality)
6. [Generating Test Scenarios](#generating-test-scenarios)
7. [Writing Test Code](#writing-test-code)
8. [Test Category Templates](#test-category-templates)
9. [Common Patterns & Examples](#common-patterns--examples)
10. [AI Prompts for Test Generation](#ai-prompts-for-test-generation)
11. [Quality Checklist](#quality-checklist)

---

## Quick Start for AI Agents

### When You Receive a Request to Write Tests

**Input You'll Receive**:
- Feature description or PRD (Product Requirements Document)
- Code files to test
- User stories
- Database schema
- API documentation

**Your Output Should Include**:
1. Test plan (what will be tested)
2. Test code organized by category
3. Test data factories/fixtures
4. Documentation of assumptions

**Quick Decision Tree**:

```
Is this a new feature?
├─ Yes → Write tests BEFORE code (TDD approach)
│         → Cover all 7 test categories
│         → Start with User Flow tests
└─ No → Is this a bug fix?
    ├─ Yes → Write test that reproduces bug first
    │         → Fix bug
    │         → Verify test passes
    └─ No → Is this a refactor?
        └─ Yes → Ensure existing tests still pass
                  → Add tests for uncovered areas
```

### Your Testing Responsibilities

As an AI test generator, you should:

✅ **DO**:
- Read and understand all requirements thoroughly
- Think from user, QA, and developer perspectives
- Generate realistic test data
- Cover happy paths, error cases, and edge cases
- Write clear, descriptive test names
- Follow project testing patterns
- Include helpful comments for complex tests
- Consider accessibility and performance

❌ **DON'T**:
- Write tests that test framework functionality
- Create overly complex test setups
- Use unrealistic data ("foo", "bar", "test123")
- Test implementation details
- Create interdependent tests
- Skip error handling scenarios
- Ignore edge cases

---

## The AI Testing Mindset

### Three Personas You Must Embody

When generating tests, think as three different people simultaneously:

#### 1. 👤 End User

**Mindset**: "I want to accomplish my goal easily and correctly"

**Questions to Ask**:
- Can I complete my task?
- What if I make a mistake?
- Is the feedback clear?
- Does it work on my device?
- Is it accessible?
- Is it fast enough?

**Example Thinking**:
```
Feature: Add item to shopping cart

User Perspective:
- "When I click 'Add to Cart', I expect the item to be in my cart immediately"
- "I want to see confirmation that it worked"
- "What if I accidentally click twice?"
- "Can I add multiple different items?"
- "What if the item is out of stock?"
```

#### 2. 🔍 QA Engineer

**Mindset**: "I want to break this and find every possible issue"

**Questions to Ask**:
- What are all the ways this could fail?
- What happens at the boundaries?
- How does it handle errors?
- Is it performant under load?
- Are there security vulnerabilities?
- What about edge cases?

**Example Thinking**:
```
Feature: Add item to shopping cart

QA Perspective:
- "What if quantity is 0?"
- "What if quantity is MAX_INT?"
- "What if the user isn't logged in?"
- "What if two users add the same item simultaneously?"
- "What if the API times out?"
- "What if the database is down?"
- "What if the item ID doesn't exist?"
```

#### 3. 💻 Developer

**Mindset**: "I want to ensure the code is solid and maintainable"

**Questions to Ask**:
- Is the code testable?
- Are components properly isolated?
- Is error handling comprehensive?
- Is the API contract clear?
- Are there performance implications?
- Is the state management correct?

**Example Thinking**:
```
Feature: Add item to shopping cart

Developer Perspective:
- "Does addToCart() call the API with the correct payload?"
- "Is the cart state updated optimistically?"
- "Does the component re-render correctly?"
- "Are loading states handled?"
- "Is the error thrown with proper details?"
- "Is the database transaction atomic?"
```

### The Human Mentality Framework

Use this framework for every test you generate:

```
1. UNDERSTAND the user's goal
   ↓
2. IDENTIFY potential issues (happy, sad, edge cases)
   ↓
3. PRIORITIZE critical scenarios first
   ↓
4. GENERATE comprehensive test scenarios
   ↓
5. WRITE clear, maintainable test code
   ↓
6. VERIFY tests are realistic and valuable
```

---

## Step-by-Step Test Generation Process

### Step 0: Set Up UI Mocking Infrastructure (CRITICAL)

**Before Writing Any Tests**

Create proper UI mocking infrastructure to ensure user flow tests can interact with application components realistically.

**Create Test Utilities Directory:**
```
tests/
├── test-utils/
│   ├── render-with-providers.tsx    ← Mock all contexts
│   ├── mock-api.ts                   ← MSW handlers
│   ├── mock-browser-apis.ts          ← localStorage, etc.
│   ├── mock-data.ts                  ← Test fixtures
│   └── test-helpers.ts               ← Common utilities
```

**Essential Mocks for User Flow Tests:**

1. **Context Providers** (Always needed)
   - Authentication (user state, login/logout)
   - Theme/UI settings
   - Router (navigation)
   - State management (Redux, Zustand, etc.)

2. **API Mocking** (Use MSW - Mock Service Worker)
   - GET requests (fetch data)
   - POST requests (create data)
   - Error responses (test error handling)
   - Loading states (test loading UI)

3. **Browser APIs** (Mock as needed)
   - `localStorage` / `sessionStorage`
   - `window.matchMedia` (responsive tests)
   - `IntersectionObserver` (lazy loading)
   - `scrollTo` / `scrollIntoView`
   - `navigator.clipboard` (copy/paste)

4. **Third-Party Libraries** (Selective mocking)
   - Payment processors (Stripe, PayPal)
   - Analytics (Google Analytics, Mixpanel)
   - Maps (Google Maps, Mapbox)
   - Charts (Chart.js, D3)

**Test Utility Template:**
```typescript
// test-utils/render-with-providers.tsx
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';

export function renderWithProviders(ui, { user = mockUser, ...options } = {}) {
  const mockAuthValue = {
    user,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: !!user
  };
  
  function Wrapper({ children }) {
    return (
      <BrowserRouter>
        <AuthProvider value={mockAuthValue}>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    );
  }
  
  return {
    ...render(ui, { wrapper: Wrapper, ...options }),
    mockAuthValue // Return mocks for assertions
  };
}
```

**MSW API Mocking Template:**
```typescript
// test-utils/mock-api.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';

export const handlers = [
  rest.get('/api/meal-plans', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockMealPlans));
  }),
  rest.post('/api/meal-plans', async (req, res, ctx) => {
    const body = await req.json();
    return res(ctx.status(201), ctx.json({ id: '123', ...body }));
  })
];

export const server = setupServer(...handlers);

// In test setup:
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Why This Matters:**
- ✅ Tests can interact with UI components realistically
- ✅ No need for actual backend during testing
- ✅ Fast execution (no network calls)
- ✅ Deterministic results (no flaky tests)
- ✅ Easy to test error scenarios
- ✅ Isolated from external dependencies

**Golden Rule:**
Mock external dependencies, use real components. This gives you confidence that user interactions work while keeping tests fast and reliable.

#### Service Mocking

Mock external services and third-party libraries for predictable, fast tests:

```typescript
// test-utils/service-mocks.ts
// Mock AI/LLM API calls to return predictable test data
vi.mock('@/lib/aiHelper', () => ({
  generateRecipe: vi.fn().mockResolvedValue({ /* mock recipe */ }),
  chatWithAssistant: vi.fn().mockResolvedValue({ response: 'Mock AI response' }),
}));

// Mock toast notifications (silent during tests)
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
  Toaster: () => null,
}));

// Mock analytics, payment services, file uploads, etc.
```

#### Helper Functions

Create reusable test utilities to simplify tests and reduce duplication:

```typescript
// test-utils/test-helpers.ts

// 1. renderApp() - Wraps App in QueryClientProvider with test-friendly config
export const renderApp = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
      mutations: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>{component}</QueryClientProvider>
  );
};

// 2. waitForLoadingToFinish() - Waits for async operations to complete
export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

// 3. setupMockData() - Generic helper to populate localStorage
// Replace [Entity] with your type (User, Product, Order, etc.)
export const setupMock[Entity] = (items?: [Entity][]) => {
  const defaultItems = items || [
    createMock[Entity]({ id: '1', name: 'Item One', status: 'active' }),
    createMock[Entity]({ id: '2', name: 'Item Two', status: 'pending' }),
  ];
  localStorage.setItem('[entityKey]', JSON.stringify(defaultItems));
  return defaultItems;
};

// 4. createMock[Entity]() - Factory for generating mock objects
// Customize with your domain-specific fields
export const createMock[Entity] = (overrides?: Partial<[Entity]>): [Entity] => ({
  id: overrides?.id || `[entity]-${Math.random().toString(36).substr(2, 9)}`,
  name: overrides?.name || 'Mock [Entity]',
  status: overrides?.status || 'active',
  // Add your domain-specific fields:
  // price: overrides?.price || 99.99,
  // category: overrides?.category || 'default',
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});
```

#### Simplified Test Approach

**Focus tests on testable behavior** instead of complex interactions requiring extensive mocking:

✅ **DO Test:**
- App structure and navigation
- Data display from localStorage/state
- Search and filter functionality
- Data persistence operations
- Tab switching and routing
- Form validation and error states

❌ **AVOID Testing (requires excessive mocking):**
- Complex dialog interactions with many dependencies
- Multi-step wizards with external service calls
- Real-time features requiring WebSocket mocking
- Third-party component internals

**Example**: Instead of testing a complex multi-step dialog with authentication, API calls, and notifications, break it down:
1. Entity data displays correctly from data source
2. Search filters entities by search term
3. New entity persists to data source
4. Tab/view switching works correctly
5. Form validation shows appropriate errors

---

### Step 1: Analyze the Feature/Requirements

**Read These Sources** (in order):

1. **PRD/Feature Description**: What problem are we solving?
2. **User Stories**: Who benefits and how?
3. **Database Schema**: What data structures exist?
4. **API Documentation**: What endpoints/functions are exposed?
5. **Existing Code**: What patterns are already established?
6. **Architecture Decisions**: Why were certain choices made?

**Create a Feature Analysis Document**:

```markdown
# Feature Analysis: [Feature Name]

## Purpose
What problem does this solve?

## Users
Who will use this feature?

## User Goals
What do users want to accomplish?

## Data Model
What data is involved?

## Business Rules
What constraints/validations exist?

## Success Criteria
How do we know it works?

## Potential Issues
What could go wrong?
```

**Example**:

```markdown
# Feature Analysis: Shopping Cart

## Purpose
Allow users to save items for later purchase

## Users
- Registered users (authenticated)
- Guest users (anonymous)

## User Goals
- Add items quickly
- View cart contents
- Modify quantities
- Remove items
- Proceed to checkout

## Data Model
- Cart (id, user_id, created_at)
- CartItem (id, cart_id, product_id, quantity)
- Product (id, name, price, stock)

## Business Rules
- Max quantity per item: 99
- Max items per cart: 100
- Out of stock items cannot be added
- Guest carts expire after 30 days
- Registered users carts persist indefinitely

## Success Criteria
- User can add item in < 500ms
- Cart updates are reflected immediately
- Cart persists across sessions (registered users)
- Error messages are clear and actionable

## Potential Issues
- Concurrent updates (two users, one item)
- Stock synchronization
- Cart abandonment
- Performance with large carts
- Network failures during add/remove
```

---

### Step 2: Generate Test Scenarios

Use these templates to systematically generate scenarios:

#### Template 1: CRUD Matrix

For any data entity, generate tests for Create, Read, Update, Delete:

```
Feature: [Entity Name]

CREATE:
✓ Success: Valid data → Entity created
✓ Error: Missing required field → Error message
✓ Error: Duplicate unique field → Error message
✓ Error: Invalid data type → Error message
✓ Edge: Boundary values (min/max) → Handled correctly

READ:
✓ Success: By ID → Entity returned
✓ Success: List all → All entities returned
✓ Success: Filter/Search → Matching entities returned
✓ Error: Non-existent ID → 404 error
✓ Error: Invalid query → Error message
✓ Edge: Empty results → Empty array returned

UPDATE:
✓ Success: Valid changes → Entity updated
✓ Error: Non-existent ID → 404 error
✓ Error: Invalid data → Error message
✓ Error: Unauthorized → 403 error
✓ Edge: No changes → No operation

DELETE:
✓ Success: By ID → Entity deleted
✓ Error: Non-existent ID → 404 error
✓ Error: Unauthorized → 403 error
✓ Edge: Cascade delete → Related entities handled
✓ Edge: Soft delete → Entity marked as deleted
```

#### Template 2: User Journey Map

For user workflows, map the complete journey:

```
User Goal: [What user wants to accomplish]

Path: [Step 1] → [Step 2] → [Step 3] → [Result]

For each step, test:
✓ Happy path: Everything works correctly
✓ Error path: Step fails, user gets clear error
✓ Edge path: Unusual but valid scenario
✓ Accessibility: Can complete with keyboard/screen reader
✓ Performance: Completes in acceptable time
```

**Example**:

```
User Goal: Purchase a product

Path: Browse → Select → Add to Cart → Checkout → Confirmation

Step 1: Browse
✓ Products load and display correctly
✓ Search/filter works
✓ Out of stock items are marked
✓ Images load properly
✓ Accessible navigation

Step 2: Select
✓ Product details display
✓ Variant selection works
✓ Quantity input validated
✓ Add to cart button enabled/disabled appropriately

Step 3: Add to Cart
✓ Item added successfully
✓ Cart count updates
✓ Confirmation message shown
✓ Handles duplicate additions
✓ Handles out of stock

Step 4: Checkout
✓ Form validation works
✓ Payment processing succeeds
✓ Error handling for payment failures
✓ Address validation

Step 5: Confirmation
✓ Order confirmation displayed
✓ Email sent
✓ Order saved to database
✓ Inventory updated
```

#### Template 3: Input Validation Matrix

For any input field, test all scenarios:

```
Field: [Field Name]
Type: [string/number/email/etc]
Required: [yes/no]
Min: [minimum value]
Max: [maximum value]
Pattern: [regex if applicable]

Test Cases:
✓ Valid input → Accepted
✓ Empty input → Error if required, accepted if optional
✓ Below minimum → Error message
✓ Above maximum → Error message
✓ Invalid format → Error message
✓ Special characters → Sanitized or rejected
✓ XSS attempt → Sanitized
✓ SQL injection attempt → Sanitized
✓ Unicode/Emoji → Handled correctly
```

#### Template 4: State Transition Matrix

For features with multiple states, test all transitions:

```
Feature: [Feature Name]

States: [State A] | [State B] | [State C]

Transitions:
State A → State B: [Action] → [Test]
State A → State C: [Action] → [Test]
State B → State A: [Action] → [Test]
State B → State C: [Action] → [Test]
State C → State A: [Action] → [Test]
State C → State B: [Action] → [Test]

Invalid Transitions:
State A → [Invalid State]: [Action] → [Error]
```

**Example**:

```
Feature: Order Status

States: Pending | Processing | Shipped | Delivered | Cancelled

Transitions:
Pending → Processing: Admin approves → Status updated
Pending → Cancelled: User cancels → Status updated, inventory restored
Processing → Shipped: Admin ships → Status updated, tracking number added
Processing → Cancelled: Admin cancels → Status updated, refund initiated
Shipped → Delivered: Delivery confirmed → Status updated
Shipped → [Cannot cancel]: User tries to cancel → Error message

Invalid Transitions:
Pending → Delivered: [Not possible] → Error
Cancelled → Processing: [Not possible] → Error
Delivered → Shipped: [Not possible] → Error
```

---

### Step 3: Prioritize Test Scenarios

Use this prioritization system:

| Priority | When to Use | Examples |
|----------|-------------|----------|
| **P0 (Critical)** | - Core business function<br>- Data loss risk<br>- Security vulnerability<br>- Payment/financial | - User registration<br>- Checkout process<br>- Payment processing<br>- Data persistence |
| **P1 (High)** | - Major feature<br>- Poor UX impact<br>- Performance issue | - Search functionality<br>- Product filtering<br>- Form validation<br>- API response times |
| **P2 (Medium)** | - Minor feature<br>- Cosmetic issue<br>- Uncommon scenario | - Sorting options<br>- Tooltips<br>- Animations<br>- Rare edge cases |
| **P3 (Low)** | - Nice to have<br>- Very rare<br>- Minor optimization | - Easter eggs<br>- Extreme edge cases<br>- Browser quirks |

**Decision Tree**:

```
Does this affect core business value?
├─ Yes → P0
└─ No → Does this affect user experience significantly?
    ├─ Yes → P1
    └─ No → Does this affect functionality?
        ├─ Yes → P2
        └─ No → P3
```

**Write Tests in This Order**:
1. P0 tests (Week 1-2)
2. P1 tests (Week 3-4)
3. P2 tests (Week 5-8)
4. P3 tests (if time permits)

---

## Analyzing Requirements

### Input Sources Analysis

#### 1. PRD (Product Requirements Document)

**What to Extract**:
- User persona and goals
- Feature description
- Success criteria
- Constraints and limitations
- Business rules

**Example PRD Analysis**:

```
PRD: Shopping Cart Feature

Extract for Testing:
1. User Persona: "Online shoppers who want to save items for later"
2. Goal: "Allow users to add/remove items before purchasing"
3. Success Criteria: "Cart updates in < 500ms, persists across sessions"
4. Constraints: "Max 100 items per cart, max quantity 99 per item"
5. Business Rules: "Cannot add out-of-stock items"

Generated Test Categories:
- User Flow: Add item → View cart → Modify → Checkout
- Performance: Response time < 500ms
- Edge Cases: 100 items, quantity 99, out of stock
- Integration: Cart → Database persistence
- Accessibility: Keyboard navigation, screen reader
```

#### 2. User Stories

**Format**: "As a [user], I want [goal], so that [benefit]"

**What to Extract**:
- Who is using the feature
- What they want to accomplish
- Why they want it

**Example User Story Analysis**:

```
User Story: "As a registered user, I want to save items in my cart across sessions, so that I don't lose my selections"

Extract for Testing:
1. User Type: Registered (authenticated)
2. Action: Save items
3. Persistence: Across sessions
4. Benefit: Don't lose selections

Generated Tests:
✓ User adds item → Logs out → Logs back in → Item still in cart
✓ User adds item → Closes browser → Reopens → Item still in cart
✓ User adds item → Uses different device → Item appears in cart
✓ Guest user adds item → Registers → Cart migrates to account
```

#### 3. Database Schema

**What to Extract**:
- Entity relationships
- Required fields
- Constraints (unique, foreign key)
- Data types
- Indexes

**Example Schema Analysis**:

```sql
-- Database Schema
CREATE TABLE carts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE cart_items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  cart_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL CHECK (quantity > 0 AND quantity <= 99),
  FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(id),
  UNIQUE KEY (cart_id, product_id)
);

Extract for Testing:
1. Relationships: Cart has many CartItems
2. Required: user_id, cart_id, product_id, quantity
3. Constraints: 
   - quantity must be 1-99
   - One product per cart (unique constraint)
   - Cascade delete (delete cart → delete items)
4. Data Types: INT (IDs), TIMESTAMP (dates)

Generated Tests:
✓ Create cart with valid user_id → Success
✓ Create cart with non-existent user_id → Error (foreign key)
✓ Add item with quantity 0 → Error (check constraint)
✓ Add item with quantity 100 → Error (check constraint)
✓ Add same product twice to cart → Error (unique constraint)
✓ Delete cart → Cart items also deleted (cascade)
```

#### 4. API Documentation

**What to Extract**:
- Endpoints and methods
- Request/response formats
- Status codes
- Authentication requirements
- Rate limits

**Example API Analysis**:

```
API Endpoint: POST /api/cart/items

Request:
{
  "product_id": number,
  "quantity": number (1-99)
}

Response (201):
{
  "id": number,
  "cart_id": number,
  "product_id": number,
  "quantity": number,
  "created_at": string
}

Response (400):
{
  "error": string,
  "field": string
}

Auth: Bearer token required
Rate Limit: 100 requests/minute

Extract for Testing:
1. Method: POST
2. Auth: Required (Bearer token)
3. Success: 201 status, returns cart item
4. Error: 400 for validation errors
5. Rate Limit: Test with 100+ requests

Generated Tests:
✓ POST with valid data + auth → 201 + cart item
✓ POST without auth → 401 Unauthorized
✓ POST with missing product_id → 400 + error message
✓ POST with invalid quantity (0) → 400 + error message
✓ POST with invalid quantity (100) → 400 + error message
✓ POST 101 requests in 1 minute → 429 Rate Limit
```

---

## Applying Human Mentality

### Technique 1: Role-Playing

Literally ask yourself questions as each persona:

**Example: Testing a Login Form**

**As End User**:
```
Q: "How do I log in?"
A: Test that form is clearly labeled and easy to find

Q: "What if I forget my password?"
A: Test that "Forgot Password" link is visible and works

Q: "What if I mistype my password?"
A: Test that error message is clear and helpful

Q: "Can I log in on my phone?"
A: Test responsive design and touch targets
```

**As QA Engineer**:
```
Q: "What happens with an empty email?"
A: Test validation error message

Q: "What happens with SQL injection attempt?"
A: Test input sanitization

Q: "What happens with 10,000 character password?"
A: Test input length limits

Q: "What happens if I click submit 50 times?"
A: Test rate limiting and button disabling
```

**As Developer**:
```
Q: "Is the API called with correct payload?"
A: Test that request matches API spec

Q: "Is the JWT token stored securely?"
A: Test secure storage (httpOnly cookie, not localStorage)

Q: "Does it handle API errors gracefully?"
A: Test error handling for network failures

Q: "Is loading state managed correctly?"
A: Test loading spinner and button disabled state
```

### Technique 2: "What If" Scenarios

Generate tests by asking "What if...?"

**Example: Shopping Cart**

```
What if...
✓ the user adds the same item twice?
✓ the user adds an item that just went out of stock?
✓ the user's session expires while adding item?
✓ the API times out?
✓ the user has a slow connection?
✓ the user clicks "Add to Cart" rapidly 10 times?
✓ the cart already has 99 items?
✓ the item price changes while in cart?
✓ the user navigates away mid-add?
✓ the database connection drops?
```

### Technique 3: User Story Expansion

Expand every user story into multiple test scenarios:

**User Story**: "As a user, I want to add items to my cart"

**Expansion**:

```
Happy Path:
✓ User clicks "Add to Cart" → Item added successfully

Error Paths:
✓ User not logged in → Redirect to login or guest cart
✓ Item out of stock → Show error message
✓ API error → Show error message with retry option

Edge Cases:
✓ Adding item while page is loading
✓ Adding item with quantity picker at 0
✓ Adding item that was just removed
✓ Adding 100th item (at cart limit)

Accessibility:
✓ Can add item using keyboard only
✓ Screen reader announces cart update

Performance:
✓ Add completes in < 500ms
✓ UI updates optimistically (doesn't wait for API)
```

---

## Generating Test Scenarios

### Scenario Generation Templates

#### Template 1: Feature Exploration

```
Feature: [Feature Name]

1. IDENTIFY core functionality
   - What is the primary action?
   - What is the expected outcome?

2. IDENTIFY variations
   - Different user types (guest, registered, admin)
   - Different data types (empty, valid, invalid, edge)
   - Different states (initial, loading, success, error)
   - Different devices (mobile, tablet, desktop)

3. IDENTIFY interactions
   - How does this feature interact with other features?
   - What external services does it depend on?
   - What data does it create/modify/delete?

4. IDENTIFY failure modes
   - Network failures
   - Server errors
   - Invalid input
   - Authorization failures
   - Resource limitations

5. GENERATE test matrix
   [Variation] × [Interaction] × [Failure Mode] = Test Scenarios
```

#### Template 2: Test Case Formula

Use this formula to generate test cases:

```
Test Name: Should [expected behavior] when [condition]

Example:
"Should display error message when email is invalid"
"Should redirect to login when user is not authenticated"
"Should disable submit button when form is incomplete"
"Should update cart count when item is added"
```

**Pattern Library**:

```javascript
// Success Patterns
"Should [action] successfully when [valid condition]"
"Should return [expected data] when [action] is performed"
"Should update [state] after [action]"

// Error Patterns
"Should throw [error type] when [invalid condition]"
"Should display [error message] when [failure condition]"
"Should reject [action] when [unauthorized]"

// Edge Case Patterns
"Should handle [edge case] gracefully"
"Should prevent [action] when [boundary condition]"
"Should allow [action] up to [limit]"

// State Patterns
"Should transition from [state A] to [state B] when [action]"
"Should remain in [state] when [invalid action]"
"Should revert to [state] when [error occurs]"
```

### Automated Scenario Generation

Use this algorithm to generate comprehensive scenarios:

```
FOR each feature:
  FOR each user type:
    FOR each action:
      Generate happy path test
      Generate sad path tests (all error conditions)
      Generate edge case tests (boundary conditions)
      Generate accessibility test
      Generate performance test (if applicable)
```

**Example Output**:

```javascript
// Feature: Add to Cart
// User Type: Registered User
// Action: Click "Add to Cart" button

// Generated Tests:

// Happy Path
✓ Should add item to cart successfully when button clicked

// Sad Paths
✓ Should show error when item is out of stock
✓ Should show error when API fails
✓ Should show error when user exceeds cart limit

// Edge Cases
✓ Should handle rapid clicks correctly
✓ Should handle quantity = 0
✓ Should handle quantity = 99
✓ Should handle duplicate add attempts

// Accessibility
✓ Should be keyboard accessible
✓ Should announce cart update to screen reader

// Performance
✓ Should complete add in < 500ms
✓ Should update UI optimistically
```

---

## Writing Test Code

### Code Structure Template

Every test should follow this structure:

```javascript
describe('[Category]: [Feature/Component Name]', () => {
  // Setup: Runs before each test
  beforeEach(() => {
    // Initialize test environment
    // Create test data
    // Set up mocks/stubs
  });
  
  // Teardown: Runs after each test
  afterEach(() => {
    // Clean up test data
    // Reset mocks
    // Clear state
  });
  
  describe('[Sub-feature or Scenario]', () => {
    it('should [expected behavior] when [condition]', () => {
      // ARRANGE: Set up test data and preconditions
      const testData = createTestData();
      
      // ACT: Execute the action being tested
      const result = performAction(testData);
      
      // ASSERT: Verify the outcome
      expect(result).toBe(expectedValue);
    });
  });
});
```

### Test Writing Guidelines

#### 1. Use Descriptive Names

```javascript
// ❌ BAD: Vague
it('test1', () => {});
it('should work', () => {});
it('adds item', () => {});

// ✅ GOOD: Descriptive
it('should add item to cart when user clicks Add to Cart button', () => {});
it('should display error message when email format is invalid', () => {});
it('should redirect to login page when user is not authenticated', () => {});
```

#### 2. One Assertion Per Test (When Possible)

```javascript
// ❌ BAD: Multiple unrelated assertions
it('should handle user registration', () => {
  const user = registerUser(data);
  expect(user.id).toBeDefined();
  expect(user.email).toBe(data.email);
  expect(getUsers()).toHaveLength(1);
  expect(emailWasSent()).toBe(true);
});

// ✅ GOOD: Focused assertions
it('should assign ID to newly registered user', () => {
  const user = registerUser(data);
  expect(user.id).toBeDefined();
});

it('should save user email correctly', () => {
  const user = registerUser(data);
  expect(user.email).toBe(data.email);
});

it('should send confirmation email after registration', () => {
  registerUser(data);
  expect(emailWasSent()).toBe(true);
});
```

#### 3. Use Realistic Test Data

```javascript
// ❌ BAD: Unrealistic data
const user = { name: 'foo', email: 'test@test.com', age: 1 };

// ✅ GOOD: Realistic data
import { faker } from '@faker-js/faker';

const user = {
  name: faker.person.fullName(), // "Sarah Johnson"
  email: faker.internet.email(), // "sarah.johnson@example.com"
  age: faker.number.int({ min: 18, max: 80 }), // 42
  address: {
    street: faker.location.streetAddress(), // "123 Main St"
    city: faker.location.city(), // "Portland"
    state: faker.location.state(), // "Oregon"
    zip: faker.location.zipCode() // "97201"
  }
};
```

#### 4. Follow AAA Pattern Consistently

```javascript
it('should calculate total price with discount applied', () => {
  // ARRANGE
  const items = [
    { name: 'Item 1', price: 100, quantity: 2 },
    { name: 'Item 2', price: 50, quantity: 1 }
  ];
  const discountPercent = 10; // 10% discount
  const expectedTotal = 225; // (100*2 + 50*1) * 0.9
  
  // ACT
  const actualTotal = calculateTotal(items, discountPercent);
  
  // ASSERT
  expect(actualTotal).toBe(expectedTotal);
});
```

#### 5. Use Helper Functions for Common Operations

```javascript
// tests/helpers/cart.helpers.js
export const addItemToCart = async (productId, quantity = 1) => {
  const response = await request(app)
    .post('/api/cart/items')
    .send({ product_id: productId, quantity })
    .set('Authorization', `Bearer ${authToken}`);
  return response.body;
};

export const getCartContents = async () => {
  const response = await request(app)
    .get('/api/cart')
    .set('Authorization', `Bearer ${authToken}`);
  return response.body;
};

// Usage in tests
it('should add item to cart', async () => {
  // ARRANGE
  const product = await createTestProduct();
  
  // ACT
  await addItemToCart(product.id, 2);
  
  // ASSERT
  const cart = await getCartContents();
  expect(cart.items).toHaveLength(1);
  expect(cart.items[0].quantity).toBe(2);
});
```

---

## Test Category Templates

### 1. User Flow Test Template

```javascript
describe('User Flow: [Complete User Journey]', () => {
  it('should allow user to [complete goal] successfully', async () => {
    // ARRANGE: Set up initial state
    const user = await createTestUser();
    const requiredData = await seedRequiredData();
    
    // ACT: Execute complete flow (multiple steps)
    // Step 1: [First action]
    await performStep1(user);
    expect(await verifyStep1Complete()).toBe(true);
    
    // Step 2: [Second action]
    await performStep2(user);
    expect(await verifyStep2Complete()).toBe(true);
    
    // Step 3: [Third action]
    await performStep3(user);
    
    // ASSERT: Verify final outcome
    expect(await getFinalState(user)).toMatchObject({
      status: 'complete',
      data: expectedData
    });
    
    // Verify side effects
    expect(await databaseWasUpdated()).toBe(true);
    expect(await emailWasSent()).toBe(true);
  });
});
```

### 2. Integration Test Template

```javascript
describe('Integration: [Component A] with [Component B]', () => {
  beforeEach(async () => {
    await setupTestDatabase();
  });
  
  afterEach(async () => {
    await teardownTestDatabase();
  });
  
  it('should [expected outcome] when [action]', async () => {
    // ARRANGE
    const inputData = createTestData();
    
    // ACT
    const response = await request(app)
      .post('/api/endpoint')
      .send(inputData)
      .expect(201);
    
    // ASSERT: Verify API response
    expect(response.body).toMatchObject({
      id: expect.any(Number),
      ...inputData,
      createdAt: expect.any(String)
    });
    
    // Verify database state
    const dbRecord = await db.findById(response.body.id);
    expect(dbRecord).toMatchObject(inputData);
  });
});
```

### 3. Edge Case Test Template

```javascript
describe('Edge Cases: [Feature Name]', () => {
  describe('Boundary Conditions', () => {
    it('should handle minimum value', () => {
      const result = performAction(MIN_VALUE);
      expect(result).toBeDefined();
    });
    
    it('should handle maximum value', () => {
      const result = performAction(MAX_VALUE);
      expect(result).toBeDefined();
    });
    
    it('should reject below minimum', () => {
      expect(() => performAction(MIN_VALUE - 1))
        .toThrow('Value below minimum');
    });
    
    it('should reject above maximum', () => {
      expect(() => performAction(MAX_VALUE + 1))
        .toThrow('Value above maximum');
    });
  });
  
  describe('Empty/Null Handling', () => {
    it('should handle empty string', () => {
      const result = performAction('');
      expect(result.error).toBeDefined();
    });
    
    it('should handle null', () => {
      const result = performAction(null);
      expect(result.error).toBeDefined();
    });
    
    it('should handle undefined', () => {
      const result = performAction(undefined);
      expect(result.error).toBeDefined();
    });
  });
});
```

### 4. Accessibility Test Template

```javascript
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import userEvent from '@testing-library/user-event';

expect.extend(toHaveNoViolations);

describe('Accessibility: [Component Name]', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<Component />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should be keyboard navigable', () => {
    render(<Component />);
    
    const interactiveElements = screen.getAllByRole(/(button|link|textbox)/i);
    
    interactiveElements.forEach(element => {
      userEvent.tab();
      expect(element).toHaveFocus();
    });
  });
  
  it('should have proper ARIA labels', () => {
    render(<Component />);
    
    expect(screen.getByRole('button')).toHaveAttribute('aria-label');
    expect(screen.getByRole('navigation')).toHaveAttribute('aria-label');
  });
  
  it('should announce changes to screen readers', async () => {
    render(<Component />);
    
    userEvent.click(screen.getByRole('button'));
    
    const announcement = await screen.findByRole('status');
    expect(announcement).toHaveTextContent(/success/i);
  });
});
```

### 5. Performance Test Template

```javascript
describe('Performance: [Feature Name]', () => {
  it('should complete within acceptable time', async () => {
    const startTime = Date.now();
    
    await performExpensiveOperation();
    
    const duration = Date.now() - startTime;
    expect(duration).toBeLessThan(500); // 500ms threshold
  });
  
  it('should handle large datasets efficiently', async () => {
    const largeDataset = Array.from({ length: 10000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
      price: Math.random() * 100
    }));
    
    const startTime = Date.now();
    const result = await processData(largeDataset);
    const duration = Date.now() - startTime;
    
    expect(result).toHaveLength(10000);
    expect(duration).toBeLessThan(2000); // 2s for 10k items
  });
});
```

---

## Common Patterns & Examples

### Pattern 1: CRUD Operations

```javascript
describe('CRUD: Product Management', () => {
  describe('CREATE', () => {
    it('should create product with valid data', async () => {
      const productData = {
        name: 'Test Product',
        price: 29.99,
        category: 'Electronics'
      };
      
      const product = await createProduct(productData);
      
      expect(product).toMatchObject({
        id: expect.any(Number),
        ...productData
      });
    });
    
    it('should reject product with missing name', async () => {
      const productData = { price: 29.99 };
      
      await expect(createProduct(productData))
        .rejects.toThrow('Name is required');
    });
  });
  
  describe('READ', () => {
    it('should retrieve product by ID', async () => {
      const created = await createProduct({ name: 'Test', price: 10 });
      
      const retrieved = await getProduct(created.id);
      
      expect(retrieved).toMatchObject(created);
    });
    
    it('should return 404 for non-existent product', async () => {
      await expect(getProduct(99999))
        .rejects.toThrow('Product not found');
    });
  });
  
  describe('UPDATE', () => {
    it('should update product with valid data', async () => {
      const product = await createProduct({ name: 'Original', price: 10 });
      
      const updated = await updateProduct(product.id, { name: 'Updated' });
      
      expect(updated.name).toBe('Updated');
      expect(updated.price).toBe(10); // Unchanged
    });
  });
  
  describe('DELETE', () => {
    it('should delete product by ID', async () => {
      const product = await createProduct({ name: 'Test', price: 10 });
      
      await deleteProduct(product.id);
      
      await expect(getProduct(product.id))
        .rejects.toThrow('Product not found');
    });
  });
});
```

### Pattern 2: Authentication & Authorization

```javascript
describe('Authentication: User Access', () => {
  describe('Login', () => {
    it('should authenticate user with valid credentials', async () => {
      const user = await createUser({ 
        email: 'test@example.com', 
        password: 'SecurePass123' 
      });
      
      const result = await login('test@example.com', 'SecurePass123');
      
      expect(result.token).toBeDefined();
      expect(result.user).toMatchObject({ id: user.id, email: user.email });
    });
    
    it('should reject invalid credentials', async () => {
      await createUser({ email: 'test@example.com', password: 'SecurePass123' });
      
      await expect(login('test@example.com', 'WrongPassword'))
        .rejects.toThrow('Invalid credentials');
    });
  });
  
  describe('Authorization', () => {
    it('should allow access to authenticated user', async () => {
      const user = await createUser();
      const token = generateToken(user);
      
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      
      expect(response.body).toBeDefined();
    });
    
    it('should deny access without token', async () => {
      await request(app)
        .get('/api/protected')
        .expect(401);
    });
    
    it('should deny access with invalid token', async () => {
      await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);
    });
  });
});
```

### Pattern 3: Form Validation

```javascript
describe('Validation: Registration Form', () => {
  describe('Email Field', () => {
    it('should accept valid email', () => {
      expect(validateEmail('user@example.com')).toBe(true);
    });
    
    it('should reject invalid email format', () => {
      expect(validateEmail('notanemail')).toBe(false);
      expect(validateEmail('@example.com')).toBe(false);
      expect(validateEmail('user@')).toBe(false);
    });
    
    it('should reject empty email', () => {
      expect(validateEmail('')).toBe(false);
    });
  });
  
  describe('Password Field', () => {
    it('should accept strong password', () => {
      expect(validatePassword('StrongP@ss123')).toBe(true);
    });
    
    it('should reject short password', () => {
      expect(validatePassword('Short1!')).toBe(false);
    });
    
    it('should reject password without number', () => {
      expect(validatePassword('NoNumberPass!')).toBe(false);
    });
    
    it('should reject password without special character', () => {
      expect(validatePassword('NoSpecialChar123')).toBe(false);
    });
  });
});
```

---

## AI Prompts for Test Generation

Use these prompts when asking AI to generate tests:

### Prompt 1: Initial Test Suite Generation

```
I need you to generate comprehensive tests for [feature name].

Context:
- Feature: [brief description]
- User goal: [what users want to accomplish]
- Technology stack: [React/Node.js/etc]
- Testing framework: [Jest/Cypress/etc]

Requirements:
1. Generate tests for all 7 categories:
   - User Flow Tests
   - Component Integration Tests
   - Edge Case & Boundary Tests
   - Accessibility Tests
   - Scrolling & UI Behavior Tests
   - Unit Tests
   - Real User Scenario Tests

2. For each category, include:
   - Happy path scenarios
   - Error handling scenarios
   - Edge cases
   - Accessibility considerations

3. Use realistic test data (not "foo", "bar")
4. Follow AAA pattern (Arrange, Act, Assert)
5. Use descriptive test names

Please start with User Flow tests as the highest priority.
```

### Prompt 2: Test from User Story

```
Generate tests based on this user story:

"As a [user type], I want [goal], so that [benefit]"

Please create:
1. A test plan outlining what will be tested
2. Test cases for:
   - Happy path (everything works)
   - Error paths (things go wrong)
   - Edge cases (unusual but valid scenarios)
   - Accessibility (keyboard, screen reader)
   - Performance (if applicable)

Use [testing framework] and follow best practices.
```

### Prompt 3: Test from Bug Report

```
A bug was reported with the following details:

Bug: [description]
Steps to Reproduce: [steps]
Expected: [expected behavior]
Actual: [actual behavior]

Please generate:
1. A test that reproduces this bug
2. Additional tests for related scenarios
3. Suggestions for preventing similar bugs

Use [testing framework].
```

### Prompt 4: Edge Case Generation

```
Generate comprehensive edge case tests for: [feature]

Consider:
- Boundary values (min/max, 0, negative)
- Empty/null/undefined inputs
- Special characters and Unicode
- Concurrent operations
- Network failures
- Performance under load
- Security vulnerabilities (XSS, SQL injection)

For each edge case:
1. Describe the scenario
2. Expected behavior
3. Test code

Use realistic scenarios and [testing framework].
```

### Prompt 5: Accessibility Test Generation

```
Generate accessibility tests for: [component/feature]

Requirements:
1. No automatic accessibility violations (use jest-axe)
2. Full keyboard navigation
3. Proper ARIA labels and roles
4. Screen reader compatibility
5. Focus management
6. Color contrast compliance (WCAG AA)
7. Responsive design considerations

For each test:
- Clear test name
- Specific accessibility criterion being tested
- Expected behavior

Use @testing-library/react and jest-axe.
```

---

## Quality Checklist

Before submitting generated tests, verify:

### Test Coverage

- [ ] All user flows are covered
- [ ] All API endpoints have integration tests
- [ ] All utility functions have unit tests
- [ ] Edge cases are tested
- [ ] Error handling is tested
- [ ] Accessibility is tested
- [ ] Performance-critical paths are tested

### Test Quality

- [ ] Tests follow AAA pattern
- [ ] Test names are descriptive ("should...when...")
- [ ] One assertion per test (when feasible)
- [ ] Tests use realistic data
- [ ] Tests are independent (no shared state)
- [ ] Tests are deterministic (no randomness)
- [ ] No hardcoded waits/sleeps
- [ ] Proper async/await usage

### Code Quality

- [ ] Tests are well-organized (describe blocks)
- [ ] Helper functions for repeated operations
- [ ] Test data factories for common objects
- [ ] Proper setup and teardown
- [ ] No commented-out code
- [ ] No console.log statements
- [ ] Meaningful variable names

### Documentation

- [ ] Complex test logic is commented
- [ ] Test plan is documented
- [ ] Assumptions are stated
- [ ] Edge cases are explained
- [ ] Test data is documented

### Integration

- [ ] Tests run successfully
- [ ] Tests pass in CI/CD
- [ ] Coverage meets thresholds
- [ ] No flaky tests
- [ ] Fast execution time

---

## Summary

As an AI test generator, your role is to:

1. **Analyze** requirements thoroughly from all available sources
2. **Think** like a user, QA engineer, and developer simultaneously
3. **Generate** comprehensive test scenarios covering all categories
4. **Write** clear, maintainable test code following best practices
5. **Verify** tests are realistic, valuable, and comprehensive

**Key Principles**:
- Tests should be easy to understand
- Tests should fail for the right reasons
- Tests should use realistic data
- Tests should be independent
- Tests should provide fast feedback

**Quality Metrics**:
- 80%+ code coverage
- All critical user flows tested
- All edge cases covered
- Zero accessibility violations
- Fast execution (< 2 minutes)

Use this guide as your reference for every test generation task. When in doubt, think: "Would a human QA engineer write this test?"

---

*This guide works in conjunction with TESTING_STRATEGY_TEMPLATE.md and TOKEN_EFFICIENT_KICKOFF.md to provide complete testing coverage for software projects.*
