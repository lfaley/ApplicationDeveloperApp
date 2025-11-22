# Framework-Specific Testing Examples
## Practical Implementation Guides for Popular Testing Frameworks

**Version:** 1.0  
**Updated:** December 2024  
**Purpose:** Provide ready-to-use configurations and patterns for implementing the testing strategy  
**Frameworks Covered:** Jest, Vitest, Cypress, Playwright, React Testing Library, Testing Library (general)

---

## Table of Contents

1. [Jest Configuration](#jest-configuration)
2. [Vitest Configuration](#vitest-configuration)
3. [Cypress Setup](#cypress-setup)
4. [Playwright Setup](#playwright-setup)
5. [React Testing Library Patterns](#react-testing-library-patterns)
6. [Accessibility Testing](#accessibility-testing)
7. [CI/CD Integration](#cicd-integration)
8. [Framework Comparison](#framework-comparison)

---

## Jest Configuration

### Basic Setup

**Installation:**
```bash
npm install --save-dev jest @types/jest ts-jest
npm install --save-dev @testing-library/jest-dom
```

**jest.config.js:**
```javascript
/** @type {import('jest').Config} */
module.exports = {
  // Use ts-jest for TypeScript
  preset: 'ts-jest',
  testEnvironment: 'node', // or 'jsdom' for React/DOM testing
  
  // Test file patterns
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],
  
  // Coverage configuration
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}'
  ],
  coverageThresholds: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  
  // Setup files
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Module name mapping (for aliases)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js'
  },
  
  // Transform configuration
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true
      }
    }]
  },
  
  // Test timeout
  testTimeout: 10000
};
```

**jest.setup.js:**
```javascript
// Extend Jest matchers
import '@testing-library/jest-dom';

// Mock environment variables
process.env.NODE_ENV = 'test';
process.env.API_URL = 'http://localhost:3000/api';

// Global test utilities
global.console = {
  ...console,
  error: jest.fn(), // Suppress error logs in tests
  warn: jest.fn()
};

// Mock window.matchMedia (for responsive tests)
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});
```

### Jest Test Examples

**Unit Test (Business Logic):**
```typescript
// src/utils/validation.test.ts
import { validateEmail, validatePassword } from './validation';

describe('Validation Utils', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'user@example.com',
        'test.user+tag@domain.co.uk',
        'user123@subdomain.example.com'
      ];
      
      validEmails.forEach(email => {
        expect(validateEmail(email)).toBe(true);
      });
    });
    
    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        ''
      ];
      
      invalidEmails.forEach(email => {
        expect(validateEmail(email)).toBe(false);
      });
    });
  });
  
  describe('validatePassword', () => {
    it('should require minimum 8 characters', () => {
      expect(validatePassword('short')).toBe(false);
      expect(validatePassword('LongEnough1!')).toBe(true);
    });
    
    it('should require at least one number', () => {
      expect(validatePassword('NoNumbers!')).toBe(false);
      expect(validatePassword('HasNumber1!')).toBe(true);
    });
    
    it('should require at least one special character', () => {
      expect(validatePassword('NoSpecial1')).toBe(false);
      expect(validatePassword('HasSpecial1!')).toBe(true);
    });
  });
});
```

**Integration Test (API):**
```typescript
// src/services/api.test.ts
import { fetchUserProfile, updateUserProfile } from './api';

// Mock fetch
global.fetch = jest.fn();

describe('API Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('fetchUserProfile', () => {
    it('should fetch user profile successfully', async () => {
      const mockUser = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com'
      };
      
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser
      });
      
      const result = await fetchUserProfile('123');
      
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3000/api/users/123',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          })
        })
      );
      expect(result).toEqual(mockUser);
    });
    
    it('should handle network errors', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );
      
      await expect(fetchUserProfile('123')).rejects.toThrow('Network error');
    });
    
    it('should handle 404 errors', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found'
      });
      
      await expect(fetchUserProfile('999')).rejects.toThrow('User not found');
    });
  });
});
```

---

## Vitest Configuration

### Basic Setup

**Installation:**
```bash
npm install --save-dev vitest @vitest/ui
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev jsdom # for DOM testing
```

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environment
    environment: 'jsdom', // or 'node' for backend tests
    
    // Global setup
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    
    // Coverage
    coverage: {
      provider: 'v8', // or 'istanbul'
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/index.ts',
        '**/*.stories.{js,jsx,ts,tsx}'
      ],
      thresholds: {
        branches: 70,
        functions: 80,
        lines: 80,
        statements: 80
      }
    },
    
    // Include/exclude patterns
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    
    // Test timeout
    testTimeout: 10000,
    
    // UI configuration
    ui: true,
    open: false
  },
  
  // Resolve aliases (match your tsconfig.json)
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
```

**vitest.setup.ts:**
```typescript
import { expect, afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock environment variables
process.env.VITE_API_URL = 'http://localhost:3000/api';

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() { return []; }
  unobserve() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
};
```

### Vitest Test Example

**Component Test with React Testing Library:**
```typescript
// src/components/LoginForm.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('should render login form fields', () => {
    render(<LoginForm onSubmit={vi.fn()} />);
    
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });
  
  it('should validate email format', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={vi.fn()} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    await user.type(emailInput, 'invalidemail');
    await user.click(submitButton);
    
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });
  
  it('should call onSubmit with form data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /log in/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        email: 'user@example.com',
        password: 'password123'
      });
    });
  });
  
  it('should disable submit button while loading', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn(() => new Promise(resolve => setTimeout(resolve, 1000)));
    render(<LoginForm onSubmit={onSubmit} />);
    
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(submitButton);
    
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/logging in/i)).toBeInTheDocument();
  });
});
```

---

## Cypress Setup

### Basic Configuration

**Installation:**
```bash
npm install --save-dev cypress
npm install --save-dev @testing-library/cypress
npm install --save-dev cypress-axe # for accessibility testing
```

**cypress.config.ts:**
```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    // Base URL for your application
    baseUrl: 'http://localhost:3000',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Test files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    
    // Screenshots and videos
    screenshotOnRunFailure: true,
    video: true,
    videoCompression: 32,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 60000,
    
    // Retry configuration
    retries: {
      runMode: 2, // CI environment
      openMode: 0 // Local development
    },
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3000/api',
      testUser: {
        email: 'test@example.com',
        password: 'TestPassword123!'
      }
    },
    
    setupNodeEvents(on, config) {
      // Implement node event listeners
      return config;
    }
  },
  
  component: {
    devServer: {
      framework: 'react',
      bundler: 'vite'
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts'
  }
});
```

**cypress/support/e2e.ts:**
```typescript
// Import commands
import './commands';
import '@testing-library/cypress/add-commands';
import 'cypress-axe';

