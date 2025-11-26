# Change Control Protocol

**Version**: 1.0  
**Last Updated**: November 18, 2025  
**Status**: MANDATORY - Must be followed for ALL code changes

---

## 🚨 Core Principle

**NEVER remove or modify approved functionality without explicit written approval and the release word "remove it".**

This protocol exists because:
- Working functionality has value and took effort to create
- Users depend on existing features
- Regression bugs destroy trust and productivity
- Tests validate that functionality continues to work

---

## 📋 Pre-Change Checklist

**BEFORE making ANY code change, you MUST:**

### 1. Run All Existing Tests
```bash
npm test
```

**REQUIREMENT**: 100% of tests must pass before proceeding.

- ✅ If all tests pass → Safe to proceed to step 2
- ❌ If any test fails → **STOP**. Fix failing tests first, or understand why they're failing

### 2. Document Proposed Changes

Create a change proposal that answers:

**What is changing?**
- Which files will be modified?
- Which functions/classes/modules?
- What specific behavior is changing?

**Why is it changing?**
- What problem are we solving?
- What user request or bug report prompted this?
- What is the expected benefit?

**Impact analysis:**
- Will this affect existing functionality? (Yes/No)
- If Yes, which features are impacted?
- Are there any breaking changes? (Yes/No)
- Will existing tests need updates? (Yes/No)

### 3. Get Explicit Approval

**For modifications to existing functionality:**
- Present the change proposal to the user
- Wait for explicit written approval
- Approval must acknowledge the specific changes

**For removing existing functionality:**
- Present detailed justification for removal
- Explain what will be lost
- Explain what alternatives exist (if any)
- **REQUIREMENT**: User must respond with the release word **"remove it"**
- Without this exact phrase, removal is NOT authorized

### 4. Make Changes Incrementally

- Make ONE logical change at a time
- Run tests after EACH change
- If tests fail, fix immediately or roll back
- Commit working code frequently

### 5. Verify No Regressions

After changes:
```bash
npm test          # All tests must still pass
npm run build     # Must compile with 0 errors
```

**Post-change verification:**
- ✅ All existing tests still pass
- ✅ New tests added for new functionality
- ✅ Build successful with no errors
- ✅ No functionality removed without approval
- ✅ Documentation updated

---

## 🔒 Prohibited Actions

**WITHOUT explicit approval and release word "remove it", you MUST NOT:**

1. ❌ Delete functions, methods, or classes
2. ❌ Remove parameters from function signatures
3. ❌ Change function return types
4. ❌ Remove configuration options
5. ❌ Delete test files or test cases
6. ❌ Comment out working code
7. ❌ Remove features from documentation
8. ❌ Change public APIs without backward compatibility

---

## ✅ Allowed Without Approval

These changes are safe and don't require approval:

