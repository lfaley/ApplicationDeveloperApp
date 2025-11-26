# Testing Standards - Generic Best Practices
## Universal Testing Patterns for Any Project

**Version:** 1.0  
**Updated:** November 2024  
**Purpose:** Provide generic, reusable testing standards applicable to any codebase  
**Framework-Agnostic:** Works with Jest, Vitest, Cypress, Playwright, Testing Library, etc.

---

## Table of Contents

1. [Core Testing Principles](#core-testing-principles)
2. [Service Mocking Standard](#service-mocking-standard)
3. [Helper Function Patterns](#helper-function-patterns)
4. [Simplified Testing Approach](#simplified-testing-approach)
5. [Test Organization](#test-organization)
6. [Factory Pattern for Mock Data](#factory-pattern-for-mock-data)
7. [Common Test Scenarios](#common-test-scenarios)
8. [Anti-Patterns to Avoid](#anti-patterns-to-avoid)

---

## Core Testing Principles

### The Golden Rules

1. **Mock External Dependencies, Use Real Components**
   - ✅ Mock: APIs, browser APIs, third-party services
   - ❌ Don't Mock: Your own components, UI elements, business logic

2. **Test Behavior, Not Implementation**
   - Focus on what users see and do
   - Don't test internal state or private methods
   - Test outcomes, not how code achieves them

3. **Prioritize Fast, Deterministic Tests**
   - No network calls (mock APIs)
   - No timers (use fake timers)
   - No randomness (use fixed seeds/mocks)

4. **Keep Tests Simple and Focused**
   - One concept per test
   - Clear test names describing expected behavior
   - Easy to understand what failed when tests break

### Test Pyramid (Target Distribution)

```
        /\
       /  \        10% - E2E Tests (Critical paths only)
      /____\       
     /      \      
    /        \     20% - Integration Tests (Feature workflows)
   /__________\    
  /            \   
 /              \  70% - Unit Tests (Business logic, utilities)
/________________\ 
```

---

## Service Mocking Standard

### Pattern: Mock External Services

```typescript
// test-utils/service-mocks.ts
import { vi } from 'vitest'; // or jest.fn() for Jest

/**
 * Mock AI/LLM API calls
 * Adapt function names and return values for your AI service
 */
export const mockAiService = () => {
  vi.mock('@/lib/aiService', () => ({
    // Generic content generation
    generateContent: vi.fn().mockResolvedValue({
      id: 'generated-123',
      content: 'Mock AI-generated content',
      metadata: { tokensUsed: 150, model: 'mock-model' },
    }),
    
    // Chat completions
    chatComplete: vi.fn().mockResolvedValue({
      response: 'Mock AI response',
      conversationId: 'conv-123',
      tokensUsed: 50,
    }),
    
    // Analysis/classification
    analyze: vi.fn().mockResolvedValue({
      analysis: { sentiment: 'positive', confidence: 0.95 },
      suggestions: ['suggestion 1', 'suggestion 2'],
    }),
  }));
};

/**
 * Mock toast/notification libraries
 * Returns silent stubs that don't render or show notifications
 */
export const mockToast = () => {
  // For sonner
  vi.mock('sonner', () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      promise: vi.fn().mockResolvedValue(undefined),
    },
    Toaster: () => null, // Don't render toaster in tests
  }));
  
  // For react-hot-toast
  vi.mock('react-hot-toast', () => ({
    default: {
      success: vi.fn(),
      error: vi.fn(),
      loading: vi.fn(),
    },
    Toaster: () => null,
  }));
};

/**
 * Mock analytics/tracking services
 */
export const mockAnalytics = () => {
  vi.mock('@/lib/analytics', () => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    identifyUser: vi.fn(),
    trackConversion: vi.fn(),
  }));
};

/**
 * Mock payment services (Stripe, PayPal, etc.)
 */
export const mockPaymentService = () => {
  vi.mock('@stripe/stripe-js', () => ({
    loadStripe: vi.fn().mockResolvedValue({
      confirmPayment: vi.fn().mockResolvedValue({
        paymentIntent: { status: 'succeeded', id: 'pi_mock123' },
      }),
      createToken: vi.fn().mockResolvedValue({
        token: { id: 'tok_mock123', card: { last4: '4242' } },
      }),
      createPaymentMethod: vi.fn().mockResolvedValue({
        paymentMethod: { id: 'pm_mock123' },
      }),
    }),
  }));
};

/**
 * Mock file upload services
 */
export const mockFileUpload = () => {
  vi.mock('@/lib/uploadService', () => ({
    uploadFile: vi.fn().mockResolvedValue({
      url: 'https://mock-cdn.example.com/file.jpg',
      size: 2048576, // 2MB
      name: 'test-file.jpg',
      type: 'image/jpeg',
    }),
    deleteFile: vi.fn().mockResolvedValue({ success: true }),
  }));
};

/**
 * Mock email service
 */
export const mockEmailService = () => {
  vi.mock('@/lib/emailService', () => ({
    sendEmail: vi.fn().mockResolvedValue({
      messageId: 'msg-123',
      sent: true,
    }),
  }));
};

/**
 * Setup all common service mocks at once
 * Call this in your test setup file
 */
export const setupAllServiceMocks = () => {
  mockToast();
  mockAnalytics();
};
```

### Pattern: Mock Browser APIs

```typescript
// test-utils/browser-mocks.ts

/**
 * Mock localStorage with in-memory implementation
 */
export const mockLocalStorage = () => {
  const store: Record<string, string> = {};

  const localStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index: number) => Object.keys(store)[index] || null,
  };

  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  return localStorageMock;
};

/**
 * Mock sessionStorage (same pattern as localStorage)
 */
export const mockSessionStorage = () => {
  const store: Record<string, string> = {};

  const sessionStorageMock = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      Object.keys(store).forEach(key => delete store[key]);
    },
  };

  Object.defineProperty(window, 'sessionStorage', {
    value: sessionStorageMock,
    writable: true,
  });

  return sessionStorageMock;
};

/**
 * Mock window.matchMedia for responsive design tests
 */
export const mockMatchMedia = (matches = false) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  });
};

/**
 * Mock IntersectionObserver for lazy loading/infinite scroll
 */
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe = vi.fn();
    disconnect = vi.fn();
    unobserve = vi.fn();
    takeRecords = vi.fn();
    
    // Helper to trigger intersection in tests
    triggerIntersection(entries: Partial<IntersectionObserverEntry>[]) {
      this.callback(entries as IntersectionObserverEntry[], this);
    }
  } as any;
};

/**
 * Mock scroll functions
 */
export const mockScrollFunctions = () => {
  window.scrollTo = vi.fn();
  Element.prototype.scrollIntoView = vi.fn();
  Element.prototype.scroll = vi.fn();
};

/**
 * Mock ResizeObserver for responsive components
 */
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  } as any;
};

/**
 * Setup all browser API mocks at once
 */
export const setupBrowserMocks = () => {
  mockLocalStorage();
  mockSessionStorage();
  mockMatchMedia();
  mockIntersectionObserver();
  mockScrollFunctions();
  mockResizeObserver();
};
```

---

## Helper Function Patterns

### Core Test Helpers

```typescript
// test-utils/test-helpers.ts
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

/**
 * Render component with all providers
 * Customize this for your app's provider structure
 */
export const renderApp = (component: React.ReactElement, options = {}) => {
  // Example with React Query
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,        // Don't retry in tests
        cacheTime: 0,        // Don't cache between tests
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  // Example with Router
  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {/* Add your context providers here */}
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(component, { wrapper: AllProviders, ...options }),
    queryClient, // Return for custom assertions if needed
  };
};

/**
 * Wait for all loading states to complete
 * Customize loading indicators for your app
 */
export const waitForLoadingToFinish = async (timeout = 3000) => {
  await waitFor(
    () => {
      // Common loading indicators
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
      expect(screen.queryByTestId('skeleton')).not.toBeInTheDocument();
      
      // Add your app-specific loading indicators:
      // expect(screen.queryByTestId('your-loader')).not.toBeInTheDocument();
    },
    { timeout }
  );
};

/**
 * Generic function to populate data source with test data
 * Works with localStorage, sessionStorage, or any storage mechanism
 */
export const setupMockData = <T>(
  key: string,
  data: T[],
  storage: Storage = localStorage
): T[] => {
  storage.setItem(key, JSON.stringify(data));
  return data;
};

/**
 * Clear all test data
 * Call in afterEach to prevent test pollution
 */
export const cleanupTestData = () => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
  // Clear any other state management (Redux, Zustand, etc.)
};

/**
 * Generic form filling helper
 * Automatically finds inputs by label, placeholder, or test-id
 */
export const fillForm = async (formData: Record<string, any>) => {
  const user = userEvent.setup();
  
  for (const [fieldName, value] of Object.entries(formData)) {
    if (value === undefined || value === null) continue;
    
    // Try multiple strategies to find the input
    const input = 
      screen.queryByLabelText(new RegExp(fieldName, 'i')) ||
      screen.queryByPlaceholderText(new RegExp(fieldName, 'i')) ||
      screen.queryByTestId(fieldName) ||
      screen.queryByRole('textbox', { name: new RegExp(fieldName, 'i') });
    
    if (input) {
      // Handle different input types
      const inputType = input.getAttribute('type');
      
      if (inputType === 'checkbox' || inputType === 'radio') {
        if (value) await user.click(input);
      } else if (input.tagName === 'SELECT') {
        await user.selectOptions(input, value);
      } else {
        await user.clear(input);
        await user.type(input, value.toString());
      }
    }
  }
};

/**
 * Wait for element and click it
 * Combines findBy + click for convenience
 */
export const waitAndClick = async (
  text: string | RegExp,
  role: string = 'button'
) => {
  const user = userEvent.setup();
  const element = await screen.findByRole(role, { name: text });
  await user.click(element);
};

/**
 * Create mock file for upload testing
 */
export const createMockFile = (
  name: string,
  size: number,
  type: string
): File => {
  const content = new Array(size).fill('a').join('');
  return new File([content], name, { type });
};

/**
 * Trigger file input change
 */
export const uploadFile = async (input: HTMLElement, file: File) => {
  const user = userEvent.setup();
  await user.upload(input, file);
};
```

---

## Factory Pattern for Mock Data

### Generic Factory Template

```typescript
// test-utils/factories.ts

/**
 * Generic factory pattern for creating mock objects
 * Replace [Entity] with your actual type (User, Product, Order, etc.)
 */
export const createMock[Entity] = (overrides?: Partial<[Entity]>): [Entity] => {
  const id = overrides?.id || `[entity]-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    // Common fields
    name: overrides?.name || 'Mock [Entity]',
    description: overrides?.description || 'Mock description for testing',
    status: overrides?.status || 'active',
    
    // Timestamps
    createdAt: overrides?.createdAt || new Date().toISOString(),
    updatedAt: overrides?.updatedAt || new Date().toISOString(),
    
    // Domain-specific fields - customize for your entity:
    // price: overrides?.price || 99.99,
    // quantity: overrides?.quantity || 10,
    // category: overrides?.category || 'default',
    // tags: overrides?.tags || [],
    // imageUrl: overrides?.imageUrl || `https://example.com/${id}.jpg`,
    
    // Merge any additional overrides
    ...overrides,
  };
};

/**
 * Create multiple mock entities at once
 */
export const createMock[Entity]List = (
  count: number,
  overridesFn?: (index: number) => Partial<[Entity]>
): [Entity][] => {
  return Array.from({ length: count }, (_, index) => 
    createMock[Entity](overridesFn?.(index))
  );
};

/**
 * Example: User factory
 */
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: overrides?.id || `user-${Math.random().toString(36).substr(2, 9)}`,
  email: overrides?.email || `test-${Date.now()}@example.com`,
  name: overrides?.name || 'Test User',
  avatar: overrides?.avatar || 'https://example.com/avatar.jpg',
  role: overrides?.role || 'user',
  isActive: overrides?.isActive ?? true,
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});

/**
 * Example: Product factory
 */
export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: overrides?.id || `product-${Math.random().toString(36).substr(2, 9)}`,
  name: overrides?.name || 'Mock Product',
  description: overrides?.description || 'A great test product',
  price: overrides?.price || 99.99,
  quantity: overrides?.quantity || 100,
  category: overrides?.category || 'electronics',
  imageUrl: overrides?.imageUrl || 'https://example.com/product.jpg',
  inStock: overrides?.inStock ?? true,
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});
```

### Setup Helpers with Factories

```typescript
// test-utils/setup-helpers.ts

/**
 * Setup mock entities in localStorage
 * Generic version - adapt for your entities
 */
export const setupMock[Entity] = (entities?: [Entity][]): [Entity][] => {
  const defaultEntities = entities || [
    createMock[Entity]({ id: '1', name: '[Entity] One', status: 'active' }),
    createMock[Entity]({ id: '2', name: '[Entity] Two', status: 'pending' }),
    createMock[Entity]({ id: '3', name: '[Entity] Three', status: 'completed' }),
  ];

  localStorage.setItem('[entityKey]', JSON.stringify(defaultEntities));
  return defaultEntities;
};

/**
 * Setup mock users
 */
export const setupMockUsers = (users?: User[]): User[] => {
  const defaultUsers = users || [
    createMockUser({ id: '1', name: 'John Doe', role: 'admin' }),
    createMockUser({ id: '2', name: 'Jane Smith', role: 'user' }),
  ];

  localStorage.setItem('users', JSON.stringify(defaultUsers));
  return defaultUsers;
};

/**
 * Setup mock products
 */
export const setupMockProducts = (products?: Product[]): Product[] => {
  const defaultProducts = products || [
    createMockProduct({ id: '1', name: 'Laptop', price: 999.99, category: 'electronics' }),
    createMockProduct({ id: '2', name: 'Mouse', price: 29.99, category: 'accessories' }),
    createMockProduct({ id: '3', name: 'Keyboard', price: 79.99, category: 'accessories' }),
  ];

  localStorage.setItem('products', JSON.stringify(defaultProducts));
  return defaultProducts;
};
```

---

## Simplified Testing Approach

### Focus on Testable Behavior

**✅ DO Test (High Value, Low Mocking):**

1. **App Structure and Navigation**
   - Routes render correctly
   - Navigation links work
   - Page layout appears as expected
   - Navigation state persists

2. **Data Display from Storage/State**
   - Entities render with correct data
   - Empty states show appropriate messages
   - Loading states display correctly
   - Data formatting is correct (dates, currency, etc.)

3. **Search and Filter Functionality**
   - Text search filters correctly
   - Dropdown/select filters work
   - Multiple filters combine correctly
   - Clear/reset filters work

4. **Data Persistence**
   - CRUD operations update data source
   - Optimistic updates work
   - Error handling on save failures
   - Data synchronizes correctly

5. **Tab Switching and Routing**
   - Tab state persists
   - Correct content per tab
   - URL updates with tabs (if applicable)

6. **Form Validation and Error States**
   - Required fields validate
   - Format validation works (email, phone, etc.)
   - Custom business rules enforce
   - Error messages display correctly

7. **Loading and Error States**
   - Loading indicators show/hide correctly
   - Error messages display appropriately
   - Retry mechanisms work
   - Graceful degradation

8. **Accessibility**
   - ARIA labels present
   - Keyboard navigation works
   - Focus management correct
   - Screen reader compatibility

**❌ AVOID Testing (Complex, High Mocking Overhead):**

1. **Complex Multi-Step Dialogs**
   - Requires extensive provider mocking
   - Many external dependencies
   - Better suited for E2E tests

2. **Multi-Step Wizards with External Services**
   - Too many moving parts
   - Hard to isolate failures
   - Integration/E2E tests more appropriate

3. **Real-Time Features**
   - WebSocket mocking is complex
   - Server-Sent Events hard to simulate
   - Polling creates timing issues

4. **Third-Party Component Internals**
   - Not your code to test
   - Vendor's responsibility
   - Test your integration, not their implementation

5. **Animations and Visual Transitions**
   - Visual behavior, hard to assert
   - Better for visual regression testing
   - E2E tests can verify visible effects

6. **Complex Drag-and-Drop**
   - Requires extensive event simulation
   - Timing-sensitive
   - Better for E2E tests

---

## Common Test Scenarios

### Scenario 1: Data Display Test

```typescript
describe('Display [Entity] List', () => {
  beforeEach(() => {
    cleanupTestData();
    setupMock[Entity]();
  });

  it('displays all entities from data source', async () => {
    renderApp(<[Entity]List />);
    await waitForLoadingToFinish();

    expect(screen.getByText('[Entity] One')).toBeInTheDocument();
    expect(screen.getByText('[Entity] Two')).toBeInTheDocument();
    expect(screen.getByText('[Entity] Three')).toBeInTheDocument();
  });

  it('displays empty state when no entities exist', async () => {
    localStorage.clear();
    renderApp(<[Entity]List />);
    await waitForLoadingToFinish();

    expect(screen.getByText(/no [entities] found/i)).toBeInTheDocument();
  });
});
```

### Scenario 2: Search/Filter Test

```typescript
describe('[Entity] Search and Filter', () => {
  beforeEach(() => {
    setupMock[Entity]();
  });

  it('filters entities by search term', async () => {
    renderApp(<[Entity]List />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/search/i), 'one');

    expect(screen.getByText('[Entity] One')).toBeInTheDocument();
    expect(screen.queryByText('[Entity] Two')).not.toBeInTheDocument();
    expect(screen.queryByText('[Entity] Three')).not.toBeInTheDocument();
  });

  it('filters entities by status', async () => {
    renderApp(<[Entity]List />);
    const user = userEvent.setup();

    await user.selectOptions(screen.getByLabelText(/status/i), 'active');

    expect(screen.getByText('[Entity] One')).toBeInTheDocument();
    expect(screen.queryByText('[Entity] Two')).not.toBeInTheDocument();
  });

  it('clears all filters', async () => {
    renderApp(<[Entity]List />);
    const user = userEvent.setup();

    // Apply filters
    await user.type(screen.getByPlaceholderText(/search/i), 'one');
    await user.selectOptions(screen.getByLabelText(/status/i), 'active');

    // Clear filters
    await user.click(screen.getByRole('button', { name: /clear filters/i }));

    // All entities should be visible again
    expect(screen.getByText('[Entity] One')).toBeInTheDocument();
    expect(screen.getByText('[Entity] Two')).toBeInTheDocument();
    expect(screen.getByText('[Entity] Three')).toBeInTheDocument();
  });
});
```

### Scenario 3: Data Persistence Test

```typescript
describe('[Entity] CRUD Operations', () => {
  beforeEach(() => {
    cleanupTestData();
  });

  it('creates new entity and persists to storage', async () => {
    renderApp(<Create[Entity] />);
    const user = userEvent.setup();

    // Fill form
    await fillForm({
      name: 'New Entity',
      description: 'Test description',
      status: 'active',
    });

    // Submit
    await user.click(screen.getByRole('button', { name: /save|create/i }));

    // Verify persistence
    const stored = JSON.parse(localStorage.getItem('[entityKey]') || '[]');
    expect(stored).toContainEqual(
      expect.objectContaining({
        name: 'New Entity',
        description: 'Test description',
        status: 'active',
      })
    );
  });

  it('updates existing entity', async () => {
    const entities = setupMock[Entity]();
    renderApp(<Edit[Entity] id={entities[0].id} />);
    const user = userEvent.setup();

    // Update name
    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Name');

    // Submit
    await user.click(screen.getByRole('button', { name: /save|update/i }));

    // Verify update
    const stored = JSON.parse(localStorage.getItem('[entityKey]') || '[]');
    const updated = stored.find((e: any) => e.id === entities[0].id);
    expect(updated.name).toBe('Updated Name');
  });

  it('deletes entity', async () => {
    const entities = setupMock[Entity]();
    renderApp(<[Entity]List />);
    const user = userEvent.setup();

    // Click delete on first entity
    const deleteButtons = screen.getAllByRole('button', { name: /delete/i });
    await user.click(deleteButtons[0]);

    // Confirm deletion (if confirmation dialog exists)
    if (screen.queryByRole('button', { name: /confirm/i })) {
      await user.click(screen.getByRole('button', { name: /confirm/i }));
    }

    // Verify deletion
    const stored = JSON.parse(localStorage.getItem('[entityKey]') || '[]');
    expect(stored).toHaveLength(entities.length - 1);
    expect(stored.find((e: any) => e.id === entities[0].id)).toBeUndefined();
  });
});
```

### Scenario 4: Form Validation Test

```typescript
describe('[Entity] Form Validation', () => {
  it('validates required fields', async () => {
    renderApp(<Create[Entity] />);
    const user = userEvent.setup();

    // Try to submit without filling required fields
    await user.click(screen.getByRole('button', { name: /save|create/i }));

    // Verify error messages
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/description is required/i)).toBeInTheDocument();
  });

  it('validates email format', async () => {
    renderApp(<Create[Entity] />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), 'invalid-email');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('validates custom business rules', async () => {
    renderApp(<Create[Entity] />);
    const user = userEvent.setup();

    // Example: Price must be positive
    await user.type(screen.getByLabelText(/price/i), '-10');
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(screen.getByText(/price must be positive/i)).toBeInTheDocument();
  });

  it('clears validation errors when input is corrected', async () => {
    renderApp(<Create[Entity] />);
    const user = userEvent.setup();

    // Trigger validation error
    await user.click(screen.getByRole('button', { name: /save/i }));
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();

    // Fix the error
    await user.type(screen.getByLabelText(/name/i), 'Valid Name');

    // Error should clear
    expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
  });
});
```

### Scenario 5: Navigation and Tab Switching Test

```typescript
describe('Navigation and Tabs', () => {
  it('switches between tabs correctly', async () => {
    renderApp(<[Entity]Details />);
    const user = userEvent.setup();

    // Click on second tab
    await user.click(screen.getByRole('tab', { name: /details/i }));

    // Verify correct tabpanel is shown
    expect(screen.getByRole('tabpanel', { name: /details/i })).toBeInTheDocument();
    expect(screen.queryByRole('tabpanel', { name: /overview/i })).not.toBeInTheDocument();
  });

  it('persists tab state in URL', async () => {
    renderApp(<[Entity]Details />);
    const user = userEvent.setup();

    await user.click(screen.getByRole('tab', { name: /settings/i }));

    // Check URL updated
    expect(window.location.pathname).toContain('settings');
  });

  it('navigates to different pages', async () => {
    renderApp(<App />);
    const user = userEvent.setup();

    // Click navigation link
    await user.click(screen.getByRole('link', { name: /[entities]/i }));

    // Verify navigation occurred
    expect(screen.getByRole('heading', { name: /[entities]/i })).toBeInTheDocument();
  });
});
```

---

## Test Organization

### Directory Structure

```
tests/
├── unit/                      # Unit tests for pure functions
│   ├── utils/
│   │   ├── formatters.test.ts
│   │   ├── validators.test.ts
│   │   └── calculations.test.ts
│   └── hooks/
│       ├── useAuth.test.ts
│       └── useData.test.ts
│
├── integration/               # Integration tests for features
│   ├── [entity]/
│   │   ├── [entity]-list.test.tsx
│   │   ├── [entity]-create.test.tsx
│   │   ├── [entity]-edit.test.tsx
│   │   └── [entity]-delete.test.tsx
│   └── auth/
│       ├── login.test.tsx
│       └── registration.test.tsx
│
├── e2e/                       # End-to-end tests (Cypress/Playwright)
│   ├── critical-paths/
│   │   ├── user-signup-flow.spec.ts
│   │   └── checkout-flow.spec.ts
│   └── regression/
│       └── legacy-features.spec.ts
│
└── test-utils/                # Shared test utilities
    ├── factories.ts           # Mock data factories
    ├── test-helpers.ts        # Helper functions
    ├── service-mocks.ts       # Service mocking
    ├── browser-mocks.ts       # Browser API mocking
    ├── setup.ts               # Global test setup
    └── render-with-providers.tsx