// Global configuration
Cypress.on('uncaught:exception', (err, runnable) => {
  // Prevent Cypress from failing tests on uncaught exceptions
  // Return false to prevent the test from failing
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  return true;
});

// Before each test
beforeEach(() => {
  // Clear cookies and local storage
  cy.clearCookies();
  cy.clearLocalStorage();
  
  // Inject axe for accessibility testing
  cy.injectAxe();
});
```

**cypress/support/commands.ts:**
```typescript
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to login
       * @example cy.login('user@example.com', 'password')
       */
      login(email: string, password: string): Chainable<void>;
      
      /**
       * Custom command to create a test meal plan
       */
      createMealPlan(name: string): Chainable<void>;
      
      /**
       * Custom command to check accessibility
       */
      checkA11y(context?: string, options?: object): Chainable<void>;
    }
  }
}

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.findByLabelText(/email/i).type(email);
    cy.findByLabelText(/password/i).type(password);
    cy.findByRole('button', { name: /log in/i }).click();
    cy.url().should('not.include', '/login');
  });
});

// Create meal plan command
Cypress.Commands.add('createMealPlan', (name: string) => {
  cy.findByRole('button', { name: /create meal plan/i }).click();
  cy.findByLabelText(/name/i).type(name);
  cy.findByRole('button', { name: /save/i }).click();
  cy.findByText(name).should('be.visible');
});

// Accessibility check command
Cypress.Commands.add('checkA11y', (context, options) => {
  cy.checkA11y(context, options);
});

export {};
```

### Cypress Test Examples

**E2E User Flow Test:**
```typescript
// cypress/e2e/meal-planning-flow.cy.ts
describe('Meal Planning User Flow', () => {
  beforeEach(() => {
    cy.login(
      Cypress.env('testUser').email,
      Cypress.env('testUser').password
    );
    cy.visit('/meal-plans');
  });
  
  it('should complete full meal planning workflow', () => {
    // Step 1: Create meal plan
    cy.createMealPlan('Weekly Meal Plan');
    
    // Step 2: Add meals
    cy.findByRole('button', { name: /add meal/i }).click();
    cy.findByLabelText(/meal name/i).type('Spaghetti Carbonara');
    cy.findByLabelText(/day/i).select('Monday');
    cy.findByLabelText(/meal type/i).select('Dinner');
    cy.findByRole('button', { name: /save meal/i }).click();
    
    // Step 3: Verify meal added
    cy.findByText('Spaghetti Carbonara').should('be.visible');
    cy.findByText('Monday').should('be.visible');
    
    // Step 4: Generate shopping list
    cy.findByRole('button', { name: /generate shopping list/i }).click();
    cy.findByRole('heading', { name: /shopping list/i }).should('be.visible');
    
    // Step 5: Verify ingredients
    cy.findByText(/spaghetti/i).should('be.visible');
    cy.findByText(/eggs/i).should('be.visible');
    cy.findByText(/parmesan/i).should('be.visible');
    
    // Step 6: Mark items as purchased
    cy.findByLabelText(/spaghetti/i).check();
    cy.findByText(/spaghetti/i).should('have.class', 'completed');
  });
  
  it('should handle errors gracefully', () => {
    // Intercept API call and force error
    cy.intercept('POST', '/api/meal-plans', {
      statusCode: 500,
      body: { error: 'Internal server error' }
    }).as('createMealPlanError');
    
    cy.findByRole('button', { name: /create meal plan/i }).click();
    cy.findByLabelText(/name/i).type('Error Test Plan');
    cy.findByRole('button', { name: /save/i }).click();
    
    cy.wait('@createMealPlanError');
    cy.findByText(/something went wrong/i).should('be.visible');
  });
  
  it('should be accessible', () => {
    cy.checkA11y();
    
    cy.findByRole('button', { name: /create meal plan/i }).click();
    cy.checkA11y('.modal'); // Check modal accessibility
  });
});
```

**Component Test:**
```typescript
// src/components/MealCard.cy.tsx
import { MealCard } from './MealCard';

