# How to Use This Template for New Projects
## Step-by-Step Guide to Bootstrap Your Project with Testing & Planning Standards

**Version:** 2.0  
**Updated:** November 2024  
**Purpose:** Complete guide for using ProjectPlanner as a template for **NEW** applications

> **📝 Note:** This guide is for **starting new projects**. If you're working with an **existing project** that needs testing and documentation, see [EXISTING_PROJECT_ASSESSMENT.md](./EXISTING_PROJECT_ASSESSMENT.md) instead.

---

## Table of Contents

1. [Quick Start (5 Minutes)](#quick-start-5-minutes)
2. [Detailed Setup Guide](#detailed-setup-guide)
3. [What You Get](#what-you-get)
4. [Customization Checklist](#customization-checklist)
5. [Workflow: From Template to Production](#workflow-from-template-to-production)
6. [Example: Starting a New E-Commerce App](#example-starting-a-new-e-commerce-app)

---

## Quick Start (5 Minutes)

### Option 1: Use GitHub Template (Recommended)

1. **Make this a GitHub Template Repository** (One-time setup):
   ```bash
   # On GitHub, go to: Settings → Check "Template repository"
   ```

2. **Create New Project from Template**:
   - Go to https://github.com/lfaley/ProjectPlanner
   - Click "Use this template" → "Create a new repository"
   - Name your new repo (e.g., "my-ecommerce-app")
   - Choose public/private
   - Click "Create repository"

3. **Clone Your New Project**:
   ```powershell
   cd C:\Users\[YourUsername]\Desktop\Code\Repos
   git clone https://github.com/[YourUsername]/my-ecommerce-app.git
   cd my-ecommerce-app
   ```

4. **You're Done!** All documentation is ready to use.

### Option 2: Manual Clone & Rename

1. **Clone This Repository**:
   ```powershell
   cd C:\Users\[YourUsername]\Desktop\Code\Repos
   git clone https://github.com/lfaley/ProjectPlanner.git my-new-project
   cd my-new-project
   ```

2. **Remove Old Git History** (Start Fresh):
   ```powershell
   # Remove existing git folder
   Remove-Item -Recurse -Force .git

   # Initialize new git repository
   git init
   git add -A
   git commit -m "Initial commit: Import ProjectPlanner template"
   ```

3. **Create New GitHub Repository**:
   - Go to https://github.com/new
   - Create new repository (e.g., "my-new-project")
   - **Don't** initialize with README (you already have files)

4. **Push to Your New Repository**:
   ```powershell
   git remote add origin https://github.com/[YourUsername]/my-new-project.git
   git branch -M main
   git push -u origin main
   ```

### Option 3: Copy Just the Documentation

If you already have a project and want to add these docs:

```powershell
# In your existing project root
cd C:\path\to\your\existing\project

# Copy all .md files from ProjectPlanner
Copy-Item C:\Users\faley\Desktop\Code\Repos\ProjectPlanner\*.md .

# Commit the documentation
git add *.md
git commit -m "Add comprehensive testing and planning documentation"
git push
```

---

## Detailed Setup Guide

### Step 1: Get the Template

Choose one of the three options above. We recommend **Option 1** (GitHub Template) for the cleanest approach.

### Step 2: Review What You Have

After cloning, you'll have these documentation files:

```
your-new-project/
├── TOKEN_EFFICIENT_KICKOFF.md          # 3-minute project kickoff questionnaire
├── TESTING_STRATEGY_TEMPLATE.md        # Comprehensive testing strategy guide
├── AI_TEST_GENERATION_GUIDE.md         # AI-assisted test generation guide
├── FRAMEWORK_SPECIFIC_EXAMPLES.md      # Jest, Vitest, Cypress, Playwright examples
├── VISUAL_EXAMPLES.md                  # Test pyramid diagrams and visualizations
├── PLAN_OF_ATTACK_TEMPLATE.md          # Multi-step task breakdown framework
├── TESTING_STANDARDS.md                # Generic testing standards (NEW!)
├── HOW_TO_USE_THIS_TEMPLATE.md         # This file
└── README.md                            # Overview of all documentation
```

### Step 3: Initialize Your Project (If Starting Fresh)

If you don't have code yet, initialize your framework:

**React + Vite + TypeScript:**
```powershell
npm create vite@latest . -- --template react-ts
npm install
```

**Next.js:**
```powershell
npx create-next-app@latest . --typescript --tailwind --app
npm install
```

**Node.js + Express API:**
```powershell
npm init -y
npm install express cors dotenv
npm install -D typescript @types/node @types/express ts-node nodemon
npx tsc --init
```

**React Native:**
```powershell
npx react-native@latest init YourAppName
cd YourAppName
# Copy .md files here
```

### Step 4: Install Testing Dependencies

Based on FRAMEWORK_SPECIFIC_EXAMPLES.md, install your chosen framework:

**Option A: Jest + React Testing Library (React apps)**
```powershell
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest ts-jest
```

**Option B: Vitest (Vite apps)**
```powershell
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Option C: Cypress (E2E)**
```powershell
npm install --save-dev cypress @testing-library/cypress
npx cypress open
```

**Option D: Playwright (E2E)**
```powershell
npm init playwright@latest
```

### Step 5: Set Up Test Infrastructure

Following TESTING_STANDARDS.md, create your test utilities:

```powershell
# Create test utilities directory
New-Item -ItemType Directory -Path "tests/test-utils" -Force

# Create placeholder files (you'll fill these in from templates)
New-Item -ItemType File -Path "tests/test-utils/test-helpers.ts"
New-Item -ItemType File -Path "tests/test-utils/factories.ts"
New-Item -ItemType File -Path "tests/test-utils/service-mocks.ts"
New-Item -ItemType File -Path "tests/test-utils/browser-mocks.ts"
New-Item -ItemType File -Path "tests/test-utils/setup.ts"
```

Copy the patterns from TESTING_STANDARDS.md into these files.

### Step 6: Run the Token-Efficient Kickoff

Open TOKEN_EFFICIENT_KICKOFF.md and spend 3 minutes answering the questionnaire. This gives you:
- Test category priorities
- AI-driven test design guidance
- Token-efficient approach (52% fewer tokens than traditional)

### Step 7: Create Your Testing Strategy

Use TESTING_STRATEGY_TEMPLATE.md to create your project-specific strategy:

```powershell
# Copy template to your planning docs
Copy-Item TESTING_STRATEGY_TEMPLATE.md "docs/OUR_TESTING_STRATEGY.md"
```

Fill in the placeholders with your project details.

### Step 8: Start Building with AI Assistance

Use AI_TEST_GENERATION_GUIDE.md with your AI coding assistant:

1. Set up UI mocking infrastructure (Step 0)
2. Analyze your feature requirements (Step 1)
3. Generate tests with AI using the provided prompts
4. Review and refine the generated tests

---

## What You Get

### 📋 Planning & Strategy Documents

1. **TOKEN_EFFICIENT_KICKOFF.md** (1,075 lines)
   - 3-minute questionnaire (vs 15-minute traditional)
   - 9 focused sections covering architecture to testing
   - Token budget: ~5,500 tokens (52% savings)
   - Version tracking (v2.0, v2.1)

2. **TESTING_STRATEGY_TEMPLATE.md** (1,865 lines)
   - Test Pyramid framework
   - 6-phase implementation roadmap
   - 7 test categories with priorities
   - Risk assessment framework
   - Success metrics and KPIs

3. **PLAN_OF_ATTACK_TEMPLATE.md** (900+ lines)
   - Systematic task breakdown framework
   - 3-minute planning process
   - Complete examples with timelines
   - Scenario templates for bugs, refactoring, research

### 🧪 Testing Documentation

4. **TESTING_STANDARDS.md** (15,000+ lines) ⭐ **NEW!**
   - Generic, framework-agnostic patterns
   - Service mocking templates
   - Helper function patterns
   - Factory pattern for mock data
   - Common test scenarios
   - Anti-patterns to avoid

5. **FRAMEWORK_SPECIFIC_EXAMPLES.md** (1,800+ lines)
   - Jest configuration and examples
   - Vitest setup for modern apps
   - Cypress E2E patterns
   - Playwright multi-browser testing
   - React Testing Library patterns
   - UI mocking infrastructure
   - CI/CD integration (GitHub Actions)

6. **AI_TEST_GENERATION_GUIDE.md** (1,800+ lines)
   - 7-step test generation process
   - 40+ AI prompt templates
   - Anti-patterns and validation checklist
   - Error recovery strategies
   - Test optimization techniques

7. **VISUAL_EXAMPLES.md** (1,200+ lines)
   - Test Pyramid diagrams
   - CI/CD pipeline visualizations
   - Test coverage reports
   - Test data flow architecture
   - Performance comparison charts

### 📊 Total Value

- **18 comprehensive documents**
- **15,000+ lines of documentation**
- **Estimated creation time if doing manually**: 40-60 hours
- **Your time to adapt**: 1-2 hours
- **ROI**: Massive time savings on every new project

---

## Customization Checklist

### Required Customizations

- [ ] **Update README.md** with your project name and description
- [ ] **Replace all `[Entity]` placeholders** with your actual types (User, Product, Order, etc.)
- [ ] **Replace all `[entityKey]` placeholders** with your storage keys ('users', 'products', etc.)
- [ ] **Update factory functions** in tests/test-utils/factories.ts with your domain-specific fields
- [ ] **Customize renderApp()** helper with your app's providers (Auth, Theme, Router, etc.)
- [ ] **Update service mocks** with your actual service names and API signatures
- [ ] **Fill out TOKEN_EFFICIENT_KICKOFF.md** questionnaire for your project
- [ ] **Create docs/OUR_TESTING_STRATEGY.md** from the template
- [ ] **Update package.json** with your project details

### Optional Customizations

- [ ] Add project-specific test scenarios to TESTING_STANDARDS.md
- [ ] Create custom AI prompts for your domain in AI_TEST_GENERATION_GUIDE.md
- [ ] Add framework-specific configurations if using different tools
- [ ] Create visual diagrams specific to your architecture
- [ ] Add domain-specific validation rules and examples

### Files to Delete (Optional)

These are documentation about the template itself:
- [ ] HOW_TO_USE_THIS_TEMPLATE.md (this file - after you've used it)
- [ ] Example sections in documentation (marked with "Example:" headers)

---

## Workflow: From Template to Production

### Phase 1: Setup (Day 1)

```
1. Clone template → New repo
2. Install framework (React, Next.js, etc.)
3. Install testing dependencies
4. Create test-utils/ directory
5. Copy patterns from TESTING_STANDARDS.md
6. Customize [Entity] placeholders
```

### Phase 2: Planning (Day 1-2)

```
1. Fill out TOKEN_EFFICIENT_KICKOFF.md (3 minutes)
2. Create OUR_TESTING_STRATEGY.md from template
3. Identify 3-5 core entities in your domain
4. Create factory functions for each entity
5. Set up mock data helpers
```

### Phase 3: Foundation (Week 1)

```
1. Build core features
2. Set up UI mocking infrastructure
3. Write first unit tests using patterns
4. Create first integration tests
5. Set up CI/CD with GitHub Actions
6. Achieve 40% test coverage
```

### Phase 4: Development (Week 2-4)

```
1. Use AI_TEST_GENERATION_GUIDE.md for test generation
2. Follow simplified testing approach (focus on testable behavior)
3. Add tests as you build features
4. Reach 60-70% test coverage
5. Document custom patterns in your OUR_TESTING_STRATEGY.md
```

### Phase 5: Refinement (Week 4+)

```
1. Add E2E tests for critical paths (Cypress/Playwright)
2. Performance testing (optional)
3. Accessibility testing
4. Reach target 80% coverage
5. Production deployment
```

---

## Example: Starting a New E-Commerce App

Let's walk through a complete example:

### 1. Create Project from Template

```powershell
# Clone the template
cd C:\Users\faley\Desktop\Code\Repos
git clone https://github.com/lfaley/ProjectPlanner.git my-ecommerce-app
cd my-ecommerce-app

# Remove old git history
Remove-Item -Recurse -Force .git
git init
```

### 2. Initialize React + Vite

```powershell
# Create Vite app in current directory
npm create vite@latest . -- --template react-ts

# Install dependencies
npm install

# Install testing dependencies
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @tanstack/react-query
```

### 3. Identify Your Domain Entities

For an e-commerce app:
- **Product** (id, name, price, description, imageUrl, category, inStock)
- **User** (id, email, name, role, avatar)
- **Order** (id, userId, items, total, status, createdAt)
- **CartItem** (id, productId, quantity, price)

### 4. Create Factory Functions

**tests/test-utils/factories.ts:**
```typescript
import { Product, User, Order, CartItem } from '@/types';

// Product factory
export const createMockProduct = (overrides?: Partial<Product>): Product => ({
  id: overrides?.id || `product-${Math.random().toString(36).substr(2, 9)}`,
  name: overrides?.name || 'Mock Product',
  price: overrides?.price || 99.99,
  description: overrides?.description || 'A great product',
  imageUrl: overrides?.imageUrl || 'https://example.com/product.jpg',
  category: overrides?.category || 'electronics',
  inStock: overrides?.inStock ?? true,
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});

// User factory
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: overrides?.id || `user-${Math.random().toString(36).substr(2, 9)}`,
  email: overrides?.email || 'test@example.com',
  name: overrides?.name || 'Test User',
  role: overrides?.role || 'customer',
  avatar: overrides?.avatar || 'https://example.com/avatar.jpg',
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});

// Order factory
export const createMockOrder = (overrides?: Partial<Order>): Order => ({
  id: overrides?.id || `order-${Math.random().toString(36).substr(2, 9)}`,
  userId: overrides?.userId || 'user-123',
  items: overrides?.items || [],
  total: overrides?.total || 0,
  status: overrides?.status || 'pending',
  createdAt: overrides?.createdAt || new Date().toISOString(),
  ...overrides,
});

// Setup helpers
export const setupMockProducts = (products?: Product[]): Product[] => {
  const defaultProducts = products || [
    createMockProduct({ id: '1', name: 'Laptop', price: 999.99 }),
    createMockProduct({ id: '2', name: 'Mouse', price: 29.99 }),
    createMockProduct({ id: '3', name: 'Keyboard', price: 79.99 }),
  ];
  localStorage.setItem('products', JSON.stringify(defaultProducts));
  return defaultProducts;
};
```

### 5. Create Test Helpers

**tests/test-utils/test-helpers.ts:**
```typescript
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';

export const renderApp = (component: React.ReactElement) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, cacheTime: 0 },
      mutations: { retry: false },
    },
  });

  function AllProviders({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          {children}
        </BrowserRouter>
      </QueryClientProvider>
    );
  }

  return render(component, { wrapper: AllProviders });
};