```

### Test File Naming

- **Unit tests**: `[module].test.ts` or `[module].spec.ts`
- **Component tests**: `[Component].test.tsx`
- **Integration tests**: `[feature]-[action].test.tsx`
- **E2E tests**: `[user-flow].spec.ts`

### Test Suite Organization

```typescript
describe('[Feature/Component Name]', () => {
  // Setup and teardown
  beforeEach(() => {
    cleanupTestData();
    setupMockData();
  });

  afterEach(() => {
    cleanupTestData();
  });

  // Group related tests
  describe('Data Display', () => {
    it('displays all items', () => { /* ... */ });
    it('displays empty state', () => { /* ... */ });
  });

  describe('User Interactions', () => {
    it('handles button clicks', () => { /* ... */ });
    it('handles form submissions', () => { /* ... */ });
  });

  describe('Error Handling', () => {
    it('displays error message on failure', () => { /* ... */ });
    it('retries on network error', () => { /* ... */ });
  });
});
```

---

## Anti-Patterns to Avoid

### ❌ Don't Test Implementation Details

```typescript
// ❌ BAD: Testing internal state
it('sets isLoading to true when fetching', () => {
  const { result } = renderHook(() => useData());
  act(() => {
    result.current.fetchData();
  });
  expect(result.current.isLoading).toBe(true); // Internal state
});

