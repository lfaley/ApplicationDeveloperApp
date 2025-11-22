# Regression Testing Guide

**Version**: 1.0  
**Last Updated**: November 18, 2025  
**Purpose**: Ensure no functionality is lost during development

---

## 🎯 What is Regression Testing?

**Regression testing** = Running existing tests to verify that:
- Previously working functionality still works
- New changes didn't break old features
- Code quality hasn't degraded

**Why it matters:**
- Working features represent value and user investment
- Breaking existing functionality destroys user trust
- Regression bugs are expensive to fix (especially if found late)
- Tests catch problems before users do

---

## 📊 Current Test Coverage Status

### Code Documentation Agent
- **Location**: `MCP-SERVER/code-documentation-agent/`
- **Test Suite**: `tests/analyze.test.ts`
- **Coverage**: 75/75 tests passing (100%)
- **Last Updated**: November 18, 2025
- **Status**: ✅ Full test coverage

**What's tested:**
- Python, TypeScript, JavaScript, Java, C# parsing
- Function, class, method extraction
- Async function detection
- Documentation generation (Markdown, JSDoc, XML Doc)
- Coverage calculation
- Batch processing
- Edge cases (empty code, syntax errors, unsupported languages)

### Code Review Agent
- **Location**: `MCP-SERVER/code-review-agent/`
- **Test Suite**: `tests/quality.test.ts`, `tests/security.test.ts`, `tests/performance.test.ts`, `tests/review.test.ts`
- **Coverage**: 150/150 tests passing (100%)
- **Last Updated**: November 18, 2025
- **Status**: ✅ Full test coverage