export const waitForLoadingToFinish = async () => {
  await waitFor(() => {
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
};

export const cleanupTestData = () => {
  localStorage.clear();
  sessionStorage.clear();
  vi.clearAllMocks();
};
```

### 6. Write Your First Test

**tests/integration/products/product-list.test.tsx:**
```typescript
import { screen } from '@testing-library/react';
import { renderApp, waitForLoadingToFinish, setupMockProducts, cleanupTestData } from '../../test-utils';
import { ProductList } from '@/components/ProductList';

describe('Product List', () => {
  beforeEach(() => {
    cleanupTestData();
    setupMockProducts();
  });

  afterEach(() => {
    cleanupTestData();
  });

  it('displays all products from localStorage', async () => {
    renderApp(<ProductList />);
    await waitForLoadingToFinish();

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('Mouse')).toBeInTheDocument();
    expect(screen.getByText('Keyboard')).toBeInTheDocument();
  });

  it('filters products by search term', async () => {
    renderApp(<ProductList />);
    const user = userEvent.setup();

    await user.type(screen.getByPlaceholderText(/search/i), 'laptop');

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.queryByText('Mouse')).not.toBeInTheDocument();
  });
});
```

### 7. Run Tests

```powershell
npm test
```

### 8. Fill Out Kickoff Questionnaire

Open TOKEN_EFFICIENT_KICKOFF.md and answer:
- Project: E-Commerce Web App
- Stack: React, TypeScript, Vite, React Query, React Router
- Core entities: Product, User, Order, CartItem
- Critical user flows: Browse products, Add to cart, Checkout
- Testing priorities: User Flow Tests (1), Integration Tests (2), Unit Tests (3)

### 9. Create Testing Strategy

```powershell
Copy-Item TESTING_STRATEGY_TEMPLATE.md "docs/ECOMMERCE_TESTING_STRATEGY.md"
```

Fill in your project-specific details.

### 10. Build Features with Tests

Use AI_TEST_GENERATION_GUIDE.md to generate tests:

```
"Generate user flow tests for product browsing in my e-commerce app.

