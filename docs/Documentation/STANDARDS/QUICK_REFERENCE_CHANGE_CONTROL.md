# Quick Reference: Change Control & Testing

**⚡ BEFORE ANY CODE CHANGE - READ THIS FIRST ⚡**

---

## 🚨 Golden Rule

**NEVER remove or modify approved functionality without:**
1. Explicit written approval from user
2. The release word: **"remove it"**

---

## ✅ Pre-Change Checklist

Before touching ANY code:

```bash
# Step 1: Verify all tests pass
cd MCP-SERVER/code-documentation-agent && npm test
cd ../code-review-agent && npm test
cd ../test-generator-agent && npm test

# All must show 100% passing ✅
```

**If ANY tests fail:** ❌ STOP. Fix them first.

---

## 📝 Making Changes

### Safe Changes (No Approval Needed)
✅ Adding NEW features (doesn't modify existing)  
✅ Adding NEW tests  
✅ Fixing typos in comments  
✅ Adding JSDoc comments  
✅ Refactoring (same behavior, better structure)  
✅ Performance optimizations (preserving behavior)  

**Still required:** All tests must pass before AND after!

### Changes Requiring Approval
⚠️ Modifying existing function signatures  
⚠️ Changing API behavior  
⚠️ Updating test expectations  
⚠️ Changing configuration options  
⚠️ Breaking changes  

**Required:** Document changes, get user approval

### Changes Requiring "remove it"
❌ Deleting functions, classes, methods  
❌ Removing parameters  
❌ Removing features  
❌ Deleting tests  
❌ Commenting out code  

**Required:** Detailed justification + user responds "remove it"

---

## 🔄 Development Workflow

```bash
# 1. Before starting
npm test              # Verify 100% passing

# 2. Make ONE small change

# 3. Test immediately
npm test              # Must still be 100% passing

# 4. Repeat steps 2-3 for each change

# 5. Before committing
npm run build         # Must succeed
npm test              # Must be 100% passing
```

---

## 🧪 When Tests Fail

**Step 1: Identify the failure**
```bash
npm test -- --verbose
```

**Step 2: Analyze**
- Which test failed?
- What did I change that could affect it?
- Did I break existing functionality?

**Step 3: Fix**

**If you broke functionality:**
```bash
git revert <commit>   # Roll back
# OR fix your code to preserve behavior
```

**If test expectations are outdated:**
1. Get approval to update test
2. Document why test is changing
3. Update with clear comments

---

## 📊 Current Test Status

| Agent | Tests | Status |
|-------|-------|--------|
| Code Documentation | 75/75 | ✅ 100% |
| Code Review | 150/150 | ✅ 100% |
| Test Generator | 98/98 | ✅ 100% |
| **TOTAL** | **323/323** | **✅ 100%** |

**This must NEVER drop below 100%**

---

## 🚫 Common Mistakes to Avoid

❌ "I'll fix the tests later" → NO! Fix immediately  
❌ "Just one failing test is okay" → NO! 100% or nothing  
❌ "I'll change test expectations to match" → Get approval first  
❌ "Tests are flaky, I'll ignore them" → Fix the test, don't ignore  
❌ "This change is small, I don't need to test" → Always test  

---

## 🎯 Quick Commands

```bash
# Test specific agent
cd MCP-SERVER/code-review-agent
npm test

# Test with coverage
npm test -- --coverage

# Test specific file
npm test tests/quality.test.ts

# Watch mode (auto-run on changes)
npm test -- --watch

# Build check
npm run build
```

---

## 📚 Full Documentation

**Detailed protocols:**
- `STANDARDS/CODING/CHANGE_CONTROL_PROTOCOL.md` - Complete change control process
- `STANDARDS/TESTING/REGRESSION_TESTING_GUIDE.md` - Complete testing guide

**Read these if:**
- You're unsure if a change needs approval
- Tests are failing and you don't know why
- You need to understand the full workflow
- You're setting up automation (git hooks, CI/CD)

---

## ✅ Before Every Commit

- [ ] All tests passing (100%)
- [ ] Build successful (0 errors)
- [ ] No functionality removed without "remove it"
- [ ] Documentation updated
- [ ] Changes are approved (if required)

---

## 🆘 Emergency Contact

**If you accidentally break something:**
1. Roll back immediately: `git revert <commit>`
2. Analyze what went wrong
3. Fix properly with tests
4. Re-test before re-committing

**If tests are failing and you don't know why:**
1. Read the test failure message carefully
2. Check `STANDARDS/TESTING/REGRESSION_TESTING_GUIDE.md`
3. Ask for help with specific error details

---

**Remember: Tests passing = Functionality working**  
**Keep it at 100% at all times! ✅**