describe('MealCard Component', () => {
  const mockMeal = {
    id: '1',
    name: 'Spaghetti Carbonara',
    day: 'Monday',
    mealType: 'Dinner',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Bacon']
  };
  
  it('should render meal information', () => {
    cy.mount(<MealCard meal={mockMeal} />);
    
    cy.findByText('Spaghetti Carbonara').should('be.visible');
    cy.findByText('Monday').should('be.visible');
    cy.findByText('Dinner').should('be.visible');
  });
  
  it('should show ingredients on expand', () => {
    cy.mount(<MealCard meal={mockMeal} />);
    
    cy.findByRole('button', { name: /show ingredients/i }).click();
    cy.findByText('Spaghetti').should('be.visible');
    cy.findByText('Eggs').should('be.visible');
    cy.findByText('Parmesan').should('be.visible');
  });
  
  it('should emit delete event', () => {
    const onDelete = cy.stub().as('onDelete');
    cy.mount(<MealCard meal={mockMeal} onDelete={onDelete} />);
    
    cy.findByRole('button', { name: /delete/i }).click();
    cy.get('@onDelete').should('have.been.calledWith', '1');
  });
});
```

---

## Playwright Setup

### Basic Configuration

**Installation:**
```bash
npm install --save-dev @playwright/test
npx playwright install # Install browsers
```

**playwright.config.ts:**
```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Test directory
  testDir: './tests',
  
  // Timeout
  timeout: 30000,
  expect: {
    timeout: 5000
  },
  
  // Parallel execution
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ],
  
  // Shared settings
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 10000,
    navigationTimeout: 30000
  },
  
  // Projects (browsers and devices)
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] }
    },
    {
      name: 'mobile-chrome',
      use: { ...devices['Pixel 5'] }
    },
    {
      name: 'mobile-safari',
      use: { ...devices['iPhone 12'] }
    }
  ],
  
  // Web server (auto-start dev server)
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
```

### Playwright Test Examples

**E2E Test with Page Object Model:**
```typescript
// tests/pages/LoginPage.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  
  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel(/email/i);
    this.passwordInput = page.getByLabel(/password/i);
    this.loginButton = page.getByRole('button', { name: /log in/i });
    this.errorMessage = page.getByRole('alert');
  }
  
  async goto() {
    await this.page.goto('/login');
  }
  
  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
  
  async expectError(message: string) {
    await this.errorMessage.waitFor();
    await this.page.waitForSelector(`text=${message}`);
  }
}

// tests/auth/login.spec.ts
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test.describe('Login Flow', () => {
  let loginPage: LoginPage;
  
  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });
  
  test('should login successfully with valid credentials', async ({ page }) => {
    await loginPage.login('user@example.com', 'ValidPassword123!');
    
    await expect(page).toHaveURL('/dashboard');
    await expect(page.getByText(/welcome/i)).toBeVisible();
  });
  
  test('should show error with invalid credentials', async () => {
    await loginPage.login('user@example.com', 'WrongPassword');
    
    await loginPage.expectError('Invalid email or password');
  });
  
  test('should validate email format', async ({ page }) => {
    await loginPage.emailInput.fill('invalidemail');
    await loginPage.passwordInput.fill('ValidPassword123!');
    await loginPage.loginButton.click();
    
    await expect(page.getByText(/invalid email/i)).toBeVisible();
  });
  
  test('should persist login across sessions', async ({ page, context }) => {
    await loginPage.login('user@example.com', 'ValidPassword123!');
    await expect(page).toHaveURL('/dashboard');
    
    // Close page and open new one
    await page.close();
    const newPage = await context.newPage();
    await newPage.goto('/dashboard');
    
    // Should still be logged in
    await expect(newPage.getByText(/welcome/i)).toBeVisible();
  });
});
```

**API Testing:**
```typescript
// tests/api/meal-plans.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Meal Plans API', () => {
  let authToken: string;
  
  test.beforeAll(async ({ request }) => {
    // Get auth token
    const response = await request.post('/api/auth/login', {
      data: {
        email: 'test@example.com',
        password: 'TestPassword123!'
      }
    });
    
    const data = await response.json();
    authToken = data.token;
  });
  
  test('should create meal plan', async ({ request }) => {
    const response = await request.post('/api/meal-plans', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      },
      data: {
        name: 'Weekly Meal Plan',
        startDate: '2024-01-01'
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('id');
    expect(data.name).toBe('Weekly Meal Plan');
  });
  
  test('should list all meal plans', async ({ request }) => {
    const response = await request.get('/api/meal-plans', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    });
    
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBeTruthy();
    expect(data.length).toBeGreaterThan(0);
  });
  
  test('should handle unauthorized access', async ({ request }) => {
    const response = await request.get('/api/meal-plans');
    
    expect(response.status()).toBe(401);
  });
});
```

---

## React Testing Library Patterns

### UI Mocking for User Flow Tests

**Why Mock UI Components:**
- Test user interactions without full application setup
- Isolate component behavior from dependencies
- Speed up test execution
- Control component state and props
- Simulate edge cases and error states

**Mocking Strategy Hierarchy:**
```
Level 1: Mock External Dependencies (APIs, Browser APIs)
├─ fetch, localStorage, sessionStorage
├─ window.matchMedia, IntersectionObserver
└─ Third-party services (Stripe, Analytics)

Level 2: Mock Context Providers
├─ Authentication context
├─ Theme/UI context
├─ Data/state management (Redux, Zustand)
└─ Router context

Level 3: Mock Child Components (Selective)
├─ Complex third-party components (Maps, Charts)
├─ Heavy components not under test
└─ Components with external side effects

Level 4: Real Components (Preferred)
├─ Components under test
├─ Simple presentational components
└─ Core UI elements (buttons, inputs, forms)
```

### Test Utilities with Mocked Context

**Create render-with-providers.tsx:**
```typescript
import { render, RenderOptions } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../contexts/AuthContext';
import { ThemeProvider } from '../contexts/ThemeContext';
import { ReactElement } from 'react';

// Mock user for auth context
const mockUser = {
  id: 'test-user-123',
  email: 'test@example.com',
  name: 'Test User'
};

interface CustomRenderOptions extends RenderOptions {
  // Override default mock values
  user?: typeof mockUser | null;
  theme?: 'light' | 'dark';
  initialRoute?: string;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    user = mockUser,
    theme = 'light',
    initialRoute = '/',
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false }
      }
    }),
    ...renderOptions
  }: CustomRenderOptions = {}
) {
  // Mock auth context value
  const mockAuthValue = {
    user,
    login: jest.fn(),
    logout: jest.fn(),
    isAuthenticated: !!user,
    isLoading: false
  };

  // Mock theme context value
  const mockThemeValue = {
    theme,
    toggleTheme: jest.fn()
  };

  // Set initial route
  window.history.pushState({}, 'Test page', initialRoute);

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider value={mockAuthValue}>
            <ThemeProvider value={mockThemeValue}>
              {children}
            </ThemeProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockAuthValue,
    mockThemeValue,
    queryClient
  };
}

