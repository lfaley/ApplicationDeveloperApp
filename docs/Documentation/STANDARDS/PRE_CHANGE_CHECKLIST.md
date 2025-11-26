# Pre-Change Verification Checklist

**Print this or keep it visible during development**

---

## ☑️ BEFORE Starting Any Development Session

- [ ] Read `STANDARDS/QUICK_REFERENCE_CHANGE_CONTROL.md` (5 minutes)
- [ ] Run baseline tests:
  ```bash
  cd MCP-SERVER/code-documentation-agent && npm test
  cd ../code-review-agent && npm test
  cd ../test-generator-agent && npm test
  ```
- [ ] Verify 100% pass rate (323/323 tests)
- [ ] Document baseline: All tests passing ✅

**If ANY tests fail:** ❌ STOP - Fix them before proceeding

---

## ☑️ BEFORE Making Each Code Change

- [ ] All tests currently passing (100%)
- [ ] I understand what I'm about to change
- [ ] I know why this change is needed
- [ ] I've identified which files will be modified

**Does this change modify or remove existing functionality?**
- [ ] NO → Proceed (but still test after!)
- [ ] YES → Complete approval section below

---

## ☑️ IF Modifying Existing Functionality

**Document the change:**
- [ ] What is changing? (specific functions/classes/modules)
- [ ] Why is it changing? (problem being solved)
- [ ] Impact analysis completed
- [ ] Which tests might be affected?

**Get approval:**
- [ ] Presented change proposal to user
- [ ] Received explicit written approval
- [ ] Approval acknowledges specific changes

---

## ☑️ IF Removing Functionality

**Document the removal:**
- [ ] What is being removed? (specific functionality)
- [ ] Why is removal necessary?
- [ ] What alternatives exist?
- [ ] What will users lose?

**Get approval with release word:**
- [ ] Presented detailed justification
- [ ] User responded with exact phrase: **"remove it"**
- [ ] Without "remove it" → DO NOT remove functionality

---

## ☑️ AFTER Making Each Change

- [ ] Run tests immediately:
  ```bash
  npm test
  ```
- [ ] All tests still passing (100%)
- [ ] Build successful:
  ```bash
  npm run build
  ```

**If tests fail:**
- [ ] Analyzed which test failed and why
- [ ] Determined if I broke functionality (if yes, roll back)
- [ ] Fixed the issue
- [ ] Re-tested until 100% passing

---

## ☑️ BEFORE Each Commit

- [ ] All tests passing (100%):
  ```bash
  npm test
  ```
- [ ] Build successful (0 errors):
  ```bash
  npm run build
  ```
- [ ] TypeScript compilation clean:
  ```bash
  npx tsc --noEmit
  ```
- [ ] No functionality removed without "remove it"
- [ ] Documentation updated (if needed)
- [ ] Commit message describes what and why

---

## ☑️ AFTER Each Commit

- [ ] Tests still pass in committed state
- [ ] Build still successful
- [ ] Ready for next change

---

## 🚫 NEVER Do These Without Approval + "remove it"

- [ ] Delete functions, methods, or classes
- [ ] Remove parameters from signatures
- [ ] Remove configuration options
- [ ] Delete test files or test cases
- [ ] Comment out working code
- [ ] Change test expectations without understanding why

---

## ✅ SAFE Changes (No Approval Needed - But Still Test!)

- [ ] Adding NEW features (not modifying existing)
- [ ] Adding NEW tests
- [ ] Fixing typos in comments
- [ ] Adding JSDoc documentation
- [ ] Refactoring (same behavior, better structure)
- [ ] Performance optimizations (preserving behavior)

**Still required:** All tests pass before AND after!

---

## 📊 Current Test Status

**Baseline** (as of November 18, 2025):
- Code Documentation Agent: 75/75 ✅
- Code Review Agent: 150/150 ✅
- Test Generator Agent: 98/98 ✅
- **TOTAL: 323/323 (100%) ✅**

**Session status:**
- Code Documentation: [ ] / 75
- Code Review: [ ] / 150
- Test Generator: [ ] / 98
- TOTAL: [ ] / 323 (____%)

**This MUST stay at 100%**

---

## 🆘 If Something Goes Wrong

**Tests failing after my change:**
```bash
git revert HEAD  # Roll back last commit
# OR fix the code to preserve functionality
npm test  # Verify tests pass
```

**Accidentally deleted code:**
```bash
git checkout HEAD -- <file>  # Restore file
npm test  # Verify restoration
```

**Unsure if change needs approval:**
- Read `STANDARDS/CODING/CHANGE_CONTROL_PROTOCOL.md`
- When in doubt, ask for approval
- Better safe than sorry

---

## 📚 Quick Reference Documents

**5-minute read:**
- `STANDARDS/QUICK_REFERENCE_CHANGE_CONTROL.md`

**Detailed protocols:**
- `STANDARDS/CODING/CHANGE_CONTROL_PROTOCOL.md`
- `STANDARDS/TESTING/REGRESSION_TESTING_GUIDE.md`

**Full standards:**
- `STANDARDS/README.md` (start here for comprehensive guide)

---

## 💡 Remember

✅ **Test constantly** - After every change  
✅ **Make small changes** - Easier to debug  
✅ **Commit frequently** - With passing tests  
✅ **Get approval** - When modifying functionality  
✅ **Use "remove it"** - Required for deletions  

❌ **Never commit failing tests**  
❌ **Never skip testing**  
❌ **Never assume it works**  
❌ **Never delete without "remove it"**  

---

**Working functionality is valuable. Protect it!**

---

**Print this checklist and keep it visible during development sessions.**