1. ✅ Adding NEW functionality (doesn't modify existing)
2. ✅ Adding NEW test cases
3. ✅ Fixing typos in comments/documentation
4. ✅ Adding JSDoc comments
5. ✅ Internal refactoring that doesn't change behavior
6. ✅ Performance optimizations that preserve behavior
7. ✅ Adding more detailed error messages
8. ✅ Improving code formatting/style

**HOWEVER**: Even for "allowed" changes, ALL TESTS must pass before and after.

---

## 🧪 Test-Driven Development Mandate

### Tests Are Sacred

**Tests represent approved functionality.**

Every passing test proves that:
- A specific feature works correctly
- That feature was important enough to test
- Users depend on this behavior

### Test Maintenance Rules

1. **Never delete passing tests** without approval + "remove it"
2. **Never modify test expectations** without understanding why they're changing
3. **Always run tests** before committing code
4. **Add tests for bugs** before fixing them (prove the bug exists, then prove the fix works)
5. **Keep tests passing** at 100% at all times

### When Tests Fail After Your Changes

**If you change code and tests fail:**

1. **Understand why** - Is it because:
   - Your change broke existing functionality? (BAD - roll back your change)
   - The test expectations are outdated? (Requires approval to update)
   - You found a bug in the test? (Rare - verify carefully)

2. **Do NOT "fix" tests by changing expectations** without approval
   - Changing test expectations = changing what we consider "correct"
   - This hides broken functionality

3. **Correct approach**:
   - Analyze which functionality changed
   - Document the behavior change
   - Get explicit approval to update test expectations
   - Update tests with clear comments explaining why

---

## 📊 Regression Testing

### Continuous Testing

**Every development session MUST:**

1. Start with: `npm test` → Verify all tests pass
2. During development: Run `npm test` after each change
3. End with: `npm test` → Verify all tests still pass

### Test Coverage Requirements

- **New features**: Must have tests before merging
- **Bug fixes**: Must have regression test proving bug is fixed
- **Refactoring**: All existing tests must still pass at 100%

### Automated Testing

**Future Enhancement** (once CI/CD is set up):
- Tests run automatically on every commit
- Cannot merge code if tests fail
- Test coverage reports generated automatically

---

## 🔄 Refactoring Protocol

Refactoring = Changing code structure WITHOUT changing behavior

### Safe Refactoring Process

1. **Ensure 100% test coverage** for code being refactored
2. **Run all tests** - Verify 100% pass rate (baseline)
3. **Make ONE refactoring change** (extract function, rename variable, etc.)
4. **Run all tests** - Must still be 100% pass rate
5. **Repeat** for next refactoring

### If Tests Fail During Refactoring

- **This means the refactoring changed behavior** (not just structure)
- Roll back the refactoring
- Analyze what went wrong
- Fix the refactoring approach

### Refactoring Examples

**✅ Safe refactoring** (behavior unchanged):
```typescript
// Before
function analyzeCode(code: string, options: Options) {
  const issues = [];
  // 500 lines of code
  return issues;
}

// After (extracted helper functions)
function analyzeCode(code: string, options: Options) {
  const issues = [];
  issues.push(...detectCodeSmells(code, options));
  issues.push(...checkComplexity(code, options));
  issues.push(...checkNaming(code, options));
  return issues;
}
```

**Tests should pass identically before and after.**

**❌ Unsafe change** (requires approval):
```typescript
// Before
function analyzeCode(code: string, options: Options) {
  return detectIssues(code, options);
}

// After - REMOVED functionality
function analyzeCode(code: string) {
  return detectIssues(code); // Lost options parameter!
}
```

**This breaks existing functionality and requires approval + "remove it".**

---

## 🚦 Change Approval Template

**When requesting approval for changes, use this template:**

```markdown
## Change Proposal

### What is changing?
- Files: [list files]
- Functions: [list functions being modified]
- Behavior: [describe behavior change]

### Why?
[Explain the reason for this change]

### Impact Analysis
- Affects existing functionality: [Yes/No]
- Breaking changes: [Yes/No]
- Features impacted: [list features]
- Tests requiring updates: [list test files]

### Risk Assessment
- Risk level: [Low/Medium/High]
- Rollback plan: [how to undo if needed]

### Approval Required
- [ ] Modification approval (for behavior changes)
- [ ] Removal approval + "remove it" (for deletions)
```

**Wait for explicit approval before proceeding.**

---

## 🎯 Example Scenarios

### Scenario 1: Adding a New Feature

**Situation**: Adding support for Ruby language to code review agent

**Approved Actions**:
1. ✅ Add new Ruby parser
2. ✅ Add Ruby test cases
3. ✅ Update documentation to mention Ruby support
4. ✅ Add Ruby to supported languages list

**Requirements**:
- All existing tests must still pass
- New tests for Ruby functionality
- No changes to existing language support

**Approval needed**: NO (purely additive)

---

### Scenario 2: Fixing a Bug

**Situation**: Dead code detection is not finding unreachable code after return statements

**Approved Actions**:
1. ✅ Add test case proving the bug exists (test fails)
2. ✅ Fix the detection logic
3. ✅ Verify test now passes
4. ✅ Verify all other tests still pass

**Requirements**:
- Bug is proven with failing test
- Fix makes test pass
- No other tests break

**Approval needed**: NO (bug fix that improves correctness)

---

### Scenario 3: Refactoring Large File

**Situation**: quality.ts is 820 lines and hard to maintain

**Approved Actions**:
1. ✅ Extract code-smells.ts module
2. ✅ Extract complexity.ts module
3. ✅ Extract naming.ts module
4. ✅ quality.ts becomes orchestrator

**Requirements**:
- ALL tests must pass before refactoring
- ALL tests must pass after refactoring
- Same functionality, better organization
- No behavior changes

**Approval needed**: NO (internal refactoring, behavior unchanged)

**If tests fail**: STOP and fix the refactoring

---

### Scenario 4: Changing API (REQUIRES APPROVAL)

**Situation**: Want to change `review_code` tool to use different option names

**Proposed Change**:
```typescript
// Old API
review_code(code, { checkQuality: true, checkSecurity: true })

// New API
review_code(code, { quality: true, security: true })
```

**Impact**:
- ❌ Breaking change - old option names stop working
- ❌ All existing usage examples break
- ❌ User scripts using old API break

**Requirements**:
1. Create change proposal with impact analysis
2. Get explicit approval from user
3. Implement backward compatibility if possible
4. Update all tests and documentation

**Approval needed**: YES - Breaking API change

---

### Scenario 5: Removing Feature (REQUIRES "remove it")

**Situation**: Want to remove `quick_review` tool because it's rarely used

**Impact**:
- ❌ Feature completely removed
- ❌ Any users calling `quick_review` will get errors
- ❌ Documentation mentions feature that no longer exists

**Requirements**:
1. Create detailed removal proposal
2. Explain what will be lost
3. Provide alternatives (use `review_code` with severity filter)
4. Get explicit approval with release word **"remove it"**

**Without "remove it"**: Feature MUST stay

---

## 📈 Success Metrics

**This protocol is working if:**

1. ✅ Test pass rate stays at 100%
2. ✅ No functionality disappears unexpectedly
3. ✅ All changes are intentional and approved
4. ✅ Users can trust that working features stay working
5. ✅ Rollbacks are rare (because we test before committing)

---

## 🛠️ Tools and Automation

### Current Manual Process

```bash
# Before any code changes
npm test  # Must show 100% passing

# After each change
npm test  # Must still show 100% passing

# Before committing
npm run build  # Must succeed with 0 errors
npm test       # Must show 100% passing
```

### Future Automation (Recommended)

**Git Pre-Commit Hook**:
```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Running tests before commit..."
npm test

if [ $? -ne 0 ]; then
  echo "❌ Tests failed! Commit aborted."
  echo "Fix failing tests before committing."
  exit 1
fi

echo "✅ All tests passed! Proceeding with commit."
```

**CI/CD Pipeline** (GitHub Actions, Azure DevOps, etc.):
- Run tests on every push
- Block merges if tests fail
- Generate test coverage reports
- Notify team of regressions

---

## 📞 Questions and Exceptions

### What if I need to make an emergency fix?

**Even emergency fixes must:**
1. Not break existing tests (unless fixing a bug)
2. Be documented with clear justification
3. Be followed by proper testing

**No exceptions to the "remove it" rule** - even in emergencies.

### What if tests are flaky or incorrect?

**Before changing tests:**
1. Document why the test is incorrect
2. Explain what the correct behavior should be
3. Get approval to update test expectations
4. Update test with clear comments

**Do NOT silently "fix" tests by changing expectations.**

### What if I accidentally break something?

**Immediate action:**
1. Roll back the change (git revert)
2. Analyze what went wrong
3. Fix the issue properly
4. Re-test before re-committing

**Prevention:**
- Run tests frequently during development
- Make small, incremental changes
- Commit working code often

---

## 📚 Related Documents

- `STANDARDS/TESTING/TESTING_STANDARDS.md` - Testing principles and patterns
- `STANDARDS/CODING/CODING_STANDARDS.md` - Code style and quality standards
- `STANDARDS/MCP_AGENTS/MCP_AGENT_DEVELOPMENT_STANDARDS.md` - Agent-specific guidelines

---

## 🎓 Training and Onboarding

**For Copilot agents working on this codebase:**

1. Read this document FIRST before any code changes
2. Follow the pre-change checklist for EVERY change
3. Run tests frequently (before, during, after changes)
4. Get approval for any non-additive changes
5. Remember: **Tests passing = functionality working**

**For human developers:**

1. Review this protocol before starting work
2. Set up pre-commit hooks for automatic testing
3. Communicate changes clearly in PRs
4. Never merge code with failing tests
5. Treat tests as specification of correct behavior

---

## ✅ Checklist Summary

**Before EVERY code change:**

- [ ] All tests currently passing (100%)
- [ ] Change proposal documented
- [ ] Impact analysis completed
- [ ] Approval obtained (if modifying/removing functionality)
- [ ] Release word "remove it" obtained (if removing functionality)

**During development:**

- [ ] Tests run after each change
- [ ] Changes are incremental
- [ ] Working code committed frequently

**Before committing:**

- [ ] All tests still passing (100%)
- [ ] Build successful (0 errors)
- [ ] No functionality removed without approval
- [ ] Documentation updated
- [ ] Test coverage maintained or improved

---

**END OF PROTOCOL**

*This protocol is mandatory for all code changes. Violations put project quality at risk.*