// Helper to render with unauthenticated user
export function renderWithoutAuth(ui: ReactElement, options?: CustomRenderOptions) {
  return renderWithProviders(ui, { ...options, user: null });
}

// Helper to render with specific route
export function renderWithRoute(ui: ReactElement, route: string, options?: CustomRenderOptions) {
  return renderWithProviders(ui, { ...options, initialRoute: route });
}
```

**Mock Browser APIs:**
```typescript
// test-utils/mock-browser-apis.ts
export function mockLocalStorage() {
  const store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    })
  };
}

export function mockMatchMedia() {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }))
  });
}

export function mockIntersectionObserver() {
  global.IntersectionObserver = class IntersectionObserver {
    constructor(private callback: IntersectionObserverCallback) {}
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
    takeRecords = jest.fn();
    
    // Helper to trigger intersection
    triggerIntersection(entries: Partial<IntersectionObserverEntry>[]) {
      this.callback(entries as IntersectionObserverEntry[], this);
    }
  } as any;
}

export function mockScrollTo() {
  window.scrollTo = jest.fn();
  Element.prototype.scrollIntoView = jest.fn();
}
```

**Mock API Responses:**
```typescript
// test-utils/mock-api.ts
import { rest } from 'msw';
import { setupServer } from 'msw/node';

// Mock data
export const mockMealPlans = [
  {
    id: '1',
    name: 'Weekly Meal Plan',
    startDate: '2024-01-01',
    meals: [
      { id: 'm1', name: 'Spaghetti', day: 'Monday', mealType: 'Dinner' },
      { id: 'm2', name: 'Salad', day: 'Tuesday', mealType: 'Lunch' }
    ]
  }
];

export const mockRecipes = [
  {
    id: 'r1',
    name: 'Spaghetti Carbonara',
    ingredients: ['Spaghetti', 'Eggs', 'Parmesan', 'Bacon'],
    instructions: 'Cook pasta, mix with eggs...'
  }
];

// MSW handlers
export const handlers = [
  // Meal plans
  rest.get('/api/meal-plans', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(mockMealPlans));
  }),
  
  rest.post('/api/meal-plans', async (req, res, ctx) => {
    const body = await req.json();
    const newPlan = {
      id: String(Date.now()),
      ...body,
      meals: []
    };
    return res(ctx.status(201), ctx.json(newPlan));
  }),
  
  rest.get('/api/meal-plans/:id', (req, res, ctx) => {
    const { id } = req.params;
    const plan = mockMealPlans.find(p => p.id === id);
    
    if (!plan) {
      return res(ctx.status(404), ctx.json({ error: 'Not found' }));
    }
    
    return res(ctx.status(200), ctx.json(plan));
  }),
  
  // Recipes
  rest.get('/api/recipes', (req, res, ctx) => {
    const search = req.url.searchParams.get('search');
    let results = mockRecipes;
    
    if (search) {
      results = mockRecipes.filter(r => 
        r.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    return res(ctx.status(200), ctx.json(results));
  }),
  
  // Auth
  rest.post('/api/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          user: { id: '1', email, name: 'Test User' },
          token: 'mock-jwt-token'
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    );
  })
];

// Create server
export const server = setupServer(...handlers);

// Setup for tests
export function setupMockApi() {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());
}
```

### Service Mocking

**Mock external services and third-party libraries for predictable, fast tests:**

```typescript
// test-utils/service-mocks.ts
import { vi } from 'vitest'; // or jest.fn() for Jest

// Mock AI/LLM API calls - Returns predictable test data
export const mockAiHelper = () => {
  vi.mock('@/lib/aiHelper', () => ({
    generateRecipe: vi.fn().mockResolvedValue({
      id: 'test-recipe-ai-1',
      name: 'AI Generated Mock Recipe',
      ingredients: ['ingredient 1', 'ingredient 2', 'ingredient 3'],
      instructions: ['step 1', 'step 2', 'step 3'],
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      tags: ['ai-generated', 'test'],
    }),
    analyzeIngredients: vi.fn().mockResolvedValue({
      suggestions: ['Add garlic for flavor', 'Consider olive oil'],
      nutritionInfo: { calories: 350, protein: 25, carbs: 40, fat: 10 },
      substitutions: [{ from: 'butter', to: 'olive oil' }],
    }),
    chatWithAssistant: vi.fn().mockResolvedValue({
      response: 'This is a mock AI assistant response for testing',
      conversationId: 'mock-conversation-123',
      tokensUsed: 50,
    }),
    generateMealPlan: vi.fn().mockResolvedValue({
      id: 'meal-plan-ai-1',
      name: 'AI Weekly Plan',
      meals: [
        { day: 'Monday', mealType: 'Dinner', recipeName: 'Pasta' },
        { day: 'Tuesday', mealType: 'Lunch', recipeName: 'Salad' },
      ],
    }),
  }));
};

// Mock toast notifications - Silent during tests
export const mockToast = () => {
  vi.mock('sonner', () => ({
    toast: {
      success: vi.fn(),
      error: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      loading: vi.fn(),
      promise: vi.fn().mockResolvedValue(undefined),
      custom: vi.fn(),
    },
    Toaster: () => null, // Render nothing during tests
  }));
};

// For react-hot-toast
export const mockReactHotToast = () => {
  vi.mock('react-hot-toast', () => ({
    default: {
      success: vi.fn(),
      error: vi.fn(),
      loading: vi.fn(),
      custom: vi.fn(),
    },
    Toaster: () => null,
  }));
};