Context:
- Feature: Product catalog with search and filtering
- Framework: Vitest + React Testing Library
- Data Source: localStorage
- Primary Entities: Product, User, CartItem

[Follow the full prompt template from TOKEN_EFFICIENT_KICKOFF.md]
```

### 11. Set Up CI/CD

Copy GitHub Actions workflow from FRAMEWORK_SPECIFIC_EXAMPLES.md:

```powershell
New-Item -ItemType Directory -Path ".github/workflows" -Force
New-Item -ItemType File -Path ".github/workflows/test.yml"
```

Paste the CI configuration from the examples.

### 12. Push to GitHub

```powershell
git add -A
git commit -m "Initial commit: E-commerce app with comprehensive testing"
git remote add origin https://github.com/[YourUsername]/my-ecommerce-app.git
git push -u origin main
```

---

## Tips for Success

### Do's ✅

- **Start with the TOKEN_EFFICIENT_KICKOFF.md** - 3 minutes saves hours later
- **Use TESTING_STANDARDS.md patterns** consistently across all tests
- **Customize factories early** - they're used everywhere
- **Follow simplified testing approach** - focus on testable behavior
- **Use AI_TEST_GENERATION_GUIDE.md prompts** - let AI do the heavy lifting
- **Keep documentation updated** - when you find better patterns, document them
- **Share with your team** - consistent testing across all developers

### Don'ts ❌

- **Don't skip the customization checklist** - generic placeholders will confuse you later
- **Don't test implementation details** - follow the anti-patterns guide
- **Don't over-mock** - use real components, mock external dependencies only
- **Don't write tests without helpers** - use the factory/helper patterns
- **Don't ignore the Test Pyramid** - balance unit/integration/E2E tests
- **Don't copy-paste without understanding** - read the documentation first

---

## Troubleshooting

### "I don't know what my entities are yet"

Start with generic placeholders:
- `Entity` → Rename later when your domain becomes clear
- `Item` → Common generic name
- `Record` → For data-heavy apps

You can search and replace across all files later:
```powershell
# Replace [Entity] with Product across all files
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '\[Entity\]', 'Product' | Set-Content $_.FullName
}
```

### "My app uses different state management"

Customize `setupMockData()` and `renderApp()` for your state:

**Redux:**
```typescript
export const renderApp = (component, { preloadedState } = {}) => {
  const store = setupStore(preloadedState);
  return render(
    <Provider store={store}>{component}</Provider>
  );
};
```

**Zustand:**
```typescript
beforeEach(() => {
  useStore.setState({ items: mockItems });
});
```

### "Tests are slow"

Follow TESTING_STANDARDS.md guidelines:
- Mock all external services
- Don't make real API calls
- Use fake timers
- Disable animations in tests
- Target: <100ms for unit, <1s for integration

### "I'm overwhelmed by all the documentation"

Start minimal:
1. Read TESTING_STANDARDS.md (the generic guide)
2. Fill out TOKEN_EFFICIENT_KICKOFF.md (3 minutes)
3. Copy helper patterns from TESTING_STANDARDS.md
4. Write your first test
5. Explore other docs as needed

---

## Quick Reference Commands

### Creating New Project

```powershell
# Clone and setup
git clone https://github.com/lfaley/ProjectPlanner.git my-new-app
cd my-new-app
Remove-Item -Recurse -Force .git
git init