// ✅ GOOD: Test user-visible behavior
it('displays loading indicator when fetching', async () => {
  renderApp(<DataList />);
  fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
```

### ❌ Don't Over-Mock

```typescript
// ❌ BAD: Mocking your own components
vi.mock('./components/UserCard', () => ({
  UserCard: () => <div>Mocked UserCard</div>
}));

// ✅ GOOD: Use real components, mock external dependencies only
setupAllServiceMocks(); // Mock APIs, not your components
```

### ❌ Don't Write Brittle Tests

```typescript
// ❌ BAD: Brittle selector
expect(wrapper.find('.button-container > button:first-child').text()).toBe('Submit');

// ✅ GOOD: Semantic query
expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
```

### ❌ Don't Test Too Many Things at Once

```typescript
// ❌ BAD: Testing everything in one test
it('handles the entire user flow', async () => {
  // 100+ lines testing login, navigation, CRUD, logout...
});

// ✅ GOOD: Focused tests
it('logs in successfully with valid credentials', () => { /* ... */ });
it('navigates to dashboard after login', () => { /* ... */ });
it('creates new entity', () => { /* ... */ });
```

### ❌ Don't Skip Cleanup

```typescript
// ❌ BAD: No cleanup
describe('My Tests', () => {
  it('test 1', () => {
    localStorage.setItem('key', 'value');
    // ... test runs, localStorage pollutes next test
  });
});

// ✅ GOOD: Always cleanup
describe('My Tests', () => {
  afterEach(() => {
    cleanupTestData(); // Clears localStorage, mocks, etc.
  });
  
  it('test 1', () => {
    localStorage.setItem('key', 'value');
    // ... test runs
  });
});
```

---

## Quick Reference Checklist

### Before Writing Tests

- [ ] Identify what behavior to test (not implementation)
- [ ] Determine mock requirements (services, APIs, browser APIs)
- [ ] Create factory functions for mock data
- [ ] Set up test helpers (renderApp, waitForLoading, etc.)

### Writing Tests

- [ ] Use semantic queries (getByRole, getByLabelText)
- [ ] Test user-visible behavior
- [ ] Mock external dependencies only
- [ ] Keep tests focused (one concept per test)
- [ ] Use descriptive test names

### After Writing Tests

- [ ] Tests pass consistently
- [ ] Tests are fast (< 100ms for unit, < 1s for integration)
- [ ] Cleanup runs in afterEach
- [ ] No console warnings or errors
- [ ] Test names clearly describe what's being tested

---

## Summary

This document provides **universal testing standards** applicable to any project:

1. **Mock external dependencies** (APIs, services, browser APIs), use real components
2. **Create reusable helper functions** (renderApp, waitForLoading, setupMockData)
3. **Use factory pattern** for generating mock data
4. **Focus on testable behavior** (data display, search, persistence, validation)
5. **Avoid complex mocking** (dialogs, wizards, real-time features)
6. **Organize tests logically** (unit/integration/e2e structure)
7. **Always cleanup** between tests to prevent pollution

**Adapt these patterns to your specific domain** by replacing generic types like `[Entity]` with your actual types (`User`, `Product`, `Order`, etc.) and customizing the helper functions for your application's provider structure.