// Mock analytics services
export const mockAnalytics = () => {
  vi.mock('@/lib/analytics', () => ({
    trackEvent: vi.fn(),
    trackPageView: vi.fn(),
    identifyUser: vi.fn(),
    trackConversion: vi.fn(),
  }));
};

// Mock payment/Stripe services
export const mockStripe = () => {
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

// Mock file upload services
export const mockFileUpload = () => {
  vi.mock('@/lib/uploadService', () => ({
    uploadFile: vi.fn().mockResolvedValue({
      url: 'https://mock-cdn.example.com/uploads/test-file.jpg',
      size: 2048576, // 2MB
      name: 'test-file.jpg',
      type: 'image/jpeg',
    }),
    uploadMultiple: vi.fn().mockResolvedValue([
      { url: 'https://mock-cdn.example.com/file1.jpg', name: 'file1.jpg' },
      { url: 'https://mock-cdn.example.com/file2.jpg', name: 'file2.jpg' },
    ]),
    deleteFile: vi.fn().mockResolvedValue({ success: true }),
  }));
};

// Mock email service
export const mockEmailService = () => {
  vi.mock('@/lib/emailService', () => ({
    sendEmail: vi.fn().mockResolvedValue({ messageId: 'mock-msg-123', sent: true }),
    sendBulkEmail: vi.fn().mockResolvedValue({ sent: 50, failed: 0 }),
  }));
};

// Setup all common service mocks at once
export const setupServiceMocks = () => {
  mockAiHelper();
  mockToast();
  mockAnalytics();
};
```

### Test Helper Functions

**Create reusable utilities to simplify tests and reduce duplication:**

```typescript
// test-utils/test-helpers.ts
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import userEvent from '@testing-library/user-event';
import { Recipe, User, MealPlan } from '@/types';

/**
 * Render app with all necessary providers and test-friendly config
 * Disables retries, caching between tests for predictable behavior
 */
export const renderApp = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false, // Don't retry failed queries in tests
        cacheTime: 0, // Don't cache between tests
        staleTime: 0,
        refetchOnWindowFocus: false,
      },
      mutations: {
        retry: false,
      },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      {component}
    </QueryClientProvider>
  );
};

/**
 * Wait for all loading states to complete
 * Useful after navigation or data fetching
 */
export const waitForLoadingToFinish = async () => {
  await waitFor(
    () => {
      // Wait for common loading indicators to disappear
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      expect(screen.queryByTestId('loading-skeleton')).not.toBeInTheDocument();
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    },
    { timeout: 3000 }
  );
};

/**
 * Generic function to populate localStorage with test data
 * Adapt this pattern for your specific entities
 */
export const setupMockData = <T>(key: string, data?: T[]) => {
  const mockData = data || [];
  localStorage.setItem(key, JSON.stringify(mockData));
  return mockData;
};

/**
 * Example: Setup mock entities for your domain
 * Replace 'Entity' with your actual type (User, Product, Order, etc.)
 */
export const setupMockEntities = (entities?: Entity[]) => {
  const defaultEntities: Entity[] = entities || [
    createMockEntity({ id: '1', name: 'Entity One', status: 'active' }),
    createMockEntity({ id: '2', name: 'Entity Two', status: 'pending' }),
    createMockEntity({ id: '3', name: 'Entity Three', status: 'completed' }),
  ];

  localStorage.setItem('entities', JSON.stringify(defaultEntities));
  return defaultEntities;
};

/**
 * Generic factory pattern for creating mock objects
 * Replace 'Entity' with your actual type (Product, Order, User, etc.)
 * Customize default values for your domain
 */