# Initialize framework (choose one)
npm create vite@latest . -- --template react-ts
# OR
npx create-next-app@latest . --typescript

# Install testing
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# Create test structure
New-Item -ItemType Directory -Path "tests/test-utils" -Force
New-Item -ItemType Directory -Path "tests/integration" -Force
New-Item -ItemType Directory -Path "tests/unit" -Force

# Push to GitHub
git remote add origin https://github.com/[YOU]/my-new-app.git
git add -A
git commit -m "Initial commit from ProjectPlanner template"
git push -u origin main
```

### Running Tests

```powershell
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm test -- --coverage

# Specific file
npm test -- product-list.test
```

### Search and Replace

```powershell
# Replace [Entity] with your type across all TypeScript files
Get-ChildItem -Recurse -Include *.ts,*.tsx | ForEach-Object {
    (Get-Content $_.FullName) -replace '\[Entity\]', 'YourType' | Set-Content $_.FullName
}
```

---

## Next Steps

After setting up your project with this template:

1. ⭐ **Star this repository** on GitHub for future reference
2. 📖 **Read TESTING_STANDARDS.md** - your primary reference
3. ✍️ **Fill out TOKEN_EFFICIENT_KICKOFF.md** - guides your testing strategy
4. 🏗️ **Build your first feature** with tests
5. 🤖 **Use AI_TEST_GENERATION_GUIDE.md** to accelerate test writing
6. 📊 **Monitor test coverage** and aim for 80%+
7. 🚀 **Deploy with confidence** knowing you have comprehensive tests

---

## Support & Updates

- **Issues**: If you find problems with the template, open an issue on the [ProjectPlanner GitHub repo](https://github.com/lfaley/ProjectPlanner/issues)
- **Updates**: Watch the repo for updates and new patterns
- **Contributions**: Submit PRs with improvements or new patterns you discover

---

## Summary

This template gives you **15,000+ lines of battle-tested documentation** that would take 40-60 hours to create from scratch. In 1-2 hours, you can:

1. Clone/template this repo
2. Customize for your domain
3. Start building with comprehensive testing standards
4. Use AI to accelerate test generation
5. Deploy with confidence

**The best part?** These patterns are generic and reusable across **every future project** you build. One-time setup, lifetime of productivity gains.

Happy building! 🚀