**What's tested:**
- Quality analysis (code smells, complexity, naming, best practices)
- Security analysis (SQL injection, XSS, secrets, command injection)
- Performance analysis (inefficient loops, memory leaks, algorithms)
- Quality scoring (0-100 scale)
- Severity filtering (critical, high, medium, low)
- Multi-language support (TypeScript, JavaScript, Python, Java, C#, Go, Rust)

### Test Generator Agent
- **Location**: `MCP-SERVER/test-generator-agent/`
- **Test Suite**: `tests/code-analyzer.test.ts`, `tests/test-generator.test.ts`
- **Coverage**: 98/98 tests passing (100%)
- **Last Updated**: November 18, 2025
- **Status**: ✅ Full test coverage

**What's tested:**
- Code analysis (function/method/class extraction)
- Test generation (Jest, Mocha, Pytest, xUnit, etc.)
- Multi-language support (TypeScript, JavaScript, Python, Java, C#, Go, Rust)
- Test types (happy path, edge cases, error handling)
- Coverage estimation
- Fixture generation

---

## 🔄 Regression Testing Workflow

### Step 1: Baseline Test Run

**Before starting ANY development work:**

```bash
cd MCP-SERVER/code-documentation-agent
npm test

cd ../code-review-agent
npm test

cd ../test-generator-agent
npm test
```

**Expected result**: 100% pass rate for all agents

**Document baseline:**
```
Code Documentation Agent: 75/75 passing ✅
Code Review Agent: 150/150 passing ✅
Test Generator Agent: 98/98 passing ✅
Total: 323/323 passing (100%) ✅
```

**If ANY tests fail at baseline:**
- ❌ DO NOT proceed with new development
- Fix failing tests FIRST
- Understand why they're failing
- Restore 100% pass rate before continuing

---

### Step 2: During Development

**After EACH code change:**

```bash
# Quick test (just the agent you're working on)
npm test

# Check for specific test failures
npm test -- --verbose
```

**Frequency**: Run tests after EVERY logical change
- After modifying a function
- After adding a new feature
- After refactoring code
- Before committing

**Response to failures:**
1. **Analyze** - Which test failed? Why?
2. **Diagnose** - Did your change break existing functionality?
3. **Fix** - Either fix your code or (with approval) update test expectations
4. **Verify** - Re-run tests until 100% passing

---

### Step 3: Pre-Commit Verification

**Before committing ANY code:**

```bash
# Run full test suite
npm test

# Check build
npm run build

# Verify no TypeScript errors
npx tsc --noEmit
```

**Commit criteria** (ALL must be true):
- ✅ All tests passing (100%)
- ✅ Build successful (0 errors)
- ✅ No lint warnings
- ✅ TypeScript compilation successful

**If ANY criterion fails:**
- ❌ DO NOT commit
- Fix the issue
- Re-test
- Commit only when all criteria met

---

### Step 4: Post-Commit Verification

**After committing code:**

```bash
# Fresh checkout test (optional but recommended)
git clone <repo-url> test-checkout
cd test-checkout/MCP-SERVER/code-documentation-agent
npm install
npm test
```

**Verifies:**
- Tests still pass in clean environment
- Dependencies are correctly specified
- No local-only configuration issues

---

## 🧪 Test Execution Commands

### Run All Tests
```bash
npm test
```

### Run Specific Test File
```bash
npm test tests/quality.test.ts
```

### Run Tests in Watch Mode
```bash
npm test -- --watch
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Run Tests Verbosely (see all output)
```bash
npm test -- --verbose
```

### Run Only Failed Tests
```bash
npm test -- --onlyFailures
```

---

## 📈 Test Pass Rate Monitoring

### Current Status

| Agent | Tests | Passing | Pass Rate | Status |
|-------|-------|---------|-----------|--------|
| Code Documentation | 75 | 75 | 100% | ✅ |
| Code Review | 150 | 150 | 100% | ✅ |
| Test Generator | 98 | 98 | 100% | ✅ |
| **TOTAL** | **323** | **323** | **100%** | ✅ |

### Historical Tracking

**Create a test log** (update after each development session):

```markdown
## Test Pass Rate History

### November 18, 2025 - Session 1
- Code Documentation: 75/75 (100%) ✅
- Code Review: 150/150 (100%) ✅
- Test Generator: 98/98 (100%) ✅
- Status: All agents at 100%, full test coverage

### [Date] - Session 2
- Code Documentation: X/75 (Y%) [status]
- Code Review: X/150 (Y%) [status]
- Test Generator: X/98 (Y%) [status]
- Changes: [describe what was modified]
- Issues: [any regressions found]
```

### Regression Alert Criteria

**🚨 ALERT if:**
- Pass rate drops below 100%
- New tests added but existing tests fail
- Tests pass locally but fail in CI/CD
- Tests become flaky (sometimes pass, sometimes fail)

**Response:**
1. Stop new development
2. Investigate failing tests
3. Fix regressions immediately
4. Document root cause
5. Add safeguards to prevent recurrence

---

## 🔍 Analyzing Test Failures

### When Tests Fail After Your Changes

**Step 1: Identify which tests failed**
```bash
npm test -- --verbose
```

Look for:
- Test file name
- Test description
- Actual vs. expected values
- Stack trace

**Step 2: Understand the failure**

**Questions to ask:**
1. What functionality does this test verify?
2. What changed in my code that could affect this?
3. Is the test expectation still correct?
4. Did I break existing functionality?

**Step 3: Classify the failure**

**Type A: Your code broke existing functionality** ❌
- **Symptom**: Test was passing, now fails after your change
- **Cause**: Your modification changed behavior
- **Fix**: Roll back your change and redesign approach

**Type B: Test expectations are outdated** ⚠️
- **Symptom**: Behavior intentionally changed (with approval)
- **Cause**: Test expects old behavior
- **Fix**: Update test expectations (with approval)

**Type C: Test has a bug** 🐛
- **Symptom**: Test fails but functionality actually works correctly
- **Cause**: Test logic error or incorrect assertion
- **Fix**: Fix the test (document why it was wrong)

**Step 4: Fix the failure**

**For Type A (broken functionality):**
```bash
git revert <commit-hash>  # Roll back breaking change
# OR
# Fix your code to preserve existing behavior
npm test  # Verify tests pass again
```

**For Type B (outdated expectations):**
1. Get approval to update test
2. Update test with clear comments
3. Verify test passes
4. Document change in commit message

**For Type C (buggy test):**
1. Understand test logic error
2. Fix test assertion/logic
3. Add comment explaining fix
4. Verify test passes

---

## 🎯 Test Quality Standards

### What Makes a Good Regression Test?

**1. Tests Real Functionality**
```typescript
// ✅ Good - Tests actual behavior
it('should detect SQL injection in string concatenation', () => {
  const code = 'query = "SELECT * FROM users WHERE id = " + userId';
  const issues = analyzeSecurity(code, 'javascript');
  expect(issues).toContainEqual(expect.objectContaining({
    type: 'SQL_INJECTION',
    severity: 'critical'
  }));
});

// ❌ Bad - Tests implementation details
it('should have a function called detectSQLInjection', () => {
  expect(typeof detectSQLInjection).toBe('function');
});
```

**2. Is Deterministic (always same result)**
```typescript
// ✅ Good - Same input always gives same output
it('should calculate complexity correctly', () => {
  const code = 'if (a) { if (b) { return c; } }';
  const complexity = calculateComplexity(code);
  expect(complexity).toBe(3);
});

// ❌ Bad - Uses random values or current date
it('should handle timestamps', () => {
  const timestamp = Date.now();  // Changes every run!
  expect(parseTimestamp(timestamp)).toBeDefined();
});
```

**3. Tests Edge Cases**
```typescript
// ✅ Good - Tests boundary conditions
it('should handle empty code', () => {
  const issues = analyzeCode('', 'javascript');
  expect(issues).toEqual([]);
});

it('should handle single line code', () => {
  const issues = analyzeCode('const x = 1;', 'javascript');
  expect(issues).toEqual([]);
});

it('should handle very long code', () => {
  const longCode = 'function test() {\n' + '  console.log();\n'.repeat(1000) + '}';
  const issues = analyzeCode(longCode, 'javascript');
  expect(issues.length).toBeGreaterThan(0);
});
```

**4. Has Clear Assertions**
```typescript
// ✅ Good - Specific, verifiable assertion
expect(issues[0]).toEqual({
  type: 'LONG_FUNCTION',
  severity: 'medium',
  line: 1,
  message: 'Function is too long (150 lines)'
});

// ❌ Bad - Vague assertion
expect(issues.length).toBeGreaterThan(0);  // Could be any issue!
```

---

## 🛠️ Maintaining Test Suites

### Adding New Tests

**When to add tests:**
- ✅ Before implementing new features (TDD)
- ✅ After finding bugs (prove bug, then fix)
- ✅ When adding edge case support
- ✅ When refactoring (preserve behavior)

**Test naming convention:**
```typescript
describe('Security Analyzer', () => {
  describe('SQL Injection Detection', () => {
    it('should detect string concatenation in SQL queries', () => {
      // Test code
    });

    it('should ignore parameterized queries', () => {
      // Test code
    });

    it('should detect template literal SQL injection', () => {
      // Test code
    });
  });
});
```

### Updating Existing Tests

**When test expectations need updating:**

1. **Document the change:**
```typescript
// Updated 2025-11-18: Changed threshold from 10 to 5 lines
// to catch more long function issues earlier
it('should detect long functions', () => {
  const code = generateLongFunction(6);  // Was 11, now 6
  const issues = analyzeQuality(code, 'javascript');
  expect(issues).toContainEqual(expect.objectContaining({
    type: 'LONG_FUNCTION'
  }));
});
```

2. **Get approval before changing expectations**
3. **Update test with clear comment explaining why**
4. **Verify all related tests still pass**

### Removing Tests

**Allowed only if:**
- Test is truly redundant (exact duplicate)
- Feature being tested was approved for removal ("remove it")
- Test is fundamentally flawed and cannot be fixed

**Process:**
1. Document why test is being removed
2. Get approval + "remove it" if removing feature test
3. Verify no loss in coverage
4. Commit with clear explanation

---

## 🚀 Automation Recommendations

### Git Pre-Commit Hook

**Install:**
```bash
# Create pre-commit hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
echo "🧪 Running tests before commit..."

cd MCP-SERVER/code-documentation-agent && npm test
if [ $? -ne 0 ]; then
  echo "❌ Code Documentation Agent tests failed!"
  exit 1
fi

cd ../code-review-agent && npm test
if [ $? -ne 0 ]; then
  echo "❌ Code Review Agent tests failed!"
  exit 1
fi

cd ../test-generator-agent && npm test
if [ $? -ne 0 ]; then
  echo "❌ Test Generator Agent tests failed!"
  exit 1
fi

echo "✅ All tests passed! Proceeding with commit."
EOF

chmod +x .git/hooks/pre-commit
```

**What it does:**
- Runs all test suites before every commit
- Blocks commit if any tests fail
- Forces developer to fix issues before committing

### CI/CD Pipeline (Future)

**GitHub Actions Example:**
```yaml
name: Regression Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Test Code Documentation Agent
        run: |
          cd MCP-SERVER/code-documentation-agent
          npm install
          npm test
      
      - name: Test Code Review Agent
        run: |
          cd MCP-SERVER/code-review-agent
          npm install
          npm test
      
      - name: Test Generator Agent
        run: |
          cd MCP-SERVER/test-generator-agent
          npm install
          npm test
      
      - name: Report Results
        if: always()
        run: echo "Test results reported to PR"
```

**Benefits:**
- Tests run automatically on every push
- Blocks PRs if tests fail
- Visible test status for all changes
- No broken code reaches main branch

---

## 📚 Related Documents

- `STANDARDS/CODING/CHANGE_CONTROL_PROTOCOL.md` - Change approval process
- `STANDARDS/TESTING/TESTING_STANDARDS.md` - General testing principles
- `STANDARDS/MCP_AGENTS/MCP_AGENT_DEVELOPMENT_STANDARDS.md` - Agent-specific guidelines

---

## ✅ Regression Testing Checklist

**Before development:**
- [ ] All tests currently passing (100%)
- [ ] Baseline test results documented

**During development:**
- [ ] Tests run after each change
- [ ] Failures investigated immediately
- [ ] No commits with failing tests

**Before committing:**
- [ ] All tests passing (100%)
- [ ] Build successful (0 errors)
- [ ] New tests added for new features
- [ ] Test coverage maintained or improved

**After committing:**
- [ ] Tests still pass in clean checkout
- [ ] CI/CD pipeline passes (when available)
- [ ] Test results logged for history

---

**END OF GUIDE**

*Regression testing protects approved functionality from accidental removal or modification.*