export const createMockEntity = (overrides?: Partial<Entity>): Entity => {
  const id = overrides?.id || `entity-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id,
    name: overrides?.name || 'Mock Entity',
    description: overrides?.description || 'Mock description for testing',
    status: overrides?.status || 'active',
    // Add your domain-specific fields:
    // price: overrides?.price || 99.99,
    // quantity: overrides?.quantity || 10,
    // category: overrides?.category || 'default',
    // tags: overrides?.tags || ['test'],
    metadata: overrides?.metadata || { source: 'test' },
    createdAt: overrides?.createdAt || new Date().toISOString(),
    updatedAt: overrides?.updatedAt || new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Factory function for creating mock User objects
 */
export const createMockUser = (overrides?: Partial<User>): User => {
  return {
    id: overrides?.id || 'user-123',
    email: overrides?.email || 'test@example.com',
    name: overrides?.name || 'Test User',
    avatar: overrides?.avatar || 'https://example.com/avatar.jpg',
    role: overrides?.role || 'user',
    preferences: overrides?.preferences || { theme: 'light', notifications: true },
    createdAt: overrides?.createdAt || new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Factory function for creating mock MealPlan objects
 */
export const createMockMealPlan = (overrides?: Partial<MealPlan>): MealPlan => {
  return {
    id: overrides?.id || `plan-${Math.random().toString(36).substr(2, 9)}`,
    name: overrides?.name || 'Mock Meal Plan',
    startDate: overrides?.startDate || new Date().toISOString(),
    endDate: overrides?.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    meals: overrides?.meals || [
      { day: 'Monday', mealType: 'Dinner', recipeId: '1', recipeName: 'Pasta' },
      { day: 'Tuesday', mealType: 'Lunch', recipeId: '2', recipeName: 'Salad' },
    ],
    createdAt: overrides?.createdAt || new Date().toISOString(),
    ...overrides,
  };
};

/**
 * Generic form filling helper
 * Adapt this pattern for your specific forms
 */
export const fillForm = async (formData: Record<string, any>) => {
  const user = userEvent.setup();
  
  for (const [fieldName, value] of Object.entries(formData)) {
    if (value === undefined || value === null) continue;
    
    // Try to find input by label, placeholder, or test-id
    const input = 
      screen.queryByLabelText(new RegExp(fieldName, 'i')) ||
      screen.queryByPlaceholderText(new RegExp(fieldName, 'i')) ||
      screen.queryByTestId(fieldName);
    
    if (input) {
      await user.clear(input);
      await user.type(input, value.toString());
    }
  }
};

/**
 * Fill form fields with test data for specific entity
 * Customize for your domain-specific forms
 */
export const fillEntityForm = async (data: Partial<Entity>) => {
  const user = userEvent.setup();
  
  if (data.name) {
    await user.type(screen.getByLabelText(/name/i), data.name);
  }
  
  if (data.description) {
    await user.type(screen.getByLabelText(/description/i), data.description);
  }
  
  if (data.status) {
    await user.selectOptions(screen.getByLabelText(/status/i), data.status);
  }
  
  // Add your domain-specific fields
};

/**
 * Clear all test data between tests
 * Call in afterEach to prevent test pollution
 */
export const cleanupTestData = () => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
};

/**
 * Simulate file upload
 */
export const createMockFile = (name: string, size: number, type: string) => {
  return new File(['mock content'], name, { type });
};

/**
 * Wait for element and click it
 * Combines waitFor + click for convenience
 */
export const waitAndClick = async (text: string | RegExp) => {
  const user = userEvent.setup();
  const element = await screen.findByRole('button', { name: text });
  await user.click(element);
};
```

### Simplified Testing Approach

**Focus tests on testable behavior instead of complex interactions requiring extensive mocking.**

#### ✅ DO Test (High Value, Low Mocking):
- **App structure and navigation** - Verify routes, links, and page layout
- **Data display from localStorage/state** - Verify correct data rendering
- **Search and filter functionality** - Test filtering logic works correctly
- **Data persistence operations** - Verify localStorage/API updates
- **Tab switching and routing** - Test navigation state management
- **Form validation and error states** - Test input validation rules
- **Loading states and error handling** - Test async UI feedback
- **Accessibility (ARIA, keyboard navigation)** - Test a11y compliance

#### ❌ AVOID Testing (Complex, High Mocking Overhead):
- **Complex dialog interactions with many dependencies** - Requires extensive context mocking
- **Multi-step wizards with external service calls** - Too many moving parts
- **Real-time features requiring WebSocket mocking** - Complex setup, fragile tests
- **Third-party component internals** - Not your code, vendor's responsibility
- **Animations and transitions** - Visual behavior, better for E2E
- **Complex drag-and-drop interactions** - Better suited for E2E tests

#### Example: Before vs After

**❌ BEFORE (Complex, Hard to Maintain):**
```typescript
// Testing complex "Create and Share Meal Plan" dialog
it('allows user to create and share meal plan', async () => {
  // Requires: Auth mock, API mock, Router mock, Dialog mock, Clipboard mock, Toast mock
  renderWithProviders(<App />);
  await user.click(screen.getByRole('button', { name: /create plan/i }));
  // ... 50+ lines of complex interactions
  // Dialog closes, API called, clipboard updated, toast shown
  // Brittle: Breaks when dialog structure changes
});
```

**✅ AFTER (Focused, Easy to Maintain):**
```typescript
// Test 1: Data display from localStorage/state
it('displays entities from data source', async () => {
  setupMockEntities();
  renderApp(<App />);
  await waitForLoadingToFinish();
  
  expect(screen.getByText('Entity One')).toBeInTheDocument();
  expect(screen.getByText('Entity Two')).toBeInTheDocument();
});

// Test 2: Search/filter functionality
it('filters entities by search term', async () => {
  setupMockEntities();
  renderApp(<App />);
  const user = userEvent.setup();
  
  await user.type(screen.getByPlaceholderText(/search/i), 'one');
  
  expect(screen.getByText('Entity One')).toBeInTheDocument();
  expect(screen.queryByText('Entity Two')).not.toBeInTheDocument();
});

// Test 3: Data persistence
it('persists new entity to localStorage', async () => {
  renderApp(<App />);
  const user = userEvent.setup();
  
  await user.type(screen.getByLabelText(/name/i), 'New Entity');
  await user.click(screen.getByRole('button', { name: /save/i }));
  
  const stored = JSON.parse(localStorage.getItem('entities') || '[]');
  expect(stored).toContainEqual(expect.objectContaining({ name: 'New Entity' }));
});

// Test 4: Tab switching/navigation
it('switches between tabs correctly', async () => {
  renderApp(<App />);
  const user = userEvent.setup();
  
  await user.click(screen.getByRole('tab', { name: /details/i }));
  expect(screen.getByRole('tabpanel', { name: /details/i })).toBeInTheDocument();
});

// Test 5: Form validation
it('validates required fields', async () => {
  renderApp(<App />);
  const user = userEvent.setup();
  
  await user.click(screen.getByRole('button', { name: /submit/i }));
  expect(screen.getByText(/name is required/i)).toBeInTheDocument();
});
```

**Benefits of Simplified Approach:**
- ✅ Tests run 5-10x faster
- ✅ 60-70% less mocking code to maintain
- ✅ Tests break only when actual functionality changes
- ✅ Easier to understand and modify
- ✅ Higher confidence in what's being tested

**Complete User Flow Test with Mocked UI:**
```typescript
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders } from './test-utils/render-with-providers';
import { setupMockApi, server, mockMealPlans } from './test-utils/mock-api';
import { rest } from 'msw';
import { MealPlannerApp } from './MealPlannerApp';

// Setup mock API
setupMockApi();

describe('Complete Meal Planning User Flow', () => {
  beforeEach(() => {
    // Mock browser APIs
    mockLocalStorage();
    mockScrollTo();
  });
  
  it('should complete full meal planning workflow', async () => {
    const user = userEvent.setup();
    
    // Render app with authenticated user
    const { mockAuthValue } = renderWithProviders(<MealPlannerApp />, {
      initialRoute: '/meal-plans'
    });
    
    // Verify user is authenticated
    expect(mockAuthValue.isAuthenticated).toBe(true);
    expect(screen.getByText(/test user/i)).toBeInTheDocument();
    
    // Step 1: View existing meal plans
    expect(screen.getByText('Weekly Meal Plan')).toBeInTheDocument();
    
    // Step 2: Create new meal plan
    await user.click(screen.getByRole('button', { name: /create meal plan/i }));
    
    // Modal should open
    const modal = screen.getByRole('dialog');
    expect(modal).toBeInTheDocument();
    
    // Fill form
    await user.type(
      within(modal).getByLabelText(/plan name/i),
      'Holiday Meal Plan'
    );
    await user.type(
      within(modal).getByLabelText(/start date/i),
      '2024-12-01'
    );
    
    // Mock successful creation
    server.use(
      rest.post('/api/meal-plans', async (req, res, ctx) => {
        const body = await req.json();
        return res(
          ctx.status(201),
          ctx.json({
            id: 'new-plan-123',
            ...body,
            meals: []
          })
        );
      })
    );
    
    await user.click(within(modal).getByRole('button', { name: /create/i }));
    
    // Wait for creation
    await waitFor(() => {
      expect(screen.getByText('Holiday Meal Plan')).toBeInTheDocument();
    });
    
    // Modal should close
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    
    // Step 3: Add meal to plan
    const newPlan = screen.getByTestId('meal-plan-new-plan-123');
    await user.click(within(newPlan).getByRole('button', { name: /add meal/i }));
    
    // Meal form opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    
    await user.type(screen.getByLabelText(/meal name/i), 'Spaghetti');
    await user.selectOptions(screen.getByLabelText(/day/i), 'Monday');
    await user.selectOptions(screen.getByLabelText(/meal type/i), 'Dinner');
    
    await user.click(screen.getByRole('button', { name: /save meal/i }));
    
    // Verify meal added
    await waitFor(() => {
      expect(within(newPlan).getByText('Spaghetti')).toBeInTheDocument();
    });
    
    // Step 4: Generate shopping list
    await user.click(within(newPlan).getByRole('button', { name: /shopping list/i }));
    
    // Navigate to shopping list page
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /shopping list/i })).toBeInTheDocument();
    });
    
    // Verify ingredients appear
    expect(screen.getByText(/spaghetti/i)).toBeInTheDocument();
    expect(screen.getByText(/eggs/i)).toBeInTheDocument();
    
    // Step 5: Check off items
    const spaghettiCheckbox = screen.getByLabelText(/spaghetti/i);
    await user.click(spaghettiCheckbox);
    
    expect(spaghettiCheckbox).toBeChecked();
    
    // Verify item marked as complete (visual feedback)
    const spaghettiItem = screen.getByTestId('shopping-item-spaghetti');
    expect(spaghettiItem).toHaveClass('completed');
  });
  
  it('should handle error states gracefully', async () => {
    const user = userEvent.setup();
    
    // Mock API error
    server.use(
      rest.post('/api/meal-plans', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error: 'Internal server error' })
        );
      })
    );
    
    renderWithProviders(<MealPlannerApp />);
    
    await user.click(screen.getByRole('button', { name: /create meal plan/i }));
    await user.type(screen.getByLabelText(/plan name/i), 'Test Plan');
    await user.click(screen.getByRole('button', { name: /create/i }));
    
    // Error message appears
    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent(/something went wrong/i);
    });
    
    // Form stays open for retry
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
  
  it('should work for unauthenticated users with limited access', async () => {
    const user = userEvent.setup();
    
    // Render without authentication
    renderWithProviders(<MealPlannerApp />, { user: null });
    
    // Should see public view
    expect(screen.getByText(/sign in to create meal plans/i)).toBeInTheDocument();
    
    // Create button disabled
    const createButton = screen.getByRole('button', { name: /create meal plan/i });
    expect(createButton).toBeDisabled();
    
    // Click sign in
    await user.click(screen.getByRole('link', { name: /sign in/i }));
    
    // Redirected to login
    expect(screen.getByRole('heading', { name: /log in/i })).toBeInTheDocument();
  });
});
```

### Common Testing Patterns

**Form Testing:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SignupForm } from './SignupForm';

describe('SignupForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SignupForm onSubmit={onSubmit} />);
    
    // Fill form
    await user.type(screen.getByLabelText(/name/i), 'John Doe');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');
    await user.type(screen.getByLabelText(/password/i), 'SecurePass123!');
    await user.type(screen.getByLabelText(/confirm password/i), 'SecurePass123!');
    
    // Check terms
    await user.click(screen.getByLabelText(/agree to terms/i));
    
    // Submit
    await user.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'SecurePass123!'
      });
    });
  });
});
```

**Async Data Loading:**
```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { UserProfile } from './UserProfile';
import * as api from '../services/api';

jest.mock('../services/api');

describe('UserProfile', () => {
  it('should display user data after loading', async () => {
    const mockUser = {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com'
    };
    
    jest.spyOn(api, 'fetchUser').mockResolvedValue(mockUser);
    
    render(<UserProfile userId="1" />);
    
    // Loading state
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
    
    // Wait for data
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
    
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
  
  it('should show error message on fetch failure', async () => {
    jest.spyOn(api, 'fetchUser').mockRejectedValue(new Error('Failed to fetch'));
    
    render(<UserProfile userId="1" />);
    
    await waitFor(() => {
      expect(screen.getByText(/error loading user/i)).toBeInTheDocument();
    });
  });
});
```

**Context and State:**
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ShoppingCart } from './ShoppingCart';
import { CartProvider } from '../contexts/CartContext';

const renderWithCart = (component: React.ReactElement) => {
  return render(
    <CartProvider>
      {component}
    </CartProvider>
  );
};

describe('ShoppingCart', () => {
  it('should add item to cart', async () => {
    const user = userEvent.setup();
    renderWithCart(<ShoppingCart />);
    
    await user.click(screen.getByRole('button', { name: /add spaghetti/i }));
    
    expect(screen.getByText('Spaghetti')).toBeInTheDocument();
    expect(screen.getByText(/1 item/i)).toBeInTheDocument();
  });
  
  it('should calculate total price', async () => {
    const user = userEvent.setup();
    renderWithCart(<ShoppingCart />);
    
    await user.click(screen.getByRole('button', { name: /add spaghetti/i })); // $2.99
    await user.click(screen.getByRole('button', { name: /add tomatoes/i })); // $3.50
    
    expect(screen.getByText(/total: \$6.49/i)).toBeInTheDocument();
  });
});
```

---

## Accessibility Testing

### Automated Accessibility Testing

**With Jest and jest-axe:**
```typescript
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { LoginForm } from './LoginForm';

expect.extend(toHaveNoViolations);

describe('LoginForm Accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<LoginForm onSubmit={jest.fn()} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
  
  it('should have proper ARIA labels', () => {
    render(<LoginForm onSubmit={jest.fn()} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    expect(emailInput).toHaveAttribute('aria-required', 'true');
    expect(emailInput).toHaveAttribute('aria-invalid', 'false');
  });
});
```

**With Cypress and cypress-axe:**
```typescript
describe('Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });
  
  it('should have no accessibility violations on home page', () => {
    cy.checkA11y();
  });
  
  it('should have no violations in navigation', () => {
    cy.checkA11y('nav');
  });
  
  it('should exclude specific rules if needed', () => {
    cy.checkA11y(null, {
      rules: {
        'color-contrast': { enabled: false } // Temporarily disable if needed
      }
    });
  });
});
```

**Manual Accessibility Tests:**
```typescript
describe('Keyboard Navigation', () => {
  it('should navigate form with Tab key', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);
    
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /log in/i });
    
    emailInput.focus();
    expect(emailInput).toHaveFocus();
    
    await user.keyboard('{Tab}');
    expect(passwordInput).toHaveFocus();
    
    await user.keyboard('{Tab}');
    expect(submitButton).toHaveFocus();
  });
  
  it('should submit form with Enter key', async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<LoginForm onSubmit={onSubmit} />);
    
    await user.type(screen.getByLabelText(/email/i), 'user@example.com');
    await user.type(screen.getByLabelText(/password/i), 'password123{Enter}');
    
    expect(onSubmit).toHaveBeenCalled();
  });
});
```

---

## CI/CD Integration

### GitHub Actions

**.github/workflows/test.yml:**
```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  unit-tests:
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
      
      - name: Run unit tests
        run: npm run test:unit -- --coverage
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
          flags: unittests
  
  e2e-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-results
          path: test-results/
          retention-days: 7
  
  accessibility-tests:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 20.x
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run Cypress accessibility tests
        run: npm run test:a11y
      
      - name: Upload Cypress screenshots
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: cypress-screenshots
          path: cypress/screenshots
```

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:unit": "jest --testPathPattern=\\.test\\.",
    "test:integration": "jest --testPathPattern=\\.integration\\.",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:cypress": "cypress run",
    "test:cypress:open": "cypress open",
    "test:a11y": "cypress run --spec 'cypress/e2e/accessibility/**/*.cy.ts'",
    "test:all": "npm run test:unit && npm run test:e2e && npm run test:a11y"
  }
}
```

---

## Framework Comparison

| Feature | Jest | Vitest | Cypress | Playwright |
|---------|------|--------|---------|------------|
| **Type** | Unit/Integration | Unit/Integration | E2E/Component | E2E/API |
| **Speed** | Fast | Very Fast | Medium | Fast |
| **Browser Testing** | jsdom | jsdom/happy-dom | Real browser | Real browsers |
| **Parallel Execution** | ✅ | ✅ | ✅ (paid) | ✅ |
| **Debugging** | Good | Excellent | Excellent | Excellent |
| **API Testing** | ❌ | ❌ | ✅ | ✅ |
| **Visual Testing** | ❌ | ❌ | ✅ | ✅ |
| **Component Testing** | ✅ | ✅ | ✅ | Limited |
| **Setup Complexity** | Low | Very Low | Medium | Medium |
| **Learning Curve** | Easy | Easy | Medium | Medium |
| **CI/CD Friendly** | ✅ | ✅ | ✅ | ✅ |
| **Cross-browser** | ❌ | ❌ | ✅ | ✅ (Chrome, Firefox, Safari) |
| **Mobile Testing** | ❌ | ❌ | ✅ | ✅ |

---

## Recommended Stack

### Small Project (Solo Developer)
- **Unit/Integration:** Vitest (fast, modern, easy setup)
- **E2E:** Cypress (great DX, visual testing)
- **Accessibility:** cypress-axe

### Medium Project (Small Team)
- **Unit/Integration:** Jest (mature, extensive ecosystem)
- **E2E:** Playwright (cross-browser, reliable)
- **Accessibility:** axe-playwright
- **Visual Regression:** Percy or Chromatic

### Large Project (Enterprise)
- **Unit/Integration:** Jest (industry standard)
- **E2E:** Playwright (scalable, multi-browser)
- **Accessibility:** axe-core + Pa11y
- **Visual Regression:** Percy or Applitools
- **Performance:** Lighthouse CI

---

## Next Steps

1. Choose framework(s) based on project needs
2. Copy relevant configuration from this guide
3. Set up CI/CD pipeline with GitHub Actions
4. Refer to TESTING_STRATEGY_TEMPLATE.md for test categories
5. Use AI_TEST_GENERATION_GUIDE.md to generate tests
6. Refer to VISUAL_EXAMPLES.md for diagrams and flow charts

---

**Version:** 1.0  
**Created:** December 2024  
**Maintained by:** ProjectPlanner Repository
